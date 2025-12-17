# Business Rules - Unit 3: Enhanced Features

## Overview

This document defines the business rules, validation logic, constraints, and decision rules for Unit 3 (Enhanced Features). These rules govern ISBN lookup, file import, progress tracking, notes, and ratings functionality.

---

## Rule Categories

1. **ISBN Lookup Rules** (BR-ISBN-XX)
2. **Import Rules** (BR-IMPORT-XX)
3. **Progress Tracking Rules** (BR-PROG-XX)
4. **Notes Rules** (BR-NOTES-XX)
5. **Rating Rules** (BR-RATING-XX)
6. **Data Migration Rules** (BR-MIG-XX)
7. **Integration Rules** (BR-INT-XX)

---

## ISBN Lookup Rules

### BR-ISBN-01: ISBN Format Validation
**Rule**: ISBN must be either 10 or 13 digits and pass checksum validation

**Validation Logic**:
- Strip all non-digit characters (except 'X' for ISBN-10)
- Length must be exactly 10 or 13 digits
- Must pass ISBN-10 or ISBN-13 checksum algorithm
- Invalid ISBN: Show error "Invalid ISBN format"

**Examples**:
- Valid: `9780743273565` (ISBN-13)
- Valid: `0451524934` (ISBN-10)
- Valid: `978-0-7432-7356-5` (with hyphens, stripped before validation)
- Invalid: `123456789` (wrong length)
- Invalid: `9780743273564` (fails checksum)

**Enforcement**: Before API call

---

### BR-ISBN-02: API Call Strategy
**Rule**: Single API attempt with no retry logic

**Behavior**:
- Make one GET request to Open Library API
- If success: Process response
- If failure (network error, timeout, API unavailable): Show error, require manual entry
- No automatic retry attempts
- No offline caching

**Rationale**: Simplicity and immediate feedback to user

**Error Message**: "Unable to lookup ISBN. Please try manual entry."

---

### BR-ISBN-03: Auto-Fill Fields
**Rule**: Only auto-fill title, author, and totalPages from API response

**Fields Auto-Filled**:
- `title` from `response.title`
- `author` from `response.authors[0].name` (first author only)
- `totalPages` from `response.number_of_pages` (if available, else 0)

**Fields NOT Auto-Filled**:
- `status` (user selects)
- `currentPage` (defaults to 0)
- `notes` (user enters)
- `rating` (user enters)

**User Control**: User can modify all auto-filled fields before saving

---

### BR-ISBN-04: ISBN Storage
**Rule**: Store ISBN in book record for reference

**Storage**:
- ISBN stored as string in `book.isbn` field
- Stored in original format entered by user (after validation)
- Optional field (can be null for manually entered books)

**Usage**: Reference only, not used for validation after initial lookup

---

## Import Rules

### BR-IMPORT-01: Lenient Validation Strategy
**Rule**: Skip invalid books/rows, import valid ones, show summary

**Behavior**:
- Parse entire file first
- Validate each book/row individually
- Invalid books/rows: Skip and count
- Valid books/rows: Add to import list
- Show summary: "Imported X of Y books, Z skipped (duplicates), W failed (invalid)"

**Rationale**: Partial success better than complete failure

**Enforcement**: During JSON and CSV import

---

### BR-IMPORT-02: Required Fields
**Rule**: Title and author are required for import

**Validation**:
- Each book/row must have non-empty `title` field
- Each book/row must have non-empty `author` field
- Missing either field: Mark as invalid, skip

**Optional Fields**: All other fields optional, use defaults if missing

**Error Handling**: Count as "failed" in summary message

---

### BR-IMPORT-03: Duplicate Detection
**Rule**: Skip books with same title AND author (case-insensitive)

**Detection Logic**:
- Normalize title and author: trim whitespace, convert to lowercase
- Compare against existing books in user's collection
- Match found: Skip book, count as "skipped (duplicate)"
- No match: Proceed with import

**Rationale**: Prevent accidental duplicate entries

**User Override**: No override option (always skip duplicates)

---

### BR-IMPORT-04: JSON Format
**Rule**: JSON import expects array of book objects

**Expected Format**:
```json
[
  {
    "title": "string",
    "author": "string",
    "status": "string (optional)",
    "totalPages": number (optional),
    ...
  }
]
```

**Invalid Formats**:
- Object with books array: `{books: [...]}`  → Rejected
- Single book object: `{title: ...}` → Rejected
- Non-array: Rejected

**Error Message**: "Invalid JSON file format"

---

### BR-IMPORT-05: CSV Format
**Rule**: CSV import expects fixed column order with header row

**Expected Format**:
```
title,author,status,totalPages,currentPage,isbn,notes,rating,dateCompleted
"Book Title","Author Name","Reading",300,150,"9780...",null,4.5,null
```

**Column Order** (fixed, required):
1. title
2. author
3. status
4. totalPages
5. currentPage
6. isbn
7. notes
8. rating
9. dateCompleted

**Header Row**: First row skipped (assumed to be header)

**Invalid Formats**:
- Different column order → Incorrect data mapping
- Missing columns → Empty values treated as null

---

### BR-IMPORT-06: Default Values
**Rule**: Apply default values for missing optional fields during import

**Defaults**:
- `status`: "Wishlist"
- `totalPages`: 0
- `currentPage`: 0
- `isbn`: null
- `notes`: null
- `rating`: null
- `dateCompleted`: null
- `progress`: Calculated based on status

**System Fields** (always generated):
- `bookId`: New UUID
- `userId`: Current user's ID
- `dateAdded`: Current timestamp

---

### BR-IMPORT-07: Field Type Validation
**Rule**: Validate and coerce field types during import

**Type Coercion**:
- `totalPages`: Convert to integer, default 0 if invalid
- `currentPage`: Convert to integer, default 0 if invalid
- `rating`: Convert to float, default null if invalid
- `status`: Must be "Reading", "Completed", or "Wishlist", default "Wishlist" if invalid

**Range Validation**:
- `totalPages`: Must be ≥ 0
- `currentPage`: Must be 0 ≤ currentPage ≤ totalPages
- `rating`: Must be in [0, 0.5, 1, ..., 4.5, 5] or null

---

## Progress Tracking Rules

### BR-PROG-01: Progress Calculation Formula
**Rule**: Progress = floor((currentPage / totalPages) × 100)

**Formula**:
```
progress = Math.floor((currentPage / totalPages) * 100)
```

**Rounding**: Always round down (floor) to integer

**Examples**:
- 150/300 = 50.0% → 50%
- 42/328 = 12.8% → 12%
- 1/3 = 33.3% → 33%

**Enforcement**: Automatic calculation whenever currentPage or totalPages changes

---

### BR-PROG-02: Integer Percentage
**Rule**: Progress displayed as integer percentage (no decimals)

**Display Format**: "42%" (not "42.5%" or "42.37%")

**Rationale**: Simplicity and readability

**Calculation**: Use `Math.floor()` to ensure integer result

---

### BR-PROG-03: Auto-Completion at 100%
**Rule**: Automatically change status to "Completed" when progress reaches 100%

**Trigger**: When `progress === 100` AND `status === "Reading"`

**Actions**:
1. Set `status = "Completed"`
2. Set `dateCompleted = current timestamp (ISO 8601)`
3. Save book to storage
4. Show notification: "Book marked as completed!"

**No User Prompt**: Automatic without asking for confirmation

**Rationale**: Streamline completion workflow

---

### BR-PROG-04: Completion Date Recording
**Rule**: Record completion date automatically when progress reaches 100%

**Trigger**: When progress reaches 100% (auto-completion)

**Format**: ISO 8601 timestamp (e.g., "2025-12-17T10:30:00Z")

**Storage**: `book.dateCompleted` field

**Usage**: For statistics calculations (books per month, reading pace)

---

### BR-PROG-05: Page Number Validation
**Rule**: Current page must be between 0 and totalPages (inclusive)

**Validation**:
- `currentPage >= 0`
- `currentPage <= totalPages`

**Error Handling**:
- If invalid: Show error "Page number must be between 0 and {totalPages}"
- Prevent save until valid

**Edge Cases**:
- currentPage = 0: Valid (not started)
- currentPage = totalPages: Valid (finished, triggers auto-completion)

---

### BR-PROG-06: Status-Based Progress Display
**Rule**: Progress display varies by book status

**Display Logic**:
- **Wishlist**: Always show 0% (fixed, not calculated)
- **Completed**: Always show 100% (fixed, not calculated)
- **Reading**: Calculate from currentPage/totalPages

**Rationale**: Wishlist books not started, Completed books finished

**Enforcement**: In progress calculation algorithm

---

### BR-PROG-07: Progress Recalculation Trigger
**Rule**: Recalculate progress automatically when currentPage or totalPages changes

**Triggers**:
- User updates currentPage
- User updates totalPages (rare, but possible)
- Book status changes (recalculate based on status)

**Automatic**: No manual recalculation needed

**Real-Time**: Update immediately on change

---

## Notes Rules

### BR-NOTES-01: Plain Text with Line Breaks
**Rule**: Notes stored as plain text with preserved line breaks

**Format**: Plain text string with `\n` characters for line breaks

**No Rich Text**: No HTML, markdown, or formatting tags

**Display**: Render with CSS `white-space: pre-wrap` to preserve line breaks

**Example**:
```
Input: "Great book!\nLoved the characters."
Storage: "Great book!\nLoved the characters."
Display: 
Great book!
Loved the characters.
```

---

### BR-NOTES-02: Character Limit
**Rule**: Notes limited to 5000 characters maximum

**Validation**:
- Count characters in real-time as user types
- If count ≤ 5000: Allow input
- If count > 5000: Prevent additional input, show warning

**Warning Message**: "Notes cannot exceed 5000 characters (currently: {count})"

**Rationale**: Prevent excessive storage usage, encourage concise notes

---

### BR-NOTES-03: Optional Field
**Rule**: Notes are optional (can be null or empty)

**Default**: null (no notes)

**Empty String**: Treated as null (no notes)

**Display**: Show "No notes" if null or empty

**Validation**: No required validation

---

## Rating Rules

### BR-RATING-01: Half-Star Increments
**Rule**: Ratings support half-star increments from 0 to 5

**Allowed Values**: `[0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]`

**Input Method**: Click left/right half of star icon

**Validation**: Reject any value not in allowed list

**Examples**:
- Valid: 4.5 (four and a half stars)
- Valid: 3.0 (three stars)
- Invalid: 4.3 (not a half-star increment)

---

### BR-RATING-02: Optional Field
**Rule**: Rating is optional (can be null)

**Default**: null (no rating)

**Display**: Show "Not rated" or empty stars if null

**User Choice**: User can leave book unrated

**Validation**: No required validation

---

### BR-RATING-03: Display Format
**Rule**: Display ratings as star icons with numeric value

**Format**: "★★★★☆ 4.0"

**Components**:
- Visual stars (filled, half-filled, empty)
- Numeric value (e.g., "4.0")

**Star Display**:
- Filled star: ★ (for whole numbers)
- Half-filled star: ⯨ (for 0.5 increments)
- Empty star: ☆ (for remaining)

**Example**: Rating 3.5 → "★★★⯨☆ 3.5"

---

### BR-RATING-04: Rating Range
**Rule**: Rating must be between 0 and 5 (inclusive)

**Minimum**: 0 (no stars)
**Maximum**: 5 (five stars)

**Validation**: Reject values < 0 or > 5

**Edge Cases**:
- 0 stars: Valid (very poor rating)
- 5 stars: Valid (excellent rating)

---

## Data Migration Rules

### BR-MIG-01: Automatic Migration
**Rule**: Automatically migrate Unit 2 books to Unit 3 format on app load

**Trigger**: App initialization, before displaying book list

**Process**:
1. Load all books from local storage
2. For each book, check if Unit 3 fields exist
3. If missing, add default values
4. Save updated books back to storage

**No User Action**: Completely automatic and transparent

---

### BR-MIG-02: Default Field Values
**Rule**: Apply default values for missing Unit 3 fields

**Defaults**:
- `isbn`: null
- `currentPage`: 0
- `progress`: Calculated based on status (0 for Wishlist/Reading, 100 for Completed)
- `notes`: null
- `rating`: null
- `dateCompleted`: null

**Preserve Existing**: Don't overwrite fields that already exist

---

### BR-MIG-03: Graceful Handling
**Rule**: Handle missing fields gracefully without errors

**Approach**: Check for field existence before using

**Example**:
```javascript
const progress = book.progress ?? calculateProgress(book.currentPage, book.totalPages, book.status);
```

**No Migration Flag**: No explicit flag needed, just check field existence

---

## Integration Rules

### BR-INT-01: User Data Isolation
**Rule**: All Unit 3 features respect user data isolation from Unit 2

**Enforcement**:
- Filter all books by `userId`
- Import operations add current user's `userId`
- Progress tracking per user
- Notes and ratings per user

**Security**: Users cannot access other users' data

---

### BR-INT-02: Backward Compatibility
**Rule**: Unit 3 features must work with existing Unit 2 books

**Requirements**:
- Existing books without Unit 3 fields must display correctly
- Migration adds missing fields automatically
- No breaking changes to Unit 2 functionality

**Testing**: Verify with books created in Unit 2

---

### BR-INT-03: Local Storage Schema Extension
**Rule**: Extend local storage schema without breaking existing data

**Approach**: Add new fields to existing book objects

**Schema**:
```javascript
{
  // Unit 2 fields (existing)
  bookId, userId, title, author, status, totalPages, dateAdded,
  
  // Unit 3 fields (new)
  isbn, currentPage, progress, notes, rating, dateCompleted
}
```

**Compatibility**: Unit 2 code ignores Unit 3 fields, Unit 3 code adds defaults for missing fields

---

## Validation Rules Summary

### Book Entity Validation (Extended from Unit 2)

**Required Fields**:
- `title`: Non-empty string
- `author`: Non-empty string
- `status`: One of ["Reading", "Completed", "Wishlist"]
- `totalPages`: Positive integer > 0

**Optional Fields**:
- `isbn`: Valid ISBN-10 or ISBN-13 (if provided)
- `currentPage`: Integer, 0 ≤ currentPage ≤ totalPages
- `progress`: Integer, 0-100 (calculated automatically)
- `notes`: String, max 5000 characters
- `rating`: Number, in [0, 0.5, 1, ..., 4.5, 5] or null
- `dateCompleted`: ISO 8601 timestamp or null

**System Fields** (auto-generated):
- `bookId`: UUID v4
- `userId`: UUID v4 (current user)
- `dateAdded`: ISO 8601 timestamp

---

## Error Handling Rules

### BR-ERR-01: ISBN Lookup Errors
**Rule**: Show clear error messages for ISBN lookup failures

**Error Types**:
- Invalid ISBN format: "Invalid ISBN format"
- ISBN not found: "ISBN not found in database"
- API unavailable: "Unable to lookup ISBN. Please try manual entry."
- Network error: "Unable to lookup ISBN. Please try manual entry."

**User Action**: Require manual entry after error

---

### BR-ERR-02: Import Errors
**Rule**: Show summary of import results with counts

**Summary Format**: "Imported X of Y books, Z skipped (duplicates), W failed (invalid)"

**Components**:
- X: Successfully imported books
- Y: Total books in file
- Z: Skipped duplicates
- W: Failed validation

**Example**: "Imported 15 of 20 books, 3 skipped, 2 failed"

---

### BR-ERR-03: Progress Validation Errors
**Rule**: Show specific error for invalid page numbers

**Error Message**: "Page number must be between 0 and {totalPages}"

**Trigger**: When currentPage < 0 or currentPage > totalPages

**User Action**: Correct page number before saving

---

### BR-ERR-04: Notes Character Limit Errors
**Rule**: Prevent input and show warning when character limit exceeded

**Warning Message**: "Notes cannot exceed 5000 characters (currently: {count})"

**Behavior**: Prevent additional typing when limit reached

**User Action**: Delete characters to continue editing

---

## Business Rule Priorities

### Critical Rules (Must Enforce)
1. BR-PROG-05: Page number validation (data integrity)
2. BR-IMPORT-02: Required fields (data quality)
3. BR-INT-01: User data isolation (security)
4. BR-ISBN-01: ISBN format validation (data quality)
5. BR-NOTES-02: Character limit (storage management)

### Important Rules (Should Enforce)
1. BR-PROG-03: Auto-completion at 100% (user experience)
2. BR-IMPORT-03: Duplicate detection (data quality)
3. BR-RATING-01: Half-star increments (data consistency)
4. BR-MIG-01: Automatic migration (backward compatibility)
5. BR-PROG-01: Progress calculation formula (consistency)

### Nice-to-Have Rules (Can Relax)
1. BR-ISBN-02: Single API attempt (could add retry)
2. BR-IMPORT-01: Lenient validation (could be stricter)
3. BR-NOTES-01: Plain text only (could add formatting)
4. BR-PROG-02: Integer percentage (could show decimals)

---

## Rule Enforcement Matrix

| Rule ID | Enforcement Point | Validation Type | Error Handling |
|---------|------------------|-----------------|----------------|
| BR-ISBN-01 | Before API call | Client-side | Show error, stop |
| BR-ISBN-02 | API call | N/A | Show error, manual entry |
| BR-ISBN-03 | After API response | N/A | Auto-fill fields |
| BR-IMPORT-01 | During import | Client-side | Skip invalid, continue |
| BR-IMPORT-02 | During import | Client-side | Skip book, count failed |
| BR-IMPORT-03 | During import | Client-side | Skip book, count skipped |
| BR-PROG-01 | On page update | Automatic | Calculate, no error |
| BR-PROG-03 | On 100% progress | Automatic | Auto-complete, notify |
| BR-PROG-05 | On page input | Client-side | Show error, prevent save |
| BR-NOTES-02 | On text input | Client-side | Prevent input, show warning |
| BR-RATING-01 | On rating input | Client-side | Reject invalid (UI prevents) |
| BR-MIG-01 | On app load | Automatic | Add defaults, no error |

---

## Summary

### Total Rules: 30+

**By Category**:
- ISBN Lookup: 4 rules
- Import: 7 rules
- Progress Tracking: 7 rules
- Notes: 3 rules
- Rating: 4 rules
- Data Migration: 3 rules
- Integration: 3 rules
- Error Handling: 4 rules

### Key Characteristics
- **User-Friendly**: Lenient validation, clear error messages
- **Automatic**: Progress calculation, auto-completion, migration
- **Secure**: User data isolation maintained
- **Backward Compatible**: Works with Unit 2 books
- **Data Quality**: Required fields, validation, duplicate detection

### Enforcement Strategy
- **Client-Side**: All validation happens in browser
- **Immediate Feedback**: Real-time validation and error messages
- **Graceful Degradation**: Skip invalid data, don't fail entirely
- **Automatic Behaviors**: Reduce user effort, improve experience

