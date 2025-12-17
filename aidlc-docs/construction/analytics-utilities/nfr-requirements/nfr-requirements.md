# NFR Requirements - Unit 4: Analytics & Utilities

## Overview
This document defines the Non-Functional Requirements (NFRs) for the Analytics & Utilities unit, covering performance, scalability, reliability, usability, accessibility, security, and operational requirements.

---

## 1. Performance Requirements

### NFR-PERF-1: Statistics Calculation Performance
**Requirement**: Statistics calculation should complete without noticeable delay for collections up to 100 books.

**Rationale**: Trust native JavaScript performance for small collections, no specific timing targets needed.

**Acceptance Criteria**:
- Calculation completes without user-perceivable delay (< 1 second)
- No UI blocking during calculation
- No performance optimization required for target scale (100 books)

**Priority**: Medium

**Measurement**: Manual testing with 100-book collection

---

### NFR-PERF-2: Search Performance
**Requirement**: Search should complete without noticeable delay for collections up to 100 books.

**Rationale**: Native JavaScript string operations are sufficient for small collections.

**Acceptance Criteria**:
- Search completes without user-perceivable delay
- No debouncing or throttling required
- Button-triggered search (not real-time)

**Priority**: Medium

**Measurement**: Manual testing with 100-book collection

---

### NFR-PERF-3: Export Generation Performance
**Requirement**: Export generation should complete without noticeable delay for collections up to 100 books.

**Rationale**: JSON.stringify is fast enough for small collections.

**Acceptance Criteria**:
- Export generation completes without user-perceivable delay
- Browser handles file download efficiently
- No streaming or chunking required

**Priority**: Low

**Measurement**: Manual testing with 100-book collection

---

### NFR-PERF-4: UI Responsiveness
**Requirement**: UI should remain responsive during all operations.

**Rationale**: Operations are fast enough that no special handling is needed.

**Acceptance Criteria**:
- No UI blocking during calculations
- No loading spinners required
- No Web Workers or async processing needed

**Priority**: Medium

**Measurement**: Manual testing - UI should remain interactive

---

## 2. Scalability Requirements

### NFR-SCALE-1: Maximum Collection Size
**Requirement**: System should support book collections up to 100 books.

**Rationale**: Target use case is small personal reading collections.

**Acceptance Criteria**:
- All features work correctly with 100 books
- No performance degradation up to 100 books
- No explicit limit enforcement (graceful degradation beyond 100)

**Priority**: High

**Measurement**: Test with 100-book collection

---

### NFR-SCALE-2: Historical Data Depth
**Requirement**: Monthly statistics should display last 12 months of data.

**Rationale**: Provides sufficient trend analysis without overwhelming display.

**Acceptance Criteria**:
- Last 12 months always displayed (even if zero books)
- Older months displayed only if non-zero
- No configurable date range needed

**Priority**: Medium

**Measurement**: Verify 12-month display in UI

---

## 3. Reliability Requirements

### NFR-REL-1: Invalid Data Handling
**Requirement**: System should handle books with invalid/missing data gracefully by showing warnings.

**Rationale**: Provides transparency about data quality issues while continuing to function.

**Acceptance Criteria**:
- Invalid books identified and skipped in calculations
- Warning message displayed for each invalid book
- Valid books processed normally
- No application crashes due to invalid data

**Priority**: High

**Measurement**: Test with intentionally invalid book data

---

### NFR-REL-2: Calculation Error Recovery
**Requirement**: System should display error message if calculation fails completely.

**Rationale**: Clear feedback when statistics cannot be calculated.

**Acceptance Criteria**:
- Error message displayed if calculation fails
- No partial/incorrect statistics shown
- User can retry by clicking refresh again
- Error message is clear and actionable

**Priority**: High

**Measurement**: Test with edge cases that might cause calculation errors

---

### NFR-REL-3: Export Error Recovery
**Requirement**: System should provide manual download instructions if export fails.

**Rationale**: Fallback option for users when automatic download doesn't work.

**Acceptance Criteria**:
- Error message displayed if export fails
- Manual download instructions provided
- User can retry export
- Error message explains what went wrong

**Priority**: Medium

**Measurement**: Test export in various scenarios (large files, browser restrictions)

---

## 4. Usability Requirements

### NFR-USE-1: Statistics Refresh Feedback
**Requirement**: No explicit feedback required for statistics refresh (instant operation).

**Rationale**: Calculation is fast enough that feedback would be imperceptible.

**Acceptance Criteria**:
- Statistics update immediately on button click
- No loading spinner needed
- Button remains enabled during calculation

**Priority**: Low

**Measurement**: Manual testing - verify instant update

---

### NFR-USE-2: Search Feedback
**Requirement**: No explicit feedback required for search (instant operation).

**Rationale**: Search is fast enough that feedback would be imperceptible.

**Acceptance Criteria**:
- Search results display immediately on button click
- No loading spinner needed
- Button remains enabled during search

**Priority**: Low

**Measurement**: Manual testing - verify instant results

---

### NFR-USE-3: Export Preview Detail
**Requirement**: Export preview should show first 5 books (title, author, status) plus total count.

**Rationale**: Provides sufficient preview without overwhelming modal.

**Acceptance Criteria**:
- First 5 books displayed with key fields
- Total book count displayed
- Preview fits in modal without scrolling
- User can confirm or cancel export

**Priority**: Medium

**Measurement**: Verify preview display with various collection sizes

---

### NFR-USE-4: Empty State Messaging
**Requirement**: System should display onboarding message when user has no books.

**Rationale**: Guides new users and explains why components are empty.

**Acceptance Criteria**:
- Onboarding message displayed when book count = 0
- Message encourages user to add first book
- Message is friendly and helpful
- Statistics/search components show appropriate empty state

**Priority**: Medium

**Measurement**: Test with new user account (zero books)

---

## 5. Accessibility Requirements

### NFR-ACC-1: Keyboard Navigation
**Requirement**: System should support basic keyboard navigation (Tab + Enter).

**Rationale**: Enables keyboard-only users to access all functionality.

**Acceptance Criteria**:
- Tab key navigates between interactive elements
- Enter key activates buttons
- Focus indicators visible
- Logical tab order

**Priority**: Medium

**Measurement**: Test all features using keyboard only

---

### NFR-ACC-2: Screen Reader Support
**Requirement**: System should use semantic HTML for basic screen reader support.

**Rationale**: Provides baseline accessibility without additional ARIA complexity.

**Acceptance Criteria**:
- Semantic HTML elements used (button, input, etc.)
- Buttons have descriptive text
- Form inputs have labels
- No explicit ARIA labels required

**Priority**: Low

**Measurement**: Test with screen reader (basic functionality)

---

### NFR-ACC-3: Visual Indicators for Search
**Requirement**: Search results should highlight matching books and dim non-matching books.

**Rationale**: Clear visual distinction between matches and non-matches.

**Acceptance Criteria**:
- Matching books highlighted or shown normally
- Non-matching books dimmed/grayed out
- All books remain visible (not hidden)
- Match count displayed

**Priority**: High

**Measurement**: Verify visual distinction in UI

---

## 6. Security Requirements

### NFR-SEC-1: Export Data Security
**Requirement**: No special security measures required for export data.

**Rationale**: Data is already stored in browser localStorage (client-side only).

**Acceptance Criteria**:
- Export includes all book data as-is
- No encryption required
- No password protection required
- User responsible for file security after download

**Priority**: Low

**Measurement**: Verify export contains expected data

---

### NFR-SEC-2: Search Query Sanitization
**Requirement**: No sanitization required for search queries.

**Rationale**: Search is read-only operation with no data modification or display in HTML.

**Acceptance Criteria**:
- Search queries processed as plain text
- No HTML injection possible
- No XSS vulnerability (read-only operation)

**Priority**: Low

**Measurement**: Test with special characters in search query

---

## 7. Maintainability Requirements

### NFR-MAINT-1: Code Simplicity
**Requirement**: Code should use native JavaScript without additional libraries.

**Rationale**: Reduces dependencies, simplifies maintenance, sufficient for requirements.

**Acceptance Criteria**:
- No additional NPM dependencies for Unit 4
- Native Date, Array, String methods used
- No date libraries (date-fns, moment.js)
- No charting libraries
- No search libraries (Fuse.js)

**Priority**: High

**Measurement**: Verify package.json has no new dependencies

---

### NFR-MAINT-2: Consistent Architecture
**Requirement**: Code should follow same patterns as Units 1-3.

**Rationale**: Consistency across codebase, easier to understand and maintain.

**Acceptance Criteria**:
- Component-level logic (no service layer)
- CSS Modules for styling
- Manual localStorage access
- No complex state management

**Priority**: High

**Measurement**: Code review for consistency

---

## 8. Testability Requirements

### NFR-TEST-1: Manual Testing Only
**Requirement**: Unit 4 should use manual testing only (consistent with Units 1-3).

**Rationale**: Maintains consistency, sufficient for project scope.

**Acceptance Criteria**:
- No automated tests required
- Manual test procedures documented in TESTING.md
- Test coverage includes all user stories
- No formal coverage metrics

**Priority**: Medium

**Measurement**: TESTING.md updated with Unit 4 procedures

---

## 9. Operational Requirements

### NFR-OPS-1: Browser Compatibility
**Requirement**: System should support modern browsers only (Chrome, Firefox, Safari, Edge - latest 2 versions).

**Rationale**: Consistent with Units 1-3, simplifies development.

**Acceptance Criteria**:
- Works in latest 2 versions of major browsers
- No IE11 support required
- No polyfills required
- Native browser APIs used (Blob, createObjectURL)

**Priority**: High

**Measurement**: Test in Chrome, Firefox, Safari, Edge

---

### NFR-OPS-2: File Download Support
**Requirement**: Export should use Blob + createObjectURL for file download (modern browsers only).

**Rationale**: Native browser API, no additional libraries needed.

**Acceptance Criteria**:
- File downloads using Blob API
- createObjectURL used for download link
- No fallback to data URI needed
- Manual instructions provided if download fails

**Priority**: Medium

**Measurement**: Test file download in supported browsers

---

### NFR-OPS-3: Local Deployment Only
**Requirement**: Application runs locally only (no server deployment).

**Rationale**: Consistent with Units 1-3, client-side only application.

**Acceptance Criteria**:
- Runs via Vite dev server
- No production build required
- No server-side processing
- All operations client-side

**Priority**: High

**Measurement**: Verify application runs with `npm run dev`

---

## NFR Summary

### By Category

| Category | Requirements | Priority Breakdown |
|----------|--------------|-------------------|
| Performance | 4 | 2 Medium, 1 Low, 1 Medium |
| Scalability | 2 | 1 High, 1 Medium |
| Reliability | 3 | 2 High, 1 Medium |
| Usability | 4 | 2 Medium, 2 Low |
| Accessibility | 3 | 1 High, 1 Medium, 1 Low |
| Security | 2 | 2 Low |
| Maintainability | 2 | 2 High |
| Testability | 1 | 1 Medium |
| Operational | 3 | 2 High, 1 Medium |
| **Total** | **24** | **8 High, 9 Medium, 7 Low** |

### Priority Distribution
- **High Priority**: 8 requirements (33%)
- **Medium Priority**: 9 requirements (38%)
- **Low Priority**: 7 requirements (29%)

### Key Principles
1. **Simplicity**: No additional libraries, trust native JavaScript
2. **Consistency**: Follow Units 1-3 patterns and approaches
3. **Pragmatism**: No premature optimization, target scale is 100 books
4. **Transparency**: Show warnings for invalid data, clear error messages
5. **Accessibility**: Basic keyboard navigation and semantic HTML

### Dependencies on Other Units
- Inherits all tech stack decisions from Unit 1
- Uses storage utility from Unit 2
- Reads book data created in Units 2-3
- No new dependencies introduced

---

## Validation Checklist

- [ ] All NFRs are testable
- [ ] All NFRs have clear acceptance criteria
- [ ] All NFRs have assigned priority
- [ ] NFRs are consistent with Units 1-3
- [ ] No new dependencies introduced
- [ ] Performance targets appropriate for scale (100 books)
- [ ] Error handling specified for all operations
- [ ] Accessibility requirements defined
- [ ] Security requirements addressed
