/*
  # Fix RLS Policies and Add User Authentication

  1. Changes
    - Drop existing policies to avoid conflicts
    - Add user_id foreign key constraints
    - Create new RLS policies with proper user authentication
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Ensure proper data isolation between users
*/

-- Add user_id foreign key constraints
ALTER TABLE clients
ADD CONSTRAINT clients_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES auth.users(id)
ON DELETE CASCADE;

ALTER TABLE calculations
ADD CONSTRAINT calculations_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES auth.users(id)
ON DELETE CASCADE;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own clients" ON clients;
DROP POLICY IF EXISTS "Users can create their own clients" ON clients;
DROP POLICY IF EXISTS "Users can update their own clients" ON clients;
DROP POLICY IF EXISTS "Users can delete their own clients" ON clients;

DROP POLICY IF EXISTS "Users can view their own calculations" ON calculations;
DROP POLICY IF EXISTS "Users can create their own calculations" ON calculations;
DROP POLICY IF EXISTS "Users can update their own calculations" ON calculations;
DROP POLICY IF EXISTS "Users can delete their own calculations" ON calculations;

-- Create new RLS policies for clients
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

-- Create new RLS policies for calculations
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

-- Create new RLS policies for calculation_products
CREATE POLICY "Users can view their calculation products"
ON calculation_products FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM calculations
    WHERE calculations.id = calculation_products.calculation_id
    AND calculations.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create calculation products"
ON calculation_products FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM calculations
    WHERE calculations.id = calculation_products.calculation_id
    AND calculations.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update their calculation products"
ON calculation_products FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM calculations
    WHERE calculations.id = calculation_products.calculation_id
    AND calculations.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM calculations
    WHERE calculations.id = calculation_products.calculation_id
    AND calculations.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete their calculation products"
ON calculation_products FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM calculations
    WHERE calculations.id = calculation_products.calculation_id
    AND calculations.user_id = auth.uid()
  )
);