/*
  # Initial Schema Setup for Todopro Calculator

  1. New Tables
    - `products`
      - `id` (uuid, primary key)
      - `code` (text, unique)
      - `name` (text)
      - `price_per_unit` (decimal)
      - `stock_needed` (decimal)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `clients`
      - `id` (uuid, primary key)
      - `name` (text)
      - `address` (text)
      - `phone` (text)
      - `email` (text)
      - `die_nie` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `calculations`
      - `id` (uuid, primary key)
      - `client_id` (uuid, foreign key)
      - `days` (integer)
      - `labor_cost` (decimal)
      - `product_costs` (decimal)
      - `total_stock_needed` (decimal)
      - `running_total` (decimal)
      - `admin_cost` (decimal)
      - `commission` (decimal)
      - `subtotal` (decimal)
      - `vat` (decimal)
      - `final_total` (decimal)
      - `notes` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `calculation_products`
      - `id` (uuid, primary key)
      - `calculation_id` (uuid, foreign key)
      - `product_id` (uuid, foreign key)
      - `units` (decimal)
      - `cost` (decimal)
      - `created_at` (timestamp)
    
    - `settings`
      - `id` (uuid, primary key)
      - `key` (text, unique)
      - `value` (jsonb)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to read/write their own data
*/

-- Create products table
CREATE TABLE products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  name text NOT NULL,
  price_per_unit decimal NOT NULL DEFAULT 0,
  stock_needed decimal NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create clients table
CREATE TABLE clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text,
  phone text,
  email text,
  die_nie text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create calculations table
CREATE TABLE calculations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES clients(id),
  days integer NOT NULL DEFAULT 0,
  labor_cost decimal NOT NULL DEFAULT 0,
  product_costs decimal NOT NULL DEFAULT 0,
  total_stock_needed decimal NOT NULL DEFAULT 0,
  running_total decimal NOT NULL DEFAULT 0,
  admin_cost decimal NOT NULL DEFAULT 0,
  commission decimal NOT NULL DEFAULT 0,
  subtotal decimal NOT NULL DEFAULT 0,
  vat decimal NOT NULL DEFAULT 0,
  final_total decimal NOT NULL DEFAULT 0,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create calculation_products table
CREATE TABLE calculation_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  calculation_id uuid REFERENCES calculations(id),
  product_id uuid REFERENCES products(id),
  units decimal NOT NULL DEFAULT 0,
  cost decimal NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create settings table
CREATE TABLE settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE calculations ENABLE ROW LEVEL SECURITY;
ALTER TABLE calculation_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for authenticated users" ON products
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable write access for authenticated users" ON products
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Enable read access for authenticated users" ON clients
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable write access for authenticated users" ON clients
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Enable read access for authenticated users" ON calculations
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable write access for authenticated users" ON calculations
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Enable read access for authenticated users" ON calculation_products
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable write access for authenticated users" ON calculation_products
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Enable read access for authenticated users" ON settings
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable write access for authenticated users" ON settings
  FOR ALL TO authenticated USING (true);

-- Insert default admin fee setting
INSERT INTO settings (key, value) VALUES ('admin_fee', '50');

-- Insert default products
INSERT INTO products (code, name, price_per_unit, stock_needed) VALUES
  ('DPC15', 'DPC15', 4.80, 0.00),
  ('DPC10', 'DPC10', 3.50, 0.00),
  ('DPC5', 'DPC5', 1.60, 0.00),
  ('CAPAG10', 'CapaG10', 7.00, 1.00),
  ('CAPAF5', 'CapaF5', 7.00, 0.50),
  ('PEXT', 'Pintura.ext', 1.67, 0.25),
  ('PINT', 'pintura.int', 1.00, 0.20),
  ('FCOAT', 'floorcoat', 4.44, 0.33),
  ('JUNTASL', 'JuntasL', 1.50, 0.50),
  ('JUNTASP', 'JuntasP', 0.75, 0.25),
  ('JCOM', 'JointCom', 1.00, 0.00),
  ('PWP', 'PladurWP', 1.70, 0.00),
  ('PN', 'pladurN', 1.40, 0.00),
  ('STEELP', 'SteelP', 1.00, 0.00),
  ('AMOHO', 'Anti-moho', 2.66, 0.00),
  ('SUPP', 'Supplies', 50.00, 0.00),
  ('BOLSAS', 'Bolsas', 0.30, 0.00),
  ('BASURA', 'basura', 90.00, 0.00),
  ('DAYS', 'Days', 200.00, 0.00);