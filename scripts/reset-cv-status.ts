/**
 * Reset CV status from 'error' back to 'pending' for reprocessing
 * Run with: pnpm db:reset-cv-status
 */

import { db } from '../lib/db/drizzle';
import { cvs } from '../lib/db/schema';
import { eq, sql } from 'drizzle-orm';

async function resetCVStatus() {
  console.log('Starting CV status reset...');

  try {
    // Count CVs with error status
    const errorCVsResult = await db.execute(sql`
      SELECT COUNT(*) as count
      FROM cvs
      WHERE status = 'error'
    `);

    const errorCount = Array.isArray(errorCVsResult)
      ? errorCVsResult[0]?.count || 0
      : errorCVsResult.rows[0]?.count || 0;

    console.log(`Found ${errorCount} CV(s) with 'error' status`);

    if (errorCount === 0) {
      console.log('✅ No CVs to reset. All good!');
      return;
    }

    // Reset error CVs to pending
    const result = await db
      .update(cvs)
      .set({
        status: 'pending',
        processedAt: null,
      })
      .where(eq(cvs.status, 'error'));

    console.log(`✅ Successfully reset ${errorCount} CV(s) to 'pending' status`);

    // Show current status summary
    const statusSummary = await db.execute(sql`
      SELECT
        status,
        COUNT(*) as count
      FROM cvs
      GROUP BY status
      ORDER BY status
    `);

    const summaryRows = Array.isArray(statusSummary) ? statusSummary : (statusSummary.rows || []);

    console.log('\nCurrent CV status summary:');
    summaryRows.forEach((row: any) => {
      console.log(`  - ${row.status}: ${row.count}`);
    });

  } catch (error) {
    console.error('❌ Error resetting CV status:', error);
    throw error;
  }
}

// Run script
resetCVStatus()
  .then(() => {
    console.log('\nScript finished. Exiting...');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\nScript failed:', error);
    process.exit(1);
  });
