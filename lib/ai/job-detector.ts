'use server';

import { db } from '../db/drizzle';
import { jobPositions } from '../db/schema';
import { eq } from 'drizzle-orm';
import { getAIProvider } from './providers';

export interface JobDetectionResult {
  jobPositionId: number | null;
  confidence: number; // 0-100
  reason: string;
  applicationType: 'direct' | 'spontaneous';
}

/**
 * Detect which job position (if any) a candidate is applying for
 * based on email subject and body
 */
export async function detectJobPosition(
  teamId: number,
  emailSubject: string,
  emailBody: string
): Promise<JobDetectionResult> {
  try {
    // Get all active job positions for this team
    const activePositions = await db
      .select()
      .from(jobPositions)
      .where(eq(jobPositions.teamId, teamId));

    // If no active positions, it's a spontaneous application
    if (activePositions.length === 0) {
      return {
        jobPositionId: null,
        confidence: 100,
        reason: 'No active job positions found. This is a spontaneous application.',
        applicationType: 'spontaneous',
      };
    }

    // Prepare positions data for AI
    const positionsData = activePositions.map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description?.slice(0, 500), // truncate to reduce tokens
      location: p.location,
    }));

    const aiProvider = await getAIProvider(teamId);

    const prompt = `Jesteś ekspertem HR. Twoim zadaniem jest określić, czy kandydat aplikuje na konkretne stanowisko, czy wysyła spontaniczną aplikację.

DOSTĘPNE STANOWISKA PRACY:
${JSON.stringify(positionsData, null, 2)}

EMAIL OD KANDYDATA:
Temat: ${emailSubject}
Treść: ${emailBody.slice(0, 1000)}

ZADANIE:
Przeanalizuj email i określ:
1. Czy kandydat aplikuje na jedno z dostępnych stanowisk? Jeśli tak, na które?
2. Jaki jest poziom pewności (0-100)?
3. Dlaczego podjąłeś taką decyzję?

Wskazówki:
- Szukaj fraz typu: "aplikacja na stanowisko", "w odpowiedzi na ogłoszenie", "stanowisko [nazwa]"
- Porównaj tytuł stanowiska z tematem i treścią emaila
- Jeśli nie ma wyraźnej wzmianki o stanowisku, oznacz jako "spontaneous"
- Jeśli email wspomina o konkretnym stanowisku, ale nie ma go na liście, oznacz jako "spontaneous"

Zwróć odpowiedź w formacie JSON:
{
  "jobPositionId": numer ID stanowiska lub null,
  "confidence": 0-100,
  "reason": "wyjaśnienie decyzji (1-2 zdania)",
  "applicationType": "direct" lub "spontaneous"
}`;

    const result = await aiProvider.chat({
      prompt,
      temperature: 0.2,
      jsonMode: true,
    });

    const parsed = JSON.parse(result.content || '{}');

    // Validate the result
    if (parsed.jobPositionId !== null) {
      // Check if the position actually exists
      const positionExists = activePositions.some(
        (p) => p.id === parsed.jobPositionId
      );
      if (!positionExists) {
        return {
          jobPositionId: null,
          confidence: 100,
          reason: 'AI detected a position, but it does not exist in the database. Marking as spontaneous.',
          applicationType: 'spontaneous',
        };
      }
    }

    return {
      jobPositionId: parsed.jobPositionId,
      confidence: parsed.confidence || 0,
      reason: parsed.reason || 'No reason provided',
      applicationType: parsed.applicationType || 'spontaneous',
    };
  } catch (error) {
    console.error('Error detecting job position:', error);
    // On error, default to spontaneous application
    return {
      jobPositionId: null,
      confidence: 0,
      reason: 'Error during AI detection. Defaulting to spontaneous application.',
      applicationType: 'spontaneous',
    };
  }
}

