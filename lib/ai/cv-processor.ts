'use server';

import { db } from '../db/drizzle';
import { cvs, candidates, type NewCandidate } from '../db/schema';
import { eq } from 'drizzle-orm';
import { getFile } from '../storage/file-storage';
import { getAIProvider } from './providers';

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
 * Extract text from PDF buffer using pdfreader (simple, Node.js-native library)
 *
 * WHY parse PDF → text instead of sending PDF directly?
 * 1. Size reduction: 300KB PDF → 3-5KB text (99% reduction)
 * 2. API compatibility: OpenAI accepts text, not binary PDF
 * 3. Cost efficiency: Text uses ~1500 tokens vs impossible with binary
 * 4. Speed: Text parsing is instant vs alternatives (PDF→images→Vision API)
 * 5. Industry standard: All ATS systems (LinkedIn, Indeed) do the same
 *
 * For 1000 CVs: 5MB text vs 300MB PDF - massive difference!
 */
export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    console.log('[PDF] Buffer size:', buffer?.length || 0, 'bytes');

    if (!buffer || buffer.length === 0) {
      throw new Error('Invalid or empty buffer');
    }

    // Use pdfreader - simple, stable Node.js library (no worker issues)
    const { PdfReader } = require('pdfreader');

    return new Promise((resolve, reject) => {
      let fullText = '';
      let charCount = 0;
      const maxChars = 10000; // Limit to 10k chars for performance

      const reader = new PdfReader();

      reader.parseBuffer(buffer, (err: any, item: any) => {
        if (err) {
          console.error('[PDF] Parse error:', err);
          reject(err);
        } else if (!item) {
          // End of document
          const finalText = fullText.trim();
          console.log('[PDF] Extracted', finalText.length, 'characters');
          resolve(finalText);
        } else if (item.text) {
          // Add text with spacing
          if (charCount < maxChars) {
            fullText += item.text + ' ';
            charCount += item.text.length;
          }
        }
      });
    });
  } catch (error) {
    console.error('[PDF] Error parsing PDF:', error);
    throw new Error('Failed to extract text from PDF');
  }
}

/**
 * Validate if a document is a CV using AI
 */
export async function validateCV(
  pdfText: string,
  teamId: number
): Promise<CVValidationResult> {
  try {
    const aiProvider = await getAIProvider(teamId);

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

    const result = await aiProvider.chat({
      prompt,
      temperature: 0.3,
      jsonMode: true,
    });

    const parsed = JSON.parse(result.content || '{}');

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
 * Extract structured candidate data from CV text using AI
 */
export async function extractCandidateData(
  pdfText: string,
  teamId: number
): Promise<ExtractedCandidateData> {
  try {
    const aiProvider = await getAIProvider(teamId);

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

5. **Key Achievements**: Wybierz 3-5 najważniejszych osiągnięć kandydata z całego CV. Każde osiągnięcie powinno być:
   - KONKRETNE i MIERZALNE (liczby, procenty, konkretne rezultaty)
   - Bazowane na faktach z CV (nagrody, projekty, awanse, osiągnięcia biznesowe)
   - NIE ogólne stwierdzenia typu "dobra praca" czy "sukces projektu"
   - Przykłady: "Zwiększenie wydajności o 40%", "Zbudowanie zespołu 5 osób", "Nagroda Employee of the Year"

6. **EKSTRAKCJA DANYCH OSOBOWYCH** (NAJWAŻNIEJSZE!):
   ⚠️ KRYTYCZNE: Ekstraktuj dane osobowe DOKŁADNIE z tekstu CV powyżej. NIE generuj przykładowych ani losowych danych!

   - **firstName / lastName**: Szukaj w sekcji nagłówkowej CV, kontakt, dane osobowe
   - **email**: Szukaj adresu email w formacie xxx@yyy.zzz
   - **phone**: Szukaj numeru telefonu (format międzynarodowy z +)
   - **location**: Szukaj miasta/kraju zamieszkania

   ⛔ ZABRONIONE: NIE używaj przykładowych danych jak:
   - Imiona: "Jan", "John", "Jane", "Kowalski", "Doe", "Smith"
   - Email: "example.com", "test.com", "sample.com"
   - Telefony: "+48 123 456 789", "+1 234 567 8901"

   ✅ PRAWIDŁOWE działanie:
   - Jeśli dane są w CV → ekstraktuj dokładnie jak są
   - Jeśli danych NIE MA w CV → zwróć null (nie generuj!)
   - Sprawdź różne sekcje CV: nagłówek, stopka, sekcja "Kontakt", "O mnie"

FORMAT ODPOWIEDZI (struktura JSON):
{
  "firstName": "[EKSTRAKTUJ Z CV - dokładne imię kandydata lub null]",
  "lastName": "[EKSTRAKTUJ Z CV - dokładne nazwisko kandydata lub null]",
  "email": "[EKSTRAKTUJ Z CV - adres email lub null]",
  "phone": "[EKSTRAKTUJ Z CV - numer telefonu lub null]",
  "location": "[EKSTRAKTUJ Z CV - miasto/kraj lub null]",

  "summary": "[Wygeneruj profesjonalne podsumowanie 4-6 zdań na podstawie CV]",
  "yearsOfExperience": [Oblicz na podstawie dat w experience],

  "technicalSkills": ["Skill 1", "Skill 2", ...],
  "softSkills": ["Skill 1", "Skill 2", ...],

  "experience": [
    {
      "company": "Nazwa firmy z CV",
      "position": "Stanowisko z CV",
      "startDate": "YYYY-MM",
      "endDate": "YYYY-MM lub null",
      "description": "Opis obowiązków z CV"
    }
  ],

  "education": [
    {
      "institution": "Nazwa uczelni z CV",
      "degree": "Stopień/tytuł z CV",
      "field": "Kierunek studiów z CV",
      "graduationYear": "YYYY lub null"
    }
  ],

  "certifications": ["Certyfikat 1 z CV", "Certyfikat 2 z CV"],

  "languages": [
    {"language": "Język z CV", "level": "Poziom z CV"}
  ],

  "keyAchievements": [
    "Konkretne osiągnięcie z CV z liczbami/procentami",
    "Kolejne osiągnięcie z faktów w CV"
  ],

  "linkedinUrl": "URL LinkedIn z CV lub null"
}

WAŻNE - WALIDACJA:
- Jeśli jakiejś informacji nie ma w CV, użyj null lub pustej tablicy []
- ⚠️ NIE GENERUJ przykładowych danych osobowych! Jeśli nie ma w CV → null
- Sprawdź czy firstName/lastName NIE są przykładowe ("Jan", "John", "Doe") - jeśli tak, szukaj ponownie lub zwróć null
- Zwróć TYLKO poprawny JSON, bez dodatkowego tekstu ani komentarzy
- Upewnij się że JSON jest poprawnie sformatowany (prawidłowe cudzysłowy, przecinki, etc.)`;

    const result = await aiProvider.chat({
      prompt,
      temperature: 0.3,
      jsonMode: true,
    });

    const parsed: ExtractedCandidateData = JSON.parse(result.content || '{}');

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
    const validation = await validateCV(pdfText, cv.teamId);

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
    const candidateData = await extractCandidateData(pdfText, cv.teamId);

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
