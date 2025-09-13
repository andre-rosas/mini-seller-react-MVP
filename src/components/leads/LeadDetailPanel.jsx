import React, { useEffect, useRef } from 'react';
import { useAppContext } from '../../context/AppContext.jsx';
import { getStatusColor } from '../../utils/helpers.js';

/**
 * Lead Detail Panel Component
 * Side panel that displays comprehensive lead information
 * Allows conversion of leads to opportunities
 * Manages keyboard navigation and accessibility
 */

const LeadDetailPanel = ({ lead, isOpen, onClose }) => {
  const { convertLeadToOpportunity, opportunities, error, isLoading, clearError, announceLiveMessage } = useAppContext();
  const panelRef = useRef(null);
  const closeButtonRef = useRef(null);

  /**
   * Set up keyboard event handlers and focus management
   * Handles Escape key for closing panel
   * Sets focus to close button when panel opens for accessibility
   */

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Focus on close button when panel opens for accessibility
      closeButtonRef.current?.focus();
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  // Don't render anything if panel is closed or no lead is selected
  if (!isOpen || !lead) return null;

  /**
   * Handle lead conversion to opportunity
   * Clears any existing errors and announces the action
   */
  const handleConvert = () => {
    clearError();
    announceLiveMessage('Converting lead in opportunity');
    convertLeadToOpportunity(lead.id);
  };

  // Check if lead has already been converted to an opportunity
  const isAlreadyConverted = opportunities.some(opp => opp.leadId === lead.id);

  return (
    <>

      {/* Modal backdrop overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
        role="presentation"
        aria-hidden={!isOpen}
      ></div>

      {/* Side panel container */}
      <div
        ref={panelRef}
        className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out"
        role="dialog"
        aria-modal="true"
        aria-labelledby="panel-title"
        aria-describedby="panel-description"
      >
        <div className="flex flex-col h-full">

          {/* Panel header with title and close button */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 id="panel-title" className="text-xl font-semibold text-gray-900">Lead's Details</h2>
            <button
              ref={closeButtonRef}
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-blue rounded-md p-1"
              aria-label="Close detail panel"
            >

              {/* Close icon (X) */}
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">

            {/* Error message display with dismiss button */}
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded flex justify-between items-center" role="alert">
                <span className="text-sm">{error}</span>
                <button
                  onClick={clearError}
                  className="ml-2 text-red-500 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-md p-1"
                  aria-label="Close error message"
                >

                  {/* Close icon for error */}
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}

            <div id="panel-description" className="space-y-6">

              {/* Basic Information Section */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Basic informations</h3>
                <div className="space-y-4">

                  {/* Lead Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <p className="text-gray-900">{lead.name}</p>
                  </div>

                  {/* Company Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                    <p className="text-gray-900">{lead.company}</p>
                  </div>

                  {/* Email Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <p className="text-gray-900">{lead.email}</p>
                  </div>

                  {/* Status with colored badge */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                      {lead.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Additional Information Section */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Information</h3>
                <div className="space-y-4">

                  {/* Lead Source/Origin */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Origin</label>
                    <p className="text-gray-900">{lead.source}</p>
                  </div>

                  {/* Lead Score with progress bar visualization */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Score</label>
                    <div className="flex items-center space-x-2">

                      {/* Progress bar container */}
                      <div
                        className="flex-1 bg-gray-200 rounded-full h-2"
                        role="progressbar"
                        aria-valuenow={lead.score}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >

                        {/* Progress bar fill */}
                        <div
                          className="bg-primary-blue h-2 rounded-full transition-all duration-300"
                          style={{ width: `${lead.score}%` }}
                        ></div>
                      </div>

                      {/* Score percentage text */}
                      <span className="text-sm text-gray-600">{lead.score}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Conversion Status Message */}
              {isAlreadyConverted && (
                <div className="bg-green-50 border border-green-200 p-4 rounded-md">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-green-700 font-medium">Lead already converted into opportunity</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-gray-200 p-6">
            <div className="flex space-x-3">

              {/* Convert to Opportunity Button */}
              <button
                onClick={handleConvert}
                disabled={isAlreadyConverted || isLoading}
                className={`flex-1 py-2 px-4 rounded-md font-medium flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 ${isAlreadyConverted || isLoading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed focus:ring-gray-400'
                  : 'bg-green-600 text-white hover:bg-green-700 transition-colors focus:ring-green-500'
                  }`}
                aria-label={isAlreadyConverted ? 'Already converted' : 'Convert into opportunity'}
              >
                {isLoading ? (
                  /* Loading state with spinner */
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Converting...
                  </>
                ) : isAlreadyConverted ? (
                  'Already converted'
                ) : (
                  'Convert into opportunity'
                )}
              </button>

              {/* Close Panel Button */}
              <button
                onClick={onClose}
                disabled={isLoading}
                className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-blue ${isLoading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-primary-blue text-white hover:bg-blue-700'
                  }`}
                aria-label="Close panel"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LeadDetailPanel;