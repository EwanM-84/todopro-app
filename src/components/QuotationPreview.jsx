import React from 'react';
import { supabase } from '../lib/supabase';

function QuotationPreview({ clientInfo, days, selectedProducts, runningTotal, subtotal, vat, finalTotal, notes }) {
  const handleSaveQuote = async () => {
    try {
      // First, create client with user_id
      const { data: client, error: clientError } = await supabase
        .from('clients')
        .insert({
          name: clientInfo.name,
          address: clientInfo.address,
          phone: clientInfo.phone,
          email: clientInfo.email,
          die_nie: clientInfo.dieNie,
          user_id: (await supabase.auth.getUser()).data.user.id
        })
        .select()
        .single();

      if (clientError) throw clientError;

      // Then create calculation with user_id
      const { data: calculation, error: calcError } = await supabase
        .from('calculations')
        .insert({
          client_id: client.id,
          days,
          product_costs: runningTotal,
          subtotal,
          vat,
          final_total: finalTotal,
          notes,
          user_id: (await supabase.auth.getUser()).data.user.id
        })
        .select()
        .single();

      if (calcError) throw calcError;

      // Finally, create calculation products
      const calculationProducts = selectedProducts.map(product => ({
        calculation_id: calculation.id,
        product_id: product.id,
        units: product.units,
        cost: product.cost
      }));

      const { error: productsError } = await supabase
        .from('calculation_products')
        .insert(calculationProducts);

      if (productsError) throw productsError;

      alert('Quote saved successfully!');
    } catch (error) {
      console.error('Error saving quote:', error);
      alert('Failed to save quote. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white border border-[#DAA520]/30 p-6 rounded-xl shadow-lg">
      <h1 className="text-xl font-bold text-[#DAA520] mb-6">Quotation Preview</h1>
      
      {/* Client Information */}
      <div className="mb-6">
        <h2 className="font-semibold text-[#DAA520] mb-2">Client Information</h2>
        <div className="grid grid-cols-2 gap-2 text-gray-800">
          <p>Name: {clientInfo.name || 'Not provided'}</p>
          <p>Phone: {clientInfo.phone || 'Not provided'}</p>
          <p>Email: {clientInfo.email || 'Not provided'}</p>
          <p>DIE/NIE: {clientInfo.dieNie || 'Not provided'}</p>
          <p className="col-span-2">Address: {clientInfo.address || 'Not provided'}</p>
        </div>
      </div>

      {/* Work Details */}
      <div className="mb-6">
        <h2 className="font-semibold text-[#DAA520] mb-2">Work Details</h2>
        <p className="text-gray-800">Days of Work: {days}</p>
      </div>

      {/* Selected Products */}
      <div className="mb-6">
        <h2 className="font-semibold text-[#DAA520] mb-2">Selected Products</h2>
        {selectedProducts.map((product, index) => (
          <p key={index} className="text-gray-800">
            {product.name}: {product.units} units (€{product.cost.toFixed(2)})
          </p>
        ))}
      </div>

      {/* Notes */}
      {notes && (
        <div className="mb-6">
          <h2 className="font-semibold text-[#DAA520] mb-2">Notes</h2>
          <p className="text-gray-800 whitespace-pre-wrap">{notes}</p>
        </div>
      )}

      {/* Totals */}
      <div className="space-y-2">
        <p className="text-gray-800">Running Total: €{runningTotal.toFixed(2)}</p>
        <p className="text-gray-800">Subtotal: €{subtotal.toFixed(2)}</p>
        <p className="text-gray-800">VAT (7%): €{vat.toFixed(2)}</p>
        <p className="text-xl font-bold text-[#DAA520]">Final Total: €{finalTotal.toFixed(2)}</p>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex justify-end space-x-4">
        <button
          onClick={handleSaveQuote}
          className="px-6 py-3 bg-[#DAA520] text-white rounded-lg hover:bg-[#DAA520]/90 transition-colors font-semibold"
        >
          Save Quote
        </button>
        <button
          onClick={() => window.print()}
          className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-semibold"
        >
          Print Quote
        </button>
      </div>
    </div>
  );
}

export default QuotationPreview;