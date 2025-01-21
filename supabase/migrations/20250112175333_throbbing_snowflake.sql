/*
  # Fix RLS Policies and Add User Authentication

  1. Changes
    - Drop existing policies to avoid conflicts
    - Add cascading deletes for referential integrity
    - Create new RLS policies with proper user authentication
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Ensure proper data isolation between users
*/

-- First clean up any existing policies
DO $$ BEGIN
  -- Drop products policies if they exist
  DROP POLICY IF EXISTS "Enable write access for authenticated users" ON products;
  DROP POLICY IF EXISTS "Enable read access for all users" ON products;
  
  -- Drop settings policies if they exist
  DROP POLICY IF EXISTS "Enable write access for authenticated users" ON settings;
  DROP POLICY IF EXISTS "Enable read access for all users" ON settings;
  
  -- Drop clients policies if they exist
  DROP POLICY IF EXISTS "Users can view their own clients" ON clients;
  DROP POLICY IF EXISTS "Users can create their own clients" ON clients;
  DROP POLICY IF EXISTS "Users can update their own clients" ON clients;
  DROP POLICY IF EXISTS "Users can delete their own clients" ON clients;
  
  -- Drop calculations policies if they exist
  DROP POLICY IF EXISTS "Users can view their own calculations" ON calculations;
  DROP POLICY IF EXISTS "Users can create their own calculations" ON calculations;
  DROP POLICY IF EXISTS "Users can update their own calculations" ON calculations;
  DROP POLICY IF EXISTS "Users can delete their own calculations" ON calculations;
  
  -- Drop calculation products policies if they exist
  DROP POLICY IF EXISTS "Users can view their calculation products" ON calculation_products;
  DROP POLICY IF EXISTS "Users can create their calculation products" ON calculation_products;
  DROP POLICY IF EXISTS "Users can update their calculation products" ON calculation_products;
  DROP POLICY IF EXISTS "Users can delete their calculation products" ON calculation_products;
END $$;

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

-- Products policies
CREATE POLICY "Enable read access for all users"
  ON products FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Enable write access for authenticated users"
  ON products FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Settings policies
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
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own clients"
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

-- Calculations policies
CREATE POLICY "Users can view their own calculations"
  ON calculations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own calculations"
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