/*
  # Fix profiles table RLS policy

  1. Changes
    - Add INSERT policy for profiles table to allow authenticated users to create their own profiles
    - This fixes the RLS violation when new users try to create their profile records

  2. Security
    - Users can only insert profiles where the id matches their auth.uid()
    - Maintains security while allowing profile creation
*/

-- Add INSERT policy for profiles table
CREATE POLICY "Users can create their own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);