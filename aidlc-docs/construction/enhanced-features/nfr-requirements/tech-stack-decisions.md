# Tech Stack Decisions - Unit 3: Enhanced Features

## Overview

This document records technology choices and rationale for Unit 3 (Enhanced Features), covering libraries, frameworks, tools, and implementation approaches for ISBN lookup, file import, progress tracking, and notes/ratings.

---

## Core Technology Stack (Inherited from Units 1 & 2)

### Frontend Framework
**Decision**: React 18+  
**Rationale**: Established in Unit 1, component-based architecture  
**Status**: Inherited, no changes

### Build Tool
**Decision**: Vite  
**Rationale**: Fast development server, optimized builds  
**Status**: Inherited, no changes

### Styling
**Decision**: CSS Modules  
**Rationale**: Scoped styles, no naming conflicts  
**Status**: Inherited, no changes

### State Management
**Decision**: React Hooks (useState, useContext)  
**Rationale**: Simple, built-in, sufficient for app complexity  
**Status**: Inherited, no changes

### Data Storage
**Decision**: Browser Local Storage  
**Rationale**: Simple, persistent, no backend needed  
**Status**: Inherited, no changes

---

## Unit 3 Specific Technology Decisions

### 1. ISBN Validation

**Decision**: Custom Implementation (No Library)

**Options Considered**:
- A) Custom implementation ✓ **SELECTED**
- B) Lightweight library (isbn-utils, isbn3)
- C) Comprehensive library (isbn-verify, isbn-validator)
- D) No validation (trust API)

**Rationale**:
- ISBN checksum algorithms are straightforward to implement
- No external dependencies needed
- Full control over validation logic
- Lightweight (< 50 lines of code)
- Educational value in understanding ISBN validation

**Implementation Approach**:
```javascript
// utils/isbnValidator.js
export function validateISBN(isbn) {
  // Strip non-digit characters (except 'X' for ISBN-10)
  // Validate length (10 or 13)
  // Calculate and verify checksum
  // Return true/false
}

export function validateISBN10(isbn) {
  // ISBN-10 checksum algorithm
}

export function validateISBN13(isbn) {
  // ISBN-13 checksum algorithm
}
```

**Trade-offs**:
- ✓ No dependencies
- ✓ Lightweight
- ✓ Full control
- ✗ Need to implement and test ourselves
- ✗ Potential for bugs in implementation

**Mitigation**: Comprehensive unit tests for validation logic

---

### 2. CSV Parsing

**Decision**: Native JavaScript (String.split)

**Options Considered**:
- A) Native JavaScript (String.split) ✓ **SELECTED**
- B) PapaParse (popular, feature-rich)
- C) csv-parse (lightweight)
- D) XLSX (supports CSV + Excel)

**Rationale**:
- Simple CSV format with fixed column order
- No complex CSV features needed (quoted fields, escaping)
- Native JavaScript sufficient for basic parsing
- No external dependencies
- Lightweight solution

**Implementation Approach**:
```javascript
// utils/importParser.js
export function parseCSV(csvText) {
  const lines = csvText.split('\n');
  const header = lines[0]; // Skip header row
  const rows = lines.slice(1);
  
  return rows.map(row => {
    const columns = row.split(',');
    return {
      title: columns[0],
      author: columns[1],
      status: columns[2] || 'Wishlist',
      totalPages: parseInt(columns[3]) || 0,
      // ... map other columns
    };
  });
}
```

**Limitations**:
- No support for quoted fields with commas
- No support for escaped characters
- Fixed column order required
- Basic error handling

**Acceptable Because**:
- Users control CSV format (export from same app)
- Simple use case (personal reading lists)
- Can document expected CSV format

**Trade-offs**:
- ✓ No dependencies
- ✓ Lightweight
- ✓ Simple implementation
- ✗ Limited CSV feature support
- ✗ Fragile with complex CSV files

**Future Consideration**: If users report CSV parsing issues, consider PapaParse

---

### 3. HTTP Client for ISBN API

**Decision**: Fetch API (Native)

**Options Considered**:
- A) Fetch API (native) ✓ **SELECTED**
- B) Axios (popular library)
- C) React Query (with caching)
- D) Custom wrapper (around fetch)

**Rationale**:
- Fetch API is built into modern browsers
- No external dependencies
- Sufficient for simple GET requests
- Lightweight solution
- Well-supported and standardized

**Implementation Approach**:
```javascript
// utils/isbnLookup.js
export async function lookupISBN(isbn) {
  const url = `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('API request failed');
    }
    const data = await response.json();
    return parseAPIResponse(data, isbn);
  } catch (error) {
    throw new Error('Unable to lookup ISBN');
  }
}
```

**Features Used**:
- GET requests
- JSON response parsing
- Error handling
- No retry logic (per NFR requirements)
- No timeout (browser default)

**Trade-offs**:
- ✓ No dependencies
- ✓ Native browser API
- ✓ Simple and lightweight
- ✗ Less features than Axios
- ✗ No automatic retry
- ✗ No request cancellation (not needed)

---

### 4. Progress Bar Component

**Decision**: Custom CSS (Simple Progress Bar)

**Options Considered**:
- A) Custom CSS (simple progress bar) ✓ **SELECTED**
- B) React component library (from Unit 1)
- C) Third-party library (react-circular-progressbar)
- D) HTML5 progress element (native)

**Rationale**:
- Simple linear progress bar sufficient
- Full control over styling
- Lightweight (< 20 lines of CSS)
- Matches design system from Unit 1
- No external dependencies

**Implementation Approach**:
```jsx
// BookItemComponent.jsx
<div className={styles.progressBar}>
  <div 
    className={styles.progressFill} 
    style={{ width: `${progress}%` }}
  />
  <span className={styles.progressText}>{progress}%</span>
</div>
```

```css
/* BookItemComponent.module.css */
.progressBar {
  width: 100%;
  height: 20px;
  background-color: #e0e0e0;
  border-radius: 10px;
  position: relative;
}

.progressFill {
  height: 100%;
  background-color: #4caf50;
  border-radius: 10px;
  transition: width 0.3s ease;
}

.progressText {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 12px;
  font-weight: bold;
}
```

**Features**:
- Linear progress bar
- Percentage text overlay
- Smooth animation (CSS transition)
- Responsive width
- Customizable colors

**Trade-offs**:
- ✓ Full control over styling
- ✓ Lightweight
- ✓ No dependencies
- ✓ Matches design system
- ✗ Need to implement ourselves
- ✗ No circular or advanced progress indicators

---

### 5. File Upload Handling

**Decision**: Native File Input (Simple)

**Options Considered**:
- A) Native file input (simple) ✓ **SELECTED**
- B) Drag-and-drop (enhanced UX)
- C) Library (react-dropzone)
- D) Both native + drag-and-drop

**Rationale**:
- Simple file selection sufficient
- Native file input well-supported
- No complex UX requirements
- Lightweight solution
- No external dependencies

**Implementation Approach**:
```jsx
// BookFormModal.jsx
<input
  type="file"
  accept=".json,.csv"
  onChange={handleFileSelect}
  className={styles.fileInput}
/>

function handleFileSelect(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = (e) => {
    const content = e.target.result;
    if (file.name.endsWith('.json')) {
      importJSON(content);
    } else if (file.name.endsWith('.csv')) {
      importCSV(content);
    }
  };
  reader.readAsText(file);
}
```

**Features**:
- File type filtering (.json, .csv)
- FileReader API for reading file content
- Simple click-to-select UX
- Standard browser file picker

**Trade-offs**:
- ✓ Simple implementation
- ✓ No dependencies
- ✓ Standard UX
- ✗ No drag-and-drop
- ✗ No multiple file selection
- ✗ Basic UX (not fancy)

**Future Consideration**: If users request drag-and-drop, can add later

---

### 6. State Management for Import

**Decision**: Component State (useState)

**Options Considered**:
- A) Component state (useState) ✓ **SELECTED**
- B) Context API (shared state)
- C) Reducer (useReducer)
- D) External library (Redux, Zustand)

**Rationale**:
- Import state is local to BookFormModal component
- No need to share state across components
- Simple state management sufficient
- useState is lightweight and built-in

**Implementation Approach**:
```jsx
// BookFormModal.jsx
function BookFormModal() {
  const [importMode, setImportMode] = useState('manual'); // 'manual', 'isbn', 'json', 'csv'
  const [isLoading, setIsLoading] = useState(false);
  const [importResult, setImportResult] = useState(null);
  
  // Import logic uses these state variables
}
```

**State Variables**:
- `importMode`: Current input mode (manual, ISBN, JSON, CSV)
- `isLoading`: Loading state during import/API call
- `importResult`: Result summary after import
- `formData`: Book form data (existing from Unit 2)

**Trade-offs**:
- ✓ Simple and lightweight
- ✓ No additional libraries
- ✓ Local state (no global pollution)
- ✗ Can't share state across components (not needed)
- ✗ May need prop drilling (acceptable for small component tree)

---

## External APIs

### Open Library API

**Decision**: Use Open Library API for ISBN lookup

**API Details**:
- **Endpoint**: `https://openlibrary.org/api/books`
- **Method**: GET
- **Parameters**: 
  - `bibkeys`: ISBN:{isbn}
  - `format`: json
  - `jscmd`: data
- **Authentication**: None required
- **Rate Limiting**: No strict limits for reasonable use
- **Cost**: Free

**Example Request**:
```
GET https://openlibrary.org/api/books?bibkeys=ISBN:9780743273565&format=json&jscmd=data
```

**Example Response**:
```json
{
  "ISBN:9780743273565": {
    "title": "The Great Gatsby",
    "authors": [
      { "name": "F. Scott Fitzgerald" }
    ],
    "number_of_pages": 180,
    "publishers": [
      { "name": "Scribner" }
    ],
    "publish_date": "2004"
  }
}
```

**Fields Used**:
- `title` → Book.title
- `authors[0].name` → Book.author
- `number_of_pages` → Book.totalPages

**Rationale**:
- Free and open API
- No API key required
- Good book coverage
- Simple JSON response
- HTTPS support

**Alternatives Considered**:
- Google Books API (requires API key, rate limits)
- ISBNdb API (paid service)
- Multiple APIs with fallback (added complexity)

**Trade-offs**:
- ✓ Free and open
- ✓ No authentication
- ✓ Good coverage
- ✗ No guaranteed uptime
- ✗ May have incomplete data
- ✗ No official SLA

---

## Development Tools

### Code Editor
**Decision**: Any modern code editor (VS Code, WebStorm, etc.)  
**Rationale**: Developer preference, no specific requirements

### Version Control
**Decision**: Git  
**Rationale**: Industry standard, already in use

### Package Manager
**Decision**: npm (inherited from Units 1 & 2)  
**Rationale**: Comes with Node.js, widely used

### Linting
**Decision**: ESLint (inherited from Unit 1)  
**Rationale**: Code quality, consistency

### Formatting
**Decision**: Prettier (inherited from Unit 1)  
**Rationale**: Consistent code formatting

---

## Testing Tools

### Unit Testing Framework
**Decision**: Vitest (inherited from Unit 1)

**Rationale**:
- Fast test execution
- Vite integration
- Jest-compatible API
- Modern testing framework

**Test Files**:
```
src/
  utils/
    isbnValidator.test.js
    importParser.test.js
    progressCalculator.test.js
```

### Testing Library
**Decision**: React Testing Library (if needed for component tests)

**Rationale**:
- User-centric testing
- Good React integration
- Encourages best practices

**Note**: Focus on unit tests for utility functions, minimal component testing

---

## File Organization

### New Files for Unit 3

```
src/
  components/
    books/
      BookFormModal.jsx (extended)
      BookItemComponent.jsx (extended)
  utils/
    isbnValidator.js (new)
    importParser.js (new)
    progressCalculator.js (new - if extracted)
  __tests__/
    isbnValidator.test.js (new)
    importParser.test.js (new)
    progressCalculator.test.js (new)
```

### Utility Modules

**isbnValidator.js**:
- `validateISBN(isbn)` - Main validation function
- `validateISBN10(isbn)` - ISBN-10 checksum
- `validateISBN13(isbn)` - ISBN-13 checksum
- `stripISBN(isbn)` - Remove hyphens/spaces

**importParser.js**:
- `parseJSON(jsonText)` - Parse JSON import
- `parseCSV(csvText)` - Parse CSV import
- `validateBook(book)` - Validate book data
- `detectDuplicates(newBook, existingBooks)` - Check duplicates

**isbnLookup.js**:
- `lookupISBN(isbn)` - Call Open Library API
- `parseAPIResponse(data, isbn)` - Extract book data from API response

**progressCalculator.js** (optional):
- `calculateProgress(currentPage, totalPages, status)` - Calculate progress percentage

---

## Dependency Summary

### New Dependencies: 0

**Rationale**: All Unit 3 features implemented with native JavaScript and React

### Total Project Dependencies (from Units 1 & 2):
- react
- react-dom
- react-router-dom
- vite
- @vitejs/plugin-react
- eslint
- prettier
- vitest (dev)

**Bundle Size Impact**: Minimal (< 5KB for Unit 3 code)

---

## Browser Compatibility

### Target Browsers
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Required Browser Features
- ES6+ JavaScript
- Fetch API
- Local Storage
- FileReader API
- CSS Grid and Flexbox
- CSS Modules

### Polyfills
**Decision**: No polyfills needed

**Rationale**: Target modern browsers only, all required features supported

---

## Performance Considerations

### Code Splitting
**Decision**: No code splitting for Unit 3

**Rationale**:
- Small code size (< 10KB)
- All features likely to be used
- Complexity not justified

### Lazy Loading
**Decision**: No lazy loading for Unit 3 components

**Rationale**:
- Components are small
- Part of main book management flow
- No performance benefit

### Caching
**Decision**: No caching for ISBN API responses

**Rationale**:
- Lookups are infrequent
- Data may change over time
- Complexity not justified

---

## Security Considerations

### Input Validation
- ISBN validation before API call
- File type validation before import
- HTML escaping for notes display

### API Security
- HTTPS for all API calls
- No sensitive data sent to API
- No API key exposure (not required)

### Data Security
- Local storage only (no server)
- No encryption (not required for reading lists)
- User responsible for browser security

---

## Deployment Considerations

### Build Process
**Decision**: Same as Units 1 & 2 (Vite build)

**Command**: `npm run build`

**Output**: Static files in `dist/` directory

### Hosting
**Decision**: Any static file hosting (Netlify, Vercel, GitHub Pages, etc.)

**Requirements**:
- Serve static files
- HTTPS support
- SPA routing support (fallback to index.html)

### Environment Variables
**Decision**: None required for Unit 3

**Rationale**: No API keys, no backend configuration

---

## Documentation

### Code Documentation
- JSDoc comments for utility functions
- Inline comments for complex logic
- README updates for new features

### User Documentation
- Update README with import instructions
- Document CSV format requirements
- Document ISBN lookup feature

---

## Future Considerations

### Potential Enhancements
1. **Drag-and-drop file upload** - If users request better UX
2. **PapaParse for CSV** - If users have complex CSV files
3. **Multiple ISBN APIs** - If Open Library is unreliable
4. **Progress bar animations** - If users want more visual feedback
5. **IndexedDB migration** - If users exceed local storage limits

### Technical Debt
- None identified for Unit 3
- Keep code simple and maintainable
- Avoid premature optimization

---

## Decision Log

| Decision | Date | Rationale | Status |
|----------|------|-----------|--------|
| Custom ISBN validation | 2025-12-17 | No dependencies, simple algorithms | Approved |
| Native CSV parsing | 2025-12-17 | Simple use case, no complex features needed | Approved |
| Fetch API for HTTP | 2025-12-17 | Native, sufficient for simple GET requests | Approved |
| Custom CSS progress bar | 2025-12-17 | Full control, matches design system | Approved |
| Native file input | 2025-12-17 | Simple UX sufficient | Approved |
| Component state (useState) | 2025-12-17 | Local state, no sharing needed | Approved |
| Open Library API | 2025-12-17 | Free, no auth, good coverage | Approved |

---

## Summary

### Key Decisions
- **Zero new dependencies** - All features use native JavaScript and React
- **Extend existing components** - Minimal new files
- **Simple implementations** - Avoid over-engineering
- **Custom utilities** - ISBN validation, CSV parsing, progress calculation

### Technology Philosophy
- **Simplicity over features** - Choose simple solutions
- **Native over libraries** - Prefer built-in APIs
- **Lightweight over comprehensive** - Keep bundle size small
- **Maintainable over clever** - Write clear, understandable code

### Alignment with NFR Requirements
- ✓ Performance: Lightweight, no heavy libraries
- ✓ Scalability: Adequate for 100-500 books
- ✓ Security: Basic protections in place
- ✓ Maintainability: Simple code, easy to understand
- ✓ Reliability: Standard error handling
- ✓ Usability: Clear feedback, semantic HTML

This tech stack supports a lightweight, maintainable, and user-friendly reading list tracker.

