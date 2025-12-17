# NFR Design Patterns - Unit 4: Analytics & Utilities

## Overview
This document defines the design patterns and implementation approaches for Unit 4: Analytics & Utilities, covering statistics calculation, search functionality, and data export.

---

## Pattern Category 1: Component Architecture Patterns

### Pattern 1.1: Statistics Component - Single Component with Inline Logic

**Pattern**: Single component with all statistics calculated and displayed inline.

**Structure**:
```
StatisticsComponent
├── State: statistics object (useState)
├── Methods: handleRefresh (inline)
├── Render: All statistics sections inline
└── Styling: StatisticsComponent.module.css
```

**Implementation**:
```javascript
// StatisticsComponent.jsx
import { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { calculateStatistics } from '../../utils/statisticsCalculator';
import styles from './StatisticsComponent.module.css';

function StatisticsComponent({ onExport }) {
  const { currentUser } = useContext(AuthContext);
  const [statistics, setStatistics] = useState(null);
  const [error, setError] = useState(null);

  const handleRefresh = () => {
    try {
      const stats = calculateStatistics(currentUser.userId);
      setStatistics(stats);
      setError(null);
    } catch (err) {
      setError('Failed to calculate statistics');
      setStatistics(null);
    }
  };

  // Render all statistics inline
  return (
    <div className={styles.container}>
      <button onClick={handleRefresh}>Refresh Statistics</button>
      <button onClick={onExport}>Export</button>
      
      {error && <div className={styles.error}>{error}</div>}
      
      {statistics && (
        <>
          {/* Status counts */}
          <section className={styles.statusSection}>
            <h3>Books by Status</h3>
            <div>Reading: {statistics.booksByStatus.reading} ({statistics.booksByStatusPercentage.reading}%)</div>
            <div>Completed: {statistics.booksByStatus.completed} ({statistics.booksByStatusPercentage.completed}%)</div>
            <div>Wishlist: {statistics.booksByStatus.wishlist} ({statistics.booksByStatusPercentage.wishlist}%)</div>
            <div>Total: {statistics.totalBooks}</div>
          </section>

          {/* Monthly stats */}
          <section className={styles.monthlySection}>
            <h3>Books Added Per Month</h3>
            {statistics.booksAddedPerMonth.map(item => (
              <div key={item.month}>{item.month}: {item.count}</div>
            ))}
          </section>

          <section className={styles.monthlySection}>
            <h3>Books Completed Per Month</h3>
            {statistics.booksCompletedPerMonth.map(item => (
              <div key={item.month}>{item.month}: {item.count}</div>
            ))}
          </section>

          {/* Reading pace */}
          <section className={styles.paceSection}>
            <h3>Reading Pace</h3>
            {statistics.readingPace.pagesPerDay ? (
              <div>{statistics.readingPace.pagesPerDay} pages/day (based on {statistics.readingPace.bookCount} books)</div>
            ) : (
              <div>No pace data available</div>
            )}
            {statistics.readingPace.warnings.length > 0 && (
              <div className={styles.warnings}>
                {statistics.readingPace.warnings.map((warning, i) => (
                  <div key={i}>{warning}</div>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
```

**Rationale**:
- Simple, straightforward implementation
- All logic in one place
- Easy to understand and maintain
- No unnecessary abstraction

---

### Pattern 1.2: Search Component - Separate Component with Local State

**Pattern**: Separate SearchComponent with its own state and logic.

**Structure**:
```
SearchComponent
├── Props: onSearchResults (callback)
├── State: query (useState), matchingIds (useState)
├── Methods: handleSearch (inline), handleClear (inline)
├── Render: Search input + buttons
└── Styling: SearchComponent.module.css
```

**Implementation**:
```javascript
// SearchComponent.jsx
import { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { getBooks } from '../../utils/storage';
import styles from './SearchComponent.module.css';

function SearchComponent({ onSearchResults }) {
  const { currentUser } = useContext(AuthContext);
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    const books = getBooks(currentUser.userId);
    const normalizedQuery = query.trim().toLowerCase();
    
    if (normalizedQuery === '') {
      onSearchResults(null); // Show all books
      return;
    }

    const matchingIds = books
      .filter(book => {
        const title = (book.title || '').toLowerCase();
        const author = (book.author || '').toLowerCase();
        return title.includes(normalizedQuery) || author.includes(normalizedQuery);
      })
      .map(book => book.bookId);

    onSearchResults(matchingIds);
  };

  const handleClear = () => {
    setQuery('');
    onSearchResults(null); // Show all books
  };

  return (
    <div className={styles.container}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by title or author..."
        className={styles.input}
      />
      <button onClick={handleSearch} className={styles.searchButton}>
        Search
      </button>
      <button onClick={handleClear} className={styles.clearButton}>
        Clear
      </button>
    </div>
  );
}
```

**Rationale**:
- Modular, reusable component
- Encapsulates search logic
- Clean separation of concerns
- Easy to test independently

---

### Pattern 1.3: Export Functionality - Button with Inline Logic

**Pattern**: Export button in StatisticsComponent, logic in BookListComponent.

**Implementation**:
```javascript
// In BookListComponent
const handleExport = () => {
  try {
    const books = getBooks(currentUser.userId);
    
    if (books.length === 0) {
      alert('No books to export');
      return;
    }

    // Show preview modal
    setExportPreview({
      books: books.slice(0, 5),
      totalCount: books.length
    });
    setShowExportModal(true);
  } catch (err) {
    alert('Export failed. Please try again.');
  }
};

const confirmExport = () => {
  try {
    const books = getBooks(currentUser.userId);
    const jsonString = JSON.stringify(books, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Generate filename
    const timestamp = new Date().toISOString().replace(/:/g, '-').replace(/\..+/, '');
    const sanitizedEmail = currentUser.email.replace(/@/g, '-').replace(/\./g, '-');
    const filename = `reading-list-${sanitizedEmail}-${timestamp}.json`;
    
    // Trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    
    URL.revokeObjectURL(url);
    setShowExportModal(false);
    alert(`Export complete: ${books.length} books exported`);
  } catch (err) {
    alert('Export failed. Please copy the data manually.');
  }
};

// In render
<StatisticsComponent onExport={handleExport} />

{showExportModal && (
  <Modal onClose={() => setShowExportModal(false)}>
    <h2>Export Preview</h2>
    <p>Total books: {exportPreview.totalCount}</p>
    <h3>First 5 books:</h3>
    <ul>
      {exportPreview.books.map(book => (
        <li key={book.bookId}>
          {book.title} by {book.author} ({book.status})
        </li>
      ))}
    </ul>
    <button onClick={confirmExport}>Confirm Export</button>
    <button onClick={() => setShowExportModal(false)}>Cancel</button>
  </Modal>
)}
```

**Rationale**:
- Export logic close to data source (BookListComponent)
- Reuses existing Modal component
- Simple inline implementation
- No separate export component needed

---

## Pattern Category 2: State Management Patterns

### Pattern 2.1: Statistics State - Single useState Object

**Pattern**: Single useState hook with statistics object.

**Implementation**:
```javascript
const [statistics, setStatistics] = useState(null);

// Statistics object structure
{
  totalBooks: 25,
  booksByStatus: { reading: 5, completed: 12, wishlist: 8 },
  booksByStatusPercentage: { reading: 20, completed: 48, wishlist: 32 },
  booksAddedPerMonth: [{ month: "Dec 2025", count: 3 }, ...],
  booksCompletedPerMonth: [{ month: "Nov 2025", count: 2 }, ...],
  readingPace: { pagesPerDay: 42.5, bookCount: 10, warnings: [] },
  lastCalculated: "2025-12-17T12:00:00Z"
}
```

**Rationale**:
- Single state update for all statistics
- Atomic updates (all or nothing)
- Easy to pass to child components if needed

---

### Pattern 2.2: Search State - Query in Component, Results via Callback

**Pattern**: Search query in SearchComponent state, results passed to parent via callback.

**Implementation**:
```javascript
// In SearchComponent
const [query, setQuery] = useState('');

const handleSearch = () => {
  const matchingIds = /* search logic */;
  onSearchResults(matchingIds); // Pass to parent
};

// In BookListComponent
const [searchResults, setSearchResults] = useState(null);

<SearchComponent onSearchResults={setSearchResults} />

// Use searchResults to filter displayed books
const displayedBooks = searchResults 
  ? books.filter(book => searchResults.includes(book.bookId))
  : books;
```

**Rationale**:
- Search component owns query state
- Parent component owns results state
- Clear data flow (child → parent via callback)

---

## Pattern Category 3: Data Access Patterns

### Pattern 3.1: Direct localStorage Access

**Pattern**: Components directly access localStorage via storage utility.

**Implementation**:
```javascript
import { getBooks } from '../../utils/storage';

// In component
const books = getBooks(currentUser.userId);
```

**Rationale**:
- Simple, direct access
- No prop drilling
- Consistent with Units 2-3

---

### Pattern 3.2: AuthContext for User Data

**Pattern**: Use existing AuthContext for current user info.

**Implementation**:
```javascript
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

function MyComponent() {
  const { currentUser } = useContext(AuthContext);
  // Use currentUser.userId, currentUser.email
}
```

**Rationale**:
- Reuses existing context from Unit 2
- No prop drilling for user data
- Consistent with Units 2-3

---

## Pattern Category 4: Error Handling Patterns

### Pattern 4.1: Try-Catch with UI Error Display

**Pattern**: Try-catch in component, display error in UI.

**Implementation**:
```javascript
const [error, setError] = useState(null);

const handleOperation = () => {
  try {
    // Operation logic
    setError(null);
  } catch (err) {
    setError('Operation failed. Please try again.');
  }
};

// In render
{error && <div className={styles.error}>{error}</div>}
```

**Rationale**:
- User-friendly error messages
- Errors don't crash app
- Clear feedback

---

### Pattern 4.2: Alert for Export Errors

**Pattern**: Use alert() for export errors with manual instructions.

**Implementation**:
```javascript
try {
  // Export logic
} catch (err) {
  alert('Export failed. Please try again or contact support.');
}
```

**Rationale**:
- Simple, immediate feedback
- Blocks user until acknowledged
- Appropriate for infrequent operations

---

## Pattern Category 5: Utility Function Patterns

### Pattern 5.1: Statistics Calculator Utility

**Pattern**: Separate utility file for statistics calculations.

**File**: `src/utils/statisticsCalculator.js`

**Implementation**:
```javascript
// statisticsCalculator.js
import { getBooks } from './storage';

export function calculateStatistics(userId) {
  const books = getBooks(userId);
  
  if (books.length === 0) {
    return null;
  }

  return {
    totalBooks: books.length,
    booksByStatus: calculateStatusCounts(books),
    booksByStatusPercentage: calculateStatusPercentages(books),
    booksAddedPerMonth: calculateMonthlyAdded(books),
    booksCompletedPerMonth: calculateMonthlyCompleted(books),
    readingPace: calculateReadingPace(books),
    lastCalculated: new Date().toISOString()
  };
}

function calculateStatusCounts(books) {
  return {
    reading: books.filter(b => b.status === 'Reading').length,
    completed: books.filter(b => b.status === 'Completed').length,
    wishlist: books.filter(b => b.status === 'Wishlist').length
  };
}

// ... other helper functions
```

**Rationale**:
- Separates calculation logic from UI
- Easier to test
- Reusable if needed

---

## Pattern Category 6: CSS Organization Patterns

### Pattern 6.1: Component-Specific CSS Modules

**Pattern**: Each component has its own CSS Module file.

**Files**:
- `StatisticsComponent.module.css`
- `SearchComponent.module.css`

**Implementation**:
```css
/* StatisticsComponent.module.css */
.container {
  padding: var(--spacing-md);
  background: var(--color-surface);
  border-radius: var(--border-radius-md);
}

.statusSection {
  margin-bottom: var(--spacing-md);
}

.error {
  color: var(--color-error);
  padding: var(--spacing-sm);
}

.warnings {
  color: var(--color-warning);
  font-size: var(--font-size-sm);
}
```

**Rationale**:
- Scoped styles, no conflicts
- Uses design tokens from Unit 1
- Consistent with Units 1-3

---

### Pattern 6.2: Search Result Highlighting in BookItemComponent

**Pattern**: Add conditional classes to existing BookItemComponent.

**Implementation**:
```javascript
// In BookItemComponent
function BookItemComponent({ book, isSearchMatch }) {
  return (
    <div className={`${styles.container} ${isSearchMatch === false ? styles.dimmed : ''}`}>
      {/* Book content */}
    </div>
  );
}
```

```css
/* BookItemComponent.module.css */
.dimmed {
  opacity: 0.4;
  filter: grayscale(50%);
}
```

**Rationale**:
- Extends existing component
- No new wrapper components
- Simple conditional styling

---

## Pattern Summary

### Component Patterns
1. **StatisticsComponent**: Single component, inline logic, useState
2. **SearchComponent**: Separate component, local state, callback to parent
3. **Export**: Button in Statistics, logic in BookList, inline implementation

### State Management
1. **Statistics**: Single useState object
2. **Search**: Query in component, results via callback
3. **Export**: Modal state in BookListComponent

### Data Access
1. **Books**: Direct localStorage via storage utility
2. **User**: AuthContext (inherited)

### Error Handling
1. **Calculations**: Try-catch with UI error display
2. **Export**: Try-catch with alert()

### Utilities
1. **Statistics**: Separate utility file (statisticsCalculator.js)
2. **Search**: Inline in component
3. **Export**: Inline in handler

### CSS
1. **Components**: CSS Modules per component
2. **Search highlighting**: Conditional classes in BookItemComponent

---

## Design Principles

1. **Simplicity**: Inline logic where appropriate, no over-engineering
2. **Consistency**: Follow Units 1-3 patterns
3. **Modularity**: Separate components where it adds value
4. **Directness**: Direct data access, minimal abstraction
5. **Pragmatism**: Use simple solutions (alert, inline logic) for infrequent operations
