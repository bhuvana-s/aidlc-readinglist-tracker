# Business Logic Model - Core Features

## Overview
This document defines the business logic for Unit 2: Core Features, covering authentication workflows, book management operations, and data access patterns.

---

## 1. Authentication Logic

### 1.1 User Registration Flow

**Purpose**: Allow new users to create an account

**Input**:
- email (string)
- password (string, plain text)

**Process**:
```
1. Validate email format
   - Check regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
   - If invalid → Return error "Invalid email format"

2. Check email uniqueness
   - Load users array from localStorage
   - Search for existing user with same email
   - If found → Return error "Email already registered"

3. Validate password
   - Check length >= 8 characters
   - Check contains at least one letter
   - Check contains at least one number
   - If invalid → Return appropriate error message

4. Hash password
   - Use bcryptjs.hash(password, 10)
   - Store hash, never plain text

5. Create user object
   - userId = generateId()
   - email = provided email
   - passwordHash = hashed password
   - createdAt = getCurrentDate()

6. Store user
   - Load users array from localStorage
   - Append new user to array
   - Save users array back to localStorage

7. Auto-login
   - Set currentUser = userId in localStorage
   - Update auth context (isAuthenticated = true, currentUserId = userId)

8. Navigate to /books
```

**Output**:
- Success: User object, auto-logged in
- Failure: Error message

**Error Scenarios**:
- Invalid email format
- Email already registered
- Password too short
- Password missing letter
- Password missing number
- localStorage quota exceeded

---

### 1.2 User Login Flow

**Purpose**: Allow existing users to authenticate

**Input**:
- email (string)
- password (string, plain text)

**Process**:
```
1. Validate email format
   - Check regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
   - If invalid → Return error "Invalid email or password"

2. Find user by email
   - Load users array from localStorage
   - Search for user with matching email
   - If not found → Return error "Invalid email or password"

3. Verify password
   - Use bcryptjs.compare(password, user.passwordHash)
   - If false → Return error "Invalid email or password"

4. Create session
   - Set currentUser = userId in localStorage
   - Update auth context (isAuthenticated = true, currentUserId = userId)

5. Navigate to /books
```

**Output**:
- Success: User authenticated, session created
- Failure: Generic error message "Invalid email or password"

**Security Note**: Use generic error message to prevent email enumeration

**Error Scenarios**:
- Invalid email format
- User not found
- Incorrect password
- localStorage access error

---

### 1.3 Session Management Logic

**Purpose**: Maintain user session across page reloads

**Session Type**: Browser session (clears when browser closes)

**Session Check on App Load**:
```
1. Read currentUser from localStorage
   - If null → User not authenticated
   - If exists → Verify user still exists

2. Verify user exists
   - Load users array from localStorage
   - Find user with userId = currentUser
   - If found → Set authenticated state
   - If not found → Clear invalid session

3. Update auth context
   - isAuthenticated = true/false
   - currentUserId = userId or null

4. Route appropriately
   - If authenticated → Allow access to protected routes
   - If not authenticated → Redirect to /login
```

**Session Persistence**: 
- Session stored in localStorage (persists across page reloads)
- Session clears when browser closes (browser session behavior)
- No expiration time (indefinite until logout or browser close)

---

### 1.4 Logout Logic

**Purpose**: End user session

**Process**:
```
1. Clear session
   - Remove currentUser from localStorage

2. Update auth context
   - isAuthenticated = false
   - currentUserId = null

3. Navigate to /login
```

**Output**: User logged out, redirected to login page

---

## 2. Book Management Logic

### 2.1 Add Book Flow

**Purpose**: Add a new book to user's reading list

**Input**:
- title (string)
- author (string)
- status (string, optional, default: "wishlist")
- totalPages (number)

**Process**:
```
1. Validate title
   - Check not empty
   - Check length 1-200 characters
   - If invalid → Return error

2. Validate author
   - Check not empty
   - Check format: letters, spaces, hyphens only
   - If invalid → Return error

3. Validate status
   - Check is one of: "wishlist", "reading", "completed"
   - If not provided → Default to "wishlist"
   - If invalid → Return error

4. Validate totalPages
   - Check is number
   - Check range 1-10,000
   - If invalid → Return error

5. Create book object
   - bookId = generateId()
   - userId = currentUserId (from auth context)
   - title = provided title
   - author = provided author
   - status = provided status or "wishlist"
   - totalPages = provided totalPages
   - pagesRead = 0 (initialized)
   - createdAt = getCurrentDate()

6. Store book
   - Load books array from localStorage key: books_{userId}
   - Append new book to array
   - Save books array back to localStorage

7. Update UI
   - Refresh book list
   - Close add book form/modal
   - Show success notification (optional)
```

**Output**:
- Success: Book added to user's list
- Failure: Validation error message

**Error Scenarios**:
- Title empty or too long
- Author empty or invalid format
- Status invalid
- Total pages out of range
- localStorage quota exceeded

---

### 2.2 View Book List Flow

**Purpose**: Display all books for current user

**Input**: None (uses currentUserId from auth context)

**Process**:
```
1. Get current user ID
   - Read currentUserId from auth context
   - If null → Should not reach this (protected route)

2. Load user's books
   - Read from localStorage key: books_{userId}
   - If key doesn't exist → Return empty array
   - If key exists → Parse and return books array

3. Display books
   - If empty array → Show "No books yet. Add your first book!"
   - If has books → Display in order added (no sorting)
   - Show all books (no filtering by status)

4. For each book, display:
   - Title
   - Author
   - Status badge
   - Total pages
   - Edit button
   - Delete button
```

**Output**: Array of books for current user

**Empty State**: Helpful message when no books exist

---

### 2.3 Edit Book Flow

**Purpose**: Update existing book information

**Input**:
- bookId (string)
- Updated fields: title, author, status, totalPages

**Process**:
```
1. Load user's books
   - Read from localStorage key: books_{userId}

2. Find book to edit
   - Search array for book with matching bookId
   - If not found → Return error "Book not found"

3. Validate all fields (same as Add Book)
   - Validate title (1-200 characters)
   - Validate author (letters, spaces, hyphens)
   - Validate status (wishlist/reading/completed)
   - Validate totalPages (1-10,000)
   - If any invalid → Return error

4. Update book object
   - Update title, author, status, totalPages
   - Keep bookId, userId, pagesRead, createdAt unchanged
   - Note: pagesRead not editable in Unit 2

5. Save updated books array
   - Replace old book with updated book in array
   - Save books array back to localStorage

6. Update UI
   - Refresh book list
   - Close edit form/modal
   - Show success notification (optional)
```

**Output**:
- Success: Book updated
- Failure: Validation error or book not found

**Note**: Edit shows all fields in modal, all must be valid

---

### 2.4 Delete Book Flow

**Purpose**: Remove book from user's reading list

**Input**:
- bookId (string)

**Process**:
```
1. Show confirmation dialog
   - Message: "Are you sure you want to delete this book?"
   - Buttons: "Cancel", "Delete"
   - If Cancel → Abort deletion

2. Load user's books
   - Read from localStorage key: books_{userId}

3. Find and remove book
   - Filter array to remove book with matching bookId
   - If book not found → Silent failure (already deleted)

4. Save updated books array
   - Save filtered array back to localStorage

5. Update UI
   - Refresh book list
   - Show success notification (optional)
```

**Output**:
- Success: Book deleted
- Failure: localStorage error

**Safety**: Confirmation dialog prevents accidental deletion

---

## 3. Data Access Logic

### 3.1 User Data Access

**Load All Users**:
```javascript
function loadUsers() {
  const users = getFromStorage('users');
  return users || [];
}
```

**Find User by Email**:
```javascript
function findUserByEmail(email) {
  const users = loadUsers();
  return users.find(u => u.email === email);
}
```

**Find User by ID**:
```javascript
function findUserById(userId) {
  const users = loadUsers();
  return users.find(u => u.userId === userId);
}
```

**Save User**:
```javascript
function saveUser(newUser) {
  const users = loadUsers();
  users.push(newUser);
  return setToStorage('users', users);
}
```

---

### 3.2 Book Data Access

**Load User's Books**:
```javascript
function loadUserBooks(userId) {
  const key = `books_${userId}`;
  const books = getFromStorage(key);
  return books || [];
}
```

**Save User's Books**:
```javascript
function saveUserBooks(userId, books) {
  const key = `books_${userId}`;
  return setToStorage(key, books);
}
```

**Add Book**:
```javascript
function addBook(userId, newBook) {
  const books = loadUserBooks(userId);
  books.push(newBook);
  return saveUserBooks(userId, books);
}
```

**Update Book**:
```javascript
function updateBook(userId, bookId, updatedBook) {
  const books = loadUserBooks(userId);
  const index = books.findIndex(b => b.bookId === bookId);
  if (index === -1) return false;
  books[index] = updatedBook;
  return saveUserBooks(userId, books);
}
```

**Delete Book**:
```javascript
function deleteBook(userId, bookId) {
  const books = loadUserBooks(userId);
  const filtered = books.filter(b => b.bookId !== bookId);
  return saveUserBooks(userId, filtered);
}
```

---

## 4. Validation Logic

### 4.1 Email Validation

```javascript
function validateEmail(email) {
  if (!email || email.trim() === '') {
    return { isValid: false, error: 'Email is required' };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Invalid email format' };
  }
  
  return { isValid: true, error: null };
}
```

### 4.2 Password Validation

```javascript
function validatePassword(password) {
  if (!password || password.trim() === '') {
    return { isValid: false, error: 'Password is required' };
  }
  
  if (password.length < 8) {
    return { isValid: false, error: 'Password must be at least 8 characters' };
  }
  
  if (!/[a-zA-Z]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one letter' };
  }
  
  if (!/[0-9]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one number' };
  }
  
  return { isValid: true, error: null };
}
```

### 4.3 Book Field Validation

```javascript
function validateTitle(title) {
  if (!title || title.trim() === '') {
    return { isValid: false, error: 'Title is required' };
  }
  
  if (title.length < 1 || title.length > 200) {
    return { isValid: false, error: 'Title must be between 1 and 200 characters' };
  }
  
  return { isValid: true, error: null };
}

function validateAuthor(author) {
  if (!author || author.trim() === '') {
    return { isValid: false, error: 'Author is required' };
  }
  
  const authorRegex = /^[a-zA-Z\s-]+$/;
  if (!authorRegex.test(author)) {
    return { isValid: false, error: 'Author must contain only letters, spaces, and hyphens' };
  }
  
  return { isValid: true, error: null };
}

function validateStatus(status) {
  const validStatuses = ['wishlist', 'reading', 'completed'];
  if (!validStatuses.includes(status)) {
    return { isValid: false, error: 'Status must be wishlist, reading, or completed' };
  }
  
  return { isValid: true, error: null };
}

function validateTotalPages(totalPages) {
  if (totalPages === null || totalPages === undefined) {
    return { isValid: false, error: 'Total pages is required' };
  }
  
  const num = Number(totalPages);
  if (isNaN(num)) {
    return { isValid: false, error: 'Total pages must be a number' };
  }
  
  if (num < 1 || num > 10000) {
    return { isValid: false, error: 'Total pages must be between 1 and 10,000' };
  }
  
  return { isValid: true, error: null };
}
```

---

## 5. Error Handling Logic

### 5.1 Registration Errors

**Display**: Inline errors next to relevant fields

**Error Types**:
- Email format error → Show below email field
- Email already registered → Show below email field
- Password validation errors → Show below password field
- Storage quota exceeded → Show alert dialog

**Example**:
```
Email: [reader@example.com]
       ❌ Email already registered

Password: [pass]
          ❌ Password must be at least 8 characters
```

---

### 5.2 Login Errors

**Display**: Generic error message below form

**Error Message**: "Invalid email or password"

**Rationale**: Prevent email enumeration (security)

---

### 5.3 Book Form Errors

**Display**: Inline errors next to relevant fields

**Error Types**:
- Title validation → Show below title field
- Author validation → Show below author field
- Status validation → Show below status field
- Total pages validation → Show below total pages field

---

### 5.4 Storage Quota Exceeded

**Trigger**: localStorage.setItem() throws QuotaExceededError

**Handling**:
```
1. Catch QuotaExceededError
2. Show alert dialog:
   "Storage quota exceeded. Please delete some books to free up space."
3. Operation fails (book not saved/user not registered)
4. User must manually delete books
```

**No Automatic Cleanup**: User controls what to delete

---

## 6. Business Rules Summary

### Authentication Rules
1. Email must be unique across all users
2. Passwords must be hashed before storage (bcryptjs, 10 rounds)
3. Login errors are generic to prevent email enumeration
4. Sessions persist until browser close (browser session)
5. Invalid sessions are cleared on app load

### Book Management Rules
1. All fields required when adding/editing books
2. Default status is "wishlist" if not specified
3. pagesRead initialized to 0 for new books
4. Books displayed in order added (no sorting/filtering)
5. Book deletion requires confirmation
6. Edit shows all fields in modal

### Data Isolation Rules
1. Each user's books stored in separate localStorage key
2. Users can only access their own books
3. Book operations require valid userId from auth context

### Validation Rules
1. Email: Valid format, unique
2. Password: >= 8 chars, contains letter and number
3. Title: 1-200 characters
4. Author: Letters, spaces, hyphens only
5. Status: wishlist, reading, or completed
6. Total Pages: 1-10,000

### Error Handling Rules
1. Validation errors shown inline next to fields
2. Login errors are generic (security)
3. Storage quota errors show alert with guidance
4. No automatic data cleanup (user control)

---

## Summary

This business logic model defines:
- **4 authentication flows**: Registration, Login, Session Management, Logout
- **4 book management flows**: Add, View, Edit, Delete
- **2 data access patterns**: User data, Book data
- **4 validation functions**: Email, Password, Title, Author, Status, Total Pages
- **4 error handling strategies**: Registration, Login, Book forms, Storage quota

All logic is technology-agnostic and can be implemented in React components using the UI Foundation utilities and context providers.

