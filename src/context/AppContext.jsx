import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const AppContext = createContext();

// Local storage keys for persisting application state
const STORAGE_KEYS = {
  FILTERS: 'seller_console_filters',
  LEADS: 'seller_console_leads',
  OPPORTUNITIES: 'seller_console_opportunities'
};

/**
 * Load filters from localStorage with error handling and fallback
 * Returns default filter state if loading fails or no data exists
 */
const loadFiltersFromStorage = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.FILTERS);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.warn('Failed to load filters from localStorage:', error);
  }
  return {
    search: '',
    status: 'all',
    sortBy: 'score',
    sortOrder: 'desc'
  };
};

// Initial application state
const initialState = {
  leads: [],
  opportunities: [],
  selectedLead: null,
  isLoading: false,
  error: null,
  filters: loadFiltersFromStorage(),
  liveMessage: ''
};

// Action types for state management
const ACTION_TYPES = {
  SET_LEADS: 'SET_LEADS',
  SET_OPPORTUNITIES: 'SET_OPPORTUNITIES',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_SELECTED_LEAD: 'SET_SELECTED_LEAD',
  UPDATE_LEAD: 'UPDATE_LEAD',
  ADD_OPPORTUNITY: 'ADD_OPPORTUNITY',
  SET_FILTERS: 'SET_FILTERS',
  CLEAR_ERROR: 'CLEAR_ERROR',
  UPDATE_LEAD_ROLLBACK: 'UPDATE_LEAD_ROLLBACK',
  SET_LIVE_MESSAGE: 'SET_LIVE_MESSAGE'
};

/**
 * Application state reducer
 * Handles all state transitions based on dispatched actions
 * Implements immutable state updates
 */
const appReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.SET_LEADS:
      return { ...state, leads: action.payload, isLoading: false };
    case ACTION_TYPES.SET_OPPORTUNITIES:
      return { ...state, opportunities: action.payload };
    case ACTION_TYPES.SET_LOADING:
      return { ...state, isLoading: action.payload };
    case ACTION_TYPES.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false };
    case ACTION_TYPES.SET_SELECTED_LEAD:
      return { ...state, selectedLead: action.payload };
    case ACTION_TYPES.CLEAR_ERROR:
      return { ...state, error: null };
    case ACTION_TYPES.SET_LIVE_MESSAGE:
      return { ...state, liveMessage: action.payload }
    case ACTION_TYPES.UPDATE_LEAD:
      // Update lead in both leads array and selectedLead if it matches
      return {
        ...state,
        leads: state.leads.map(lead =>
          lead.id === action.payload.id ? { ...lead, ...action.payload.updates } : lead
        ),
        selectedLead: state.selectedLead?.id === action.payload.id
          ? { ...state.selectedLead, ...action.payload.updates }
          : state.selectedLead
      };
    case ACTION_TYPES.ADD_OPPORTUNITY:
      return {
        ...state,
        opportunities: [...state.opportunities, action.payload]
      };
    case ACTION_TYPES.SET_FILTERS:
      const newFilters = { ...state.filters, ...action.payload };
      return {
        ...state,
        filters: newFilters
      };
    case ACTION_TYPES.UPDATE_LEAD_ROLLBACK: // Handle rollback, optimistic update on failure
      return {
        ...state,
        leads: state.leads.map(lead =>
          lead.id === action.payload.id ? action.payload.originalLead : lead
        ),
        selectedLead: state.selectedLead?.id === action.payload.id
          ? action.payload.originalLead
          : state.selectedLead
      };
    default:
      return state;
  }
};

/**
 * Custom hook to access application context
 * Throws error if used outside of AppProvider
 */
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

/**
 * Application Context Provider
 * Manages global state and provides actions to components
 * Handles data loading, state persistence, and business logic
 */
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, undefined, () => ({
    leads: [],
    opportunities: [],
    selectedLead: null,
    isLoading: false,
    error: null,
    filters: loadFiltersFromStorage()
  }));

  // Load leads from JSON file and sets loading state and handles errors appropriately
  useEffect(() => {
    const loadLeads = async () => {
      dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });
      try {
        const response = await fetch('/leads.json');
        const leads = await response.json();
        dispatch({ type: ACTION_TYPES.SET_LEADS, payload: leads });
      } catch (error) {
        dispatch({ type: ACTION_TYPES.SET_ERROR, payload: 'Failed to load leads' });
      }
    };
    loadLeads();
  }, []);

  // Load opportunities from JSON file and Handles errors silently to avoid blocking the main application
  useEffect(() => {
    const loadOpportunities = async () => {
      try {
        const response = await fetch('/opportunities.json');
        const opportunities = await response.json();
        dispatch({ type: ACTION_TYPES.SET_OPPORTUNITIES, payload: opportunities });
      } catch (error) {
        console.error('Error loading opportunities:', error);
      }
    };
    loadOpportunities();
  }, []);

  /**
   * Auto-clear errors after 5 seconds
   * Improves user experience by not showing persistent error messages
   */
  useEffect(() => {
    if (state.error) {
      const timer = setTimeout(() => {
        clearError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [state.error]);

  /**
   * Update lead data with optimistic or pessimistic updates
   * Supports rollback on failure for better user experience
   * Simulates API calls with potential failure scenarios
   */
  const updateLead = useCallback(async (leadId, updates, options = {}) => {
    const { optimistic = true } = options;
    const originalLead = state.leads.find(l => l.id === leadId);

    if (!originalLead) {
      dispatch({ type: ACTION_TYPES.SET_ERROR, payload: 'Lead não encontrado' });
      return;
    }

    if (optimistic) {
      // Apply update immediately (optimistic)
      dispatch({ type: ACTION_TYPES.UPDATE_LEAD, payload: { id: leadId, updates } });
    }

    // Simulate API call with potential failure
    try {
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate 10% failure rate for demo
          if (Math.random() < 0.1) {
            reject(new Error('Lead upgrade failed'));
          } else {
            resolve();
          }
        }, 1000);
      });

      if (!optimistic) {
        // Apply update after success (pessimistic)
        dispatch({ type: ACTION_TYPES.UPDATE_LEAD, payload: { id: leadId, updates } });
      }
    } catch (error) {
      if (optimistic) {
        // Rollback the optimistic update on failure
        dispatch({
          type: ACTION_TYPES.UPDATE_LEAD_ROLLBACK,
          payload: { id: leadId, originalLead }
        });
      }
      dispatch({ type: ACTION_TYPES.SET_ERROR, payload: error.message });
    }
  }, [state.leads]);

  /**
   * Add new opportunity to the application state
   * Generates unique ID using UUID library
   */
  const addOpportunity = useCallback((opportunity) => {
    const newOpportunity = {
      ...opportunity,
      id: uuidv4()
    };
    dispatch({ type: ACTION_TYPES.ADD_OPPORTUNITY, payload: newOpportunity });
  }, []);

  /**
   * Convert a lead to an opportunity
   * Handles validation, duplication checking, and state updates
   * Simulates API call with loading states and error handling
   */
  const convertLeadToOpportunity = useCallback(async (leadId) => {
    const lead = state.leads.find(l => l.id === leadId);
    if (!lead) {
      dispatch({ type: ACTION_TYPES.SET_ERROR, payload: 'Lead not found' });
      return;
    }

    // Check if lead is already converted (Prevent duplicate conversions)
    const existingOpportunity = state.opportunities.find(opp => opp.leadId === leadId);
    if (existingOpportunity) {
      dispatch({ type: ACTION_TYPES.SET_ERROR, payload: 'Lead already converted into opportunity' });
      return;
    }

    dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });

    try {
      // Simulate API call with potential failure
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate 5% failure rate
          if (Math.random() < 0.05) {
            reject(new Error('Failed to convert lead'));
          } else {
            resolve();
          }
        }, 1500);
      });

      // Create opportunity from lead data
      const opportunity = {
        id: `opp-${Date.now()}`,
        name: `${lead.company} - Sales Opportunity`,
        stage: 'qualification',
        amount: Math.floor(Math.random() * 50000) + 20000,
        accountName: lead.company,
        leadId: leadId,
        probability: lead.score,
        expectedCloseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      };

      addOpportunity(opportunity);
      await updateLead(leadId, { status: 'qualified' }, { optimistic: false });

      dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false });
    } catch (error) {
      dispatch({ type: ACTION_TYPES.SET_ERROR, payload: error.message });
      dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false });
    }
  }, [state.leads, state.opportunities, updateLead, addOpportunity]);

  /**
   * Set the currently selected lead for detail view
   * Used by lead cards to open the detail panel
   */
  const setSelectedLead = useCallback((lead) => {
    dispatch({ type: ACTION_TYPES.SET_SELECTED_LEAD, payload: lead });
  }, []);

  /**
   * Update application filters and persist to localStorage
   * Handles storage errors gracefully to avoid breaking functionality
   */
  const setFilters = useCallback((filters) => {
    const newFilters = { ...state.filters, ...filters };

    // Save to localStorage
    try {
      localStorage.setItem(STORAGE_KEYS.FILTERS, JSON.stringify(newFilters));
    } catch (error) {
      console.warn('Failed to save filters to localStorage:', error);
    }

    dispatch({ type: ACTION_TYPES.SET_FILTERS, payload: newFilters });
  }, [state.filters]);

  /**
   * Clear current error message
   * Used by error dismissal buttons and auto-clear timer
   */
  const clearError = useCallback(() => {
    dispatch({ type: ACTION_TYPES.CLEAR_ERROR });
  }, []);

  /**
   * Announce message to screen readers via live region
   * Automatically clears message after 1 second to prevent repetition
   * Improves accessibility for dynamic content changes
   */
  const announceLiveMessage = useCallback((message) => {
    dispatch({ type: ACTION_TYPES.SET_LIVE_MESSAGE, payload: message });
    // Clear message after timeout to avoid repetition
    setTimeout(() => {
      dispatch({ type: ACTION_TYPES.SET_LIVE_MESSAGE, payload: '' });
    }, 1000);
  }, []);

  // Context value containing state and actions
  const value = {
    ...state,
    updateLead,
    addOpportunity,
    convertLeadToOpportunity,
    setSelectedLead,
    setFilters,
    clearError,
    announceLiveMessage
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};