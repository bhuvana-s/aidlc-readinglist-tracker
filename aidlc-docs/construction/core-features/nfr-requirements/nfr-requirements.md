# NFR Requirements - Core Features

## Overview
This document defines the non-functional requirements for Unit 2: Core Features, covering security, performance, reliability, and maintainability requirements for authentication and book management.

---

## 1. Security Requirements

### SEC-1: Password Security
**Requirement**: Passwords must be securely hashed before storage.

**Implementation**:
- Use bcryptjs library for password hashing
- Salt rounds: 10 (industry standard)
- Hash passwords on registration before storage
- Compare hashed passwords on login using bcrypt.compare()

**Rationale**: Protect user credentials from data breaches

**Priority**: Critical

---

### SEC-2: Session Management
**Requirement**: User sessions must be managed securely.

**Implementation**:
- Store session in localStorage (userId only)
- Session type: Browser session (clears on browser close)
- No additional session tokens or CSRF protection needed
- Validate session on app load (verify user still exists)

**Rationale**: Balance security and convenience for local-only application

**Priority**: High

---

### SEC-3: Data Storage Security
**Requirement**: Sensitive data must be protected in localStorage.

**Implementation**:
- Passwords: Hashed with bcryptjs (never plain text)
- Other data: Stored as plain JSON (no encryption)
- Data isolation: Separate storage keys per user (books_{userId})

**Rationale**: For local-only app, password hashing is sufficient protection

**Priority**: High

---

### SEC-4: Login Error Messages
**Requirement**: Login errors must not reveal user information.

**Implementation**:
- Use generic error message: "Invalid email or password"
- Never indicate whether email exists or password is incorrect
- Prevent email enumeration attacks

**Rationale**: Security best practice to prevent information disclosure

**Priority**: High

---

## 2. Performance Requirements

### PERF-1: Authentication Operations
**Requirement**: Authentication operations should complete in reasonable time.

**Target**: No specific target - as fast as bcryptjs allows

**Expected Performance**:
- Registration: ~100-300ms (bcryptjs hashing time)
- Login: ~100-300ms (bcryptjs comparison time)
- Session check: < 10ms (localStorage read)

**Implementation**: Trust bcryptjs default performance with 10 salt rounds

**Rationale**: bcryptjs intentionally slow for security, acceptable UX

**Priority**: Medium

---

### PERF-2: Book Operations
**Requirement**: Book CRUD operations should be fast and responsive.

**Target**: No specific target - as fast as localStorage allows

**Expected Performance**:
- Add book: < 10ms (localStorage write)
- Load books: < 10ms (localStorage read)
- Update book: < 10ms (localStorage write)
- Delete book: < 10ms (localStorage write)

**Implementation**: Trust localStorage default performance

**Rationale**: localStorage is synchronous and very fast

**Priority**: Low

---

### PERF-3: Book List Rendering
**Requirement**: Book list should render smoothly without optimization.

**Target**: No optimization needed

**Expected Performance**:
- Render time: < 100ms for typical book counts (< 100 books)
- No pagination, virtual scrolling, or lazy loading

**Implementation**: Trust React default rendering performance

**Rationale**: Expected book counts are small, React handles easily

**Priority**: Low

---

## 3. Reliability Requirements

### REL-1: Error Handling
**Requirement**: Application must handle errors gracefully.

**Implementation**:
- localStorage failures: Show alert, operation fails
- Validation errors: Display inline next to fields
- Storage quota exceeded: Alert user to delete data manually
- No automatic retry logic or fallback storage

**Rationale**: Simple, predictable error handling for local-only app

**Priority**: Medium

---

### REL-2: Data Validation
**Requirement**: All user input must be validated.

**Implementation**:
- Client-side validation only (no server)
- Validate on blur (field-level)
- Validate on submit (form-level)
- Use validation utility functions from Unit 1

**Rationale**: Client-side sufficient for local-only application

**Priority**: High

---

### REL-3: Session Validation
**Requirement**: Sessions must be validated on app load.

**Implementation**:
- Check currentUser exists in localStorage
- Verify user still exists in users array
- Clear invalid sessions automatically
- Redirect to login if session invalid

**Rationale**: Prevent orphaned sessions from deleted users

**Priority**: Medium

---

## 4. Availability Requirements

### AVAIL-1: Browser Compatibility
**Requirement**: Application must work in modern browsers.

**Supported Browsers**:
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

**Implementation**: Use ES2020+ features, no polyfills

**Rationale**: Modern browsers only (inherited from Unit 1)

**Priority**: High

---

### AVAIL-2: Offline Capability
**Requirement**: Application must work completely offline.

**Implementation**:
- No network requests (except Unit 3 ISBN lookup)
- All data stored locally
- No server dependencies

**Rationale**: Local-only application by design

**Priority**: Critical

---

## 5. Scalability Requirements

### SCALE-1: User Capacity
**Requirement**: Support multiple users on same device.

**Expected Capacity**: Unlimited users (limited only by localStorage quota)

**Implementation**:
- Users stored in single array
- Each user's books in separate storage key
- No hard limits on user count

**Rationale**: Local-only app, no server capacity concerns

**Priority**: Low

---

### SCALE-2: Book Capacity
**Requirement**: Support reasonable number of books per user.

**Expected Capacity**: ~100-500 books per user (limited by localStorage quota)

**Implementation**:
- Books stored in array per user
- No pagination or virtual scrolling
- Alert user if storage quota exceeded

**Rationale**: localStorage quota is ~5-10MB, sufficient for expected use

**Priority**: Low

---

## 6. Maintainability Requirements

### MAINT-1: Code Organization
**Requirement**: Code must be well-organized and maintainable.

**Implementation**:
- Component-level logic (no service layer)
- Reusable validation functions
- Consistent patterns across components
- Follow Unit 1 architecture decisions

**Rationale**: Simplicity and consistency

**Priority**: Medium

---

### MAINT-2: Testing Approach
**Requirement**: Application must be testable.

**Implementation**:
- Manual testing only (no automated tests)
- Testing checklist in TESTING.md
- Test all user workflows manually

**Rationale**: Consistent with Unit 1 decision

**Priority**: Medium

---

## 7. Usability Requirements

### USE-1: Error Messages
**Requirement**: Error messages must be clear and helpful.

**Implementation**:
- Inline errors next to fields
- Specific validation error messages
- Generic login errors (security)
- Helpful guidance for storage quota errors

**Rationale**: Good user experience

**Priority**: High

---

### USE-2: Form Validation Feedback
**Requirement**: Users must receive immediate validation feedback.

**Implementation**:
- Validate on blur (when leaving field)
- Show errors immediately
- Clear errors when user starts correcting

**Rationale**: Better user experience than submit-only validation

**Priority**: High

---

## 8. Compliance Requirements

### COMP-1: Accessibility
**Requirement**: Application must meet basic accessibility standards.

**Implementation**:
- Keyboard navigation support
- ARIA labels on form fields
- Focus management
- Minimum 4.5:1 color contrast (inherited from Unit 1)

**Rationale**: Basic accessibility for all users

**Priority**: Medium

---

### COMP-2: Data Privacy
**Requirement**: User data must remain private and local.

**Implementation**:
- All data stored locally (never transmitted)
- No analytics or tracking
- No external services (except Unit 3 ISBN lookup)
- User data isolated per account

**Rationale**: Privacy by design for local-only app

**Priority**: High

---

## Summary

**Total Requirements**: 18 NFR requirements across 8 categories

**Categories**:
1. Security (4 requirements): Password hashing, session management, data storage, error messages
2. Performance (3 requirements): Authentication, book operations, list rendering
3. Reliability (3 requirements): Error handling, validation, session validation
4. Availability (2 requirements): Browser compatibility, offline capability
5. Scalability (2 requirements): User capacity, book capacity
6. Maintainability (2 requirements): Code organization, testing approach
7. Usability (2 requirements): Error messages, validation feedback
8. Compliance (2 requirements): Accessibility, data privacy

**Priority Breakdown**:
- Critical: 2 requirements
- High: 7 requirements
- Medium: 7 requirements
- Low: 2 requirements

All requirements are achievable with the inherited tech stack from Unit 1 (React, Vite, CSS Modules, JavaScript, bcryptjs). No additional libraries or tools needed.

