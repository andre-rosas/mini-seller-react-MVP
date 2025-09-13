import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../context/AppContext.jsx';
import LeadCard from './LeadCard.jsx';
import LeadFilters from './LeadFilters.jsx';
import SkeletonLoader from '../SkeletonLoader.jsx';

/**
 * Leads List Component
 * Main container for displaying and managing leads
 * Handles filtering, sorting, loading states, and error handling
 * Manages edit state for individual lead cards
 */

const LeadsList = () => {
  const { leads, isLoading, error, filters, setFilters } = useAppContext();

  // State to track which lead is currently being edited
  const [editingLead, setEditingLead] = useState(null);

  /**
   * Compute filtered and sorted leads based on current filters
   * Uses useMemo for performance optimization to avoid unnecessary recalculations
   * Handles search, status filtering, and sorting operations
   */
  const filteredLeads = useMemo(() => {
    let filtered = [...leads];

    // Apply search filter - matches name or company (case-insensitive)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(lead =>
        lead.name.toLowerCase().includes(searchLower) ||
        lead.company.toLowerCase().includes(searchLower)
      );
    }

    // Apply status filter - exclude 'all' option
    if (filters.status !== 'all') {
      filtered = filtered.filter(lead => lead.status === filters.status);
    }

    // Apply sorting based on selected field and order
    filtered.sort((a, b) => {
      const aValue = a[filters.sortBy];
      const bValue = b[filters.sortBy];

      // Handle string sorting (name, company)
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        if (filters.sortOrder === 'desc') {
          return bValue.localeCompare(aValue);
        }
        return aValue.localeCompare(bValue);
      }

      // Handle number sorting (score)
      if (filters.sortOrder === 'desc') {
        return bValue - aValue;
      }
      return aValue - bValue;
    });

    return filtered;
  }, [leads, filters]);

  // Show loading skeleton while data is being fetched
  if (isLoading) {
    return <SkeletonLoader count={5} />;
  }

  // Show error state with retry option
  if (error) {
    return (
      <div className="text-center py-8" role="alert" aria-live="polite">
        <div className="text-red-600 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load leads</h3>
        <p className="text-gray-500">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-primary-blue text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Try again
        </button>
      </div>
    );
  }

  // Show empty state when no leads match current filters
  if (filteredLeads.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No lead found</h3>
        <p className="text-gray-500">
          {filters.search || filters.status !== 'all'
            ? 'Please, try to adjust the search filter'
            : 'There is no registered leads yet'
          }
        </p>
        {(filters.search || filters.status !== 'all') && (
          <button
            onClick={() => setFilters({ search: '', status: 'all' })}
            className="mt-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Clean filters
          </button>
        )}
      </div>
    );
  }

  // Render the main leads list with filters and cards
  return (
    <div className="space-y-4">

      {/* Filter controls component */}
      <LeadFilters />

      {/* Grid of lead cards with accessibility attributes */}
      <div className="grid gap-4" role="list" aria-label="Leads list">
        {filteredLeads.map(lead => (
          <div key={lead.id} role="listitem">
            <LeadCard
              lead={lead}
              isEditing={editingLead === lead.id}
              onEdit={() => setEditingLead(lead.id)}
              onCancelEdit={() => setEditingLead(null)}
              onSave={() => setEditingLead(null)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeadsList;