import React, { useState } from 'react';
import { AppProvider, useAppContext } from './context/AppContext.jsx';
import LeadsList from './components/leads/LeadsList.jsx';
import LeadDetailPanel from './components/leads/LeadDetailPanel.jsx';
import OpportunitiesList from './components/opportunities/OpportunitiesList.jsx';
import LiveAnnouncer from './components/accessibility/LiveAnnouncer.jsx';

/**
 * App Content Component
 * Main application content that requires access to the application context
 * Manages tab navigation between Leads and Opportunities views
 * Handles the lead detail panel state and visibility
 */
function AppContent() {
  const { selectedLead, setSelectedLead } = useAppContext();

  // State for managing active tab (leads or opportunities)
  const [activeTab, setActiveTab] = useState('leads');

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            {/* Application Title */}
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Mini Seller Console
              </h1>
            </div>

            {/* Navigation Tabs */}
            <nav className="flex space-x-8">

              {/* Leads Tab Button */}
              <button
                onClick={() => setActiveTab('leads')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${activeTab === 'leads'
                  ? 'bg-primary-blue text-white'
                  : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                Leads
              </button>

              {/* Opportunities Tab Button */}
              <button
                onClick={() => setActiveTab('opportunities')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${activeTab === 'opportunities'
                  ? 'bg-primary-blue text-white'
                  : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                Opportunities
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Conditional rendering based on active tab */}
        {activeTab === 'leads' ? (
          <LeadsList />
        ) : (
          <OpportunitiesList />
        )}
      </main>

      {/* Lead Detail Panel */}
      <LeadDetailPanel
        lead={selectedLead}
        isOpen={!!selectedLead}
        onClose={() => setSelectedLead(null)}
      />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <LiveAnnouncer />
      <AppContent />
    </AppProvider>
  );
}

export default App;
