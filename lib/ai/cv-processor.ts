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
  yearsOfExperience?: number;
  technicalSkills: string[];
  softSkills: string[];
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
  certifications?: string[];
  languages?: Array<{
    language: string;
    level: string;
  }>;
  keyAchievements?: string[];
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
    const prompt = `Jesteś ekspertem HR specjalizującym się w analizie CV i ekstrakcji danych kandydatów.

TEKST CV:
${pdfText}

INSTRUKCJE EKSTRAKCJI:

1. **Summary (Podsumowanie)**: Napisz profesjonalne, szczegółowe podsumowanie profilu kandydata (4-6 zdań) zawierające:
   - Łączną liczbę lat doświadczenia zawodowego
   - Główną specjalizację / rolę zawodową
   - Top 3 kluczowe umiejętności techniczne
   - Jedno największe osiągnięcie lub wyróżnik
   - Obecny poziom kariery (junior/mid/senior)

2. **Normalizacja danych**:
   - Telefon: Zawsze format międzynarodowy z + (np. "+48 123 456 789")
   - Umiejętności: Pierwsza litera wielka, pełne nazwy (np. "JavaScript" nie "JS")
   - Daty: Zawsze format "YYYY-MM" lub "YYYY" (jeśli tylko rok)
   - Firmy/Stanowiska: Popraw ewidentne literówki, zachowaj oryginalne nazwy własne

3. **Podział umiejętności**:
   - technicalSkills: Umiejętności techniczne, programistyczne, narzędzia, języki programowania, frameworki
   - softSkills: Umiejętności miękkie (komunikacja, przywództwo, zarządzanie czasem, etc.)

4. **Lata doświadczenia**: Oblicz łączną liczbę lat pracy zawodowej na podstawie dat w doświadczeniu. Zaokrąglij do pełnych lat.

5. **Key Achievements**: Wybierz 3-5 najważniejszych osiągnięć kandydata z całego CV (konkretne wyniki, nagrody, projekty, awanse).

Wyciągnij następujące informacje i zwróć w formacie JSON:
{
  "firstName": "imię",
  "lastName": "nazwisko",
  "email": "adres email w formacie email@domain.com (jeśli dostępny)",
  "phone": "numer telefonu w formacie +XX XXX XXX XXX (jeśli dostępny)",
  "summary": "profesjonalne podsumowanie profilu (4-6 zdań) - patrz instrukcje powyżej",
  "yearsOfExperience": liczba lat doświadczenia (number) lub null,
  "technicalSkills": ["Umiejętność techniczna 1", "Umiejętność techniczna 2", ...],
  "softSkills": ["Umiejętność miękka 1", "Umiejętność miękka 2", ...],
  "experience": [
    {
      "company": "Nazwa firmy",
      "position": "Stanowisko",
      "startDate": "YYYY-MM",
      "endDate": "YYYY-MM" lub null jeśli aktualne,
      "description": "Profesjonalny opis osiągnięć i obowiązków"
    }
  ],
  "education": [
    {
      "institution": "Nazwa uczelni",
      "degree": "Stopień (Licencjat, Magister, Inżynier, etc.)",
      "field": "Kierunek studiów",
      "graduationYear": "YYYY"
    }
  ],
  "certifications": ["Certyfikat 1", "Certyfikat 2", ...] lub null,
  "languages": [
    {
      "language": "Język (np. Polski, Angielski)",
      "level": "Poziom: Native / Fluent / Advanced / Intermediate / Basic"
    }
  ] lub null,
  "keyAchievements": [
    "Osiągnięcie 1 - konkretny, mierzalny wynik",
    "Osiągnięcie 2 - konkretny, mierzalny wynik",
    "Osiągnięcie 3 - konkretny, mierzalny wynik"
  ] lub null,
  "linkedinUrl": "https://linkedin.com/in/... (jeśli dostępny)" lub null,
  "location": "Miasto, Kraj" lub null
}

WAŻNE:
- Jeśli jakiejś informacji nie ma w CV, użyj null lub pustej tablicy []
- Zwróć TYLKO poprawny JSON, bez dodatkowego tekstu ani komentarzy
- Upewnij się że JSON jest poprawnie sformatowany (prawidłowe cudzysłowy, przecinki, etc.)`;

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
