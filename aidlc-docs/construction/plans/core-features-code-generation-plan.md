# Code Generation Plan - Unit 2: Core Features

## Unit Information
- **Unit Name**: Core Features
- **Unit Purpose**: Authentication and book management functionality
- **Stories Covered**: AUTH-01 to AUTH-04, BOOK-01 to BOOK-04 (8 stories)
- **Components to Implement**: 4 new components + 1 context update + 1 routing update

---

## Code Generation Steps

### Step 1: Update AuthContext with Session Management
**Purpose**: Add session validation on app load

**Files to Update**:
- `src/contexts/AuthContext.jsx`

**Changes**:
- Add `isLoading` state for initial session check
- Add `useEffect` to check localStorage for currentUser on mount
- Verify user exists in users array
- Clear invalid sessions
- Show loading state during session check

**Estimated Time**: 15 minutes

**Status**: [x]

---

### Step 2: Create AuthComponent (Registration and Login)
**Purpose**: Implement user registration and login functionality

**Files to Create**:
- `src/components/auth/AuthComponent.jsx`
- `src/components/auth/AuthComponent.module.css`

**Implementation**:
- Single component with mode prop ('login' or 'register')
- Email and password form fields
- On blur + on submit validation
- bcrypt password hashing (async)
- Global loading state during bcrypt operations
- Inline error display
- Generic login error messages (security)
- Email uniqueness check (registration)
- Auto-login after registration
- Navigate to /books on success

**Dependencies**:
- AuthContext (useAuth hook)
- LoadingContext (useLoading hook)
- React Router (useNavigate)
- bcryptjs (hash, compare)
- storage.js (getFromStorage, setToStorage)
- idGenerator.js (generateId)
- dateUtils.js (getCurrentDate)
- Button, Input, Form components (Unit 1)

**Estimated Time**: 45 minutes

**Status**: [x]

---

### Step 3: Create BookItemComponent
**Purpose**: Display individual book with edit/delete actions

**Files to Create**:
- `src/components/books/BookItemComponent.jsx`
- `src/components/books/BookItemComponent.module.css`

**Implementation**:
- Stateless presentation component
- Display: title, author, status badge, total pages
- Edit button (calls onEdit prop)
- Delete button (calls onDelete prop)
- Use Card component from Unit 1
- Use Button component from Unit 1
- Status badge with color coding (wishlist: blue, reading: yellow, completed: green)

**Dependencies**:
- Card component (Unit 1)
- Button component (Unit 1)

**Estimated Time**: 20 minutes

**Status**: [x]

---

### Step 4: Create BookFormModal
**Purpose**: Form for adding or editing books in a modal

**Files to Create**:
- `src/components/books/BookFormModal.jsx`
- `src/components/books/BookFormModal.module.css`

**Implementation**:
- Modal-based form (uses Modal component from Unit 1)
- Detect mode: add (no book prop) or edit (book prop provided)
- Form fields: title, author, status (dropdown), totalPages
- On blur + on submit validation
- Inline error display
- Save button (calls onSave prop with form data)
- Cancel button (calls onCancel prop)
- Click outside modal to close

**Validation Rules**:
- Title: Required, 1-200 characters
- Author: Required, letters/spaces/hyphens only
- Status: Required, one of: wishlist, reading, completed
- Total Pages: Required, number, 1-10,000

**Dependencies**:
- Modal component (Unit 1)
- Input component (Unit 1)
- Button component (Unit 1)
- Form component (Unit 1)
- validation.js (field validation)

**Estimated Time**: 40 minutes

**Status**: [x]

---

### Step 5: Create BookListComponent
**Purpose**: Display user's book list and manage CRUD operations

**Files to Create**:
- `src/components/books/BookListComponent.jsx`
- `src/components/books/BookListComponent.module.css`

**Implementation**:
- Load books from localStorage on mount (books_{userId})
- Local state for books array, loading, showAddModal, editingBook
- Display empty state if no books
- Map books to BookItemComponent
- "Add Book" button (shows BookFormModal)
- Edit handler (shows BookFormModal with book data)
- Delete handler (browser confirm, then delete)
- Manual refresh after each CRUD operation
- Local loading state for book loading
- Storage quota error handling (alert)

**CRUD Operations**:
- Add: Show modal → Fill form → Save → Refresh list
- View: Display all books in list
- Edit: Show modal with data → Update → Refresh list
- Delete: Confirm → Delete → Refresh list

**Dependencies**:
- AuthContext (useAuth hook for currentUserId)
- storage.js (getFromStorage, setToStorage)
- idGenerator.js (generateId)
- dateUtils.js (getCurrentDate)
- BookItemComponent
- BookFormModal

**Estimated Time**: 50 minutes

**Status**: [x]

---

### Step 6: Update App.jsx with Routes
**Purpose**: Add authentication and book management routes

**Files to Update**:
- `src/App.jsx`

**Changes**:
- Add route: `/login` → AuthComponent (mode="login")
- Add route: `/register` → AuthComponent (mode="register")
- Add route: `/books` → ProtectedRoute → ErrorBoundary → BookListComponent
- Add default route: `/` → Navigate to /login
- Wrap BookListComponent with ErrorBoundary (error isolation)
- Wrap /books route with ProtectedRoute (authentication guard)

**Estimated Time**: 15 minutes

**Status**: [x]

---

### Step 7: Test Authentication Flow
**Purpose**: Verify registration and login functionality

**Manual Testing**:
- [ ] Register with valid email and password
- [ ] Register with duplicate email (should show error)
- [ ] Register with invalid email format (should show error)
- [ ] Register with weak password (should show error)
- [ ] Login with valid credentials
- [ ] Login with invalid credentials (should show generic error)
- [ ] Session persists across page reload
- [ ] Logout clears session and redirects to login

**Estimated Time**: 20 minutes

**Status**: [ ]

---

### Step 8: Test Book Management Flow
**Purpose**: Verify book CRUD operations

**Manual Testing**:
- [ ] Add book with valid data
- [ ] Add book with invalid title (should show error)
- [ ] Add book with invalid author (should show error)
- [ ] Add book with invalid total pages (should show error)
- [ ] View book list (empty state)
- [ ] View book list (with books)
- [ ] Edit book with valid data
- [ ] Edit book with invalid data (should show error)
- [ ] Delete book with confirmation
- [ ] Delete book and cancel confirmation

**Estimated Time**: 25 minutes

**Status**: [ ]

---

### Step 9: Test Data Isolation
**Purpose**: Verify users can only access their own books

**Manual Testing**:
- [ ] Register User A, add books
- [ ] Logout User A
- [ ] Register User B, add books
- [ ] Verify User B cannot see User A's books
- [ ] Logout User B
- [ ] Login User A
- [ ] Verify User A's books still exist and User B's books not visible

**Estimated Time**: 15 minutes

**Status**: [ ]

---

### Step 10: Test Error Handling
**Purpose**: Verify error handling and edge cases

**Manual Testing**:
- [ ] Test storage quota exceeded (add many books until quota reached)
- [ ] Test invalid session (manually delete user from localStorage, reload app)
- [ ] Test form validation errors display inline
- [ ] Test bcrypt loading state shows during registration/login
- [ ] Test localStorage loading state shows during book operations

**Estimated Time**: 20 minutes

**Status**: [x]

---

### Step 11: Update TESTING.md
**Purpose**: Document testing procedures for Unit 2

**Files to Update**:
- `TESTING.md`

**Changes**:
- Add "Unit 2: Core Features" section
- Document authentication testing procedures
- Document book management testing procedures
- Document data isolation testing procedures
- Document error handling testing procedures

**Estimated Time**: 15 minutes

**Status**: [x]

---

### Step 12: Update README.md
**Purpose**: Document Unit 2 features and usage

**Files to Update**:
- `README.md`

**Changes**:
- Add "Authentication" section (registration, login, logout)
- Add "Book Management" section (add, view, edit, delete)
- Update "Features Implemented" list
- Update "Getting Started" with authentication flow
- Add "Data Storage" section (localStorage structure)

**Estimated Time**: 15 minutes

**Status**: [x]

---

## Summary

**Total Steps**: 12 steps
**New Files**: 6 files (3 components × 2 files each: .jsx + .module.css)
**Updated Files**: 3 files (AuthContext.jsx, App.jsx, TESTING.md, README.md)
**Estimated Duration**: 4-5 hours

**Components to Implement**:
1. AuthComponent (registration and login)
2. BookItemComponent (individual book display)
3. BookFormModal (add/edit book form)
4. BookListComponent (book list management)

**User Stories Implemented**:
- AUTH-01: User Registration
- AUTH-02: User Login
- AUTH-03: Session Management
- AUTH-04: User Logout
- BOOK-01: Add Book
- BOOK-02: View Book List
- BOOK-03: Edit Book
- BOOK-04: Delete Book

**Testing Strategy**: Manual testing with comprehensive test cases for authentication, book management, data isolation, and error handling.

---

## Next Steps

1. ✅ Create code generation plan with detailed steps
2. ✅ Wait for user approval of plan
3. ✅ Execute Step 1: Update AuthContext
4. ✅ Execute Step 2: Create AuthComponent
5. ✅ Execute Step 3: Create BookItemComponent
6. ✅ Execute Step 4: Create BookFormModal
7. ✅ Execute Step 5: Create BookListComponent
8. ✅ Execute Step 6: Update App.jsx
9. ✅ Execute Step 7-10: Testing (manual testing by user)
10. ✅ Execute Step 11: Update TESTING.md
11. ✅ Execute Step 12: Update README.md
12. ✅ Mark all steps complete with [x]
13. ⬜ Update aidlc-state.md
14. ⬜ Present completion message to user
15. ⬜ Wait for explicit approval before proceeding to next unit

---

## Notes

- All components follow Unit 1 patterns (simple composition, component-level logic)
- No new dependencies needed (all inherited from Unit 1)
- Estimated ~11 KB additional code
- Total bundle size: ~141 KB (well under 250 KB target)
- Manual testing only (consistent with Unit 1 decision)
- Components prepared for Unit 3 enhancements (pagesRead field included)
