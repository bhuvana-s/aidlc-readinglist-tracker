# Business Rules - Unit 4: Analytics & Utilities

## Overview
This document defines the business rules, constraints, and validation logic for the Analytics & Utilities unit.

---

## Category 1: Statistics Calculation Rules

### Rule 1.1: Books by Status Count
**Rule**: All three statuses (Reading, Completed, Wishlist) must always be displayed, even if count is zero.

**Rationale**: Provides consistent UI and shows user all available statuses.

**Implementation**:
- Initialize counts for all three statuses
- Display all three statuses in UI
- Show "0" for statuses with no books

**Validation**: None required (display rule only).

---

### Rule 1.2: Status Percentage Calculation
**Rule**: Status percentages must sum to 100% (allowing for rounding).

**Rationale**: Percentages represent complete distribution of books.

**Implementation**:
- Calculate percentage = (count / total) * 100
- Round to nearest integer
- If rounding causes sum ≠ 100%, adjust largest percentage

**Validation**: Sum of percentages should be 100% ± 1% (rounding tolerance).

---

### Rule 1.3: Monthly Statistics - Last 12 Months
**Rule**: Last 12 months must always be displayed in monthly statistics, even if count is zero.

**Rationale**: Provides consistent time window for trend analysis.

**Implementation**:
- Generate last 12 months from current date
- Initialize all with count = 0
- Update counts from book data
- Display all 12 months

**Validation**: Exactly 12 months from current month backwards must be present.

---

### Rule 1.4: Monthly Statistics - Older Months
**Rule**: Months older than 12 months are displayed only if count > 0.

**Rationale**: Avoid cluttering display with empty historical months.

**Implementation**:
- For months > 12 months ago, only add if book exists in that month
- Sort all months by date (newest first)

**Validation**: No months older than 12 months should have count = 0.

---

### Rule 1.5: Monthly Statistics - Dual Metrics
**Rule**: Display both "Books Added Per Month" and "Books Completed Per Month" as separate metrics.

**Rationale**: Provides insight into both acquisition and completion patterns.

**Implementation**:
- Calculate added per month using createdAt field
- Calculate completed per month using completedAt field (only for Completed status)
- Display both metrics separately

**Validation**: 
- Added count >= Completed count for any given month
- Completed count only includes books with status = "Completed"

---

### Rule 1.6: Reading Pace - Average Calculation
**Rule**: Reading pace is calculated as average per book, then average of those averages.

**Rationale**: Prevents long books from dominating the average.

**Implementation**:
- For each book, calculate: pages / duration
- Average all individual book paces
- Display as pages per day

**Validation**: Pace must be > 0 if any valid books exist.

---

### Rule 1.7: Reading Pace - Include Reading Books
**Rule**: Books with status "Reading" must be included in pace calculation using current progress.

**Rationale**: Provides real-time pace including current reading activity.

**Implementation**:
- For Reading books: pace = pagesRead / (now - createdAt)
- Only include if pagesRead > 0 and duration > 0
- Combine with completed book paces

**Validation**: Reading books with pagesRead = 0 should be excluded.

---

### Rule 1.8: Reading Pace - Exclude Zero-Duration Books
**Rule**: Books completed on the same day they were added must be excluded from pace calculation with a warning.

**Rationale**: Same-day completion indicates bulk import or data entry, not actual reading pace.

**Implementation**:
- Calculate duration = completedAt - createdAt
- If duration = 0 days, exclude from calculation
- Add warning message: "[Title] excluded: same-day completion"
- Display warning count in UI

**Validation**: No books with duration = 0 should be included in pace calculation.

---

### Rule 1.9: Statistics Update Frequency
**Rule**: Statistics are calculated only when user clicks "Refresh Statistics" button.

**Rationale**: Avoids unnecessary recalculation, gives user control.

**Implementation**:
- Display "Refresh Statistics" button
- Calculate on button click only
- Show last calculated timestamp

**Validation**: Statistics should not auto-update on book changes.

---

### Rule 1.10: Invalid Book Handling
**Rule**: Books with missing required fields must be skipped in calculations with no error shown.

**Rationale**: Graceful degradation - calculate with valid data.

**Implementation**:
- Validate each book before including in calculation
- Required fields: title, author, status, totalPages, createdAt
- Skip invalid books silently
- Continue calculation with valid books

**Validation**: Invalid books should not cause calculation failure.

---

## Category 2: Search Functionality Rules

### Rule 2.1: Search Matching - Partial Match
**Rule**: Search must use partial match (substring search) on both title and author fields.

**Rationale**: More flexible than exact match, easier for users.

**Implementation**:
- Convert query and fields to lowercase
- Use string.includes() for matching
- Match if query found anywhere in title OR author

**Validation**: Query "harry" should match "Harry Potter" and "The Harry Chronicles".

---

### Rule 2.2: Search Matching - Case Insensitive
**Rule**: Search must be case-insensitive.

**Rationale**: User convenience - don't require exact case.

**Implementation**:
- Convert query to lowercase
- Convert title and author to lowercase
- Perform comparison

**Validation**: "HARRY", "harry", "Harry" should all match "Harry Potter".

---

### Rule 2.3: Search Logic - OR Condition
**Rule**: Search matches if query found in title OR author (not both required).

**Rationale**: Maximize search results, user may not remember exact field.

**Implementation**:
- Check title.includes(query) OR author.includes(query)
- Include book if either condition is true

**Validation**: Query "rowling" should match books by "J.K. Rowling" even if title doesn't contain "rowling".

---

### Rule 2.4: Search Execution - Button Click Only
**Rule**: Search must execute only when user clicks "Search" button, not in real-time.

**Rationale**: User control, avoids performance issues with large collections.

**Implementation**:
- Search input is controlled component
- Search executes on button click event
- No onChange handler for search execution

**Validation**: Typing in search box should not trigger search until button clicked.

---

### Rule 2.5: Search Display - Highlight Matches
**Rule**: Search results must highlight matching books and dim non-matching books (not hide them).

**Rationale**: Maintains context, user can see full collection.

**Implementation**:
- All books remain visible
- Matching books: normal styling or highlighted
- Non-matching books: dimmed/grayed out
- Show match count above list

**Validation**: All books should be visible, with different styling for matches vs. non-matches.

---

### Rule 2.6: Search Persistence - No Persistence
**Rule**: Search query must not persist when navigating away from book list.

**Rationale**: Fresh start on each visit, avoids confusion.

**Implementation**:
- Search state in component state (not localStorage)
- Clear search on component unmount
- No URL query parameters

**Validation**: Navigating away and back should clear search.

---

### Rule 2.7: Empty Search Query
**Rule**: Empty search query must show all books with normal styling.

**Rationale**: Equivalent to "clear search".

**Implementation**:
- Trim query before processing
- If trimmed query is empty, return all book IDs
- Display all books normally

**Validation**: Empty string, whitespace-only string should show all books.

---

### Rule 2.8: No Search Results
**Rule**: When search returns no results, show empty list with message "No books found matching '[query]'".

**Rationale**: Clear feedback that search executed but found nothing.

**Implementation**:
- Check if matching books array is empty
- Display message with actual query text
- Provide "Clear Search" button

**Validation**: Search for non-existent text should show message, not empty list.

---

## Category 3: Export Functionality Rules

### Rule 3.1: Export Data Scope - All Fields
**Rule**: Export must include ALL book fields exactly as stored in localStorage.

**Rationale**: Complete data backup, enables re-import.

**Implementation**:
- Read books array from localStorage
- Export entire array with no field filtering
- Include all fields: bookId, userId, title, author, status, totalPages, pagesRead, progress, notes, rating, createdAt, completedAt

**Validation**: Exported JSON should match localStorage data exactly.

---

### Rule 3.2: Export Format - Array Only
**Rule**: Export file must contain array of books only, no wrapper object.

**Rationale**: Matches import format for easy re-import.

**Implementation**:
- Export structure: [{ book1 }, { book2 }, ...]
- No wrapper like { books: [...], metadata: {...} }

**Validation**: JSON.parse(exportedFile) should return array directly.

---

### Rule 3.3: Export Filename - Include Email and Timestamp
**Rule**: Export filename must include user email and timestamp.

**Rationale**: Unique filenames, easy to identify exports.

**Implementation**:
- Format: "reading-list-[email]-[timestamp].json"
- Sanitize email: replace @ and . with hyphens
- Format timestamp: ISO 8601 with colons replaced by hyphens
- Example: "reading-list-user-example-com-2025-12-17T12-00-00Z.json"

**Validation**: Filename should be unique per export, include user identifier.

---

### Rule 3.4: Export Preview - Show Before Download
**Rule**: Export must show preview modal before download, requiring user confirmation.

**Rationale**: User can review data before downloading.

**Implementation**:
- Show modal with:
  - First 5 books (title, author, status)
  - Total book count
  - "Confirm Export" and "Cancel" buttons
- Download only on confirmation

**Validation**: Download should not occur until user clicks "Confirm Export".

---

### Rule 3.5: Export Feedback - Success Message
**Rule**: After successful export, show success message with book count.

**Rationale**: Confirms export completed successfully.

**Implementation**:
- Message format: "Export complete: [count] books exported"
- Display for 3-5 seconds
- Close modal after download

**Validation**: Success message should appear after download triggers.

---

### Rule 3.6: Export Minimum - At Least One Book
**Rule**: Export button should be disabled or show error if user has zero books.

**Rationale**: Nothing to export.

**Implementation**:
- Check book count before showing export button
- If count = 0, disable button or show error on click
- Error message: "No books to export"

**Validation**: Export should not be possible with zero books.

---

### Rule 3.7: Export Error Handling - Manual Instructions
**Rule**: If browser doesn't support download, show error message with manual download instructions.

**Rationale**: Fallback for unsupported browsers.

**Implementation**:
- Try-catch around download trigger
- On error, show message: "Download failed. Please copy the JSON data manually."
- Optionally provide textarea with JSON for manual copy

**Validation**: Error should not crash application, should provide alternative.

---

## Category 4: Component Integration Rules

### Rule 4.1: Statistics Placement - Above Book List
**Rule**: StatisticsComponent must be integrated above book list in BookListComponent.

**Rationale**: Provides overview before detailed list.

**Implementation**:
- Render StatisticsComponent as first child in BookListComponent
- Followed by SearchComponent
- Followed by book list

**Validation**: Statistics should appear at top of page, above search and list.

---

### Rule 4.2: Search Placement - Above Book List
**Rule**: SearchComponent must be integrated above book list, below statistics.

**Rationale**: Search is action on list, should be near list.

**Implementation**:
- Render SearchComponent after StatisticsComponent
- Before book list
- Integrated into BookListComponent

**Validation**: Search should appear between statistics and book list.

---

### Rule 4.3: Export Placement - In Statistics Component
**Rule**: Export button must be placed within StatisticsComponent.

**Rationale**: Export is related to statistics/data overview.

**Implementation**:
- Render "Export" button in StatisticsComponent
- Button triggers export modal in parent (BookListComponent)

**Validation**: Export button should be visible in statistics section.

---

### Rule 4.4: No Books Scenario - Onboarding Message
**Rule**: When user has zero books, show onboarding message encouraging them to add books.

**Rationale**: Guides new users, explains why components are empty.

**Implementation**:
- Check book count on component mount
- If count = 0, show message: "No books yet! Add your first book to start tracking your reading."
- Hide statistics/search components or show with zero values

**Validation**: Empty state should be helpful, not confusing.

---

## Category 5: Data Validation Rules

### Rule 5.1: Required Fields for Statistics
**Rule**: Books must have title, author, status, totalPages, and createdAt to be included in statistics.

**Rationale**: These fields are essential for all calculations.

**Implementation**:
- Validate each book before including in calculations
- Skip books missing any required field
- No error shown (silent skip)

**Validation**: Books missing required fields should not cause errors.

---

### Rule 5.2: Valid Date Range
**Rule**: completedAt must be >= createdAt for completed books.

**Rationale**: Cannot complete before adding.

**Implementation**:
- Validate date range before including in pace calculation
- Skip books with invalid date range
- No error shown (silent skip)

**Validation**: Books with completedAt < createdAt should be excluded.

---

### Rule 5.3: Valid Progress Range
**Rule**: pagesRead must be >= 0 and <= totalPages.

**Rationale**: Cannot read negative pages or more than total.

**Implementation**:
- Validate progress range before including in pace calculation
- Skip books with invalid progress
- No error shown (silent skip)

**Validation**: Books with invalid progress should be excluded.

---

### Rule 5.4: Search Query Length
**Rule**: Search query must be 0-100 characters.

**Rationale**: Reasonable limit, prevents abuse.

**Implementation**:
- Validate query length before search
- Truncate if > 100 characters
- Or show error message

**Validation**: Queries > 100 characters should be rejected or truncated.

---

## Category 6: UI Behavior Rules

### Rule 6.1: Loading States
**Rule**: Show loading indicator during statistics calculation, search, and export.

**Rationale**: Provides feedback for async operations.

**Implementation**:
- Set isCalculating/isSearching/isExporting flag
- Show loading spinner or disable button
- Clear flag when operation completes

**Validation**: Loading indicator should appear during operations.

---

### Rule 6.2: Error Messages
**Rule**: Error messages must be clear, actionable, and non-technical.

**Rationale**: User-friendly error handling.

**Implementation**:
- Use plain language
- Explain what went wrong
- Suggest action if applicable
- Example: "Export failed. Please try again or contact support."

**Validation**: Error messages should be understandable by non-technical users.

---

### Rule 6.3: Success Messages
**Rule**: Success messages must confirm action and provide relevant details.

**Rationale**: Confirms operation completed successfully.

**Implementation**:
- Show success message after operation
- Include relevant details (e.g., book count)
- Auto-dismiss after 3-5 seconds

**Validation**: Success messages should appear after successful operations.

---

## Category 7: Performance Rules

### Rule 7.1: Statistics Calculation Performance
**Rule**: Statistics calculation must complete in < 100ms for 500 books.

**Rationale**: Acceptable user experience.

**Implementation**:
- Use efficient algorithms (O(n) complexity)
- Avoid nested loops where possible
- Calculate on-demand only

**Validation**: Measure calculation time, should be < 100ms for target scale.

---

### Rule 7.2: Search Performance
**Rule**: Search must complete in < 50ms for 500 books.

**Rationale**: Acceptable user experience.

**Implementation**:
- Use efficient string matching (includes())
- Single pass through books array
- No complex regex

**Validation**: Measure search time, should be < 50ms for target scale.

---

### Rule 7.3: Export Performance
**Rule**: Export generation must complete in < 100ms for 500 books.

**Rationale**: Acceptable user experience.

**Implementation**:
- Direct JSON.stringify() of books array
- No complex transformations
- Browser handles file download

**Validation**: Measure export time, should be < 100ms for target scale.

---

## Summary

**Total Rules**: 40+ business rules across 7 categories

**Categories**:
1. Statistics Calculation Rules (10 rules)
2. Search Functionality Rules (8 rules)
3. Export Functionality Rules (7 rules)
4. Component Integration Rules (4 rules)
5. Data Validation Rules (4 rules)
6. UI Behavior Rules (3 rules)
7. Performance Rules (3 rules)

**Key Principles**:
- User control (manual refresh, button-triggered search)
- Graceful degradation (skip invalid data, continue with valid)
- Clear feedback (loading states, success/error messages)
- Performance (efficient algorithms, on-demand calculation)
- Consistency (always show all statuses, last 12 months)
- Flexibility (partial match search, include reading books in pace)
