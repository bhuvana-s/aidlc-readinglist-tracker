# Logical Components - Unit 3: Enhanced Features

## Overview

This document defines the logical component structure for Unit 3 (Enhanced Features), including component hierarchy, utility modules, data flow, and integration points with Units 1 and 2.

---

## Component Architecture

### Architecture Diagram

```
App (Unit 1)
├── AuthComponent (Unit 2)
└── BookListComponent (Unit 2, extended in Unit 3)
    ├── BookFormModal (Unit 2, extended in Unit 3)
    │   ├── Manual Entry Mode
    │   ├── ISBN Lookup Mode (Unit 3)
    │   ├── JSON Import Mode (Unit 3)
    │   └── CSV Import Mode (Unit 3)
    └── BookItemComponent (Unit 2, extended in Unit 3)
        ├── Progress Bar (Unit 3)
        ├── Star Rating (Unit 1)
        └── Notes Display (Unit 3)
```

---

## Component Inventory

### Extended Components (from Unit 2)

#### 1. BookFormModal (Extended)

**Location**: `src/components/books/BookFormModal.jsx`

**Purpose**: Add book entry with multiple modes (manual, ISBN, import)

**New Responsibilities** (Unit 3):
- ISBN lookup mode
- JSON file import
- CSV file import
- Progress tracking fields
- Notes and ratings fields

**State**:
```javascript
{
  mode: 'manual' | 'isbn' | 'json' | 'csv',
  formData: {
    title: string,
    author: string,
    status: 'Reading' | 'Completed' | 'Wishlist',
    totalPages: number,
    currentPage: number,
    isbn: string | null,
    notes: string | null,
    rating: number | null,
    dateCompleted: string | null
  },
  isLoading: boolean,
  error: string | null,
  fieldErrors: { [fieldName]: string },
  isImporting: boolean,
  importResult: { message: string } | null
}
```

**New Methods** (Unit 3):
- `handleISBNLookup()` - Call ISBN API
- `handleFileSelect(event)` - Handle file input
- `processJSONImport(content)` - Parse and import JSON
- `processCSVImport(content)` - Parse and import CSV
- `validateISBN(isbn)` - Validate ISBN format
- `calculateProgress(currentPage, totalPages, status)` - Calculate progress percentage

**Props**:
- `isOpen: boolean` - Modal visibility
- `onClose: () => void` - Close handler
- `onSave: () => void` - Save success callback
- `editBook: Book | null` - Book to edit (null for new)
- `currentUser: User` - Current logged-in user

**Integration Points**:
- Uses Modal component from Unit 1
- Uses StarRating component from Unit 1
- Uses storage utility from Unit 2
- Calls Open Library API (external)

---

#### 2. BookItemComponent (Extended)

**Location**: `src/components/books/BookItemComponent.jsx`

**Purpose**: Display individual book with progress and ratings

**New Responsibilities** (Unit 3):
- Display progress bar for Reading status
- Display star rating
- Display notes preview
- Show completion date

**State**: None (stateless component)

**New Display Elements** (Unit 3):
- Progress bar with percentage
- Star rating display
- Notes preview (truncated)
- Completion date badge

**Props**:
- `book: Book` - Book object with all fields
- `onEdit: (book) => void` - Edit handler
- `onDelete: (book) => void` - Delete handler
- `onUpdateProgress: (bookId, currentPage) => void` - Progress update handler (Unit 3)

**Integration Points**:
- Uses StarRating component from Unit 1
- Displays data from extended Book entity

---

### New Utility Modules (Unit 3)

#### 3. ISBN Validator

**Location**: `src/utils/isbnValidator.js`

**Purpose**: Validate ISBN-10 and ISBN-13 format and checksum

**Functions**:
```javascript
/**
 * Validate ISBN (10 or 13 digits)
 * @param {string} isbn - ISBN to validate
 * @returns {boolean} - True if valid
 */
export function validateISBN(isbn) {
  const cleaned = stripISBN(isbn);
  if (cleaned.length === 10) return validateISBN10(cleaned);
  if (cleaned.length === 13) return validateISBN13(cleaned);
  return false;
}

/**
 * Validate ISBN-10 checksum
 * @param {string} isbn - 10-digit ISBN
 * @returns {boolean} - True if valid checksum
 */
export function validateISBN10(isbn) {
  // Implementation: ISBN-10 checksum algorithm
}

/**
 * Validate ISBN-13 checksum
 * @param {string} isbn - 13-digit ISBN
 * @returns {boolean} - True if valid checksum
 */
export function validateISBN13(isbn) {
  // Implementation: ISBN-13 checksum algorithm
}

/**
 * Strip hyphens and spaces from ISBN
 * @param {string} isbn - ISBN with formatting
 * @returns {string} - Clean ISBN digits only
 */
export function stripISBN(isbn) {
  return isbn.replace(/[-\s]/g, '');
}
```

**Dependencies**: None

**Used By**: BookFormModal

---

#### 4. Import Parser

**Location**: `src/utils/importParser.js`

**Purpose**: Parse and validate JSON/CSV import files

**Functions**:
```javascript
/**
 * Parse JSON import file
 * @param {string} jsonText - JSON file content
 * @returns {Array<Book>} - Array of book objects
 * @throws {Error} - If JSON is invalid
 */
export function parseJSON(jsonText) {
  const books = JSON.parse(jsonText);
  if (!Array.isArray(books)) {
    throw new Error('Invalid JSON format. Expected an array of books.');
  }
  return books;
}

/**
 * Parse CSV import file
 * @param {string} csvText - CSV file content
 * @returns {Array<Book>} - Array of book objects
 */
export function parseCSV(csvText) {
  const lines = csvText.split('\n');
  const header = lines[0]; // Skip header
  const rows = lines.slice(1);
  
  return rows
    .filter(row => row.trim())
    .map(row => {
      const columns = row.split(',');
      return {
        title: columns[0]?.trim(),
        author: columns[1]?.trim(),
        status: columns[2]?.trim() || 'Wishlist',
        totalPages: parseInt(columns[3]) || 0,
        currentPage: parseInt(columns[4]) || 0,
        isbn: columns[5]?.trim() || null,
        notes: columns[6]?.trim() || null,
        rating: parseFloat(columns[7]) || null,
        dateCompleted: columns[8]?.trim() || null
      };
    });
}

/**
 * Validate book object has required fields
 * @param {Object} book - Book object to validate
 * @returns {boolean} - True if valid
 */
export function validateBook(book) {
  return !!(book.title && book.author);
}

/**
 * Check if book is duplicate
 * @param {Object} newBook - Book to check
 * @param {Array<Book>} existingBooks - Existing books
 * @returns {boolean} - True if duplicate
 */
export function isDuplicate(newBook, existingBooks) {
  const normalizedTitle = newBook.title.toLowerCase().trim();
  const normalizedAuthor = newBook.author.toLowerCase().trim();
  
  return existingBooks.some(book =>
    book.title.toLowerCase().trim() === normalizedTitle &&
    book.author.toLowerCase().trim() === normalizedAuthor
  );
}
```

**Dependencies**: None

**Used By**: BookFormModal

---

#### 5. Progress Calculator

**Location**: `src/utils/progressCalculator.js` (optional - can be inline)

**Purpose**: Calculate reading progress percentage

**Functions**:
```javascript
/**
 * Calculate progress percentage
 * @param {number} currentPage - Current page number
 * @param {number} totalPages - Total pages in book
 * @param {string} status - Book status
 * @returns {number} - Progress percentage (0-100)
 */
export function calculateProgress(currentPage, totalPages, status) {
  if (status === 'Wishlist') return 0;
  if (status === 'Completed') return 100;
  if (totalPages === 0) return 0;
  
  const progress = (currentPage / totalPages) * 100;
  return Math.floor(Math.max(0, Math.min(100, progress)));
}

/**
 * Check if book should auto-complete
 * @param {number} progress - Current progress percentage
 * @param {string} status - Current book status
 * @returns {boolean} - True if should auto-complete
 */
export function shouldAutoComplete(progress, status) {
  return progress === 100 && status === 'Reading';
}
```

**Dependencies**: None

**Used By**: BookFormModal, BookItemComponent

---

## Data Flow

### ISBN Lookup Flow

```
User enters ISBN
    ↓
BookFormModal.handleISBNLookup()
    ↓
Validate ISBN (isbnValidator.validateISBN)
    ↓
Call Open Library API (fetch)
    ↓
Parse API response
    ↓
Update form fields (setFormData)
    ↓
User completes remaining fields
    ↓
Save book (storage.addBook)
    ↓
Refresh book list
```

---

### JSON Import Flow

```
User selects JSON file
    ↓
BookFormModal.handleFileSelect()
    ↓
FileReader reads file content
    ↓
BookFormModal.processJSONImport()
    ↓
Parse JSON (importParser.parseJSON)
    ↓
For each book:
    ├─ Validate (importParser.validateBook)
    ├─ Check duplicate (importParser.isDuplicate)
    ├─ Create book object
    └─ Save to storage (storage.addBook)
    ↓
Show import result summary
    ↓
Refresh book list
```

---

### CSV Import Flow

```
User selects CSV file
    ↓
BookFormModal.handleFileSelect()
    ↓
FileReader reads file content
    ↓
BookFormModal.processCSVImport()
    ↓
Parse CSV (importParser.parseCSV)
    ↓
For each row:
    ├─ Validate (importParser.validateBook)
    ├─ Check duplicate (importParser.isDuplicate)
    ├─ Create book object
    └─ Save to storage (storage.addBook)
    ↓
Show import result summary
    ↓
Refresh book list
```

---

### Progress Update Flow

```
User updates current page
    ↓
BookItemComponent triggers onUpdateProgress
    ↓
BookListComponent.handleUpdateProgress()
    ↓
Calculate new progress (progressCalculator.calculateProgress)
    ↓
Check auto-completion (progressCalculator.shouldAutoComplete)
    ↓
If 100%:
    ├─ Set status to "Completed"
    └─ Set dateCompleted to now
    ↓
Update book in storage (storage.updateBook)
    ↓
Refresh book list (loadBooks)
    ↓
BookItemComponent re-renders with new progress
```

---

## Integration Points

### With Unit 1 (UI Foundation)

**Components Used**:
- Modal component (for BookFormModal)
- StarRating component (for ratings display)
- Button components (for actions)
- Input components (for form fields)

**Design System**:
- Colors and typography
- Spacing and layout
- CSS Modules patterns

---

### With Unit 2 (Core Features)

**Components Extended**:
- BookFormModal (add modes and fields)
- BookItemComponent (add progress and ratings)
- BookListComponent (add progress update handler)

**Utilities Used**:
- storage.js (getBooks, addBook, updateBook)
- idGenerator.js (generateId for new books)
- validation.js (basic field validation)

**Data Model Extended**:
- Book entity with new fields (isbn, currentPage, progress, notes, rating, dateCompleted)

---

### With External APIs

**Open Library API**:
- **Endpoint**: `https://openlibrary.org/api/books`
- **Method**: GET
- **Parameters**: `bibkeys=ISBN:{isbn}&format=json&jscmd=data`
- **Response**: JSON with book data
- **Used By**: BookFormModal.handleISBNLookup()
- **Error Handling**: Try-catch with user-friendly messages

---

## Component Communication

### Parent-Child Communication

```
BookListComponent (Parent)
    ↓ Props
BookItemComponent (Child)
    ↑ Events (onEdit, onDelete, onUpdateProgress)
```

```
BookListComponent (Parent)
    ↓ Props
BookFormModal (Child)
    ↑ Events (onSave, onClose)
```

### Sibling Communication

Components communicate through parent (BookListComponent):
- BookFormModal saves → BookListComponent refreshes → BookItemComponent updates

No direct sibling communication needed.

---

## State Management

### Component State

**BookFormModal**:
- Form data (title, author, etc.)
- Mode (manual, ISBN, JSON, CSV)
- Loading states (isLoading, isImporting)
- Error states (error, fieldErrors, importError)
- Import result

**BookListComponent**:
- Books array (loaded from storage)
- Selected book for editing
- Modal visibility

**BookItemComponent**:
- No state (stateless, receives props)

### Global State

**Context (from Unit 2)**:
- AuthContext (currentUser)
- LoadingContext (global loading state)

**Local Storage (from Unit 2)**:
- Users array
- Books array
- Current user ID

---

## File Structure

```
src/
├── components/
│   ├── books/
│   │   ├── BookFormModal.jsx (extended)
│   │   ├── BookFormModal.module.css (extended)
│   │   ├── BookItemComponent.jsx (extended)
│   │   ├── BookItemComponent.module.css (extended)
│   │   └── BookListComponent.jsx (extended)
│   └── common/
│       └── StarRating.jsx (from Unit 1)
├── utils/
│   ├── isbnValidator.js (new)
│   ├── importParser.js (new)
│   ├── progressCalculator.js (new, optional)
│   ├── storage.js (from Unit 2)
│   ├── idGenerator.js (from Unit 2)
│   └── validation.js (from Unit 2)
└── __tests__/
    ├── isbnValidator.test.js (new)
    ├── importParser.test.js (new)
    └── progressCalculator.test.js (new)
```

---

## Component Lifecycle

### BookFormModal Lifecycle

1. **Mount**: Initialize form state, set mode to 'manual'
2. **Mode Switch**: User selects mode, update state
3. **ISBN Lookup**: User enters ISBN, validate, call API, populate form
4. **File Import**: User selects file, read file, parse, validate, import
5. **Form Submit**: Validate, save to storage, notify parent, close
6. **Unmount**: Clean up state

### BookItemComponent Lifecycle

1. **Mount**: Receive book prop, calculate progress
2. **Update**: Book prop changes, recalculate progress
3. **User Action**: User clicks edit/delete, trigger parent handler
4. **Unmount**: No cleanup needed

---

## Error Handling

### Component-Level Errors

Each component handles its own errors:
- BookFormModal: API errors, file errors, validation errors
- BookItemComponent: No error handling (stateless)
- BookListComponent: Storage errors

### Error Display

- Inline errors below fields
- Error messages in form
- Import result messages

### Error Recovery

- User can retry failed operations
- Clear errors on user input
- Provide recovery suggestions

---

## Performance Considerations

### Rendering Optimization

- No React.memo (not needed for target size)
- No useMemo for progress calculation (fast enough)
- No virtualization (100-500 books manageable)

### Data Loading

- Load all books on mount
- Refresh after save/delete/import
- No pagination (not needed yet)

### API Calls

- No caching (lookups infrequent)
- No retry logic (per NFR requirements)
- Simple loading state

---

## Testing Strategy

### Unit Tests

**isbnValidator.js**:
- Valid ISBN-10 and ISBN-13
- Invalid checksums
- Invalid formats
- Edge cases

**importParser.js**:
- Valid JSON/CSV parsing
- Invalid formats
- Missing required fields
- Duplicate detection

**progressCalculator.js**:
- Progress calculation
- Edge cases (0 pages, 100%)
- Status-based logic

### Component Tests

**BookFormModal**:
- Mode switching
- Form validation
- ISBN lookup (mock API)
- File import (mock FileReader)

**BookItemComponent**:
- Progress bar display
- Rating display
- Conditional rendering

---

## Deployment Considerations

### Build Output

- Extended components bundled with Unit 2 code
- New utilities added to bundle
- No code splitting (small size)

### Bundle Size Impact

- isbnValidator.js: ~2KB
- importParser.js: ~3KB
- progressCalculator.js: ~1KB
- Extended components: ~5KB
- **Total Unit 3 addition**: ~11KB

### Browser Compatibility

- FileReader API (all modern browsers)
- Fetch API (all modern browsers)
- No polyfills needed

---

## Summary

### Component Count
- **Extended**: 2 components (BookFormModal, BookItemComponent)
- **New Utilities**: 3 modules (isbnValidator, importParser, progressCalculator)
- **Total New Files**: 3 utility files + 3 test files

### Integration Points
- **Unit 1**: Modal, StarRating, design system
- **Unit 2**: Storage, components, data model
- **External**: Open Library API

### Data Flow
- **Simple**: Direct storage updates, component state
- **No Complexity**: No Redux, no complex state machines
- **Clear**: Parent-child communication, event handlers

### Architecture Principles
- **Extend, Don't Replace**: Build on Unit 2 components
- **Simple State**: Component state, no global state for Unit 3
- **Direct Integration**: Inline API calls, inline file reading
- **Minimal Abstraction**: Utility functions only where needed

This logical component structure supports all Unit 3 features while maintaining simplicity and integration with existing units.

