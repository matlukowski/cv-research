/**
 * Manual migration script to add missing columns to candidates table
 * Run with: npx tsx scripts/migrate-candidates.ts
 */

import { db } from '../lib/db/drizzle';
import { sql } from 'drizzle-orm';

async function migrateCandidatesTable() {
  console.log('Starting migration: Adding missing columns to candidates table...');

  try {
    // Check if columns already exist
    const checkQuery = sql`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'candidates'
      AND column_name IN ('years_of_experience', 'technical_skills', 'soft_skills', 'certifications', 'languages', 'key_achievements')
    `;

    const result = await db.execute(checkQuery);
    const existingColumns = Array.isArray(result) ? result : (result.rows || []);
    console.log(`Found ${existingColumns.length} existing columns`);

    // Add years_of_experience if not exists
    if (!existingColumns.some((row: any) => row.column_name === 'years_of_experience')) {
      console.log('Adding years_of_experience column...');
      await db.execute(sql`ALTER TABLE candidates ADD COLUMN years_of_experience integer`);
      console.log('✓ Added years_of_experience');
    } else {
      console.log('✓ years_of_experience already exists');
    }

    // Add technical_skills if not exists
    if (!existingColumns.some((row: any) => row.column_name === 'technical_skills')) {
      console.log('Adding technical_skills column...');
      await db.execute(sql`ALTER TABLE candidates ADD COLUMN technical_skills jsonb`);
      console.log('✓ Added technical_skills');
    } else {
      console.log('✓ technical_skills already exists');
    }

    // Add soft_skills if not exists
    if (!existingColumns.some((row: any) => row.column_name === 'soft_skills')) {
      console.log('Adding soft_skills column...');
      await db.execute(sql`ALTER TABLE candidates ADD COLUMN soft_skills jsonb`);
      console.log('✓ Added soft_skills');
    } else {
      console.log('✓ soft_skills already exists');
    }

    // Add certifications if not exists
    if (!existingColumns.some((row: any) => row.column_name === 'certifications')) {
      console.log('Adding certifications column...');
      await db.execute(sql`ALTER TABLE candidates ADD COLUMN certifications jsonb`);
      console.log('✓ Added certifications');
    } else {
      console.log('✓ certifications already exists');
    }

    // Add languages if not exists
    if (!existingColumns.some((row: any) => row.column_name === 'languages')) {
      console.log('Adding languages column...');
      await db.execute(sql`ALTER TABLE candidates ADD COLUMN languages jsonb`);
      console.log('✓ Added languages');
    } else {
      console.log('✓ languages already exists');
    }

    // Add key_achievements if not exists
    if (!existingColumns.some((row: any) => row.column_name === 'key_achievements')) {
      console.log('Adding key_achievements column...');
      await db.execute(sql`ALTER TABLE candidates ADD COLUMN key_achievements jsonb`);
      console.log('✓ Added key_achievements');
    } else {
      console.log('✓ key_achievements already exists');
    }

    console.log('\n✅ Migration completed successfully!');

    // Verify final schema
    const finalCheckResult = await db.execute(sql`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'candidates'
      ORDER BY ordinal_position
    `);

    const finalColumns = Array.isArray(finalCheckResult) ? finalCheckResult : (finalCheckResult.rows || []);

    console.log('\nFinal candidates table schema:');
    finalColumns.forEach((row: any) => {
      console.log(`  - ${row.column_name}: ${row.data_type}`);
    });

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

// Run migration
migrateCandidatesTable()
  .then(() => {
    console.log('\nMigration script finished. Exiting...');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\nMigration script failed:', error);
    process.exit(1);
  });
