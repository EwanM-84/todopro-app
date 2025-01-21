import React from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import QuotePDF from './QuotePDF';

const QuotePreview = ({ quote, onClose, onSave }) => {
  if (!quote) return null;

  const handleSaveQuote = () => {
    // Save quote to localStorage
    const savedQuotes = JSON.parse(localStorage.getItem('quotes') || '[]');
    savedQuotes.push(quote);
    localStorage.setItem('quotes', JSON.stringify(savedQuotes));

    // Call onSave callback if provided
    if (onSave) {
      onSave();
    }

    // Close the preview
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Company Header */}
        <div className="bg-[#DAA520] p-6 rounded-t-xl">
          <div className="bg-white text-[#DAA520] p-6 rounded-lg">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-2">TODOPRO CANARIAS S.L</h1>
              <p className="text-xl mb-4">Reliable Solutions for Construction Needs</p>
              <div className="text-sm opacity-90 space-y-1">
                <p>Carretera General 10, La Camella</p>
                <p>Arona, Santa Cruz de Tenerife 38627</p>
                <p>Tel: +34 604 98 00 12 | Email: hola@todopro.es</p>
                <p>Company S.L: B44751410</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Quote Details */}
          <div className="flex justify-between items-start border-b border-[#DAA520] pb-4">
            <div>
              <h2 className="text-2xl font-bold text-[#DAA520]">QUOTATION</h2>
              <p className="text-gray-600 mt-1">Generated on {new Date().toLocaleDateString('en-GB')}</p>
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
                <p className="text-gray-800">{quote.clientInfo?.name || 'N/A'}</p>
              </div>
              {quote.clientInfo?.address && (
                <div>
                  <p className="text-[#DAA520] font-medium">Address</p>
                  <p className="text-gray-800">{quote.clientInfo.address}</p>
                </div>
              )}
              {quote.clientInfo?.phone && (
                <div>
                  <p className="text-[#DAA520] font-medium">Phone</p>
                  <p className="text-gray-800">{quote.clientInfo.phone}</p>
                </div>
              )}
              {quote.clientInfo?.email && (
                <div>
                  <p className="text-[#DAA520] font-medium">Email</p>
                  <p className="text-gray-800">{quote.clientInfo.email}</p>
                </div>
              )}
              {quote.clientInfo?.dieNie && (
                <div>
                  <p className="text-[#DAA520] font-medium">DIE/NIE</p>
                  <p className="text-gray-800">{quote.clientInfo.dieNie}</p>
                </div>
              )}
              <div>
                <p className="text-[#DAA520] font-medium">Rental Period</p>
                <p className="text-gray-800">{quote.days} {quote.days > 1 ? 'days' : 'day'}</p>
              </div>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-xl font-bold text-[#DAA520] mb-4">Products Selected</h3>
            <div className="overflow-hidden rounded-lg border border-[#DAA520]">
              {/* Header */}
              <div className="bg-[#DAA520] text-white grid grid-cols-4 gap-4 px-4 py-2 font-medium">
                <div>Product</div>
                <div className="text-center">Quantity</div>
                <div className="text-right">Price/Day</div>
                <div className="text-right">Total</div>
              </div>
              {/* Products List */}
              <div className="divide-y divide-[#DAA520]/20">
                {quote.selectedProducts?.map((product, index) => (
                  <div 
                    key={index}
                    className="grid grid-cols-4 gap-4 px-4 py-3 hover:bg-[#DAA520]/5 transition-colors"
                  >
                    <div className="font-medium text-gray-800">{product.name}</div>
                    <div className="text-center text-gray-600">{product.quantity}</div>
                    <div className="text-right text-gray-600">€{product.price.toFixed(2)}</div>
                    <div className="text-right font-medium text-[#DAA520]">
                      €{product.totalPrice.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="bg-gradient-to-r from-[#DAA520]/10 to-transparent p-4 rounded-lg">
            <h3 className="text-xl font-bold text-[#DAA520] mb-3">Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>€{quote.subtotal?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>VAT (7%)</span>
                <span>€{quote.vat?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between text-xl font-bold">
                <span className="text-[#DAA520]">Total</span>
                <span className="text-[#DAA520]">€{quote.finalTotal?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between text-gray-600 pt-2 border-t border-[#DAA520]/20">
                <span>Required Deposit (50%)</span>
                <span>€{(quote.finalTotal * 0.5)?.toFixed(2) || '0.00'}</span>
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

          {/* Terms and Conditions */}
          <div className="mt-8 p-6 bg-gradient-to-r from-[#DAA520]/10 to-transparent rounded-lg">
            <h3 className="text-xl font-bold text-[#DAA520] mb-4">GARANTÍA DE SERVICIOS Y PRODUCTOS</h3>
            <p className="text-gray-700 mb-6 text-justify">
              TODOPRO CANARIAS S.L. ofrece al Cliente una garantía integral de mano de obra por un periodo de dos años. Cada producto que instalamos cuenta con un periodo de garantía individual de hasta 30 años. Se proporcionará una certificación individual para cada producto al finalizar los trabajos, de acuerdo con las especificaciones del fabricante.
            </p>

            <h3 className="text-xl font-bold text-[#DAA520] mb-4">CONDICIONES DE PAGO</h3>
            <ul className="list-disc list-inside text-gray-700 mb-6">
              <li>50% del importe total al inicio de los trabajos</li>
              <li>50% restante a la finalización de los trabajos</li>
            </ul>

            <h3 className="text-xl font-bold text-[#DAA520] mb-4">VALIDEZ DE LA OFERTA</h3>
            <p className="text-gray-700 mb-6">
              Esta oferta tiene una validez de 30 días naturales desde la fecha de emisión.
            </p>

            <h3 className="text-xl font-bold text-[#DAA520] mb-4">ACEPTACIÓN</h3>
            <p className="text-gray-700 mb-6 text-justify">
              La aceptación de este presupuesto implica la conformidad con todas las condiciones especificadas en el mismo. Para formalizar la aceptación, se requiere la firma del cliente y el pago inicial según las condiciones establecidas.
            </p>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-gray-600 border-t border-[#DAA520]/20 pt-4">
            <p>Thank you for choosing TODOPRO CANARIAS S.L</p>
            <p className="mt-1">For any questions, please contact us at:</p>
            <p className="text-[#DAA520]">Tel: +34 604 98 00 12 | Email: hola@todopro.es</p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 mt-6 pt-4 border-t border-[#DAA520]/20">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-[#DAA520] text-[#DAA520] rounded-lg hover:bg-[#DAA520] hover:text-white transition-colors"
            >
              Back
            </button>
            <PDFDownloadLink
              document={<QuotePDF quote={quote} />}
              fileName={`quote-${Date.now()}.pdf`}
              className="px-6 py-2 bg-[#DAA520] text-white rounded-lg hover:bg-[#B8860B] transition-colors"
            >
              {({ blob, url, loading, error }) =>
                loading ? 'Generating PDF...' : 'Create PDF'
              }
            </PDFDownloadLink>
            <button
              onClick={handleSaveQuote}
              className="px-6 py-2 bg-[#DAA520] text-white rounded-lg hover:bg-[#B8860B] transition-colors"
            >
              Save Quote
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotePreview;
