# Logical Components - Core Features

## Overview
This document defines the logical component architecture for Unit 2: Core Features, covering authentication and book management functionality. These components build upon the UI Foundation from Unit 1.

---

## 1. Component Inventory

### 1.1 Feature Components (4 components)

| Component | Purpose | Inherited from Unit 1 | New in Unit 2 |
|-----------|---------|----------------------|---------------|
| AuthComponent | User registration and login | ❌ | ✅ |
| BookListComponent | Display and manage book list | ❌ | ✅ |
| BookFormModal | Add/edit book form in modal | ❌ | ✅ |
| BookItemComponent | Individual book display | ❌ | ✅ |

### 1.2 Inherited Components from Unit 1

| Component | Purpose | Usage in Unit 2 |
|-----------|---------|-----------------|
| ErrorBoundary | Catch and display component errors | Wrap BookListComponent |
| ProtectedRoute | Guard authenticated routes | Protect /books route |
| LoadingOverlay | Global loading indicator | Show during bcrypt operations |
| Modal | Reusable modal container | Base for BookFormModal |
| Button | Styled button component | All buttons in Unit 2 |
| Input | Styled input component | All form inputs |
| Form | Form container with styling | Auth and book forms |

### 1.3 Context Providers (Inherited from Unit 1)

| Context | Purpose | Usage in Unit 2 |
|---------|---------|-----------------|
| AuthContext | Authentication state | Provide currentUserId, login/logout |
| LoadingContext | Global loading state | Show loading during bcrypt operations |

### 1.4 Utility Modules (Inherited from Unit 1)

| Module | Purpose | Usage in Unit 2 |
|--------|---------|-----------------|
| storage.js | localStorage utilities | Store/retrieve users and books |
| validation.js | Validation functions | Validate email, password, book fields |
| idGenerator.js | Generate UUIDs | Generate userId and bookId |
| dateUtils.js | Date formatting | Generate createdAt timestamps |

---

## 2. Component Details

### 2.1 AuthComponent

**Purpose**: Handle user registration and login

**Props**:
```typescript
{
  mode: 'login' | 'register' // Determines which form to show
}
```

**State**:
```javascript
{
  formData: { email: string, password: string },
  errors: { email?: string, password?: string }
}
```

**Dependencies**:
- AuthContext (useAuth hook)
- LoadingContext (useLoading hook)
- React Router (useNavigate)
- bcryptjs (hash, compare)
- storage.js (getFromStorage, setToStorage)
- idGenerator.js (generateId)
- dateUtils.js (getCurrentDate)

**Methods**:
- `validateEmail(email)` - Validate email format
- `validatePassword(password)` - Validate password strength
- `handleBlur(e)` - Validate field on blur
- `handleSubmit(e)` - Handle form submission
- `handleRegister()` - Register new user (async)
- `handleLogin()` - Login existing user (async)

**Validation Rules**:
- Email: Required, valid format, unique (registration only)
- Password: Required, >= 8 chars, contains letter and number

**User Stories**: AUTH-01 (Register), AUTH-02 (Login)

---

### 2.2 BookListComponent

**Purpose**: Display user's book list and manage CRUD operations

**Props**: None (uses AuthContext for currentUserId)

**State**:
```javascript
{
  books: Book[],
  loading: boolean,
  showAddModal: boolean,
  editingBook: Book | null
}
```

**Dependencies**:
- AuthContext (useAuth hook)
- storage.js (getFromStorage, setToStorage)
- idGenerator.js (generateId)
- dateUtils.js (getCurrentDate)
- BookItemComponent
- BookFormModal

**Methods**:
- `loadBooks()` - Load books from localStorage
- `saveBooks(updatedBooks)` - Save books to localStorage
- `handleAddBook(bookData)` - Add new book
- `handleEditBook(bookId, bookData)` - Update existing book
- `handleDeleteBook(bookId)` - Delete book with confirmation

**Data Flow**:
1. Mount → loadBooks() → Display books
2. Add → Show modal → handleAddBook() → saveBooks() → Refresh
3. Edit → Show modal with data → handleEditBook() → saveBooks() → Refresh
4. Delete → Confirm → handleDeleteBook() → saveBooks() → Refresh

**User Stories**: BOOK-01 (Add), BOOK-02 (View), BOOK-03 (Edit), BOOK-04 (Delete)

---

### 2.3 BookFormModal

**Purpose**: Form for adding or editing books in a modal

**Props**:
```typescript
{
  book?: Book,           // If provided, edit mode; otherwise add mode
  onSave: (bookData) => void,
  onCancel: () => void
}
```

**State**:
```javascript
{
  formData: {
    title: string,
    author: string,
    status: 'wishlist' | 'reading' | 'completed',
    totalPages: number
  },
  errors: {
    title?: string,
    author?: string,
    status?: string,
    totalPages?: string
  }
}
```

**Dependencies**:
- Modal (from Unit 1)
- Input (from Unit 1)
- Button (from Unit 1)
- validation.js (field validation)

**Methods**:
- `validateField(name, value)` - Validate single field
- `handleBlur(e)` - Validate on blur
- `handleSubmit(e)` - Validate all and submit

**Validation Rules**:
- Title: Required, 1-200 characters
- Author: Required, letters/spaces/hyphens only
- Status: Required, one of: wishlist, reading, completed
- Total Pages: Required, number, 1-10,000

**User Stories**: BOOK-01 (Add), BOOK-03 (Edit)

---

### 2.4 BookItemComponent

**Purpose**: Display individual book with edit/delete actions

**Props**:
```typescript
{
  book: Book,
  onEdit: () => void,
  onDelete: () => void
}
```

**State**: None (stateless component)

**Dependencies**:
- Button (from Unit 1)
- Card (from Unit 1)

**Display**:
- Title (heading)
- Author (subheading)
- Status badge (colored)
- Total pages
- Edit button
- Delete button

**User Stories**: BOOK-02 (View)

---

## 3. Component Hierarchy

```
App (Unit 1)
├── AuthProvider (Unit 1)
│   └── LoadingProvider (Unit 1)
│       └── Router (Unit 1)
│           ├── Route: /login
│           │   └── AuthComponent (mode="login")
│           ├── Route: /register
│           │   └── AuthComponent (mode="register")
│           └── Route: /books (Protected)
│               └── ProtectedRoute (Unit 1)
│                   └── ErrorBoundary (Unit 1)
│                       └── BookListComponent
│                           ├── BookItemComponent (multiple)
│                           ├── BookFormModal (conditional - add)
│                           └── BookFormModal (conditional - edit)
```

---

## 4. Data Flow

### 4.1 Authentication Flow

```
User → AuthComponent
  ↓
  Register/Login
  ↓
  bcryptjs (hash/compare)
  ↓
  localStorage (users)
  ↓
  AuthContext (login)
  ↓
  Navigate to /books
```

### 4.2 Book Management Flow

```
User → BookListComponent
  ↓
  Load Books
  ↓
  localStorage (books_{userId})
  ↓
  Display BookItemComponent(s)
  ↓
  User Action (Add/Edit/Delete)
  ↓
  BookFormModal (Add/Edit) or Confirm (Delete)
  ↓
  Update localStorage
  ↓
  Refresh BookListComponent
```

---

## 5. Communication Patterns

### 5.1 Parent-Child Props

**Pattern**: Props down, events up

**Examples**:
```javascript
// BookListComponent → BookItemComponent
<BookItemComponent
  book={book}
  onEdit={() => setEditingBook(book)}
  onDelete={() => handleDeleteBook(book.bookId)}
/>

// BookListComponent → BookFormModal
<BookFormModal
  book={editingBook}
  onSave={(data) => handleEditBook(editingBook.bookId, data)}
  onCancel={() => setEditingBook(null)}
/>
```

### 5.2 Context Consumption

**Pattern**: useContext hooks for global state

**Examples**:
```javascript
// AuthComponent
const { login } = useAuth();
const { showLoading, hideLoading } = useLoading();

// BookListComponent
const { currentUserId } = useAuth();
```

### 5.3 Router Navigation

**Pattern**: useNavigate for programmatic navigation

**Examples**:
```javascript
// AuthComponent after successful login/register
const navigate = useNavigate();
navigate('/books');

// Logout (in header/nav)
const { logout } = useAuth();
logout();
navigate('/login');
```

---

## 6. State Management

### 6.1 Global State (Context)

| State | Location | Purpose |
|-------|----------|---------|
| isAuthenticated | AuthContext | User authentication status |
| currentUserId | AuthContext | Current user's ID |
| loadingCounter | LoadingContext | Global loading state |

### 6.2 Component Local State

| Component | State | Purpose |
|-----------|-------|---------|
| AuthComponent | formData, errors | Form input and validation |
| BookListComponent | books, loading, showAddModal, editingBook | Book list and modal state |
| BookFormModal | formData, errors | Form input and validation |

### 6.3 Persistent State (localStorage)

| Key | Data | Purpose |
|-----|------|---------|
| users | User[] | All registered users |
| books_{userId} | Book[] | Books for specific user |
| currentUser | string (userId) | Current session |

---

## 7. External Dependencies

### 7.1 NPM Packages (Inherited from Unit 1)

| Package | Version | Usage in Unit 2 |
|---------|---------|-----------------|
| react | ^18.2.0 | Component framework |
| react-dom | ^18.2.0 | DOM rendering |
| react-router-dom | ^6.20.0 | Routing (/login, /register, /books) |
| bcryptjs | ^2.4.3 | Password hashing and verification |

**No new dependencies added in Unit 2**

### 7.2 Browser APIs

| API | Usage |
|-----|-------|
| localStorage | Store users, books, session |
| crypto.randomUUID | Generate userId and bookId (via idGenerator.js) |
| window.confirm | Delete confirmation dialog |
| window.alert | Error messages (storage quota, operation failures) |

---

## 8. File Structure

```
src/
├── components/
│   ├── auth/
│   │   ├── AuthComponent.jsx          [NEW]
│   │   └── AuthComponent.module.css   [NEW]
│   ├── books/
│   │   ├── BookListComponent.jsx      [NEW]
│   │   ├── BookListComponent.module.css [NEW]
│   │   ├── BookFormModal.jsx          [NEW]
│   │   ├── BookFormModal.module.css   [NEW]
│   │   ├── BookItemComponent.jsx      [NEW]
│   │   └── BookItemComponent.module.css [NEW]
│   ├── common/                        [Unit 1]
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── Form.jsx
│   │   ├── Card.jsx
│   │   ├── Modal.jsx
│   │   └── ...
│   ├── ErrorBoundary.jsx              [Unit 1]
│   ├── ProtectedRoute.jsx             [Unit 1]
│   └── LoadingOverlay.jsx             [Unit 1]
├── contexts/                          [Unit 1]
│   ├── AuthContext.jsx                [UPDATED]
│   └── LoadingContext.jsx
├── utils/                             [Unit 1]
│   ├── storage.js
│   ├── validation.js
│   ├── idGenerator.js
│   └── dateUtils.js
├── App.jsx                            [UPDATED]
└── main.jsx                           [Unit 1]
```

**New Files**: 6 (3 components × 2 files each: .jsx + .module.css)
**Updated Files**: 2 (AuthContext.jsx, App.jsx)

---

## 9. Routing Configuration

```javascript
// App.jsx
<Routes>
  {/* Public routes */}
  <Route path="/login" element={<AuthComponent mode="login" />} />
  <Route path="/register" element={<AuthComponent mode="register" />} />
  
  {/* Protected routes */}
  <Route path="/books" element={
    <ProtectedRoute>
      <ErrorBoundary>
        <BookListComponent />
      </ErrorBoundary>
    </ProtectedRoute>
  } />
  
  {/* Default redirect */}
  <Route path="/" element={<Navigate to="/login" replace />} />
</Routes>
```

---

## 10. Component Responsibilities Matrix

| Responsibility | Component | Pattern |
|----------------|-----------|---------|
| User registration | AuthComponent | Component-level async with bcrypt |
| User login | AuthComponent | Component-level async with bcrypt |
| Session management | AuthContext | Context with useEffect |
| Route protection | ProtectedRoute | HOC pattern |
| Load books | BookListComponent | Local state + manual refresh |
| Add book | BookListComponent + BookFormModal | Modal-based with validation |
| Edit book | BookListComponent + BookFormModal | Modal-based with validation |
| Delete book | BookListComponent | Confirm dialog + manual refresh |
| Display book | BookItemComponent | Stateless presentation |
| Form validation | AuthComponent, BookFormModal | On blur + on submit |
| Error display | All form components | Inline errors + alerts |
| Loading state | AuthComponent (global), BookListComponent (local) | Hybrid pattern |
| Data isolation | BookListComponent | AuthContext userId |
| Storage error handling | All components using storage | Alert + fail pattern |

---

## 11. Integration Points

### 11.1 With Unit 1 (UI Foundation)

| Unit 1 Component | Used By | Purpose |
|------------------|---------|---------|
| Button | AuthComponent, BookListComponent, BookFormModal, BookItemComponent | All buttons |
| Input | AuthComponent, BookFormModal | All form inputs |
| Form | AuthComponent, BookFormModal | Form containers |
| Card | BookItemComponent | Book display container |
| Modal | BookFormModal | Modal container |
| ErrorBoundary | BookListComponent | Error isolation |
| ProtectedRoute | /books route | Authentication guard |
| LoadingOverlay | AuthComponent | Global loading for bcrypt |
| AuthContext | All components | Authentication state |
| LoadingContext | AuthComponent | Global loading control |

### 11.2 With Unit 3 (Enhanced Features)

**Preparation for Unit 3**:
- Book entity includes `pagesRead` field (initialized to 0)
- Book entity ready for `notes` and `rating` fields (Unit 3)
- BookItemComponent can be extended to show progress bar (Unit 3)
- BookFormModal can be extended with ISBN lookup (Unit 3)

---

## 12. Performance Characteristics

### 12.1 Component Rendering

| Component | Render Frequency | Optimization |
|-----------|------------------|--------------|
| AuthComponent | Once per page load | None needed |
| BookListComponent | Once + after each CRUD operation | None needed |
| BookItemComponent | Once per book | None needed (< 100 books expected) |
| BookFormModal | Once when opened | None needed |

**No React.memo, useMemo, or useCallback needed** - trust React defaults

### 12.2 Operation Performance

| Operation | Expected Time | Loading Indicator |
|-----------|---------------|-------------------|
| Registration (bcrypt) | ~100-300ms | Global loading overlay |
| Login (bcrypt) | ~100-300ms | Global loading overlay |
| Load books | < 10ms | Local loading state |
| Add book | < 10ms | None (instant) |
| Edit book | < 10ms | None (instant) |
| Delete book | < 10ms | None (instant) |

---

## 13. Bundle Size Impact

### 13.1 New Code

| Component | Estimated Size |
|-----------|----------------|
| AuthComponent | ~3 KB |
| BookListComponent | ~4 KB |
| BookFormModal | ~3 KB |
| BookItemComponent | ~1 KB |
| **Total New Code** | **~11 KB** |

### 13.2 Total Bundle (Unit 1 + Unit 2)

| Category | Size |
|----------|------|
| Unit 1 (UI Foundation) | ~130 KB gzipped |
| Unit 2 (Core Features) | ~11 KB gzipped |
| **Total** | **~141 KB gzipped** |

**Well under 250 KB target** ✅

---

## 14. Testing Strategy

### 14.1 Manual Testing Checklist

**Authentication**:
- [ ] Register with valid email and password
- [ ] Register with duplicate email (should fail)
- [ ] Register with invalid email format (should fail)
- [ ] Register with weak password (should fail)
- [ ] Login with valid credentials
- [ ] Login with invalid credentials (should fail)
- [ ] Session persists across page reload
- [ ] Logout clears session

**Book Management**:
- [ ] Add book with valid data
- [ ] Add book with invalid data (should fail)
- [ ] View book list (empty state and with books)
- [ ] Edit book with valid data
- [ ] Edit book with invalid data (should fail)
- [ ] Delete book with confirmation
- [ ] Delete book and cancel confirmation

**Data Isolation**:
- [ ] User A cannot see User B's books
- [ ] Books persist for each user separately

**Error Handling**:
- [ ] Storage quota exceeded shows alert
- [ ] Invalid session redirects to login
- [ ] Form validation errors display inline

---

## Summary

Unit 2: Core Features adds **4 new components** (AuthComponent, BookListComponent, BookFormModal, BookItemComponent) that build upon Unit 1's foundation. These components implement **8 user stories** (AUTH-01 to AUTH-04, BOOK-01 to BOOK-04) using simple, component-level patterns consistent with Unit 1 architecture.

**Key Characteristics**:
- Component-level logic (no service layer)
- Manual state management (no complex state library)
- Hybrid loading pattern (global for bcrypt, local for storage)
- Modal-based CRUD operations
- On blur + on submit validation
- Inline errors + alert dialogs
- AuthContext for data isolation
- No new dependencies
- ~11 KB additional bundle size
- Manual testing only

All components are ready for Unit 3 enhancements (progress tracking, notes, ratings, ISBN lookup).
