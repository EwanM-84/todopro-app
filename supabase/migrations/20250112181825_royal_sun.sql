-- Add user_id column if not exists
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

-- Drop existing policies if they exist
DO $$ BEGIN
  -- Products policies
  DROP POLICY IF EXISTS "Enable read access for authenticated users" ON products;
  DROP POLICY IF EXISTS "Enable write access for authenticated users" ON products;
  DROP POLICY IF EXISTS "Products read access for all users" ON products;
  DROP POLICY IF EXISTS "Products write access for authenticated users" ON products;
  
  -- Settings policies
  DROP POLICY IF EXISTS "Enable read access for authenticated users" ON settings;
  DROP POLICY IF EXISTS "Enable write access for authenticated users" ON settings;
  DROP POLICY IF EXISTS "Settings read access for all users" ON settings;
  DROP POLICY IF EXISTS "Settings write access for authenticated users" ON settings;
  
  -- Clients policies
  DROP POLICY IF EXISTS "Users can view their own clients" ON clients;
  DROP POLICY IF EXISTS "Users can create their own clients" ON clients;
  DROP POLICY IF EXISTS "Users can update their own clients" ON clients;
  DROP POLICY IF EXISTS "Users can delete their own clients" ON clients;
  DROP POLICY IF EXISTS "Clients access for own user" ON clients;
  
  -- Calculations policies
  DROP POLICY IF EXISTS "Users can view their own calculations" ON calculations;
  DROP POLICY IF EXISTS "Users can create their own calculations" ON calculations;
  DROP POLICY IF EXISTS "Users can update their own calculations" ON calculations;
  DROP POLICY IF EXISTS "Users can delete their own calculations" ON calculations;
  DROP POLICY IF EXISTS "Calculations access for own user" ON calculations;
  
  -- Calculation products policies
  DROP POLICY IF EXISTS "Users can view their calculation products" ON calculation_products;
  DROP POLICY IF EXISTS "Users can create their calculation products" ON calculation_products;
  DROP POLICY IF EXISTS "Users can update their calculation products" ON calculation_products;
  DROP POLICY IF EXISTS "Users can delete their calculation products" ON calculation_products;
  DROP POLICY IF EXISTS "Calculation products access through user calculations" ON calculation_products;
END $$;

-- Create new RLS policies
CREATE POLICY "User access to own clients"
  ON clients FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "User access to own calculations"
  ON calculations FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Public read access to products"
  ON products FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated write access to products"
  ON products FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public read access to settings"
  ON settings FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated write access to settings"
  ON settings FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "User access to calculation products"
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