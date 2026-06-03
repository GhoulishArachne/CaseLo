-- Migration: Simplify cases table
-- This migration removes unnecessary columns that are no longer used

-- Remove unused columns (if they exist)
ALTER TABLE cases
DROP COLUMN IF EXISTS classification CASCADE;

ALTER TABLE cases
DROP COLUMN IF EXISTS investigation_type CASCADE;

ALTER TABLE cases
DROP COLUMN IF EXISTS assigned_investigator CASCADE;

ALTER TABLE cases
DROP COLUMN IF EXISTS supervising_investigator CASCADE;

ALTER TABLE cases
DROP COLUMN IF EXISTS incident_id CASCADE;

ALTER TABLE cases
DROP COLUMN IF EXISTS summary CASCADE;

ALTER TABLE cases
DROP COLUMN IF EXISTS tags CASCADE;

ALTER TABLE cases
DROP COLUMN IF EXISTS related_case_ids CASCADE;

ALTER TABLE cases
DROP COLUMN IF EXISTS prior_complaint_ids CASCADE;

ALTER TABLE cases
DROP COLUMN IF EXISTS involved_person_ids CASCADE;

ALTER TABLE cases
DROP COLUMN IF EXISTS description CASCADE;

ALTER TABLE cases
DROP COLUMN IF EXISTS notes CASCADE;

-- Ensure title is NOT NULL if not already
ALTER TABLE cases
ALTER COLUMN title SET NOT NULL;

-- Verify the simplified schema
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'cases'
ORDER BY ordinal_position;
