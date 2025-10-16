'use server';

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
import { getAIProvider } from './providers';

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
  matchType: 'direct' | 'cross'; // direct = applied for this position, cross = suggested match
  applicationId?: number; // ID of application if direct match
}

export interface MatchingOptions {
  minScore?: number; // Minimum score to include in results
  maxResults?: number; // Maximum number of results
  matchType?: 'all' | 'direct' | 'cross'; // Type of matches to include (default: 'all')
  includeCrossMatches?: boolean; // Include suggested cross-matches (default: true)
}

/**
 * Match candidates to a job position using Grok 4 Fast (xAI)
 * Now supports Direct Applications vs Cross Matches
 */
export async function matchCandidatesForPosition(
  jobPositionId: number,
  options: MatchingOptions = {}
): Promise<MatchResult[]> {
  const {
    minScore = 0,
    maxResults = 50,
    matchType = 'all',
    includeCrossMatches = true,
  } = options;

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

    let results: MatchResult[] = [];

    // STEP 2: Match direct applications (candidates who applied for this position)
    if (matchType === 'all' || matchType === 'direct') {
      const directResults = await matchDirectApplications(jobPositionId, position, minScore);
      results = results.concat(directResults);
      console.log(`[Matching] Found ${directResults.length} direct applications`);
    }

    // STEP 3: Match cross candidates (candidates who didn't apply but might fit)
    if ((matchType === 'all' || matchType === 'cross') && includeCrossMatches) {
      const crossResults = await matchCrossCandidates(jobPositionId, position, minScore);
      results = results.concat(crossResults);
      console.log(`[Matching] Found ${crossResults.length} cross-match candidates`);
    }

    // Sort by match type (direct first) and then by score (highest first)
    results.sort((a, b) => {
      if (a.matchType === 'direct' && b.matchType === 'cross') return -1;
      if (a.matchType === 'cross' && b.matchType === 'direct') return 1;
      return b.matchScore - a.matchScore;
    });

    // Limit results
    return results.slice(0, maxResults);
  } catch (error) {
    console.error('Error in matchCandidatesForPosition:', error);
    throw error;
  }
}

/**
 * Match candidates who applied directly for this position
 */
async function matchDirectApplications(
  jobPositionId: number,
  position: any,
  minScore: number
): Promise<MatchResult[]> {
  try {
    const { applications } = await import('../db/schema');

    // Get all applications for this position
    const directApplications = await db
      .select({
        application: applications,
        cv: cvs,
        candidate: candidates,
      })
      .from(applications)
      .innerJoin(cvs, eq(applications.cvId, cvs.id))
      .innerJoin(candidates, eq(cvs.candidateId, candidates.id))
      .where(
        and(
          eq(applications.jobPositionId, jobPositionId),
          eq(cvs.status, 'processed')
        )
      );

    const results: MatchResult[] = [];

    for (const { application, cv, candidate } of directApplications) {
      try {
        if (!cv.parsedText) continue;

        // Perform AI matching
        const matchResult = await matchCandidateToPosition(candidate, cv, position);

        // Mark as direct match and add application ID
        matchResult.matchType = 'direct';
        matchResult.applicationId = application.id;

        if (matchResult.matchScore >= minScore) {
          results.push(matchResult);

          // Save match result to database
          await saveMatchResult(
            jobPositionId,
            candidate.id,
            cv.id,
            matchResult,
            application.id
          );
        }
      } catch (error) {
        console.error(`Error matching direct application ${application.id}:`, error);
      }
    }

    return results;
  } catch (error) {
    console.error('Error in matchDirectApplications:', error);
    return [];
  }
}

/**
 * Match candidates who didn't apply but might be a good fit (cross-match)
 */
async function matchCrossCandidates(
  jobPositionId: number,
  position: any,
  minScore: number
): Promise<MatchResult[]> {
  try {
    const { applications } = await import('../db/schema');

    // Get all processed candidates for this team who DIDN'T apply for this position
    const teamCandidates = await db
      .select({
        candidate: candidates,
        cv: cvs,
      })
      .from(candidates)
      .innerJoin(cvs, eq(candidates.id, cvs.candidateId))
      .where(
        and(
          eq(candidates.teamId, position.teamId),
          eq(cvs.status, 'processed')
        )
      );

    // Filter out candidates who already applied for this position
    const appliedCVIds = new Set(
      (
        await db
          .select({ cvId: applications.cvId })
          .from(applications)
          .where(eq(applications.jobPositionId, jobPositionId))
      ).map((a) => a.cvId)
    );

    const crossCandidates = teamCandidates.filter(
      ({ cv }) => !appliedCVIds.has(cv.id)
    );

    const results: MatchResult[] = [];

    for (const { candidate, cv } of crossCandidates) {
      try {
        if (!cv.parsedText) continue;

        // Perform AI matching
        const matchResult = await matchCandidateToPosition(candidate, cv, position);

        // Mark as cross match
        matchResult.matchType = 'cross';

        if (matchResult.matchScore >= minScore) {
          results.push(matchResult);

          // Save match result to database
          await saveMatchResult(jobPositionId, candidate.id, cv.id, matchResult);
        }
      } catch (error) {
        console.error(`Error matching cross candidate ${candidate.id}:`, error);
      }
    }

    return results;
  } catch (error) {
    console.error('Error in matchCrossCandidates:', error);
    return [];
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
  const aiProvider = await getAIProvider(position.teamId);

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

WAŻNE ZASADY ANALIZY:
1. Przeanalizuj dokładnie CV kandydata i porównaj z wymaganiami stanowiska
2. Generuj KONKRETNE i SZCZEGÓŁOWE mocne/słabe strony na podstawie faktów z CV
3. NIE używaj ogólnych fraz typu "dobra komunikacja" czy "duże doświadczenie"
4. Odnoś się do KONKRETNYCH technologii, projektów, certyfikatów, lat doświadczenia z CV
5. Każda mocna/słaba strona powinna być precyzyjna i mierzalna
6. W analizie podaj konkretne przykłady z CV kandydata

PRZYKŁAD poprawnej odpowiedzi:
{
  "matchScore": 85,
  "aiAnalysis": "Kandydat ma solidne 5 lat komercyjnego doświadczenia w JavaScript i React, co idealnie pasuje do wymagań stanowiska. Posiada certyfikat AWS Solutions Architect Professional oraz praktyczne doświadczenie w pracy w zespołach Agile/Scrum. Realizował projekty z wykorzystaniem Node.js, PostgreSQL i Docker. Brakuje mu jedynie praktycznego doświadczenia z Kubernetes, które jest wymienione jako nice-to-have, ale jest to umiejętność możliwa do szybkiego nabycia.",
  "strengths": ["5+ lat komercyjnego doświadczenia w React i TypeScript zgodnie z wymaganiami", "Certyfikat AWS Solutions Architect Professional potwierdzający wiedzę cloud", "Praktyczne doświadczenie z Node.js, PostgreSQL i Docker wymienionymi w ofercie", "Znajomość Agile/Scrum i doświadczenie w zespołach 5-10 osób"],
  "weaknesses": ["Brak praktycznego doświadczenia z Kubernetes wymienionego w nice-to-have", "Tylko podstawowa znajomość Python, a stanowisko preferuje znajomość dodatkowych języków"],
  "summary": "Bardzo dobry kandydat z solidnym doświadczeniem technicznym pokrywającym 90% wymagań stanowiska. Posiada odpowiednie certyfikaty i doświadczenie komercyjne w kluczowych technologiach. Niewielkie braki w obszarach nice-to-have."
}

Zwróć odpowiedź w tym samym formacie JSON, ale z analizą KONKRETNEGO kandydata:`;

  try {
    const result = await aiProvider.chat({
      prompt,
      temperature: 0.3,
      jsonMode: true,
    });

    const parsed = JSON.parse(result.content || '{}');

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
      matchType: 'cross', // default to cross, will be overridden by caller if direct
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
  matchResult: MatchResult,
  applicationId?: number
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

    const matchData = {
      matchScore: matchResult.matchScore,
      aiAnalysis: matchResult.aiAnalysis,
      summary: matchResult.summary,
      strengths: matchResult.strengths,
      weaknesses: matchResult.weaknesses,
      matchType: matchResult.matchType,
      applicationId: applicationId || null,
      updatedAt: new Date(),
    };

    if (existing.length > 0) {
      // Update existing match
      await db
        .update(candidateMatches)
        .set(matchData)
        .where(eq(candidateMatches.id, existing[0].id));
    } else {
      // Insert new match
      await db.insert(candidateMatches).values({
        jobPositionId,
        candidateId,
        cvId,
        ...matchData,
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
      matchType: (m.match.matchType as 'direct' | 'cross') || 'cross',
      applicationId: m.match.applicationId || undefined,
    }));

    // Sort by match type (direct first) and then by score
    results.sort((a, b) => {
      if (a.matchType === 'direct' && b.matchType === 'cross') return -1;
      if (a.matchType === 'cross' && b.matchType === 'direct') return 1;
      return b.matchScore - a.matchScore;
    });

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
