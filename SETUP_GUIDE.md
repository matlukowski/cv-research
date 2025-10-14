# 🚀 CV Management System - Setup Guide

Kompletny przewodnik konfiguracji systemu zarządzania CV z Gmail API i GPT-5 mini.

---

## 📋 Spis treści

1. [Wymagania](#wymagania)
2. [Konfiguracja Google Cloud Console (Gmail API)](#konfiguracja-google-cloud-console)
3. [Konfiguracja OpenAI API](#konfiguracja-openai-api)
4. [Zmienne środowiskowe](#zmienne-środowiskowe)
5. [Uruchomienie aplikacji](#uruchomienie-aplikacji)
6. [Testowanie API](#testowanie-api)
7. [Troubleshooting](#troubleshooting)

---

## Wymagania

- Node.js 18+
- pnpm (lub npm/yarn)
- Docker (dla PostgreSQL)
- Konto Google Cloud
- Konto OpenAI z dostępem do GPT-5 mini

---

## Konfiguracja Google Cloud Console

### Krok 1: Utwórz projekt w Google Cloud

1. Przejdź do [Google Cloud Console](https://console.cloud.google.com/)
2. Kliknij **"Select a project"** → **"New Project"**
3. Nazwij projekt (np. "CV Manager")
4. Kliknij **"Create"**

### Krok 2: Włącz Gmail API

1. W menu nawigacyjnym wybierz **"APIs & Services"** → **"Library"**
2. Wyszukaj **"Gmail API"**
3. Kliknij na Gmail API i naciśnij **"Enable"**

### Krok 3: Skonfiguruj OAuth Consent Screen

1. Przejdź do **"APIs & Services"** → **"OAuth consent screen"**
2. Wybierz **"External"** (lub Internal jeśli masz Google Workspace)
3. Wypełnij wymagane pola:
   - **App name**: CV Manager
   - **User support email**: Twój email
   - **Developer contact information**: Twój email
4. Kliknij **"Save and Continue"**

5. **Scopes** - Kliknij **"Add or Remove Scopes"**:
   - Znajdź i zaznacz: `https://www.googleapis.com/auth/gmail.readonly`
   - Znajdź i zaznacz: `https://www.googleapis.com/auth/userinfo.email`
   - Znajdź i zaznacz: `https://www.googleapis.com/auth/userinfo.profile`
   - Kliknij **"Update"** i **"Save and Continue"**

6. **Test users** (jeśli External):
   - Dodaj swój email jako test user
   - Kliknij **"Save and Continue"**

### Krok 4: Utwórz OAuth 2.0 Client ID

1. Przejdź do **"APIs & Services"** → **"Credentials"**
2. Kliknij **"Create Credentials"** → **"OAuth client ID"**
3. Wybierz **"Web application"**
4. Nazwij go (np. "CV Manager Web Client")
5. **Authorized redirect URIs** - Dodaj:
   ```
   http://localhost:3000/api/gmail/callback
   ```
   (W produkcji dodaj również: `https://twoja-domena.com/api/gmail/callback`)
6. Kliknij **"Create"**
7. **ZAPISZ** Client ID i Client Secret - będą potrzebne w `.env`!

---

## Konfiguracja OpenAI API

### Krok 1: Uzyskaj API Key

1. Przejdź do [OpenAI Platform](https://platform.openai.com/)
2. Zaloguj się na swoje konto
3. Przejdź do **"API Keys"**: https://platform.openai.com/api-keys
4. Kliknij **"Create new secret key"**
5. Nazwij klucz (np. "CV Manager")
6. **ZAPISZ** klucz - nie będzie więcej widoczny!

### Krok 2: Sprawdź dostęp do GPT-5 mini

1. Przejdź do **"Models"**: https://platform.openai.com/docs/models
2. Upewnij się, że masz dostęp do `gpt-5-mini`
3. Jeśli nie widzisz modelu, sprawdź:
   - Czy Twoje konto ma odpowiedni tier
   - Czy model jest dostępny w Twoim regionie

### Krok 3: Ustaw limity wydatków (opcjonalnie)

1. Przejdź do **"Billing"** → **"Limits"**
2. Ustaw **Hard limit** aby kontrolować koszty
3. Zalecam: $50-100/miesiąc dla małych/średnich zastosowań

---

## Zmienne środowiskowe

Twój plik `.env` powinien zawierać:

```env
# ===================================
# DATABASE
# ===================================
POSTGRES_URL=postgresql://postgres:postgres@localhost:54322/postgres

# ===================================
# AUTHENTICATION (Clerk)
# ===================================
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# ===================================
# AI / OpenAI (GPT-5 mini)
# ===================================
OPENAI_API_KEY=sk-proj-...  # ← WKLEJ TUTAJ
OPENAI_MODEL=gpt-5-mini

# ===================================
# GMAIL API (OAuth 2.0)
# ===================================
GOOGLE_CLIENT_ID=...apps.googleusercontent.com  # ← WKLEJ TUTAJ
GOOGLE_CLIENT_SECRET=GOCSPX-...  # ← WKLEJ TUTAJ
GOOGLE_REDIRECT_URI=http://localhost:3000/api/gmail/callback

# ===================================
# FILE STORAGE
# ===================================
STORAGE_TYPE=local
UPLOAD_DIR=uploads

# ===================================
# SECURITY / ENCRYPTION
# ===================================
ENCRYPTION_KEY=8289616562669d430ab419064fd791c270133beaf5d20930250b91146f6d16fa

# ===================================
# APPLICATION
# ===================================
BASE_URL=http://localhost:3000
NODE_ENV=development
```

**WAŻNE**: Nigdy nie commituj `.env` do git! Upewnij się, że `.env` jest w `.gitignore`.

---

## Uruchomienie aplikacji

### 1. Zainstaluj dependencies

```bash
pnpm install
```

### 2. Uruchom bazę danych

```bash
pnpm docker:up
```

### 3. Uruchom migracje (jeśli jeszcze nie)

```bash
pnpm db:generate
pnpm db:migrate
```

### 4. (Opcjonalnie) Seed database

```bash
pnpm db:seed
```

### 5. Uruchom development server

```bash
pnpm dev
```

Aplikacja będzie dostępna pod: http://localhost:3000

---

## Testowanie API

### Test 1: Sprawdź czy aplikacja działa

```bash
curl http://localhost:3000
```

Powinno zwrócić główną stronę aplikacji.

### Test 2: Gmail OAuth Connection

1. Otwórz przeglądarkę: http://localhost:3000/api/gmail/connect
2. Powinieneś otrzymać JSON z `authUrl`
3. Skopiuj URL i otwórz go w przeglądarce
4. Zaloguj się na Google i autoryzuj aplikację
5. Zostaniesz przekierowany z powrotem do aplikacji

### Test 3: Utwórz Job Position (przez API)

```bash
curl -X POST http://localhost:3000/api/positions \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Senior Full-Stack Developer",
    "description": "Szukamy doświadczonego programisty...",
    "requirements": "5+ lat doświadczenia w TypeScript, React, Node.js",
    "responsibilities": "Tworzenie nowych funkcjonalności...",
    "location": "Warszawa / Remote",
    "employmentType": "full-time"
  }'
```

**UWAGA**: Musisz być zalogowany przez Clerk. Alternatywnie przetestuj przez frontend gdy będzie gotowy.

### Test 4: Lista Job Positions

```bash
curl http://localhost:3000/api/positions
```

Powinno zwrócić listę stanowisk.

---

## Troubleshooting

### Problem: "Missing Google OAuth credentials"

**Rozwiązanie**: Sprawdź czy `GOOGLE_CLIENT_ID` i `GOOGLE_CLIENT_SECRET` są poprawnie ustawione w `.env`.

### Problem: "ENCRYPTION_KEY environment variable is not set"

**Rozwiązanie**: Wygeneruj nowy klucz:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
I dodaj do `.env` jako `ENCRYPTION_KEY`.

### Problem: OpenAI API error "Model not found"

**Rozwiązanie**:
1. Sprawdź czy masz dostęp do `gpt-5-mini`
2. Jeśli nie, zmień w `.env`: `OPENAI_MODEL=gpt-4o-mini` (jako fallback)

### Problem: Gmail API returns 403 Forbidden

**Rozwiązanie**:
1. Sprawdź czy Gmail API jest włączone w Google Cloud Console
2. Upewnij się, że dodałeś odpowiednie scopes w OAuth Consent Screen
3. Sprawdź czy Twój email jest dodany jako test user (dla External apps)

### Problem: Database connection failed

**Rozwiązanie**:
```bash
# Sprawdź czy kontener działa
docker ps

# Jeśli nie, uruchom ponownie
pnpm docker:up

# Sprawdź logi
pnpm docker:logs
```

### Problem: Migracje nie działają

**Rozwiązanie**:
```bash
# Usuń stare migracje i wygeneruj na nowo
rm -rf lib/db/migrations/*
pnpm db:generate
pnpm db:migrate
```

---

## 🔒 Bezpieczeństwo - Produkcja

### Przed deployment do produkcji:

1. **Zmień wszystkie klucze**:
   - Wygeneruj nowy `ENCRYPTION_KEY`
   - Użyj production keys od Clerk
   - Użyj production keys od OpenAI
   - Utwórz nowe OAuth credentials dla production URL

2. **Zaktualizuj redirect URI** w Google Cloud Console:
   ```
   https://twoja-domena.com/api/gmail/callback
   ```

3. **Użyj zarządzanego PostgreSQL**:
   - Supabase
   - Neon
   - AWS RDS
   - Railway

4. **Ustaw NODE_ENV**:
   ```env
   NODE_ENV=production
   ```

5. **Rate limiting**: Dodaj middleware dla rate limiting API

6. **Monitoring**: Skonfiguruj Sentry lub podobne

---

## 📞 Pomoc

Jeśli masz problemy:
1. Sprawdź sekcję [Troubleshooting](#troubleshooting)
2. Przeczytaj logi w terminalu
3. Sprawdź logi przeglądarki (Developer Tools → Console)
4. Upewnij się że wszystkie zmienne `.env` są poprawne

---

## ✅ Checklist gotowości

- [ ] PostgreSQL działa (`docker ps`)
- [ ] Migracje zastosowane (`pnpm db:migrate`)
- [ ] Gmail API włączone w Google Cloud Console
- [ ] OAuth 2.0 Client ID utworzone
- [ ] OpenAI API key dodany do `.env`
- [ ] `ENCRYPTION_KEY` wygenerowany
- [ ] Wszystkie zmienne `.env` wypełnione
- [ ] Aplikacja uruchamia się (`pnpm dev`)
- [ ] Gmail OAuth działa (test w przeglądarce)
- [ ] API endpoints odpowiadają

**Gdy wszystko zaznaczone** - możesz przejść do tworzenia frontendu! 🎉
