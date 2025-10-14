-- Add missing columns to candidates table
ALTER TABLE "candidates" ADD COLUMN "years_of_experience" integer;
ALTER TABLE "candidates" ADD COLUMN "technical_skills" jsonb;
ALTER TABLE "candidates" ADD COLUMN "soft_skills" jsonb;
ALTER TABLE "candidates" ADD COLUMN "certifications" jsonb;
ALTER TABLE "candidates" ADD COLUMN "languages" jsonb;
ALTER TABLE "candidates" ADD COLUMN "key_achievements" jsonb;

-- Rename existing skills column to match new schema (optional - if data exists)
-- If you have existing data in 'skills', you may want to migrate it to 'technical_skills'
-- Otherwise, the old 'skills' column can coexist or be dropped later
