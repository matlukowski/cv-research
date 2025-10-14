# 🎯 System Zarządzania CV - Kompletna Dokumentacja

System automatycznego pobierania i analizowania CV z Gmail przy użyciu GPT-5 mini.

---

## ✅ Co zostało zaimplementowane

### 🗄️ **Backend (100%)**

#### **1. Database Schema**
- ✅ `gmail_connections` - OAuth tokens dla Gmail
- ✅ `cvs` - metadata i sparsowane CV
- ✅ `candidates` - dane kandydatów wyekstrahowane przez AI
- ✅ `job_positions` - stanowiska pracy
- ✅ `candidate_matches` - wyniki AI matchowania

#### **2. Gmail Integration**
- ✅ OAuth 2.0 flow (connect + callback)
- ✅ Automatyczna synchronizacja emaili
- ✅ Ekstrakcja PDF attachments
- ✅ Token encryption (AES-256-GCM)
- ✅ Token refresh handling

**Files:**
- `lib/gmail/auth.ts` - OAuth helpers
- `lib/gmail/sync.ts` - Email synchronization logic
- `app/api/gmail/connect/route.ts` - Initiate OAuth
- `app/api/gmail/callback/route.ts` - Handle callback
- `app/api/gmail/sync/route.ts` - Sync endpoint

#### **3. AI Processing (GPT-5 mini)**
- ✅ CV validation (czy dokument to CV?)
- ✅ Data extraction (imię, nazwisko, doświadczenie, umiejętności)
- ✅ Candidate matching z rankingiem (0-100%)
- ✅ AI reasoning i summaries

**Files:**
- `lib/ai/cv-processor.ts` - CV validation & data extraction
- `lib/ai/candidate-matcher.ts` - AI-powered matching

**Modele używane:**
- `gpt-5-mini` with `responses.create()` API
- Reasoning effort: low/medium/high w zależności od zadania

#### **4. File Storage**
- ✅ Local filesystem storage
- ✅ Organized by team (`uploads/team_{id}/`)
- ✅ Unique filenames with hash
- ⚠️ Supabase Storage ready (not implemented yet)

**Files:**
- `lib/storage/file-storage.ts`

#### **5. API Endpoints**

**Gmail:**
- `GET /api/gmail/connect` - Get OAuth URL
- `GET /api/gmail/callback` - OAuth callback
- `POST /api/gmail/sync` - Sync CVs from Gmail
- `GET /api/gmail/sync` - Get sync status

**CVs:**
- `GET /api/cvs` - List all CVs
- `POST /api/cvs/process` - Process pending CVs with AI

**Job Positions:**
- `GET /api/positions` - List positions
- `POST /api/positions` - Create position
- `GET /api/positions/[id]` - Get position
- `PUT /api/positions/[id]` - Update position
- `DELETE /api/positions/[id]` - Delete position
- `POST /api/positions/[id]/match` - Match candidates with AI
- `GET /api/positions/[id]/match` - Get existing matches

---

### 🎨 **Frontend (100%)**

#### **1. CV Dashboard** (`/dashboard/cvs`)
- ✅ Gmail connection status
- ✅ "Connect Gmail" button z OAuth flow
- ✅ "Sync CVs" button
- ✅ "Process CVs" button (AI processing)
- ✅ CV list table z statusami
- ✅ Status badges (pending, processing, processed, rejected)
- ✅ Statistics (total, pending, processed)

**Files:**
- `app/(dashboard)/cvs/page.tsx`
- `app/(dashboard)/cvs/cv-dashboard.tsx`

#### **2. Job Positions Dashboard** (`/dashboard/positions`)
- ✅ Lista stanowisk (grid cards)
- ✅ "Add Position" button
- ✅ Position cards z podstawowymi info
- ✅ Quick actions (Edit, Delete, View Candidates)
- ✅ Status badges

**Files:**
- `app/(dashboard)/positions/page.tsx`
- `app/(dashboard)/positions/positions-list.tsx`

#### **3. New Position Form** (`/dashboard/positions/new`)
- ✅ Pełny formularz z wszystkimi polami
- ✅ Title, Description, Requirements, Responsibilities
- ✅ Location, Employment Type, Salary Range
- ✅ Validation i error handling
- ✅ Redirect do matching results po utworzeniu

**Files:**
- `app/(dashboard)/positions/new/page.tsx`
- `app/(dashboard)/positions/new/new-position-form.tsx`

#### **4. Candidate Matching Results** (`/dashboard/positions/[id]/matches`)
- ✅ "Find Candidates" button (AI matching)
- ✅ Ranked list (sorted by match score)
- ✅ Match score visualization (0-100)
- ✅ AI-generated summaries
- ✅ Strengths & Weaknesses lists
- ✅ Detailed AI analysis (expandable)
- ✅ Candidate contact info (email, phone, location)
- ✅ Color-coded scores (green/blue/yellow/red)

**Files:**
- `app/(dashboard)/positions/[id]/matches/page.tsx`
- `app/(dashboard)/positions/[id]/matches/candidate-matches.tsx`

#### **5. UI Components**
- ✅ Button, Card, Table, Badge
- ✅ Input, Label
- ✅ Toast notifications
- ✅ All components with proper styling

**Files:**
- `components/button.tsx`
- `components/card.tsx`
- `components/table.tsx`
- `components/badge.tsx`
- `components/input.tsx`
- `components/label.tsx`
- `hooks/use-toast.ts`

---

## 🚀 Quick Start

### 1. Konfiguracja

Wypełnij `.env` file:
```env
# OpenAI
OPENAI_API_KEY=sk-proj-...
OPENAI_MODEL=gpt-5-mini

# Google OAuth
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_REDIRECT_URI=http://localhost:3000/api/gmail/callback

# Encryption
ENCRYPTION_KEY=8289616562669d430ab419064fd791c270133beaf5d20930250b91146f6d16fa
```

**📖 Szczegółowa instrukcja:** Zobacz `SETUP_GUIDE.md`

### 2. Uruchom bazę danych

```bash
pnpm docker:up
```

### 3. Uruchom aplikację

```bash
pnpm dev
```

### 4. Testowanie funkcjonalności

1. **Zaloguj się** przez Clerk (http://localhost:3000)
2. **Przejdź do CV Dashboard** (http://localhost:3000/dashboard/cvs)
3. **Połącz Gmail** - Kliknij "Połącz z Gmail"
4. **Synchronizuj CV** - Kliknij "Synchronizuj CV"
5. **Przetwórz CV** - Kliknij "Przetwórz CV z AI"
6. **Dodaj stanowisko** (http://localhost:3000/dashboard/positions/new)
7. **Znajdź kandydatów** - Kliknij "Kandydaci" → "Znajdź kandydatów"

---

## 📊 Architektura Systemu

```
User → Gmail OAuth → Sync Emails → Extract PDFs
                                        ↓
                                   AI Validation (GPT-5 mini)
                                        ↓
                                   Parse Data (GPT-5 mini)
                                        ↓
                                   Save to Database
                                        ↓
Job Position → AI Matching (GPT-5 mini) → Ranked Results
```

---

## 🔧 Kluczowe Funkcje

### AI Processing Flow

1. **CV Validation** (`validateCV()`)
   - Input: PDF text
   - Model: GPT-5 mini (reasoning: low)
   - Output: `{isCV: boolean, confidence: 0-100, reason: string}`

2. **Data Extraction** (`extractCandidateData()`)
   - Input: PDF text
   - Model: GPT-5 mini (reasoning: medium)
   - Output: Structured candidate data (JSON)

3. **Candidate Matching** (`matchCandidatesForPosition()`)
   - Input: Job position + Candidate CV
   - Model: GPT-5 mini (reasoning: high)
   - Output: `{matchScore: 0-100, analysis, strengths, weaknesses}`

### Security Features

- ✅ OAuth tokens encrypted with AES-256-GCM
- ✅ Refresh token rotation
- ✅ Environment variables for secrets
- ✅ Clerk authentication
- ✅ API route protection

---

## 💰 Szacowane Koszty (GPT-5 mini)

Przy założeniu:
- 100 CV/miesiąc
- 50 job positions/miesiąc
- 50 matching operations/miesiąc

**Estymowany koszt: ~$10-20/miesiąc**

*(Zależy od aktualnego pricingu GPT-5 mini)*

---

## 📝 Co pozostało do zrobienia (opcjonalnie)

### Funkcjonalności dodatkowe:

1. **PDF Viewer** - Inline viewing CV w dashboardzie
2. **Supabase Storage** - Migracja z local storage
3. **Email Notifications** - Powiadomienia o nowych kandydatach
4. **Advanced Filters** - Filtrowanie kandydatów po umiejętnościach
5. **Export** - Export wyników do CSV/Excel
6. **Team Management** - Proper multi-team support
7. **Analytics** - Dashboard z statystykami
8. **Webhook Integration** - Auto-sync on new emails

### Improvements:

1. **Error Handling** - More robust error messages
2. **Loading States** - Better skeleton loaders
3. **Pagination** - For large CV/position lists
4. **Search** - Full-text search in CVs
5. **Batch Operations** - Bulk delete/process CVs

---

## 🐛 Troubleshooting

### Problem: Build timeout

**Rozwiązanie**: Normalny przy pierwszym buildzie. Ponowny build będzie szybszy.

### Problem: Gmail OAuth nie działa

**Rozwiązanie**:
1. Sprawdź Google Cloud Console credentials
2. Upewnij się że redirect URI jest poprawny
3. Sprawdź czy Gmail API jest włączone

### Problem: AI processing fails

**Rozwiązanie**:
1. Sprawdź `OPENAI_API_KEY` w `.env`
2. Sprawdź czy masz dostęp do `gpt-5-mini`
3. Sprawdź logi w terminalu

### Problem: Database connection error

**Rozwiązanie**:
```bash
pnpm docker:down
pnpm docker:up
pnpm db:migrate
```

---

## 📚 Dokumentacja Plików

### Core Files

| File | Purpose |
|------|---------|
| `lib/db/schema.ts` | Database schema (5 nowych tabel) |
| `lib/gmail/auth.ts` | Gmail OAuth logic |
| `lib/gmail/sync.ts` | Email synchronization |
| `lib/ai/cv-processor.ts` | AI CV processing |
| `lib/ai/candidate-matcher.ts` | AI candidate matching |
| `lib/storage/file-storage.ts` | File management |
| `lib/utils/encryption.ts` | Token encryption |

### API Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/gmail/connect` | GET | Start OAuth flow |
| `/api/gmail/callback` | GET | Handle OAuth callback |
| `/api/gmail/sync` | POST | Sync CVs from Gmail |
| `/api/cvs` | GET | List all CVs |
| `/api/cvs/process` | POST | Process CVs with AI |
| `/api/positions` | GET, POST | Job positions CRUD |
| `/api/positions/[id]/match` | POST | Match candidates |

### Pages

| Page | Purpose |
|------|---------|
| `/dashboard/cvs` | CV management |
| `/dashboard/positions` | Job positions list |
| `/dashboard/positions/new` | Create position |
| `/dashboard/positions/[id]/matches` | View candidates |

---

## ⭐ Status Projektu

### Completed Features (100%)

- ✅ Database schema & migrations
- ✅ Gmail API integration (OAuth 2.0)
- ✅ Email synchronization
- ✅ PDF extraction & storage
- ✅ AI CV validation (GPT-5 mini)
- ✅ AI data extraction (GPT-5 mini)
- ✅ AI candidate matching (GPT-5 mini)
- ✅ Job positions CRUD
- ✅ CV dashboard UI
- ✅ Job positions dashboard UI
- ✅ Matching results UI
- ✅ Toast notifications
- ✅ Error handling
- ✅ Setup documentation

### Ready for Production?

**MVP: TAK** ✅

Przed production:
1. Skonfiguruj production OAuth credentials
2. Zmień `ENCRYPTION_KEY`
3. Użyj managed PostgreSQL (Supabase/Neon)
4. Dodaj rate limiting
5. Setup monitoring (Sentry)

---

## 🎉 Gratulacje!

Masz teraz w pełni funkcjonalny system zarządzania CV z:
- 🤖 AI-powered CV analysis (GPT-5 mini)
- 📧 Automatyczna synchronizacja z Gmail
- 🎯 Inteligentne matchowanie kandydatów
- 📊 Profesjonalny dashboard
- 🔒 Bezpieczne przechowywanie danych

**Powodzenia w rekrutacji!** 🚀
