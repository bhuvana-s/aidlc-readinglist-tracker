# Tech Stack Decisions - Unit 4: Analytics & Utilities

## Overview
This document records all technology stack decisions for Unit 4: Analytics & Utilities, including inherited decisions from previous units and any new decisions specific to this unit.

---

## Inherited Tech Stack (Units 1-3)

### Frontend Framework
**Decision**: React 18+  
**Source**: Unit 1 (UI Foundation)  
**Rationale**: Modern, component-based, excellent ecosystem  
**Status**: ✅ Confirmed sufficient for Unit 4

### Build Tool
**Decision**: Vite 4+  
**Source**: Unit 1 (UI Foundation)  
**Rationale**: Fast dev server, HMR, modern build tool  
**Status**: ✅ Confirmed sufficient for Unit 4

### Styling
**Decision**: CSS Modules + CSS Custom Properties  
**Source**: Unit 1 (UI Foundation)  
**Rationale**: Scoped styles, no naming conflicts, design tokens  
**Status**: ✅ Confirmed sufficient for Unit 4

### Programming Language
**Decision**: Plain JavaScript ES2020+  
**Source**: Unit 1 (UI Foundation)  
**Rationale**: No TypeScript overhead, modern JS features sufficient  
**Status**: ✅ Confirmed sufficient for Unit 4

### Routing
**Decision**: React Router v6  
**Source**: Unit 1 (UI Foundation)  
**Rationale**: Standard React routing solution  
**Status**: ✅ Confirmed sufficient for Unit 4 (no new routes needed)

### Security
**Decision**: bcryptjs for password hashing  
**Source**: Unit 2 (Core Features)  
**Rationale**: Secure password storage  
**Status**: ✅ Not applicable to Unit 4 (no authentication features)

### Data Storage
**Decision**: Browser localStorage  
**Source**: Unit 2 (Core Features)  
**Rationale**: Client-side only, no backend required  
**Status**: ✅ Confirmed sufficient for Unit 4 (read-only access)

### Testing
**Decision**: Manual testing only  
**Source**: Unit 1 (UI Foundation)  
**Rationale**: Sufficient for project scope, no automated tests  
**Status**: ✅ Confirmed for Unit 4

### Deployment
**Decision**: Local development only (Vite dev server)  
**Source**: Unit 1 (UI Foundation)  
**Rationale**: No production deployment required  
**Status**: ✅ Confirmed for Unit 4

---

## Unit 4 Specific Decisions

### Decision 1: Statistics Calculation - Native JavaScript

**Question**: Should we use a library for statistics calculation?

**Options Considered**:
- A) Native JavaScript (Date, Array methods)
- B) date-fns or moment.js for date handling
- C) Chart.js or Recharts for visualization
- D) Both date and charting libraries

**Decision**: A) Native JavaScript (Date, Array methods)

**Rationale**:
- Target scale is small (100 books)
- Native Date object sufficient for month grouping
- Array methods (filter, map, reduce) sufficient for calculations
- No complex date arithmetic required
- No charting/visualization required (text-based statistics)
- Reduces bundle size and dependencies

**Implementation**:
- Use `new Date()` for date parsing
- Use `Date.getMonth()`, `Date.getFullYear()` for grouping
- Use `Array.filter()`, `Array.map()`, `Array.reduce()` for calculations
- Use `toLocaleDateString()` for date formatting

**Status**: ✅ Approved

**Impact**: Zero new dependencies

---

### Decision 2: Search Implementation - Native String Methods

**Question**: Should we use a library for search functionality?

**Options Considered**:
- A) Native JavaScript string methods
- B) Fuse.js for fuzzy search
- C) Highlighting library for result display
- D) Both search and highlighting libraries

**Decision**: A) Native JavaScript string methods

**Rationale**:
- Partial match (substring search) is sufficient
- Native `String.includes()` is fast for small collections
- No fuzzy matching required
- Highlighting can be done with CSS (no library needed)
- Target scale is small (100 books)

**Implementation**:
- Use `String.toLowerCase()` for case-insensitive comparison
- Use `String.includes()` for partial matching
- Use CSS classes for highlighting (normal vs. dimmed)
- OR logic: match if found in title OR author

**Status**: ✅ Approved

**Impact**: Zero new dependencies

---

### Decision 3: Export Implementation - Native Blob API

**Question**: Should we use a library for file export?

**Options Considered**:
- A) Native JSON.stringify and Blob API
- B) file-saver library
- C) JSON formatting library
- D) Both file-saver and formatting libraries

**Decision**: A) Native JSON.stringify and Blob API

**Rationale**:
- Modern browsers support Blob and createObjectURL
- JSON.stringify is sufficient for export format
- No complex file handling required
- Target browsers all support native APIs
- Manual fallback instructions provided if download fails

**Implementation**:
- Use `JSON.stringify(books, null, 2)` for pretty-printed JSON
- Use `new Blob([jsonString], { type: 'application/json' })` for file creation
- Use `URL.createObjectURL(blob)` for download link
- Use `<a download="filename.json">` for triggering download

**Status**: ✅ Approved

**Impact**: Zero new dependencies

---

### Decision 4: Date Formatting - Native toLocaleDateString()

**Question**: How should dates be formatted for display?

**Options Considered**:
- A) Native JavaScript toLocaleDateString()
- B) Custom formatting function
- C) date-fns library
- D) Intl.DateTimeFormat API

**Decision**: A) Native JavaScript toLocaleDateString()

**Rationale**:
- Simple date formatting needs (month/year only)
- Native method sufficient for "MMM YYYY" format
- No complex date arithmetic required
- Reduces dependencies

**Implementation**:
- Use `date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })` for "Dec 2025" format
- Use `date.getMonth()` and `date.getFullYear()` for grouping logic
- Custom helper function for month name abbreviations if needed

**Status**: ✅ Approved

**Impact**: Zero new dependencies

---

### Decision 5: Performance Optimization - None Required

**Question**: Should we implement performance optimizations?

**Options Considered**:
- A) No optimization (trust native JavaScript)
- B) Debouncing/throttling for search
- C) Web Workers for calculations
- D) Memoization for expensive calculations

**Decision**: A) No optimization (trust native JavaScript)

**Rationale**:
- Target scale is small (100 books)
- Native JavaScript is fast enough for this scale
- Search is button-triggered (not real-time), so no debouncing needed
- Calculations are simple (O(n) complexity)
- Premature optimization avoided

**Implementation**:
- Direct calculation on button click
- No caching or memoization
- No Web Workers
- No debouncing

**Status**: ✅ Approved

**Impact**: Simpler code, easier to maintain

---

### Decision 6: UI Feedback - Minimal

**Question**: What UI feedback should be provided during operations?

**Options Considered**:
- A) No feedback (operations are instant)
- B) Loading spinners
- C) Progress bars
- D) Disable buttons during operations

**Decision**: A) No feedback (operations are instant)

**Rationale**:
- Operations complete in < 100ms for target scale
- Feedback would be imperceptible
- Simpler implementation
- Better user experience (no flashing spinners)

**Implementation**:
- No loading states
- Buttons remain enabled
- Results appear immediately

**Status**: ✅ Approved

**Impact**: Simpler code, better UX

---

### Decision 7: Error Handling - Show Warnings

**Question**: How should invalid book data be handled?

**Options Considered**:
- A) Skip invalid books silently
- B) Show warning for each invalid book
- C) Show error and don't display statistics
- D) Attempt to fix/default invalid data

**Decision**: B) Show warning for each invalid book

**Rationale**:
- Provides transparency about data quality
- User can identify and fix invalid books
- Doesn't block valid data from being displayed
- Better than silent failure

**Implementation**:
- Validate each book before including in calculations
- Collect warnings for invalid books
- Display warnings in UI (e.g., "2 books excluded: missing required fields")
- Continue calculation with valid books

**Status**: ✅ Approved

**Impact**: Better user feedback, data quality visibility

---

## Tech Stack Summary

### Core Technologies (Inherited)
| Technology | Version | Purpose | Source Unit |
|------------|---------|---------|-------------|
| React | 18+ | UI framework | Unit 1 |
| Vite | 4+ | Build tool | Unit 1 |
| CSS Modules | - | Styling | Unit 1 |
| JavaScript | ES2020+ | Programming language | Unit 1 |
| React Router | v6 | Routing | Unit 1 |
| localStorage | Native | Data storage | Unit 2 |

### Unit 4 Specific Technologies
| Technology | Version | Purpose | Decision |
|------------|---------|---------|----------|
| Date API | Native | Date handling | Decision 1, 4 |
| Array methods | Native | Statistics calculation | Decision 1 |
| String methods | Native | Search functionality | Decision 2 |
| Blob API | Native | File export | Decision 3 |
| createObjectURL | Native | File download | Decision 3 |
| JSON.stringify | Native | JSON generation | Decision 3 |

### New Dependencies for Unit 4
**Total**: 0 (zero)

All functionality implemented using native JavaScript and browser APIs.

---

## Browser API Usage

### APIs Used in Unit 4

| API | Purpose | Browser Support | Fallback |
|-----|---------|-----------------|----------|
| Date | Date parsing and formatting | All modern browsers | N/A (required) |
| Array methods | Statistics calculation | All modern browsers | N/A (required) |
| String methods | Search functionality | All modern browsers | N/A (required) |
| JSON.stringify | Export generation | All modern browsers | N/A (required) |
| Blob | File creation | All modern browsers | Manual instructions |
| URL.createObjectURL | Download link | All modern browsers | Manual instructions |
| localStorage | Data reading | All modern browsers | N/A (inherited) |

### Browser Compatibility
- **Target**: Modern browsers only (Chrome, Firefox, Safari, Edge - latest 2 versions)
- **No polyfills required**: All APIs natively supported
- **Fallback**: Manual download instructions if Blob/createObjectURL fails

---

## Bundle Size Impact

### Unit 4 Code Size Estimate
- **StatisticsComponent**: ~3 KB
- **SearchComponent**: ~1 KB
- **Export functionality**: ~1 KB
- **Utility functions**: ~2 KB
- **CSS**: ~2 KB
- **Total Unit 4**: ~9 KB

### Cumulative Bundle Size
- **Unit 1**: ~130 KB
- **Unit 2**: ~11 KB
- **Unit 3**: ~15 KB
- **Unit 4**: ~9 KB
- **Total**: ~165 KB gzipped

**Status**: ✅ Well under 250 KB target

---

## Development Tools

### Required Tools (Inherited)
- Node.js 18+ (for Vite)
- npm or yarn (package manager)
- Modern browser with DevTools
- Code editor (VS Code recommended)

### No Additional Tools for Unit 4
All development tools inherited from Unit 1.

---

## Testing Tools

### Manual Testing Only
- Browser DevTools for debugging
- Manual test procedures in TESTING.md
- No automated testing frameworks

**Rationale**: Consistent with Units 1-3, sufficient for project scope.

---

## Deployment

### Local Development Only
- **Dev Server**: Vite dev server (`npm run dev`)
- **Port**: 5173 (Vite default)
- **Hot Module Replacement**: Enabled
- **No Production Build**: Not required

**Rationale**: Consistent with Units 1-3, local development only.

---

## Decision Validation

### Validation Checklist
- [x] All decisions consistent with Units 1-3
- [x] Zero new dependencies added
- [x] All functionality achievable with native JavaScript
- [x] Browser compatibility maintained (modern browsers only)
- [x] Bundle size remains under target (< 250 KB)
- [x] Performance adequate for target scale (100 books)
- [x] Testing approach consistent (manual only)
- [x] Deployment approach consistent (local only)

### Risk Assessment
- **Low Risk**: All decisions use proven, native technologies
- **No Breaking Changes**: No changes to existing tech stack
- **No New Dependencies**: Zero maintenance burden from new libraries
- **Browser Support**: All APIs well-supported in target browsers

---

## Future Considerations

### If Scale Increases (> 100 books)
- Consider debouncing for real-time search
- Consider memoization for expensive calculations
- Consider pagination for book list
- Consider Web Workers for background calculations

### If Visualization Needed
- Consider Chart.js or Recharts for charts/graphs
- Consider D3.js for advanced visualizations

### If Advanced Search Needed
- Consider Fuse.js for fuzzy search
- Consider search highlighting library

**Current Decision**: Not needed for current requirements (100 books, basic features).

---

## Notes

- All Unit 4 decisions prioritize simplicity and consistency
- Zero new dependencies maintains low bundle size
- Native JavaScript sufficient for all requirements
- Consistent with "no premature optimization" principle
- Easy to maintain and understand
