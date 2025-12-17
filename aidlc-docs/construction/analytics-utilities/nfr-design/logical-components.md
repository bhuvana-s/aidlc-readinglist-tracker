# Logical Components - Unit 4: Analytics & Utilities

## Overview
This document defines the logical component architecture for Unit 4, including new components, utility modules, and integration with existing components from Units 1-3.

---

## New Components for Unit 4

### Component 1: StatisticsComponent

**Purpose**: Display reading statistics with refresh capability.

**Location**: `src/components/books/StatisticsComponent.jsx`

**Props**:
- `onExport`: Function - Callback to trigger export

**State**:
- `statistics`: Object | null - Calculated statistics
- `error`: String | null - Error message

**Methods**:
- `handleRefresh()`: Calculate and update statistics

**Renders**:
- Refresh button
- Export button
- Status counts with percentages
- Monthly added/completed books
- Reading pace
- Warnings for invalid books

**Dependencies**:
- AuthContext (current user)
- statisticsCalculator utility
- StatisticsComponent.module.css

---

### Component 2: SearchComponent

**Purpose**: Provide search functionality for book list.

**Location**: `src/components/books/SearchComponent.jsx`

**Props**:
- `onSearchResults`: Function - Callback with matching book IDs

**State**:
- `query`: String - Search query

**Methods**:
- `handleSearch()`: Execute search, call onSearchResults
- `handleClear()`: Clear search, show all books

**Renders**:
- Search input
- Search button
- Clear button

**Dependencies**:
- AuthContext (current user)
- storage utility (getBooks)
- SearchComponent.module.css

---

## Modified Components from Previous Units

### BookListComponent (Unit 2)

**New Additions**:
- Import and render StatisticsComponent
- Import and render SearchComponent
- Add `searchResults` state
- Add `handleExport` method
- Add `showExportModal` and `exportPreview` state
- Add export preview modal
- Filter displayed books based on search results
- Pass `isSearchMatch` prop to BookItemComponent

**New Props Passed Down**:
- To StatisticsComponent: `onExport={handleExport}`
- To SearchComponent: `onSearchResults={setSearchResults}`
- To BookItemComponent: `isSearchMatch={searchResults ? searchResults.includes(book.bookId) : null}`

---

### BookItemComponent (Unit 2)

**New Additions**:
- Accept `isSearchMatch` prop
- Apply conditional CSS class for dimming non-matches

**CSS Changes**:
- Add `.dimmed` class to BookItemComponent.module.css

---

## New Utility Modules

### statisticsCalculator.js

**Purpose**: Calculate reading statistics from book data.

**Location**: `src/utils/statisticsCalculator.js`

**Exports**:
- `calculateStatistics(userId)`: Main function
- Helper functions (internal):
  - `calculateStatusCounts(books)`
  - `calculateStatusPercentages(books)`
  - `calculateMonthlyAdded(books)`
  - `calculateMonthlyCompleted(books)`
  - `calculateReadingPace(books)`

**Dependencies**:
- storage utility (getBooks)

---

## Component Hierarchy

```
App
└── BookListComponent (modified)
    ├── StatisticsComponent (new)
    │   └── Export button → triggers handleExport in BookListComponent
    ├── SearchComponent (new)
    │   └── Calls onSearchResults callback
    ├── BookFormModal (existing)
    └── BookItemComponent[] (modified)
        └── Conditional dimming based on isSearchMatch prop

Modal (reused for export preview)
```

---

## Data Flow

### Statistics Flow
```
1. User clicks "Refresh Statistics" in StatisticsComponent
2. StatisticsComponent calls statisticsCalculator.calculateStatistics(userId)
3. statisticsCalculator reads books from localStorage
4. Statistics calculated and returned
5. StatisticsComponent updates state and displays results
```

### Search Flow
```
1. User enters query and clicks "Search" in SearchComponent
2. SearchComponent reads books from localStorage
3. SearchComponent filters books by query
4. SearchComponent calls onSearchResults(matchingIds)
5. BookListComponent updates searchResults state
6. BookListComponent filters displayed books
7. BookItemComponents receive isSearchMatch prop
8. Non-matching books are dimmed
```

### Export Flow
```
1. User clicks "Export" button in StatisticsComponent
2. StatisticsComponent calls onExport callback
3. BookListComponent.handleExport reads books from localStorage
4. BookListComponent shows export preview modal
5. User confirms export
6. BookListComponent.confirmExport generates JSON and triggers download
7. Success message displayed
```

---

## File Structure

### New Files (6 files)
```
src/
├── components/
│   └── books/
│       ├── StatisticsComponent.jsx (new)
│       ├── StatisticsComponent.module.css (new)
│       ├── SearchComponent.jsx (new)
│       └── SearchComponent.module.css (new)
└── utils/
    └── statisticsCalculator.js (new)
```

### Modified Files (4 files)
```
src/
└── components/
    └── books/
        ├── BookListComponent.jsx (modified)
        ├── BookListComponent.module.css (modified)
        ├── BookItemComponent.jsx (modified)
        └── BookItemComponent.module.css (modified)
```

**Total**: 6 new files, 4 modified files

---

## Component Communication

### StatisticsComponent ↔ BookListComponent
- **Direction**: StatisticsComponent → BookListComponent
- **Method**: Callback prop (`onExport`)
- **Data**: Export trigger (no data passed)

### SearchComponent ↔ BookListComponent
- **Direction**: SearchComponent → BookListComponent
- **Method**: Callback prop (`onSearchResults`)
- **Data**: Array of matching book IDs or null

### BookListComponent ↔ BookItemComponent
- **Direction**: BookListComponent → BookItemComponent
- **Method**: Props
- **Data**: `isSearchMatch` boolean or null

---

## External Dependencies

### Inherited from Previous Units
- React 18+
- React Router v6
- AuthContext (Unit 2)
- Modal component (Unit 1)
- storage utility (Unit 2)

### No New NPM Dependencies
All functionality implemented with native JavaScript and existing utilities.

---

## Bundle Size Impact

### Estimated Code Size
- StatisticsComponent: ~3 KB
- SearchComponent: ~1 KB
- statisticsCalculator utility: ~2 KB
- CSS files: ~2 KB
- Modifications to existing components: ~1 KB
- **Total Unit 4**: ~9 KB

### Cumulative Bundle Size
- Units 1-3: ~156 KB gzipped
- Unit 4: ~9 KB gzipped
- **Total**: ~165 KB gzipped

**Status**: ✅ Well under 250 KB target

---

## Testing Strategy

### Manual Testing Procedures
1. **Statistics Testing**:
   - Test with 0 books (onboarding message)
   - Test with various book counts
   - Test monthly grouping (last 12 months + older)
   - Test reading pace calculation
   - Test invalid book warnings

2. **Search Testing**:
   - Test partial match on title
   - Test partial match on author
   - Test case-insensitive search
   - Test empty query (show all)
   - Test no results
   - Test clear search

3. **Export Testing**:
   - Test export with 0 books (error)
   - Test export preview display
   - Test export confirmation
   - Test export cancellation
   - Test file download
   - Test filename format

4. **Integration Testing**:
   - Test statistics + search together
   - Test export after search (exports all, not just filtered)
   - Test statistics refresh after book changes

---

## Performance Considerations

### Statistics Calculation
- **Complexity**: O(n) where n = number of books
- **Target**: < 100ms for 100 books
- **Optimization**: None needed for target scale

### Search
- **Complexity**: O(n) where n = number of books
- **Target**: < 50ms for 100 books
- **Optimization**: None needed for target scale

### Export
- **Complexity**: O(n) for JSON generation
- **Target**: < 100ms for 100 books
- **Optimization**: None needed for target scale

---

## Accessibility

### Keyboard Navigation
- All buttons accessible via Tab key
- Enter key activates buttons
- Escape key closes export modal

### Screen Readers
- Semantic HTML elements used
- Buttons have descriptive text
- Search input has placeholder

### Visual Indicators
- Search results: Matching books normal, non-matching dimmed
- Statistics: Clear section headings
- Errors: Distinct error styling

---

## Notes

- All components follow simple, inline patterns from Units 1-3
- No complex state management or custom hooks
- Direct localStorage access for simplicity
- Reuses existing Modal component for export preview
- Statistics calculator is only new utility module
- Search and export logic kept inline for simplicity
