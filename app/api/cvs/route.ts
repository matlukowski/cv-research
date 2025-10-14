import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db/drizzle';
import { cvs } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { getTeamForUser } from '@/lib/db/queries';
import { deleteFile } from '@/lib/storage/file-storage';

/**
 * GET /api/cvs
 * Get all CVs for the team
 */
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get or create team for user
    const team = await getTeamForUser();
    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    const allCVs = await db
      .select()
      .from(cvs)
      .where(eq(cvs.teamId, team.id))
      .orderBy(desc(cvs.uploadedAt));

    return NextResponse.json({ cvs: allCVs });
  } catch (error: any) {
    console.error('Error getting CVs:', error);
    return NextResponse.json(
      { error: 'Failed to get CVs', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/cvs
 * Delete all CVs for the team (including files from storage)
 */
export async function DELETE() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get or create team for user
    const team = await getTeamForUser();
    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    // Get all CVs for the team
    const teamCVs = await db
      .select()
      .from(cvs)
      .where(eq(cvs.teamId, team.id));

    if (teamCVs.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No CVs to delete',
        deletedCount: 0
      });
    }

    // Delete files from storage
    let filesDeleted = 0;
    let fileErrors = 0;

    for (const cv of teamCVs) {
      try {
        await deleteFile(cv.fileUrl);
        filesDeleted++;
      } catch (error) {
        console.error(`Error deleting file ${cv.fileUrl}:`, error);
        fileErrors++;
      }
    }

    // Delete CV records from database
    await db.delete(cvs).where(eq(cvs.teamId, team.id));

    return NextResponse.json({
      success: true,
      message: `Deleted ${teamCVs.length} CVs`,
      deletedCount: teamCVs.length,
      filesDeleted,
      fileErrors,
    });
  } catch (error: any) {
    console.error('Error deleting CVs:', error);
    return NextResponse.json(
      { error: 'Failed to delete CVs', details: error.message },
      { status: 500 }
    );
  }
}
