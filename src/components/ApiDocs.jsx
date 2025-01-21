import React from 'react';

function ApiDocs() {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-8">
      <div className="bg-white border border-[#DAA520]/30 p-6 rounded-xl shadow-lg">
        <h1 className="text-xl font-bold text-[#DAA520] mb-4">API Documentation</h1>
        
        <div className="space-y-6">
          {/* API Endpoints */}
          <section>
            <h2 className="text-lg font-semibold text-[#DAA520] mb-2">API Base URL</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <code>{supabaseUrl}</code>
            </div>
          </section>

          {/* Authentication */}
          <section>
            <h2 className="text-lg font-semibold text-[#DAA520] mb-2">Authentication</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p>Authentication is required for all API endpoints. Use the Supabase client library with your API key.</p>
              <pre className="bg-white p-4 rounded-lg overflow-x-auto mt-2">
{`import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  '${supabaseUrl}',
  'your-anon-key'
)`}
              </pre>
            </div>
          </section>

          {/* Database Schema */}
          <section>
            <h2 className="text-lg font-semibold text-[#DAA520] mb-2">Database Schema</h2>
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <div>
                <h3 className="font-medium mb-2">Products Table</h3>
                <pre className="bg-white p-4 rounded-lg overflow-x-auto">
{`{
  id: uuid,
  code: string,
  name: string,
  price_per_unit: decimal,
  stock_needed: decimal,
  created_at: timestamp,
  updated_at: timestamp
}`}
                </pre>
              </div>

              <div>
                <h3 className="font-medium mb-2">Clients Table</h3>
                <pre className="bg-white p-4 rounded-lg overflow-x-auto">
{`{
  id: uuid,
  name: string,
  address: string,
  phone: string,
  email: string,
  die_nie: string,
  created_at: timestamp,
  updated_at: timestamp
}`}
                </pre>
              </div>

              <div>
                <h3 className="font-medium mb-2">Calculations Table</h3>
                <pre className="bg-white p-4 rounded-lg overflow-x-auto">
{`{
  id: uuid,
  client_id: uuid,
  days: integer,
  labor_cost: decimal,
  product_costs: decimal,
  total_stock_needed: decimal,
  running_total: decimal,
  admin_cost: decimal,
  commission: decimal,
  subtotal: decimal,
  vat: decimal,
  final_total: decimal,
  notes: string,
  created_at: timestamp,
  updated_at: timestamp
}`}
                </pre>
              </div>

              <div>
                <h3 className="font-medium mb-2">Calculation Products Table</h3>
                <pre className="bg-white p-4 rounded-lg overflow-x-auto">
{`{
  id: uuid,
  calculation_id: uuid,
  product_id: uuid,
  units: decimal,
  cost: decimal,
  created_at: timestamp
}`}
                </pre>
              </div>

              <div>
                <h3 className="font-medium mb-2">Settings Table</h3>
                <pre className="bg-white p-4 rounded-lg overflow-x-auto">
{`{
  id: uuid,
  key: string,
  value: jsonb,
  created_at: timestamp,
  updated_at: timestamp
}`}
                </pre>
              </div>
            </div>
          </section>

          {/* API Examples */}
          <section>
            <h2 className="text-lg font-semibold text-[#DAA520] mb-2">API Examples</h2>
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <div>
                <h3 className="font-medium mb-2">Get Products</h3>
                <pre className="bg-white p-4 rounded-lg overflow-x-auto">
{`const { data: products, error } = await supabase
  .from('products')
  .select('*')`}
                </pre>
              </div>

              <div>
                <h3 className="font-medium mb-2">Create Client</h3>
                <pre className="bg-white p-4 rounded-lg overflow-x-auto">
{`const { data: client, error } = await supabase
  .from('clients')
  .insert({
    name: 'Client Name',
    address: 'Client Address',
    phone: 'Phone Number',
    email: 'email@example.com',
    die_nie: 'DIE/NIE Number'
  })
  .select()
  .single()`}
                </pre>
              </div>

              <div>
                <h3 className="font-medium mb-2">Create Calculation</h3>
                <pre className="bg-white p-4 rounded-lg overflow-x-auto">
{`// 1. Create calculation
const { data: calculation, error: calcError } = await supabase
  .from('calculations')
  .insert({
    client_id: 'client-uuid',
    days: 5,
    labor_cost: 1000,
    product_costs: 500,
    total_stock_needed: 10,
    running_total: 1500,
    admin_cost: 50,
    commission: 150,
    subtotal: 1700,
    vat: 119,
    final_total: 1819,
    notes: 'Calculation notes'
  })
  .select()
  .single()

// 2. Add calculation products
const { data: calcProducts, error: prodError } = await supabase
  .from('calculation_products')
  .insert([
    {
      calculation_id: calculation.id,
      product_id: 'product-uuid',
      units: 2,
      cost: 100
    }
  ])`}
                </pre>
              </div>

              <div>
                <h3 className="font-medium mb-2">Get Admin Fee</h3>
                <pre className="bg-white p-4 rounded-lg overflow-x-auto">
{`const { data: setting, error } = await supabase
  .from('settings')
  .select('value')
  .eq('key', 'admin_fee')
  .single()`}
                </pre>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default ApiDocs;