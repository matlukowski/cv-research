import { gmail_v1 } from 'googleapis';
import { getAuthenticatedGmailClient } from './auth';
import { db } from '../db/drizzle';
import { cvs } from '../db/schema';
import { eq } from 'drizzle-orm';
import { saveFile } from '../storage/file-storage';
import {
  buildCVSearchQuery,
  isCVCandidate,
  extractEmailBody,
} from './cv-filters';

export interface SyncOptions {
  maxResults?: number;
  query?: string;
  includeSpamTrash?: boolean;
  useSmartFiltering?: boolean; // New: enable intelligent CV filtering
  filterThreshold?: number; // New: minimum score threshold (default: 30)
  syncFromDate?: Date; // Filter emails from this date (inclusive)
}

export interface SyncResult {
  totalMessages: number;
  pdfAttachments: number;
  newCVs: number;
  filteredOut: number; // New: number of PDFs filtered out by smart filtering
  errors: string[];
}

/**
 * Sync emails from Gmail and extract CV attachments
 */
export async function syncGmailCVs(
  userId: number,
  teamId: number,
  options: SyncOptions = {}
): Promise<SyncResult> {
  const {
    maxResults = 50,
    query = buildCVSearchQuery(options.syncFromDate), // Use intelligent CV query with optional date filter
    includeSpamTrash = false,
    useSmartFiltering = true, // Enable smart filtering by default
    filterThreshold = 10, // Low threshold: only block blacklisted files
    syncFromDate,
  } = options;

  const result: SyncResult = {
    totalMessages: 0,
    pdfAttachments: 0,
    newCVs: 0,
    filteredOut: 0,
    errors: [],
  };

  try {
    // Get authenticated Gmail client
    const gmail = await getAuthenticatedGmailClient(userId, teamId);

    // List messages with PDF attachments
    const response = await gmail.users.messages.list({
      userId: 'me',
      q: query,
      maxResults,
      includeSpamTrash,
    });

    const messages = response.data.messages || [];
    result.totalMessages = messages.length;

    // Process each message
    for (const message of messages) {
      try {
        await processMessage(
          gmail,
          message.id!,
          userId,
          teamId,
          result,
          useSmartFiltering,
          filterThreshold
        );
      } catch (error) {
        console.error(`Error processing message ${message.id}:`, error);
        result.errors.push(`Message ${message.id}: ${error}`);
      }
    }

    // Update last sync time
    await updateLastSyncTime(userId, teamId);

    return result;
  } catch (error) {
    console.error('Error syncing Gmail:', error);
    result.errors.push(`Gmail sync error: ${error}`);
    return result;
  }
}

/**
 * Process a single Gmail message
 */
async function processMessage(
  gmail: gmail_v1.Gmail,
  messageId: string,
  userId: number,
  teamId: number,
  result: SyncResult,
  useSmartFiltering: boolean = true,
  filterThreshold: number = 30
): Promise<void> {
  // Check if message already processed
  const existing = await db
    .select()
    .from(cvs)
    .where(eq(cvs.gmailMessageId, messageId))
    .limit(1);

  if (existing.length > 0) {
    return; // Already processed
  }

  // Get full message with attachments
  const message = await gmail.users.messages.get({
    userId: 'me',
    id: messageId,
    format: 'full',
  });

  const payload = message.data.payload;
  const headers = payload?.headers || [];

  // Extract email metadata
  const subject = headers.find((h) => h.name?.toLowerCase() === 'subject')?.value || '';
  const from = headers.find((h) => h.name?.toLowerCase() === 'from')?.value || '';
  const dateStr = headers.find((h) => h.name?.toLowerCase() === 'date')?.value;
  const emailDate = dateStr ? new Date(dateStr) : new Date();

  // Extract email body for smart filtering
  const emailBody = useSmartFiltering ? extractEmailBody(payload) : '';

  // Find PDF attachments
  const attachments = findAttachments(payload);
  const pdfAttachments = attachments.filter(
    (att) =>
      att.mimeType === 'application/pdf' ||
      att.filename?.toLowerCase().endsWith('.pdf')
  );

  result.pdfAttachments += pdfAttachments.length;

  // Process each PDF attachment
  for (const attachment of pdfAttachments) {
    try {
      // === PRE-FILTERING: Check if this attachment is likely a CV ===
      if (useSmartFiltering) {
        const candidateScore = isCVCandidate(
          subject,
          from,
          attachment.filename || 'unknown.pdf',
          undefined, // File size not available yet (would need to download first)
          emailBody
        );

        // Log filtering decision
        console.log(
          `[CV Filter] ${attachment.filename} - Score: ${candidateScore.score}/100`
        );
        console.log(`[CV Filter] Reasons:\n${candidateScore.reasons.join('\n')}`);

        // Skip if score is below threshold
        if (!candidateScore.shouldDownload || candidateScore.score < filterThreshold) {
          result.filteredOut++;
          console.log(
            `[CV Filter] ❌ SKIPPED: ${attachment.filename} (score: ${candidateScore.score})`
          );
          continue; // Skip this attachment
        }

        console.log(
          `[CV Filter] ✅ DOWNLOADING: ${attachment.filename} (score: ${candidateScore.score})`
        );
      }

      // Download attachment (only if passed filtering)
      const attachmentData = await gmail.users.messages.attachments.get({
        userId: 'me',
        messageId: messageId,
        id: attachment.attachmentId,
      });

      if (!attachmentData.data.data) {
        continue;
      }

      // Decode base64 data
      const buffer = Buffer.from(attachmentData.data.data, 'base64url');

      // Save file to storage
      const fileUrl = await saveFile(buffer, attachment.filename || 'cv.pdf', teamId);

      // Save to database (status: pending for AI processing)
      const [savedCV] = await db.insert(cvs).values({
        teamId,
        fileName: attachment.filename || 'cv.pdf',
        fileUrl,
        fileSize: buffer.length,
        mimeType: attachment.mimeType || 'application/pdf',
        emailSubject: subject,
        emailFrom: from,
        emailDate,
        gmailMessageId: messageId,
        status: 'pending', // Will be processed by AI later
      }).returning();

      // Detect job position from email content
      try {
        const { detectJobPosition } = await import('../ai/job-detector');
        const { createApplication } = await import('../applications/application-manager');

        const detection = await detectJobPosition(teamId, subject, emailBody);

        console.log(`[Job Detection] CV: ${attachment.filename}`);
        console.log(`[Job Detection] Position ID: ${detection.jobPositionId || 'None (spontaneous)'}`);
        console.log(`[Job Detection] Confidence: ${detection.confidence}%`);
        console.log(`[Job Detection] Reason: ${detection.reason}`);

        // Create application record
        await createApplication(
          savedCV.id,
          detection.jobPositionId,
          detection.applicationType
        );
      } catch (error) {
        console.error(`Error detecting job position or creating application:`, error);
        // Don't fail the whole process if job detection fails
        // Just create a spontaneous application as fallback
        try {
          const { createApplication } = await import('../applications/application-manager');
          await createApplication(savedCV.id, null, 'spontaneous');
        } catch (fallbackError) {
          console.error(`Error creating fallback spontaneous application:`, fallbackError);
        }
      }

      result.newCVs++;
    } catch (error) {
      console.error(`Error processing attachment ${attachment.filename}:`, error);
      result.errors.push(`Attachment ${attachment.filename}: ${error}`);
    }
  }
}

/**
 * Find all attachments in email payload
 */
function findAttachments(
  part: gmail_v1.Schema$MessagePart | undefined,
  attachments: Array<{
    filename: string;
    mimeType: string;
    attachmentId: string;
  }> = []
): Array<{ filename: string; mimeType: string; attachmentId: string }> {
  if (!part) return attachments;

  if (part.filename && part.body?.attachmentId) {
    attachments.push({
      filename: part.filename,
      mimeType: part.mimeType || '',
      attachmentId: part.body.attachmentId,
    });
  }

  // Recursively check parts
  if (part.parts) {
    for (const subPart of part.parts) {
      findAttachments(subPart, attachments);
    }
  }

  return attachments;
}

/**
 * Update last sync time in database
 */
async function updateLastSyncTime(userId: number, teamId: number): Promise<void> {
  const { gmailConnections } = await import('../db/schema');
  const { and } = await import('drizzle-orm');

  await db
    .update(gmailConnections)
    .set({ lastSyncAt: new Date() })
    .where(
      and(
        eq(gmailConnections.userId, userId),
        eq(gmailConnections.teamId, teamId),
        eq(gmailConnections.isActive, true)
      )
    );
}

/**
 * Get sync status for user
 */
export async function getSyncStatus(userId: number, teamId: number) {
  const { gmailConnections } = await import('../db/schema');
  const { and } = await import('drizzle-orm');

  const connections = await db
    .select()
    .from(gmailConnections)
    .where(
      and(
        eq(gmailConnections.userId, userId),
        eq(gmailConnections.teamId, teamId),
        eq(gmailConnections.isActive, true)
      )
    )
    .limit(1);

  if (connections.length === 0) {
    return null;
  }

  const connection = connections[0];

  // Count CVs
  const allCVs = await db.select().from(cvs).where(eq(cvs.teamId, teamId));
  const pendingCVs = allCVs.filter((cv) => cv.status === 'pending');
  const processedCVs = allCVs.filter((cv) => cv.status === 'processed');

  return {
    connected: true,
    email: connection.email,
    lastSyncAt: connection.lastSyncAt,
    syncFromDate: connection.syncFromDate,
    totalCVs: allCVs.length,
    pendingCVs: pendingCVs.length,
    processedCVs: processedCVs.length,
  };
}
