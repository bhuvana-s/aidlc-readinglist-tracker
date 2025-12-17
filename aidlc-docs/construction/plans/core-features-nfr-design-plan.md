# NFR Design Plan - Unit 2: Core Features

## Unit Information
- **Unit Name**: Core Features
- **Unit Purpose**: Authentication and book management functionality
- **Stories Covered**: AUTH-01 to AUTH-04, BOOK-01 to BOOK-04 (8 stories)
- **Components**: AuthComponent, BookListComponent, BookFormComponent, BookItemComponent

---

## Context

### NFR Requirements Summary
From `nfr-requirements.md`:
- **Security**: Password hashing (bcryptjs, 10 rounds), session management (localStorage), data storage security, generic login errors
- **Performance**: Authentication ~100-300ms, book operations < 10ms, list rendering < 100ms
- **Reliability**: Error handling (alerts, inline errors), data validation (client-side), session validation
- **Availability**: Modern browsers only, offline capability
- **Scalability**: Unlimited users, ~100-500 books per user
- **Maintainability**: Component-level logic, manual testing
- **Usability**: Clear error messages, immediate validation feedback
- **Compliance**: Basic accessibility, data privacy (local-only)

### Tech Stack (Inherited from Unit 1)
- React 18+, Vite 4+, CSS Modules, Plain JavaScript ES2020+
- React Router v6, bcryptjs (10 salt rounds)
- Manual testing only, local deployment
- No additional libraries needed

### Functional Design Summary
From `functional-design/` artifacts:
- **Entities**: User (userId, email, passwordHash, createdAt), Book (bookId, userId, title, author, status, totalPages, pagesRead, createdAt)
- **Flows**: Registration, Login, Session Management, Logout, Add Book, View Books, Edit Book, Delete Book
- **Validation**: Email format, password strength, title length, author format, status enum, total pages range
- **Storage**: Users in `users` array, books in `books_{userId}` arrays, session in `currentUser`

---

## NFR Design Questions

### Question 1: Authentication Component Pattern
How should the authentication component handle registration and login flows?

**Context**: AuthComponent needs to support both registration and login with shared validation logic and error handling.

**Options**:
A) **Single Component with Mode Toggle** - One AuthComponent with `mode` prop ("login" or "register"), shared form structure, conditional fields
B) **Separate Components** - LoginComponent and RegisterComponent as separate files, duplicate validation logic
C) **Compound Components** - AuthComponent.Login and AuthComponent.Register as sub-components
D) **Tab-Based UI** - Single component with tabs to switch between login and register

[Answer]: A

---

### Question 2: Password Hashing Pattern
Where should bcryptjs password hashing be implemented?

**Context**: Password hashing is async (~100-300ms) and needs error handling. Must happen before storage.

**Options**:
A) **Component-Level Async** - Hash in AuthComponent using async/await, show loading state during hashing
B) **Utility Function** - Create auth utility module with hashPassword() and verifyPassword() functions
C) **Custom Hook** - useAuth() hook with hashing logic
D) **Context Provider** - AuthContext handles all hashing internally

[Answer]: A

---

### Question 3: Session Persistence Pattern
How should session validation on app load be implemented?

**Context**: Need to check localStorage for currentUser on app mount, verify user exists, update auth context.

**Options**:
A) **App Component useEffect** - Check session in App.jsx useEffect, update AuthContext
B) **AuthContext Internal** - AuthContext checks session in its own useEffect on mount
C) **Router Guard** - Check session in router configuration before rendering routes
D) **Custom Hook** - useSessionCheck() hook called in App component

[Answer]: B

---

### Question 4: Book List State Management
How should BookListComponent manage book data state?

**Context**: Need to load books from localStorage, display them, handle add/edit/delete operations, refresh list.

**Options**:
A) **Local State + Manual Refresh** - useState for books array, manual loadBooks() calls after mutations
B) **useReducer Pattern** - Reducer for complex state updates (add/edit/delete actions)
C) **Custom Hook** - useBooks() hook encapsulating all book CRUD logic
D) **Context Provider** - BooksContext for global book state

[Answer]: A

---

### Question 5: Form Validation Timing
When should validation occur in authentication and book forms?

**Context**: Need to balance UX (immediate feedback) with performance (avoid excessive validation).

**Options**:
A) **On Blur Only** - Validate when user leaves field, show errors immediately
B) **On Submit Only** - Validate all fields when form submitted, show all errors at once
C) **On Change + Debounce** - Validate on every keystroke with 300ms debounce
D) **On Blur + On Submit** - Validate on blur for individual fields, re-validate all on submit

[Answer]: D

---

### Question 6: Error Display Pattern
How should validation and operation errors be displayed to users?

**Context**: Need to show email/password errors, book field errors, storage quota errors, login failures.

**Options**:
A) **Inline Field Errors** - Error message below each field, generic message for login failures, alert for storage quota
B) **Toast Notifications** - All errors shown as toast notifications at top of screen
C) **Error Summary Box** - List all errors in a box at top of form
D) **Modal Dialogs** - Show all errors in modal dialogs

[Answer]: A

---

### Question 7: Book CRUD Operation Pattern
How should book add/edit/delete operations be structured?

**Context**: Need to handle add (modal/form), edit (modal with pre-filled data), delete (confirmation), refresh list.

**Options**:
A) **Modal-Based** - All operations in modals (AddBookModal, EditBookModal), delete with browser confirm()
B) **Inline Forms** - Add/edit forms inline in list, expand/collapse, delete with confirm()
C) **Separate Pages** - Navigate to /books/add, /books/edit/:id for forms
D) **Drawer/Sidebar** - Slide-in drawer for add/edit forms

[Answer]: A

---

### Question 8: Loading State for Async Operations
How should loading states be handled for bcrypt operations and localStorage access?

**Context**: bcrypt hashing takes ~100-300ms (noticeable), localStorage is fast but could fail.

**Options**:
A) **Global Loading Context** - Use LoadingContext from Unit 1 for all async operations
B) **Component-Local Loading** - Each component has own loading state (useState)
C) **Button Disabled State** - Disable submit button during operation, no loading indicator
D) **Hybrid Approach** - Global loading for bcrypt (slow), local state for localStorage (fast)

[Answer]: D

---

### Question 9: Data Isolation Enforcement
How should the app ensure users only access their own books?

**Context**: Books stored in `books_{userId}` keys. Need to prevent cross-user data access.

**Options**:
A) **AuthContext userId** - All book operations use currentUserId from AuthContext, automatic isolation
B) **Component Props** - Pass userId down through props to all book components
C) **URL Parameters** - Include userId in URLs, validate on each operation
D) **Middleware Pattern** - Create data access layer that enforces userId checks

[Answer]: A

---

### Question 10: Storage Error Recovery
How should the app handle localStorage quota exceeded errors?

**Context**: QuotaExceededError can occur when adding/editing books or registering users.

**Options**:
A) **Alert + Fail** - Show alert with guidance, operation fails, user must manually delete data
B) **Auto-Cleanup** - Automatically delete oldest books to free space
C) **Compression** - Compress data before storing to reduce size
D) **Fallback Storage** - Fall back to sessionStorage or in-memory storage

[Answer]: A

---

## Answer Summary

| Question | Answer | Pattern/Approach |
|----------|--------|------------------|
| Q1 | A | Single component with mode toggle |
| Q2 | A | Component-level async hashing |
| Q3 | B | AuthContext internal session check |
| Q4 | A | Local state + manual refresh |
| Q5 | D | On blur + on submit validation |
| Q6 | A | Inline field errors + alerts |
| Q7 | A | Modal-based CRUD operations |
| Q8 | D | Hybrid loading (global for bcrypt, local for storage) |
| Q9 | A | AuthContext userId for isolation |
| Q10 | A | Alert + fail, manual cleanup |

---

## Next Steps

1. ✅ Create NFR design plan with questions
2. ✅ Wait for user to answer all questions
3. ✅ Analyze answers for ambiguities
4. ✅ Create clarification questions if needed (or proceed if clear)
5. ✅ Generate `nfr-design-patterns.md` with implementation patterns
6. ✅ Generate `logical-components.md` with component architecture
7. ✅ Mark all steps complete with [x]
8. ✅ Update aidlc-state.md
9. ✅ Present completion message to user
10. ⬜ Wait for explicit approval before proceeding

---

## Notes

- All patterns should align with Unit 1 decisions (simple composition, component-level logic, manual storage sync)
- Focus on authentication and book management specific patterns
- Inherit global patterns from Unit 1 (error boundaries, loading context, routing guards)
- No new libraries or complex patterns needed
- Emphasize simplicity and consistency with Unit 1 architecture
