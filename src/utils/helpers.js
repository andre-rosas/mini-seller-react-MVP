/**
 * Validate email address format using regex pattern
 * Checks for valid email structure including domain and TLD
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if email format is valid, false otherwise
 */
export const validateEmail = (email) => {

  // Type guard to ensure email is a string
  if (typeof email !== 'string') return false;

  // Comprehensive email validation regex pattern
  const emailRegex = new RegExp(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
  return emailRegex.test(email);
};

/**
 * Format numeric amount as Brazilian Real currency
 * Uses Brazilian Portuguese and BRL currency format
 * @param {number} amount - Numeric amount to format
 * @returns {string} - Formatted currency string (e.g., "R$ 1.234,56")
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(amount);
};

/**
 * Get Tailwind CSS classes for lead status badges
 * Returns appropriate background and text colors based on status
 * @param {string} status - Lead status (new, contacted, qualified, etc.)
 * @returns {string} - Tailwind CSS classes for styling status badges
 */
export const getStatusColor = (status) => {
  const colors = {
    new: 'bg-blue-100 text-blue-800',
    contacted: 'bg-yellow-100 text-yellow-800',
    qualified: 'bg-green-100 text-green-800',
    'closed-won': 'bg-green-100 text-green-800',
    'closed-lost': 'bg-red-100 text-red-800'
  };

  // Return specific color or default gray if status not found
  return colors[status] || 'bg-gray-100 text-gray-800';
};

/**
 * Get Tailwind CSS classes for opportunity stage badges
 * Returns appropriate background and text colors based on sales stage
 * @param {string} stage - Opportunity stage (prospecting, qualification, etc.)
 * @returns {string} - Tailwind CSS classes for styling stage badges
 */
export const getStageColor = (stage) => {
  const colors = {
    'prospecting': 'bg-blue-100 text-blue-800',
    'qualification': 'bg-yellow-100 text-yellow-800',
    'proposal': 'bg-orange-100 text-orange-800',
    'negotiation': 'bg-purple-100 text-purple-800',
    'closed-won': 'bg-green-100 text-green-800',
    'closed-lost': 'bg-red-100 text-red-800'
  };

  // Return specific color or default gray if stage not found
  return colors[stage] || 'bg-gray-100 text-gray-800';
};
