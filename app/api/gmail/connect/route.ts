import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getAuthorizationUrl } from '@/lib/gmail/auth';

/**
 * GET /api/gmail/connect
 * Initiates Gmail OAuth flow
 */
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Create state parameter with userId (to identify user in callback)
    const state = Buffer.from(
      JSON.stringify({
        userId,
        returnUrl: request.nextUrl.searchParams.get('returnUrl') || '/dashboard/cvs',
      })
    ).toString('base64');

    // Get authorization URL
    const authUrl = getAuthorizationUrl(state);

    return NextResponse.json({ authUrl });
  } catch (error) {
    console.error('Error initiating Gmail OAuth:', error);
    return NextResponse.json(
      { error: 'Failed to initiate Gmail connection' },
      { status: 500 }
    );
  }
}
