import React from 'react';
import { Link } from 'react-router-dom';
import Calendar from './Calendar';

const DashboardSection = ({ title, children, fullHeight = false }) => (
  <div className={`flex-1 min-w-[300px] p-6 bg-white rounded-lg shadow-lg border border-[#DAA520]/20 ${fullHeight ? 'h-[600px]' : ''}`}>
    <h2 className="text-xl font-semibold mb-4 text-[#DAA520] pb-2 border-b border-[#DAA520]/20">
      {title}
    </h2>
    <div className={`${fullHeight ? 'h-[calc(100%-3rem)]' : ''}`}>
      {children}
    </div>
  </div>
);

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-[1600px] mx-auto">
        <h1 className="text-3xl font-bold text-[#DAA520] mb-8 text-center">
          TodoPro Dashboard
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {/* Calculator Section */}
          <DashboardSection title="TodoPro Calculator">
            <div className="flex flex-col h-full">
              <p className="text-gray-600 mb-4">
                Quick access to our professional calculation tools.
              </p>
              <Link 
                to="/calculator"
                className="mt-auto px-4 py-2 bg-gradient-to-r from-[#DAA520] to-[#B8860B] text-white rounded-md text-center hover:from-[#B8860B] hover:to-[#DAA520] transition-all"
              >
                Open Calculator
              </Link>
            </div>
          </DashboardSection>

          {/* Calendar Section */}
          <DashboardSection title="Calendar">
            <div className="flex flex-col h-full">
              <div className="flex-1 bg-gray-50 rounded-md p-4 mb-4">
                <div className="text-center space-y-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-[#DAA520]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <h3 className="text-lg font-semibold text-[#DAA520]">TodoPro Calendar</h3>
                  <p className="text-gray-600">
                    Access your schedule, appointments, and events in the TeamUp calendar.
                  </p>
                </div>
              </div>
              <a 
                href="https://teamup.com/c/agpdhe/todopro-calendar"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto px-4 py-2 bg-gradient-to-r from-[#DAA520] to-[#B8860B] text-white rounded-md text-center hover:from-[#B8860B] hover:to-[#DAA520] transition-all flex items-center justify-center gap-2"
              >
                <span>Open Calendar</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </DashboardSection>

          {/* Leads Management Section */}
          <DashboardSection title="Leads Management">
            <div className="flex flex-col h-full">
              <div className="flex-1 bg-gray-50 rounded-md p-4 mb-4">
                <div className="text-center space-y-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-[#DAA520]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <h3 className="text-lg font-semibold text-[#DAA520]">Lead Tracking</h3>
                  <p className="text-gray-600">
                    Manage your leads, track interactions, and boost conversions with our CRM tools.
                  </p>
                </div>
              </div>
              <Link 
                to="/leads"
                className="mt-auto px-4 py-2 bg-gradient-to-r from-[#DAA520] to-[#B8860B] text-white rounded-md text-center hover:from-[#B8860B] hover:to-[#DAA520] transition-all flex items-center justify-center gap-2"
              >
                <span>Manage Leads</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </DashboardSection>

          {/* Future Section */}
          <DashboardSection title="Future Module">
            <div className="flex flex-col h-full">
              <div className="flex-1 bg-gray-50 rounded-md p-4 mb-4">
                <div className="text-center text-gray-500">
                  Customizable section for future features
                </div>
              </div>
              <button 
                className="px-4 py-2 bg-gray-200 text-gray-600 rounded-md hover:bg-gray-300 transition-all"
                disabled
              >
                Coming Soon
              </button>
            </div>
          </DashboardSection>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
