# Domain Entities - Unit 4: Analytics & Utilities

## Overview
This document defines the domain entities, data structures, and relationships for the Analytics & Utilities unit.

---

## Entity 1: Statistics Data

### Purpose
Represents calculated statistics about the user's reading collection.

### Attributes

| Attribute | Type | Description | Validation | Example |
|-----------|------|-------------|------------|---------|
| totalBooks | Integer | Total count of all books | >= 0 | 25 |
| booksByStatus | Object | Count of books by status | Contains reading, completed, wishlist | { reading: 5, completed: 12, wishlist: 8 } |
| booksByStatusPercentage | Object | Percentage of books by status | Sum = 100% | { reading: 20, completed: 48, wishlist: 32 } |
| booksAddedPerMonth | Array | Books added each month | Array of MonthlyCount | [{ month: "Dec 2025", count: 3 }, ...] |
| booksCompletedPerMonth | Array | Books completed each month | Array of MonthlyCount | [{ month: "Nov 2025", count: 2 }, ...] |
| readingPace | Object | Reading pace statistics | Contains pagesPerDay, bookCount, warnings | { pagesPerDay: 42.5, bookCount: 10, warnings: ["2 books excluded"] } |
| lastCalculated | Date | When statistics were last calculated | ISO 8601 timestamp | "2025-12-17T12:00:00Z" |

### Nested Structure: MonthlyCount

| Attribute | Type | Description | Example |
|-----------|------|-------------|---------|
| month | String | Month in "MMM YYYY" format | "Dec 2025" |
| count | Integer | Number of books | 3 |
| year | Integer | Year number | 2025 |
| monthNumber | Integer | Month number (1-12) | 12 |

### Nested Structure: ReadingPace

| Attribute | Type | Description | Example |
|-----------|------|-------------|---------|
| pagesPerDay | Number | Average pages per day | 42.5 |
| bookCount | Integer | Number of books included in calculation | 10 |
| warnings | Array<String> | Warnings about excluded books | ["2 books excluded: same-day completion"] |

### Lifecycle
1. **Calculation**: Statistics calculated on-demand when user clicks refresh button
2. **Display**: Statistics displayed in StatisticsComponent
3. **Refresh**: User can manually refresh to recalculate

### Business Rules
- Statistics are calculated from current book data in localStorage
- Invalid books are skipped with warnings
- Zero-duration books (same-day completion) are excluded from pace calculation
- Last 12 months always shown for monthly stats, older months only if non-zero
- All three statuses always displayed, even if zero count

---

## Entity 2: Search Query

### Purpose
Represents the current search state and results.

### Attributes

| Attribute | Type | Description | Validation | Example |
|-----------|------|-------------|------------|---------|
| query | String | Search query text | 0-100 characters | "harry potter" |
| isActive | Boolean | Whether search is currently active | true/false | true |
| matchingBookIds | Array<String> | IDs of books matching search | Array of book IDs | ["book-123", "book-456"] |
| matchCount | Integer | Number of matching books | >= 0 | 5 |
| searchedAt | Date | When search was executed | ISO 8601 timestamp | "2025-12-17T12:00:00Z" |

### Lifecycle
1. **Input**: User enters search query in search box
2. **Execution**: User clicks "Search" button
3. **Filtering**: Books filtered by partial match on title OR author (case-insensitive)
4. **Display**: Matching books highlighted, non-matching books dimmed
5. **Clear**: User clears search, all books shown normally

### Business Rules
- Search is case-insensitive
- Partial match (substring search) on both title and author
- OR logic: match if query found in title OR author
- Search executes on button click only (not real-time)
- Search does not persist when navigating away
- Empty search query shows all books

---

## Entity 3: Export Data

### Purpose
Represents the data structure for JSON export.

### Attributes

| Attribute | Type | Description | Example |
|-----------|------|-------------|---------|
| books | Array<Book> | Array of all user's books | [{ bookId: "...", title: "...", ... }, ...] |
| exportedAt | Date | When export was generated | "2025-12-17T12:00:00Z" |
| exportedBy | String | User email who exported | "user@example.com" |
| bookCount | Integer | Total number of books exported | 25 |

### Export File Structure

```json
[
  {
    "bookId": "uuid-123",
    "userId": "user-456",
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "status": "Completed",
    "totalPages": 180,
    "pagesRead": 180,
    "progress": 100,
    "notes": "Classic American novel...",
    "rating": 4.5,
    "createdAt": "2025-11-01T10:00:00Z",
    "completedAt": "2025-11-15T18:30:00Z"
  },
  {
    "bookId": "uuid-789",
    "userId": "user-456",
    "title": "1984",
    "author": "George Orwell",
    "status": "Reading",
    "totalPages": 328,
    "pagesRead": 150,
    "progress": 45,
    "notes": "Dystopian masterpiece",
    "rating": 5,
    "createdAt": "2025-12-01T09:00:00Z",
    "completedAt": null
  }
]
```

### Export File Naming Convention
Format: `reading-list-[email]-[timestamp].json`

Example: `reading-list-user@example.com-2025-12-17T12-00-00Z.json`

### Lifecycle
1. **Trigger**: User clicks "Export" button in StatisticsComponent
2. **Preview**: Modal shows preview of export data (first 5 books, total count)
3. **Confirmation**: User confirms export
4. **Generation**: JSON file generated with all book data
5. **Download**: Browser downloads file
6. **Feedback**: Success message shows book count

### Business Rules
- Export includes ALL book fields exactly as stored
- Export is array of books only (no wrapper object)
- File name includes user email and timestamp
- Preview shows first 5 books and total count
- User must confirm before download
- Success message shows total book count exported
- Export errors show manual download instructions

---

## Entity 4: UI State

### Purpose
Represents the UI state for analytics and utilities components.

### Attributes

| Attribute | Type | Description | Example |
|-----------|------|-------------|---------|
| statisticsExpanded | Boolean | Whether statistics section is visible | true |
| searchActive | Boolean | Whether search is active | false |
| exportModalOpen | Boolean | Whether export preview modal is open | false |
| isCalculating | Boolean | Whether statistics are being calculated | false |
| isSearching | Boolean | Whether search is in progress | false |
| isExporting | Boolean | Whether export is in progress | false |
| errorMessage | String | Current error message (if any) | null or "Error message" |
| successMessage | String | Current success message (if any) | null or "Success message" |

### Lifecycle
- State managed in BookListComponent (parent component)
- Statistics and search integrated into BookListComponent
- Export button in StatisticsComponent, modal in BookListComponent

---

## Data Relationships

### Statistics ← Books
- Statistics calculated FROM book data
- One-way dependency: Statistics reads books, doesn't modify them
- Calculation triggered manually by user

### Search → Books
- Search filters book list
- One-way dependency: Search reads books, doesn't modify them
- Filtering applied in BookListComponent

### Export ← Books
- Export reads all book data
- One-way dependency: Export reads books, doesn't modify them
- Export triggered manually by user

### Component Hierarchy
```
BookListComponent (parent)
├── StatisticsComponent (integrated above list)
│   └── Export button
├── SearchComponent (integrated above list)
│   └── Search input + button
└── Book list display
    ├── BookItemComponent (highlighted if matches search)
    └── BookItemComponent (dimmed if doesn't match search)
```

---

## Data Validation Rules

### Statistics Calculation
1. **Valid Book**: Must have all required fields (title, author, status, totalPages, createdAt)
2. **Valid Completion**: completedAt must be >= createdAt
3. **Valid Progress**: pagesRead must be >= 0 and <= totalPages
4. **Valid Duration**: completedAt - createdAt must be >= 0
5. **Exclude Zero-Duration**: Books with same-day completion excluded from pace calculation

### Search Query
1. **Length**: 0-100 characters
2. **Trimming**: Leading/trailing whitespace trimmed
3. **Empty Query**: Treated as "show all books"

### Export Data
1. **Book Count**: Must have at least 1 book to export
2. **File Size**: No explicit limit (browser handles large files)
3. **JSON Validity**: Must be valid JSON format

---

## Storage Keys

### localStorage Keys Used
- `books_[userId]` - User's book collection (read-only for this unit)
- No new storage keys created by this unit

### Session State
- Statistics data: Component state (not persisted)
- Search query: Component state (not persisted)
- Export data: Temporary (generated on-demand)

---

## Data Flow Summary

### Statistics Flow
1. User clicks "Refresh Statistics" button
2. StatisticsComponent reads books from localStorage via storage utility
3. Statistics calculated (monthly counts, pace, status counts)
4. Statistics displayed in StatisticsComponent
5. Warnings shown for invalid/excluded books

### Search Flow
1. User enters query in SearchComponent
2. User clicks "Search" button
3. SearchComponent filters books by partial match on title OR author
4. BookListComponent receives filtered book IDs
5. BookItemComponents highlighted (matches) or dimmed (non-matches)
6. User clicks "Clear Search" to reset

### Export Flow
1. User clicks "Export" button in StatisticsComponent
2. BookListComponent reads all books from localStorage
3. Export preview modal shows first 5 books + total count
4. User confirms export
5. JSON file generated with all book data
6. Browser downloads file with timestamped filename
7. Success message shows book count

---

## Notes

- All entities are derived from existing Book entity (no new persistent entities)
- Statistics and search are read-only operations (don't modify books)
- Export creates temporary data structure for download
- No new database/storage entities required
- All calculations performed client-side in browser
