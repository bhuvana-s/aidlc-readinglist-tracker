import { createContext, useContext, useState } from 'react';

const LoadingContext = createContext(null);

export function LoadingProvider({ children }) {
  const [loadingCounter, setLoadingCounter] = useState(0);
  const [message, setMessage] = useState('');

  const showLoading = (msg = 'Loading...') => {
    setLoadingCounter(prev => prev + 1);
    setMessage(msg);
  };

  const hideLoading = () => {
    setLoadingCounter(prev => Math.max(0, prev - 1));
  };

  const isLoading = loadingCounter > 0;

  const value = {
    isLoading,
    message,
    showLoading,
    hideLoading
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within LoadingProvider');
  }
  return context;
}
