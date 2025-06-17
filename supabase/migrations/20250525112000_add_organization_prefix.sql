/*
  # Add organization prefix to firm settings

  1. Changes
    - Add organization_prefix column to firm_settings table
    - Add constraint for maximum prefix length
*/

-- Add organization_prefix column to firm_settings if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'firm_settings' AND column_name = 'organization_prefix') THEN
    ALTER TABLE firm_settings
    ADD COLUMN organization_prefix TEXT,
    ADD CONSTRAINT prefix_length CHECK (length(organization_prefix) <= 5);
  END IF;
END $$;

-- Update the migration history in schema_migrations
INSERT INTO schema_migrations (version)
VALUES ('20250525112000')
ON CONFLICT (version) DO NOTHING;
