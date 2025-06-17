/*
  # Add organization prefix to firm settings and fix firm name column

  1. Changes
    - Recreate firm_settings table with consistent column naming
    - Add organization_prefix column
    - Add constraint for maximum prefix length
*/

-- Drop the old firm_settings table if it exists
DROP TABLE IF EXISTS firm_settings;

-- Create firm_settings table with all required columns
CREATE TABLE IF NOT EXISTS firm_settings (
    id uuid primary key default uuid_generate_v4(),
    firm_name text not null,
    organization_prefix text,
    address text,
    city text,
    state text,
    zip_code text,
    phone text,
    email text,
    website text,
    tax_id text,
    logo_url text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    organization_id uuid references auth.users(id) on delete cascade,
    CONSTRAINT prefix_length CHECK (length(organization_prefix) <= 5)
);

-- Enable RLS
ALTER TABLE firm_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Firm settings are viewable by organization members"
  ON firm_settings FOR SELECT
  USING (auth.uid() = organization_id);

CREATE POLICY "Firm settings are insertable by organization admin"
  ON firm_settings FOR INSERT
  WITH CHECK (auth.uid() = organization_id);

CREATE POLICY "Firm settings are updatable by organization admin"
  ON firm_settings FOR UPDATE
  USING (auth.uid() = organization_id);

-- Create update_updated_at function and trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_firm_settings_updated_at
    BEFORE UPDATE ON firm_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Update the migration history in schema_migrations
INSERT INTO schema_migrations (version)
VALUES ('20250525113000')
ON CONFLICT (version) DO NOTHING;
