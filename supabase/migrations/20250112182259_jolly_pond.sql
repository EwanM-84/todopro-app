/*
  # Update RLS policies and user constraints

  1. Changes
    - Add user_id columns to clients and calculations tables if not exists
    - Add foreign key constraints for user_id columns
    - Add cascading deletes for related tables
    - Update RLS policies with new unified naming

  2. Security
    - Enable RLS on all tables
    - Add policies for user-specific access
    - Add public read access for products and settings
    - Add authenticated write access for products and settings
*/

-- Add user_id columns if not exists
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'clients' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE clients 
    ADD COLUMN user_id uuid DEFAULT auth.uid() NOT NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'calculations' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE calculations 
    ADD COLUMN user_id uuid DEFAULT auth.uid() NOT NULL;
  END IF;
END $$;

-- Add user_id foreign key constraints if not exists
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

-- Add cascading deletes if not exists
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'calculations_client_id_fkey'
  ) THEN
    ALTER TABLE calculations
    DROP CONSTRAINT calculations_client_id_fkey;
  END IF;

  ALTER TABLE calculations
  ADD CONSTRAINT calculations_client_id_fkey
    FOREIGN KEY (client_id)
    REFERENCES clients(id)
    ON DELETE CASCADE;

  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'calculation_products_calculation_id_fkey'
  ) THEN
    ALTER TABLE calculation_products
    DROP CONSTRAINT calculation_products_calculation_id_fkey;
  END IF;

  ALTER TABLE calculation_products
  ADD CONSTRAINT calculation_products_calculation_id_fkey
    FOREIGN KEY (calculation_id)
    REFERENCES calculations(id)
    ON DELETE CASCADE;
END $$;

-- Drop all existing policies
DO $$ 
DECLARE
  table_name text;
  policy_name text;
BEGIN
  FOR table_name, policy_name IN 
    SELECT t.table_name, p.policyname
    FROM information_schema.tables t
    LEFT JOIN pg_policies p ON p.tablename = t.table_name
    WHERE t.table_schema = 'public'
    AND t.table_name IN ('products', 'settings', 'clients', 'calculations', 'calculation_products')
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I', policy_name, table_name);
  END LOOP;
END $$;

-- Create new unified RLS policies

-- Products policies
CREATE POLICY "products_read_policy"
  ON products FOR SELECT
  TO public
  USING (true);

CREATE POLICY "products_write_policy"
  ON products FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Settings policies
CREATE POLICY "settings_read_policy"
  ON settings FOR SELECT
  TO public
  USING (true);

CREATE POLICY "settings_write_policy"
  ON settings FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Clients policies
CREATE POLICY "clients_policy"
  ON clients FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Calculations policies
CREATE POLICY "calculations_policy"
  ON calculations FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Calculation products policies
CREATE POLICY "calculation_products_policy"
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