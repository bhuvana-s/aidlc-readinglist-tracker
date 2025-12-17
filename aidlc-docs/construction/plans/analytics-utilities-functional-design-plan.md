# Functional Design Plan - Unit 4: Analytics & Utilities

## Unit Overview
**Unit Name**: Analytics & Utilities  
**Purpose**: Implement analytics, search, and utility features that provide insights and convenience  
**Stories**: 7 stories (STAT-01, STAT-02, STAT-03, SEARCH-01, SEARCH-02, SEARCH-03, EXPORT-01)  
**Components**: StatisticsComponent, SearchComponent, ExportComponent

## Functional Design Steps

### Step 1: Analyze Unit Context
- [x] Read unit definition from unit-of-work.md
- [x] Read assigned stories from unit-of-work-story-map.md
- [x] Understand unit responsibilities and boundaries

### Step 2: Create Functional Design Plan
- [x] Generate plan with checkboxes for functional design
- [x] Focus on business logic, domain models, business rules

### Step 3: Generate Context-Appropriate Questions
- [x] Embed questions using [Answer]: tag format
- [x] Focus on ambiguities, missing information, areas needing clarification

### Step 4: Store Plan
- [x] Save as aidlc-docs/construction/plans/analytics-utilities-functional-design-plan.md

### Step 5: Collect and Analyze Answers
- [x] Wait for user to complete all [Answer]: tags
- [x] Review responses for vague or ambiguous answers
- [x] Create clarification questions if needed (none needed - all answers clear)

### Step 6: Generate Functional Design Artifacts
- [x] Create business-logic-model.md
- [x] Create business-rules.md
- [x] Create domain-entities.md

### Step 7: Present Completion Message
- [ ] Present structured completion message

### Step 8: Wait for Explicit Approval
- [ ] Wait for user approval

### Step 9: Record Approval and Update Progress
- [ ] Log approval in audit.md
- [ ] Mark Functional Design complete in aidlc-state.md

---

## Clarification Questions

### Category 1: Statistics Calculation - Books Per Month (STAT-01)

**Q1: Monthly Grouping Logic**  
How should books be grouped by month for the "Books Per Month" statistic?

A) By completion date only (completedAt field) - only count books when they reach 100%  
B) By creation date (createdAt field) - count when book was added to collection  
C) By both - show separate metrics for "added per month" and "completed per month"  
D) By status change date - track when status changed to "Completed"

[Answer]: C) By both - show separate metrics for "added per month" and "completed per month" 

**Q2: Month Display Range**  
What time range should be displayed for monthly statistics?

A) Last 12 months only (rolling 12-month window)  
B) All months since user registration (complete history)  
C) Current year only (January to December of current year)  
D) Configurable range (user can select start/end dates)

[Answer]: B) All months since user registration (complete history)  


**Q3: Zero-Book Months**  
Should months with zero completed books be displayed?

A) Yes, show all months in range with zero counts  
B) No, only show months with at least one completed book  
C) Show last 12 months always, older months only if non-zero

[Answer]: C) Show last 12 months always, older months only if non-zero


**Q4: Month Display Format**  
How should months be displayed in the statistics?

A) Full month name and year (e.g., "December 2025")  
B) Abbreviated month and year (e.g., "Dec 2025")  
C) Month/Year numeric (e.g., "12/2025")  
D) Relative format (e.g., "This month", "Last month", then dates)

[Answer]: B) Abbreviated month and year (e.g., "Dec 2025")  


---

### Category 2: Statistics Calculation - Reading Pace (STAT-02)

**Q5: Reading Pace Calculation Method**  
How should reading pace (pages per day/week) be calculated?

A) Average across all completed books (total pages / total days)  
B) Average per book, then average those averages  
C) Only books completed in last 30 days (recent pace)  
D) Weighted average (recent books weighted more heavily)

[Answer]: B) Average per book, then average those averages  


**Q6: Reading Duration Calculation**  
How should the reading duration for a book be determined?

A) completedAt - createdAt (time from adding book to completion)  
B) Require explicit "started reading" date field (new field needed)  
C) Use first progress update date as start date  
D) Assume instant start (duration = 0 if completed same day as added)

[Answer]: A) completedAt - createdAt (time from adding book to completion)  


**Q7: Pace Display Format**  
How should reading pace be displayed?

A) Pages per day only (e.g., "42 pages/day")  
B) Pages per week only (e.g., "294 pages/week")  
C) Both pages per day AND pages per week  
D) Adaptive (show per day if < 100, per week if >= 100)

[Answer]: A) Pages per day only (e.g., "42 pages/day")  


**Q8: Incomplete Books in Pace Calculation**  
Should books with "Reading" status be included in pace calculations?

A) No, only completed books (status = "Completed")  
B) Yes, include current progress (pagesRead / days elapsed)  
C) Separate metrics (completed pace vs. current pace)  
D) User configurable (toggle to include/exclude)

[Answer]: B) Yes, include current progress (pagesRead / days elapsed)  

**Q9: Zero-Duration Books**  
How should books completed on the same day they were added be handled?

A) Exclude from pace calculation (avoid division by zero)  
B) Assume 1 day minimum duration  
C) Include with actual duration (0 days = infinite pace, handle specially)  
D) Show warning and exclude from average

[Answer]: D) Show warning and exclude from average

---

### Category 3: Statistics Calculation - Books by Status (STAT-03)

**Q10: Status Count Display**  
What information should be displayed for "Books by Status Count"?

A) Simple counts only (e.g., "Reading: 5, Completed: 12, Wishlist: 8")  
B) Counts with percentages (e.g., "Reading: 5 (20%)")  
C) Counts with visual bars (horizontal bar chart)  
D) All of the above (counts, percentages, visual bars)

[Answer]: B) Counts with percentages (e.g., "Reading: 5 (20%)")  


**Q11: Total Books Count**  
Should a total books count be displayed?

A) Yes, show total count prominently (sum of all statuses)  
B) No, only show individual status counts  
C) Yes, but only as a small label (not prominent)

[Answer]: A) Yes, show total count prominently (sum of all statuses)  


**Q12: Empty Status Display**  
How should statuses with zero books be displayed?

A) Show all three statuses always, even if zero  
B) Only show statuses with at least one book  
C) Show all statuses, but gray out zero counts

[Answer]: A) Show all three statuses always, even if zero  

---

### Category 4: Search Functionality (SEARCH-01, SEARCH-02, SEARCH-03)

**Q13: Search Matching Logic**  
How should search matching work for title and author?

A) Exact match only (case-insensitive)  
B) Partial match (substring search, case-insensitive)  
C) Starts-with match (case-insensitive)  
D) Fuzzy match (allow minor typos)

[Answer]: B) Partial match (substring search, case-insensitive)  

**Q14: Combined Search Behavior**  
When searching, should title and author be searched together or separately?

A) Single search box searches both title AND author (OR logic)  
B) Separate search boxes for title and author (AND logic if both filled)  
C) Single search box with dropdown to select "Title" or "Author" or "Both"  
D) Single search box, searches both, but show which field matched

[Answer]: A) Single search box searches both title AND author (OR logic)  

**Q15: Search Timing**  
When should search filtering be applied?

A) Real-time as user types (debounced, e.g., 300ms delay)  
B) On Enter key press only  
C) On "Search" button click only  
D) Real-time with no debounce (instant)

[Answer]: C) On "Search" button click only  


**Q16: Search Result Display**  
How should search results be displayed?

A) Replace book list with filtered results (same layout)  
B) Highlight matching books in full list (dim non-matches)  
C) Show count of matches above list (e.g., "5 books found")  
D) Options A and C (replace list + show count)

[Answer]: B) Highlight matching books in full list (dim non-matches)  


**Q17: Empty Search Results**  
What should be displayed when search returns no results?

A) Empty list with message "No books found matching '[query]'"  
B) Show all books with message "No matches, showing all books"  
C) Empty list with suggestion to clear search  
D) Empty list with message and "Clear Search" button

[Answer]: A) Empty list with message "No books found matching '[query]'"  


**Q18: Search Persistence**  
Should search query persist when navigating away and back?

A) No, clear search when navigating away  
B) Yes, maintain search query in component state  
C) Yes, store search query in URL query parameter  
D) Yes, store search query in localStorage

[Answer]: A) No, clear search when navigating away  


---

### Category 5: Export Functionality (EXPORT-01)

**Q19: Export Data Scope**  
What data should be included in the JSON export?

A) All book fields exactly as stored (complete data dump)  
B) Only user-visible fields (exclude internal IDs, timestamps)  
C) Configurable (user selects which fields to export)  
D) All book fields + user metadata (email, registration date)

[Answer]: A) All book fields exactly as stored (complete data dump)  


**Q20: Export File Naming**  
How should the exported JSON file be named?

A) Fixed name (e.g., "reading-list.json")  
B) Include username (e.g., "reading-list-[email].json")  
C) Include timestamp (e.g., "reading-list-2025-12-17.json")  
D) Include both username and timestamp

[Answer]: D) Include both username and timestamp


**Q21: Export Format Structure**  
What JSON structure should the export use?

A) Array of books only (e.g., [{ book1 }, { book2 }])  
B) Object with metadata (e.g., { user: "...", books: [...], exportedAt: "..." })  
C) Match import format exactly (for easy re-import)  
D) Nested structure by status (e.g., { reading: [...], completed: [...], wishlist: [...] })

[Answer]: A) Array of books only (e.g., [{ book1 }, { book2 }])  


**Q22: Export Trigger**  
How should the export be triggered?

A) Button click immediately downloads file  
B) Button click shows preview, then user confirms download  
C) Button click shows modal with export options, then downloads  
D) Automatic export on schedule (e.g., weekly backup)

[Answer]: B) Button click shows preview, then user confirms download  


**Q23: Export Feedback**  
What feedback should be provided after export?

A) No feedback (file downloads silently)  
B) Success message (e.g., "Export complete: 25 books exported")  
C) Success message with file size (e.g., "Exported 25 books (12 KB)")  
D) Success message with option to export again

[Answer]: B) Success message (e.g., "Export complete: 25 books exported")  


---

### Category 6: Component Integration & Data Flow

**Q24: Statistics Update Frequency**  
When should statistics be recalculated?

A) On component mount only (static until page refresh)  
B) On every book list change (add, edit, delete, progress update)  
C) On manual refresh button click  
D) On a timer (e.g., every 30 seconds)

[Answer]: C) On manual refresh button click  


**Q25: Search Component Placement**  
Where should the search component be placed in the UI?

A) Above book list (integrated into BookListComponent)  
B) Separate page/route (e.g., /search)  
C) Sidebar or panel (always visible)  
D) Modal/overlay (triggered by search icon)

[Answer]: A) Above book list (integrated into BookListComponent)  


**Q26: Statistics Component Placement**  
Where should the statistics component be placed in the UI?

A) Above book list (integrated into BookListComponent)  
B) Separate page/route (e.g., /statistics or /dashboard)  
C) Sidebar or panel (always visible)  
D) Collapsible section above book list (expand/collapse)

[Answer]: A) Above book list (integrated into BookListComponent)  


**Q27: Export Component Placement**  
Where should the export functionality be placed in the UI?

A) Button in header/toolbar (always visible)  
B) Button in settings or menu (secondary location)  
C) Button in statistics component (export stats + books)  
D) Button in book list header (near search)

[Answer]: C) Button in statistics component (export stats + books)  


---

### Category 7: Error Handling & Edge Cases

**Q28: No Books Scenario**  
How should components handle a user with zero books?

A) Show empty state message for each component  
B) Hide statistics/search components entirely  
C) Show components with zero values/empty results  
D) Show onboarding message encouraging user to add books

[Answer]: D) Show onboarding message encouraging user to add books


**Q29: Calculation Errors**  
How should calculation errors (e.g., invalid dates, missing fields) be handled?

A) Skip invalid books, calculate with valid data only  
B) Show error message, don't display statistics  
C) Show partial statistics with warning about invalid data  
D) Attempt to fix/default invalid data, then calculate

[Answer]: A) Skip invalid books, calculate with valid data only  


**Q30: Export Errors**  
How should export errors (e.g., browser doesn't support download) be handled?

A) Show error message only  
B) Show error message with fallback (copy JSON to clipboard)  
C) Show error message with manual download instructions  
D) Retry automatically, then show error if still fails

[Answer]: C) Show error message with manual download instructions  


---

## Summary

**Total Questions**: 30 questions across 7 categories

**Categories**:
1. Statistics Calculation - Books Per Month (4 questions)
2. Statistics Calculation - Reading Pace (5 questions)
3. Statistics Calculation - Books by Status (3 questions)
4. Search Functionality (6 questions)
5. Export Functionality (5 questions)
6. Component Integration & Data Flow (4 questions)
7. Error Handling & Edge Cases (3 questions)

**Next Steps**:
1. User completes all [Answer]: tags
2. AI analyzes answers for ambiguities
3. AI generates functional design artifacts (business-logic-model.md, business-rules.md, domain-entities.md)
4. User reviews and approves functional design
