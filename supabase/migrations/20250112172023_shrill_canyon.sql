/*
  # Fix RLS Policies for Clients and Calculations

  1. Changes
    - Update RLS policies to properly handle authenticated users
    - Add user_id column to clients and calculations tables
    - Add policies to restrict access based on user ownership
    - Add default user_id values from auth.uid()

  2. Security
    - Enable RLS on all tables
    - Add user-based ownership checks
    - Ensure users can only access their own data
*/

-- Add user_id column to clients
ALTER TABLE clients 
ADD COLUMN IF NOT EXISTS user_id uuid DEFAULT auth.uid() NOT NULL;

-- Add user_id column to calculations
ALTER TABLE calculations 
ADD COLUMN IF NOT EXISTS user_id uuid DEFAULT auth.uid() NOT NULL;

-- Drop existing policies
DROP POLICY IF EXISTS "Allow authenticated users to select clients" ON clients;
DROP POLICY IF EXISTS "Allow authenticated users to insert clients" ON clients;
DROP POLICY IF EXISTS "Allow authenticated users to update their clients" ON clients;
DROP POLICY IF EXISTS "Allow authenticated users to delete their clients" ON clients;

DROP POLICY IF EXISTS "Allow authenticated users to select calculations" ON calculations;
DROP POLICY IF EXISTS "Allow authenticated users to insert calculations" ON calculations;
DROP POLICY IF EXISTS "Allow authenticated users to update their calculations" ON calculations;
DROP POLICY IF EXISTS "Allow authenticated users to delete their calculations" ON calculations;

-- Create new policies for clients table
CREATE POLICY "Users can view their own clients"
  ON clients FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create clients"
  ON clients FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own clients"
  ON clients FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own clients"
  ON clients FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create new policies for calculations table
CREATE POLICY "Users can view their own calculations"
  ON calculations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create calculations"
  ON calculations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own calculations"
  ON calculations FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own calculations"
  ON calculations FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);