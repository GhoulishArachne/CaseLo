-- Migration: Add report field to cases table
-- Adds TEXT field to store case report content

ALTER TABLE cases
ADD COLUMN report TEXT;

-- Verify the column was added
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'cases'
ORDER BY ordinal_position;
