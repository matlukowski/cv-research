import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import dotenv from 'dotenv';

dotenv.config();

// Default to a local Postgres instance if POSTGRES_URL is not set.
// This matches the docker-compose setup used by lib/db/setup.ts
const DATABASE_URL =
  process.env.POSTGRES_URL ?? 'postgresql://postgres:postgres@localhost:54322/postgres';

export const client = postgres(DATABASE_URL);
export const db = drizzle(client, { schema });
