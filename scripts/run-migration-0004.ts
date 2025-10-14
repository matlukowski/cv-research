/**
 * Manually run migration 0004: Add summary column to candidate_matches
 * Run with: npx tsx scripts/run-migration-0004.ts
 */

import { db } from '../lib/db/drizzle';
import { sql } from 'drizzle-orm';
import * as fs from 'fs';
import * as path from 'path';

async function runMigration() {
  console.log('Running migration 0004: Add summary column to candidate_matches...');

  try {
    // Read the migration SQL file
    const migrationPath = path.join(__dirname, '../lib/db/migrations/0004_add_candidate_matches_summary.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf-8');

    console.log('Migration SQL:');
    console.log(migrationSQL);
    console.log('');

    // Execute the migration
    await db.execute(sql.raw(migrationSQL));

    console.log('✅ Migration completed successfully!');
    console.log('Column "summary" has been added to candidate_matches table.');

  } catch (error: any) {
    if (error.message?.includes('already exists')) {
      console.log('⚠️  Column "summary" already exists in the table. Migration skipped.');
    } else {
      console.error('❌ Migration failed:', error);
      throw error;
    }
  }
}

// Run migration
runMigration()
  .then(() => {
    console.log('\nMigration script finished. Exiting...');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\nMigration script failed:', error);
    process.exit(1);
  });
