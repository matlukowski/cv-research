import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db/drizzle';
import { teams } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

/**
 * GET /api/team/ai-settings
 * Get AI settings (xAI API key status) for the current team
 */
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // TODO: Get team ID from user session/context
    // For now, we'll get the first team the user belongs to
    const userTeams = await db
      .select()
      .from(teams)
      .limit(1);

    if (!userTeams || userTeams.length === 0) {
      return NextResponse.json(
        { error: 'No team found' },
        { status: 404 }
      );
    }

    const team = userTeams[0];

    return NextResponse.json({
      hasApiKey: !!team.xaiApiKey, // Only return boolean, never the actual key
    });
  } catch (error: any) {
    console.error('[AI Settings API] Error fetching settings:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch AI settings' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/team/ai-settings
 * Update xAI API key for the current team
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { xaiApiKey } = body;

    // Validate xAI API key format (if provided)
    if (xaiApiKey && !xaiApiKey.startsWith('xai-')) {
      return NextResponse.json(
        { error: 'Invalid xAI API key format. Must start with "xai-"' },
        { status: 400 }
      );
    }

    // TODO: Get team ID from user session/context
    const userTeams = await db
      .select()
      .from(teams)
      .limit(1);

    if (!userTeams || userTeams.length === 0) {
      return NextResponse.json(
        { error: 'No team found' },
        { status: 404 }
      );
    }

    const team = userTeams[0];

    // Build update object
    const updateData: any = {
      updatedAt: new Date(),
    };

    // Only update xaiApiKey if provided
    if (xaiApiKey !== undefined) {
      updateData.xaiApiKey = xaiApiKey || null;
    }

    // Update team settings
    await db
      .update(teams)
      .set(updateData)
      .where(eq(teams.id, team.id));

    return NextResponse.json({
      success: true,
      message: 'API key updated successfully',
      hasApiKey: !!xaiApiKey || !!team.xaiApiKey,
    });
  } catch (error: any) {
    console.error('[AI Settings API] Error updating settings:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update API key' },
      { status: 500 }
    );
  }
}
