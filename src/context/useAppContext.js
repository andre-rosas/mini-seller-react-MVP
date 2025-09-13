import { useContext } from 'react';
import { AppContext } from './AppContext';

/**
 * Custom hook to access the Application Context
 * Provides a safe way to consume context with error checking
 * Throws descriptive error if used outside of AppProvider
 * 
 * @returns {Object} Application context value containing state and actions
 * @throws {Error} If hook is used outside of AppProvider component tree
 */
export const useAppContext = () => {
  const context = useContext(AppContext);

  // Ensure hook is used within proper provider
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
