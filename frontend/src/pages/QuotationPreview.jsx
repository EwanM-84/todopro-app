import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function QuotationPreview() {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state;

  if (!data) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-4xl mx-auto bg-white border border-[#DAA520]/30 p-6 rounded-xl shadow-lg">
          <h1 className="text-xl font-bold text-[#DAA520] mb-6">No Quotation Data Available</h1>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-[#DAA520] text-white rounded-lg hover:bg-[#DAA520]/90 transition-colors"
          >
            Return to Calculator
          </button>
        </div>
      </div>
    );
  }

  const { clientInfo, days, selectedProducts, runningTotal, subtotal, vat, finalTotal, notes } = data;

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#DAA520]">Quotation Preview</h1>
          <div className="space-x-4">
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Return to Calculator
            </button>
          </div>
        </div>

        <div className="bg-white border border-[#DAA520]/30 p-6 rounded-xl shadow-lg">
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
        </div>
      </div>
    </div>
  );
}

export default QuotationPreview;