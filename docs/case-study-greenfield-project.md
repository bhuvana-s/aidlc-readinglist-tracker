# Case Study: Greenfield Project

## Introduction

This case study demonstrates how AI-DLC (AI-Driven Development Life Cycle) was used to build a Reading List Tracker web application from scratch. The project showcases the complete AI-DLC workflow for a greenfield project, from initial requirements gathering through final implementation.

### The Project

The Reading List Tracker is a single-page web application that helps users manage their book collections. Users can add books, track reading progress, take notes, rate books, view statistics, and export their data. The application stores all data locally in the browser using localStorage, with user authentication to keep reading lists private.

### Technology Stack

- React 18+ with Vite 4+ for fast development
- CSS Modules for component-scoped styling
- Plain JavaScript (no TypeScript)
- React Router v6 for navigation
- bcryptjs for password security
- Browser localStorage for data persistence

### Project Scope

The application was decomposed into 4 units of work:
- **Unit 1**: UI Foundation (design system, common components)
- **Unit 2**: Core Features (authentication, book management)
- **Unit 3**: Enhanced Features (ISBN lookup, progress tracking, notes/ratings)
- **Unit 4**: Analytics & Utilities (statistics, search, export)

## Inception Phase

The Inception Phase focused on understanding what to build and why. This phase established the foundation for all subsequent work.

### Intent Analysis

The project started with a clear user request:

> "Using AI-DLC, create a Reading List Tracker web app, which will help you add books with title, author, status (reading/completed/wishlist), track reading progress (pages read) and derive simple statistics (books per month, reading pace), combine with Notes and ratings for each book. Let's store data as Json files."

The AI analyzed this request and identified it as a greenfield web application with moderate complexity, requiring multiple integrated components including authentication, data management, and analytics.

### Requirements Analysis

The AI generated 12 clarifying questions to resolve ambiguities in the initial request. Key questions covered:

- Architecture choice (server-side vs client-side)
- Data storage approach (cloud vs local)
- User management (single vs multiple users)
- Progress tracking method (percentage vs page count)
- Book entry methods (manual, ISBN, import)
- UI design preferences (minimal vs modern)

One critical contradiction was detected: the user initially selected "server-side rendered application" but also chose "browser's local storage." The AI caught this inconsistency and asked for clarification, leading to the decision to build a client-side SPA with localStorage.

**Key Takeaway**: The AI's ability to detect contradictions early prevented architectural problems later in the project.

### User Stories

The team created 25 feature-level user stories organized into 8 feature areas. All stories followed the classic format: "As a Reader, I want [goal], so that [benefit]."

Example stories:
- **AUTH-01**: As a Reader, I want to register for an account with my email and password, so that I can have my own private reading list.
- **BOOK-01**: As a Reader, I want to manually add a book by entering its details, so that I can track books in my collection.
- **PROG-01**: As a Reader, I want to update my current page number for a book, so that I can track how far I've read.

The stories included specific acceptance criteria that made them testable. For example, BOOK-01 included criteria like "System validates all required fields are filled" and "System shows error message if validation fails."

### Application Design

The team chose a simple, component-centric architecture with minimal abstraction layers. Key design decisions:

- Feature-based component organization
- Component local state (no global state management)
- Direct localStorage access from components
- Business logic within UI components
- Props and events for component communication

This pragmatic approach kept the architecture simple and avoided over-engineering for a small application.

### Units of Work

The application was decomposed into 4 sequential units:

1. **Unit 1: UI Foundation** - Common components and design system (0 stories, infrastructure)
2. **Unit 2: Core Features** - Authentication and book CRUD (8 stories)
3. **Unit 3: Enhanced Features** - ISBN, import, progress, notes/ratings (8 stories)
4. **Unit 4: Analytics & Utilities** - Statistics, search, export (7 stories)

Each unit had clear dependencies, success criteria, and estimated effort. The sequential approach ensured a stable foundation before adding advanced features.

## Construction Phase

The Construction Phase focused on how to build the application. Each unit followed the same pattern: Functional Design, NFR Requirements, NFR Design, and Code Generation.

### Unit 1: UI Foundation

**Mob Elaboration**: The team worked together to answer 10 functional design questions covering design system approach, component library scope, responsive design strategy, and accessibility priorities. They chose a pragmatic approach: standard design tokens, minimal MVP components, desktop-only with mobile scaling, and basic accessibility.

For NFR requirements, the team selected React + Vite + CSS Modules + Plain JavaScript. They decided on no premature optimization, a single bundle (no code splitting), and manual testing only.

**Mob Construction**: The team generated 60+ files including:
- Design system with CSS custom properties (colors, typography, spacing)
- 9 common UI components (Button, Input, Form, Card, Modal, ProgressBar, StarRating, Notification, LoadingSpinner)
- 3 utility components (ErrorBoundary, ProtectedRoute, LoadingOverlay)
- 2 context providers (AuthContext, LoadingContext)
- 4 utility modules (storage, validation, idGenerator, dateUtils)
- Application shell with routing

**Mob Testing**: The team created a comprehensive manual testing checklist covering component behavior, keyboard navigation, accessibility, responsive design, and browser compatibility.

### Unit 2: Core Features

**Mob Elaboration**: The team answered 20 functional design questions about authentication and book management. Key decisions included:
- Email uniqueness check before registration
- bcryptjs with 10 salt rounds for password hashing
- Browser session (clears on close)
- UUID for book IDs
- Alert user for storage quota issues (manual cleanup)

During NFR requirements, the team confirmed the Unit 1 tech stack was sufficient with zero new dependencies needed.

**Mob Construction**: The team implemented 4 new components:
- AuthComponent (registration and login with mode toggle)
- BookListComponent (book list display with CRUD operations)
- BookFormModal (modal-based add/edit form)
- BookItemComponent (individual book card display)

The implementation used component-level async hashing for passwords, showing a global loading overlay during the ~100-300ms bcrypt operation. Book CRUD operations used modal-based patterns with inline validation (on blur + on submit).

**Mob Testing**: The team tested authentication flows (registration, login, session persistence), book management operations (add, edit, delete), data isolation between users, and error handling for storage quota and invalid credentials.

### Unit 3: Enhanced Features

**Mob Elaboration**: The team answered 25 functional design questions covering ISBN lookup, file import, progress tracking, and notes/ratings. Notable decisions:
- Open Library API for ISBN lookup
- Strict ISBN validation with checksum verification
- Auto-complete books at 100% progress without asking
- 5000 character limit for notes
- Half-star ratings (0, 0.5, 1, 1.5, ... 5)

**Mob Construction**: The team created 3 utility modules (isbnValidator, importParser, progressCalculator) and extended BookFormModal with 4 modes:
1. Manual Entry (original functionality)
2. ISBN Lookup (fetch from Open Library API)
3. Import JSON (parse and validate JSON files)
4. Import CSV (parse and validate CSV files)

They also extended BookItemComponent to display progress bars, star ratings, and notes previews. The implementation included automatic data migration to add new fields (pagesRead, notes, rating, completedAt) to existing books.

**Challenge**: During implementation, the team discovered that only utility modules were initially created, without the component integrations. When asked "Is unit 3 testable now?", the AI correctly identified that only utility modules could be unit tested, but the features weren't accessible through the UI yet. The team then completed all component integrations to make the features fully testable.

**Mob Testing**: The team tested ISBN lookup with valid/invalid ISBNs, JSON/CSV import with various file formats, progress tracking with auto-completion, notes with character limits, and star ratings with half-star precision.

### Unit 4: Analytics & Utilities

**Mob Elaboration**: The team answered 30 functional design questions about statistics, search, and export. Key decisions:
- Show both "books added per month" and "books completed per month"
- Calculate reading pace as pages per day (average across all completed books)
- Single search box for both title AND author
- Export preview showing first 5 books before download
- Manual refresh button for statistics (not automatic)

**Mob Construction**: The team created 2 new components:
- StatisticsComponent (displays monthly trends, reading pace, status counts)
- SearchComponent (search box with real-time filtering)

They also added export functionality as a button in StatisticsComponent with a preview modal. The implementation used inline calculation logic (no optimization needed for the target scale of 100-500 books).

**Challenge**: After initial implementation, the UI failed to load. The team debugged and found three critical bugs:
1. AuthContext mismatch (components used `currentUser` but context exported `currentUserId`)
2. Storage key mismatch (used global 'books' key instead of per-user `books_${userId}`)
3. Statistics calculator storage mismatch (same issue as #2)

The team fixed all three bugs by updating the components to use the correct AuthContext hook and storage patterns.

**Mob Testing**: The team tested statistics calculations with various book collections, search functionality with partial matches, export with preview and download, and the refresh/clear statistics buttons.

## Best Practices for Greenfield Projects

Based on this case study, here are key best practices for using AI-DLC on greenfield projects:

### 1. Start with Clear Intent

Provide a clear initial request, but don't worry about being perfect. The AI will ask clarifying questions to resolve ambiguities. In this project, the AI asked 12 questions and caught a critical architecture contradiction.

### 2. Let the AI Detect Contradictions

The AI is excellent at spotting inconsistencies in your answers. When it asks for clarification, take the time to think through the implications. The server-side vs client-side clarification in this project prevented major rework later.

### 3. Use Feature-Level Stories

The team chose feature-level granularity (25 stories) rather than high-level epics or tiny tasks. This provided enough detail for implementation without excessive overhead. Each story had clear acceptance criteria that made it testable.

### 4. Keep Architecture Simple

For a small application, the team chose simple patterns: component-local state, direct storage access, inline business logic. This avoided over-engineering while still delivering all required functionality.

### 5. Build Sequentially with Dependencies

The 4-unit sequential approach ensured each unit had a stable foundation. Unit 1 provided common components for all other units. Unit 2 provided authentication and data structures. Unit 3 extended those structures. Unit 4 consumed the complete data.

### 6. Answer Questions Consistently

Throughout the project, the team consistently chose simple, pragmatic options (Option A in most cases). This consistency led to a coherent architecture without conflicting patterns.

### 7. Test After Each Unit

The team created comprehensive testing checklists and tested each unit before moving to the next. This caught issues early when they were easier to fix.

### 8. Embrace Mob Elaboration

The team worked together to answer design questions, ensuring shared understanding. This collaborative approach prevented misunderstandings and built team alignment.

### 9. Use Mob Construction Strategically

For complex units (like Unit 3 with multiple integration points), the team worked together to implement and verify the code. This caught the "utility modules only" issue before it became a bigger problem.

### 10. Debug Systematically

When the UI failed to load in Unit 4, the team used diagnostic tools to identify the root causes. They fixed all three bugs systematically rather than guessing at solutions.

### 11. Maintain Audit Trail

The project maintained a complete audit trail in audit.md, logging every user input and AI response with timestamps. This provided valuable documentation and helped track decisions throughout the project.

### 12. Update Documentation Continuously

The team updated README.md and TESTING.md after each unit, keeping documentation in sync with the code. This made the application immediately usable and testable.

## Conclusion

This greenfield project demonstrates how AI-DLC provides structure and guidance for building applications from scratch. The workflow's adaptive nature allowed the team to skip unnecessary stages (like Reverse Engineering for a greenfield project) while ensuring thorough elaboration and testing for each unit of work.

The key to success was the team's willingness to answer clarifying questions thoughtfully, maintain consistency in their choices, and test thoroughly after each unit. The result was a fully functional application built in a structured, traceable way with clear documentation and comprehensive test coverage.

For developers new to AI-DLC, this case study shows that the workflow is not rigid or bureaucratic. Instead, it adapts to your project's needs, asks the right questions at the right time, and helps you build quality software through collaboration between human expertise and AI assistance.
