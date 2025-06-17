/*
  # Add organization prefix to firm settings

  1. Changes
    - Add organization_prefix column to firm_settings table
    - Add constraint for maximum prefix length
    - Update RLS policies
*/

-- Add organization_prefix column to firm_settings
ALTER TABLE firm_settings
ADD COLUMN organization_prefix TEXT,
ADD CONSTRAINT prefix_length CHECK (length(organization_prefix) <= 5);

-- Update the migration history in schema_migrations
INSERT INTO schema_migrations (version)
VALUES ('20250525110500')
ON CONFLICT (version) DO NOTHING;
