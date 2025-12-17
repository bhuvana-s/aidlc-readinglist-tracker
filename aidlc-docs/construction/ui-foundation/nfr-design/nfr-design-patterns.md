# NFR Design Patterns - UI Foundation

## Overview
This document defines the design patterns for incorporating non-functional requirements into the UI Foundation implementation using React, CSS Modules, and Vite.

---

## 1. React Component Architecture Patterns

### 1.1 Component Composition Pattern: Simple Composition

**Pattern**: Basic parent-child composition without special patterns

**Implementation**:
```javascript
// Parent component
function BookListComponent() {
  const [books, setBooks] = useState([]);
  
  return (
    <div>
      {books.map(book => (
        <BookItemComponent 
          key={book.id} 
          book={book}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}

// Child component
function BookItemComponent({ book, onEdit, onDelete }) {
  return (
    <div className={styles.bookItem}>
      <h3>{book.title}</h3>
      <p>{book.author}</p>
      <button onClick={() => onEdit(book.id)}>Edit</button>
      <button onClick={() => onDelete(book.id)}>Delete</button>
    </div>
  );
}
```

**Rationale**:
- Simple and straightforward
- No learning curve for special patterns
- Sufficient for small application (10 components)
- Aligns with minimal complexity approach

### 1.2 Component Structure Pattern

**Standard Component Structure**:
```javascript
// Component.jsx
import { useState, useEffect } from 'react';
import styles from './Component.module.css';

function Component({ prop1, prop2, onEvent }) {
  // 1. State declarations
  const [state, setState] = useState(initialValue);
  
  // 2. Effect hooks
  useEffect(() => {
    // Side effects
  }, [dependencies]);
  
  // 3. Event handlers
  const handleClick = () => {
    // Handle event
    onEvent(data);
  };
  
  // 4. Helper functions
  const helperFunction = () => {
    // Helper logic
  };
  
  // 5. Render
  return (
    <div className={styles.container}>
      {/* JSX */}
    </div>
  );
}

export default Component;
```

**Rationale**: Consistent structure improves readability and maintainability

---

## 2. Performance Optimization Patterns

### 2.1 No Premature Optimization Pattern

**Pattern**: Trust React's default behavior, no manual optimization

**Implementation**:
- No React.memo() wrapping components
- No useMemo() for computed values
- No useCallback() for event handlers
- Let React handle re-renders naturally

**Example**:
```javascript
// Simple component without optimization
function BookItemComponent({ book, onEdit }) {
  return (
    <div>
      <h3>{book.title}</h3>
      <button onClick={() => onEdit(book.id)}>Edit</button>
    </div>
  );
}

// NOT using React.memo, useMemo, or useCallback
```

**Rationale**:
- Small application (~10 components)
- Performance targets easily met without optimization
- Simpler code, easier to maintain
- Avoid premature optimization complexity

**When to Optimize** (if needed later):
- If interactions exceed 100ms target
- If rendering large lists (>100 items)
- If profiling identifies bottlenecks

### 2.2 Single Bundle Pattern

**Pattern**: No code splitting, single bundle for entire application

**Implementation**:
```javascript
// vite.config.js
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Vendor splitting only (automatic)
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom']
        }
      }
    }
  }
});
```

**Rationale**:
- Estimated bundle ~130KB gzipped (well under 250KB target)
- Simpler implementation (no lazy loading, no Suspense)
- Faster initial load (no additional network requests)
- No loading states for route transitions

---

## 3. CSS Architecture Patterns

### 3.1 Global Design Tokens Pattern

**Pattern**: All CSS custom properties in single global.css file

**Implementation**:
```css
/* global.css */
:root {
  /* Colors */
  --color-primary: #3B82F6;
  --color-primary-dark: #2563EB;
  --color-primary-light: #DBEAFE;
  
  --color-secondary: #8B5CF6;
  --color-secondary-dark: #7C3AED;
  --color-secondary-light: #EDE9FE;
  
  --color-success: #10B981;
  --color-error: #EF4444;
  --color-warning: #F59E0B;
  --color-info: #06B6D4;
  
  --color-gray-900: #111827;
  --color-gray-700: #374151;
  --color-gray-500: #6B7280;
  --color-gray-300: #D1D5DB;
  --color-gray-100: #F3F4F6;
  
  --color-white: #FFFFFF;
  --color-black: #000000;
  
  /* Typography */
  --font-family-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-family-mono: 'Fira Code', 'Courier New', monospace;
  
  --font-size-xs: 12px;
  --font-size-sm: 14px;
  --font-size-base: 16px;
  --font-size-lg: 18px;
  --font-size-xl: 20px;
  --font-size-2xl: 24px;
  --font-size-3xl: 30px;
  
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  
  --line-height-tight: 1.25;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.75;
  
  /* Spacing */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --spacing-2xl: 48px;
  --spacing-3xl: 64px;
  
  /* Borders */
  --border-width-thin: 1px;
  --border-width-medium: 2px;
  --border-width-thick: 4px;
  
  --border-radius-sm: 4px;
  --border-radius-md: 8px;
  --border-radius-lg: 12px;
  --border-radius-full: 9999px;
  
  --border-color-default: var(--color-gray-300);
  --border-color-focus: var(--color-primary);
  --border-color-error: var(--color-error);
  
  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.15);
  
  /* Animations */
  --duration-fast: 150ms;
  --duration-normal: 300ms;
  --duration-slow: 500ms;
  
  --easing-ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --easing-ease-out: cubic-bezier(0, 0, 0.2, 1);
  --easing-ease-in: cubic-bezier(0.4, 0, 1, 1);
}

/* Global resets and base styles */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: var(--font-family-primary);
  font-size: var(--font-size-base);
  line-height: var(--line-height-normal);
  color: var(--color-gray-900);
  background-color: var(--color-white);
}
```

**Rationale**:
- Single source of truth for design tokens
- Easy to update (change one value, affects entire app)
- CSS Modules can reference global custom properties
- Simple and maintainable

### 3.2 CSS Modules Pattern

**Pattern**: Component-scoped styles using CSS Modules

**Implementation**:
```css
/* Button.module.css */
.button {
  padding: var(--spacing-md);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  border-radius: var(--border-radius-sm);
  border: none;
  cursor: pointer;
  transition: all var(--duration-fast) var(--easing-ease-in-out);
}

.buttonPrimary {
  background-color: var(--color-primary);
  color: var(--color-white);
}

.buttonPrimary:hover {
  background-color: var(--color-primary-dark);
}

.buttonSecondary {
  background-color: var(--color-secondary);
  color: var(--color-white);
}
```

```javascript
// Button.jsx
import styles from './Button.module.css';

function Button({ variant = 'primary', children, onClick }) {
  const className = variant === 'primary' 
    ? `${styles.button} ${styles.buttonPrimary}`
    : `${styles.button} ${styles.buttonSecondary}`;
    
  return (
    <button className={className} onClick={onClick}>
      {children}
    </button>
  );
}
```

**Rationale**:
- Automatic class name scoping (no conflicts)
- Traditional CSS syntax (familiar)
- References global design tokens
- No runtime overhead

### 3.3 Responsive Design Pattern

**Pattern**: Desktop-first with CSS media queries

**Implementation**:
```css
/* Component.module.css */
.container {
  max-width: 1200px;
  padding: var(--spacing-lg);
  margin: 0 auto;
}

/* Tablet */
@media (max-width: 1023px) {
  .container {
    padding: var(--spacing-md);
  }
}

/* Mobile */
@media (max-width: 767px) {
  .container {
    padding: var(--spacing-sm);
  }
  
  .button {
    width: 100%;
    min-height: 44px; /* Touch target */
  }
}
```

**Rationale**:
- Desktop-first approach (as decided)
- Simple media queries
- Scales down for smaller screens

---

## 4. State Management Patterns

### 4.1 Minimal Context Pattern

**Pattern**: Only authentication context, other state stays local

**Implementation**:
```javascript
// AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  
  // Check session on mount
  useEffect(() => {
    const userId = localStorage.getItem('currentUser');
    if (userId) {
      setIsAuthenticated(true);
      setCurrentUserId(userId);
    }
  }, []);
  
  const login = (userId) => {
    setIsAuthenticated(true);
    setCurrentUserId(userId);
    localStorage.setItem('currentUser', userId);
  };
  
  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUserId(null);
    localStorage.removeItem('currentUser');
  };
  
  return (
    <AuthContext.Provider value={{ isAuthenticated, currentUserId, login, logout }}>
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
```

**Usage**:
```javascript
// App.jsx
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        {/* Routes */}
      </Router>
    </AuthProvider>
  );
}

// Any component
import { useAuth } from './contexts/AuthContext';

function SomeComponent() {
  const { isAuthenticated, currentUserId, logout } = useAuth();
  
  return (
    <div>
      {isAuthenticated && <button onClick={logout}>Logout</button>}
    </div>
  );
}
```

**Rationale**:
- Only global state is authentication
- Other state (books, forms, etc.) stays in components
- Minimizes context re-render issues
- Simple and focused

### 4.2 Local State Pattern

**Pattern**: Component-local state with useState

**Implementation**:
```javascript
function BookListComponent() {
  // Local state
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Load books on mount
  useEffect(() => {
    loadBooks();
  }, []);
  
  const loadBooks = () => {
    setLoading(true);
    try {
      const data = JSON.parse(localStorage.getItem('books') || '[]');
      setBooks(data);
    } catch (err) {
      setError('Failed to load books');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {books.map(book => <BookItem key={book.id} book={book} />)}
    </div>
  );
}
```

**Rationale**:
- State lives where it's used
- No prop drilling for local data
- Simple and predictable

### 4.3 Manual Storage Sync Pattern

**Pattern**: Components manually read/write to localStorage

**Implementation**:
```javascript
// storage.js - Utility functions
export function getFromStorage(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error reading from storage:', error);
    return null;
  }
}

export function setToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    if (error.name === 'QuotaExceededError') {
      alert('Storage quota exceeded. Please delete some books.');
    }
    console.error('Error writing to storage:', error);
    return false;
  }
}

// Component usage
import { getFromStorage, setToStorage } from './utils/storage';

function BookListComponent() {
  const [books, setBooks] = useState([]);
  
  // Load on mount
  useEffect(() => {
    const data = getFromStorage('books') || [];
    setBooks(data);
  }, []);
  
  // Save when books change
  const addBook = (newBook) => {
    const updatedBooks = [...books, newBook];
    setBooks(updatedBooks);
    setToStorage('books', updatedBooks);
  };
  
  return (/* JSX */);
}
```

**Rationale**:
- Simple and explicit
- Full control over when storage is accessed
- Easy to debug
- No automatic sync complexity

---

## 5. Error Handling Patterns

### 5.1 Component-Level Error Boundaries

**Pattern**: Error boundary for each major component

**Implementation**:
```javascript
// ErrorBoundary.jsx
import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="error-container">
          <h2>Something went wrong</h2>
          <p>{this.state.error?.message}</p>
          <button onClick={() => this.setState({ hasError: false })}>
            Try Again
          </button>
        </div>
      );
    }
    
    return this.props.children;
  }
}

export default ErrorBoundary;
```

**Usage**:
```javascript
// Wrap each major component
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/books" element={
          <ErrorBoundary>
            <BookListComponent />
          </ErrorBoundary>
        } />
        <Route path="/statistics" element={
          <ErrorBoundary>
            <StatisticsComponent />
          </ErrorBoundary>
        } />
      </Routes>
    </Router>
  );
}
```

**Rationale**:
- Isolates errors to specific components
- Prevents full app crash
- User can recover by trying again
- Better UX than blank screen

### 5.2 Component Error State Pattern

**Pattern**: Each component manages its own error state

**Implementation**:
```javascript
function BookFormComponent() {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  
  const validateField = (name, value) => {
    let error = null;
    
    if (name === 'title' && !value) {
      error = 'Title is required';
    } else if (name === 'email' && !value.includes('@')) {
      error = 'Invalid email format';
    }
    
    setErrors(prev => ({ ...prev, [name]: error }));
    return !error;
  };
  
  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };
  
  return (
    <form>
      <input 
        name="title"
        value={formData.title}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      {errors.title && <span className="error">{errors.title}</span>}
    </form>
  );
}
```

**Rationale**:
- Component-level validation logic
- Inline error display
- Simple and self-contained

---

## 6. Security Patterns

### 6.1 XSS Prevention Pattern

**Pattern**: Use React's built-in XSS protection

**Implementation**:
```javascript
// React automatically escapes values in JSX
function BookItemComponent({ book }) {
  return (
    <div>
      {/* Safe - React escapes book.title */}
      <h3>{book.title}</h3>
      
      {/* Safe - React escapes book.notes */}
      <p>{book.notes}</p>
      
      {/* UNSAFE - Don't use dangerouslySetInnerHTML unless necessary */}
      {/* <div dangerouslySetInnerHTML={{ __html: book.notes }} /> */}
    </div>
  );
}
```

**Rules**:
- Never use `dangerouslySetInnerHTML` with user input
- Let React handle escaping automatically
- Validate inputs before storing

### 6.2 Secure Password Storage Pattern

**Pattern**: Hash passwords with bcryptjs before storing

**Implementation**:
```javascript
import bcrypt from 'bcryptjs';

// Registration
async function handleRegister(email, password) {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  
  const user = {
    userId: generateId(),
    email,
    passwordHash: hashedPassword,
    createdAt: new Date().toISOString()
  };
  
  // Store user with hashed password
  const users = getFromStorage('users') || [];
  users.push(user);
  setToStorage('users', users);
}

// Login
async function handleLogin(email, password) {
  const users = getFromStorage('users') || [];
  const user = users.find(u => u.email === email);
  
  if (!user) {
    return { success: false, error: 'Invalid credentials' };
  }
  
  const isValid = await bcrypt.compare(password, user.passwordHash);
  
  if (!isValid) {
    return { success: false, error: 'Invalid credentials' };
  }
  
  return { success: true, userId: user.userId };
}
```

**Rationale**:
- Never store plain text passwords
- bcrypt is industry standard
- Slow hashing prevents brute force

---

## 7. Routing Patterns

### 7.1 Protected Route HOC Pattern

**Pattern**: Higher-Order Component for route protection

**Implementation**:
```javascript
// ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

export default ProtectedRoute;
```

**Usage**:
```javascript
// App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<AuthComponent mode="login" />} />
        <Route path="/register" element={<AuthComponent mode="register" />} />
        
        {/* Protected routes */}
        <Route path="/books" element={
          <ProtectedRoute>
            <BookListComponent />
          </ProtectedRoute>
        } />
        <Route path="/statistics" element={
          <ProtectedRoute>
            <StatisticsComponent />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}
```

**Rationale**:
- Reusable across all protected routes
- Clean and declarative
- React Router v6 compatible

---

## 8. Loading State Pattern

### 8.1 Global Loading Context Pattern

**Pattern**: Loading context with fixed position overlay

**Implementation**:
```javascript
// LoadingContext.jsx
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
  
  return (
    <LoadingContext.Provider value={{ showLoading, hideLoading }}>
      {children}
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          {message && <p>{message}</p>}
        </div>
      )}
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
```

**CSS**:
```css
/* LoadingOverlay.module.css */
.loadingOverlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loadingSpinner {
  width: 48px;
  height: 48px;
  border: 4px solid var(--color-gray-300);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

**Usage**:
```javascript
import { useLoading } from './contexts/LoadingContext';

function BookListComponent() {
  const { showLoading, hideLoading } = useLoading();
  
  const loadBooks = async () => {
    showLoading('Loading books...');
    try {
      // Load data
      await someAsyncOperation();
    } finally {
      hideLoading();
    }
  };
  
  return (/* JSX */);
}
```

**Rationale**:
- Global accessibility from any component
- Counter handles multiple simultaneous operations
- Fixed position overlay prevents interaction
- Simple implementation

---

## 9. Accessibility Patterns

### 9.1 Keyboard Navigation Pattern

**Implementation**:
```javascript
function Modal({ isOpen, onClose, children }) {
  useEffect(() => {
    if (isOpen) {
      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);
  
  if (!isOpen) return null;
  
  return (
    <div 
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
```

### 9.2 ARIA Labels Pattern

**Implementation**:
```javascript
function Button({ children, onClick, ariaLabel }) {
  return (
    <button 
      onClick={onClick}
      aria-label={ariaLabel || children}
    >
      {children}
    </button>
  );
}

function IconButton({ icon, onClick, ariaLabel }) {
  return (
    <button 
      onClick={onClick}
      aria-label={ariaLabel}
    >
      <span aria-hidden="true">{icon}</span>
    </button>
  );
}
```

### 9.3 Focus Management Pattern

**Implementation**:
```javascript
function Modal({ isOpen, onClose, children }) {
  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);
  
  useEffect(() => {
    if (isOpen) {
      // Save current focus
      previousFocusRef.current = document.activeElement;
      
      // Focus modal
      modalRef.current?.focus();
      
      return () => {
        // Restore focus on close
        previousFocusRef.current?.focus();
      };
    }
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  return (
    <div 
      ref={modalRef}
      tabIndex={-1}
      role="dialog"
    >
      {children}
    </div>
  );
}
```

---

## 10. Form Validation Pattern

### 10.1 Component-Level Validation

**Pattern**: Each form handles its own validation logic

**Implementation**:
```javascript
function BookFormComponent({ book, onSave, onCancel }) {
  const [formData, setFormData] = useState(book || {});
  const [errors, setErrors] = useState({});
  
  const validateField = (name, value) => {
    let error = null;
    
    switch (name) {
      case 'title':
        if (!value || value.trim() === '') {
          error = 'Title is required';
        }
        break;
      case 'author':
        if (!value || value.trim() === '') {
          error = 'Author is required';
        }
        break;
      case 'totalPages':
        if (!value || value <= 0) {
          error = 'Total pages must be greater than 0';
        }
        break;
    }
    
    setErrors(prev => ({ ...prev, [name]: error }));
    return !error;
  };
  
  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all fields
    const isValid = Object.keys(formData).every(key => 
      validateField(key, formData[key])
    );
    
    if (isValid) {
      onSave(formData);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="title">Title *</label>
        <input
          id="title"
          name="title"
          value={formData.title || ''}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {errors.title && <span className="error">{errors.title}</span>}
      </div>
      
      <button type="submit">Save</button>
      <button type="button" onClick={onCancel}>Cancel</button>
    </form>
  );
}
```

**Rationale**:
- Self-contained validation logic
- On-blur validation for better UX
- Submit validation prevents invalid data
- No external library needed

---

## Summary

All NFR design patterns prioritize:
1. **Simplicity**: No complex patterns, straightforward implementations
2. **Minimal Optimization**: Trust React, optimize only if needed
3. **Component-Level Logic**: Each component self-contained
4. **Manual Control**: Explicit over automatic (storage sync, validation)
5. **Standard Practices**: Use React best practices without over-engineering

These patterns support the implementation of all 10 UI Foundation components while meeting performance, security, and accessibility requirements.
