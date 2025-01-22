import React, { createContext, useContext, useReducer, useEffect } from 'react';

const LeadsContext = createContext();

const initialState = {
  leads: [],
  filters: {
    status: 'all',
    search: '',
    dateRange: 'all',
  },
  templates: [
    {
      id: 1,
      name: 'Initial Contact',
      content: 'Hi {{name}}, thank you for your interest in TodoPro. How can I help you today?',
      type: 'whatsapp'
    },
    {
      id: 2,
      name: 'Follow Up',
      content: 'Hi {{name}}, just following up on our previous conversation. Would you like to schedule a call?',
      type: 'whatsapp'
    }
  ],
  notifications: []
};

function leadsReducer(state, action) {
  switch (action.type) {
    case 'ADD_LEAD':
      return {
        ...state,
        leads: [...state.leads, { ...action.payload, id: Date.now() }]
      };
    case 'UPDATE_LEAD':
      return {
        ...state,
        leads: state.leads.map(lead => 
          lead.id === action.payload.id ? { ...lead, ...action.payload } : lead
        )
      };
    case 'DELETE_LEAD':
      return {
        ...state,
        leads: state.leads.filter(lead => lead.id !== action.payload)
      };
    case 'SET_FILTERS':
      return {
        ...state,
        filters: { ...state.filters, ...action.payload }
      };
    case 'ADD_TEMPLATE':
      return {
        ...state,
        templates: [...state.templates, { ...action.payload, id: Date.now() }]
      };
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [...state.notifications, { ...action.payload, id: Date.now() }]
      };
    case 'CLEAR_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload)
      };
    default:
      return state;
  }
}

export function LeadsProvider({ children }) {
  const [state, dispatch] = useReducer(leadsReducer, initialState);

  // Load state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('crm-state');
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        Object.keys(parsedState).forEach(key => {
          dispatch({ type: `SET_${key.toUpperCase()}`, payload: parsedState[key] });
        });
      } catch (error) {
        console.error('Error loading CRM state:', error);
      }
    }
  }, []);

  // Save state to localStorage
  useEffect(() => {
    localStorage.setItem('crm-state', JSON.stringify(state));
  }, [state]);

  const addLead = (lead) => {
    dispatch({ type: 'ADD_LEAD', payload: lead });
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        message: `New lead added: ${lead.name}`,
        type: 'success'
      }
    });
  };

  const updateLead = (lead) => {
    dispatch({ type: 'UPDATE_LEAD', payload: lead });
  };

  const deleteLead = (id) => {
    dispatch({ type: 'DELETE_LEAD', payload: id });
  };

  const setFilters = (filters) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  };

  const addTemplate = (template) => {
    dispatch({ type: 'ADD_TEMPLATE', payload: template });
  };

  const addNotification = (notification) => {
    dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
    setTimeout(() => {
      dispatch({ type: 'CLEAR_NOTIFICATION', payload: notification.id });
    }, 5000);
  };

  const value = {
    ...state,
    addLead,
    updateLead,
    deleteLead,
    setFilters,
    addTemplate,
    addNotification
  };

  return (
    <LeadsContext.Provider value={value}>
      {children}
    </LeadsContext.Provider>
  );
}

export function useLeads() {
  const context = useContext(LeadsContext);
  if (!context) {
    throw new Error('useLeads must be used within a LeadsProvider');
  }
  return context;
}
