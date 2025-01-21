import React, { useState } from 'react';
import { useLeads } from '../contexts/LeadsContext';
import { format } from 'date-fns';
import { Tab } from '@headlessui/react';
import {
  PhoneIcon,
  ChatBubbleOvalLeftIcon,
  PlusIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ChartBarIcon,
  DocumentTextIcon,
  BellIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const LeadStatus = {
  NEW: 'new',
  IN_PROGRESS: 'in_progress',
  FOLLOW_UP: 'follow_up',
  CLOSED_WON: 'closed_won',
  CLOSED_LOST: 'closed_lost'
};

const LeadStatusColors = {
  [LeadStatus.NEW]: 'bg-blue-100 text-blue-800',
  [LeadStatus.IN_PROGRESS]: 'bg-yellow-100 text-yellow-800',
  [LeadStatus.FOLLOW_UP]: 'bg-purple-100 text-purple-800',
  [LeadStatus.CLOSED_WON]: 'bg-green-100 text-green-800',
  [LeadStatus.CLOSED_LOST]: 'bg-red-100 text-red-800'
};

function LeadsList() {
  const { leads, filters, updateLead } = useLeads();
  const [selectedLead, setSelectedLead] = useState(null);

  const filteredLeads = leads.filter(lead => {
    if (filters.status !== 'all' && lead.status !== filters.status) return false;
    if (filters.search && !lead.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  const handleStatusChange = (leadId, newStatus) => {
    updateLead({ id: leadId, status: newStatus });
    toast.success('Lead status updated');
  };

  const handleCall = (phone) => {
    window.location.href = `tel:${phone}`;
  };

  const handleWhatsApp = (phone) => {
    window.open(`https://wa.me/${phone}`, '_blank');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredLeads.map(lead => (
        <div
          key={lead.id}
          className="bg-white rounded-lg shadow-md p-4 border border-[#DAA520]/20 hover:border-[#DAA520] transition-colors"
          onClick={() => setSelectedLead(lead)}
        >
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-semibold text-lg text-gray-900">{lead.name}</h3>
              <p className="text-sm text-gray-500">{lead.email}</p>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${LeadStatusColors[lead.status]}`}>
              {lead.status.replace('_', ' ').toUpperCase()}
            </span>
          </div>
          
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => handleCall(lead.phone)}
              className="flex items-center gap-1 px-2 py-1 text-sm text-[#DAA520] hover:bg-[#DAA520]/10 rounded"
            >
              <PhoneIcon className="h-4 w-4" />
              Call
            </button>
            <button
              onClick={() => handleWhatsApp(lead.phone)}
              className="flex items-center gap-1 px-2 py-1 text-sm text-[#DAA520] hover:bg-[#DAA520]/10 rounded"
            >
              <ChatBubbleOvalLeftIcon className="h-4 w-4" />
              WhatsApp
            </button>
          </div>

          <div className="text-sm text-gray-500">
            <p>Last Contact: {format(new Date(lead.lastContact), 'MMM d, yyyy')}</p>
            <p>Source: {lead.source}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function Analytics() {
  const { leads } = useLeads();
  
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Leads',
        data: [12, 19, 3, 5, 2, 3],
        fill: false,
        borderColor: '#DAA520',
        tension: 0.1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Lead Acquisition Trend'
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Analytics</h2>
      <Line data={data} options={options} />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-[#DAA520]/10 rounded-lg p-4">
          <h3 className="text-lg font-medium text-[#DAA520]">Total Leads</h3>
          <p className="text-2xl font-bold">{leads.length}</p>
        </div>
        <div className="bg-[#DAA520]/10 rounded-lg p-4">
          <h3 className="text-lg font-medium text-[#DAA520]">Conversion Rate</h3>
          <p className="text-2xl font-bold">
            {((leads.filter(l => l.status === LeadStatus.CLOSED_WON).length / leads.length) * 100).toFixed(1)}%
          </p>
        </div>
        <div className="bg-[#DAA520]/10 rounded-lg p-4">
          <h3 className="text-lg font-medium text-[#DAA520]">Active Leads</h3>
          <p className="text-2xl font-bold">
            {leads.filter(l => l.status !== LeadStatus.CLOSED_WON && l.status !== LeadStatus.CLOSED_LOST).length}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LeadsManagement() {
  const [selectedTab, setSelectedTab] = useState(0);
  const { filters, setFilters, addLead } = useLeads();

  const handleAddLead = () => {
    const newLead = {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      status: LeadStatus.NEW,
      source: 'Manual Entry',
      lastContact: new Date().toISOString()
    };
    addLead(newLead);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#DAA520]">Leads Management</h1>
          <button
            onClick={handleAddLead}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#DAA520] to-[#B8860B] text-white rounded-md hover:from-[#B8860B] hover:to-[#DAA520] transition-all"
          >
            <PlusIcon className="h-5 w-5" />
            Add Lead
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="p-4 border-b">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search leads..."
                  className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#DAA520]"
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                />
              </div>
              <select
                className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#DAA520]"
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              >
                <option value="all">All Status</option>
                {Object.values(LeadStatus).map(status => (
                  <option key={status} value={status}>
                    {status.replace('_', ' ').toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
          <Tab.List className="flex space-x-1 rounded-xl bg-[#DAA520]/20 p-1 mb-6">
            <Tab
              className={({ selected }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5
                 ${selected
                  ? 'bg-white text-[#DAA520] shadow'
                  : 'text-gray-600 hover:bg-white/[0.12] hover:text-[#DAA520]'
                }`
              }
            >
              Leads
            </Tab>
            <Tab
              className={({ selected }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5
                 ${selected
                  ? 'bg-white text-[#DAA520] shadow'
                  : 'text-gray-600 hover:bg-white/[0.12] hover:text-[#DAA520]'
                }`
              }
            >
              Analytics
            </Tab>
          </Tab.List>
          <Tab.Panels>
            <Tab.Panel>
              <LeadsList />
            </Tab.Panel>
            <Tab.Panel>
              <Analytics />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
}
