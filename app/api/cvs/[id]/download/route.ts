import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db/drizzle';
import { cvs } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getFile } from '@/lib/storage/file-storage';
import { getTeamForUser } from '@/lib/db/queries';

/**
 * GET /api/cvs/[id]/download
 * Download CV PDF file
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

    // Get or create team for user
    const team = await getTeamForUser();
    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    // Await params in Next.js 15
    const { id } = await params;
    const cvId = parseInt(id);
    if (isNaN(cvId)) {
      return NextResponse.json({ error: 'Invalid CV ID' }, { status: 400 });
    }

    // Get CV from database (ensure it belongs to user's team)
    const [cv] = await db
      .select()
      .from(cvs)
      .where(eq(cvs.id, cvId))
      .limit(1);

    if (!cv) {
      return NextResponse.json({ error: 'CV not found' }, { status: 404 });
    }

    // Security check: ensure CV belongs to user's team
    if (cv.teamId !== team.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get file from storage
    const fileBuffer = await getFile(cv.fileUrl);

    // Return file as download
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${encodeURIComponent(cv.fileName)}"`,
        'Content-Length': fileBuffer.length.toString(),
      },
    });
  } catch (error: any) {
    console.error('Error downloading CV:', error);
    return NextResponse.json(
      { error: 'Failed to download CV', details: error.message },
      { status: 500 }
    );
  }
}
