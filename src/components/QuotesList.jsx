import React, { useState } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import QuoteDetails from './QuoteDetails';
import QuotePDF from './QuotePDF';
import ContractPDF from './ContractPDF';

function QuotesList({ quotes: propQuotes, onQuoteSelect, onConvertToContract }) {
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const COMPANY_INFO = {
    name: "TODOPRO CANARIAS S.L",
    slogan: "Reliable Solutions for Construction Needs",
    phone: "+34 604 98 00 12",
    email: "hola@todopro.es",
    address: "Carretera General 10",
    area: "La Camella",
    city: "Arona",
    province: "Santa Cruz de Tenerife",
    postalCode: "38627",
    slNumber: "B44751410",
    website: "www.todopro.es"
  };

  const METALLIC_GOLD = {
    primary: "rgb(218, 165, 32)", // Base gold
    hover: "rgb(184, 134, 11)", // Darker gold for hover
    light: "rgba(218, 165, 32, 0.1)", // Very light gold for backgrounds
    border: "rgba(218, 165, 32, 0.3)", // Semi-transparent gold for borders
    gradient: "linear-gradient(135deg, rgb(218, 165, 32), rgb(184, 134, 11))" // Metallic effect
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this quote?');
    if (confirmed) {
      window.dispatchEvent(new CustomEvent('deleteQuote', { detail: { id } }));
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear();
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const createWhatsAppMessage = (quote) => {
    const message = `*TODOPRO CANARIAS S.L - OFFICIAL QUOTATION*\n` +
      `----------------------------------------\n\n` +
      
      // Company Information
      `📍 *Company Details*\n` +
      `Carretera General 10, La Camella\n` +
      `Arona, Santa Cruz de Tenerife, 38627\n` +
      `📞 Tel: 604 98 00 12\n` +
      `📧 Email: hola@todopro.es\n` +
      `🏢 Company S.L: B44751410\n\n` +
      
      // Quote Details
      `*QUOTE DETAILS*\n` +
      `----------------------------------------\n` +
      `Reference: #${quote.id.slice(0, 8)}\n` +
      `Date: ${formatDate(quote.createdAt)}\n\n` +
      
      // Client Information
      `*CLIENT INFORMATION*\n` +
      `----------------------------------------\n` +
      `Name: ${quote.clientInfo.name}\n` +
      `${quote.clientInfo.phone ? `Phone: ${quote.clientInfo.phone}\n` : ''}` +
      `${quote.clientInfo.email ? `Email: ${quote.clientInfo.email}\n` : ''}` +
      `Estimated Work Duration: ${quote.days} ${quote.days > 1 ? 'days' : 'day'}\n\n` +
      
      // Products
      `*EQUIPMENT DETAILS*\n` +
      `${quote.selectedProducts.map(p => 
        `${p.name}: ${p.quantity} units at €${p.price.toFixed(2)}/day`
      ).join('\n')}\n\n` +
      
      // Summary
      `*SUMMARY*\n` +
      `Estimated Work Duration: ${quote.days} ${quote.days > 1 ? 'days' : 'day'}\n` +
      `Total: €${quote.finalTotal.toFixed(2)}\n\n` +
      
      // Notes
      (quote.notes ? 
        `*NOTES*\n` +
        `----------------------------------------\n` +
        `${quote.notes}\n\n` : '') +
      
      // Footer
      `----------------------------------------\n` +
      `Thank you for choosing TODOPRO CANARIAS S.L\n` +
      `For any questions, please contact us at:\n` +
      `Tel: 604 98 00 12 | Email: hola@todopro.es\n` +
      `----------------------------------------`;

    return encodeURIComponent(message);
  };

  const handleWhatsAppShare = (quote) => {
    const message = createWhatsAppMessage(quote);
    const phoneNumber = quote.clientInfo.phone ? quote.clientInfo.phone.replace(/[^0-9]/g, '') : '';
    const whatsappUrl = phoneNumber 
      ? `https://wa.me/${phoneNumber}?text=${message}`
      : `https://wa.me/?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleConvertToContract = (quote) => {
    // Create a new contract from the quote
    const contract = {
      ...quote,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      type: 'contract'
    };
    onConvertToContract(contract);
  };

  const filteredQuotes = propQuotes.filter(quote => 
    quote.clientInfo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    formatDate(quote.createdAt).includes(searchTerm)
  );

  if (!propQuotes || propQuotes.length === 0) {
    return (
      <div className="max-w-7xl mx-auto p-8 text-center">
        <h2 className="text-2xl font-bold text-[#DAA520] mb-4">No Quotes Yet</h2>
        <p className="text-gray-600">Create a new quote using the calculator to get started.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header with Company Info */}
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

      {/* Search Header */}
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-[#DAA520]">
        <h2 className="text-2xl font-bold text-[#DAA520]">Quotes</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search quotes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-[#DAA520] rounded-lg focus:ring-2 focus:ring-[#DAA520] focus:border-[#DAA520] outline-none"
          />
          <span className="absolute left-3 top-2.5">🔍</span>
        </div>
      </div>

      {/* Quotes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredQuotes.map((quote) => (
          <div 
            key={quote.id}
            className={`bg-white rounded-lg shadow-lg overflow-hidden border ${quote.type === 'contract' ? 'border-green-500' : 'border-[#DAA520]'} hover:shadow-xl transition-shadow duration-300`}
          >
            <div className={`${quote.type === 'contract' ? 'bg-green-500' : 'bg-[#DAA520]'} text-white px-6 py-4`}>
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{quote.clientInfo.name}</h3>
                {quote.type === 'contract' && (
                  <span className="px-2 py-1 bg-white text-green-500 rounded-full text-sm font-medium">
                    Contract
                  </span>
                )}
              </div>
              <p className="text-sm opacity-90">{formatDate(quote.createdAt)}</p>
            </div>
            
            <div className="p-6">
              <div className="space-y-3">
                <div className="text-sm text-gray-600">
                  <p>Client: {quote.clientInfo?.name}</p>
                  <p>Estimated Work Duration: {quote.days} {quote.days > 1 ? 'days' : 'day'}</p>
                  <p>Total: €{quote.finalTotal?.toFixed(2)}</p>
                </div>
              </div>

              <div className="mt-6 flex items-center space-x-2">
                <button
                  onClick={() => onQuoteSelect(quote)}
                  className="text-[#DAA520] hover:text-[#B8860B] transition-colors"
                >
                  View
                </button>
                <PDFDownloadLink
                  document={quote.type === 'contract' ? <ContractPDF quote={quote} /> : <QuotePDF quote={quote} />}
                  fileName={quote.type === 'contract' ? `contract-${quote.id}.pdf` : `quote-${quote.id}.pdf`}
                  className="text-[#DAA520] hover:text-[#B8860B] transition-colors"
                >
                  {({ blob, url, loading, error }) =>
                    loading ? '...' : 'Download PDF'
                  }
                </PDFDownloadLink>
                <button
                  onClick={() => handleWhatsAppShare(quote)}
                  className="text-[#DAA520] hover:text-[#B8860B] transition-colors"
                >
                  Share
                </button>
                {quote.type !== 'contract' && (
                  <button
                    onClick={() => handleConvertToContract(quote)}
                    className="text-[#DAA520] hover:text-[#B8860B] transition-colors"
                  >
                    Convert to Contract
                  </button>
                )}
                <button
                  onClick={() => handleDelete(quote.id)}
                  className="text-red-500 hover:text-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredQuotes.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-[#DAA520]">
          <p className="text-[#DAA520] text-lg font-medium">No quotes found</p>
          {searchTerm && (
            <p className="text-gray-500 mt-2">
              Try adjusting your search terms
            </p>
          )}
        </div>
      )}

      {selectedQuote && (
        <QuoteDetails
          quote={selectedQuote}
          onClose={() => setSelectedQuote(null)}
        />
      )}
    </div>
  );
}

export default QuotesList;