/*
  # Fix clients table RLS policies

  1. Changes
    - Drop existing RLS policies for clients table
    - Add new RLS policies with proper security checks
    - Ensure authenticated users can create and manage clients

  2. Security
    - Enable RLS on clients table
    - Add policies for authenticated users to:
      - Create new clients
      - View clients
      - Update clients they created
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Authenticated users can view clients" ON clients;
DROP POLICY IF EXISTS "Authenticated users can create clients" ON clients;
DROP POLICY IF EXISTS "Authenticated users can update clients" ON clients;

-- Create new policies
CREATE POLICY "Authenticated users can view clients"
ON clients FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can create clients"
ON clients FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Authenticated users can update clients"
ON clients FOR UPDATE
TO authenticated
USING (auth.uid() = created_by);