/*
  # Add client and case numbering system

  1. Changes
    - Add organization prefix and sequential numbering to clients
    - Add case numbering fields to cases
    - Add unique constraints for client and case numbers
    - Create auto-numbering functions and triggers

  2. Notes
    - Client number format: AAK/001
    - Case number format: AAK/001/DV/01/2025
*/

-- Add organization prefix column to clients
ALTER TABLE clients 
ADD COLUMN organization_prefix TEXT NOT NULL DEFAULT 'AAK',
ADD COLUMN sequential_number INTEGER;

-- Add case numbering columns to cases
ALTER TABLE cases
ADD COLUMN organization_prefix TEXT NOT NULL DEFAULT 'AAK',
ADD COLUMN matter_type TEXT,
ADD COLUMN case_number INTEGER,
ADD COLUMN case_year INTEGER DEFAULT EXTRACT(YEAR FROM CURRENT_TIMESTAMP);

-- Add unique constraints
ALTER TABLE clients
ADD CONSTRAINT unique_client_number UNIQUE (organization_prefix, sequential_number);

ALTER TABLE cases
ADD CONSTRAINT unique_case_number UNIQUE (organization_prefix, client_id, matter_type, case_number, case_year);

-- Create function to generate next client number
CREATE OR REPLACE FUNCTION generate_next_client_number()
RETURNS TRIGGER AS $$
BEGIN
  SELECT COALESCE(MAX(sequential_number), 0) + 1
  INTO NEW.sequential_number
  FROM clients
  WHERE organization_prefix = NEW.organization_prefix;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create function to generate next case number
CREATE OR REPLACE FUNCTION generate_next_case_number()
RETURNS TRIGGER AS $$
BEGIN
  -- Set the case year
  NEW.case_year := EXTRACT(YEAR FROM NEW.created_at)::INTEGER;
  
  -- Generate the next case number
  SELECT COALESCE(MAX(case_number), 0) + 1
  INTO NEW.case_number
  FROM cases
  WHERE 
    organization_prefix = NEW.organization_prefix
    AND client_id = NEW.client_id
    AND matter_type = NEW.matter_type
    AND case_year = NEW.case_year;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER set_client_number
BEFORE INSERT ON clients
FOR EACH ROW
EXECUTE FUNCTION generate_next_client_number();

CREATE TRIGGER set_case_number
BEFORE INSERT ON cases
FOR EACH ROW
EXECUTE FUNCTION generate_next_case_number();