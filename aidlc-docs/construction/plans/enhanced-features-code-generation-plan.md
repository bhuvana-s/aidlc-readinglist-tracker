# Code Generation Plan - Unit 3: Enhanced Features

## Unit Overview
**Unit Name**: Enhanced Features  
**Purpose**: Implement advanced book management features including ISBN lookup, file import, progress tracking, and notes/ratings  
**Stories Assigned**: 8 stories (ENTRY-01 to ENTRY-03, PROG-01 to PROG-03, NOTE-01 to NOTE-02)

---

## Unit Context

### Stories Implemented by This Unit
1. **ENTRY-01**: ISBN Lookup - Add book via ISBN with API integration
2. **ENTRY-02**: Import from JSON - Bulk import books from JSON file
3. **ENTRY-03**: Import from CSV - Bulk import books from CSV file
4. **PROG-01**: Update Reading Progress - Track current page and calculate progress
5. **PROG-02**: Visual Progress Indicators - Display progress bars
6. **PROG-03**: Auto-Complete Books - Mark books complete at 100% progress
7. **NOTE-01**: Add and Edit Notes - Personal notes for books
8. **NOTE-02**: Rate Books - 5-star rating system with half-stars

### Dependencies
- **Unit 1 (UI Foundation)**: Modal, StarRating, design system
- **Unit 2 (Core Features)**: BookFormModal, BookItemComponent, BookListComponent, storage utilities

### Expected Interfaces
- Extend BookFormModal with new modes (ISBN, JSON, CSV)
- Extend BookItemComponent with progress bar and rating display
- Add utility modules (isbnValidator, importParser, progressCalculator)

### Database Entities
- Extended Book entity with new fields: isbn, currentPage, progress, notes, rating, dateCompleted

---

## Code Generation Steps

### Step 1: Create Utility Module - ISBN Validator
- [x] Create `src/utils/isbnValidator.js`
- [x] Implement `validateISBN(isbn)` - Main validation function
- [x] Implement `validateISBN10(isbn)` - ISBN-10 checksum algorithm
- [x] Implement `validateISBN13(isbn)` - ISBN-13 checksum algorithm
- [x] Implement `stripISBN(isbn)` - Remove hyphens and spaces
- [x] Add JSDoc comments for all functions

**Story Coverage**: ENTRY-01

---

### Step 2: Create Unit Tests - ISBN Validator
- [ ] Create `src/utils/__tests__/isbnValidator.test.js`
- [ ] Test valid ISBN-10 examples
- [ ] Test valid ISBN-13 examples
- [ ] Test invalid ISBN-10 checksums
- [ ] Test invalid ISBN-13 checksums
- [ ] Test invalid formats (wrong length, non-numeric)
- [ ] Test ISBN with hyphens and spaces
- [ ] Test edge cases (empty string, null, undefined)

**Story Coverage**: ENTRY-01

---

### Step 3: Create Utility Module - Import Parser
- [x] Create `src/utils/importParser.js`
- [ ] Implement `parseJSON(jsonText)` - Parse JSON import file
- [ ] Implement `parseCSV(csvText)` - Parse CSV import file
- [ ] Implement `validateBook(book)` - Validate required fields
- [ ] Implement `isDuplicate(newBook, existingBooks)` - Check for duplicates
- [ ] Add JSDoc comments for all functions

**Story Coverage**: ENTRY-02, ENTRY-03

---

### Step 4: Create Unit Tests - Import Parser
- [ ] Create `src/utils/__tests__/importParser.test.js`
- [ ] Test valid JSON parsing
- [ ] Test invalid JSON formats
- [ ] Test valid CSV parsing
- [ ] Test CSV with missing columns
- [ ] Test book validation (valid and invalid)
- [ ] Test duplicate detection (case-insensitive)
- [ ] Test edge cases (empty files, malformed data)

**Story Coverage**: ENTRY-02, ENTRY-03

---

### Step 5: Create Utility Module - Progress Calculator
- [x] Create `src/utils/progressCalculator.js`
- [ ] Implement `calculateProgress(currentPage, totalPages, status)` - Calculate percentage
- [ ] Implement `shouldAutoComplete(progress, status)` - Check auto-completion
- [ ] Add JSDoc comments for all functions

**Story Coverage**: PROG-01, PROG-02, PROG-03

---

### Step 6: Create Unit Tests - Progress Calculator
- [ ] Create `src/utils/__tests__/progressCalculator.test.js`
- [ ] Test progress calculation (0%, 50%, 100%)
- [ ] Test edge cases (0 pages, equal pages)
- [ ] Test status-based logic (Wishlist=0%, Completed=100%)
- [ ] Test auto-completion detection
- [ ] Test rounding (floor to integer)

**Story Coverage**: PROG-01, PROG-02, PROG-03

---

### Step 7: Extend BookFormModal Component - Add Mode State
- [x] Update `src/components/books/BookFormModal.jsx`
- [x] Add mode state ('manual', 'isbn', 'json', 'csv')
- [x] Add mode selector buttons UI
- [x] Implement mode switching logic
- [x] Update form state to include new fields (isbn, currentPage, notes, rating)

**Story Coverage**: All stories (foundation)

---

### Step 8: Extend BookFormModal Component - ISBN Lookup Mode
- [x] Add ISBN input field
- [x] Implement `handleISBNLookup()` function
- [x] Add ISBN validation before API call
- [x] Implement Open Library API call with fetch
- [x] Parse API response and extract book data
- [x] Auto-fill form fields (title, author, totalPages)
- [x] Add error handling for API failures
- [x] Add loading state during API call
- [x] Display error messages inline

**Story Coverage**: ENTRY-01

---

### Step 9: Extend BookFormModal Component - JSON Import Mode
- [x] Add file input for JSON files
- [x] Implement `handleFileSelect()` for JSON
- [x] Use FileReader to read file content
- [x] Implement `processJSONImport()` function
- [x] Parse JSON using importParser utility
- [x] Validate each book entry
- [x] Check for duplicates
- [x] Bulk save valid books to storage
- [x] Display import result summary
- [x] Add error handling for file reading and parsing

**Story Coverage**: ENTRY-02

---

### Step 10: Extend BookFormModal Component - CSV Import Mode
- [x] Add file input for CSV files
- [x] Implement `handleFileSelect()` for CSV
- [x] Use FileReader to read file content
- [x] Implement `processCSVImport()` function
- [x] Parse CSV using importParser utility
- [x] Validate each row
- [x] Check for duplicates
- [x] Bulk save valid books to storage
- [x] Display import result summary
- [x] Add error handling for file reading and parsing

**Story Coverage**: ENTRY-03

---

### Step 11: Extend BookFormModal Component - Progress Fields
- [x] Add currentPage input field
- [x] Add progress display (calculated, read-only)
- [x] Implement progress calculation on currentPage change
- [x] Add validation for currentPage (0 to totalPages)
- [x] Display validation errors inline

**Story Coverage**: PROG-01

---

### Step 12: Extend BookFormModal Component - Notes Field
- [x] Add notes textarea field
- [x] Implement character counter (max 5000)
- [x] Add character limit validation
- [x] Preserve line breaks in notes
- [x] Display character count in real-time

**Story Coverage**: NOTE-01

---

### Step 13: Extend BookFormModal Component - Rating Field
- [x] Integrate StarRating component from Unit 1
- [x] Add rating state (0-5 in 0.5 increments)
- [x] Implement rating change handler
- [x] Make rating optional (can be null)
- [x] Display current rating value

**Story Coverage**: NOTE-02

---

### Step 14: Extend BookFormModal Component - Auto-Completion Logic
- [x] Implement auto-completion check in save handler
- [x] When progress reaches 100%, set status to "Completed"
- [x] Set dateCompleted to current timestamp
- [x] Show notification "Book marked as completed!"
- [x] Update book in storage with new status and date

**Story Coverage**: PROG-03

---

### Step 15: Update BookFormModal Styles
- [x] Update `src/components/books/BookFormModal.module.css`
- [x] Add styles for mode selector buttons
- [x] Add styles for ISBN input section
- [x] Add styles for file import section
- [x] Add styles for progress display
- [x] Add styles for notes textarea
- [x] Add styles for character counter
- [x] Add styles for error messages
- [x] Add styles for import result messages
- [x] Ensure responsive design

**Story Coverage**: All stories (UI)

---

### Step 16: Extend BookItemComponent - Progress Bar Display
- [x] Update `src/components/books/BookItemComponent.jsx`
- [x] Add progress bar HTML structure
- [x] Calculate progress using progressCalculator utility
- [x] Display progress bar for "Reading" status only
- [x] Show progress percentage text
- [x] Show current page / total pages
- [x] Add conditional rendering based on status

**Story Coverage**: PROG-02

---

### Step 17: Extend BookItemComponent - Rating Display
- [x] Update `src/components/books/BookItemComponent.jsx`
- [x] Integrate StarRating component from Unit 1
- [x] Display rating if present
- [x] Show "Not rated" if rating is null
- [x] Make rating read-only in list view

**Story Coverage**: NOTE-02

---

### Step 18: Extend BookItemComponent - Notes Preview
- [x] Update `src/components/books/BookItemComponent.jsx`
- [x] Add notes preview section
- [x] Truncate notes to 100 characters
- [x] Show "..." if notes are longer
- [x] Display "No notes" if notes are null
- [x] Preserve line breaks in preview

**Story Coverage**: NOTE-01

---

### Step 19: Update BookItemComponent Styles
- [x] Update `src/components/books/BookItemComponent.module.css`
- [x] Add styles for progress bar container
- [x] Add styles for progress fill (green bar)
- [x] Add styles for progress text overlay
- [x] Add styles for page count display
- [x] Add styles for rating display section
- [x] Add styles for notes preview section
- [x] Ensure responsive design

**Story Coverage**: PROG-02, NOTE-01, NOTE-02 (UI)

---

### Step 20: Extend BookListComponent - Progress Update Handler
- [x] Update `src/components/books/BookListComponent.jsx`
- [x] Pass currentUser prop to BookFormModal
- [x] Enable import functionality with user context

**Story Coverage**: PROG-01, PROG-03

---

### Step 21: Update Storage Utility - Data Migration
- [x] Update `src/utils/storage.js`
- [x] Add migration function for existing books
- [x] Add default values for new fields (isbn, currentPage, progress, notes, rating, dateCompleted)
- [x] Run migration on app load (App.jsx)
- [x] Ensure backward compatibility

**Story Coverage**: All stories (data layer)

---

### Step 22: Integration Testing Preparation
- [ ] Create test data files for import testing
- [ ] Create `src/utils/__tests__/fixtures/sample-books.json`
- [ ] Create `src/utils/__tests__/fixtures/sample-books.csv`
- [ ] Create `src/utils/__tests__/fixtures/invalid-books.json`
- [ ] Create `src/utils/__tests__/fixtures/invalid-books.csv`

**Story Coverage**: ENTRY-02, ENTRY-03

---

### Step 23: Update Documentation - README
- [ ] Update `README.md`
- [ ] Document ISBN lookup feature
- [ ] Document JSON import format and usage
- [ ] Document CSV import format and column order
- [ ] Document progress tracking feature
- [ ] Document notes and ratings features
- [ ] Add screenshots or examples

**Story Coverage**: All stories (documentation)

---

### Step 24: Update Documentation - TESTING
- [ ] Update `TESTING.md`
- [ ] Add testing instructions for ISBN validation
- [ ] Add testing instructions for import features
- [ ] Add testing instructions for progress tracking
- [ ] Add testing instructions for notes and ratings
- [ ] Document test data files location

**Story Coverage**: All stories (testing documentation)

---

### Step 25: Code Review and Cleanup
- [ ] Review all generated code for consistency
- [ ] Ensure all JSDoc comments are complete
- [ ] Verify error handling is comprehensive
- [ ] Check for code duplication
- [ ] Ensure accessibility standards met
- [ ] Verify responsive design works
- [ ] Run linter and fix any issues

**Story Coverage**: All stories (quality)

---

## Story Traceability

### Story Implementation Checklist

- [ ] **ENTRY-01: ISBN Lookup** - Steps 1, 2, 8
- [ ] **ENTRY-02: Import from JSON** - Steps 3, 4, 9, 22
- [ ] **ENTRY-03: Import from CSV** - Steps 3, 4, 10, 22
- [ ] **PROG-01: Update Reading Progress** - Steps 5, 6, 11, 20
- [ ] **PROG-02: Visual Progress Indicators** - Steps 5, 6, 16, 19
- [ ] **PROG-03: Auto-Complete Books** - Steps 5, 6, 14, 20
- [ ] **NOTE-01: Add and Edit Notes** - Steps 12, 18
- [ ] **NOTE-02: Rate Books** - Steps 13, 17

---

## Dependencies and Integration

### Unit 1 Dependencies
- Modal component (used by BookFormModal)
- StarRating component (used for ratings)
- Design system (colors, typography, spacing)

### Unit 2 Dependencies
- BookFormModal component (extended)
- BookItemComponent component (extended)
- BookListComponent component (extended)
- storage.js utility (extended)
- idGenerator.js utility (used)

### External Dependencies
- Open Library API (https://openlibrary.org/api/books)
- FileReader API (browser native)
- Fetch API (browser native)

---

## Estimated Scope

### Files to Create
- 3 new utility modules
- 3 new test files
- 2 test fixture files

### Files to Extend
- 2 component files (BookFormModal, BookItemComponent)
- 2 CSS module files
- 1 utility file (storage.js)
- 2 documentation files (README.md, TESTING.md)

### Total Steps: 25
- Utility modules: 6 steps
- Component extensions: 13 steps
- Testing: 3 steps
- Documentation: 2 steps
- Quality: 1 step

---

## Success Criteria

- [ ] All 8 user stories implemented
- [ ] All utility functions have unit tests
- [ ] ISBN validation works with checksum verification
- [ ] JSON and CSV import handle valid and invalid files
- [ ] Progress tracking calculates correctly
- [ ] Auto-completion triggers at 100% progress
- [ ] Notes support line breaks and character limit
- [ ] Ratings support half-star increments
- [ ] All components render correctly
- [ ] Error handling is comprehensive
- [ ] Documentation is complete
- [ ] Code passes linting
- [ ] Backward compatibility maintained

---

## Notes

- This plan extends existing components rather than creating new ones
- Zero new dependencies added (all native JavaScript and React)
- Focus on simplicity and directness per NFR design patterns
- All code follows established patterns from Units 1 and 2
- Tests will be executed in Build & Test phase (not during generation)

