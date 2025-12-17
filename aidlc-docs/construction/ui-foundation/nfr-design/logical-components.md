# Logical Components - UI Foundation

## Overview
This document defines the logical component architecture for the UI Foundation, including React component hierarchy, context providers, utility modules, and their relationships.

**Note**: Since this is a client-side only application, there are no infrastructure components (servers, databases, queues, etc.). This document focuses on the React application architecture.

---

## 1. Application Architecture

### 1.1 High-Level Architecture

```
Browser
└── React Application (SPA)
    ├── React Components (UI)
    ├── Context Providers (Global State)
    ├── React Router (Navigation)
    ├── Utility Modules (Helpers)
    └── Local Storage (Data Persistence)
```

### 1.2 Technology Stack

- **Framework**: React 18+
- **Build Tool**: Vite 4+
- **Routing**: React Router v6
- **Styling**: CSS Modules + CSS Custom Properties
- **State**: React Hooks (useState, useContext)
- **Storage**: Browser localStorage
- **Security**: bcryptjs for password hashing

---

## 2. React Component Hierarchy

### 2.1 Component Tree

```
App (Root)
├── AuthProvider (Context)
├── LoadingProvider (Context)
└── BrowserRouter
    ├── Public Routes
    │   ├── /login → AuthComponent (mode: login)
    │   └── /register → AuthComponent (mode: register)
    └── Protected Routes (wrapped in ProtectedRoute HOC)
        ├── /books → BookListComponent
        │   ├── BookFormComponent (add/edit)
        │   └── BookItemComponent (multiple instances)
        ├── /books/:id/progress → ProgressTrackerComponent
        ├── /books/:id/notes → NotesRatingsComponent
        ├── /statistics → StatisticsComponent
        ├── /search → SearchComponent
        │   └── BookItemComponent (multiple instances)
        └── /export → ExportComponent
```

### 2.2 Component Categories

**Container Components** (10 total):
1. App - Root application component
2. AuthComponent - Authentication (login/register)
3. BookListComponent - Book list management
4. BookFormComponent - Book add/edit form
5. ProgressTrackerComponent - Reading progress tracking
6. NotesRatingsComponent - Notes and ratings management
7. StatisticsComponent - Statistics dashboard
8. SearchComponent - Book search
9. ExportComponent - Data export
10. BookItemComponent - Individual book display

**Common UI Components** (9 total):
1. Button - Reusable button component
2. Input - Reusable input component
3. Form - Form wrapper component
4. Card - Card container component
5. Modal - Modal dialog component
6. ProgressBar - Progress bar component
7. StarRating - Star rating component
8. Notification - Notification/alert component
9. LoadingSpinner - Loading spinner component

**Utility Components** (3 total):
1. ErrorBoundary - Error boundary wrapper
2. ProtectedRoute - Route protection HOC
3. LoadingOverlay - Global loading overlay

---

## 3. Context Providers

### 3.1 AuthContext

**Purpose**: Manage global authentication state

**State**:
```typescript
{
  isAuthenticated: boolean,
  currentUserId: string | null
}
```

**Methods**:
- `login(userId)` - Set authenticated state
- `logout()` - Clear authenticated state

**Consumers**: All components that need auth state (ProtectedRoute, App, etc.)

**Location**: `src/contexts/AuthContext.jsx`

### 3.2 LoadingContext

**Purpose**: Manage global loading overlay

**State**:
```typescript
{
  loadingCounter: number,
  message: string
}
```

**Methods**:
- `showLoading(message?)` - Increment counter, show overlay
- `hideLoading()` - Decrement counter, hide when zero

**Consumers**: Any component that performs async operations

**Location**: `src/contexts/LoadingContext.jsx`

---

## 4. Utility Modules

### 4.1 Storage Utilities

**Purpose**: Wrapper functions for localStorage operations

**Functions**:
- `getFromStorage(key)` - Read and parse from localStorage
- `setToStorage(key, value)` - Stringify and write to localStorage
- `removeFromStorage(key)` - Remove item from localStorage

**Error Handling**: Catches QuotaExceededError, JSON parse errors

**Location**: `src/utils/storage.js`

### 4.2 Validation Utilities

**Purpose**: Shared validation functions

**Functions**:
- `validateEmail(email)` - Email format validation
- `validatePassword(password)` - Password strength validation
- `validateRequired(value)` - Required field validation
- `validateNumber(value, min, max)` - Number range validation

**Location**: `src/utils/validation.js`

### 4.3 ID Generation Utility

**Purpose**: Generate unique IDs for users and books

**Functions**:
- `generateId()` - Generate UUID-like string

**Implementation**: Use `crypto.randomUUID()` or fallback

**Location**: `src/utils/idGenerator.js`

### 4.4 Date Utilities

**Purpose**: Date formatting and manipulation

**Functions**:
- `formatDate(date)` - Format date for display
- `getCurrentDate()` - Get current date in ISO format
- `getMonthYear(date)` - Extract month/year for statistics

**Location**: `src/utils/dateUtils.js`

---

## 5. Component Details

### 5.1 App Component

**Type**: Root Container

**Responsibilities**:
- Wrap application with providers (Auth, Loading)
- Set up routing with React Router
- Render application shell

**Structure**:
```javascript
function App() {
  return (
    <AuthProvider>
      <LoadingProvider>
        <BrowserRouter>
          <Routes>
            {/* Route definitions */}
          </Routes>
        </BrowserRouter>
      </LoadingProvider>
    </AuthProvider>
  );
}
```

**Location**: `src/App.jsx`

### 5.2 AuthComponent

**Type**: Feature Component

**Responsibilities**:
- Display login/register forms
- Validate credentials
- Hash passwords (registration)
- Verify passwords (login)
- Update auth context on success

**Props**:
- `mode: 'login' | 'register'` - Form mode

**State**:
- Form data (email, password)
- Validation errors
- Loading state

**Location**: `src/components/AuthComponent.jsx`

### 5.3 BookListComponent

**Type**: Feature Component

**Responsibilities**:
- Load books from localStorage
- Display book list
- Handle add/edit/delete operations
- Filter books by status

**State**:
- Books array
- Selected book for editing
- Show/hide form modal

**Child Components**:
- BookFormComponent (for add/edit)
- BookItemComponent (for each book)

**Location**: `src/components/BookListComponent.jsx`

### 5.4 BookFormComponent

**Type**: Sub-Component

**Responsibilities**:
- Display book entry form
- Validate form inputs
- Handle ISBN lookup (API call)
- Handle file import (JSON/CSV)
- Emit save event to parent

**Props**:
- `book: Book | null` - Book to edit (null for new)
- `mode: 'manual' | 'isbn' | 'import'` - Entry mode
- `onSave: (book) => void` - Save callback
- `onCancel: () => void` - Cancel callback

**State**:
- Form data
- Validation errors
- Loading state (for ISBN lookup)

**Location**: `src/components/BookFormComponent.jsx`

### 5.5 BookItemComponent

**Type**: Display Component

**Responsibilities**:
- Display single book information
- Show progress bar (if reading)
- Show star rating
- Emit edit/delete events

**Props**:
- `book: Book` - Book to display
- `onEdit: (bookId) => void` - Edit callback
- `onDelete: (bookId) => void` - Delete callback

**Location**: `src/components/BookItemComponent.jsx`

### 5.6 ProgressTrackerComponent

**Type**: Feature Component

**Responsibilities**:
- Display current progress
- Allow page number updates
- Calculate progress percentage
- Suggest completion at 100%
- Update book status

**State**:
- Current book data
- Progress input value
- Validation errors

**Location**: `src/components/ProgressTrackerComponent.jsx`

### 5.7 NotesRatingsComponent

**Type**: Feature Component

**Responsibilities**:
- Display notes editor
- Display star rating selector
- Save notes and rating to book

**State**:
- Current book data
- Notes text
- Rating value

**Location**: `src/components/NotesRatingsComponent.jsx`

### 5.8 StatisticsComponent

**Type**: Feature Component

**Responsibilities**:
- Load all books
- Calculate books per month
- Calculate reading pace
- Calculate books by status
- Display statistics

**State**:
- Books array
- Calculated statistics

**Location**: `src/components/StatisticsComponent.jsx`

### 5.9 SearchComponent

**Type**: Feature Component

**Responsibilities**:
- Display search input
- Filter books by title/author
- Display search results
- Clear search

**State**:
- Search query
- Filtered books

**Child Components**:
- BookItemComponent (for results)

**Location**: `src/components/SearchComponent.jsx`

### 5.10 ExportComponent

**Type**: Feature Component

**Responsibilities**:
- Load user and books data
- Generate JSON export
- Trigger browser download

**State**:
- Export status
- Error state

**Location**: `src/components/ExportComponent.jsx`

---

## 6. Common UI Components

### 6.1 Button Component

**Props**:
- `variant: 'primary' | 'secondary' | 'outline' | 'ghost'`
- `size: 'small' | 'medium' | 'large'`
- `disabled: boolean`
- `onClick: () => void`
- `children: ReactNode`

**Location**: `src/components/common/Button.jsx`

### 6.2 Input Component

**Props**:
- `type: 'text' | 'number' | 'email' | 'password'`
- `value: string | number`
- `onChange: (value) => void`
- `onBlur: () => void`
- `label: string`
- `error: string | null`
- `required: boolean`

**Location**: `src/components/common/Input.jsx`

### 6.3 Modal Component

**Props**:
- `isOpen: boolean`
- `title: string`
- `onClose: () => void`
- `children: ReactNode`

**Location**: `src/components/common/Modal.jsx`

### 6.4 ProgressBar Component

**Props**:
- `value: number` (0-100)
- `showPercentage: boolean`
- `color: string`

**Location**: `src/components/common/ProgressBar.jsx`

### 6.5 StarRating Component

**Props**:
- `value: number` (0-5)
- `onChange: (value) => void | undefined`
- `readOnly: boolean`

**Location**: `src/components/common/StarRating.jsx`

---

## 7. Data Flow

### 7.1 Authentication Flow

```
1. User enters credentials in AuthComponent
2. AuthComponent validates input
3. AuthComponent hashes password (register) or verifies hash (login)
4. AuthComponent calls AuthContext.login(userId)
5. AuthContext updates state and localStorage
6. ProtectedRoute detects auth change
7. User redirected to /books
```

### 7.2 Book Management Flow

```
1. BookListComponent loads books from localStorage on mount
2. User clicks "Add Book"
3. BookListComponent shows BookFormComponent
4. User fills form and submits
5. BookFormComponent validates and emits onSave event
6. BookListComponent receives new book data
7. BookListComponent updates state and localStorage
8. BookListComponent re-renders with new book
```

### 7.3 Loading State Flow

```
1. Component calls useLoading().showLoading()
2. LoadingContext increments counter
3. LoadingOverlay renders (counter > 0)
4. Async operation completes
5. Component calls useLoading().hideLoading()
6. LoadingContext decrements counter
7. LoadingOverlay hides (counter === 0)
```

---

## 8. File Structure

```
src/
├── App.jsx                          # Root component
├── main.jsx                         # Entry point
├── index.css                        # Global styles
├── components/
│   ├── AuthComponent.jsx
│   ├── BookListComponent.jsx
│   ├── BookFormComponent.jsx
│   ├── BookItemComponent.jsx
│   ├── ProgressTrackerComponent.jsx
│   ├── NotesRatingsComponent.jsx
│   ├── StatisticsComponent.jsx
│   ├── SearchComponent.jsx
│   ├── ExportComponent.jsx
│   ├── ErrorBoundary.jsx
│   ├── ProtectedRoute.jsx
│   └── common/
│       ├── Button.jsx
│       ├── Input.jsx
│       ├── Form.jsx
│       ├── Card.jsx
│       ├── Modal.jsx
│       ├── ProgressBar.jsx
│       ├── StarRating.jsx
│       ├── Notification.jsx
│       └── LoadingSpinner.jsx
├── contexts/
│   ├── AuthContext.jsx
│   └── LoadingContext.jsx
├── utils/
│   ├── storage.js
│   ├── validation.js
│   ├── idGenerator.js
│   └── dateUtils.js
└── styles/
    └── [Component].module.css files
```

---

## 9. Component Communication

### 9.1 Parent-Child Communication

**Pattern**: Props down, events up

**Example**:
```javascript
// Parent
<BookItemComponent 
  book={book}                    // Props down
  onEdit={handleEdit}            // Events up
  onDelete={handleDelete}        // Events up
/>

// Child
function BookItemComponent({ book, onEdit, onDelete }) {
  return (
    <div>
      <button onClick={() => onEdit(book.id)}>Edit</button>
    </div>
  );
}
```

### 9.2 Global State Communication

**Pattern**: Context API

**Example**:
```javascript
// Provider (App level)
<AuthProvider>
  <App />
</AuthProvider>

// Consumer (any component)
const { isAuthenticated, logout } = useAuth();
```

### 9.3 Sibling Communication

**Pattern**: Via shared parent

**Example**:
```javascript
// Parent coordinates between siblings
function BookListComponent() {
  const [selectedBook, setSelectedBook] = useState(null);
  
  return (
    <>
      <BookItemComponent 
        onEdit={(id) => setSelectedBook(id)}  // Sibling A triggers
      />
      <BookFormComponent 
        book={selectedBook}                    // Sibling B receives
      />
    </>
  );
}
```

---

## 10. External Dependencies

### 10.1 NPM Packages

**Core Dependencies**:
- `react` (^18.2.0) - UI framework
- `react-dom` (^18.2.0) - React DOM renderer
- `react-router-dom` (^6.0.0) - Routing
- `bcryptjs` (^2.4.3) - Password hashing

**Dev Dependencies**:
- `vite` (^4.0.0) - Build tool
- `@vitejs/plugin-react` (^4.0.0) - Vite React plugin

**Total Bundle Size**: ~130KB gzipped

### 10.2 External APIs

**Open Library API**:
- **Purpose**: ISBN book lookup
- **Endpoint**: `https://openlibrary.org/isbn/{isbn}.json`
- **Usage**: BookFormComponent for ISBN lookup feature
- **Error Handling**: Graceful fallback to manual entry

---

## 11. Browser APIs Used

### 11.1 localStorage

**Purpose**: Data persistence

**Keys**:
- `users` - Array of user objects
- `books` - Array of book objects
- `currentUser` - Current user ID

**Quota**: ~5-10MB (browser dependent)

### 11.2 History API

**Purpose**: Client-side routing

**Usage**: React Router uses `history.pushState()` and `history.replaceState()`

### 11.3 Crypto API

**Purpose**: Generate unique IDs

**Usage**: `crypto.randomUUID()` for user and book IDs

---

## 12. Component Lifecycle

### 12.1 Typical Component Lifecycle

```javascript
function Component() {
  // 1. State initialization
  const [data, setData] = useState([]);
  
  // 2. Mount effect (load data)
  useEffect(() => {
    loadData();
  }, []);
  
  // 3. Event handlers
  const handleAction = () => {
    // Handle user action
  };
  
  // 4. Render
  return <div>{/* JSX */}</div>;
  
  // 5. Unmount cleanup (automatic)
}
```

### 12.2 Error Boundary Lifecycle

```javascript
class ErrorBoundary extends Component {
  // 1. Constructor
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  
  // 2. Error capture
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  
  // 3. Error logging
  componentDidCatch(error, errorInfo) {
    console.error(error, errorInfo);
  }
  
  // 4. Render (error UI or children)
  render() {
    if (this.state.hasError) {
      return <ErrorUI />;
    }
    return this.props.children;
  }
}
```

---

## Summary

The UI Foundation logical architecture consists of:

**React Components**: 22 total (10 feature, 9 common UI, 3 utility)

**Context Providers**: 2 (Auth, Loading)

**Utility Modules**: 4 (storage, validation, ID generation, date utils)

**External Dependencies**: 4 NPM packages (~130KB gzipped)

**Browser APIs**: localStorage, History API, Crypto API

**Communication Patterns**: Props/events, Context API, parent coordination

All components follow simple composition patterns with component-level state management, manual localStorage sync, and no premature optimization. The architecture supports all NFR requirements while maintaining simplicity and maintainability.
