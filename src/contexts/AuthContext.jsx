import { createContext, useContext, useState, useEffect } from 'react';
import { getFromStorage, setToStorage, removeFromStorage } from '../utils/storage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const userId = getFromStorage('currentUser');
    if (userId) {
      // Verify user exists in storage
      const users = getFromStorage('users') || [];
      const user = users.find(u => u.userId === userId);
      
      if (user) {
        setIsAuthenticated(true);
        setCurrentUserId(userId);
      } else {
        // User not found, clear invalid session
        removeFromStorage('currentUser');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (userId) => {
    setIsAuthenticated(true);
    setCurrentUserId(userId);
    setToStorage('currentUser', userId);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUserId(null);
    removeFromStorage('currentUser');
  };

  const value = {
    isAuthenticated,
    currentUserId,
    login,
    logout,
    isLoading
  };

  // Show loading state during initial session check
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        Loading...
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
