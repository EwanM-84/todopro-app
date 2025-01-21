import React, { useState } from 'react';
import { useProducts } from '../contexts/ProductsContext';
import { useNavigate } from 'react-router-dom';
import QuotePreview from './QuotePreview';

function Calculator({ onQuoteSave }) {
  const navigate = useNavigate();
  const { products, adminFee } = useProducts();
  const [clientInfo, setClientInfo] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    dieNie: ''
  });
  const [days, setDays] = useState(0);
  const [selectedProducts, setSelectedProducts] = useState(Array(6).fill(0));
  const [units, setUnits] = useState(Array(6).fill(0));
  const [visibleProducts, setVisibleProducts] = useState(1);
  const [notes, setNotes] = useState('');
  const [previewQuote, setPreviewQuote] = useState(null);

  const getStockBreakdown = () => {
    // Calculate total units for proportional distribution
    const totalUnits = units.reduce((sum, u) => sum + u, 0) || 1; // Prevent division by zero
    
    // Calculate total labor cost for all days
    const totalLaborCost = days * 200; // €200 per day total labor cost
    const laborCostPerUnit = totalLaborCost / totalUnits;
    const adminFeePerUnit = adminFee / totalUnits;

    return selectedProducts.map((productIndex, index) => {
      const product = products[productIndex];
      const amount = units[index];
      if (amount === 0) return null;

      const basePrice = product.pricePerDay * days * amount;
      
      // Add proportional labor cost and admin fee to this product
      const productLaborCost = laborCostPerUnit * amount;
      const productAdminFee = adminFeePerUnit * amount;
      const productTotal = basePrice + productLaborCost + productAdminFee;
      const commission = productTotal * 0.10; // 10% commission
      const finalPrice = productTotal + commission;

      return {
        name: product.name,
        quantity: amount,
        price: (finalPrice / amount) / days, // Price per unit per day
        totalPrice: finalPrice
      };
    }).filter(Boolean); // Remove null entries
  };

  // Calculate totals
  const productsList = getStockBreakdown();
  const subtotal = productsList.reduce((sum, item) => sum + item.totalPrice, 0);
  const vat = subtotal * 0.07; // 7% VAT
  const finalTotal = subtotal + vat;

  const calculatePricePerDay = (basePrice, days) => {
    return basePrice * days;
  };

  const calculateSubtotal = () => {
    return productsList.reduce((sum, item) => sum + item.totalPrice, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    return subtotal + (subtotal * 0.07); // 7% VAT
  };

  const handleGenerateQuote = () => {
    const quote = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      clientInfo: {
        name: clientInfo.name,
        phone: clientInfo.phone,
        email: clientInfo.email,
        address: clientInfo.address,
        dieNie: clientInfo.dieNie
      },
      days: days,
      selectedProducts: productsList.map(product => ({
        ...product,
        price: product.price
      })),
      subtotal: calculateSubtotal(),
      vat: calculateSubtotal() * 0.07,
      finalTotal: calculateTotal(),
      notes: notes,
      type: 'quote'
    };
    setPreviewQuote(quote);
  };

  const handleSaveQuote = () => {
    if (previewQuote) {
      // Call the onQuoteSave prop to update App's state
      onQuoteSave(previewQuote);
      // Clear the preview
      setPreviewQuote(null);
      // Navigate to quotes list
      navigate('/quotes');
    }
  };

  const handleClosePreview = () => {
    setPreviewQuote(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Calculator Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Client Info & Products */}
        <div className="lg:col-span-2 space-y-6">
          {/* Client Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-6 text-gray-800">Client Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries({
                name: 'Client Name',
                address: 'Client Address',
                phone: 'Client Phone',
                email: 'Client Email',
                dieNie: 'Client DIE/NIE'
              }).map(([key, placeholder]) => (
                <div key={key} className="space-y-1">
                  <label className="text-sm text-gray-600">{placeholder}</label>
                  <input
                    type={key === 'email' ? 'email' : 'text'}
                    value={clientInfo[key]}
                    onChange={(e) => setClientInfo({ ...clientInfo, [key]: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Days and Products */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-6 text-gray-800">Estimated Work Duration and Equipment</h2>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm text-gray-600">Estimated Work Duration</label>
                <input
                  type="number"
                  value={days}
                  onChange={(e) => setDays(Number(e.target.value) || 0)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                />
              </div>
              
              {Array(visibleProducts).fill(null).map((_, index) => (
                <div key={index} className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm text-gray-600">Product {index + 1}</label>
                    <select
                      value={selectedProducts[index]}
                      onChange={(e) => {
                        const newSelected = [...selectedProducts];
                        newSelected[index] = Number(e.target.value);
                        setSelectedProducts(newSelected);
                      }}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                    >
                      {products.map((product, idx) => (
                        <option key={idx} value={idx}>
                          {product.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm text-gray-600">Units</label>
                    <input
                      type="number"
                      value={units[index]}
                      onChange={(e) => {
                        const newUnits = [...units];
                        newUnits[index] = Number(e.target.value) || 0;
                        setUnits(newUnits);
                      }}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                    />
                  </div>
                </div>
              ))}
              
              {visibleProducts < 6 && (
                <button
                  onClick={() => setVisibleProducts(prev => prev + 1)}
                  className="w-full px-4 py-2 bg-gold-500 text-white rounded-lg hover:bg-gold-600 transition-colors"
                >
                  Add Product
                </button>
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-6 text-gray-800">Notes</h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional notes here..."
              className="w-full h-32 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gold-500 focus:border-transparent resize-none"
            />
          </div>
        </div>

        {/* Right Column - Calculations */}
        <div className="space-y-6">
          {/* Stock Breakdown */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-6 text-gray-800">Stock Needed</h2>
            <div className="space-y-3">
              {getStockBreakdown().map((item, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-500">Amount: {item.quantity}</p>
                  </div>
                  <span className="font-medium text-gold-500">€{item.totalPrice.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Calculation Summary */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-6 text-gray-800">Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">€{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">VAT (7%)</span>
                <span className="font-medium">€{vat.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-t border-gray-200 mt-4 pt-4">
                <span className="font-bold text-gray-800">Total</span>
                <span className="font-bold text-gold-500">€{finalTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleGenerateQuote}
              className="w-full mt-6 px-6 py-3 bg-gold-500 text-white rounded-lg hover:bg-gold-600 transition-colors font-medium"
            >
              Generate Quote
            </button>
          </div>
        </div>
      </div>

      {/* Quote Preview Modal */}
      {previewQuote && (
        <QuotePreview
          quote={previewQuote}
          onClose={handleClosePreview}
          onSave={handleSaveQuote}
        />
      )}
    </div>
  );
}

export default Calculator;