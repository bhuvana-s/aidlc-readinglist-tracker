# Unit 3: Enhanced Features - Implementation Guide

## Overview

This guide provides detailed instructions for completing the implementation of Unit 3 Enhanced Features. The utility modules have been created; this document guides you through extending the components and completing the integration.

---

## Completed Files

✅ **Utility Modules Created:**
- `src/utils/isbnValidator.js` - ISBN validation with checksum algorithms
- `src/utils/importParser.js` - JSON/CSV parsing and validation
- `src/utils/progressCalculator.js` - Progress calculation logic

---

## Files to Extend

### 1. BookFormModal Component

**File**: `src/components/books/BookFormModal.jsx`

**Current State**: Basic manual entry form from Unit 2

**Required Changes**:

#### A. Add Mode State
```javascript
const [mode, setMode] = useState('manual'); // 'manual', 'isbn', 'json', 'csv'
```

#### B. Extend Form State
```javascript
const [formData, setFormData] = useState({
  title: '',
  author: '',
  status: 'Wishlist',
  totalPages: 0,
  // NEW FIELDS:
  currentPage: 0,
  isbn: '',
  notes: '',
  rating: null,
  dateCompleted: null
});
```

#### C. Add Mode Selector UI
```jsx
<div className={styles.modeSelector}>
  <button 
    className={mode === 'manual' ? styles.active : ''}
    onClick={() => setMode('manual')}
  >
    Manual Entry
  </button>
  <button 
    className={mode === 'isbn' ? styles.active : ''}
    onClick={() => setMode('isbn')}
  >
    ISBN Lookup
  </button>
  <button 
    className={mode === 'json' ? styles.active : ''}
    onClick={() => setMode('json')}
  >
    Import JSON
  </button>
  <button 
    className={mode === 'csv' ? styles.active : ''}
    onClick={() => setMode('csv')}
  >
    Import CSV
  </button>
</div>
```

#### D. ISBN Lookup Implementation
```javascript
import { validateISBN } from '../../utils/isbnValidator';

const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState(null);

async function handleISBNLookup() {
  setError(null);
  setIsLoading(true);
  
  try {
    const isbn = formData.isbn.trim();
    
    // Validate ISBN
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
    
    // Auto-fill form fields
    setFormData({
      ...formData,
      title: bookData.title || '',
      author: bookData.authors?.[0]?.name || '',
      totalPages: bookData.number_of_pages || 0
    });
    
  } catch (err) {
    setError(err.message);
  } finally {
    setIsLoading(false);
  }
}
```

#### E. JSON Import Implementation
```javascript
import { parseJSON, validateBook, isDuplicate } from '../../utils/importParser';
import { generateId } from '../../utils/idGenerator';
import { calculateProgress } from '../../utils/progressCalculator';

const [isImporting, setIsImporting] = useState(false);
const [importResult, setImportResult] = useState(null);

function handleFileSelect(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  const isJSON = file.name.endsWith('.json');
  const isCSV = file.name.endsWith('.csv');
  
  if (!isJSON && !isCSV) {
    setError('Invalid file type. Please select a JSON or CSV file.');
    return;
  }
  
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

function processJSONImport(jsonText) {
  setIsImporting(true);
  setError(null);
  
  try {
    const books = parseJSON(jsonText);
    const existingBooks = storage.getBooks(currentUser.userId);
    
    let imported = 0;
    let skipped = 0;
    let failed = 0;
    
    books.forEach(book => {
      if (!validateBook(book)) {
        failed++;
        return;
      }
      
      if (isDuplicate(book, existingBooks)) {
        skipped++;
        return;
      }
      
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
        progress: calculateProgress(
          book.currentPage || 0,
          book.totalPages || 0,
          book.status || 'Wishlist'
        )
      };
      
      storage.addBook(newBook);
      imported++;
    });
    
    setImportResult({
      message: `Imported ${imported} of ${books.length} books, ${skipped} skipped (duplicates), ${failed} failed (invalid)`
    });
    
    onSave(); // Refresh parent
    
  } catch (err) {
    setError(err.message || 'Import failed. Please check file format.');
  } finally {
    setIsImporting(false);
  }
}
```

#### F. CSV Import Implementation
```javascript
import { parseCSV } from '../../utils/importParser';

function processCSVImport(csvText) {
  setIsImporting(true);
  setError(null);
  
  try {
    const books = parseCSV(csvText);
    const existingBooks = storage.getBooks(currentUser.userId);
    
    let imported = 0;
    let skipped = 0;
    let failed = 0;
    
    books.forEach(book => {
      if (!validateBook(book)) {
        failed++;
        return;
      }
      
      if (isDuplicate(book, existingBooks)) {
        skipped++;
        return;
      }
      
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
        progress: calculateProgress(
          book.currentPage || 0,
          book.totalPages || 0,
          book.status || 'Wishlist'
        )
      };
      
      storage.addBook(newBook);
      imported++;
    });
    
    setImportResult({
      message: `Imported ${imported} of ${books.length} books, ${skipped} skipped (duplicates), ${failed} failed (invalid)`
    });
    
    onSave(); // Refresh parent
    
  } catch (err) {
    setError(err.message || 'Import failed. Please check file format.');
  } finally {
    setIsImporting(false);
  }
}
```

#### G. Add Progress, Notes, and Rating Fields
```jsx
{/* Current Page Field */}
<div className={styles.formField}>
  <label htmlFor="currentPage">Current Page</label>
  <input
    type="number"
    id="currentPage"
    name="currentPage"
    value={formData.currentPage}
    onChange={handleInputChange}
    min="0"
    max={formData.totalPages}
  />
  {formData.totalPages > 0 && (
    <span className={styles.progressText}>
      Progress: {calculateProgress(formData.currentPage, formData.totalPages, formData.status)}%
    </span>
  )}
</div>

{/* Notes Field */}
<div className={styles.formField}>
  <label htmlFor="notes">Notes</label>
  <textarea
    id="notes"
    name="notes"
    value={formData.notes || ''}
    onChange={handleInputChange}
    maxLength={5000}
    rows={4}
    placeholder="Add your thoughts about this book..."
  />
  <span className={styles.charCount}>
    {(formData.notes || '').length} / 5000 characters
  </span>
</div>

{/* Rating Field */}
<div className={styles.formField}>
  <label>Rating</label>
  <StarRating
    value={formData.rating || 0}
    onChange={(rating) => setFormData({ ...formData, rating })}
    allowHalf={true}
  />
</div>
```

#### H. Auto-Completion Logic in Save Handler
```javascript
function handleSave() {
  // ... existing validation ...
  
  // Calculate progress
  const progress = calculateProgress(
    formData.currentPage,
    formData.totalPages,
    formData.status
  );
  
  // Check for auto-completion
  let finalStatus = formData.status;
  let finalDateCompleted = formData.dateCompleted;
  
  if (progress === 100 && formData.status === 'Reading') {
    finalStatus = 'Completed';
    finalDateCompleted = new Date().toISOString();
    // Show notification
    alert('Book marked as completed!');
  }
  
  const bookData = {
    ...formData,
    status: finalStatus,
    dateCompleted: finalDateCompleted,
    progress
  };
  
  // ... save to storage ...
}
```

---

### 2. BookItemComponent

**File**: `src/components/books/BookItemComponent.jsx`

**Required Changes**:

#### A. Import Progress Calculator
```javascript
import { calculateProgress } from '../../utils/progressCalculator';
import StarRating from '../common/StarRating';
```

#### B. Add Progress Bar Display
```jsx
function BookItemComponent({ book, onEdit, onDelete }) {
  const progress = calculateProgress(book.currentPage, book.totalPages, book.status);
  
  return (
    <div className={styles.bookItem}>
      {/* ... existing book info ... */}
      
      {/* Progress Bar for Reading status */}
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
      
      {/* Rating Display */}
      {book.rating && (
        <div className={styles.ratingSection}>
          <StarRating value={book.rating} readOnly />
          <span className={styles.ratingValue}>{book.rating.toFixed(1)}</span>
        </div>
      )}
      
      {/* Notes Preview */}
      {book.notes && (
        <div className={styles.notesPreview}>
          <p>{book.notes.substring(0, 100)}{book.notes.length > 100 ? '...' : ''}</p>
        </div>
      )}
      
      {/* ... existing actions ... */}
    </div>
  );
}
```

---

### 3. BookFormModal Styles

**File**: `src/components/books/BookFormModal.module.css`

**Add These Styles**:

```css
.modeSelector {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 10px;
}

.modeSelector button {
  padding: 8px 16px;
  border: none;
  background: transparent;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
}

.modeSelector button.active {
  border-bottom-color: #2196f3;
  color: #2196f3;
  font-weight: 600;
}

.progressText {
  display: block;
  margin-top: 4px;
  font-size: 14px;
  color: #666;
}

.charCount {
  display: block;
  margin-top: 4px;
  font-size: 12px;
  color: #999;
  text-align: right;
}

.errorMessage {
  background: #ffebee;
  color: #c62828;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 16px;
}

.importResult {
  background: #e8f5e9;
  color: #2e7d32;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 16px;
}
```

---

### 4. BookItemComponent Styles

**File**: `src/components/books/BookItemComponent.module.css`

**Add These Styles**:

```css
.progressSection {
  margin: 12px 0;
}

.progressBar {
  width: 100%;
  height: 20px;
  background-color: #e0e0e0;
  border-radius: 10px;
  position: relative;
  overflow: hidden;
}

.progressFill {
  height: 100%;
  background-color: #4caf50;
  border-radius: 10px;
  transition: width 0.3s ease;
}

.progressText {
  display: inline-block;
  margin-left: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.pageCount {
  display: inline-block;
  margin-left: 12px;
  font-size: 12px;
  color: #666;
}

.ratingSection {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 8px 0;
}

.ratingValue {
  font-size: 14px;
  color: #666;
}

.notesPreview {
  margin: 8px 0;
  padding: 8px;
  background: #f5f5f5;
  border-radius: 4px;
  font-size: 14px;
  color: #666;
  font-style: italic;
}

.notesPreview p {
  margin: 0;
  white-space: pre-wrap;
}
```

---

### 5. Storage Utility Migration

**File**: `src/utils/storage.js`

**Add Migration Function**:

```javascript
/**
 * Migrate existing books to include new Unit 3 fields
 */
export function migrateBooks() {
  const books = getBooks();
  
  const migratedBooks = books.map(book => {
    // Only add fields if they don't exist
    return {
      ...book,
      isbn: book.isbn ?? null,
      currentPage: book.currentPage ?? 0,
      progress: book.progress ?? (book.status === 'Completed' ? 100 : 0),
      notes: book.notes ?? null,
      rating: book.rating ?? null,
      dateCompleted: book.dateCompleted ?? null
    };
  });
  
  localStorage.setItem('books', JSON.stringify(migratedBooks));
}

// Call migration on app load (add to App.jsx useEffect)
```

---

## Testing

### Unit Tests to Create

1. **`src/utils/__tests__/isbnValidator.test.js`**
   - Test valid ISBN-10 and ISBN-13
   - Test invalid checksums
   - Test edge cases

2. **`src/utils/__tests__/importParser.test.js`**
   - Test JSON parsing
   - Test CSV parsing
   - Test validation and duplicate detection

3. **`src/utils/__tests__/progressCalculator.test.js`**
   - Test progress calculation
   - Test auto-completion logic

### Test Fixtures

Create sample files in `src/utils/__tests__/fixtures/`:

**sample-books.json**:
```json
[
  {
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "status": "Completed",
    "totalPages": 180,
    "rating": 4.5
  }
]
```

**sample-books.csv**:
```csv
title,author,status,totalPages,currentPage,isbn,notes,rating,dateCompleted
"1984","George Orwell","Reading",328,150,"9780451524935","Great book",4.0,
```

---

## Documentation Updates

### README.md

Add section:

```markdown
## Features

### ISBN Lookup
- Enter ISBN-10 or ISBN-13 to automatically fetch book details
- Validates ISBN checksum before API call
- Uses Open Library API

### Import Books
- **JSON Import**: Import books from JSON array format
- **CSV Import**: Import books from CSV with fixed column order
- Duplicate detection (same title + author)
- Lenient validation (skips invalid, imports valid)

### Progress Tracking
- Track current page and see progress percentage
- Visual progress bars for books in "Reading" status
- Auto-completion at 100% progress

### Notes & Ratings
- Add personal notes (up to 5000 characters)
- Rate books with 5-star system (half-star increments)
- Notes preserve line breaks
```

---

## Summary

**Created Files** (3):
- ✅ `src/utils/isbnValidator.js`
- ✅ `src/utils/importParser.js`
- ✅ `src/utils/progressCalculator.js`

**Files to Extend** (5):
- `src/components/books/BookFormModal.jsx` - Add 4 modes, new fields
- `src/components/books/BookFormModal.module.css` - Add mode selector, progress, notes styles
- `src/components/books/BookItemComponent.jsx` - Add progress bar, rating, notes display
- `src/components/books/BookItemComponent.module.css` - Add progress bar, rating styles
- `src/utils/storage.js` - Add migration function

**Tests to Create** (3):
- `src/utils/__tests__/isbnValidator.test.js`
- `src/utils/__tests__/importParser.test.js`
- `src/utils/__tests__/progressCalculator.test.js`

**Documentation to Update** (2):
- `README.md` - Add feature descriptions
- `TESTING.md` - Add testing instructions

---

## Next Steps

1. Extend BookFormModal with mode selector and ISBN lookup
2. Add JSON/CSV import handlers
3. Add progress, notes, and rating fields
4. Extend BookItemComponent with progress bar and rating display
5. Update styles for new UI elements
6. Add storage migration
7. Create unit tests
8. Update documentation

All business logic is in the utility modules. Component changes are primarily UI integration following the patterns established in Units 1 and 2.

