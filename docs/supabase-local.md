# Supabase Local Environment (Windows-friendly)

This project uses Drizzle ORM with PostgreSQL. Supabase is PostgreSQL under the hood, so you can develop locally and migrate to Supabase later with the same migrations.

## Option A — Use Supabase CLI locally

1) Install prerequisites
- Docker Desktop
- Supabase CLI: https://supabase.com/docs/guides/cli

2) Initialize and start
```
supabase init
supabase start
```
This launches local services, including Postgres on port 54322.

3) Set your env
Add to .env (or .env.local if you prefer):
```
POSTGRES_URL=postgresql://postgres:postgres@localhost:54322/postgres
```

4) Run Drizzle migrations
```
pnpm db:generate
pnpm db:migrate
```

5) Stop services when done
```
supabase stop
```

## Option B — Use the included Docker Compose (from setup script)
If you used `pnpm db:setup`, it created a docker-compose.yml that runs Postgres on 54322. Ensure:
```
POSTGRES_URL=postgresql://postgres:postgres@localhost:54322/postgres
```
Then run Drizzle migrations (same as above).

## Migrating to hosted Supabase later
- In the Supabase dashboard, copy the Connection string (URI) and set it as POSTGRES_URL in your deployment environment.
- Apply the same Drizzle migrations against Supabase:
```
pnpm db:migrate
```
- For client-side use of supabase-js (optional), set:
```
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```
- Server-only tasks (if you add supabase-js on the server) can use:
```
SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY
```