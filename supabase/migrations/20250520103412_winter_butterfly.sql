/*
  # Add organization settings and improve client numbering

  1. Changes
    - Create organization_settings table
    - Add functions and triggers for client numbering
    - Add RLS policies for organization settings

  2. Notes
    - Each user has one organization settings record
    - Organization prefix is required for client numbering
    - Maximum prefix length is 5 characters
    - Client sequence is auto-generated per organization
*/

-- Create organization_settings table for client numbering
CREATE TABLE IF NOT EXISTS organization_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  organization_prefix TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT unique_user_settings UNIQUE (user_id),
  CONSTRAINT prefix_length CHECK (length(organization_prefix) <= 5)
);

-- Create RLS policies for organization_settings
ALTER TABLE organization_settings ENABLE ROW LEVEL SECURITY;

-- Allow users to view and manage their own organization settings
CREATE POLICY "Users can view their own organization settings"
ON organization_settings FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own organization settings"
ON organization_settings FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own organization settings"
ON organization_settings FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create function to auto-increment client sequence
CREATE OR REPLACE FUNCTION generate_client_sequence()
RETURNS TRIGGER AS $$
DECLARE
  next_seq INTEGER;
BEGIN
  -- Get the next sequence number for this organization
  SELECT COALESCE(MAX(sequential_number), 0) + 1
  INTO next_seq
  FROM clients
  WHERE organization_prefix = NEW.organization_prefix;

  -- Set the sequence number
  NEW.sequential_number := next_seq;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for client sequence
DROP TRIGGER IF EXISTS set_client_sequence ON clients;
CREATE TRIGGER set_client_sequence
  BEFORE INSERT ON clients
  FOR EACH ROW
  EXECUTE FUNCTION generate_client_sequence();
  
-- Add function for updating timestamps
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add timestamp update triggers
CREATE TRIGGER update_organization_settings_timestamp
  BEFORE UPDATE ON organization_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();
