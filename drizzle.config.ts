import 'dotenv/config';
import type { Config } from 'drizzle-kit';

const dbUrl = process.env.POSTGRES_URL ?? 'postgresql://postgres:postgres@localhost:54322/postgres';

export default {
  schema: './lib/db/schema.ts',
  out: './lib/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: dbUrl,
  },
} satisfies Config;
