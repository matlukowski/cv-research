import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import {
  exchangeCodeForTokens,
  saveGmailConnection,
  getUserEmail,
} from '@/lib/gmail/auth';
import { getUser, getTeamForUser } from '@/lib/db/queries';

/**
 * GET /api/gmail/callback
 * Handles OAuth callback from Google
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    // Handle OAuth error
    if (error) {
      console.error('Gmail OAuth error:', error);
      return NextResponse.redirect(
        new URL(`/dashboard/cvs?error=${encodeURIComponent(error)}`, request.url)
      );
    }

    // Validate code
    if (!code) {
      return NextResponse.redirect(
        new URL('/dashboard/cvs?error=missing_code', request.url)
      );
    }

    // Parse state
    let parsedState: { userId: string; returnUrl: string };
    try {
      parsedState = JSON.parse(Buffer.from(state || '', 'base64').toString());
    } catch {
      return NextResponse.redirect(
        new URL('/dashboard/cvs?error=invalid_state', request.url)
      );
    }

    // Verify user is authenticated
    const { userId: currentUserId } = await auth();
    if (!currentUserId || currentUserId !== parsedState.userId) {
      return NextResponse.redirect(
        new URL('/dashboard/cvs?error=unauthorized', request.url)
      );
    }

    // Exchange code for tokens
    const tokens = await exchangeCodeForTokens(code);

    if (!tokens.refresh_token) {
      return NextResponse.redirect(
        new URL('/dashboard/cvs?error=no_refresh_token', request.url)
      );
    }

    // Get user email from Google
    const email = await getUserEmail(tokens.access_token!);

    // Get or create database user from Clerk session
    const dbUser = await getUser();
    if (!dbUser) {
      return NextResponse.redirect(
        new URL('/dashboard/cvs?error=user_not_found', request.url)
      );
    }

    // Get or create team for user
    const team = await getTeamForUser();
    if (!team) {
      return NextResponse.redirect(
        new URL('/dashboard/cvs?error=team_not_found', request.url)
      );
    }

    // Save connection to database
    await saveGmailConnection({
      userId: dbUser.id,
      teamId: team.id,
      email,
      refreshToken: tokens.refresh_token,
      accessToken: tokens.access_token || null,
      expiryDate: tokens.expiry_date || null,
    });

    // Redirect to success page
    const returnUrl = parsedState.returnUrl || '/dashboard/cvs';
    return NextResponse.redirect(
      new URL(`${returnUrl}?success=gmail_connected`, request.url)
    );
  } catch (error) {
    console.error('Error in Gmail callback:', error);
    return NextResponse.redirect(
      new URL('/dashboard/cvs?error=connection_failed', request.url)
    );
  }
}
