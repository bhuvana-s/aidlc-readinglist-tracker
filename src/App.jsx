import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LoadingProvider } from './contexts/LoadingContext';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingOverlay from './components/LoadingOverlay';
import AuthComponent from './components/auth/AuthComponent';
import BookListComponent from './components/books/BookListComponent';
import PlaceholderComponent from './components/PlaceholderComponent';
import { migrateBooks } from './utils/storage';
import styles from './App.module.css';



function AppContent() {
  // Run migration on app load
  useEffect(() => {
    migrateBooks();
  }, []);
  return (
    <div className={styles.app}>
      <main className={styles.main}>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<AuthComponent mode="login" />} />
          <Route path="/register" element={<AuthComponent mode="register" />} />

          {/* Protected Routes */}
          <Route 
            path="/books" 
            element={
              <ProtectedRoute>
                <ErrorBoundary>
                  <BookListComponent />
                </ErrorBoundary>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/statistics" 
            element={
              <ProtectedRoute>
                <PlaceholderComponent 
                  title="Statistics" 
                  description="Statistics dashboard will be implemented in Unit 4: Analytics & Utilities"
                />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/search" 
            element={
              <ProtectedRoute>
                <PlaceholderComponent 
                  title="Search" 
                  description="Search functionality will be implemented in Unit 4: Analytics & Utilities"
                />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/export" 
            element={
              <ProtectedRoute>
                <PlaceholderComponent 
                  title="Export" 
                  description="Data export will be implemented in Unit 4: Analytics & Utilities"
                />
              </ProtectedRoute>
            } 
          />

          {/* Default Route */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </main>
      <LoadingOverlay />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <LoadingProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </LoadingProvider>
    </AuthProvider>
  );
}

export default App;
