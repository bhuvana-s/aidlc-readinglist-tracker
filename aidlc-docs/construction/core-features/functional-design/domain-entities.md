# Domain Entities - Core Features

## Overview
This document defines the domain entities for Unit 2: Core Features, including user and book entities with their attributes, relationships, and constraints.

---

## 1. User Entity

### Purpose
Represents a registered user of the Reading List Tracker application.

### Attributes

| Attribute | Type | Required | Description | Constraints |
|-----------|------|----------|-------------|-------------|
| userId | String (UUID) | Yes | Unique identifier for the user | Generated using generateId() utility |
| email | String | Yes | User's email address (login credential) | Must be unique, valid email format |
| passwordHash | String | Yes | Hashed password using bcryptjs | Never store plain text password |
| createdAt | String (ISO 8601) | Yes | Timestamp when user registered | Format: YYYY-MM-DDTHH:MM:SSZ |

### Example
```json
{
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "email": "reader@example.com",
  "passwordHash": "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

### Business Rules
- Email must be unique across all users
- Password must be hashed before storage (never store plain text)
- userId generated using crypto.randomUUID via generateId() utility
- createdAt set to current timestamp on registration

---

## 2. Book Entity

### Purpose
Represents a book in a user's reading list.

### Attributes

| Attribute | Type | Required | Description | Constraints |
|-----------|------|----------|-------------|-------------|
| bookId | String (UUID) | Yes | Unique identifier for the book | Generated using generateId() utility |
| userId | String (UUID) | Yes | Owner of the book (foreign key to User) | Must reference existing user |
| title | String | Yes | Book title | 1-200 characters |
| author | String | Yes | Book author name | Letters, spaces, hyphens only |
| status | String (Enum) | Yes | Reading status | "wishlist", "reading", or "completed" |
| totalPages | Number | Yes | Total number of pages in the book | Integer, 1-10,000 |
| pagesRead | Number | Yes | Number of pages read so far | Integer, 0-totalPages, default: 0 |
| createdAt | String (ISO 8601) | Yes | Timestamp when book was added | Format: YYYY-MM-DDTHH:MM:SSZ |

### Example
```json
{
  "bookId": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "status": "reading",
  "totalPages": 180,
  "pagesRead": 45,
  "createdAt": "2024-01-20T14:22:00Z"
}
```

### Business Rules
- bookId generated using crypto.randomUUID via generateId() utility
- userId must reference an existing user
- title length: 1-200 characters
- author format: letters, spaces, hyphens only
- status must be one of: "wishlist", "reading", "completed"
- totalPages range: 1-10,000
- pagesRead range: 0 to totalPages (inclusive)
- pagesRead initialized to 0 when book is created
- Default status: "wishlist" if not specified
- createdAt set to current timestamp when book is added

---

## 3. Status Enum

### Purpose
Defines the possible reading statuses for a book.

### Values

| Value | Description | Use Case |
|-------|-------------|----------|
| wishlist | Book the user wants to read | Default status for new books |
| reading | Book the user is currently reading | Active reading |
| completed | Book the user has finished reading | Finished books |

### Business Rules
- Status is required (no null/undefined)
- Status must be one of the three defined values
- Default status is "wishlist" when adding a new book
- Status can be changed at any time by the user

---

## 4. Entity Relationships

### User to Book Relationship

**Type**: One-to-Many

**Description**: One user can have many books, but each book belongs to exactly one user.

**Relationship Diagram**:
```
User (1) ----< (Many) Book
  |                    |
  userId  ---------->  userId (foreign key)
```

**Constraints**:
- A book must have a valid userId (referential integrity)
- Deleting a user should conceptually delete all their books (not implemented in Unit 2)
- Books are isolated per user (data isolation)

---

## 5. Data Isolation

### Purpose
Ensure each user can only access their own books.

### Implementation
- Books stored in separate localStorage keys per user: `books_{userId}`
- Users stored in single localStorage key: `users` (array)
- Current user session stored in: `currentUser` (userId string)

### Storage Structure
```
localStorage:
  - "users": [User, User, User, ...]
  - "books_550e8400-e29b-41d4-a716-446655440000": [Book, Book, ...]
  - "books_7c9e6679-7425-40de-944b-e07fc1f90ae7": [Book, Book, ...]
  - "currentUser": "550e8400-e29b-41d4-a716-446655440000"
```

### Business Rules
- Each user's books stored in separate localStorage key
- Key format: `books_{userId}`
- Only current user's books are loaded and displayed
- Users cannot access other users' books

---

## 6. Validation Rules

### User Entity Validation

**Email**:
- Required: Yes
- Format: Must match email regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- Uniqueness: Must be unique across all users
- Error message: "Email already registered" if duplicate

**Password** (plain text, before hashing):
- Required: Yes
- Minimum length: 8 characters
- Must contain: At least one letter
- Must contain: At least one number
- Error messages:
  - "Password is required"
  - "Password must be at least 8 characters"
  - "Password must contain at least one letter"
  - "Password must contain at least one number"

### Book Entity Validation

**Title**:
- Required: Yes
- Length: 1-200 characters
- Error messages:
  - "Title is required"
  - "Title must be between 1 and 200 characters"

**Author**:
- Required: Yes
- Format: Letters, spaces, hyphens only (regex: `/^[a-zA-Z\s-]+$/`)
- Error messages:
  - "Author is required"
  - "Author must contain only letters, spaces, and hyphens"

**Status**:
- Required: Yes
- Values: "wishlist", "reading", "completed"
- Default: "wishlist"
- Error message: "Status must be wishlist, reading, or completed"

**Total Pages**:
- Required: Yes
- Type: Integer
- Range: 1-10,000
- Error messages:
  - "Total pages is required"
  - "Total pages must be a number"
  - "Total pages must be between 1 and 10,000"

**Pages Read**:
- Required: Yes (but auto-initialized to 0)
- Type: Integer
- Range: 0 to totalPages
- Default: 0
- Error message: "Pages read must be between 0 and total pages"

---

## 7. Entity Lifecycle

### User Lifecycle

1. **Creation** (Registration):
   - Generate userId using generateId()
   - Validate email (format and uniqueness)
   - Validate password (length, letter, number)
   - Hash password using bcryptjs
   - Set createdAt to current timestamp
   - Store in users array in localStorage

2. **Authentication** (Login):
   - Find user by email
   - Compare password hash using bcryptjs.compare()
   - Set currentUser in localStorage on success

3. **Session End** (Logout or Browser Close):
   - Remove currentUser from localStorage
   - Session clears when browser closes (browser session)

### Book Lifecycle

1. **Creation** (Add Book):
   - Generate bookId using generateId()
   - Set userId to current user
   - Validate all required fields
   - Set pagesRead to 0
   - Set status to "wishlist" (default)
   - Set createdAt to current timestamp
   - Store in books_{userId} array in localStorage

2. **Update** (Edit Book):
   - Load book by bookId from books_{userId}
   - Validate all fields
   - Update book object
   - Save back to books_{userId} in localStorage

3. **Deletion** (Delete Book):
   - Show confirmation dialog
   - Remove book from books_{userId} array
   - Save updated array to localStorage

---

## 8. Data Integrity Rules

### Referential Integrity
- Every book must have a valid userId that references an existing user
- Books cannot exist without a user

### Data Consistency
- pagesRead cannot exceed totalPages
- Status must be one of the defined enum values
- Email must be unique across all users

### Data Isolation
- Users can only access their own books
- Books are stored in separate keys per user
- No cross-user data access

---

## Summary

**Entities**: 2 (User, Book)  
**Relationships**: 1 (User 1:Many Book)  
**Storage Keys**: 3 types (users, books_{userId}, currentUser)  
**Validation Rules**: 8 fields validated  
**Status Values**: 3 (wishlist, reading, completed)

All entities are designed to support the 8 user stories in Unit 2: Core Features while preparing for Unit 3 enhancements (pagesRead field included).

