-- Add summary column to candidate_matches table
-- This stores the short AI-generated summary (1-2 sentences) from Grok 4 Fast

ALTER TABLE "candidate_matches" ADD COLUMN "summary" text;
