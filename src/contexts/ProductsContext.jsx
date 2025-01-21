import React, { createContext, useContext, useState, useEffect } from 'react';
import { PRODUCTS as DEFAULT_PRODUCTS } from '../data/products';

const ProductsContext = createContext();

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('products');
    return saved ? JSON.parse(saved) : DEFAULT_PRODUCTS;
  });

  const [adminFee, setAdminFee] = useState(() => {
    const saved = localStorage.getItem('adminFee');
    return saved ? Number(saved) : 50;
  });

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('adminFee', adminFee.toString());
  }, [adminFee]);

  const updateProduct = (index, updatedProduct) => {
    const newProducts = [...products];
    newProducts[index] = updatedProduct;
    setProducts(newProducts);
  };

  return (
    <ProductsContext.Provider 
      value={{ 
        products, 
        updateProduct,
        adminFee,
        setAdminFee
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
}