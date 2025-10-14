import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db/drizzle';
import { cvs } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { getTeamForUser } from '@/lib/db/queries';

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
