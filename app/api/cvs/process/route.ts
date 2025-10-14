import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { processAllPendingCVs } from '@/lib/ai/cv-processor';

/**
 * POST /api/cvs/process
 * Process all pending CVs with AI
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // TODO: Get actual team ID from user context
    const teamId = 1;

    const result = await processAllPendingCVs(teamId);

    return NextResponse.json({
      success: true,
      processed: result.processed,
      errors: result.errors,
    });
  } catch (error: any) {
    console.error('Error processing CVs:', error);
    return NextResponse.json(
      { error: 'Failed to process CVs', details: error.message },
      { status: 500 }
    );
  }
}
