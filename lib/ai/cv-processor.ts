'use server';

import { OpenAI } from 'openai';
import pdfParse from 'pdf-parse';
import { db } from '../db/drizzle';
import { cvs, candidates, type NewCandidate } from '../db/schema';
import { eq } from 'drizzle-orm';
import { getFile } from '../storage/file-storage';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const AI_MODEL = process.env.OPENAI_MODEL || 'gpt-5-mini';

export interface CVValidationResult {
  isCV: boolean;
  confidence: number; // 0-100
  reason: string;
}

export interface ExtractedCandidateData {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  summary: string;
  skills: string[];
  experience: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate?: string;
    description?: string;
  }>;
  education: Array<{
    institution: string;
    degree: string;
    field: string;
    graduationYear?: string;
  }>;
  linkedinUrl?: string;
  location?: string;
}

/**
 * Extract text from PDF buffer
 */
export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    const data = await pdfParse(buffer);
    return data.text;
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error('Failed to extract text from PDF');
  }
}

/**
 * Validate if a document is a CV using GPT-5 mini
 */
export async function validateCV(pdfText: string): Promise<CVValidationResult> {
  try {
    const prompt = `Jesteś ekspertem HR specjalizującym się w analizie dokumentów rekrutacyjnych.

Przeanalizuj poniższy tekst i określ czy jest to CV (curriculum vitae / resume) kandydata do pracy.

Dokument jest CV jeśli zawiera:
- Dane osobowe (imię, nazwisko)
- Doświadczenie zawodowe lub wykształcenie
- Umiejętności lub kompetencje
- Format typowy dla CV/resume

Dokument NIE jest CV jeśli:
- To list motywacyjny
- To faktura, umowa lub inny dokument biznesowy
- To artykuł, raport lub dokument akademicki
- To dane techniczne produktu lub instrukcja

TEKST DOKUMENTU:
${pdfText.slice(0, 8000)}

Odpowiedz w formacie JSON:
{
  "isCV": true lub false,
  "confidence": liczba 0-100 (pewność oceny),
  "reason": "krótkie wyjaśnienie decyzji po polsku"
}`;

    const result = await openai.responses.create({
      model: AI_MODEL,
      input: prompt,
      reasoning: { effort: 'low' },
      text: { verbosity: 'low' },
    });

    const parsed = JSON.parse(result.output_text);

    return {
      isCV: parsed.isCV,
      confidence: parsed.confidence,
      reason: parsed.reason,
    };
  } catch (error) {
    console.error('Error validating CV with AI:', error);
    throw new Error('Failed to validate CV');
  }
}

/**
 * Extract structured candidate data from CV text using GPT-5 mini
 */
export async function extractCandidateData(
  pdfText: string
): Promise<ExtractedCandidateData> {
  try {
    const prompt = `Jesteś ekspertem HR. Wyciągnij strukturalne dane kandydata z poniższego CV.

TEKST CV:
${pdfText}

Wyciągnij następujące informacje i zwróć w formacie JSON:
{
  "firstName": "imię",
  "lastName": "nazwisko",
  "email": "adres email (jeśli dostępny)",
  "phone": "numer telefonu (jeśli dostępny)",
  "summary": "krótkie podsumowanie profilu kandydata (2-3 zdania)",
  "skills": ["umiejętność1", "umiejętność2", ...],
  "experience": [
    {
      "company": "nazwa firmy",
      "position": "stanowisko",
      "startDate": "YYYY-MM lub YYYY",
      "endDate": "YYYY-MM lub YYYY lub null jeśli aktualne",
      "description": "opis obowiązków (opcjonalnie)"
    }
  ],
  "education": [
    {
      "institution": "nazwa uczelni",
      "degree": "stopień (np. Licencjat, Magister, Inżynier)",
      "field": "kierunek studiów",
      "graduationYear": "rok ukończenia"
    }
  ],
  "linkedinUrl": "URL profilu LinkedIn (jeśli dostępny)",
  "location": "lokalizacja (miasto, kraj)"
}

Jeśli jakiejś informacji nie ma w CV, użyj null lub pustej tablicy.
Zwróć TYLKO JSON, bez dodatkowego tekstu.`;

    const result = await openai.responses.create({
      model: AI_MODEL,
      input: prompt,
      reasoning: { effort: 'medium' },
      text: { verbosity: 'medium' },
    });

    const parsed: ExtractedCandidateData = JSON.parse(result.output_text);

    return parsed;
  } catch (error) {
    console.error('Error extracting candidate data:', error);
    throw new Error('Failed to extract candidate data');
  }
}

/**
 * Process a CV: validate and extract data
 */
export async function processCVById(cvId: number): Promise<{
  success: boolean;
  isCV: boolean;
  candidateId?: number;
  error?: string;
}> {
  try {
    // Get CV from database
    const [cv] = await db.select().from(cvs).where(eq(cvs.id, cvId)).limit(1);

    if (!cv) {
      return { success: false, isCV: false, error: 'CV not found' };
    }

    // Update status to processing
    await db
      .update(cvs)
      .set({ status: 'processing' })
      .where(eq(cvs.id, cvId));

    // Get PDF file
    const pdfBuffer = await getFile(cv.fileUrl);

    // Extract text from PDF
    const pdfText = await extractTextFromPDF(pdfBuffer);

    // Save parsed text
    await db
      .update(cvs)
      .set({ parsedText: pdfText })
      .where(eq(cvs.id, cvId));

    // Validate with AI
    const validation = await validateCV(pdfText);

    // Update validation results
    await db
      .update(cvs)
      .set({
        aiValidationScore: validation.confidence,
        aiValidationReason: validation.reason,
      })
      .where(eq(cvs.id, cvId));

    if (!validation.isCV || validation.confidence < 60) {
      // Not a CV or low confidence
      await db
        .update(cvs)
        .set({ status: 'rejected', processedAt: new Date() })
        .where(eq(cvs.id, cvId));

      return {
        success: true,
        isCV: false,
        error: `Not recognized as CV: ${validation.reason}`,
      };
    }

    // Extract candidate data
    const candidateData = await extractCandidateData(pdfText);

    // Create or update candidate
    const [candidate] = await db
      .insert(candidates)
      .values({
        teamId: cv.teamId,
        ...candidateData,
      } as NewCandidate)
      .returning();

    // Link CV to candidate
    await db
      .update(cvs)
      .set({
        candidateId: candidate.id,
        status: 'processed',
        processedAt: new Date(),
      })
      .where(eq(cvs.id, cvId));

    return {
      success: true,
      isCV: true,
      candidateId: candidate.id,
    };
  } catch (error: any) {
    console.error('Error processing CV:', error);

    // Update status to error
    await db
      .update(cvs)
      .set({ status: 'error' })
      .where(eq(cvs.id, cvId))
      .catch(() => {});

    return {
      success: false,
      isCV: false,
      error: error.message || 'Unknown error',
    };
  }
}

/**
 * Process all pending CVs
 */
export async function processAllPendingCVs(
  teamId: number
): Promise<{ processed: number; errors: number }> {
  const pendingCVs = await db
    .select()
    .from(cvs)
    .where(eq(cvs.teamId, teamId));

  const pending = pendingCVs.filter((cv) => cv.status === 'pending');

  let processed = 0;
  let errors = 0;

  for (const cv of pending) {
    const result = await processCVById(cv.id);
    if (result.success) {
      processed++;
    } else {
      errors++;
    }
  }

  return { processed, errors };
}
