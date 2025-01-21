/*
  # User Authentication and Row Level Security Update

  1. Changes
    - Add user_id columns to clients and calculations tables
    - Add foreign key constraints for user_id columns
    - Update RLS policies for all tables
    - Add cascading deletes for related tables

  2. Security
    - Enable RLS policies for all tables
    - Products and Settings: public read, authenticated write
    - Clients and Calculations: authenticated users can only access their own data
    - Calculation Products: authenticated users can only access products related to their calculations
*/

-- Add user_id column if not exists
ALTER TABLE clients 
ADD COLUMN IF NOT EXISTS user_id uuid DEFAULT auth.uid() NOT NULL;

ALTER TABLE calculations 
ADD COLUMN IF NOT EXISTS user_id uuid DEFAULT auth.uid() NOT NULL;

-- Add user_id foreign key constraints
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'clients_user_id_fkey'
  ) THEN
    ALTER TABLE clients
    ADD CONSTRAINT clients_user_id_fkey
    FOREIGN KEY (user_id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'calculations_user_id_fkey'
  ) THEN
    ALTER TABLE calculations
    ADD CONSTRAINT calculations_user_id_fkey
    FOREIGN KEY (user_id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE;
  END IF;
END $$;

-- Drop existing policies explicitly
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON products;
DROP POLICY IF EXISTS "Enable write access for authenticated users" ON products;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON settings;
DROP POLICY IF EXISTS "Enable write access for authenticated users" ON settings;
DROP POLICY IF EXISTS "Users can view their own clients" ON clients;
DROP POLICY IF EXISTS "Users can create their own clients" ON clients;
DROP POLICY IF EXISTS "Users can update their own clients" ON clients;
DROP POLICY IF EXISTS "Users can delete their own clients" ON clients;
DROP POLICY IF EXISTS "Users can view their own calculations" ON calculations;
DROP POLICY IF EXISTS "Users can create their own calculations" ON calculations;
DROP POLICY IF EXISTS "Users can update their own calculations" ON calculations;
DROP POLICY IF EXISTS "Users can delete their own calculations" ON calculations;
DROP POLICY IF EXISTS "Users can view their calculation products" ON calculation_products;
DROP POLICY IF EXISTS "Users can create their calculation products" ON calculation_products;
DROP POLICY IF EXISTS "Users can update their calculation products" ON calculation_products;
DROP POLICY IF EXISTS "Users can delete their calculation products" ON calculation_products;

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

-- Create new RLS policies

-- Products policies (public read, authenticated write)
CREATE POLICY "Products read access for all users"
  ON products FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Products write access for authenticated users"
  ON products FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Settings policies (public read, authenticated write)
CREATE POLICY "Settings read access for all users"
  ON settings FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Settings write access for authenticated users"
  ON settings FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Clients policies
CREATE POLICY "Clients access for own user"
  ON clients FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Calculations policies
CREATE POLICY "Calculations access for own user"
  ON calculations FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Calculation products policies
CREATE POLICY "Calculation products access through user calculations"
  ON calculation_products FOR ALL
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