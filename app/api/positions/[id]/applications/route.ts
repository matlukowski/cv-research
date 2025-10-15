import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getApplicationsForPosition } from '@/lib/applications/application-manager';

/**
 * GET /api/positions/[id]/applications
 * Get all applications for a specific job position
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const positionId = parseInt(id);

    if (isNaN(positionId)) {
      return NextResponse.json({ error: 'Invalid position ID' }, { status: 400 });
    }

    const applications = await getApplicationsForPosition(positionId);

    return NextResponse.json({
      applications,
      total: applications.length,
    });
  } catch (error: any) {
    console.error('Error getting applications for position:', error);
    return NextResponse.json(
      { error: 'Failed to get applications', details: error.message },
      { status: 500 }
    );
  }
}
