import { gmail_v1 } from 'googleapis';

/**
 * Multi-language keywords for CV detection
 */
export const CV_KEYWORDS = {
  // File name keywords (in filename)
  filename: [
    'cv',
    'resume',
    'curriculum',
    'zyciorys',
    'życiorys',
    'aplikacja',
    'application',
    'lebenslauf',
    'bewerbung',
    'candidate',
    'kandydat',
  ],

  // Subject keywords (in email subject)
  subject: [
    'cv',
    'resume',
    'aplikacja',
    'rekrutacja',
    'stanowisko',
    'oferta pracy',
    'application',
    'job',
    'position',
    'vacancy',
    'career',
    'lebenslauf',
    'bewerbung',
    'stelle',
    'kandidatur',
  ],

  // Body keywords (in email body)
  body: [
    'w załączeniu cv',
    'w załączniku cv',
    'załączam cv',
    'moje cv',
    'aplikuję na stanowisko',
    'zainteresowany ofertą',
    'aplikacja na',
    'attached resume',
    'my resume',
    'my cv',
    'applying for',
    'interested in the position',
    'job application',
    'i am applying',
    'bewerbung für',
    'meine bewerbung',
  ],
};

/**
 * Blacklist patterns for filtering out non-CV emails
 */
export const BLACKLIST = {
  // Sender domains/emails to exclude
  senders: [
    'noreply@',
    'no-reply@',
    'invoice@',
    'billing@',
    'finance@',
    'newsletter@',
    'marketing@',
    'notifications@',
    'support@',
    'automated@',
    'donotreply@',
  ],

  // Filename patterns to exclude
  filenames: [
    'invoice',
    'faktura',
    'rachunek',
    'bill',
    'receipt',
    'paragon',
    'report',
    'raport',
    'contract',
    'umowa',
    'agreement',
    'statement',
    'wyciąg',
    'ticket',
    'bilet',
    'confirmation',
    'potwierdzenie',
    'order',
    'zamówienie',
  ],

  // Subject patterns to exclude (strong indicators of non-CV)
  subjects: [
    'invoice',
    'faktura',
    'payment',
    'płatność',
    'receipt',
    'paragon',
    'newsletter',
    'subscription',
    'notification',
    'reminder',
    'przypomnienie',
  ],
};

/**
 * File size constraints for CV PDFs
 */
export const FILE_SIZE_CONSTRAINTS = {
  MIN_SIZE: 50 * 1024, // 50 KB
  MAX_SIZE: 10 * 1024 * 1024, // 10 MB
};

/**
 * Format date for Gmail API query (YYYY/MM/DD)
 */
function formatDateForGmail(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}/${month}/${day}`;
}

/**
 * Build an intelligent Gmail search query for CV emails
 * This is used as the first filtering layer
 * @param afterDate - Optional date to filter emails from (inclusive)
 */
export function buildCVSearchQuery(afterDate?: Date): string {
  const filenameTerms = CV_KEYWORDS.filename.map((kw) => `filename:${kw}`).join(' OR ');
  const subjectTerms = CV_KEYWORDS.subject.map((kw) => `"${kw}"`).join(' OR ');

  let query = `has:attachment filename:pdf (${filenameTerms} OR subject:(${subjectTerms}))`;

  // Add date filter if provided
  if (afterDate) {
    query = `after:${formatDateForGmail(afterDate)} ${query}`;
  }

  return query;
}

/**
 * Extract plain text body from Gmail message
 */
export function extractEmailBody(
  payload: gmail_v1.Schema$MessagePart | undefined
): string {
  if (!payload) return '';

  let body = '';

  // Check if this part has body data
  if (payload.body?.data) {
    try {
      const decoded = Buffer.from(payload.body.data, 'base64').toString('utf-8');
      body += decoded;
    } catch (error) {
      console.error('Error decoding email body:', error);
    }
  }

  // Recursively check parts
  if (payload.parts) {
    for (const part of payload.parts) {
      // Prioritize text/plain, but also accept text/html
      if (part.mimeType === 'text/plain' || part.mimeType === 'text/html') {
        body += extractEmailBody(part);
      }
    }
  }

  return body;
}

/**
 * Check if filename matches name pattern: "FirstName LastName.pdf" or "LastName_FirstName.pdf"
 * This heuristic helps catch CVs that don't have "CV" in the filename
 */
function matchesNamePattern(filename: string): boolean {
  // Remove .pdf extension
  const name = filename.toLowerCase().replace(/\.pdf$/i, '');

  // Pattern 1: Two capitalized words separated by space, underscore, or dash
  // Example: "John Doe.pdf", "John_Doe.pdf", "John-Doe.pdf"
  const namePattern1 = /^[A-ZĆŁŃÓŚŹŻ][a-ząćęłńóśźż]+[\s_-][A-ZĆŁŃÓŚŹŻ][a-ząćęłńóśźż]+$/;

  // Pattern 2: Two or more words, each starting with capital letter
  // Example: "Jan Kowalski CV.pdf", "Maria Nowak Resume.pdf"
  const namePattern2 = /^([A-ZĆŁŃÓŚŹŻ][a-ząćęłńóśźż]+[\s_-]){1,3}[A-ZĆŁŃÓŚŹŻ][a-ząćęłńóśźż]+/;

  // Check original filename (not lowercased) against patterns
  const originalName = filename.replace(/\.pdf$/i, '');

  return namePattern1.test(originalName) || namePattern2.test(originalName);
}

/**
 * Score an email as a CV candidate (0-100)
 * SIMPLIFIED VERSION: Focus on blacklists, not scoring quality
 * Philosophy: "Better to download 5 false positives than miss 1 real CV"
 */
export interface CVCandidateScore {
  score: number;
  reasons: string[];
  shouldDownload: boolean;
}

export function isCVCandidate(
  subject: string,
  sender: string,
  filename: string,
  fileSize?: number,
  emailBody?: string
): CVCandidateScore {
  const reasons: string[] = [];

  const subjectLower = subject.toLowerCase();
  const senderLower = sender.toLowerCase();
  const filenameLower = filename.toLowerCase();

  // === BLACKLIST CHECKS (immediate rejection) ===
  // Only reject obvious non-CV files (invoices, newsletters, etc.)

  // Check sender blacklist
  for (const blacklisted of BLACKLIST.senders) {
    if (senderLower.includes(blacklisted)) {
      reasons.push(`❌ Blacklisted sender: ${blacklisted}`);
      reasons.push('\n🚫 REJECTED - Automated/system email');
      return { score: 0, reasons, shouldDownload: false };
    }
  }

  // Check filename blacklist (invoices, reports, etc.)
  for (const blacklisted of BLACKLIST.filenames) {
    if (filenameLower.includes(blacklisted)) {
      reasons.push(`❌ Blacklisted filename: ${blacklisted}`);
      reasons.push('\n🚫 REJECTED - Not a CV (invoice/report/etc.)');
      return { score: 0, reasons, shouldDownload: false };
    }
  }

  // Check subject blacklist for strong non-CV indicators
  for (const blacklisted of BLACKLIST.subjects) {
    if (subjectLower.includes(blacklisted)) {
      reasons.push(`❌ Blacklisted subject: ${blacklisted}`);
      reasons.push('\n🚫 REJECTED - Not a CV (invoice/newsletter/etc.)');
      return { score: 0, reasons, shouldDownload: false };
    }
  }

  // === POSITIVE SIGNALS (simplified) ===
  // If it passed blacklists, check for CV indicators

  let score = 50; // Default: give it a chance (AI will verify)
  let hasStrongCVSignal = false;

  // Check filename for CV keywords (strongest signal)
  const filenameMatches = CV_KEYWORDS.filename.filter((kw) =>
    filenameLower.includes(kw)
  );

  if (filenameMatches.length > 0) {
    score = 100; // Auto-accept if filename has "cv" or "resume"
    hasStrongCVSignal = true;
    reasons.push(`✅ STRONG: CV keyword in filename: ${filenameMatches.join(', ')}`);
  }

  // Check subject for CV keywords
  const subjectMatches = CV_KEYWORDS.subject.filter((kw) =>
    subjectLower.includes(kw)
  );

  if (subjectMatches.length > 0) {
    if (!hasStrongCVSignal) {
      score = 80; // Strong signal if in subject
      hasStrongCVSignal = true;
    }
    reasons.push(`✅ CV keyword in subject: ${subjectMatches.join(', ')}`);
  }

  // Check for name pattern (FirstName LastName.pdf)
  if (matchesNamePattern(filename)) {
    if (!hasStrongCVSignal) {
      score = 70; // Likely a CV
    }
    reasons.push(`✅ Filename matches name pattern (e.g. "Jan_Kowalski.pdf")`);
  }

  // === DECISION ===
  // Note: Threshold will be applied externally (default: 10)
  // Almost everything passes unless blacklisted

  if (hasStrongCVSignal) {
    reasons.push(`\n✅ Score: ${score} - DOWNLOADING (strong CV signal)`);
  } else {
    reasons.push(`\n✅ Score: ${score} - DOWNLOADING (no blacklist, let AI verify)`);
  }

  return {
    score,
    reasons,
    shouldDownload: true, // Always true if passed blacklists
  };
}

/**
 * Helper: Check if a string contains any of the keywords
 */
function containsAny(text: string, keywords: string[]): boolean {
  const textLower = text.toLowerCase();
  return keywords.some((kw) => textLower.includes(kw));
}
