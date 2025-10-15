import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db/drizzle';
import { cvs, candidateMatches, applications } from '@/lib/db/schema';
import { eq, inArray } from 'drizzle-orm';
import { getTeamForUser } from '@/lib/db/queries';
import { fileExists } from '@/lib/storage/file-storage';

/**
 * DELETE /api/cvs/orphaned
 * Clean up CV records that don't have corresponding files on disk
 */
export async function DELETE() {
  try {
    console.log('[DELETE /api/cvs/orphaned] Starting orphaned CV cleanup...');

    const { userId } = await auth();
    console.log('[DELETE /api/cvs/orphaned] Auth userId:', userId);

    if (!userId) {
      console.error('[DELETE /api/cvs/orphaned] Unauthorized - no userId');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get or create team for user
    console.log('[DELETE /api/cvs/orphaned] Getting team for user...');
    const team = await getTeamForUser();
    console.log('[DELETE /api/cvs/orphaned] Team:', team?.id);

    if (!team) {
      console.error('[DELETE /api/cvs/orphaned] Team not found');
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    // Get all CVs for the team
    console.log('[DELETE /api/cvs/orphaned] Fetching all CVs for team:', team.id);
    const allCVs = await db
      .select()
      .from(cvs)
      .where(eq(cvs.teamId, team.id));

    console.log('[DELETE /api/cvs/orphaned] Found', allCVs.length, 'total CVs');

    if (allCVs.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No CVs found',
        deletedCount: 0
      });
    }

    // Check which CVs don't have files
    console.log('[DELETE /api/cvs/orphaned] Checking file existence...');
    const cvsWithFileCheck = await Promise.all(
      allCVs.map(async (cv) => {
        const exists = await fileExists(cv.fileUrl);
        return { cv, exists };
      })
    );

    const orphanedCVs = cvsWithFileCheck.filter(({ exists }) => !exists);
    console.log('[DELETE /api/cvs/orphaned] Found', orphanedCVs.length, 'orphaned CVs');

    if (orphanedCVs.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No orphaned CVs found',
        deletedCount: 0
      });
    }

    // Get IDs of orphaned CVs
    const orphanedCVIds = orphanedCVs.map(({ cv }) => cv.id);
    console.log('[DELETE /api/cvs/orphaned] Orphaned CV IDs:', orphanedCVIds);

    // Delete related records first (cascade)
    console.log('[DELETE /api/cvs/orphaned] Deleting related candidate_matches records...');
    const deletedMatches = await db
      .delete(candidateMatches)
      .where(inArray(candidateMatches.cvId, orphanedCVIds))
      .returning();
    console.log('[DELETE /api/cvs/orphaned] Deleted', deletedMatches.length, 'candidate_matches records');

    console.log('[DELETE /api/cvs/orphaned] Deleting related applications records...');
    const deletedApplications = await db
      .delete(applications)
      .where(inArray(applications.cvId, orphanedCVIds))
      .returning();
    console.log('[DELETE /api/cvs/orphaned] Deleted', deletedApplications.length, 'applications records');

    // Delete orphaned CV records from database
    console.log('[DELETE /api/cvs/orphaned] Deleting orphaned CV records from database...');
    await db
      .delete(cvs)
      .where(inArray(cvs.id, orphanedCVIds));
    console.log('[DELETE /api/cvs/orphaned] Successfully deleted', orphanedCVIds.length, 'orphaned CV records');

    return NextResponse.json({
      success: true,
      message: `Cleaned up ${orphanedCVIds.length} orphaned CV records`,
      deletedCount: orphanedCVIds.length,
      relatedRecords: {
        candidateMatches: deletedMatches.length,
        applications: deletedApplications.length,
      },
    });
  } catch (error: any) {
    console.error('[DELETE /api/cvs/orphaned] ERROR:', error);
    console.error('[DELETE /api/cvs/orphaned] Stack:', error.stack);
    return NextResponse.json(
      {
        error: 'Failed to clean up orphaned CVs',
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
