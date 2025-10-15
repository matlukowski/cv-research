import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db/drizzle';
import { cvs, candidateMatches, applications } from '@/lib/db/schema';
import { eq, desc, inArray } from 'drizzle-orm';
import { getTeamForUser } from '@/lib/db/queries';
import { deleteFile, fileExists } from '@/lib/storage/file-storage';

/**
 * GET /api/cvs
 * Get all CVs for the team (filters out CVs without files)
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

    // Check which CVs have actual files and filter out orphaned records
    const cvsWithFileCheck = await Promise.all(
      allCVs.map(async (cv) => {
        const exists = await fileExists(cv.fileUrl);
        return { cv, exists };
      })
    );

    // Filter to only include CVs that have files
    const validCVs = cvsWithFileCheck
      .filter(({ exists }) => exists)
      .map(({ cv }) => cv);

    // Log orphaned CVs (records without files) for cleanup
    const orphanedCVs = cvsWithFileCheck.filter(({ exists }) => !exists);
    if (orphanedCVs.length > 0) {
      console.warn(
        `[GET /api/cvs] Found ${orphanedCVs.length} orphaned CV records (no file):`,
        orphanedCVs.map(({ cv }) => ({ id: cv.id, fileName: cv.fileName, fileUrl: cv.fileUrl }))
      );
    }

    return NextResponse.json({
      cvs: validCVs,
      orphanedCount: orphanedCVs.length
    });
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
    console.log('[DELETE /api/cvs] Starting delete process...');

    const { userId } = await auth();
    console.log('[DELETE /api/cvs] Auth userId:', userId);

    if (!userId) {
      console.error('[DELETE /api/cvs] Unauthorized - no userId');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get or create team for user
    console.log('[DELETE /api/cvs] Getting team for user...');
    const team = await getTeamForUser();
    console.log('[DELETE /api/cvs] Team:', team?.id);

    if (!team) {
      console.error('[DELETE /api/cvs] Team not found');
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    // Get all CVs for the team
    console.log('[DELETE /api/cvs] Fetching CVs for team:', team.id);
    const teamCVs = await db
      .select()
      .from(cvs)
      .where(eq(cvs.teamId, team.id));

    console.log('[DELETE /api/cvs] Found', teamCVs.length, 'CVs');

    if (teamCVs.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No CVs to delete',
        deletedCount: 0,
        filesDeleted: 0
      });
    }

    // Get CV IDs for cascade deletion
    const cvIds = teamCVs.map(cv => cv.id);
    console.log('[DELETE /api/cvs] CV IDs to delete:', cvIds);

    // Delete related records first (cascade)
    console.log('[DELETE /api/cvs] Deleting related candidate_matches records...');
    const deletedMatches = await db
      .delete(candidateMatches)
      .where(inArray(candidateMatches.cvId, cvIds))
      .returning();
    console.log('[DELETE /api/cvs] Deleted', deletedMatches.length, 'candidate_matches records');

    console.log('[DELETE /api/cvs] Deleting related applications records...');
    const deletedApplications = await db
      .delete(applications)
      .where(inArray(applications.cvId, cvIds))
      .returning();
    console.log('[DELETE /api/cvs] Deleted', deletedApplications.length, 'applications records');

    // Delete files from storage
    let filesDeleted = 0;
    let fileErrors = 0;

    console.log('[DELETE /api/cvs] Deleting files from storage...');
    for (const cv of teamCVs) {
      try {
        await deleteFile(cv.fileUrl);
        filesDeleted++;
        console.log(`[DELETE /api/cvs] Deleted file: ${cv.fileUrl}`);
      } catch (error) {
        console.error(`[DELETE /api/cvs] Error deleting file ${cv.fileUrl}:`, error);
        fileErrors++;
      }
    }

    // Delete CV records from database
    console.log('[DELETE /api/cvs] Deleting CV records from database...');
    await db.delete(cvs).where(eq(cvs.teamId, team.id));
    console.log('[DELETE /api/cvs] Successfully deleted all CV records');

    return NextResponse.json({
      success: true,
      message: `Deleted ${teamCVs.length} CVs`,
      deletedCount: teamCVs.length,
      filesDeleted,
      fileErrors,
      relatedRecords: {
        candidateMatches: deletedMatches.length,
        applications: deletedApplications.length,
      },
    });
  } catch (error: any) {
    console.error('[DELETE /api/cvs] ERROR:', error);
    console.error('[DELETE /api/cvs] Stack:', error.stack);
    return NextResponse.json(
      {
        error: 'Failed to delete CVs',
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
