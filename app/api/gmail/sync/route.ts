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
    const {
      maxResults = 50,
      query,
      useSmartFiltering = true,
      filterThreshold = 10, // Low threshold: permissive filtering
      syncFromDate,
    } = body;

    // Validate and parse syncFromDate if provided
    let parsedSyncFromDate: Date | undefined;
    if (syncFromDate) {
      parsedSyncFromDate = new Date(syncFromDate);

      // Validate date is not in the future
      if (parsedSyncFromDate > new Date()) {
        return NextResponse.json(
          { error: 'syncFromDate cannot be in the future' },
          { status: 400 }
        );
      }

      // Validate date is valid
      if (isNaN(parsedSyncFromDate.getTime())) {
        return NextResponse.json(
          { error: 'Invalid syncFromDate format' },
          { status: 400 }
        );
      }

      // Update syncFromDate in gmail_connections table
      const { gmailConnections } = await import('@/lib/db/schema');
      const { eq, and } = await import('drizzle-orm');
      const { db } = await import('@/lib/db/drizzle');

      await db
        .update(gmailConnections)
        .set({ syncFromDate: parsedSyncFromDate, updatedAt: new Date() })
        .where(
          and(
            eq(gmailConnections.userId, dbUser.id),
            eq(gmailConnections.teamId, team.id),
            eq(gmailConnections.isActive, true)
          )
        );
    }

    // Sync emails with intelligent filtering
    const result = await syncGmailCVs(dbUser.id, team.id, {
      maxResults,
      query,
      useSmartFiltering,
      filterThreshold,
      syncFromDate: parsedSyncFromDate,
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
