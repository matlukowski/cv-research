# 🚀 Quick Start - Local Development Setup

## Szybki start (Windows)

### 1. Uruchom lokalną bazę danych Postgres

**Wymagania:**
- Docker Desktop zainstalowany i uruchomiony

**Komendy:**
```powershell
# Uruchom Postgres w tle
docker compose up -d

# Sprawdź czy działa
docker ps
```

Powinieneś zobaczyć kontener `magnet_prompt_postgres` running na porcie `54322`.

### 2. Wygeneruj i zastosuj migracje do bazy

```powershell
# Wygeneruj SQL z Drizzle schema
pnpm db:generate

# Zastosuj migracje do lokalnej bazy
pnpm db:migrate
```

### 3. (Opcjonalnie) Zaseeduj bazę przykładowymi danymi

```powershell
pnpm db:seed
```

### 4. Uruchom aplikację

```powershell
pnpm dev
```

Aplikacja będzie dostępna na: http://localhost:3000

---

## Zatrzymanie bazy danych

```powershell
# Zatrzymaj (dane zostają)
docker compose stop

# Zatrzymaj i usuń (usuwa także dane!)
docker compose down -v
```

---

## Troubleshooting

### ❌ "getaddrinfo ENOTFOUND" lub "ETIMEDOUT"
**Problem:** Baza danych nie jest uruchomiona  
**Rozwiązanie:** `docker compose up -d`

### ❌ "Port 54322 already in use"
**Problem:** Coś już zajmuje port 54322  
**Rozwiązanie:** 
- Zatrzymaj inne instancje Postgres
- Albo zmień port w `docker-compose.yml` (np. `"54323:5432"`) i w `.env` (POSTGRES_URL)

### ❌ Migracje nie działają
**Problem:** Baza nie ma najnowszego schema  
**Rozwiązanie:**
```powershell
pnpm db:generate  # Generuje nowe migracje
pnpm db:migrate   # Aplikuje je do bazy
```

---

## Przejście na Cloud Supabase (później)

Gdy będziesz gotowy do deploymentu:

1. W Supabase Dashboard → Database → Connection string, skopiuj "URI"
2. W `.env` (lub w ustawieniach deploymentu):
   ```
   POSTGRES_URL=postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```
3. Zastosuj migracje na cloud:
   ```powershell
   pnpm db:migrate
   ```

**Uwaga:** Drizzle działa identycznie z lokalnym Postgres i Supabase Postgres - to ta sama baza PostgreSQL!