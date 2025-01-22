import React from 'react';

function QuoteDetails({ quote, onClose }) {
  if (!quote) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Company Header */}
        <div className="bg-[#DAA520] text-white p-6 rounded-t-xl">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">TODOPRO CANARIAS S.L</h1>
            <div className="text-sm opacity-90">
              <p>Carretera General 10, La Camella</p>
              <p>Arona, Santa Cruz de Tenerife, 38627</p>
              <p>Tel: 604 98 00 12 | Email: hola@todopro.es</p>
              <p>Company S.L: B44751410</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Quote Header */}
          <div className="flex justify-between items-start border-b border-[#DAA520] pb-4">
            <div>
              <h2 className="text-2xl font-bold text-[#DAA520]">OFFICIAL QUOTATION</h2>
              <p className="text-gray-600 mt-1">Reference: #{quote.id.slice(0, 8)}</p>
              <p className="text-gray-600">Date: {quote.createdAt}</p>
            </div>
            <button
              onClick={onClose}
              className="text-[#DAA520] hover:text-[#B8860B] transition-colors text-2xl"
            >
              ×
            </button>
          </div>

          {/* Client Information */}
          <div className="bg-gradient-to-r from-[#DAA520]/10 to-transparent p-4 rounded-lg">
            <h3 className="text-xl font-bold text-[#DAA520] mb-3">Client Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[#DAA520] font-medium">Name</p>
                <p className="text-gray-800">{quote.clientInfo.name}</p>
              </div>
              {quote.clientInfo.phone && (
                <div>
                  <p className="text-[#DAA520] font-medium">Phone</p>
                  <p className="text-gray-800">{quote.clientInfo.phone}</p>
                </div>
              )}
              {quote.clientInfo.email && (
                <div>
                  <p className="text-[#DAA520] font-medium">Email</p>
                  <p className="text-gray-800">{quote.clientInfo.email}</p>
                </div>
              )}
              <div>
                <p className="text-[#DAA520] font-medium">Rental Duration</p>
                <p className="text-gray-800">{quote.days} {quote.days > 1 ? 'days' : 'day'}</p>
              </div>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-xl font-bold text-[#DAA520] mb-4">Equipment Details</h3>
            <div className="overflow-hidden rounded-lg border border-[#DAA520]">
              {/* Header */}
              <div className="bg-[#DAA520] text-white grid grid-cols-4 gap-4 px-4 py-2 font-medium">
                <div>Product</div>
                <div className="text-center">Quantity</div>
                <div className="text-right">Rate</div>
                <div className="text-right">Total</div>
              </div>
              {/* Products List */}
              <div className="divide-y divide-[#DAA520]/20">
                {quote.selectedProducts.map((product, index) => (
                  <div 
                    key={index}
                    className="grid grid-cols-4 gap-4 px-4 py-3 hover:bg-[#DAA520]/5 transition-colors"
                  >
                    <div className="font-medium text-gray-800">{product.name}</div>
                    <div className="text-center text-gray-600">{product.quantity}</div>
                    <div className="text-right text-gray-600">€{product.price.toFixed(2)}</div>
                    <div className="text-right font-medium text-[#DAA520]">
                      €{(product.price * product.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="bg-gradient-to-r from-[#DAA520]/10 to-transparent p-4 rounded-lg">
            <h3 className="text-xl font-bold text-[#DAA520] mb-3">Financial Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>€{quote.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xl font-bold">
                <span className="text-[#DAA520]">Total</span>
                <span className="text-[#DAA520]">€{quote.finalTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {quote.notes && (
            <div className="bg-gradient-to-r from-[#DAA520]/10 to-transparent p-4 rounded-lg">
              <h3 className="text-xl font-bold text-[#DAA520] mb-3">Notes</h3>
              <p className="text-gray-600 whitespace-pre-wrap">
                {quote.notes}
              </p>
            </div>
          )}

          {/* Footer */}
          <div className="text-center text-sm text-gray-600 border-t border-[#DAA520]/20 pt-4">
            <p>Thank you for choosing TODOPRO CANARIAS S.L</p>
            <p className="mt-1">For any questions, please contact us at:</p>
            <p className="text-[#DAA520]">Tel: 604 98 00 12 | Email: hola@todopro.es</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuoteDetails;