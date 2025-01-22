import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Calculator from './components/Calculator';
import ProductsManager from './components/ProductsManager';
import QuotesList from './components/QuotesList';
import ApiDocs from './components/ApiDocs';
import QuotePreview from './components/QuotePreview';
import ContractPreview from './components/ContractPreview';
import Dashboard from './components/Dashboard';
import LeadsManagement from './components/LeadsManagement';

console.log('App component loading...');

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [quotes, setQuotes] = useState([]);
  const [currentQuote, setCurrentQuote] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  // Load quotes from localStorage on component mount
  useEffect(() => {
    const savedQuotes = localStorage.getItem('quotes');
    if (savedQuotes) {
      setQuotes(JSON.parse(savedQuotes));
    }
  }, []);

  // Save quotes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('quotes', JSON.stringify(quotes));
  }, [quotes]);

  const handleQuoteSelect = (quote) => {
    setCurrentQuote(quote);
    setShowPreview(true);
  };

  const handleClosePreview = () => {
    setCurrentQuote(null);
    setShowPreview(false);
  };

  const handleConvertToContract = (contract) => {
    // Add the contract to quotes list
    setQuotes([...quotes, contract]);
    // Show the contract preview
    setCurrentQuote(contract);
    setShowPreview(true);
  };

  return (
    <Router>
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <div className={`bg-white shadow-lg ${isSidebarOpen ? 'w-64' : 'w-16'} transition-all duration-300`}>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-4 hover:bg-gray-100 w-full text-left"
          >
            {isSidebarOpen ? '← Collapse' : '→'}
          </button>
          <nav className="mt-4">
            <Link
              to="/"
              className="block px-4 py-2 hover:bg-gray-100 text-[#DAA520]"
            >
              Dashboard
            </Link>
            <Link
              to="/calculator"
              className="block px-4 py-2 hover:bg-gray-100 text-[#DAA520]"
            >
              Calculator
            </Link>
            <Link
              to="/quotes"
              className="block px-4 py-2 hover:bg-gray-100 text-[#DAA520]"
            >
              Quotes
            </Link>
            <Link
              to="/products"
              className="block px-4 py-2 hover:bg-gray-100 text-[#DAA520]"
            >
              Products
            </Link>
            <Link
              to="/api"
              className="block px-4 py-2 hover:bg-gray-100 text-[#DAA520]"
            >
              API
            </Link>
            <Link
              to="/leads"
              className="block px-4 py-2 hover:bg-gray-100 text-[#DAA520]"
            >
              Leads
            </Link>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <Toaster position="top-right" />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route
              path="/calculator"
              element={
                <Calculator
                  onQuoteSave={(quote) => {
                    setQuotes([...quotes, quote]);
                  }}
                />
              }
            />
            <Route
              path="/quotes"
              element={
                <QuotesList
                  quotes={quotes}
                  onQuoteSelect={handleQuoteSelect}
                  onConvertToContract={handleConvertToContract}
                />
              }
            />
            <Route path="/products" element={<ProductsManager />} />
            <Route path="/api" element={<ApiDocs />} />
            <Route path="/leads" element={<LeadsManagement />} />
          </Routes>

          {/* Preview Modal */}
          {showPreview && currentQuote && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-auto">
                <div className="p-4 border-b flex justify-between items-center">
                  <h2 className="text-xl font-bold text-[#DAA520]">Preview</h2>
                  <button
                    onClick={handleClosePreview}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    Close
                  </button>
                </div>
                {currentQuote.type === 'contract' ? (
                  <ContractPreview quote={currentQuote} onClose={handleClosePreview} />
                ) : (
                  <QuotePreview quote={currentQuote} onClose={handleClosePreview} />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Router>
  );
}

export default App;