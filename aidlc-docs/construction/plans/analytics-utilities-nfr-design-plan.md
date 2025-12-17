# NFR Design Plan - Unit 4: Analytics & Utilities

## Unit Overview
**Unit Name**: Analytics & Utilities  
**Purpose**: Implement analytics, search, and export features  
**Stories**: 7 stories (STAT-01, STAT-02, STAT-03, SEARCH-01, SEARCH-02, SEARCH-03, EXPORT-01)  
**Components**: StatisticsComponent, SearchComponent, ExportComponent (integrated into BookListComponent)

## NFR Design Steps

### Step 1: Analyze Context
- [x] Read functional design artifacts
- [x] Read NFR requirements artifacts
- [x] Understand design patterns needed

### Step 2: Create NFR Design Plan
- [x] Generate plan with checkboxes
- [x] Focus on implementation patterns

### Step 3: Generate Context-Appropriate Questions
- [x] Embed questions using [Answer]: tag format
- [x] Focus on design patterns and implementation approaches

### Step 4: Store Plan
- [x] Save as aidlc-docs/construction/plans/analytics-utilities-nfr-design-plan.md

### Step 5: Collect and Analyze Answers
- [x] Wait for user to complete all [Answer]: tags
- [x] Review responses for ambiguities (clarification resolved)

### Step 6: Generate NFR Design Artifacts
- [x] Create nfr-design-patterns.md
- [x] Create logical-components.md

### Step 7: Present Completion Message
- [ ] Present structured completion message

### Step 8: Wait for Explicit Approval
- [ ] Wait for user approval

### Step 9: Record Approval and Update Progress
- [ ] Log approval in audit.md
- [ ] Mark NFR Design complete in aidlc-state.md

---

## Design Pattern Questions

### Category 1: Statistics Component Patterns

**Q1: Statistics Component Structure**  
How should the StatisticsComponent be structured?

A) Single component with all statistics inline  
B) Parent component with sub-components (MonthlyStats, PaceStats, StatusStats)  
C) Single component with helper functions for each statistic  
D) Multiple separate components (one per statistic type)

[Answer]: A) Single component with all statistics inline  


**Q2: Statistics Calculation Trigger**  
Where should statistics calculation logic reside?

A) Inline in StatisticsComponent render method  
B) In component state with useEffect  
C) In separate utility functions called by component  
D) In custom hook (useStatistics)

[Answer]: A) Inline in StatisticsComponent render method  


**Q3: Statistics State Management**  
How should statistics data be managed?

A) Single useState with statistics object  
B) Multiple useState (one per statistic)  
C) useReducer for complex state  
D) No state (calculate on every render)

[Answer]: A) Single useState with statistics object  


**Q4: Invalid Book Warnings Display**  
How should warnings about invalid books be displayed?

A) Alert/notification component  
B) Inline text below statistics  
C) Tooltip on hover  
D) Collapsible warning section

[Answer]: B) Inline text below statistics  


---

### Category 2: Search Component Patterns

**Q5: Search Component Integration**  
How should SearchComponent integrate with BookListComponent?

A) Separate component, pass search results via props  
B) Inline in BookListComponent (no separate component)  
C) Separate component, use callback to update parent state  
D) Separate component with Context API

[Answer]: B) Inline in BookListComponent (no separate component)  


**Q6: Search State Management**  
How should search query and results be managed?

A) Local state in SearchComponent, pass results to parent  
B) State in BookListComponent, pass down to SearchComponent  
C) Shared context (SearchContext)  
D) URL query parameters

[Answer]: A) Local state in SearchComponent, pass results to parent  


**Q7: Search Execution Pattern**  
How should search be executed?

A) Inline function in SearchComponent  
B) Separate utility function (searchBooks)  
C) Custom hook (useSearch)  
D) Callback prop from parent

[Answer]: A) Inline function in SearchComponent  


**Q8: Search Result Highlighting**  
How should matching/non-matching books be styled?

A) Conditional CSS classes in BookItemComponent  
B) Wrapper component (HighlightedBookItem)  
C) Inline styles based on match status  
D) CSS pseudo-classes

[Answer]: A) Conditional CSS classes in BookItemComponent  


---

### Category 3: Export Component Patterns

**Q9: Export Functionality Location**  
Where should export functionality be implemented?

A) Button in StatisticsComponent, logic in BookListComponent  
B) Separate ExportComponent with all logic  
C) Utility function, triggered by button in StatisticsComponent  
D) Custom hook (useExport)

[Answer]: A) Button in StatisticsComponent, logic in BookListComponent  


**Q10: Export Preview Modal**  
How should the export preview modal be implemented?

A) Reuse existing Modal component from Unit 1  
B) Custom modal specific to export  
C) Browser confirm() dialog  
D) Inline preview (no modal)

[Answer]: A) Reuse existing Modal component from Unit 1  


**Q11: Export File Generation**  
Where should file generation logic reside?

A) Inline in export button click handler  
B) Separate utility function (generateExportFile)  
C) In ExportComponent  
D) In custom hook

[Answer]: A) Inline in export button click handler  


**Q12: Export Filename Generation**  
How should export filename be generated?

A) Inline string template  
B) Separate utility function (generateFilename)  
C) Constant with timestamp interpolation  
D) User input (prompt for filename)

[Answer]: A) Inline string template  


---

### Category 4: Component Communication Patterns

**Q13: Statistics Refresh Communication**  
How should statistics refresh be triggered?

A) Button in StatisticsComponent calls own refresh method  
B) Button in StatisticsComponent calls parent callback  
C) Event emitter pattern  
D) Context API

[Answer]: A) Button in StatisticsComponent calls own refresh method  


**Q14: Search to BookList Communication**  
How should search results be communicated to BookListComponent?

A) Props (matching book IDs array)  
B) Callback function  
C) Context API  
D) Event emitter

[Answer]: A) Props (matching book IDs array)  


**Q15: Export to BookList Communication**  
How should export access book data?

A) Props (books array passed down)  
B) Direct localStorage access  
C) Callback to parent to get books  
D) Context API

[Answer]: A) Props (books array passed down)  


---

### Category 5: Data Flow Patterns

**Q16: Book Data Access Pattern**  
How should components access book data?

A) Direct localStorage access in each component  
B) Props passed from BookListComponent  
C) Shared context (BooksContext)  
D) Custom hook (useBooks)

[Answer]: A) Direct localStorage access in each component  


**Q17: User Data Access Pattern**  
How should components access current user info?

A) AuthContext (inherited from Unit 2)  
B) Props passed from App component  
C) Direct localStorage access  
D) Custom hook (useCurrentUser)

[Answer]: A) AuthContext (inherited from Unit 2)  


---

### Category 6: Error Handling Patterns

**Q18: Calculation Error Handling**  
How should calculation errors be handled?

A) Try-catch in component, show error in UI  
B) Try-catch in utility function, return error object  
C) Error boundary component  
D) No explicit error handling (let it fail)

[Answer]: A) Try-catch in component, show error in UI  


**Q19: Export Error Handling**  
How should export errors be handled?

A) Try-catch with alert() for errors  
B) Try-catch with error state and UI message  
C) Error boundary component  
D) No explicit error handling

[Answer]: A) Try-catch with alert() for errors  

---

### Category 7: Utility Functions Organization

**Q20: Statistics Utility Functions**  
Where should statistics calculation functions be located?

A) Inline in StatisticsComponent  
B) Separate file: src/utils/statisticsCalculator.js  
C) In business logic model (no separate utility)  
D) In custom hook file

[Answer]: B) Separate file: src/utils/statisticsCalculator.js  


**Q21: Search Utility Functions**  
Where should search logic be located?

A) Inline in SearchComponent  
B) Separate file: src/utils/searchUtils.js  
C) In existing validation.js utility  
D) In custom hook file

[Answer]: A) Inline in SearchComponent  


**Q22: Export Utility Functions**  
Where should export logic be located?

A) Inline in export button handler  
B) Separate file: src/utils/exportUtils.js  
C) In existing storage.js utility  
D) In custom hook file

[Answer]: A) Inline in export button handler  


---

### Category 8: CSS Organization

**Q23: Statistics Component Styling**  
How should StatisticsComponent be styled?

A) Single CSS Module file (StatisticsComponent.module.css)  
B) Multiple CSS Module files (one per sub-section)  
C) Inline styles  
D) Extend global.css

[Answer]: A) Single CSS Module file (StatisticsComponent.module.css)  


**Q24: Search Component Styling**  
How should SearchComponent be styled?

A) Own CSS Module file (SearchComponent.module.css)  
B) Reuse existing form styles from Unit 1  
C) Inline styles  
D) Extend BookListComponent.module.css

A) Own CSS Module file (SearchComponent.module.css)  
[Answer]: 

**Q25: Search Result Highlighting Styles**  
How should search result highlighting be styled?

A) Classes in BookItemComponent.module.css (.highlighted, .dimmed)  
B) New CSS Module file (SearchResults.module.css)  
C) Inline styles  
D) Global CSS classes

[Answer]: A) Classes in BookItemComponent.module.css (.highlighted, .dimmed)  


---

## Summary

**Total Questions**: 25 questions across 8 categories

**Categories**:
1. Statistics Component Patterns (4 questions)
2. Search Component Patterns (4 questions)
3. Export Component Patterns (4 questions)
4. Component Communication Patterns (3 questions)
5. Data Flow Patterns (2 questions)
6. Error Handling Patterns (2 questions)
7. Utility Functions Organization (3 questions)
8. CSS Organization (3 questions)

**Key Focus Areas**:
- Component structure and organization
- State management patterns
- Communication between components
- Utility function organization
- Error handling approaches
- CSS organization

**Next Steps**:
1. User completes all [Answer]: tags
2. AI analyzes answers for ambiguities
3. AI generates NFR design artifacts
4. User reviews and approves NFR design
