# NFR Design Patterns - Unit 3: Enhanced Features

## Overview

This document defines the design patterns used to implement non-functional requirements for Unit 3 (Enhanced Features). The patterns emphasize simplicity, directness, and maintainability, avoiding over-engineering while meeting all NFR requirements.

---

## Design Philosophy

### Simplicity First
- Prefer straightforward solutions over complex patterns
- Inline logic over abstraction layers when appropriate
- Direct state updates over event-driven architectures
- Component-level patterns over application-wide frameworks

### Rationale
- Small to medium-sized application (100-500 books)
- Client-side only (no backend complexity)
- Single developer or small team
- Maintainability over scalability

---

## Error Handling Patterns

### Pattern 1: Component-Level Error Handling

**Pattern**: Try-catch blocks in component event handlers

**Implementation**:
```jsx
// BookFormModal.jsx
async function handleISBNLookup() {
  setError(null);
  setIsLoading(true);
  
  try {
    const isbn = formData.isbn.trim();
    
    // Validate ISBN
    if (!validateISBN(isbn)) {
      throw new Error('Invalid ISBN format');
    }
    
    // Call API
    const response = await fetch(`https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`);
    if (!response.ok) {
      throw new Error('API request failed');
    }
    
    const data = await response.json();
    const bookData = data[`ISBN:${isbn}`];
    
    if (!bookData) {
      throw new Error('ISBN not found in database');
    }
    
    // Update form with API data
    setFormData({
      ...formData,
      title: bookData.title || '',
      author: bookData.authors?.[0]?.name || '',
      totalPages: bookData.number_of_pages || 0
    });
    
  } catch (error) {
    setError(error.message || 'Unable to lookup ISBN. Please try manual entry.');
  } finally {
    setIsLoading(false);
  }
}
```

**Benefits**:
- Simple and direct
- Error context preserved
- Easy to debug
- No additional libraries

**Trade-offs**:
- Repetitive error handling code
- No centralized error logging
- Each component handles own errors

---

### Pattern 2: Simple Error State

**Pattern**: Component state for error messages

**Implementation**:
```jsx
// BookFormModal.jsx
const [error, setError] = useState(null);

// Display error
{error && (
  <div className={styles.errorMessage}>
    {error}
  </div>
)}

// Clear error on user action
function handleInputChange(e) {
  setError(null); // Clear error when user starts typing
  setFormData({ ...formData, [e.target.name]: e.target.value });
}
```

**Benefits**:
- Simple state management
- Inline error display
- Easy to clear errors
- No toast library needed

**Trade-offs**:
- Errors not persistent across navigation
- No error history
- Manual error clearing

---

## Validation Patterns

### Pattern 3: Validation on Blur

**Pattern**: Validate fields when user leaves the field

**Implementation**:
```jsx
// BookFormModal.jsx
const [fieldErrors, setFieldErrors] = useState({});

function handleBlur(fieldName) {
  const errors = { ...fieldErrors };
  
  switch (fieldName) {
    case 'title':
      if (!formData.title.trim()) {
        errors.title = 'Title is required';
      } else {
        delete errors.title;
      }
      break;
      
    case 'author':
      if (!formData.author.trim()) {
        errors.author = 'Author is required';
      } else {
        delete errors.author;
      }
      break;
      
    case 'totalPages':
      if (formData.totalPages <= 0) {
        errors.totalPages = 'Total pages must be greater than 0';
      } else {
        delete errors.totalPages;
      }
      break;
      
    case 'currentPage':
      if (formData.currentPage < 0 || formData.currentPage > formData.totalPages) {
        errors.currentPage = `Page must be between 0 and ${formData.totalPages}`;
      } else {
        delete errors.currentPage;
      }
      break;
  }
  
  setFieldErrors(errors);
}

// In JSX
<input
  name="title"
  value={formData.title}
  onChange={handleInputChange}
  onBlur={() => handleBlur('title')}
/>
{fieldErrors.title && <span className={styles.fieldError}>{fieldErrors.title}</span>}
```

**Benefits**:
- Non-intrusive (doesn't validate while typing)
- Immediate feedback after field completion
- Clear per-field error messages

**Trade-offs**:
- Errors only show after blur
- User must leave field to see error
- No real-time validation

---

### Pattern 4: Inline Validation Errors

**Pattern**: Display errors below each field

**Implementation**:
```jsx
// BookFormModal.jsx
<div className={styles.formField}>
  <label htmlFor="title">Title *</label>
  <input
    id="title"
    name="title"
    value={formData.title}
    onChange={handleInputChange}
    onBlur={() => handleBlur('title')}
    className={fieldErrors.title ? styles.inputError : ''}
  />
  {fieldErrors.title && (
    <span className={styles.fieldError}>{fieldErrors.title}</span>
  )}
</div>
```

```css
/* BookFormModal.module.css */
.fieldError {
  color: #d32f2f;
  font-size: 12px;
  margin-top: 4px;
  display: block;
}

.inputError {
  border-color: #d32f2f;
}
```

**Benefits**:
- Clear association between field and error
- Visual feedback (red border + message)
- Accessible (screen readers can announce)

**Trade-offs**:
- Takes up vertical space
- May push content down
- No error summary

---

## State Management Patterns

### Pattern 5: Single State Object for Form

**Pattern**: One useState with object containing all form data

**Implementation**:
```jsx
// BookFormModal.jsx
const [formData, setFormData] = useState({
  mode: 'manual', // 'manual', 'isbn', 'json', 'csv'
  title: '',
  author: '',
  status: 'Wishlist',
  totalPages: 0,
  currentPage: 0,
  isbn: '',
  notes: '',
  rating: null,
  dateCompleted: null
});

function handleInputChange(e) {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value
  });
}

function switchMode(newMode) {
  setFormData({
    ...formData,
    mode: newMode
  });
}
```

**Benefits**:
- Single source of truth
- Easy to reset form
- Simple state updates
- All form data in one place

**Trade-offs**:
- Re-renders entire form on any change
- Larger state object
- Need to spread entire object on update

---

### Pattern 6: Simple Boolean Flags for Import State

**Pattern**: Separate boolean states for loading and error

**Implementation**:
```jsx
// BookFormModal.jsx
const [isImporting, setIsImporting] = useState(false);
const [importError, setImportError] = useState(null);
const [importResult, setImportResult] = useState(null);

async function handleFileImport(file) {
  setIsImporting(true);
  setImportError(null);
  setImportResult(null);
  
  try {
    const result = await processImport(file);
    setImportResult(result);
  } catch (error) {
    setImportError(error.message);
  } finally {
    setIsImporting(false);
  }
}

// Display
{isImporting && <div>Importing books...</div>}
{importError && <div className={styles.error}>{importError}</div>}
{importResult && <div className={styles.success}>{importResult.message}</div>}
```

**Benefits**:
- Simple and clear
- Easy to understand state
- No complex state machine
- Straightforward conditionals

**Trade-offs**:
- Multiple state variables
- Manual state coordination
- No enforced state transitions

---

## API Integration Patterns

### Pattern 7: Inline API Calls

**Pattern**: Fetch directly in component event handler

**Implementation**:
```jsx
// BookFormModal.jsx
async function handleISBNLookup() {
  setIsLoading(true);
  setError(null);
  
  try {
    const isbn = formData.isbn.trim();
    
    // Validate ISBN before API call
    if (!validateISBN(isbn)) {
      throw new Error('Invalid ISBN format. Please enter a valid 10 or 13 digit ISBN.');
    }
    
    // Call Open Library API
    const url = `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Unable to lookup ISBN. Please try manual entry.');
    }
    
    const data = await response.json();
    const bookKey = `ISBN:${isbn}`;
    const bookData = data[bookKey];
    
    if (!bookData) {
      throw new Error('ISBN not found in database. Please try manual entry.');
    }
    
    // Extract and populate form fields
    setFormData({
      ...formData,
      title: bookData.title || '',
      author: bookData.authors?.[0]?.name || '',
      totalPages: bookData.number_of_pages || 0
    });
    
  } catch (error) {
    setError(error.message);
  } finally {
    setIsLoading(false);
  }
}
```

**Benefits**:
- No abstraction overhead
- Clear data flow
- Easy to debug
- No custom hooks needed

**Trade-offs**:
- Not reusable across components
- Harder to test in isolation
- No request caching
- No request cancellation

---

### Pattern 8: Boolean Loading Flag

**Pattern**: Simple isLoading state

**Implementation**:
```jsx
// BookFormModal.jsx
const [isLoading, setIsLoading] = useState(false);

// During API call
setIsLoading(true);
try {
  // ... API call
} finally {
  setIsLoading(false);
}

// Display
<button onClick={handleISBNLookup} disabled={isLoading}>
  {isLoading ? 'Looking up...' : 'Lookup ISBN'}
</button>
```

**Benefits**:
- Simple and clear
- Easy to disable buttons
- Straightforward loading UI
- No complex state tracking

**Trade-offs**:
- No distinction between different loading states
- No progress indication
- Binary (loading or not)

---

## File Processing Patterns

### Pattern 9: Inline FileReader

**Pattern**: FileReader directly in event handler

**Implementation**:
```jsx
// BookFormModal.jsx
function handleFileSelect(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  // Validate file type
  const isJSON = file.name.endsWith('.json');
  const isCSV = file.name.endsWith('.csv');
  
  if (!isJSON && !isCSV) {
    setError('Invalid file type. Please select a JSON or CSV file.');
    return;
  }
  
  // Read file
  const reader = new FileReader();
  
  reader.onload = (e) => {
    const content = e.target.result;
    
    if (isJSON) {
      processJSONImport(content);
    } else if (isCSV) {
      processCSVImport(content);
    }
  };
  
  reader.onerror = () => {
    setError('Failed to read file. Please try again.');
  };
  
  reader.readAsText(file);
}
```

**Benefits**:
- Direct and simple
- No abstraction needed
- Clear file reading flow
- Easy to understand

**Trade-offs**:
- Not reusable
- Callback-based (not Promise)
- No progress tracking
- Harder to test

---

### Pattern 10: Single Import Processing Function

**Pattern**: One function handles parse, validate, dedupe, and import

**Implementation**:
```jsx
// BookFormModal.jsx
function processJSONImport(jsonText) {
  setIsImporting(true);
  setImportError(null);
  
  try {
    // Parse JSON
    const books = JSON.parse(jsonText);
    
    if (!Array.isArray(books)) {
      throw new Error('Invalid JSON format. Expected an array of books.');
    }
    
    // Get existing books
    const existingBooks = storage.getBooks(currentUser.userId);
    
    let imported = 0;
    let skipped = 0;
    let failed = 0;
    
    // Process each book
    books.forEach(book => {
      // Validate required fields
      if (!book.title || !book.author) {
        failed++;
        return;
      }
      
      // Check for duplicates
      const isDuplicate = existingBooks.some(existing =>
        existing.title.toLowerCase() === book.title.toLowerCase() &&
        existing.author.toLowerCase() === book.author.toLowerCase()
      );
      
      if (isDuplicate) {
        skipped++;
        return;
      }
      
      // Create book object
      const newBook = {
        bookId: generateId(),
        userId: currentUser.userId,
        title: book.title,
        author: book.author,
        status: book.status || 'Wishlist',
        totalPages: book.totalPages || 0,
        currentPage: book.currentPage || 0,
        isbn: book.isbn || null,
        notes: book.notes || null,
        rating: book.rating || null,
        dateAdded: new Date().toISOString(),
        dateCompleted: book.dateCompleted || null,
        progress: calculateProgress(book.currentPage || 0, book.totalPages || 0, book.status || 'Wishlist')
      };
      
      // Save book
      storage.addBook(newBook);
      imported++;
    });
    
    // Show result
    setImportResult({
      message: `Imported ${imported} of ${books.length} books, ${skipped} skipped (duplicates), ${failed} failed (invalid)`
    });
    
    // Refresh book list
    onImportComplete();
    
  } catch (error) {
    setImportError(error.message || 'Import failed. Please check file format.');
  } finally {
    setIsImporting(false);
  }
}
```

**Benefits**:
- All logic in one place
- Easy to follow flow
- No complex pipeline
- Simple to debug

**Trade-offs**:
- Long function
- Not easily testable
- Hard to reuse parts
- Mixes concerns

---

## Performance Optimization Patterns

### Pattern 11: No Optimization for Progress Calculation

**Pattern**: Calculate progress on every render

**Implementation**:
```jsx
// BookItemComponent.jsx
function BookItemComponent({ book }) {
  // Calculate progress on render
  const progress = calculateProgress(book.currentPage, book.totalPages, book.status);
  
  return (
    <div className={styles.bookItem}>
      {/* ... book details ... */}
      {book.status === 'Reading' && (
        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill} 
            style={{ width: `${progress}%` }}
          />
          <span className={styles.progressText}>{progress}%</span>
        </div>
      )}
    </div>
  );
}

function calculateProgress(currentPage, totalPages, status) {
  if (status === 'Wishlist') return 0;
  if (status === 'Completed') return 100;
  if (totalPages === 0) return 0;
  return Math.floor((currentPage / totalPages) * 100);
}
```

**Rationale**:
- Calculation is very fast (< 1ms)
- Simple formula
- No caching complexity needed
- Acceptable for 100-500 books

**Benefits**:
- Simple implementation
- Always up-to-date
- No stale data
- No cache invalidation

**Trade-offs**:
- Recalculates on every render
- Slightly inefficient
- Could use useMemo if needed later

---

### Pattern 12: No Optimization for List Rendering

**Pattern**: Render all books without virtualization

**Implementation**:
```jsx
// BookListComponent.jsx
function BookListComponent({ books }) {
  return (
    <div className={styles.bookList}>
      {books.map(book => (
        <BookItemComponent key={book.bookId} book={book} />
      ))}
    </div>
  );
}
```

**Rationale**:
- Target: 100-500 books
- Modern browsers handle this well
- Simple implementation
- No virtualization library needed

**Benefits**:
- Simple code
- No library dependencies
- Easy to understand
- Works for target size

**Trade-offs**:
- May lag with > 500 books
- Renders all items
- No lazy loading
- Could add pagination later if needed

---

## Component Structure Patterns

### Pattern 13: Conditional Rendering for Modes

**Pattern**: Show/hide sections based on mode state

**Implementation**:
```jsx
// BookFormModal.jsx
function BookFormModal({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    mode: 'manual', // 'manual', 'isbn', 'json', 'csv'
    // ... other fields
  });
  
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.modeSelector}>
        <button onClick={() => setFormData({ ...formData, mode: 'manual' })}>
          Manual Entry
        </button>
        <button onClick={() => setFormData({ ...formData, mode: 'isbn' })}>
          ISBN Lookup
        </button>
        <button onClick={() => setFormData({ ...formData, mode: 'json' })}>
          Import JSON
        </button>
        <button onClick={() => setFormData({ ...formData, mode: 'csv' })}>
          Import CSV
        </button>
      </div>
      
      {formData.mode === 'manual' && (
        <div className={styles.manualForm}>
          {/* Manual entry fields */}
        </div>
      )}
      
      {formData.mode === 'isbn' && (
        <div className={styles.isbnForm}>
          {/* ISBN lookup fields */}
        </div>
      )}
      
      {formData.mode === 'json' && (
        <div className={styles.importForm}>
          {/* JSON import UI */}
        </div>
      )}
      
      {formData.mode === 'csv' && (
        <div className={styles.importForm}>
          {/* CSV import UI */}
        </div>
      )}
    </Modal>
  );
}
```

**Benefits**:
- Simple mode switching
- Clear separation of modes
- Easy to add new modes
- No complex routing

**Trade-offs**:
- All modes in one component
- Component can get large
- All mode code loaded
- No code splitting

---

### Pattern 14: Inline Progress Bar

**Pattern**: Progress bar directly in BookItemComponent

**Implementation**:
```jsx
// BookItemComponent.jsx
function BookItemComponent({ book, onEdit, onDelete }) {
  const progress = calculateProgress(book.currentPage, book.totalPages, book.status);
  
  return (
    <div className={styles.bookItem}>
      <div className={styles.bookInfo}>
        <h3>{book.title}</h3>
        <p>{book.author}</p>
        <span className={styles.status}>{book.status}</span>
      </div>
      
      {book.status === 'Reading' && (
        <div className={styles.progressSection}>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill} 
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className={styles.progressText}>{progress}%</span>
          <span className={styles.pageCount}>
            {book.currentPage} / {book.totalPages} pages
          </span>
        </div>
      )}
      
      {book.rating && (
        <div className={styles.rating}>
          <StarRating value={book.rating} readOnly />
        </div>
      )}
      
      <div className={styles.actions}>
        <button onClick={() => onEdit(book)}>Edit</button>
        <button onClick={() => onDelete(book)}>Delete</button>
      </div>
    </div>
  );
}
```

**Benefits**:
- Self-contained component
- No prop drilling
- Clear visual hierarchy
- Easy to style

**Trade-offs**:
- Progress bar not reusable
- Duplicated if needed elsewhere
- Component slightly larger

---

## Data Flow Patterns

### Pattern 15: Direct Storage Update

**Pattern**: Write to localStorage immediately, then update UI

**Implementation**:
```jsx
// BookFormModal.jsx
function handleSave() {
  try {
    // Validate
    if (!formData.title || !formData.author) {
      setError('Title and author are required');
      return;
    }
    
    // Create book object
    const newBook = {
      bookId: generateId(),
      userId: currentUser.userId,
      title: formData.title,
      author: formData.author,
      status: formData.status,
      totalPages: formData.totalPages,
      currentPage: formData.currentPage,
      isbn: formData.isbn || null,
      notes: formData.notes || null,
      rating: formData.rating || null,
      dateAdded: new Date().toISOString(),
      dateCompleted: formData.dateCompleted || null,
      progress: calculateProgress(formData.currentPage, formData.totalPages, formData.status)
    };
    
    // Save to storage
    storage.addBook(newBook);
    
    // Notify parent to refresh
    onSave();
    
    // Close modal
    onClose();
    
  } catch (error) {
    setError('Failed to save book. Please try again.');
  }
}
```

**Benefits**:
- Simple and direct
- Data persisted immediately
- No sync issues
- Clear data flow

**Trade-offs**:
- No optimistic updates
- UI waits for storage
- No undo capability
- Storage errors affect UI

---

### Pattern 16: Direct Update Pattern

**Pattern**: Update storage, then trigger re-render

**Implementation**:
```jsx
// BookListComponent.jsx
function BookListComponent() {
  const [books, setBooks] = useState([]);
  
  useEffect(() => {
    loadBooks();
  }, []);
  
  function loadBooks() {
    const userBooks = storage.getBooks(currentUser.userId);
    setBooks(userBooks);
  }
  
  function handleUpdateProgress(bookId, newCurrentPage) {
    try {
      // Get book
      const book = books.find(b => b.bookId === bookId);
      
      // Update progress
      const updatedBook = {
        ...book,
        currentPage: newCurrentPage,
        progress: calculateProgress(newCurrentPage, book.totalPages, book.status)
      };
      
      // Check for auto-completion
      if (updatedBook.progress === 100 && book.status === 'Reading') {
        updatedBook.status = 'Completed';
        updatedBook.dateCompleted = new Date().toISOString();
      }
      
      // Save to storage
      storage.updateBook(updatedBook);
      
      // Reload books to refresh UI
      loadBooks();
      
    } catch (error) {
      console.error('Failed to update progress:', error);
    }
  }
  
  return (
    <div className={styles.bookList}>
      {books.map(book => (
        <BookItemComponent 
          key={book.bookId} 
          book={book}
          onUpdateProgress={handleUpdateProgress}
        />
      ))}
    </div>
  );
}
```

**Benefits**:
- Simple data flow
- Storage is source of truth
- No state synchronization issues
- Easy to understand

**Trade-offs**:
- Full re-render on update
- No optimistic updates
- Slightly slower UI response
- Could optimize with state updates first

---

## Pattern Summary

### Chosen Patterns Overview

| Category | Pattern | Complexity | Rationale |
|----------|---------|------------|-----------|
| Error Handling | Component-level try-catch | Low | Simple, direct, sufficient |
| Error Display | Simple error state | Low | Inline display, no library |
| Validation | On blur | Low | Non-intrusive, clear feedback |
| Validation Display | Inline errors | Low | Clear field association |
| Form State | Single state object | Low | Single source of truth |
| Import State | Boolean flags | Low | Simple, clear states |
| API Calls | Inline fetch | Low | Direct, no abstraction |
| Loading State | Boolean flag | Low | Simple, sufficient |
| File Reading | Inline FileReader | Low | Direct, no wrapper |
| Import Processing | Single function | Low | All logic together |
| Progress Calc | No optimization | Low | Fast enough as-is |
| List Rendering | No optimization | Low | Handles target size |
| Mode Switching | Conditional rendering | Low | Simple, clear |
| Progress Display | Inline component | Low | Self-contained |
| Import Flow | Direct storage | Low | Simple, direct |
| Update Flow | Direct update | Low | Storage as source |

### Design Principles Applied

1. **KISS (Keep It Simple, Stupid)**: Choose simplest solution that works
2. **YAGNI (You Aren't Gonna Need It)**: Don't add complexity for future needs
3. **Direct Over Abstract**: Prefer direct code over abstraction layers
4. **Inline Over Modular**: Keep related code together when appropriate
5. **Simple Over Clever**: Readable code over clever optimizations

### When to Refactor

Consider refactoring to more complex patterns if:
- Book collections exceed 500 books (add virtualization)
- Performance becomes noticeable issue (add memoization)
- Code duplication becomes maintenance burden (extract utilities)
- Testing becomes difficult (add abstraction layers)
- Team grows and needs more structure (add patterns)

---

## Summary

Unit 3 NFR design patterns prioritize simplicity and directness:
- **Zero abstractions**: No custom hooks, no service layers, no complex state machines
- **Inline logic**: API calls, file reading, and processing in components
- **Simple state**: Boolean flags and single state objects
- **Direct updates**: Storage writes followed by UI refresh
- **No optimization**: Calculate on render, render all items

This approach is appropriate for the application's scale (100-500 books) and complexity (client-side SPA). The patterns can be evolved to more sophisticated solutions if requirements change.

