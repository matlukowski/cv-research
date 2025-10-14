import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import {
  matchCandidatesForPosition,
  getMatchResultsForPosition,
  rematchCandidatesForPosition,
} from '@/lib/ai/candidate-matcher';

/**
 * POST /api/positions/[id]/match
 * Match candidates to a job position
 */
export async function POST(
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

    const body = await request.json().catch(() => ({}));
    const { rematch = false, minScore = 0, maxResults = 50 } = body;

    let results;

    if (rematch) {
      // Clear existing matches and re-match
      await rematchCandidatesForPosition(positionId);
      results = await matchCandidatesForPosition(positionId, { minScore, maxResults });
    } else {
      // Try to get existing results first
      const existingResults = await getMatchResultsForPosition(positionId);

      if (existingResults.length > 0) {
        results = existingResults;
      } else {
        // No existing results, perform matching
        results = await matchCandidatesForPosition(positionId, { minScore, maxResults });
      }
    }

    return NextResponse.json({
      success: true,
      matches: results,
      totalMatches: results.length,
    });
  } catch (error: any) {
    console.error('Error matching candidates:', error);
    return NextResponse.json(
      { error: 'Failed to match candidates', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * GET /api/positions/[id]/match
 * Get existing match results for a position
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

    const results = await getMatchResultsForPosition(positionId);

    return NextResponse.json({
      matches: results,
      totalMatches: results.length,
    });
  } catch (error: any) {
    console.error('Error getting match results:', error);
    return NextResponse.json(
      { error: 'Failed to get match results', details: error.message },
      { status: 500 }
    );
  }
}
