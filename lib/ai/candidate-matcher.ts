'use server';

import { OpenAI } from 'openai';
import { db } from '../db/drizzle';
import {
  candidates,
  cvs,
  jobPositions,
  candidateMatches,
  type NewCandidateMatch,
} from '../db/schema';
import { eq, and } from 'drizzle-orm';
import { processAllPendingCVs } from './cv-processor';

const openai = new OpenAI({
  apiKey: process.env.XAI_API_KEY,
  baseURL: 'https://api.x.ai/v1',
});

const AI_MODEL = process.env.XAI_MODEL || 'grok-4-fast-non-reasoning';

export interface MatchResult {
  candidateId: number;
  candidateName: string;
  matchScore: number; // 0-100
  aiAnalysis: string;
  strengths: string[];
  weaknesses: string[];
  summary: string;
  email?: string;
  phone?: string;
  location?: string;
}

export interface MatchingOptions {
  minScore?: number; // Minimum score to include in results
  maxResults?: number; // Maximum number of results
}

/**
 * Match candidates to a job position using Grok 4 Fast (xAI)
 */
export async function matchCandidatesForPosition(
  jobPositionId: number,
  options: MatchingOptions = {}
): Promise<MatchResult[]> {
  const { minScore = 0, maxResults = 50 } = options;

  try {
    // Get job position
    const [position] = await db
      .select()
      .from(jobPositions)
      .where(eq(jobPositions.id, jobPositionId))
      .limit(1);

    if (!position) {
      throw new Error('Job position not found');
    }

    // STEP 1: Auto-process pending CVs before matching
    console.log('[Matching] Processing pending CVs for team', position.teamId);
    const processingResult = await processAllPendingCVs(position.teamId);
    console.log(
      `[Matching] Processed ${processingResult.processed} CVs, ${processingResult.errors} errors`
    );

    // STEP 2: Get all processed candidates for this team
    const teamCandidates = await db
      .select()
      .from(candidates)
      .where(eq(candidates.teamId, position.teamId));

    const results: MatchResult[] = [];

    // Match each candidate
    for (const candidate of teamCandidates) {
      try {
        // Get candidate's CV
        const [cv] = await db
          .select()
          .from(cvs)
          .where(
            and(
              eq(cvs.candidateId, candidate.id),
              eq(cvs.status, 'processed')
            )
          )
          .limit(1);

        if (!cv || !cv.parsedText) {
          continue; // Skip if no CV or no parsed text
        }

        // Perform AI matching
        const matchResult = await matchCandidateToPosition(
          candidate,
          cv,
          position
        );

        if (matchResult.matchScore >= minScore) {
          results.push(matchResult);

          // Save match result to database
          await saveMatchResult(jobPositionId, candidate.id, cv.id, matchResult);
        }
      } catch (error) {
        console.error(`Error matching candidate ${candidate.id}:`, error);
      }
    }

    // Sort by match score (highest first)
    results.sort((a, b) => b.matchScore - a.matchScore);

    // Limit results
    return results.slice(0, maxResults);
  } catch (error) {
    console.error('Error in matchCandidatesForPosition:', error);
    throw error;
  }
}

/**
 * Match a single candidate to a job position using AI
 */
async function matchCandidateToPosition(
  candidate: any,
  cv: any,
  position: any
): Promise<MatchResult> {
  const prompt = `Jesteś ekspertem HR specjalizującym się w rekrutacji. Oceń dopasowanie kandydata do stanowiska pracy.

STANOWISKO PRACY:
Tytuł: ${position.title}
Opis: ${position.description}
Wymagania: ${position.requirements}
Obowiązki: ${position.responsibilities || 'Nie podano'}
Lokalizacja: ${position.location || 'Nie podano'}

KANDYDAT:
Imię i nazwisko: ${candidate.firstName} ${candidate.lastName}
Email: ${candidate.email || 'Nie podano'}
Telefon: ${candidate.phone || 'Nie podano'}
Lokalizacja: ${candidate.location || 'Nie podano'}
Podsumowanie: ${candidate.summary || 'Brak'}

Umiejętności: ${JSON.stringify(candidate.skills || [])}
Doświadczenie: ${JSON.stringify(candidate.experience || [])}
Wykształcenie: ${JSON.stringify(candidate.education || [])}

PEŁNY TEKST CV:
${cv.parsedText.slice(0, 6000)}

ZADANIE:
Oceń dopasowanie kandydata do stanowiska w skali 0-100, gdzie:
- 0-30: Kandydat nie spełnia podstawowych wymagań
- 31-50: Kandydat spełnia część wymagań, ale brakuje kluczowych kompetencji
- 51-70: Kandydat dobrze pasuje, spełnia większość wymagań
- 71-85: Bardzo dobre dopasowanie, spełnia wszystkie wymagania
- 86-100: Idealny kandydat, przewyższa wymagania

Zwróć odpowiedź w formacie JSON:
{
  "matchScore": liczba 0-100,
  "aiAnalysis": "szczegółowa analiza dopasowania (3-4 zdania)",
  "strengths": ["mocna strona 1", "mocna strona 2", "mocna strona 3"],
  "weaknesses": ["słaba strona 1", "słaba strona 2"],
  "summary": "krótkie podsumowanie (1-2 zdania) dlaczego kandydat pasuje lub nie pasuje"
}`;

  try {
    const result = await openai.chat.completions.create({
      model: AI_MODEL,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    });

    const parsed = JSON.parse(result.choices[0].message.content || '{}');

    return {
      candidateId: candidate.id,
      candidateName: `${candidate.firstName} ${candidate.lastName}`,
      matchScore: parsed.matchScore,
      aiAnalysis: parsed.aiAnalysis,
      strengths: parsed.strengths,
      weaknesses: parsed.weaknesses,
      summary: parsed.summary,
      email: candidate.email,
      phone: candidate.phone,
      location: candidate.location,
    };
  } catch (error) {
    console.error('Error in AI matching:', error);
    throw new Error('Failed to match candidate with AI');
  }
}

/**
 * Save match result to database
 */
async function saveMatchResult(
  jobPositionId: number,
  candidateId: number,
  cvId: number,
  matchResult: MatchResult
): Promise<void> {
  try {
    // Check if match already exists
    const existing = await db
      .select()
      .from(candidateMatches)
      .where(
        and(
          eq(candidateMatches.jobPositionId, jobPositionId),
          eq(candidateMatches.candidateId, candidateId),
          eq(candidateMatches.cvId, cvId)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      // Update existing match
      await db
        .update(candidateMatches)
        .set({
          matchScore: matchResult.matchScore,
          aiAnalysis: matchResult.aiAnalysis,
          summary: matchResult.summary,
          strengths: matchResult.strengths,
          weaknesses: matchResult.weaknesses,
          updatedAt: new Date(),
        })
        .where(eq(candidateMatches.id, existing[0].id));
    } else {
      // Insert new match
      await db.insert(candidateMatches).values({
        jobPositionId,
        candidateId,
        cvId,
        matchScore: matchResult.matchScore,
        aiAnalysis: matchResult.aiAnalysis,
        summary: matchResult.summary,
        strengths: matchResult.strengths,
        weaknesses: matchResult.weaknesses,
      } as NewCandidateMatch);
    }
  } catch (error) {
    console.error('Error saving match result:', error);
  }
}

/**
 * Get existing match results for a job position
 */
export async function getMatchResultsForPosition(
  jobPositionId: number
): Promise<MatchResult[]> {
  try {
    const matches = await db
      .select({
        match: candidateMatches,
        candidate: candidates,
      })
      .from(candidateMatches)
      .innerJoin(
        candidates,
        eq(candidateMatches.candidateId, candidates.id)
      )
      .where(eq(candidateMatches.jobPositionId, jobPositionId));

    const results: MatchResult[] = matches.map((m) => ({
      candidateId: m.candidate.id,
      candidateName: `${m.candidate.firstName} ${m.candidate.lastName}`,
      matchScore: m.match.matchScore,
      aiAnalysis: m.match.aiAnalysis || '',
      strengths: (m.match.strengths as string[]) || [],
      weaknesses: (m.match.weaknesses as string[]) || [],
      summary: m.match.summary || m.match.aiAnalysis?.slice(0, 200) || '', // Use full summary from AI
      email: m.candidate.email || undefined,
      phone: m.candidate.phone || undefined,
      location: m.candidate.location || undefined,
    }));

    // Sort by match score
    results.sort((a, b) => b.matchScore - a.matchScore);

    return results;
  } catch (error) {
    console.error('Error getting match results:', error);
    throw error;
  }
}

/**
 * Re-match all candidates for a position
 */
export async function rematchCandidatesForPosition(
  jobPositionId: number
): Promise<{ matched: number; errors: number }> {
  try {
    // Clear existing matches
    await db
      .delete(candidateMatches)
      .where(eq(candidateMatches.jobPositionId, jobPositionId));

    // Perform new matching
    const results = await matchCandidatesForPosition(jobPositionId);

    return {
      matched: results.length,
      errors: 0,
    };
  } catch (error) {
    console.error('Error rematching candidates:', error);
    return {
      matched: 0,
      errors: 1,
    };
  }
}
