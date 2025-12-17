# Application Components - Reading List Tracker

## Component Architecture Overview

### Architecture Style
**Feature-Based Component Organization** with self-contained components managing their own state, data access, business logic, validation, and error handling.

### Design Principles
- Each component corresponds to a major feature area
- Components are self-contained with minimal external dependencies
- Parent-child communication via props and events
- Direct local storage access from components
- Inline business logic and validation

---

## Component Catalog

### 1. App Component
**Type**: Root Container Component

**Purpose**: Application shell and routing container

**Responsibilities**:
- Initialize application
- Manage routing between feature components
- Provide application-level layout (header, navigation, footer)
- Handle user session state (logged in/out)
- Route to appropriate component based on authentication state

**Interfaces**:
- **Inputs**: None (root component)
- **Outputs**: None (root component)
- **Child Components**: All feature components

**Scope**: Application-wide container and router

---

### 2. AuthComponent
**Type**: Feature Component

**Purpose**: User authentication and registration

**Responsibilities**:
- Display registration form
- Display login form
- Validate user credentials
- Create new user accounts
- Authenticate existing users
- Store user data in local storage
- Manage user session
- Hash passwords securely
- Handle authentication errors

**Interfaces**:
- **Inputs**: None (standalone feature)
- **Outputs**: 
  - `onLoginSuccess(userId)` - Emitted when user logs in successfully
  - `onRegisterSuccess(userId)` - Emitted when user registers successfully
- **Local Storage Access**: 
  - Read: users array
  - Write: users array, currentUser

**Scope**: User authentication and session management

**User Stories Supported**: AUTH-01, AUTH-02, AUTH-03, AUTH-04

---

### 3. BookListComponent
**Type**: Feature Component

**Purpose**: Display and manage book collection

**Responsibilities**:
- Display list of all user's books
- Show book details (title, author, status, progress)
- Provide add/edit/delete actions for books
- Filter books by status (Reading, Completed, Wishlist)
- Display empty state when no books exist
- Handle book selection for editing
- Manage book list state
- Access and update books in local storage
- Validate book data
- Handle book operation errors

**Interfaces**:
- **Inputs**: 
  - `userId` - Current logged-in user ID
- **Outputs**: 
  - `onBookSelected(bookId)` - Emitted when user selects a book
- **Child Components**: 
  - BookFormComponent (for add/edit)
  - BookItemComponent (for each book in list)
- **Local Storage Access**: 
  - Read: books array (filtered by userId)
  - Write: books array (add, update, delete)

**Scope**: Book collection display and CRUD operations

**User Stories Supported**: BOOK-01, BOOK-02, BOOK-03, BOOK-04

---

### 4. BookFormComponent
**Type**: Sub-Component (Child of BookListComponent)

**Purpose**: Form for adding or editing books

**Responsibilities**:
- Display form fields (title, author, status, pages, notes, rating)
- Validate form inputs
- Handle form submission
- Support manual entry mode
- Support ISBN lookup mode
- Support import mode (JSON/CSV)
- Call ISBN API for book lookup
- Parse and validate import files
- Handle form errors
- Emit book data to parent on save

**Interfaces**:
- **Inputs**: 
  - `book` - Book object for editing (optional, null for new book)
  - `mode` - Form mode: 'manual', 'isbn', 'import'
- **Outputs**: 
  - `onSave(bookData)` - Emitted when form is saved
  - `onCancel()` - Emitted when form is cancelled
- **External API**: ISBN lookup API (Open Library or Google Books)

**Scope**: Book data entry and validation

**User Stories Supported**: BOOK-01, BOOK-03, ENTRY-01, ENTRY-02, ENTRY-03

---

### 5. BookItemComponent
**Type**: Sub-Component (Child of BookListComponent)

**Purpose**: Display individual book in list

**Responsibilities**:
- Display book information (title, author, status)
- Display progress bar for books being read
- Display rating stars
- Provide edit and delete actions
- Handle user interactions (click to view details)

**Interfaces**:
- **Inputs**: 
  - `book` - Book object to display
- **Outputs**: 
  - `onEdit(bookId)` - Emitted when edit button clicked
  - `onDelete(bookId)` - Emitted when delete button clicked
  - `onClick(bookId)` - Emitted when book item clicked

**Scope**: Individual book display

**User Stories Supported**: BOOK-02, PROG-02

---

### 6. ProgressTrackerComponent
**Type**: Feature Component

**Purpose**: Track and update reading progress

**Responsibilities**:
- Display current reading progress for a book
- Allow user to update current page number
- Calculate progress percentage
- Display visual progress indicator (progress bar)
- Suggest marking book complete at 100%
- Update book status to completed
- Record completion date
- Validate page number inputs
- Update local storage with progress
- Handle progress update errors

**Interfaces**:
- **Inputs**: 
  - `bookId` - ID of book to track progress for
  - `userId` - Current user ID
- **Outputs**: 
  - `onProgressUpdated(bookId, progress)` - Emitted when progress changes
  - `onBookCompleted(bookId)` - Emitted when book marked complete
- **Local Storage Access**: 
  - Read: book data
  - Write: book progress, status, completion date

**Scope**: Reading progress tracking and updates

**User Stories Supported**: PROG-01, PROG-02, PROG-03

---

### 7. NotesRatingsComponent
**Type**: Feature Component

**Purpose**: Manage book notes and ratings

**Responsibilities**:
- Display notes editor for a book
- Display rating selector (5-star system)
- Allow user to add/edit notes
- Allow user to add/change rating
- Save notes and ratings to book
- Update local storage
- Handle save errors

**Interfaces**:
- **Inputs**: 
  - `bookId` - ID of book to add notes/rating for
  - `userId` - Current user ID
- **Outputs**: 
  - `onNotesSaved(bookId, notes)` - Emitted when notes saved
  - `onRatingChanged(bookId, rating)` - Emitted when rating changed
- **Local Storage Access**: 
  - Read: book data
  - Write: book notes and rating

**Scope**: Book notes and ratings management

**User Stories Supported**: NOTE-01, NOTE-02

---

### 8. StatisticsComponent
**Type**: Feature Component

**Purpose**: Display reading statistics and insights

**Responsibilities**:
- Calculate books completed per month
- Calculate reading pace (pages per day/week)
- Calculate book counts by status
- Display statistics in clear, visual format
- Handle cases with insufficient data
- Read book data from local storage
- Perform statistical calculations
- Update statistics in real-time

**Interfaces**:
- **Inputs**: 
  - `userId` - Current user ID
- **Outputs**: None (display-only component)
- **Local Storage Access**: 
  - Read: books array (filtered by userId)

**Scope**: Reading statistics calculation and display

**User Stories Supported**: STAT-01, STAT-02, STAT-03

---

### 9. SearchComponent
**Type**: Feature Component

**Purpose**: Search and filter books

**Responsibilities**:
- Display search input box
- Filter books by title in real-time
- Filter books by author in real-time
- Display search results
- Clear search and return to full list
- Handle empty search results
- Perform case-insensitive substring matching

**Interfaces**:
- **Inputs**: 
  - `userId` - Current user ID
- **Outputs**: 
  - `onBookSelected(bookId)` - Emitted when search result clicked
- **Child Components**: BookItemComponent (for search results)
- **Local Storage Access**: 
  - Read: books array (filtered by userId)

**Scope**: Book search and filtering

**User Stories Supported**: SEARCH-01, SEARCH-02, SEARCH-03

---

### 10. ExportComponent
**Type**: Feature Component

**Purpose**: Export reading list data

**Responsibilities**:
- Generate JSON export of all book data
- Include user information in export
- Format JSON properly
- Trigger browser download
- Generate filename with date
- Handle export errors
- Display success confirmation

**Interfaces**:
- **Inputs**: 
  - `userId` - Current user ID
- **Outputs**: 
  - `onExportComplete()` - Emitted when export successful
- **Local Storage Access**: 
  - Read: users array, books array (filtered by userId)

**Scope**: Data export functionality

**User Stories Supported**: EXPORT-01

---

## Component Hierarchy

```
App
├── AuthComponent
└── (After Authentication)
    ├── BookListComponent
    │   ├── BookFormComponent
    │   └── BookItemComponent (multiple instances)
    ├── ProgressTrackerComponent
    ├── NotesRatingsComponent
    ├── StatisticsComponent
    ├── SearchComponent
    │   └── BookItemComponent (multiple instances)
    └── ExportComponent
```

---

## Component Communication Patterns

### Parent-Child Communication
- **Props Down**: Parent passes data to child via props
- **Events Up**: Child emits events to parent for actions

### Sibling Communication
- **Via Parent**: Siblings communicate through shared parent component
- **Example**: BookListComponent and ProgressTrackerComponent both update book data, coordinated by App component

### No Shared State
- Each component manages its own local state
- No centralized state management system
- Components read/write directly to local storage as needed

---

## Local Storage Data Structure

Components access the following local storage structure:

```json
{
  "users": [
    {
      "userId": "uuid",
      "email": "user@example.com",
      "passwordHash": "hashed-password",
      "createdAt": "ISO-date"
    }
  ],
  "books": [
    {
      "bookId": "uuid",
      "userId": "uuid",
      "title": "Book Title",
      "author": "Author Name",
      "status": "reading|completed|wishlist",
      "totalPages": 350,
      "currentPage": 150,
      "progress": 42.86,
      "notes": "User notes",
      "rating": 4,
      "isbn": "optional-isbn",
      "dateAdded": "ISO-date",
      "dateCompleted": "ISO-date"
    }
  ],
  "currentUser": "uuid-or-null"
}
```

---

## Design Notes

- **Self-Contained Components**: Each component handles its own state, logic, validation, and errors
- **Minimal Abstraction**: No separate service layer - components access local storage directly
- **Simple Communication**: Props and events only, no event bus or shared services
- **Feature Alignment**: Components map directly to feature areas and user stories
- **Testability**: Components can be tested independently with mocked local storage
- **Maintainability**: Clear component boundaries make it easy to locate and modify functionality
