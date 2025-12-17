# NFR Design Patterns - Core Features

## Overview
This document defines the design patterns for incorporating non-functional requirements into Unit 2: Core Features implementation. These patterns focus on authentication and book management functionality while inheriting foundational patterns from Unit 1: UI Foundation.

---

## 1. Authentication Component Patterns

### 1.1 Single Component with Mode Toggle Pattern

**Pattern**: One AuthComponent handles both login and registration with mode switching

**Implementation**:
```javascript
// AuthComponent.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLoading } from '../contexts/LoadingContext';
import bcrypt from 'bcryptjs';
import { getFromStorage, setToStorage } from '../utils/storage';
import { generateId } from '../utils/idGenerator';
import { getCurrentDate } from '../utils/dateUtils';
import styles from './AuthComponent.module.css';

function AuthComponent({ mode = 'login' }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const { login } = useAuth();
  const { showLoading, hideLoading } = useLoading();
  const navigate = useNavigate();
  
  const isRegisterMode = mode === 'register';

  
  const validateEmail = (email) => {
    if (!email || email.trim() === '') {
      return 'Email is required';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Invalid email format';
    }
    return null;
  };
  
  const validatePassword = (password) => {
    if (!password || password.trim() === '') {
      return 'Password is required';
    }
    if (password.length < 8) {
      return 'Password must be at least 8 characters';
    }
    if (!/[a-zA-Z]/.test(password)) {
      return 'Password must contain at least one letter';
    }
    if (!/[0-9]/.test(password)) {
      return 'Password must contain at least one number';
    }
    return null;
  };
  
  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = name === 'email' ? validateEmail(value) : validatePassword(value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    
    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError });
      return;
    }
    
    if (isRegisterMode) {
      await handleRegister();
    } else {
      await handleLogin();
    }
  };
  
  const handleRegister = async () => {
    showLoading('Creating account...');
    
    try {
      // Check email uniqueness
      const users = getFromStorage('users') || [];
      const existingUser = users.find(u => u.email === formData.email);
      
      if (existingUser) {
        setErrors({ email: 'Email already registered' });
        return;
      }
      
      // Hash password (async, ~100-300ms)
      const passwordHash = await bcrypt.hash(formData.password, 10);
      
      // Create user
      const newUser = {
        userId: generateId(),
        email: formData.email,
        passwordHash,
        createdAt: getCurrentDate()
      };
      
      users.push(newUser);
      
      // Save to storage
      const saved = setToStorage('users', users);
      if (!saved) {
        alert('Storage quota exceeded. Please try again.');
        return;
      }
      
      // Auto-login
      login(newUser.userId);
      navigate('/books');
      
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
    } finally {
      hideLoading();
    }
  };
  
  const handleLogin = async () => {
    showLoading('Logging in...');
    
    try {
      // Find user
      const users = getFromStorage('users') || [];
      const user = users.find(u => u.email === formData.email);
      
      if (!user) {
        setErrors({ email: 'Invalid email or password' });
        return;
      }
      
      // Verify password (async, ~100-300ms)
      const isValid = await bcrypt.compare(formData.password, user.passwordHash);
      
      if (!isValid) {
        setErrors({ email: 'Invalid email or password' });
        return;
      }
      
      // Login
      login(user.userId);
      navigate('/books');
      
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    } finally {
      hideLoading();
    }
  };
  
  return (
    <div className={styles.container}>
      <h2>{isRegisterMode ? 'Create Account' : 'Login'}</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label htmlFor="email">Email *</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            onBlur={handleBlur}
          />
          {errors.email && <span className={styles.error}>{errors.email}</span>}
        </div>
        
        <div className={styles.field}>
          <label htmlFor="password">Password *</label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            onBlur={handleBlur}
          />
          {errors.password && <span className={styles.error}>{errors.password}</span>}
        </div>
        
        <button type="submit">
          {isRegisterMode ? 'Register' : 'Login'}
        </button>
      </form>
    </div>
  );
}

export default AuthComponent;
```

**Rationale**:
- Single component reduces code duplication
- Mode prop makes behavior explicit
- Shared validation logic
- Consistent UI between login and register
- Simple to maintain and test

---

## 2. Password Security Patterns

### 2.1 Component-Level Async Hashing Pattern

**Pattern**: Hash passwords directly in component using async/await with loading state

**Implementation**:
```javascript
// Registration with bcrypt hashing
const handleRegister = async () => {
  showLoading('Creating account...');
  
  try {
    // Hash password with 10 salt rounds (~100-300ms)
    const passwordHash = await bcrypt.hash(formData.password, 10);
    
    const newUser = {
      userId: generateId(),
      email: formData.email,
      passwordHash, // Store hash, never plain text
      createdAt: getCurrentDate()
    };
    
    // Save user
    const users = getFromStorage('users') || [];
    users.push(newUser);
    setToStorage('users', users);
    
  } finally {
    hideLoading();
  }
};

// Login with bcrypt verification
const handleLogin = async () => {
  showLoading('Logging in...');
  
  try {
    const users = getFromStorage('users') || [];
    const user = users.find(u => u.email === formData.email);
    
    if (!user) {
      setErrors({ email: 'Invalid email or password' });
      return;
    }
    
    // Verify password (~100-300ms)
    const isValid = await bcrypt.compare(formData.password, user.passwordHash);
    
    if (!isValid) {
      setErrors({ email: 'Invalid email or password' });
      return;
    }
    
    login(user.userId);
    
  } finally {
    hideLoading();
  }
};
```

**Security Rules**:
- Never store plain text passwords
- Always hash before storage (bcrypt.hash)
- Always verify with bcrypt.compare (never compare hashes directly)
- Use 10 salt rounds (industry standard)
- Show loading state during hashing (user feedback)
- Use global loading context for bcrypt operations

**Rationale**:
- Component-level keeps logic simple and visible
- Async/await handles bcrypt's asynchronous nature
- Loading state provides user feedback during slow operation
- No utility abstraction needed for straightforward hashing

---

## 3. Session Management Patterns

### 3.1 AuthContext Internal Session Check Pattern

**Pattern**: AuthContext validates session on mount using useEffect

**Implementation**:
```javascript
// AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { getFromStorage } from '../utils/storage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Check session on mount
  useEffect(() => {
    const userId = localStorage.getItem('currentUser');
    
    if (userId) {
      // Verify user still exists
      const users = getFromStorage('users') || [];
      const user = users.find(u => u.userId === userId);
      
      if (user) {
        setIsAuthenticated(true);
        setCurrentUserId(userId);
      } else {
        // Clear invalid session
        localStorage.removeItem('currentUser');
      }
    }
    
    setIsLoading(false);
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
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
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

**Session Lifecycle**:
1. **App Mount**: AuthContext checks localStorage for currentUser
2. **Validation**: Verify user exists in users array
3. **Invalid Session**: Clear localStorage if user not found
4. **Valid Session**: Set authenticated state
5. **Login**: Store userId in localStorage, update context
6. **Logout**: Remove userId from localStorage, clear context
7. **Browser Close**: Session persists (browser session behavior)

**Rationale**:
- Centralized session logic in AuthContext
- Automatic validation on app load
- Prevents orphaned sessions from deleted users
- Simple localStorage-based session management

---

## 4. Book List State Management Patterns

### 4.1 Local State + Manual Refresh Pattern

**Pattern**: Component manages book array with useState, manual loadBooks() calls

**Implementation**:
```javascript
// BookListComponent.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getFromStorage, setToStorage } from '../utils/storage';
import BookItemComponent from './BookItemComponent';
import BookFormModal from './BookFormModal';
import styles from './BookListComponent.module.css';

function BookListComponent() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const { currentUserId } = useAuth();
  
  // Load books on mount
  useEffect(() => {
    loadBooks();
  }, [currentUserId]);
  
  const loadBooks = () => {
    setLoading(true);
    try {
      const key = `books_${currentUserId}`;
      const userBooks = getFromStorage(key) || [];
      setBooks(userBooks);
    } catch (error) {
      console.error('Error loading books:', error);
      alert('Failed to load books');
    } finally {
      setLoading(false);
    }
  };
  
  const saveBooks = (updatedBooks) => {
    const key = `books_${currentUserId}`;
    const saved = setToStorage(key, updatedBooks);
    if (!saved) {
      alert('Storage quota exceeded. Please delete some books to free up space.');
      return false;
    }
    return true;
  };
  
  const handleAddBook = (bookData) => {
    const newBook = {
      bookId: generateId(),
      userId: currentUserId,
      ...bookData,
      pagesRead: 0,
      createdAt: getCurrentDate()
    };
    
    const updatedBooks = [...books, newBook];
    if (saveBooks(updatedBooks)) {
      setBooks(updatedBooks);
      setShowAddModal(false);
    }
  };
  
  const handleEditBook = (bookId, bookData) => {
    const updatedBooks = books.map(book =>
      book.bookId === bookId ? { ...book, ...bookData } : book
    );
    
    if (saveBooks(updatedBooks)) {
      setBooks(updatedBooks);
      setEditingBook(null);
    }
  };
  
  const handleDeleteBook = (bookId) => {
    if (!window.confirm('Are you sure you want to delete this book?')) {
      return;
    }
    
    const updatedBooks = books.filter(book => book.bookId !== bookId);
    if (saveBooks(updatedBooks)) {
      setBooks(updatedBooks);
    }
  };
  
  if (loading) {
    return <div>Loading books...</div>;
  }
  
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>My Books</h2>
        <button onClick={() => setShowAddModal(true)}>Add Book</button>
      </div>
      
      {books.length === 0 ? (
        <p>No books yet. Add your first book!</p>
      ) : (
        <div className={styles.bookList}>
          {books.map(book => (
            <BookItemComponent
              key={book.bookId}
              book={book}
              onEdit={() => setEditingBook(book)}
              onDelete={() => handleDeleteBook(book.bookId)}
            />
          ))}
        </div>
      )}
      
      {showAddModal && (
        <BookFormModal
          onSave={handleAddBook}
          onCancel={() => setShowAddModal(false)}
        />
      )}
      
      {editingBook && (
        <BookFormModal
          book={editingBook}
          onSave={(data) => handleEditBook(editingBook.bookId, data)}
          onCancel={() => setEditingBook(null)}
        />
      )}
    </div>
  );
}

export default BookListComponent;
```

**State Management Rules**:
- Books array in component local state
- Manual loadBooks() on mount and after mutations
- Explicit saveBooks() for all mutations
- No automatic sync or reactivity
- Simple and predictable data flow

**Rationale**:
- Simple useState sufficient for book list
- Manual refresh gives full control
- No complex state management library needed
- Easy to debug and understand

---

## 5. Form Validation Patterns

### 5.1 On Blur + On Submit Validation Pattern

**Pattern**: Validate individual fields on blur, re-validate all on submit

**Implementation**:
```javascript
// BookFormModal.jsx
function BookFormModal({ book, onSave, onCancel }) {
  const [formData, setFormData] = useState(book || {
    title: '',
    author: '',
    status: 'wishlist',
    totalPages: ''
  });
  const [errors, setErrors] = useState({});
  
  const validateField = (name, value) => {
    let error = null;
    
    switch (name) {
      case 'title':
        if (!value || value.trim() === '') {
          error = 'Title is required';
        } else if (value.length > 200) {
          error = 'Title must be between 1 and 200 characters';
        }
        break;
        
      case 'author':
        if (!value || value.trim() === '') {
          error = 'Author is required';
        } else if (!/^[a-zA-Z\s-]+$/.test(value)) {
          error = 'Author must contain only letters, spaces, and hyphens';
        }
        break;
        
      case 'status':
        if (!['wishlist', 'reading', 'completed'].includes(value)) {
          error = 'Status must be wishlist, reading, or completed';
        }
        break;
        
      case 'totalPages':
        const num = Number(value);
        if (!value) {
          error = 'Total pages is required';
        } else if (isNaN(num)) {
          error = 'Total pages must be a number';
        } else if (num < 1 || num > 10000) {
          error = 'Total pages must be between 1 and 10,000';
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
    const titleValid = validateField('title', formData.title);
    const authorValid = validateField('author', formData.author);
    const statusValid = validateField('status', formData.status);
    const pagesValid = validateField('totalPages', formData.totalPages);
    
    if (titleValid && authorValid && statusValid && pagesValid) {
      onSave(formData);
    }
  };
  
  return (
    <div className={styles.modal}>
      <form onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label htmlFor="title">Title *</label>
          <input
            id="title"
            name="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            onBlur={handleBlur}
          />
          {errors.title && <span className={styles.error}>{errors.title}</span>}
        </div>
        
        {/* Other fields... */}
        
        <div className={styles.actions}>
          <button type="submit">Save</button>
          <button type="button" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
```

**Validation Timing**:
- **On Blur**: Validate when user leaves field, show error immediately
- **On Submit**: Re-validate all fields, prevent submission if any invalid
- **On Change**: Update form data, clear error if user starts correcting

**Rationale**:
- On blur provides immediate feedback without being intrusive
- On submit ensures all fields valid before save
- Better UX than submit-only validation
- Simple component-level logic

---

## 6. Error Display Patterns

### 6.1 Inline Field Errors + Alerts Pattern

**Pattern**: Show validation errors inline, operation errors as alerts

**Implementation**:
```javascript
// Inline field errors
<div className={styles.field}>
  <label htmlFor="email">Email *</label>
  <input
    id="email"
    name="email"
    value={formData.email}
    onBlur={handleBlur}
  />
  {errors.email && <span className={styles.error}>{errors.email}</span>}
</div>

// Generic login error (security)
if (!user || !isValid) {
  setErrors({ email: 'Invalid email or password' });
  return;
}

// Storage quota error (alert)
const saved = setToStorage(key, data);
if (!saved) {
  alert('Storage quota exceeded. Please delete some books to free up space.');
  return;
}

// Operation error (alert)
try {
  // Operation
} catch (error) {
  console.error('Operation failed:', error);
  alert('Operation failed. Please try again.');
}
```

**Error Types**:
- **Validation Errors**: Inline below field (specific message)
- **Login Errors**: Inline below form (generic message for security)
- **Storage Quota**: Alert dialog (guidance for user action)
- **Operation Errors**: Alert dialog (generic failure message)

**CSS**:
```css
/* Error message styling */
.error {
  color: var(--color-error);
  font-size: var(--font-size-sm);
  margin-top: var(--spacing-xs);
  display: block;
}

.field input:invalid,
.field input.hasError {
  border-color: var(--color-error);
}
```

**Rationale**:
- Inline errors provide context-specific feedback
- Alerts for critical errors that need acknowledgment
- Generic login errors prevent email enumeration
- Clear guidance for storage quota issues

---

## 7. Book CRUD Operation Patterns

### 7.1 Modal-Based CRUD Pattern

**Pattern**: Add and edit operations in modals, delete with browser confirm

**Implementation**:
```javascript
// BookListComponent.jsx
function BookListComponent() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  
  return (
    <div>
      <button onClick={() => setShowAddModal(true)}>Add Book</button>
      
      {books.map(book => (
        <BookItemComponent
          key={book.bookId}
          book={book}
          onEdit={() => setEditingBook(book)}
          onDelete={() => handleDeleteBook(book.bookId)}
        />
      ))}
      
      {/* Add Modal */}
      {showAddModal && (
        <BookFormModal
          onSave={handleAddBook}
          onCancel={() => setShowAddModal(false)}
        />
      )}
      
      {/* Edit Modal */}
      {editingBook && (
        <BookFormModal
          book={editingBook}
          onSave={(data) => handleEditBook(editingBook.bookId, data)}
          onCancel={() => setEditingBook(null)}
        />
      )}
    </div>
  );
}

// Delete with confirmation
const handleDeleteBook = (bookId) => {
  if (!window.confirm('Are you sure you want to delete this book?')) {
    return;
  }
  
  const updatedBooks = books.filter(book => book.bookId !== bookId);
  saveBooks(updatedBooks);
  setBooks(updatedBooks);
};
```

**Modal Component**:
```javascript
// BookFormModal.jsx
function BookFormModal({ book, onSave, onCancel }) {
  const isEditMode = !!book;
  
  return (
    <div className={styles.modalOverlay} onClick={onCancel}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h3>{isEditMode ? 'Edit Book' : 'Add Book'}</h3>
        <form onSubmit={handleSubmit}>
          {/* Form fields */}
          <div className={styles.actions}>
            <button type="submit">Save</button>
            <button type="button" onClick={onCancel}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
```

**CRUD Operations**:
- **Add**: Click "Add Book" → Show modal → Fill form → Save → Close modal → Refresh list
- **Edit**: Click "Edit" on book → Show modal with pre-filled data → Update → Save → Close modal → Refresh list
- **Delete**: Click "Delete" → Browser confirm dialog → Delete if confirmed → Refresh list
- **View**: Books displayed in list, no modal needed

**Rationale**:
- Modals keep focus on operation
- Reusable BookFormModal for add and edit
- Browser confirm() simple and familiar for delete
- No routing needed for CRUD operations

---

## 8. Loading State Patterns

### 8.1 Hybrid Loading Pattern

**Pattern**: Global loading for bcrypt (slow), local state for localStorage (fast)

**Implementation**:
```javascript
// Global loading for bcrypt operations (slow, ~100-300ms)
const handleRegister = async () => {
  showLoading('Creating account...'); // Global LoadingContext
  
  try {
    const passwordHash = await bcrypt.hash(formData.password, 10);
    // ... rest of registration
  } finally {
    hideLoading(); // Global LoadingContext
  }
};

const handleLogin = async () => {
  showLoading('Logging in...'); // Global LoadingContext
  
  try {
    const isValid = await bcrypt.compare(formData.password, user.passwordHash);
    // ... rest of login
  } finally {
    hideLoading(); // Global LoadingContext
  }
};

// Local loading for localStorage operations (fast, < 10ms)
function BookListComponent() {
  const [loading, setLoading] = useState(false); // Local state
  
  const loadBooks = () => {
    setLoading(true); // Local state
    try {
      const books = getFromStorage(`books_${currentUserId}`);
      setBooks(books || []);
    } finally {
      setLoading(false); // Local state
    }
  };
  
  if (loading) {
    return <div>Loading books...</div>; // Local loading indicator
  }
  
  return (/* Book list */);
}
```

**Loading Strategy**:
- **Global Loading (LoadingContext)**: bcrypt operations (registration, login)
- **Local Loading (useState)**: localStorage operations (load books, save books)
- **No Loading**: Instant operations (form interactions, UI updates)

**Rationale**:
- bcrypt is slow enough to warrant global loading overlay
- localStorage is fast, local loading sufficient
- Prevents loading indicator flicker for fast operations
- User feedback proportional to operation duration

---

## 9. Data Isolation Patterns

### 9.1 AuthContext userId Pattern

**Pattern**: All book operations use currentUserId from AuthContext

**Implementation**:
```javascript
// BookListComponent.jsx
function BookListComponent() {
  const { currentUserId } = useAuth(); // Get userId from context
  
  const loadBooks = () => {
    const key = `books_${currentUserId}`; // User-specific key
    const books = getFromStorage(key) || [];
    setBooks(books);
  };
  
  const saveBooks = (updatedBooks) => {
    const key = `books_${currentUserId}`; // User-specific key
    return setToStorage(key, updatedBooks);
  };
  
  const handleAddBook = (bookData) => {
    const newBook = {
      bookId: generateId(),
      userId: currentUserId, // Associate with current user
      ...bookData
    };
    // ... save book
  };
}

// ProtectedRoute ensures currentUserId exists
<Route path="/books" element={
  <ProtectedRoute>
    <BookListComponent />
  </ProtectedRoute>
} />
```

**Data Isolation Rules**:
- All book operations use `books_{currentUserId}` key
- Books include userId field for verification
- ProtectedRoute ensures user authenticated before access
- No cross-user data access possible

**Storage Structure**:
```
localStorage:
  - "users": [User, User, User]
  - "books_user-id-1": [Book, Book, Book]
  - "books_user-id-2": [Book, Book]
  - "currentUser": "user-id-1"
```

**Rationale**:
- Automatic isolation through AuthContext
- No manual userId passing needed
- ProtectedRoute enforces authentication
- Simple and secure

---

## 10. Storage Error Recovery Patterns

### 10.1 Alert + Fail Pattern

**Pattern**: Show alert with guidance, operation fails, user manually deletes data

**Implementation**:
```javascript
// storage.js utility
export function setToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    if (error.name === 'QuotaExceededError') {
      alert('Storage quota exceeded. Please delete some books to free up space.');
    } else {
      console.error('Error writing to storage:', error);
      alert('Failed to save data. Please try again.');
    }
    return false;
  }
}

// Component usage
const handleAddBook = (bookData) => {
  const newBook = { /* ... */ };
  const updatedBooks = [...books, newBook];
  
  const saved = setToStorage(`books_${currentUserId}`, updatedBooks);
  
  if (!saved) {
    // Operation failed, don't update UI state
    return;
  }
  
  // Success, update UI
  setBooks(updatedBooks);
  setShowAddModal(false);
};
```

**Error Recovery Strategy**:
- **Detect**: Catch QuotaExceededError in setToStorage()
- **Alert**: Show clear message with guidance
- **Fail**: Operation fails, data not saved
- **User Action**: User must manually delete books to free space
- **No Auto-Cleanup**: User controls what to delete

**Alert Messages**:
- **Quota Exceeded**: "Storage quota exceeded. Please delete some books to free up space."
- **Generic Error**: "Failed to save data. Please try again."

**Rationale**:
- Simple and predictable behavior
- User controls data deletion
- No automatic cleanup that might delete important data
- Clear guidance for user action

---

## Summary

All NFR design patterns for Unit 2: Core Features prioritize:

1. **Simplicity**: Component-level logic, no complex abstractions
2. **Consistency**: Align with Unit 1 patterns (simple composition, manual state management)
3. **Security**: bcrypt password hashing, generic login errors, data isolation
4. **User Feedback**: Loading states for slow operations, inline validation errors
5. **Manual Control**: Explicit state updates, manual storage sync, user-controlled cleanup

These patterns support the implementation of 8 user stories (AUTH-01 to AUTH-04, BOOK-01 to BOOK-04) while meeting all NFR requirements for security, performance, reliability, and usability.
