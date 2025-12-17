# Business Logic Model - Unit 4: Analytics & Utilities

## Overview
This document defines the business processes, algorithms, and logic flows for the Analytics & Utilities unit.

---

## Business Process 1: Calculate Statistics

### Purpose
Calculate reading statistics from user's book collection.

### Trigger
User clicks "Refresh Statistics" button in StatisticsComponent.

### Inputs
- User's book collection from localStorage (via storage utility)
- Current date/time for calculations

### Process Flow

```
1. START: User clicks "Refresh Statistics"
2. Read all books for current user from localStorage
3. IF no books exist:
   - Show onboarding message
   - END
4. Initialize statistics object
5. Calculate Books by Status
   - Count books where status = "Reading"
   - Count books where status = "Completed"
   - Count books where status = "Wishlist"
   - Calculate percentages (count / total * 100)
6. Calculate Books Added Per Month
   - Group books by createdAt month
   - Count books per month
   - Format as "MMM YYYY"
   - Include last 12 months always
   - Include older months only if count > 0
7. Calculate Books Completed Per Month
   - Filter books where status = "Completed" AND completedAt exists
   - Group by completedAt month
   - Count books per month
   - Format as "MMM YYYY"
   - Include last 12 months always
   - Include older months only if count > 0
8. Calculate Reading Pace
   - FOR EACH book:
     - IF status = "Completed":
       - Calculate duration = completedAt - createdAt (in days)
       - IF duration = 0:
         - Add to warnings array
         - SKIP this book
       - ELSE:
         - Calculate pace = totalPages / duration
         - Add to valid books array
     - ELSE IF status = "Reading":
       - Calculate duration = now - createdAt (in days)
       - IF duration > 0:
         - Calculate pace = pagesRead / duration
         - Add to valid books array
   - Calculate average pace = sum(all paces) / count(valid books)
   - Store warnings for excluded books
9. Update statistics display
10. Show success message
11. END
```

### Outputs
- Statistics object with all calculated values
- Warnings array for excluded books
- Success message

### Business Rules
- Invalid books (missing required fields) are skipped
- Zero-duration books excluded from pace calculation with warning
- Last 12 months always shown, older months only if non-zero
- All three statuses always displayed, even if zero
- Reading books included in pace calculation using current progress

### Error Handling
- If localStorage read fails: Show error message
- If no valid books for pace: Show "N/A" with explanation
- If calculation error: Skip invalid book, continue with valid books

---

## Business Process 2: Search Books

### Purpose
Filter book list based on user's search query.

### Trigger
User clicks "Search" button in SearchComponent.

### Inputs
- Search query (string)
- User's book collection

### Process Flow

```
1. START: User clicks "Search" button
2. Read search query from input field
3. Trim leading/trailing whitespace
4. IF query is empty:
   - Clear search (show all books)
   - END
5. Convert query to lowercase
6. Initialize matching books array
7. FOR EACH book in collection:
   - Convert book title to lowercase
   - Convert book author to lowercase
   - IF query is substring of title OR query is substring of author:
     - Add book ID to matching books array
8. Update UI state with matching book IDs
9. BookListComponent highlights matching books, dims non-matching
10. Show match count message
11. END
```

### Outputs
- Array of matching book IDs
- Match count
- Updated UI state (highlighted/dimmed books)

### Business Rules
- Case-insensitive search
- Partial match (substring search)
- OR logic: match if found in title OR author
- Search executes on button click only
- Empty query shows all books

### Error Handling
- If no matches: Show "No books found matching '[query]'" message
- If search fails: Show error message, keep current view

---

## Business Process 3: Clear Search

### Purpose
Reset search and show all books.

### Trigger
User clicks "Clear Search" button in SearchComponent.

### Process Flow

```
1. START: User clicks "Clear Search"
2. Clear search query input field
3. Clear matching books array
4. Update UI state (all books shown normally)
5. Hide match count message
6. END
```

### Outputs
- Empty search query
- All books displayed normally
- No match count message

### Business Rules
- All books shown with normal styling (no highlighting/dimming)
- Search input cleared

---

## Business Process 4: Export Books to JSON

### Purpose
Export user's complete book collection to downloadable JSON file.

### Trigger
User clicks "Export" button in StatisticsComponent.

### Process Flow

```
1. START: User clicks "Export" button
2. Read all books for current user from localStorage
3. IF no books exist:
   - Show error message "No books to export"
   - END
4. Generate export preview:
   - Get first 5 books
   - Get total book count
5. Show export preview modal:
   - Display first 5 books (title, author, status)
   - Display total count
   - Show "Confirm Export" and "Cancel" buttons
6. Wait for user confirmation
7. IF user cancels:
   - Close modal
   - END
8. IF user confirms:
   - Generate JSON string from books array
   - Get current user email
   - Get current timestamp
   - Generate filename: "reading-list-[email]-[timestamp].json"
   - Create Blob with JSON data
   - Create download link
   - Trigger browser download
   - Close modal
   - Show success message: "Export complete: [count] books exported"
9. END
```

### Outputs
- JSON file downloaded to user's device
- Success message with book count

### Business Rules
- Export includes ALL book fields exactly as stored
- File format is array of books (no wrapper object)
- Filename includes user email and timestamp
- User must confirm before download
- Preview shows first 5 books only

### Error Handling
- If no books: Show error "No books to export"
- If browser doesn't support download: Show error with manual instructions
- If JSON generation fails: Show error message

---

## Algorithm 1: Calculate Monthly Book Counts

### Purpose
Group books by month and count them.

### Input
- Array of books
- Date field to group by (createdAt or completedAt)

### Algorithm

```javascript
function calculateMonthlyBookCounts(books, dateField) {
  // Initialize map for month counts
  const monthCounts = new Map();
  
  // Get current date
  const now = new Date();
  
  // Generate last 12 months
  for (let i = 0; i < 12; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
    monthCounts.set(monthKey, {
      month: formatMonth(date), // "MMM YYYY"
      count: 0,
      year: date.getFullYear(),
      monthNumber: date.getMonth() + 1
    });
  }
  
  // Count books per month
  for (const book of books) {
    const dateValue = book[dateField];
    if (!dateValue) continue; // Skip if date missing
    
    const date = new Date(dateValue);
    const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
    
    if (monthCounts.has(monthKey)) {
      // Month in last 12 months
      monthCounts.get(monthKey).count++;
    } else {
      // Older month - only add if not already present
      if (!monthCounts.has(monthKey)) {
        monthCounts.set(monthKey, {
          month: formatMonth(date),
          count: 1,
          year: date.getFullYear(),
          monthNumber: date.getMonth() + 1
        });
      } else {
        monthCounts.get(monthKey).count++;
      }
    }
  }
  
  // Convert to array and sort by date (newest first)
  const result = Array.from(monthCounts.values())
    .filter(item => {
      // Include last 12 months always
      const isLast12Months = isWithinLast12Months(item.year, item.monthNumber, now);
      // Include older months only if count > 0
      return isLast12Months || item.count > 0;
    })
    .sort((a, b) => {
      // Sort by year desc, then month desc
      if (a.year !== b.year) return b.year - a.year;
      return b.monthNumber - a.monthNumber;
    });
  
  return result;
}

function formatMonth(date) {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
}

function isWithinLast12Months(year, month, now) {
  const monthDate = new Date(year, month - 1, 1);
  const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);
  return monthDate >= twelveMonthsAgo;
}
```

### Output
Array of monthly counts sorted by date (newest first).

---

## Algorithm 2: Calculate Reading Pace

### Purpose
Calculate average pages per day across all books.

### Input
- Array of books

### Algorithm

```javascript
function calculateReadingPace(books) {
  const validPaces = [];
  const warnings = [];
  const now = new Date();
  
  for (const book of books) {
    // Validate required fields
    if (!book.totalPages || !book.createdAt) {
      continue; // Skip invalid book
    }
    
    let pace = null;
    let duration = 0;
    
    if (book.status === "Completed" && book.completedAt) {
      // Completed book
      const startDate = new Date(book.createdAt);
      const endDate = new Date(book.completedAt);
      duration = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24)); // days
      
      if (duration === 0) {
        // Same-day completion - exclude with warning
        warnings.push(`"${book.title}" excluded: same-day completion`);
        continue;
      }
      
      pace = book.totalPages / duration;
      
    } else if (book.status === "Reading" && book.pagesRead > 0) {
      // Currently reading book
      const startDate = new Date(book.createdAt);
      duration = Math.floor((now - startDate) / (1000 * 60 * 60 * 24)); // days
      
      if (duration > 0) {
        pace = book.pagesRead / duration;
      }
    }
    
    if (pace !== null && pace > 0) {
      validPaces.push(pace);
    }
  }
  
  // Calculate average
  if (validPaces.length === 0) {
    return {
      pagesPerDay: null,
      bookCount: 0,
      warnings: warnings
    };
  }
  
  // Average per book, then average those averages
  const averagePace = validPaces.reduce((sum, pace) => sum + pace, 0) / validPaces.length;
  
  return {
    pagesPerDay: Math.round(averagePace * 10) / 10, // Round to 1 decimal
    bookCount: validPaces.length,
    warnings: warnings
  };
}
```

### Output
Object with pagesPerDay, bookCount, and warnings array.

---

## Algorithm 3: Search Books by Query

### Purpose
Filter books by partial match on title or author.

### Input
- Array of books
- Search query (string)

### Algorithm

```javascript
function searchBooks(books, query) {
  // Normalize query
  const normalizedQuery = query.trim().toLowerCase();
  
  if (normalizedQuery === "") {
    // Empty query - return all books
    return books.map(book => book.bookId);
  }
  
  // Filter books
  const matchingBookIds = books
    .filter(book => {
      const title = (book.title || "").toLowerCase();
      const author = (book.author || "").toLowerCase();
      
      // Partial match on title OR author
      return title.includes(normalizedQuery) || author.includes(normalizedQuery);
    })
    .map(book => book.bookId);
  
  return matchingBookIds;
}
```

### Output
Array of matching book IDs.

---

## Algorithm 4: Generate Export Filename

### Purpose
Generate timestamped filename for export.

### Input
- User email
- Current timestamp

### Algorithm

```javascript
function generateExportFilename(userEmail, timestamp) {
  // Format timestamp for filename (replace colons with hyphens)
  const formattedTimestamp = timestamp
    .toISOString()
    .replace(/:/g, '-')
    .replace(/\..+/, ''); // Remove milliseconds
  
  // Sanitize email (replace @ and . with hyphens)
  const sanitizedEmail = userEmail
    .replace(/@/g, '-')
    .replace(/\./g, '-');
  
  return `reading-list-${sanitizedEmail}-${formattedTimestamp}.json`;
}
```

### Output
Filename string (e.g., "reading-list-user-example-com-2025-12-17T12-00-00Z.json").

---

## Data Transformation 1: Books to Statistics

### Input
Array of Book objects from localStorage.

### Transformation

```javascript
{
  totalBooks: books.length,
  booksByStatus: {
    reading: books.filter(b => b.status === "Reading").length,
    completed: books.filter(b => b.status === "Completed").length,
    wishlist: books.filter(b => b.status === "Wishlist").length
  },
  booksByStatusPercentage: {
    reading: Math.round((readingCount / totalBooks) * 100),
    completed: Math.round((completedCount / totalBooks) * 100),
    wishlist: Math.round((wishlistCount / totalBooks) * 100)
  },
  booksAddedPerMonth: calculateMonthlyBookCounts(books, "createdAt"),
  booksCompletedPerMonth: calculateMonthlyBookCounts(
    books.filter(b => b.status === "Completed"),
    "completedAt"
  ),
  readingPace: calculateReadingPace(books),
  lastCalculated: new Date().toISOString()
}
```

### Output
Statistics object for display.

---

## Data Transformation 2: Books to Export JSON

### Input
Array of Book objects from localStorage.

### Transformation

```javascript
// Direct array export (no transformation)
const exportData = books; // All fields included as-is

// Convert to JSON string
const jsonString = JSON.stringify(exportData, null, 2); // Pretty-printed with 2-space indent
```

### Output
JSON string ready for file download.

---

## Validation Logic

### Validate Book for Statistics
```javascript
function isValidForStatistics(book) {
  return (
    book.title &&
    book.author &&
    book.status &&
    typeof book.totalPages === 'number' &&
    book.totalPages > 0 &&
    book.createdAt
  );
}
```

### Validate Book for Pace Calculation
```javascript
function isValidForPaceCalculation(book) {
  if (!isValidForStatistics(book)) return false;
  
  if (book.status === "Completed") {
    return book.completedAt && new Date(book.completedAt) >= new Date(book.createdAt);
  }
  
  if (book.status === "Reading") {
    return typeof book.pagesRead === 'number' && book.pagesRead > 0;
  }
  
  return false;
}
```

### Validate Search Query
```javascript
function isValidSearchQuery(query) {
  return (
    typeof query === 'string' &&
    query.length <= 100
  );
}
```

---

## Integration Points

### With Storage Utility
- Read books: `storage.getBooks(userId)`
- No write operations (read-only unit)

### With BookListComponent
- Statistics displayed above book list
- Search integrated above book list
- Export button in statistics section
- Search results update book list display (highlight/dim)

### With AuthContext
- Get current user ID for data filtering
- Get current user email for export filename

---

## Performance Considerations

### Statistics Calculation
- Calculated on-demand (manual refresh)
- No automatic recalculation
- Complexity: O(n) where n = number of books
- Expected: < 100ms for 500 books

### Search
- Executed on button click (not real-time)
- Complexity: O(n) where n = number of books
- Expected: < 50ms for 500 books

### Export
- Generated on-demand
- Complexity: O(n) where n = number of books
- Expected: < 100ms for 500 books
- Browser handles file download

---

## Notes

- All calculations performed client-side
- No server-side processing required
- Statistics are ephemeral (not persisted)
- Search state is ephemeral (not persisted)
- Export creates temporary file for download
