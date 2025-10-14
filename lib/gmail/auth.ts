import { google } from 'googleapis';
import { db } from '../db/drizzle';
import { gmailConnections } from '../db/schema';
import { encrypt, decrypt } from '../utils/encryption';
import { eq, and } from 'drizzle-orm';

// OAuth2 Client Configuration
export function getOAuth2Client() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error('Missing Google OAuth credentials in environment variables');
  }

  return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
}

// Gmail API Scopes
export const GMAIL_SCOPES = [
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
];

/**
 * Generate authorization URL for Gmail OAuth
 */
export function getAuthorizationUrl(state?: string): string {
  const oauth2Client = getOAuth2Client();

  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: GMAIL_SCOPES,
    prompt: 'consent', // Force consent screen to get refresh token
    state: state || '', // Can be used to pass userId/teamId
  });
}

/**
 * Exchange authorization code for tokens
 */
export async function exchangeCodeForTokens(code: string) {
  const oauth2Client = getOAuth2Client();

  const { tokens } = await oauth2Client.getToken(code);
  return tokens;
}

/**
 * Save Gmail connection to database
 */
export async function saveGmailConnection({
  userId,
  teamId,
  email,
  refreshToken,
  accessToken,
  expiryDate,
}: {
  userId: number;
  teamId: number;
  email: string;
  refreshToken: string;
  accessToken?: string | null;
  expiryDate?: number | null;
}) {
  const encryptedRefreshToken = encrypt(refreshToken);
  const encryptedAccessToken = accessToken ? encrypt(accessToken) : null;

  // Check if connection already exists
  const existing = await db
    .select()
    .from(gmailConnections)
    .where(
      and(
        eq(gmailConnections.userId, userId),
        eq(gmailConnections.teamId, teamId),
        eq(gmailConnections.email, email)
      )
    )
    .limit(1);

  if (existing.length > 0) {
    // Update existing connection
    await db
      .update(gmailConnections)
      .set({
        refreshToken: encryptedRefreshToken,
        accessToken: encryptedAccessToken,
        tokenExpiry: expiryDate ? new Date(expiryDate) : null,
        isActive: true,
        updatedAt: new Date(),
      })
      .where(eq(gmailConnections.id, existing[0].id));

    return existing[0].id;
  } else {
    // Insert new connection
    const [connection] = await db
      .insert(gmailConnections)
      .values({
        userId,
        teamId,
        email,
        refreshToken: encryptedRefreshToken,
        accessToken: encryptedAccessToken,
        tokenExpiry: expiryDate ? new Date(expiryDate) : null,
        isActive: true,
      })
      .returning();

    return connection.id;
  }
}

/**
 * Get Gmail connection for user
 */
export async function getGmailConnection(userId: number, teamId: number) {
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

  return {
    ...connection,
    refreshToken: decrypt(connection.refreshToken),
    accessToken: connection.accessToken ? decrypt(connection.accessToken) : null,
  };
}

/**
 * Get authenticated Gmail client
 */
export async function getAuthenticatedGmailClient(userId: number, teamId: number) {
  const connection = await getGmailConnection(userId, teamId);

  if (!connection) {
    throw new Error('No Gmail connection found for this user');
  }

  const oauth2Client = getOAuth2Client();

  oauth2Client.setCredentials({
    refresh_token: connection.refreshToken,
    access_token: connection.accessToken || undefined,
    expiry_date: connection.tokenExpiry?.getTime(),
  });

  // Refresh token if needed
  const tokenInfo = await oauth2Client.getAccessToken();

  // Update access token in database if it was refreshed
  if (tokenInfo.token && tokenInfo.token !== connection.accessToken) {
    await db
      .update(gmailConnections)
      .set({
        accessToken: encrypt(tokenInfo.token),
        tokenExpiry: tokenInfo.res?.data.expiry_date
          ? new Date(tokenInfo.res.data.expiry_date)
          : null,
        updatedAt: new Date(),
      })
      .where(eq(gmailConnections.id, connection.id));
  }

  return google.gmail({ version: 'v1', auth: oauth2Client });
}

/**
 * Get user email from access token
 */
export async function getUserEmail(accessToken: string): Promise<string> {
  const oauth2Client = getOAuth2Client();
  oauth2Client.setCredentials({ access_token: accessToken });

  const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
  const { data } = await oauth2.userinfo.get();

  return data.email || '';
}

/**
 * Revoke Gmail connection
 */
export async function revokeGmailConnection(userId: number, teamId: number) {
  const connection = await getGmailConnection(userId, teamId);

  if (!connection) {
    throw new Error('No Gmail connection found');
  }

  // Revoke token with Google
  const oauth2Client = getOAuth2Client();
  oauth2Client.setCredentials({ access_token: connection.accessToken || undefined });

  try {
    await oauth2Client.revokeCredentials();
  } catch (error) {
    console.error('Error revoking credentials:', error);
  }

  // Mark as inactive in database
  await db
    .update(gmailConnections)
    .set({ isActive: false, updatedAt: new Date() })
    .where(eq(gmailConnections.id, connection.id));
}
