import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { ProductsProvider } from './contexts/ProductsContext'
import { LeadsProvider } from './contexts/LeadsContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ProductsProvider>
      <LeadsProvider>
        <App />
      </LeadsProvider>
    </ProductsProvider>
  </React.StrictMode>,
)