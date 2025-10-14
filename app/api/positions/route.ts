import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db/drizzle';
import { jobPositions } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { getUser, getTeamForUser } from '@/lib/db/queries';

/**
 * GET /api/positions
 * Get all job positions for the team
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

    const positions = await db
      .select()
      .from(jobPositions)
      .where(eq(jobPositions.teamId, team.id))
      .orderBy(jobPositions.createdAt);

    return NextResponse.json({ positions });
  } catch (error: any) {
    console.error('Error getting positions:', error);
    return NextResponse.json(
      { error: 'Failed to get positions', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/positions
 * Create a new job position
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

    const body = await request.json();

    // Validate required fields
    if (!body.title || !body.description || !body.requirements) {
      return NextResponse.json(
        { error: 'Missing required fields: title, description, requirements' },
        { status: 400 }
      );
    }

    const [position] = await db
      .insert(jobPositions)
      .values({
        teamId: team.id,
        createdBy: dbUser.id,
        title: body.title,
        description: body.description,
        requirements: body.requirements,
        responsibilities: body.responsibilities || null,
        location: body.location || null,
        employmentType: body.employmentType || null,
        salaryRange: body.salaryRange || null,
        status: body.status || 'active',
      })
      .returning();

    return NextResponse.json({ position }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating position:', error);
    return NextResponse.json(
      { error: 'Failed to create position', details: error.message },
      { status: 500 }
    );
  }
}
