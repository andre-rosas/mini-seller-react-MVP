import React, { useState, useCallback } from 'react';
import { useAppContext } from '../../context/AppContext.jsx';
import { getStatusColor, validateEmail } from '../../utils/helpers.js';

/**
 * Lead Card Component
 * Displays individual lead information in a card format
 * Supports inline editing of email and status
 * Handles click events to open lead details
 */

const LeadCard = ({ lead, isEditing, onEdit, onCancelEdit, onSave }) => {
  const { updateLead, setSelectedLead, announceLiveMessage } = useAppContext();

  // State for managing edit form data
  const [editData, setEditData] = useState({
    status: lead.status,
    email: lead.email
  });
  // State for form validation errors
  const [errors, setErrors] = useState({});

  /**
   * Initialize edit mode with current lead data
   * Reset any existing errors and trigger parent edit callback
   */
  const handleEdit = useCallback(() => {
    setEditData({ status: lead.status, email: lead.email });
    setErrors({});
    onEdit();
  }, [lead.status, lead.email, onEdit]);

  /**
   * Validate form data and save changes
   * Shows validation errors if data is invalid
   * Updates lead and announces success to screen readers
   */
  const handleSave = useCallback(() => {
    const newErrors = {};

    // Validate email format
    if (!validateEmail(editData.email)) {
      newErrors.email = 'Invalid email';
    }

    // Show errors if validation fails
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Update lead and announce success
    updateLead(lead.id, editData);
    if (announceLiveMessage) {
      announceLiveMessage('Lead updated successfully');
    }
    setErrors({});
    onSave();
  }, [editData, lead.id, onSave, updateLead, announceLiveMessage]);

  /**
   * Cancel edit mode and revert to original data
   * Reset form data to lead's current values and clear errors
   */
  const handleCancel = useCallback(() => {
    setEditData({ status: lead.status, email: lead.email });
    setErrors({});
    onCancelEdit();
  }, [lead.status, lead.email, onCancelEdit]);

  /**
   * Handle card click to open lead details
   * Only works when not in edit mode to prevent conflicts
   */
  const handleCardClick = useCallback(() => {
    if (!isEditing) {
      setSelectedLead(lead);
    }
  }, [isEditing, lead, setSelectedLead]);

  /**
   * Handle keyboard navigation for card selection
   * Supports Enter and Space keys for accessibility
   */
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick();
    }
  }, [handleCardClick]);

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`See details of ${lead.name} from company ${lead.company}`}
      className={`bg-white rounded-lg shadow-md border border-gray-200 p-6 cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-primary-blue ${isEditing ? 'ring-2 ring-primary-blue' : ''
        }`}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">

          {/* Lead name and status badge */}
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{lead.name}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
              {lead.status}
            </span>
          </div>

          {/* Company name */}
          <p className="text-gray-600 mb-1">{lead.company}</p>

          {/* Conditional rendering: Edit form vs display mode */}
          {isEditing ? (
            <div className="space-y-3">
              {/* Email input field */}
              <div>
                <label htmlFor={`email-input-${lead.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  id={`email-input-${lead.id}`}
                  type="email"
                  value={editData.email}
                  onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue ${errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                  onClick={(e) => e.stopPropagation()}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? `email-error-${lead.id}` : undefined}
                />

                {/* Display email validation error */}
                {errors.email && (
                  <p id={`email-error-${lead.id}`} className="text-red-500 text-sm mt-1">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Status select dropdown */}
              <div>
                <label htmlFor={`status-select-${lead.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id={`status-select-${lead.id}`}
                  value={editData.status}
                  onChange={(e) => setEditData(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue"
                  onClick={(e) => e.stopPropagation()}
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="qualified">Qualified</option>
                </select>
              </div>
            </div>
          ) : (

            /* Display email in read-only mode */
            <p className="text-gray-500">{lead.email}</p>
          )}

          {/* Lead source and score information */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>Source: {lead.source}</span>
              <span>Score: {lead.score}</span>
            </div>
          </div>
        </div>

        {/* Action buttons section */}
        <div className="flex items-center space-x-2 ml-4">
          {isEditing ? (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); handleSave(); }}
                className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                aria-label="Save changes"
              >
                Save
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleCancel(); }}
                className="px-3 py-1 bg-gray-500 text-white text-sm rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
                aria-label="Cancel edition"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={(e) => { e.stopPropagation(); handleEdit(); }}
              className="px-3 py-1 bg-primary-blue text-white text-sm rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label={`Edit lead ${lead.name}`}
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(LeadCard);