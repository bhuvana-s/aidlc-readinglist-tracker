# NFR Requirements - Unit 3: Enhanced Features

## Overview

This document defines the non-functional requirements for Unit 3 (Enhanced Features), covering performance, scalability, availability, security, reliability, maintainability, and usability requirements for ISBN lookup, file import, progress tracking, and notes/ratings features.

---

## Performance Requirements

### PERF-01: ISBN API Response Time
**Requirement**: ISBN lookup API calls should complete within reasonable browser timeout limits

**Specification**:
- No specific timeout requirement enforced by application
- Rely on browser's default fetch timeout behavior
- Show loading indicator during API call
- User can cancel operation if taking too long

**Rationale**: Simplicity - let browser handle network timeouts naturally

**Acceptance Criteria**:
- Loading indicator displays during API call
- User receives feedback when API call completes or fails
- No artificial timeout imposed by application code

---

### PERF-02: File Import Performance
**Requirement**: Support import of small files with synchronous processing

**Specification**:
- Maximum file size: 1MB
- Maximum books per import: 100 books
- Synchronous processing acceptable (no web workers needed)
- No progress indicator required for small files

**Rationale**: Target use case is personal reading lists, typically < 100 books

**Acceptance Criteria**:
- Import completes within 2-3 seconds for 100 books
- UI remains responsive during import
- No browser "unresponsive script" warnings

**Performance Targets**:
- JSON parsing: < 100ms for 1MB file
- CSV parsing: < 200ms for 1MB file
- Validation + duplicate check: < 500ms for 100 books
- Local storage write: < 1 second for 100 books

---

### PERF-03: Progress Calculation Performance
**Requirement**: Calculate progress on-demand when displaying books

**Specification**:
- Calculate progress percentage when rendering book component
- No caching or pre-calculation needed
- Simple formula: `Math.floor((currentPage / totalPages) * 100)`
- Acceptable for collections up to 500 books

**Rationale**: Calculation is simple and fast, caching adds complexity

**Acceptance Criteria**:
- Progress calculation completes in < 1ms per book
- List rendering remains smooth with 100-500 books
- No noticeable lag when scrolling through book list

---

### PERF-04: Search/Filter Performance
**Requirement**: Moderate performance for real-time search with debouncing

**Specification**:
- Debounce search input by 300ms
- Filter books after user pauses typing
- Target response time: < 300ms for filtering
- Acceptable for collections up to 500 books

**Rationale**: Balance between responsiveness and performance

**Acceptance Criteria**:
- Search results appear within 300ms of last keystroke
- No lag or stuttering during typing
- Smooth filtering animation

**Implementation Note**: This requirement applies to Unit 4 (Search component), included here for completeness

---

## Scalability Requirements

### SCALE-01: Book Collection Size
**Requirement**: Support medium-sized book collections (100-500 books)

**Specification**:
- Target collection size: 100-500 books
- May need pagination or virtualization for larger collections
- All features functional up to 500 books
- Graceful degradation beyond 500 books

**Rationale**: Covers 95% of personal reading list use cases

**Acceptance Criteria**:
- All features work smoothly with 500 books
- List rendering remains responsive
- Search/filter performs adequately
- Import/export handles 500 books

**Future Considerations**:
- If users exceed 500 books, consider:
  - Virtual scrolling for book list
  - Pagination (50-100 books per page)
  - Lazy loading of book details

---

### SCALE-02: Local Storage Limits
**Requirement**: Check local storage capacity and warn users before save

**Specification**:
- Check available storage before saving books
- Show warning if approaching storage limit (> 80% used)
- Provide guidance on how to free up space
- Prevent data loss from storage quota exceeded errors

**Rationale**: Proactive user notification prevents silent failures

**Acceptance Criteria**:
- Storage check runs before each save operation
- Warning message displays when > 80% capacity used
- Warning includes current usage and available space
- User can proceed or cancel save operation

**Warning Message Example**:
```
"Storage space is running low (4.5MB of 5MB used). 
Consider exporting and deleting old books to free up space."
```

**Storage Estimates**:
- Average book: ~500 bytes (with notes)
- 100 books: ~50KB
- 500 books: ~250KB
- 1000 books: ~500KB
- Local storage limit: ~5-10MB (browser dependent)

---

## Availability Requirements

### AVAIL-01: Offline Functionality
**Requirement**: Full offline support except for ISBN lookup

**Specification**:
- **Works Offline**:
  - Manual book entry
  - Book editing and deletion
  - Progress tracking
  - Notes and ratings
  - File import (JSON/CSV)
  - Book list viewing
  - All local data operations
  
- **Requires Online**:
  - ISBN lookup (external API call)
  
- **Behavior When Offline**:
  - ISBN lookup shows error: "Unable to lookup ISBN. Please check your internet connection."
  - All other features continue to work normally
  - No data loss or corruption

**Rationale**: Reading list management is primarily offline activity

**Acceptance Criteria**:
- All offline features work without internet connection
- ISBN lookup fails gracefully when offline
- User receives clear feedback about offline status
- Data persists correctly in offline mode

---

### AVAIL-02: Data Persistence
**Requirement**: Standard local storage persistence with no automatic backup

**Specification**:
- Data stored in browser's local storage
- Persistence relies on browser's local storage implementation
- No automatic backup mechanism
- User responsible for manual backups via export feature (Unit 4)

**Rationale**: Simple architecture, user controls their data

**Acceptance Criteria**:
- Data persists across browser sessions
- Data survives browser restart
- Data remains after closing tabs
- Data cleared only when user clears browser data

**User Guidance**:
- Recommend periodic manual exports for backup
- Warn users about browser data clearing
- Provide export feature for data portability (Unit 4)

**Limitations**:
- Data lost if user clears browser data
- Data not synced across devices
- Data not backed up automatically
- Data tied to specific browser/device

---

## Security Requirements

### SEC-01: ISBN API Security
**Requirement**: Standard security for external API calls with input validation

**Specification**:
- Use HTTPS for all API calls (Open Library API uses HTTPS)
- Validate ISBN format before making API call
- Validate ISBN checksum (ISBN-10 and ISBN-13 algorithms)
- Reject invalid ISBNs before API call

**Rationale**: Prevent malformed requests and reduce unnecessary API calls

**Acceptance Criteria**:
- All API calls use HTTPS protocol
- ISBN validation runs before API call
- Invalid ISBNs rejected with error message
- No sensitive data sent to API

**Validation Rules**:
- ISBN-10: 10 digits, valid checksum
- ISBN-13: 13 digits, valid checksum
- Strip hyphens and spaces before validation
- Reject non-numeric characters (except 'X' for ISBN-10)

---

### SEC-02: File Import Security
**Requirement**: Basic file type validation for imports

**Specification**:
- Validate file extension (.json or .csv)
- Check file type from file input
- No file size validation (covered by PERF-02)
- No content sanitization (trust user's own files)

**Rationale**: Users importing their own data, low security risk

**Acceptance Criteria**:
- Only .json and .csv files accepted
- Other file types rejected with error message
- File type check runs before parsing

**Allowed File Types**:
- JSON: `.json` extension, `application/json` MIME type
- CSV: `.csv` extension, `text/csv` MIME type

**Error Messages**:
- "Invalid file type. Please select a JSON or CSV file."

---

### SEC-03: XSS Protection for Notes
**Requirement**: Basic HTML escaping for user-entered notes

**Specification**:
- Escape HTML entities in notes before display
- Prevent HTML injection in notes field
- Store notes as plain text
- Display notes with escaped HTML entities

**Rationale**: Prevent XSS attacks through notes field

**Acceptance Criteria**:
- HTML entities escaped: `<`, `>`, `&`, `"`, `'`
- Notes display as plain text, not rendered HTML
- No script execution from notes content
- Line breaks preserved (use `\n` or `<br>` safely)

**Escaping Rules**:
- `<` → `&lt;`
- `>` → `&gt;`
- `&` → `&amp;`
- `"` → `&quot;`
- `'` → `&#x27;`

**Implementation Note**: React escapes by default, but explicit escaping adds defense-in-depth

---

## Reliability Requirements

### REL-01: Error Handling Strategy
**Requirement**: Standard error handling with user guidance

**Specification**:
- Display clear error messages to users
- Provide recovery suggestions in error messages
- Show specific errors (not generic "An error occurred")
- Guide users on how to resolve errors

**Rationale**: Help users understand and recover from errors

**Acceptance Criteria**:
- All errors display user-friendly messages
- Error messages include recovery suggestions
- Errors don't crash the application
- Users can continue using app after errors

**Error Message Format**:
```
[Error Description]
[Recovery Suggestion]
```

**Examples**:
- "Invalid ISBN format. Please enter a 10 or 13 digit ISBN."
- "Unable to lookup ISBN. Please check your internet connection or try manual entry."
- "Import failed: File format is invalid. Please ensure the file is valid JSON or CSV."
- "Storage space is low. Consider exporting and deleting old books."

---

### REL-02: Data Validation Strictness
**Requirement**: Standard validation for required fields and basic types

**Specification**:
- Validate required fields: title, author
- Validate field types: numbers, strings, dates
- Validate ranges: page numbers, ratings
- Allow optional fields to be empty/null

**Rationale**: Balance between data quality and user-friendliness

**Acceptance Criteria**:
- Required fields enforced (title, author)
- Type validation prevents invalid data
- Range validation prevents impossible values
- Clear error messages for validation failures

**Validation Rules**:
- **Title**: Required, non-empty string
- **Author**: Required, non-empty string
- **Status**: Must be "Reading", "Completed", or "Wishlist"
- **Total Pages**: Positive integer > 0
- **Current Page**: Integer, 0 ≤ currentPage ≤ totalPages
- **Rating**: Null or value in [0, 0.5, 1, ..., 4.5, 5]
- **Notes**: Optional, max 5000 characters
- **ISBN**: Optional, valid ISBN-10 or ISBN-13 format

---

### REL-03: Import Error Recovery
**Requirement**: Partial success for imports - skip invalid books, import valid ones

**Specification**:
- Parse entire import file first
- Validate each book individually
- Skip invalid books, continue with valid books
- Show summary of results: imported, skipped, failed
- No rollback - partial imports succeed

**Rationale**: Maximize successful imports, don't fail entire import for one bad book

**Acceptance Criteria**:
- Valid books imported successfully
- Invalid books skipped with count
- Duplicate books skipped with count
- Summary message shows all counts
- No data corruption from partial imports

**Summary Message Format**:
```
"Imported X of Y books, Z skipped (duplicates), W failed (invalid)"
```

**Example**:
```
"Imported 15 of 20 books, 3 skipped (duplicates), 2 failed (invalid)"
```

---

## Maintainability Requirements

### MAINT-01: Code Organization
**Requirement**: Extend existing components with minimal new files

**Specification**:
- Add ISBN lookup to existing BookFormComponent
- Add import functionality to existing BookFormComponent
- Add progress tracking to existing BookItemComponent
- Minimize new component files
- Keep related functionality together

**Rationale**: Simplicity, reduce file proliferation, easier maintenance

**Acceptance Criteria**:
- New features integrated into existing components
- No separate ISBNLookup or ImportComponent files
- Utility functions extracted to utils/ directory
- Component files remain manageable size (< 500 lines)

**File Structure**:
```
src/
  components/
    books/
      BookFormModal.jsx (extended with ISBN + import)
      BookItemComponent.jsx (extended with progress bar)
  utils/
    isbnValidator.js (new)
    importParser.js (new)
```

---

### MAINT-02: Testing Requirements
**Requirement**: Basic unit tests for critical functions

**Specification**:
- Unit tests for ISBN validation logic
- Unit tests for progress calculation
- Unit tests for import parsing and validation
- Manual testing for UI components
- No integration tests required

**Rationale**: Focus testing on complex business logic, not UI

**Acceptance Criteria**:
- ISBN validation has unit tests (checksum algorithms)
- Progress calculation has unit tests (edge cases)
- Import validation has unit tests (various file formats)
- Test coverage > 70% for utility functions

**Test Cases to Cover**:
- **ISBN Validation**:
  - Valid ISBN-10 and ISBN-13
  - Invalid checksums
  - Invalid lengths
  - Special characters
  
- **Progress Calculation**:
  - 0%, 50%, 100% progress
  - Edge cases (0 pages, equal pages)
  - Different statuses (Wishlist, Reading, Completed)
  
- **Import Parsing**:
  - Valid JSON/CSV files
  - Invalid file formats
  - Missing required fields
  - Duplicate detection

---

## Usability Requirements

### USAB-01: Loading Indicators
**Requirement**: Minimal loading indicators - only for file imports

**Specification**:
- Show loading indicator during file import operations
- No loading indicator for ISBN lookup (fast enough)
- Simple spinner or progress message
- Disable form during loading

**Rationale**: Imports may take 1-2 seconds, need feedback

**Acceptance Criteria**:
- Loading indicator displays during import
- User cannot submit form while loading
- Loading indicator disappears when import completes
- Clear visual feedback of loading state

**Loading Messages**:
- "Importing books..."
- "Parsing file..."
- "Validating books..."

---

### USAB-02: User Feedback
**Requirement**: Standard feedback - show both error and success messages

**Specification**:
- Display error messages for failures
- Display success messages for successful operations
- Use toast notifications or inline messages
- Auto-dismiss success messages after 3-5 seconds
- Keep error messages until user dismisses

**Rationale**: Users need confirmation of actions

**Acceptance Criteria**:
- Success message after successful import
- Success message after successful ISBN lookup
- Error messages for all failure cases
- Messages are clear and actionable

**Success Messages**:
- "Book added successfully!"
- "Imported 15 books successfully"
- "Progress updated"
- "Book marked as completed!"

**Error Messages**:
- "Invalid ISBN format"
- "ISBN not found in database"
- "Import failed: Invalid file format"
- "Storage space is low"

---

### USAB-03: Accessibility Requirements
**Requirement**: Basic semantic HTML for accessibility

**Specification**:
- Use semantic HTML elements (button, input, form, etc.)
- Proper form labels for all inputs
- Keyboard navigation support
- Focus management for modals
- No advanced ARIA attributes required

**Rationale**: Basic accessibility without complex implementation

**Acceptance Criteria**:
- All form inputs have associated labels
- Buttons use `<button>` element
- Forms use `<form>` element
- Keyboard navigation works (Tab, Enter, Escape)
- Focus visible on interactive elements

**Semantic HTML Elements**:
- `<button>` for all buttons
- `<input>` with `<label>` for all inputs
- `<form>` for all forms
- `<textarea>` for notes field
- `<select>` for dropdowns (if any)

---

## NFR Summary

### Performance
- No specific API timeout (browser default)
- Small file imports (< 100 books, < 1MB)
- On-demand progress calculation
- 300ms debounce for search/filter

### Scalability
- Support 100-500 books
- Check storage before save, warn at 80%

### Availability
- Full offline support except ISBN lookup
- Standard local storage persistence

### Security
- HTTPS + ISBN input validation
- Basic file type validation
- HTML escaping for notes

### Reliability
- Standard error handling with guidance
- Standard validation (required fields + types)
- Partial success for imports

### Maintainability
- Extend existing components
- Basic unit tests for critical functions

### Usability
- Minimal loading indicators (imports only)
- Standard feedback (errors + success)
- Basic semantic HTML

---

## NFR Priorities

### Critical (Must Have)
1. REL-02: Data validation strictness
2. SEC-03: XSS protection for notes
3. REL-01: Error handling strategy
4. AVAIL-01: Offline functionality
5. PERF-02: File import performance

### Important (Should Have)
1. SCALE-02: Local storage limits check
2. SEC-01: ISBN API security
3. REL-03: Import error recovery
4. USAB-02: User feedback
5. MAINT-01: Code organization

### Nice to Have (Could Have)
1. PERF-03: Progress calculation performance
2. USAB-01: Loading indicators
3. USAB-03: Accessibility requirements
4. MAINT-02: Testing requirements
5. SEC-02: File import security

---

## NFR Traceability

### Functional Requirements → NFR Requirements

| Functional Requirement | NFR Requirements |
|------------------------|------------------|
| FR-3.2: ISBN Lookup | PERF-01, SEC-01, REL-01, USAB-02 |
| FR-3.3: Import JSON | PERF-02, SEC-02, REL-03, USAB-01, USAB-02 |
| FR-3.4: Import CSV | PERF-02, SEC-02, REL-03, USAB-01, USAB-02 |
| FR-4.1: Update Progress | PERF-03, REL-02, USAB-02 |
| FR-4.2: Calculate Progress | PERF-03 |
| FR-4.3: Visual Progress | PERF-03, USAB-03 |
| FR-5.1: Add Notes | SEC-03, REL-02, USAB-03 |
| FR-5.2: Rate Books | REL-02, USAB-03 |
| All Features | SCALE-01, SCALE-02, AVAIL-01, AVAIL-02, MAINT-01, MAINT-02 |

---

## Compliance and Standards

### Web Standards
- HTML5 semantic elements
- CSS3 for styling
- ES6+ JavaScript
- Fetch API for HTTP requests

### Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Last 2 versions of each browser
- No IE11 support required

### Data Standards
- ISO 8601 for dates
- UTF-8 encoding for text
- JSON for data interchange
- CSV RFC 4180 for CSV files

### Security Standards
- HTTPS for external API calls
- HTML entity escaping for user input
- No sensitive data in local storage

---

## Monitoring and Metrics

### Performance Metrics
- ISBN API response time (informational only)
- Import processing time (< 3 seconds for 100 books)
- Progress calculation time (< 1ms per book)
- Search/filter response time (< 300ms)

### Reliability Metrics
- Import success rate (% of valid books imported)
- Error rate (% of operations that fail)
- Data validation failure rate

### Usability Metrics
- User feedback message display rate
- Loading indicator display frequency
- Error message clarity (user feedback)

**Note**: Metrics are for development/testing purposes, no production monitoring required for client-side app

---

## Summary

Unit 3 NFR requirements focus on:
- **Simplicity**: Minimal dependencies, extend existing components
- **Performance**: Adequate for small-medium collections (100-500 books)
- **Reliability**: Standard validation and error handling
- **Security**: Basic protections (HTTPS, validation, escaping)
- **Usability**: Clear feedback and semantic HTML
- **Offline-First**: Full functionality except ISBN lookup

These requirements support a lightweight, user-friendly reading list tracker suitable for personal use.

