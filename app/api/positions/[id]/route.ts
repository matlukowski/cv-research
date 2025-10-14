import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db/drizzle';
import { jobPositions } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

/**
 * GET /api/positions/[id]
 * Get a single job position
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

    // TODO: Get actual team ID from user context
    const teamId = 1;

    const [position] = await db
      .select()
      .from(jobPositions)
      .where(
        and(
          eq(jobPositions.id, positionId),
          eq(jobPositions.teamId, teamId)
        )
      )
      .limit(1);

    if (!position) {
      return NextResponse.json({ error: 'Position not found' }, { status: 404 });
    }

    return NextResponse.json({ position });
  } catch (error: any) {
    console.error('Error getting position:', error);
    return NextResponse.json(
      { error: 'Failed to get position', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/positions/[id]
 * Update a job position
 */
export async function PUT(
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

    const body = await request.json();

    // TODO: Get actual team ID from user context
    const teamId = 1;

    // Check if position exists and belongs to team
    const [existing] = await db
      .select()
      .from(jobPositions)
      .where(
        and(
          eq(jobPositions.id, positionId),
          eq(jobPositions.teamId, teamId)
        )
      )
      .limit(1);

    if (!existing) {
      return NextResponse.json({ error: 'Position not found' }, { status: 404 });
    }

    // Update position
    const [updated] = await db
      .update(jobPositions)
      .set({
        title: body.title || existing.title,
        description: body.description || existing.description,
        requirements: body.requirements || existing.requirements,
        responsibilities: body.responsibilities !== undefined ? body.responsibilities : existing.responsibilities,
        location: body.location !== undefined ? body.location : existing.location,
        employmentType: body.employmentType !== undefined ? body.employmentType : existing.employmentType,
        salaryRange: body.salaryRange !== undefined ? body.salaryRange : existing.salaryRange,
        status: body.status || existing.status,
        updatedAt: new Date(),
      })
      .where(eq(jobPositions.id, positionId))
      .returning();

    return NextResponse.json({ position: updated });
  } catch (error: any) {
    console.error('Error updating position:', error);
    return NextResponse.json(
      { error: 'Failed to update position', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/positions/[id]
 * Delete a job position
 */
export async function DELETE(
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

    // TODO: Get actual team ID from user context
    const teamId = 1;

    // Check if position exists and belongs to team
    const [existing] = await db
      .select()
      .from(jobPositions)
      .where(
        and(
          eq(jobPositions.id, positionId),
          eq(jobPositions.teamId, teamId)
        )
      )
      .limit(1);

    if (!existing) {
      return NextResponse.json({ error: 'Position not found' }, { status: 404 });
    }

    // Delete position (and cascade delete matches)
    await db
      .delete(jobPositions)
      .where(eq(jobPositions.id, positionId));

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting position:', error);
    return NextResponse.json(
      { error: 'Failed to delete position', details: error.message },
      { status: 500 }
    );
  }
}
