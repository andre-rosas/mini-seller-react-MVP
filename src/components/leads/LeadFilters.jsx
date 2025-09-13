import React from 'react';
import { useAppContext } from '../../context/AppContext'

/**
 * Lead Filters Component
 * Provides filtering and sorting controls for the leads list
 * Includes search, status filter, and sorting options
 * Updates are automatically saved to localStorage via context
 */

const LeadFilters = () => {
  const { filters, setFilters } = useAppContext();

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        {/* Search input field */}
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Search
          </label>
          <input
            id="search"
            type="text"
            placeholder="Name or company..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue"
          />
        </div>

        {/* Status filter dropdown */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            id="status"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue"
          >
            <option value="all">All</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
          </select>
        </div>

        {/* Sort by field dropdown */}
        <div>
          <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-1">
            Order by
          </label>
          <select
            id="sortBy"
            value={filters.sortBy}
            onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue"
          >
            <option value="score">Score</option>
            <option value="name">Name</option>
            <option value="company">Company</option>
          </select>
        </div>

        {/* Sort order dropdown */}
        <div>
          <label htmlFor="sortOrder" className="block text-sm font-medium text-gray-700 mb-1">
            Order
          </label>
          <select
            id="sortOrder"
            value={filters.sortOrder}
            onChange={(e) => setFilters({ ...filters, sortOrder: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue"
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default LeadFilters;