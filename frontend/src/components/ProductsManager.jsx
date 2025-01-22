import React from "react";
import { useProducts } from "../contexts/ProductsContext";

function ProductsManager() {
  const { products, updateProduct, adminFee, setAdminFee } = useProducts();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Products Manager</h2>
      
      {/* Admin Fee Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Admin Fee</h3>
        <div className="flex items-center space-x-4">
          <input
            type="number"
            value={adminFee}
            onChange={(e) => setAdminFee(Number(e.target.value))}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gold-500 focus:border-transparent"
          />
          <span className="text-gray-600">€</span>
        </div>
      </div>

      {/* Products List */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Products</h3>
        <div className="space-y-4">
          {products.map((product, index) => (
            <div key={index} className="border-b pb-4 last:border-0">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Name</label>
                  <input
                    type="text"
                    value={product.name}
                    onChange={(e) => updateProduct(index, { ...product, name: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Price per Day</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={product.pricePerDay}
                      onChange={(e) => updateProduct(index, { ...product, pricePerDay: Number(e.target.value) })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                    />
                    <span className="text-gray-600">€</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductsManager;