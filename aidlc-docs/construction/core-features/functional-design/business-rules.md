# Business Rules - Core Features

## Overview
This document defines the business rules and constraints for Unit 2: Core Features, organized by functional area.

---

## 1. Authentication Rules

### RULE AUTH-1: Email Uniqueness
**Rule**: Each email address can only be registered once.

**Enforcement**: Check existing users before registration

**Violation**: Show error "Email already registered"

**Rationale**: Prevent duplicate accounts, ensure unique login credentials

---

### RULE AUTH-2: Password Security
**Rule**: Passwords must never be stored in plain text.

**Enforcement**: Hash all passwords using bcryptjs with 10 salt rounds before storage

**Implementation**: `bcrypt.hash(password, 10)`

**Rationale**: Protect user credentials from data breaches

---

### RULE AUTH-3: Password Strength
**Rule**: Passwords must meet minimum strength requirements:
- Minimum 8 characters
- At least one letter (a-z, A-Z)
- At least one number (0-9)

**Enforcement**: Validate before hashing and storage

**Violation**: Show specific error message for each requirement

**Rationale**: Ensure basic password security

---

### RULE AUTH-4: Login Error Messages
**Rule**: Login failures must not reveal whether email exists.

**Enforcement**: Always show generic error "Invalid email or password"

**Rationale**: Prevent email enumeration attacks

---

### RULE AUTH-5: Session Type
**Rule**: User sessions are browser sessions (clear when browser closes).

**Enforcement**: Store session in localStorage (persists across page reloads but clears on browser close)

**Rationale**: Balance security and convenience

---

### RULE AUTH-6: Invalid Session Cleanup
**Rule**: Invalid sessions must be cleared on app load.

**Enforcement**: Verify user exists when checking session, clear if not found

**Rationale**: Prevent orphaned sessions from deleted users

---

## 2. Book Management Rules

### RULE BOOK-1: Required Fields
**Rule**: All book fields are required when adding or editing.

**Required Fields**:
- title
- author
- status
- totalPages

**Enforcement**: Validate all fields before save

**Violation**: Show inline error for each missing/invalid field

**Rationale**: Ensure data quality and completeness

---

### RULE BOOK-2: Default Status
**Rule**: New books default to "wishlist" status if not specified.

**Enforcement**: Set status = "wishlist" if not provided

**Rationale**: Logical default for books user wants to read

---

### RULE BOOK-3: Pages Read Initialization
**Rule**: New books have pagesRead initialized to 0.

**Enforcement**: Set pagesRead = 0 when creating book

**Rationale**: User hasn't started reading yet

---

### RULE BOOK-4: Book Display Order
**Rule**: Books displayed in order added (no sorting or filtering).

**Enforcement**: Display books in array order from localStorage

**Rationale**: Simplicity for Unit 2, sorting/filtering can be added later

---

### RULE BOOK-5: Deletion Confirmation
**Rule**: Book deletion requires user confirmation.

**Enforcement**: Show confirmation dialog before deleting

**Dialog**: "Are you sure you want to delete this book?"

**Rationale**: Prevent accidental data loss

---

### RULE BOOK-6: Edit All Fields
**Rule**: Editing a book shows all fields in modal, all must be valid.

**Enforcement**: Display full edit form, validate all fields on save

**Rationale**: Ensure data consistency, prevent partial updates

---

### RULE BOOK-7: Empty State Message
**Rule**: When user has no books, show helpful message.

**Message**: "No books yet. Add your first book!"

**Enforcement**: Check if books array is empty, display message

**Rationale**: Better user experience than blank screen

---

## 3. Data Validation Rules

### RULE VAL-1: Email Format
**Rule**: Email must match valid email format.

**Format**: `user@domain.ext`

**Regex**: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`

**Violation**: "Invalid email format"

---

### RULE VAL-2: Title Length
**Rule**: Book title must be 1-200 characters.

**Minimum**: 1 character (not empty)

**Maximum**: 200 characters

**Violation**: "Title must be between 1 and 200 characters"

**Rationale**: Accommodate real book titles while preventing abuse

---

### RULE VAL-3: Author Format
**Rule**: Author name must contain only letters, spaces, and hyphens.

**Regex**: `/^[a-zA-Z\s-]+$/`

**Allowed**: Letters (a-z, A-Z), spaces, hyphens (-)

**Violation**: "Author must contain only letters, spaces, and hyphens"

**Rationale**: Support international names and compound names

---

### RULE VAL-4: Status Values
**Rule**: Book status must be one of three defined values.

**Valid Values**:
- "wishlist"
- "reading"
- "completed"

**Violation**: "Status must be wishlist, reading, or completed"

**Rationale**: Enforce data consistency

---

### RULE VAL-5: Total Pages Range
**Rule**: Total pages must be between 1 and 10,000.

**Minimum**: 1 page

**Maximum**: 10,000 pages

**Type**: Integer

**Violation**: "Total pages must be between 1 and 10,000"

**Rationale**: Accommodate real books while preventing invalid data

---

### RULE VAL-6: Pages Read Range
**Rule**: Pages read must be between 0 and totalPages.

**Minimum**: 0 (not started)

**Maximum**: totalPages (finished)

**Type**: Integer

**Violation**: "Pages read must be between 0 and total pages"

**Rationale**: Logical constraint for progress tracking

---

## 4. Data Storage Rules

### RULE STOR-1: User Storage Key
**Rule**: All users stored in single localStorage key "users".

**Structure**: Array of user objects

**Key**: `"users"`

**Rationale**: Simple centralized user management

---

### RULE STOR-2: Book Storage Keys
**Rule**: Each user's books stored in separate localStorage key.

**Key Format**: `"books_{userId}"`

**Structure**: Array of book objects per user

**Example**: `"books_550e8400-e29b-41d4-a716-446655440000"`

**Rationale**: Data isolation, efficient per-user access

---

### RULE STOR-3: Session Storage Key
**Rule**: Current user session stored in localStorage key "currentUser".

**Key**: `"currentUser"`

**Value**: userId string (or null if not authenticated)

**Rationale**: Simple session management

---

### RULE STOR-4: User Data Structure
**Rule**: User objects must have exactly these fields:

```json
{
  "userId": "string (UUID)",
  "email": "string",
  "passwordHash": "string",
  "createdAt": "string (ISO 8601)"
}
```

**Rationale**: Consistent data structure

---

### RULE STOR-5: Book Data Structure
**Rule**: Book objects must have exactly these fields:

```json
{
  "bookId": "string (UUID)",
  "userId": "string (UUID)",
  "title": "string",
  "author": "string",
  "status": "string (enum)",
  "totalPages": "number",
  "pagesRead": "number",
  "createdAt": "string (ISO 8601)"
}
```

**Rationale**: Consistent data structure, prepared for Unit 3

---

## 5. Data Isolation Rules

### RULE ISO-1: User Book Access
**Rule**: Users can only access their own books.

**Enforcement**: Filter books by userId, use separate storage keys

**Violation**: Should be impossible (architectural constraint)

**Rationale**: Privacy and data security

---

### RULE ISO-2: Book Ownership
**Rule**: Every book must have a valid userId referencing an existing user.

**Enforcement**: Set userId from auth context when creating book

**Rationale**: Referential integrity

---

### RULE ISO-3: Cross-User Prevention
**Rule**: No operations can access or modify other users' books.

**Enforcement**: Always use currentUserId from auth context

**Rationale**: Data security

---

## 6. ID Generation Rules

### RULE ID-1: User ID Generation
**Rule**: User IDs generated using UUID (crypto.randomUUID).

**Implementation**: `generateId()` utility function

**Format**: UUID v4 (e.g., "550e8400-e29b-41d4-a716-446655440000")

**Rationale**: Guaranteed uniqueness, no collision risk

---

### RULE ID-2: Book ID Generation
**Rule**: Book IDs generated using UUID (crypto.randomUUID).

**Implementation**: `generateId()` utility function

**Format**: UUID v4

**Rationale**: Guaranteed uniqueness, simpler than counter management

---

## 7. Error Handling Rules

### RULE ERR-1: Inline Field Errors
**Rule**: Validation errors displayed inline next to relevant fields.

**Display**: Error message in red text below field

**Rationale**: Clear, immediate feedback

---

### RULE ERR-2: Generic Login Errors
**Rule**: Login errors must be generic (no specific email/password indication).

**Message**: "Invalid email or password"

**Rationale**: Security (prevent email enumeration)

---

### RULE ERR-3: Storage Quota Handling
**Rule**: Storage quota exceeded errors show alert with guidance.

**Alert**: "Storage quota exceeded. Please delete some books to free up space."

**Action**: User manually deletes books (no automatic cleanup)

**Rationale**: User control over data deletion

---

### RULE ERR-4: Error Clearing
**Rule**: Errors clear when user starts correcting the issue.

**Trigger**: onChange event on input field

**Rationale**: Better user experience

---

## 8. UI Behavior Rules

### RULE UI-1: Protected Routes
**Rule**: Book management routes require authentication.

**Protected Routes**: /books, /statistics, /search, /export

**Enforcement**: ProtectedRoute HOC redirects to /login if not authenticated

**Rationale**: Security, data access control

---

### RULE UI-2: Auto-Login After Registration
**Rule**: Users automatically logged in after successful registration.

**Implementation**: Set session and navigate to /books

**Rationale**: Better user experience (no need to login after registering)

---

### RULE UI-3: Modal Edit Form
**Rule**: Book editing opens in modal with all fields.

**Display**: Modal dialog with full edit form

**Rationale**: Clear editing context, doesn't navigate away from list

---

### RULE UI-4: Confirmation Dialogs
**Rule**: Destructive actions require confirmation.

**Actions**: Delete book

**Dialog**: Simple "Are you sure?" confirmation

**Rationale**: Prevent accidental data loss

---

## 9. Performance Rules

### RULE PERF-1: Lazy Book Loading
**Rule**: Only load current user's books (not all users' books).

**Implementation**: Read from books_{userId} key only

**Rationale**: Efficient memory usage, faster load times

---

### RULE PERF-2: No Premature Optimization
**Rule**: Use simple, straightforward implementations (no complex optimizations).

**Rationale**: Simplicity, maintainability (per NFR design decisions)

---

## 10. Security Rules

### RULE SEC-1: Password Hashing
**Rule**: All passwords hashed with bcryptjs before storage.

**Algorithm**: bcrypt with 10 salt rounds

**Rationale**: Industry standard password security

---

### RULE SEC-2: No Plain Text Passwords
**Rule**: Plain text passwords never stored or logged.

**Enforcement**: Hash immediately after validation

**Rationale**: Security best practice

---

### RULE SEC-3: Session Validation
**Rule**: Validate session on every app load.

**Check**: Verify user still exists, clear invalid sessions

**Rationale**: Prevent orphaned or invalid sessions

---

## Summary

**Total Rules**: 40 rules across 10 categories

**Categories**:
1. Authentication (6 rules)
2. Book Management (7 rules)
3. Data Validation (6 rules)
4. Data Storage (5 rules)
5. Data Isolation (3 rules)
6. ID Generation (2 rules)
7. Error Handling (4 rules)
8. UI Behavior (4 rules)
9. Performance (2 rules)
10. Security (3 rules)

All rules are enforceable through code implementation and support the 8 user stories in Unit 2: Core Features.

