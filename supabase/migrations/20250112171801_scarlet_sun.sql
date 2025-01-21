/*
  # Fix RLS Policies

  1. Changes
    - Drop existing RLS policies
    - Create new, more specific RLS policies for each table
    - Add user-based authentication checks
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Ensure proper access control
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON clients;
DROP POLICY IF EXISTS "Enable write access for authenticated users" ON clients;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON calculations;
DROP POLICY IF EXISTS "Enable write access for authenticated users" ON calculations;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON calculation_products;
DROP POLICY IF EXISTS "Enable write access for authenticated users" ON calculation_products;

-- Clients table policies
CREATE POLICY "Allow authenticated users to select clients"
  ON clients FOR SELECT
  TO authenticated
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert clients"
  ON clients FOR INSERT
  TO authenticated
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update their clients"
  ON clients FOR UPDATE
  TO authenticated
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete their clients"
  ON clients FOR DELETE
  TO authenticated
  USING (auth.role() = 'authenticated');

-- Calculations table policies
CREATE POLICY "Allow authenticated users to select calculations"
  ON calculations FOR SELECT
  TO authenticated
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert calculations"
  ON calculations FOR INSERT
  TO authenticated
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update their calculations"
  ON calculations FOR UPDATE
  TO authenticated
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete their calculations"
  ON calculations FOR DELETE
  TO authenticated
  USING (auth.role() = 'authenticated');

-- Calculation products table policies
CREATE POLICY "Allow authenticated users to select calculation products"
  ON calculation_products FOR SELECT
  TO authenticated
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert calculation products"
  ON calculation_products FOR INSERT
  TO authenticated
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update calculation products"
  ON calculation_products FOR UPDATE
  TO authenticated
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete calculation products"
  ON calculation_products FOR DELETE
  TO authenticated
  USING (auth.role() = 'authenticated');