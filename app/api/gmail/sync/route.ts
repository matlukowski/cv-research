import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { syncGmailCVs, getSyncStatus } from '@/lib/gmail/sync';
import { getUser, getTeamForUser } from '@/lib/db/queries';

/**
 * POST /api/gmail/sync
 * Sync CVs from Gmail
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get or create database user from Clerk session
    const dbUser = await getUser();
    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get or create team for user
    const team = await getTeamForUser();
    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    // Parse request body
    const body = await request.json().catch(() => ({}));
    const { maxResults = 50, query } = body;

    // Sync emails
    const result = await syncGmailCVs(dbUser.id, team.id, {
      maxResults,
      query,
    });

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error: any) {
    console.error('Error syncing Gmail:', error);
    return NextResponse.json(
      {
        error: 'Failed to sync Gmail',
        details: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/gmail/sync
 * Get sync status
 */
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get or create database user from Clerk session
    const dbUser = await getUser();
    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get or create team for user
    const team = await getTeamForUser();
    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    const status = await getSyncStatus(dbUser.id, team.id);

    return NextResponse.json({ status });
  } catch (error: any) {
    console.error('Error getting sync status:', error);
    return NextResponse.json(
      {
        error: 'Failed to get sync status',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
