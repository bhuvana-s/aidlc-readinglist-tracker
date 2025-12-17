# Code Generation Plan - Unit 4: Analytics & Utilities

## Unit Overview
**Unit Name**: Analytics & Utilities  
**Purpose**: Implement analytics, search, and export features  
**Stories**: 7 stories (STAT-01, STAT-02, STAT-03, SEARCH-01, SEARCH-02, SEARCH-03, EXPORT-01)

## Code Generation Steps

### PART 1: Planning (Steps 1-2)
- [x] Step 1: Load all design artifacts
- [x] Step 2: Create detailed code generation plan

### PART 2: Generation (Steps 3-15)
- [x] Step 3: Create statisticsCalculator utility
- [x] Step 4: Create StatisticsComponent
- [x] Step 5: Create StatisticsComponent CSS
- [x] Step 6: Create SearchComponent
- [x] Step 7: Create SearchComponent CSS
- [x] Step 8: Modify BookListComponent (add statistics, search, export)
- [x] Step 9: Modify BookListComponent CSS
- [x] Step 10: Modify BookItemComponent (add search highlighting)
- [x] Step 11: Modify BookItemComponent CSS
- [x] Step 11.1: **BUG FIX** - Fixed AuthContext usage in StatisticsComponent and SearchComponent
- [x] Step 11.2: **BUG FIX** - Fixed storage key mismatch in SearchComponent and statisticsCalculator
- [ ] Step 12: Test statistics functionality (USER TESTING)
- [ ] Step 13: Test search functionality (USER TESTING)
- [ ] Step 14: Test export functionality (USER TESTING)
- [ ] Step 15: Update documentation (TESTING.md, README.md)

---

## Detailed Implementation Steps

### Step 3: Create statisticsCalculator Utility (15 min)
**File**: `src/utils/statisticsCalculator.js`

**Tasks**:
- [ ] Create calculateStatistics main function
- [ ] Implement calculateStatusCounts helper
- [ ] Implement calculateStatusPercentages helper
- [ ] Implement calculateMonthlyAdded helper
- [ ] Implement calculateMonthlyCompleted helper
- [ ] Implement calculateReadingPace helper
- [ ] Add error handling for invalid data
- [ ] Add warnings for excluded books

**Acceptance Criteria**:
- All calculation functions implemented
- Returns complete statistics object
- Handles edge cases (0 books, invalid data)
- Warnings collected for invalid books

---

### Step 4: Create StatisticsComponent (30 min)
**File**: `src/components/books/StatisticsComponent.jsx`

**Tasks**:
- [ ] Create component structure
- [ ] Add statistics state (useState)
- [ ] Add error state (useState)
- [ ] Implement handleRefresh method
- [ ] Render refresh button
- [ ] Render export button
- [ ] Render status counts section
- [ ] Render monthly added section
- [ ] Render monthly completed section
- [ ] Render reading pace section
- [ ] Render warnings section
- [ ] Render error message
- [ ] Add AuthContext integration

**Acceptance Criteria**:
- Component renders all statistics sections
- Refresh button triggers calculation
- Export button calls onExport callback
- Warnings displayed for invalid books
- Errors displayed gracefully

---

### Step 5: Create StatisticsComponent CSS (10 min)
**File**: `src/components/books/StatisticsComponent.module.css`

**Tasks**:
- [ ] Style container
- [ ] Style buttons
- [ ] Style status section
- [ ] Style monthly sections
- [ ] Style pace section
- [ ] Style warnings
- [ ] Style error messages
- [ ] Use design tokens from global.css

**Acceptance Criteria**:
- Clean, readable layout
- Consistent with app design
- Responsive styling

---

### Step 6: Create SearchComponent (20 min)
**File**: `src/components/books/SearchComponent.jsx`

**Tasks**:
- [ ] Create component structure
- [ ] Add query state (useState)
- [ ] Implement handleSearch method
- [ ] Implement handleClear method
- [ ] Render search input
- [ ] Render search button
- [ ] Render clear button
- [ ] Add AuthContext integration
- [ ] Add storage utility integration

**Acceptance Criteria**:
- Search input controlled
- Search button executes search
- Clear button resets search
- Callback called with results

---

### Step 7: Create SearchComponent CSS (10 min)
**File**: `src/components/books/SearchComponent.module.css`

**Tasks**:
- [ ] Style container
- [ ] Style input
- [ ] Style search button
- [ ] Style clear button
- [ ] Use design tokens

**Acceptance Criteria**:
- Clean, intuitive layout
- Buttons clearly labeled
- Consistent with app design

---

### Step 8: Modify BookListComponent (40 min)
**File**: `src/components/books/BookListComponent.jsx`

**Tasks**:
- [ ] Import StatisticsComponent
- [ ] Import SearchComponent
- [ ] Add searchResults state
- [ ] Add showExportModal state
- [ ] Add exportPreview state
- [ ] Implement handleExport method
- [ ] Implement confirmExport method
- [ ] Implement handleSearchResults callback
- [ ] Render StatisticsComponent above list
- [ ] Render SearchComponent above list
- [ ] Filter books based on searchResults
- [ ] Pass isSearchMatch prop to BookItemComponent
- [ ] Render export preview modal
- [ ] Add modal close handlers

**Acceptance Criteria**:
- Statistics and search integrated
- Export functionality working
- Search filters book list
- Modal displays preview correctly

---

### Step 9: Modify BookListComponent CSS (10 min)
**File**: `src/components/books/BookListComponent.module.css`

**Tasks**:
- [ ] Add styles for statistics section
- [ ] Add styles for search section
- [ ] Add styles for export modal content
- [ ] Ensure proper spacing

**Acceptance Criteria**:
- Clean layout with statistics and search
- Modal content styled appropriately

---

### Step 10: Modify BookItemComponent (10 min)
**File**: `src/components/books/BookItemComponent.jsx`

**Tasks**:
- [ ] Accept isSearchMatch prop
- [ ] Apply conditional className for dimming
- [ ] Update PropTypes if used

**Acceptance Criteria**:
- Non-matching books dimmed when search active
- Matching books display normally

---

### Step 11: Modify BookItemComponent CSS (5 min)
**File**: `src/components/books/BookItemComponent.module.css`

**Tasks**:
- [ ] Add .dimmed class
- [ ] Set opacity and grayscale for dimmed items

**Acceptance Criteria**:
- Dimmed books clearly distinguished
- Still readable but de-emphasized

---

### Step 11.1: BUG FIX - AuthContext Usage (COMPLETED)
**Files**: `src/components/books/StatisticsComponent.jsx`, `src/components/books/SearchComponent.jsx`

**Issue**: Components were using `currentUser` from AuthContext, but AuthContext only exports `currentUserId`

**Fix Applied**:
- Changed from `useContext(AuthContext)` to `useAuth()` hook
- Changed from `currentUser.userId` to `currentUserId`
- Updated imports to use the correct hook

**Status**: ✅ FIXED - No compilation errors

---

### Step 11.2: BUG FIX - Storage Key Mismatch (COMPLETED)
**Files**: `src/components/books/SearchComponent.jsx`, `src/utils/statisticsCalculator.js`

**Issue**: Components were using `getBooks(userId)` which uses global 'books' key, but app uses per-user keys `books_${userId}`

**Fix Applied**:
- Changed from `getBooks(userId)` to `getFromStorage(\`books_\${userId}\`) || []`
- Updated imports to use `getFromStorage` instead of `getBooks`
- Ensured consistency with BookListComponent's storage pattern

**Status**: ✅ FIXED - No compilation errors

---

### Step 12: Test Statistics Functionality (20 min)
**Tasks**:
- [ ] Test with 0 books (onboarding message)
- [ ] Test with various book counts
- [ ] Test status counts and percentages
- [ ] Test monthly grouping (last 12 months)
- [ ] Test reading pace calculation
- [ ] Test with invalid books (warnings)
- [ ] Test refresh button
- [ ] Test error handling

**Acceptance Criteria**:
- All statistics calculate correctly
- Warnings displayed for invalid data
- Errors handled gracefully

---

### Step 13: Test Search Functionality (15 min)
**Tasks**:
- [ ] Test search by title
- [ ] Test search by author
- [ ] Test partial match
- [ ] Test case-insensitive search
- [ ] Test empty query (show all)
- [ ] Test no results
- [ ] Test clear search
- [ ] Test highlighting/dimming

**Acceptance Criteria**:
- Search works for title and author
- Partial match functional
- Clear search resets view
- Visual distinction clear

---

### Step 14: Test Export Functionality (15 min)
**Tasks**:
- [ ] Test export with 0 books (error)
- [ ] Test export preview display
- [ ] Test export confirmation
- [ ] Test export cancellation
- [ ] Test file download
- [ ] Test filename format
- [ ] Test JSON content
- [ ] Test success message

**Acceptance Criteria**:
- Export generates valid JSON
- Preview shows correct data
- File downloads with correct name
- Success message displayed

---

### Step 15: Update Documentation (20 min)
**Files**: `TESTING.md`, `README.md`

**Tasks**:
- [ ] Add Unit 4 testing procedures to TESTING.md
- [ ] Document statistics testing
- [ ] Document search testing
- [ ] Document export testing
- [ ] Update README.md features section
- [ ] Update README.md project structure
- [ ] Update README.md usage instructions

**Acceptance Criteria**:
- Complete testing procedures documented
- README reflects new features
- Clear usage instructions

---

## Summary

**Total Steps**: 15 steps (2 planning + 13 implementation)

**Files to Create**: 6 files
1. src/utils/statisticsCalculator.js
2. src/components/books/StatisticsComponent.jsx
3. src/components/books/StatisticsComponent.module.css
4. src/components/books/SearchComponent.jsx
5. src/components/books/SearchComponent.module.css

**Files to Modify**: 6 files
1. src/components/books/BookListComponent.jsx
2. src/components/books/BookListComponent.module.css
3. src/components/books/BookItemComponent.jsx
4. src/components/books/BookItemComponent.module.css
5. TESTING.md
6. README.md

**Estimated Duration**: 3-4 hours

**User Stories Implemented**: 7 stories
- STAT-01: Books Per Month
- STAT-02: Reading Pace
- STAT-03: Books by Status Count
- SEARCH-01: Search by Title
- SEARCH-02: Search by Author
- SEARCH-03: Clear Search
- EXPORT-01: Export to JSON

---

## Next Steps

1. User approves this plan
2. AI executes steps 3-15 sequentially
3. AI marks each step complete as work is finished
4. User reviews and approves completed code generation
5. Proceed to Build and Test stage (after all units complete)
