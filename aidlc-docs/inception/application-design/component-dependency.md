# Component Dependencies - Reading List Tracker

## Dependency Overview

### Architecture Summary
- **Component Organization**: Feature-based with parent-child relationships
- **Communication Pattern**: Props down, events up
- **State Management**: Local state per component
- **Data Access**: Direct local storage access
- **No Service Dependencies**: Components are self-contained

---

## Component Dependency Matrix

| Component | Depends On | Depended On By | Communication Type |
|-----------|------------|----------------|-------------------|
| App | None | All feature components | Parent-child (props/events) |
| AuthComponent | App (parent) | None | Child-to-parent (events) |
| BookListComponent | App (parent) | BookFormComponent, BookItemComponent | Parent-child (props/events) |
| BookFormComponent | BookListComponent (parent) | None | Child-to-parent (events) |
| BookItemComponent | BookListComponent or SearchComponent (parent) | None | Child-to-parent (events) |
| ProgressTrackerComponent | App (parent) | None | Child-to-parent (events) |
| NotesRatingsComponent | App (parent) | None | Child-to-parent (events) |
| StatisticsComponent | App (parent) | None | Display-only (no events) |
| SearchComponent | App (parent) | BookItemComponent | Parent-child (props/events) |
| ExportComponent | App (parent) | None | Child-to-parent (events) |

---

## Component Hierarchy

```
App (Root)
│
├── AuthComponent
│   └── (No children)
│
├── BookListComponent
│   ├── BookFormComponent
│   └── BookItemComponent (multiple instances)
│
├── ProgressTrackerComponent
│   └── (No children)
│
├── NotesRatingsComponent
│   └── (No children)
│
├── StatisticsComponent
│   └── (No children)
│
├── SearchComponent
│   └── BookItemComponent (multiple instances)
│
└── ExportComponent
    └── (No children)
```

---

## Communication Patterns

### 1. App ↔ AuthComponent

**Props (App → AuthComponent)**:
- None (AuthComponent is standalone)

**Events (AuthComponent → App)**:
- `onLoginSuccess(userId)` - User logged in successfully
- `onRegisterSuccess(userId)` - User registered successfully

**Data Flow**:
```
User enters credentials
  → AuthComponent validates and authenticates
    → AuthComponent emits onLoginSuccess(userId)
      → App receives event, updates session
        → App navigates to main application
```

---

### 2. App ↔ BookListComponent

**Props (App → BookListComponent)**:
- `userId` - Current logged-in user ID

**Events (BookListComponent → App)**:
- `onBookSelected(bookId)` - User selected a book (for navigation)

**Data Flow**:
```
App passes userId to BookListComponent
  → BookListComponent loads books for userId
    → BookListComponent displays book list
      → User selects book
        → BookListComponent emits onBookSelected(bookId)
          → App navigates to book details
```

---

### 3. BookListComponent ↔ BookFormComponent

**Props (BookListComponent → BookFormComponent)**:
- `book` - Book object for editing (null for new book)
- `mode` - Form mode: 'manual', 'isbn', or 'import'

**Events (BookFormComponent → BookListComponent)**:
- `onSave(bookData)` - Form submitted with book data
- `onCancel()` - Form cancelled

**Data Flow**:
```
User clicks "Add Book"
  → BookListComponent opens BookFormComponent (book=null, mode='manual')
    → User fills form
      → BookFormComponent emits onSave(bookData)
        → BookListComponent saves book to local storage
          → BookListComponent refreshes book list
```

---

### 4. BookListComponent ↔ BookItemComponent

**Props (BookListComponent → BookItemComponent)**:
- `book` - Book object to display

**Events (BookItemComponent → BookListComponent)**:
- `onEdit(bookId)` - Edit button clicked
- `onDelete(bookId)` - Delete button clicked
- `onClick(bookId)` - Book item clicked

**Data Flow**:
```
BookListComponent passes book to BookItemComponent
  → BookItemComponent displays book
    → User clicks edit button
      → BookItemComponent emits onEdit(bookId)
        → BookListComponent opens BookFormComponent for editing
```

---

### 5. App ↔ ProgressTrackerComponent

**Props (App → ProgressTrackerComponent)**:
- `bookId` - ID of book to track progress for
- `userId` - Current user ID

**Events (ProgressTrackerComponent → App)**:
- `onProgressUpdated(bookId, progress)` - Progress updated
- `onBookCompleted(bookId)` - Book marked complete

**Data Flow**:
```
App passes bookId and userId to ProgressTrackerComponent
  → ProgressTrackerComponent loads book data
    → User updates current page
      → ProgressTrackerComponent calculates progress
        → ProgressTrackerComponent saves to local storage
          → ProgressTrackerComponent emits onProgressUpdated(bookId, progress)
            → App can refresh other components if needed
```

---

### 6. App ↔ NotesRatingsComponent

**Props (App → NotesRatingsComponent)**:
- `bookId` - ID of book to add notes/rating for
- `userId` - Current user ID

**Events (NotesRatingsComponent → App)**:
- `onNotesSaved(bookId, notes)` - Notes saved
- `onRatingChanged(bookId, rating)` - Rating changed

**Data Flow**:
```
App passes bookId and userId to NotesRatingsComponent
  → NotesRatingsComponent loads book data
    → User edits notes and rating
      → NotesRatingsComponent saves to local storage
        → NotesRatingsComponent emits onNotesSaved and onRatingChanged
          → App can refresh other components if needed
```

---

### 7. App ↔ StatisticsComponent

**Props (App → StatisticsComponent)**:
- `userId` - Current user ID

**Events (StatisticsComponent → App)**:
- None (display-only component)

**Data Flow**:
```
App passes userId to StatisticsComponent
  → StatisticsComponent loads all books for userId
    → StatisticsComponent calculates statistics
      → StatisticsComponent displays results
```

---

### 8. App ↔ SearchComponent

**Props (App → SearchComponent)**:
- `userId` - Current user ID

**Events (SearchComponent → App)**:
- `onBookSelected(bookId)` - Search result selected

**Data Flow**:
```
App passes userId to SearchComponent
  → SearchComponent loads all books for userId
    → User types search query
      → SearchComponent filters books in real-time
        → SearchComponent displays results
          → User clicks result
            → SearchComponent emits onBookSelected(bookId)
              → App navigates to book details
```

---

### 9. SearchComponent ↔ BookItemComponent

**Props (SearchComponent → BookItemComponent)**:
- `book` - Book object to display

**Events (BookItemComponent → SearchComponent)**:
- `onClick(bookId)` - Book item clicked

**Data Flow**:
```
SearchComponent passes filtered books to BookItemComponent instances
  → BookItemComponent displays book
    → User clicks book
      → BookItemComponent emits onClick(bookId)
        → SearchComponent emits onBookSelected(bookId) to App
```

---

### 10. App ↔ ExportComponent

**Props (App → ExportComponent)**:
- `userId` - Current user ID

**Events (ExportComponent → App)**:
- `onExportComplete()` - Export completed successfully

**Data Flow**:
```
App passes userId to ExportComponent
  → User clicks export button
    → ExportComponent loads user and books data
      → ExportComponent generates JSON
        → ExportComponent triggers browser download
          → ExportComponent emits onExportComplete()
            → App shows success message
```

---

## Local Storage Dependencies

All components that access local storage depend on the same data structure:

### Shared Data Structure
```json
{
  "users": [...],
  "books": [...],
  "currentUser": "userId-or-null"
}
```

### Components Accessing Local Storage

| Component | Read Operations | Write Operations |
|-----------|----------------|------------------|
| AuthComponent | users, currentUser | users, currentUser |
| BookListComponent | books (filtered by userId) | books (add, update, delete) |
| BookFormComponent | None (receives data via props) | None (emits data via events) |
| ProgressTrackerComponent | books (single book by bookId) | books (update progress, status) |
| NotesRatingsComponent | books (single book by bookId) | books (update notes, rating) |
| StatisticsComponent | books (filtered by userId) | None (read-only) |
| SearchComponent | books (filtered by userId) | None (read-only) |
| ExportComponent | users, books (filtered by userId) | None (read-only) |

### Data Consistency
- **No Synchronization**: Components read/write independently
- **No Caching**: Components read fresh data from local storage each time
- **No Optimistic Updates**: Components write immediately to local storage
- **No Conflict Resolution**: Last write wins (single-user application)

---

## External Dependencies

### ISBN Lookup API
**Dependent Component**: BookFormComponent

**API**: Open Library API or Google Books API

**Dependency Type**: External HTTP API

**Communication**:
```
BookFormComponent
  → fetch('https://openlibrary.org/api/books?bibkeys=ISBN:...')
    → API Response
      → BookFormComponent.parseISBNResponse()
```

**Error Handling**: BookFormComponent handles API errors locally

---

## No Circular Dependencies

### Dependency Graph
```
App
 ├─→ AuthComponent
 ├─→ BookListComponent
 │    ├─→ BookFormComponent
 │    └─→ BookItemComponent
 ├─→ ProgressTrackerComponent
 ├─→ NotesRatingsComponent
 ├─→ StatisticsComponent
 ├─→ SearchComponent
 │    └─→ BookItemComponent
 └─→ ExportComponent
```

**Validation**: No circular dependencies exist. All dependencies flow downward from parent to child.

---

## Component Coupling Analysis

### Tight Coupling
- **BookListComponent ↔ BookFormComponent**: Tightly coupled (parent-child relationship)
- **BookListComponent ↔ BookItemComponent**: Tightly coupled (parent-child relationship)
- **SearchComponent ↔ BookItemComponent**: Tightly coupled (parent-child relationship)

### Loose Coupling
- **Feature Components ↔ App**: Loosely coupled (communicate via events)
- **Feature Components ↔ Each Other**: No direct coupling (communicate via App)

### Coupling to Local Storage
- **All Components**: Coupled to local storage data structure
- **Risk**: Changes to data structure affect multiple components
- **Mitigation**: Clear data model documentation, consistent access patterns

---

## Data Flow Diagram

### Overall Data Flow
```
┌─────────────────────────────────────────────────┐
│                  App Component                  │
│         (Session, Routing, Orchestration)       │
└─────────────────────────────────────────────────┘
         │                    ▲
         │ Props (userId)     │ Events (success, selection)
         ▼                    │
┌─────────────────────────────────────────────────┐
│              Feature Components                 │
│  (Auth, BookList, Progress, Notes, Stats,       │
│   Search, Export)                               │
└─────────────────────────────────────────────────┘
         │                    ▲
         │ Read/Write         │ Data
         ▼                    │
┌─────────────────────────────────────────────────┐
│          Browser Local Storage                  │
│  { users: [...], books: [...], currentUser }    │
└─────────────────────────────────────────────────┘
```

### Book Management Data Flow
```
User Action (Add/Edit/Delete Book)
  ↓
BookListComponent
  ↓
BookFormComponent (if add/edit)
  ↓
Validate Data
  ↓
Write to Local Storage
  ↓
Emit Event to Parent
  ↓
BookListComponent Refreshes
  ↓
Display Updated List
```

### Progress Tracking Data Flow
```
User Updates Page Number
  ↓
ProgressTrackerComponent
  ↓
Calculate Progress %
  ↓
Validate Page Number
  ↓
Write to Local Storage
  ↓
Update UI (Progress Bar)
  ↓
Check if Complete (100%)
  ↓
Suggest Completion (if 100%)
```

### Statistics Data Flow
```
StatisticsComponent Loads
  ↓
Read All Books from Local Storage
  ↓
Filter by Current User
  ↓
Calculate Books Per Month
  ↓
Calculate Reading Pace
  ↓
Calculate Counts by Status
  ↓
Display Statistics
```

---

## Dependency Management Strategy

### No Dependency Injection
- Components do not use dependency injection
- Components do not inject services
- Components access local storage directly via browser APIs

### Component Instantiation
- Framework handles component instantiation (React, Vue, Angular)
- Parent components instantiate child components
- No manual component creation or lifecycle management

### Testing Strategy
- **Mock Local Storage**: Tests mock browser localStorage API
- **Mock External APIs**: Tests mock fetch/axios for ISBN API
- **Component Isolation**: Test components independently with mocked dependencies
- **Integration Tests**: Test parent-child communication with real components

---

## Summary

### Dependency Characteristics
- **Hierarchical**: Clear parent-child relationships
- **Unidirectional**: Props down, events up
- **Self-Contained**: Components manage own state and logic
- **Loosely Coupled**: Feature components independent of each other
- **Shared Data**: All components access same local storage structure

### Key Dependencies
1. **App → Feature Components**: Parent-child relationship
2. **Feature Components → Local Storage**: Direct data access
3. **BookFormComponent → ISBN API**: External API integration
4. **BookListComponent/SearchComponent → BookItemComponent**: Reusable child component

### No Dependencies
- ❌ No service layer dependencies
- ❌ No state management dependencies
- ❌ No shared business logic dependencies
- ❌ No cross-component direct dependencies
- ❌ No circular dependencies

This dependency structure supports the feature-based, self-contained component architecture chosen for the Reading List Tracker application.
