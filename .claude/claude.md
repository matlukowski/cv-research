# Instrukcje dla Claude Code

## KRYTYCZNE: Migracje bazy danych

**Po każdej zmianie w schemacie bazy danych (`lib/db/schema.ts`) MUSISZ:**

1. **Wygenerować migrację**: Uruchom `pnpm db:generate` aby utworzyć plik migracji SQL
2. **Wykonać migrację**: Uruchom `pnpm db:migrate` aby zastosować zmiany w bazie danych
3. **Zweryfikować**: Sprawdź czy migracja się powiodła (brak błędów w konsoli)

### Kiedy wykonywać migracje:

- ✅ Dodanie nowej tabeli do `schema.ts`
- ✅ Dodanie/usunięcie kolumny w istniejącej tabeli
- ✅ Zmiana typu kolumny
- ✅ Dodanie/usunięcie klucza obcego (foreign key)
- ✅ Dodanie/usunięcie indeksu
- ✅ Zmiana wartości domyślnej kolumny

### OSTRZEŻENIE:

Jeśli nie wykonasz migracji po zmianie schema.ts:
- ❌ Aplikacja będzie wyświetlać błędy "column does not exist"
- ❌ Zapytania do bazy danych będą się wywalać
- ❌ Nowe funkcjonalności nie będą działać

### Workflow zmian w bazie danych:

```bash
# 1. Zmień schema.ts (dodaj/usuń tabelę, kolumnę itp.)
# 2. Wygeneruj migrację
pnpm db:generate

# 3. Zastosuj migrację
pnpm db:migrate

# 4. ZAWSZE zweryfikuj w bazie danych:
docker exec cv_research psql -U postgres -d postgres -c "\d nazwa_tabeli"
```

### Zasady bezpieczeństwa migracji:

#### ✅ CO ROBIĆ:
- **ZAWSZE** uruchamiaj `db:generate` i `db:migrate` zaraz po zmianie schema
- **ZAWSZE** weryfikuj strukturę tabeli po migracji
- **ZAWSZE** commituj pliki migracji wraz ze zmianami w schema.ts
- Sprawdzaj logi `db:migrate` czy nie ma błędów

#### ❌ CZEGO NIE ROBIĆ:
- **NIGDY** nie edytuj ręcznie plików SQL w `lib/db/migrations/`
- **NIGDY** nie uruchamiaj SQL bezpośrednio na bazie (poza awaryjnymi fix-ami)
- **NIGDY** nie skipuj `db:generate` przed `db:migrate`
- **NIGDY** nie usuwaj plików migracji bez resetu całego setupu
- **NIGDY** nie commituj zmian w schema.ts bez odpowiadającej migracji

### Weryfikacja po migracji:

```bash
# Sprawdź czy tabela ma poprawną strukturę
docker exec cv_research psql -U postgres -d postgres -c "\d nazwa_tabeli"

# Sprawdź historię migracji
docker exec cv_research psql -U postgres -d postgres -c "SELECT * FROM drizzle.__drizzle_migrations;"

# Sprawdź _journal.json
cat lib/db/migrations/meta/_journal.json
```

### Co robić gdy coś pójdzie nie tak:

Jeśli migracja się nie powiodła lub baza jest zdesynchronizowana:

1. **Backup bazy** (jeśli są ważne dane):
   ```bash
   docker exec cv_research pg_dump -U postgres postgres > backup.sql
   ```

2. **Reset migracji** (tylko dev, STRATA DANYCH):
   ```bash
   # Usuń wszystkie migracje
   rm -rf lib/db/migrations/*

   # Usuń tabele z bazy
   docker exec cv_research psql -U postgres -d postgres -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"

   # Wygeneruj od nowa
   pnpm db:generate
   pnpm db:migrate

   # Wyczyść historię migracji (zostaw tylko najnowszą)
   docker exec cv_research psql -U postgres -d postgres -c "SELECT * FROM drizzle.__drizzle_migrations;"
   ```

3. **Weryfikuj** że wszystko działa:
   ```bash
   docker exec cv_research psql -U postgres -d postgres -c "\dt"
   ```

---

## KRYTYCZNE: Aktualizacja dokumentacji

**Po każdej zmianie w kodzie MUSISZ zaktualizować plik `project_summary.md`**

Ten plik jest używany przez sub-agenta do optymalizacji kodu i usuwania zbędnych plików.

### Co aktualizować w project_summary.md:

- Dodane/usunięte pliki i ich przeznaczenie
- Nowe funkcjonalności i komponenty
- Zmiany w strukturze projektu
- Zależności między modułami
- Usunięte/deprecated funkcjonalności

### Pełny opis projektu znajduje się w: `project_summary.md`
