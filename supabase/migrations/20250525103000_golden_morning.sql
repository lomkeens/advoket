/*
  # Add firm settings table

  1. Changes
    - Create firm_settings table
    - Add RLS policies
    - Link to organization_settings

  2. Notes
    - Each user has one firm settings record
    - Stores firm contact and business information
    - Connected to organization prefix
*/

-- Create firm_settings table
CREATE TABLE IF NOT EXISTS firm_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  firm_name TEXT NOT NULL,
  firm_type TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  country TEXT,
  website TEXT,
  tax_id TEXT,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT unique_user_firm_settings UNIQUE (user_id)
);

-- Enable RLS
ALTER TABLE firm_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own firm settings"
ON firm_settings FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own firm settings"
ON firm_settings FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own firm settings"
ON firm_settings FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Add trigger for updating timestamps
CREATE TRIGGER update_firm_settings_timestamp
  BEFORE UPDATE ON firm_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();
