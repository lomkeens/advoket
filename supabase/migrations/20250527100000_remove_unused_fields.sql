/*
  # Remove unused firm settings fields

  1. Changes
    - Remove tax_id, state, zip_code, and address fields from firm_settings table
*/

-- Create schema_migrations table if it doesn't exist
CREATE TABLE IF NOT EXISTS schema_migrations (
    version text PRIMARY KEY,
    statements text[],
    name text
);

-- Remove unused columns from firm_settings table
ALTER TABLE firm_settings 
  DROP COLUMN IF EXISTS tax_id,
  DROP COLUMN IF EXISTS state,
  DROP COLUMN IF EXISTS zip_code,
  DROP COLUMN IF EXISTS address;

-- Update the migration history
INSERT INTO schema_migrations (version)
VALUES ('20250527100000')
ON CONFLICT (version) DO NOTHING;
