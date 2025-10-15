import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getSpontaneousApplications } from '@/lib/applications/application-manager';
import { getTeamForUser } from '@/lib/db/queries';

/**
 * GET /api/applications
 * Get all spontaneous applications for the team
 */
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's team
    const team = await getTeamForUser();
    if (!team) {
      return NextResponse.json({ error: 'No team found' }, { status: 404 });
    }

    const applications = await getSpontaneousApplications(team.id);

    return NextResponse.json({
      applications,
      total: applications.length,
    });
  } catch (error: any) {
    console.error('Error getting applications:', error);
    return NextResponse.json(
      { error: 'Failed to get applications', details: error.message },
      { status: 500 }
    );
  }
}
