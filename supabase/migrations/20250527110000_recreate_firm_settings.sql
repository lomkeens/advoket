-- Completely recreate firm_settings table with only the required fields
DROP TABLE IF EXISTS firm_settings;

CREATE TABLE firm_settings (
    id uuid primary key default uuid_generate_v4(),
    firm_name text not null,
    city text,
    phone text,
    email text,
    website text,
    logo_url text,
    organization_id uuid references auth.users(id) on delete cascade,
    organization_prefix text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    CONSTRAINT prefix_length CHECK (length(organization_prefix) <= 5)
);

ALTER TABLE firm_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Firm settings are viewable by organization members"
  ON firm_settings FOR SELECT
  USING (auth.uid() = organization_id);
CREATE POLICY "Firm settings are insertable by organization admin"
  ON firm_settings FOR INSERT
  WITH CHECK (auth.uid() = organization_id);
CREATE POLICY "Firm settings are updatable by organization admin"
  ON firm_settings FOR UPDATE
  USING (auth.uid() = organization_id);

-- Update the migration history
CREATE TABLE IF NOT EXISTS schema_migrations (
    version text PRIMARY KEY,
    statements text[],
    name text
);
INSERT INTO schema_migrations (version)
VALUES ('20250527110000')
ON CONFLICT (version) DO NOTHING;
