# Domain Entities - Unit 3: Enhanced Features

## Overview

This document defines the domain entities and data structures for Unit 3 (Enhanced Features), extending the book entity from Unit 2 with new fields for ISBN lookup, progress tracking, notes, and ratings.

---

## Extended Book Entity

### Book Entity Structure

The Book entity is extended from Unit 2 with additional fields to support enhanced features:

```javascript
Book {
  // Core fields (from Unit 2)
  bookId: string              // Unique identifier (UUID)
  userId: string              // Owner's user ID (for data isolation)
  title: string               // Book title (required)
  author: string              // Book author (required)
  status: string              // Reading status: "Reading", "Completed", "Wishlist"
  totalPages: number          // Total pages in book (required, positive integer)
  dateAdded: string           // ISO 8601 timestamp when book was added
  
  // Enhanced fields (Unit 3)
  isbn: string | null         // ISBN-10 or ISBN-13 (optional, validated format)
  currentPage: number         // Current page number (0 to totalPages)
  progress: number            // Progress percentage (0-100, integer)
  notes: string | null        // Reader's notes (max 5000 chars, preserves line breaks)
  rating: number | null       // Star rating (0, 0.5, 1, 1.5, ..., 4.5, 5)
  dateCompleted: string | null // ISO 8601 timestamp when book was completed
}
```

### Field Descriptions

#### Core Fields (Inherited from Unit 2)

**bookId**
- Type: `string`
- Format: UUID v4
- Required: Yes
- Description: Unique identifier for the book
- Generated: Automatically on book creation

**userId**
- Type: `string`
- Format: UUID v4
- Required: Yes
- Description: ID of the user who owns this book
- Purpose: Data isolation between users

**title**
- Type: `string`
- Required: Yes
- Validation: Non-empty string, trimmed
- Description: The book's title

**author**
- Type: `string`
- Required: Yes
- Validation: Non-empty string, trimmed
- Description: The book's author name

**status**
- Type: `string`
- Required: Yes
- Allowed Values: `"Reading"`, `"Completed"`, `"Wishlist"`
- Default: `"Wishlist"`
- Description: Current reading status of the book

**totalPages**
- Type: `number`
- Required: Yes
- Validation: Positive integer > 0
- Description: Total number of pages in the book

**dateAdded**
- Type: `string`
- Format: ISO 8601 timestamp (e.g., "2025-12-17T10:30:00Z")
- Required: Yes
- Generated: Automatically on book creation
- Description: When the book was added to the collection

#### Enhanced Fields (Unit 3)

**isbn**
- Type: `string | null`
- Format: ISBN-10 (10 digits) or ISBN-13 (13 digits)
- Required: No
- Default: `null`
- Validation: If provided, must pass ISBN checksum validation
- Description: International Standard Book Number for the book
- Source: User input via ISBN lookup or manual entry

**currentPage**
- Type: `number`
- Required: No
- Default: `0`
- Validation: Integer between 0 and totalPages (inclusive)
- Description: Current page the reader is on
- Used For: Progress calculation

**progress**
- Type: `number`
- Required: No
- Default: Calculated based on status
- Validation: Integer between 0 and 100 (inclusive)
- Calculation: `Math.floor((currentPage / totalPages) * 100)`
- Description: Reading progress as percentage
- Special Cases:
  - Wishlist status: Always 0%
  - Completed status: Always 100%
  - Reading status: Calculated from currentPage/totalPages

**notes**
- Type: `string | null`
- Required: No
- Default: `null`
- Validation: Maximum 5000 characters
- Format: Plain text with preserved line breaks
- Description: Reader's personal notes about the book
- Storage: Newline characters preserved as `\n`

**rating**
- Type: `number | null`
- Required: No
- Default: `null` (no rating)
- Allowed Values: `0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5`
- Validation: Must be in half-star increments
- Description: Reader's rating of the book (5-star system with half-stars)

**dateCompleted**
- Type: `string | null`
- Format: ISO 8601 timestamp (e.g., "2025-12-17T10:30:00Z")
- Required: No
- Default: `null`
- Generated: Automatically when progress reaches 100%
- Description: When the book was completed
- Used For: Statistics calculations (books per month, reading pace)

---

## Import File Entities

### JSON Import Format

**Structure**: Array of book objects

```javascript
[
  {
    title: string,           // Required
    author: string,          // Required
    status: string,          // Optional (default: "Wishlist")
    totalPages: number,      // Optional (default: 0)
    currentPage: number,     // Optional (default: 0)
    isbn: string,            // Optional
    notes: string,           // Optional
    rating: number,          // Optional
    dateCompleted: string    // Optional
  },
  // ... more books
]
```

**Validation Rules**:
- Array must contain at least one book object
- Each book must have `title` and `author` (required fields)
- Optional fields use defaults if missing
- Invalid books are skipped (lenient validation)
- Duplicates (same title + author) are skipped

### CSV Import Format

**Structure**: CSV file with header row and fixed columns

```csv
title,author,status,totalPages,currentPage,isbn,notes,rating,dateCompleted
"The Great Gatsby","F. Scott Fitzgerald","Completed",180,180,"9780743273565","Classic novel",4.5,"2025-12-01T00:00:00Z"
"1984","George Orwell","Reading",328,150,"9780451524935","Dystopian masterpiece",null,null
```

**Column Order** (fixed, required):
1. `title` (required)
2. `author` (required)
3. `status` (optional)
4. `totalPages` (optional)
5. `currentPage` (optional)
6. `isbn` (optional)
7. `notes` (optional)
8. `rating` (optional)
9. `dateCompleted` (optional)

**Validation Rules**:
- First row must be header row (ignored during import)
- Columns must be in exact order specified above
- Each row must have at least `title` and `author`
- Empty cells treated as null/default values
- Invalid rows are skipped (lenient validation)
- Duplicates (same title + author) are skipped

---

## ISBN API Response Entity

### Open Library API Response

**Endpoint**: `https://openlibrary.org/api/books?bibkeys=ISBN:{isbn}&format=json&jscmd=data`

**Response Structure**:
```javascript
{
  "ISBN:9780743273565": {
    title: string,              // Book title
    authors: [                  // Array of author objects
      { name: string }
    ],
    number_of_pages: number,    // Total pages
    publishers: [               // Array of publisher objects
      { name: string }
    ],
    publish_date: string,       // Publication date
    cover: {                    // Cover images
      small: string,
      medium: string,
      large: string
    }
    // ... other fields (not used)
  }
}
```

**Fields Used for Auto-Fill**:
- `title` → Book.title
- `authors[0].name` → Book.author (first author only)
- `number_of_pages` → Book.totalPages (if available)

**Error Cases**:
- Empty response `{}` → ISBN not found
- Network error → API unavailable
- Invalid JSON → Parse error

---

## Data Migration Entity

### Migration Metadata

When loading existing books from Unit 2, the system automatically adds default values for new fields:

```javascript
MigrationDefaults {
  isbn: null,
  currentPage: 0,
  progress: calculateProgressFromStatus(status),  // 0 for Wishlist, 100 for Completed, 0 for Reading
  notes: null,
  rating: null,
  dateCompleted: null
}
```

**Migration Logic**:
- Applied automatically on app load
- Only adds missing fields (doesn't overwrite existing data)
- Progress calculated based on status for migrated books
- No explicit migration flag needed (graceful handling)

---

## Entity Relationships

### Book → User Relationship

```
User (1) ──── has many ──── (N) Book
```

- One user can have many books
- Each book belongs to exactly one user
- Relationship enforced via `userId` field
- Data isolation: Users only see their own books

### Book → Progress Relationship

```
Book (1) ──── has one ──── (1) Progress Data
```

- Progress data embedded in Book entity (not separate)
- Fields: `currentPage`, `progress`, `dateCompleted`
- Progress automatically calculated from currentPage and totalPages

### Book → Notes/Ratings Relationship

```
Book (1) ──── has one ──── (1) Notes/Ratings Data
```

- Notes and ratings embedded in Book entity (not separate)
- Fields: `notes`, `rating`
- Both optional (can be null)

---

## Entity Validation Rules

### Book Entity Validation

**On Create**:
- `title`: Required, non-empty string
- `author`: Required, non-empty string
- `status`: Must be one of: "Reading", "Completed", "Wishlist"
- `totalPages`: Required, positive integer > 0
- `isbn`: Optional, must pass ISBN checksum if provided
- `currentPage`: Optional, must be 0 ≤ currentPage ≤ totalPages
- `notes`: Optional, max 5000 characters
- `rating`: Optional, must be in half-star increments (0-5)

**On Update**:
- Same validation as create
- Additional: `progress` recalculated automatically when currentPage or totalPages change
- Additional: `dateCompleted` set automatically when progress reaches 100%

### Import Entity Validation

**JSON Import**:
- Must be valid JSON array
- Each book must have `title` and `author`
- Invalid books skipped, valid books imported
- Duplicates skipped (same title + author)

**CSV Import**:
- Must have header row
- Must have columns in fixed order
- Each row must have `title` and `author`
- Invalid rows skipped, valid rows imported
- Duplicates skipped (same title + author)

---

## Entity State Transitions

### Status Transitions

```
Wishlist ──→ Reading ──→ Completed
   ↑           ↓             ↓
   └───────────┴─────────────┘
```

**Allowed Transitions**:
- Wishlist → Reading (user starts reading)
- Reading → Completed (user finishes or progress reaches 100%)
- Completed → Reading (user re-reads)
- Any status → Any status (user can change freely)

**Automatic Transitions**:
- Reading → Completed: When `progress` reaches 100%
- Sets `dateCompleted` to current timestamp

### Progress State Transitions

```
0% ──→ 1-99% ──→ 100%
                    ↓
              Auto-Complete
              (status → Completed)
```

**Progress Updates**:
- User updates `currentPage`
- System calculates `progress = Math.floor((currentPage / totalPages) * 100)`
- If `progress === 100`, system automatically:
  - Changes `status` to "Completed"
  - Sets `dateCompleted` to current timestamp

---

## Entity Examples

### Example 1: New Book with ISBN Lookup

```javascript
{
  bookId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  userId: "user-123-456",
  title: "The Great Gatsby",
  author: "F. Scott Fitzgerald",
  status: "Wishlist",
  totalPages: 180,
  dateAdded: "2025-12-17T10:00:00Z",
  isbn: "9780743273565",
  currentPage: 0,
  progress: 0,
  notes: null,
  rating: null,
  dateCompleted: null
}
```

### Example 2: Book in Progress with Notes

```javascript
{
  bookId: "b2c3d4e5-f6g7-8901-bcde-fg2345678901",
  userId: "user-123-456",
  title: "1984",
  author: "George Orwell",
  status: "Reading",
  totalPages: 328,
  dateAdded: "2025-12-10T14:30:00Z",
  isbn: "9780451524935",
  currentPage: 150,
  progress: 45,  // Math.floor((150/328)*100) = 45
  notes: "Dystopian masterpiece. The surveillance themes are eerily relevant today.",
  rating: null,
  dateCompleted: null
}
```

### Example 3: Completed Book with Rating

```javascript
{
  bookId: "c3d4e5f6-g7h8-9012-cdef-gh3456789012",
  userId: "user-123-456",
  title: "To Kill a Mockingbird",
  author: "Harper Lee",
  status: "Completed",
  totalPages: 324,
  dateAdded: "2025-11-15T09:00:00Z",
  isbn: null,
  currentPage: 324,
  progress: 100,
  notes: "Powerful story about justice and morality. Scout is an amazing character.",
  rating: 5.0,
  dateCompleted: "2025-12-01T20:15:00Z"
}
```

### Example 4: Migrated Book from Unit 2

```javascript
{
  // Original Unit 2 fields
  bookId: "d4e5f6g7-h8i9-0123-defg-hi4567890123",
  userId: "user-123-456",
  title: "Pride and Prejudice",
  author: "Jane Austen",
  status: "Reading",
  totalPages: 432,
  dateAdded: "2025-12-05T11:00:00Z",
  
  // Auto-migrated Unit 3 fields (defaults)
  isbn: null,
  currentPage: 0,
  progress: 0,
  notes: null,
  rating: null,
  dateCompleted: null
}
```

---

## Summary

### Entity Count
- **1 Primary Entity**: Book (extended from Unit 2)
- **2 Import Entities**: JSON Import Format, CSV Import Format
- **1 API Entity**: Open Library API Response
- **1 Migration Entity**: Migration Defaults

### Key Characteristics
- **Flat Structure**: All fields in single Book entity (no nested objects)
- **Backward Compatible**: Existing Unit 2 books automatically migrated
- **Optional Fields**: Most Unit 3 fields are optional (null allowed)
- **Calculated Fields**: Progress calculated automatically from currentPage/totalPages
- **Automatic Behaviors**: Auto-completion, date recording, progress calculation

### Data Flow
1. **ISBN Lookup**: API Response → Book Entity (title, author, totalPages)
2. **File Import**: JSON/CSV → Book Entity (all fields)
3. **Progress Tracking**: currentPage → progress calculation → auto-completion
4. **Notes/Ratings**: User input → Book Entity (notes, rating)
5. **Migration**: Unit 2 Book → Unit 3 Book (add default fields)

