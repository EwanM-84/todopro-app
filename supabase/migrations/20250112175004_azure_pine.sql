/*
  # Fix RLS Policies for Quotation System

  1. Changes
    - Add default RLS policies for public access to products and settings
    - Update client and calculation policies to use user_id
    - Add cascading deletes for related records
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Ensure proper data isolation between users
*/

-- First clean up any existing policies
DROP POLICY IF EXISTS "Users can view their own clients" ON clients;
DROP POLICY IF EXISTS "Users can create clients" ON clients;
DROP POLICY IF EXISTS "Users can update their own clients" ON clients;
DROP POLICY IF EXISTS "Users can delete their own clients" ON clients;

DROP POLICY IF EXISTS "Users can view their own calculations" ON calculations;
DROP POLICY IF EXISTS "Users can create calculations" ON calculations;
DROP POLICY IF EXISTS "Users can update their own calculations" ON calculations;
DROP POLICY IF EXISTS "Users can delete their own calculations" ON calculations;

-- Add cascading deletes
ALTER TABLE calculations
DROP CONSTRAINT IF EXISTS calculations_client_id_fkey,
ADD CONSTRAINT calculations_client_id_fkey
  FOREIGN KEY (client_id)
  REFERENCES clients(id)
  ON DELETE CASCADE;

ALTER TABLE calculation_products
DROP CONSTRAINT IF EXISTS calculation_products_calculation_id_fkey,
ADD CONSTRAINT calculation_products_calculation_id_fkey
  FOREIGN KEY (calculation_id)
  REFERENCES calculations(id)
  ON DELETE CASCADE;

-- Products policies (public read, authenticated write)
CREATE POLICY "Enable read access for all users"
  ON products FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Enable write access for authenticated users"
  ON products FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Settings policies (public read, authenticated write)
CREATE POLICY "Enable read access for all users"
  ON settings FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Enable write access for authenticated users"
  ON settings FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Clients policies
CREATE POLICY "Users can view their own clients"
  ON clients FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id
  );

CREATE POLICY "Users can create their own clients"
  ON clients FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
  );

CREATE POLICY "Users can update their own clients"
  ON clients FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = user_id
  )
  WITH CHECK (
    auth.uid() = user_id
  );

CREATE POLICY "Users can delete their own clients"
  ON clients FOR DELETE
  TO authenticated
  USING (
    auth.uid() = user_id
  );

-- Calculations policies
CREATE POLICY "Users can view their own calculations"
  ON calculations FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id
  );

CREATE POLICY "Users can create their own calculations"
  ON calculations FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
  );

CREATE POLICY "Users can update their own calculations"
  ON calculations FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = user_id
  )
  WITH CHECK (
    auth.uid() = user_id
  );

CREATE POLICY "Users can delete their own calculations"
  ON calculations FOR DELETE
  TO authenticated
  USING (
    auth.uid() = user_id
  );

-- Calculation products policies
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

CREATE POLICY "Users can create their calculation products"
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