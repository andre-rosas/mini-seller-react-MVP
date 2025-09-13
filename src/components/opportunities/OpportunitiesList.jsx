import React from 'react';
import { useAppContext } from '../../context/AppContext.jsx';
import { formatCurrency } from '../../utils/helpers.js';

/**
 * Opportunities List Component
 * Displays all converted opportunities in a table format
 * Shows empty state when no opportunities exist
 */

const OpportunitiesList = () => {
  const { opportunities } = useAppContext();

  // Render empty state when no opportunities are available
  if (opportunities.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No opportunity</h3>
        <p className="text-gray-500">Convert leads into opportunities</p>
      </div>
    );
  }

  // Render opportunities table when data is available
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Opportunities</h2>
        </div>

        {/* Scrollable table container */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stage</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account</th>
              </tr>
            </thead>

            {/* Table body with opportunity data */}
            <tbody className="bg-white divide-y divide-gray-200">
              {opportunities.map((opportunity) => (
                <tr key={opportunity.id} className="hover:bg-gray-50">

                  {/* Opportunity name */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{opportunity.name}</div>
                  </td>

                  {/* Opportunity stage with colored badge */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {opportunity.stage}
                    </span>
                  </td>

                  {/* Opportunity value formatted as currency */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {opportunity.amount ? formatCurrency(opportunity.amount) : '-'}
                  </td>

                  {/* Account name */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {opportunity.accountName}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OpportunitiesList;
