# Functional Design Plan - Unit 2: Core Features

## Unit Context
**Unit Name**: Core Features  
**Purpose**: Implement essential features required for basic application functionality: user authentication and core book management  
**Stories Assigned**: 8 stories (AUTH-01 through AUTH-04, BOOK-01 through BOOK-04)  
**Dependencies**: Unit 1 (UI Foundation) - COMPLETE  
**Depended On By**: Units 3 and 4

---

## Unit Overview

### Responsibilities
- User registration and login
- Session management
- Password hashing and security
- Add books manually
- View book list
- Edit book details
- Delete books
- Basic book data validation
- Local storage integration for users and books

### Components to Design
1. **AuthComponent** - Registration, login, authentication
2. **BookListComponent** - Book list display, CRUD operations
3. **BookFormComponent** (basic) - Manual book entry form
4. **BookItemComponent** - Individual book display

### User Stories
- AUTH-01: User Registration
- AUTH-02: User Login
- AUTH-03: Session Management
- AUTH-04: User Data Isolation
- BOOK-01: Add Book Manually
- BOOK-02: View Book List
- BOOK-03: Edit Book Details
- BOOK-04: Delete Book

---

## Functional Design Steps

### Step 1: Analyze Unit Context
- [x] Read unit definition from unit-of-work.md
- [x] Read assigned stories from unit-of-work-story-map.md
- [x] Understand unit responsibilities and boundaries

### Step 2: Create Functional Design Plan
- [x] Generate plan with checkboxes for functional design
- [x] Focus on business logic, domain models, business rules
- [x] Include clarification questions

### Step 3: Generate Context-Appropriate Questions
- [x] Create questions for business logic modeling
- [x] Create questions for domain model
- [x] Create questions for business rules
- [x] Create questions for data flow
- [x] Create questions for error handling

### Step 4: Collect and Analyze Answers
- [ ] Wait for user to complete all [Answer]: tags
- [ ] Review responses for ambiguities
- [ ] Create clarification questions if needed

### Step 5: Generate Functional Design Artifacts
- [x] Create business-logic-model.md
- [x] Create business-rules.md
- [x] Create domain-entities.md

### Step 6: Present Completion Message
- [x] Present functional design summary
- [ ] Wait for user review and approval

---

## Clarification Questions

### Authentication & User Management

#### Q1: User Registration - Email Uniqueness
**Question**: How should the system handle duplicate email registrations?

**Context**: When a user tries to register with an email that already exists in the system.

**Options**:
A) **Reject with error message** - Show "Email already registered" error, suggest login  
B) **Silent rejection** - Show generic "Registration failed" without revealing email exists  
C) **Merge accounts** - Link new registration to existing account  
D) **Allow duplicates** - Multiple accounts can have same email

**Considerations**:
- Security (revealing email existence)
- User experience
- Account recovery

[Answer]: A) **Reject with error message** - Show "Email already registered" error, suggest login  

---

#### Q2: Password Storage - Hashing Strategy
**Question**: When should passwords be hashed during the registration/login flow?

**Context**: bcryptjs is available for password hashing. Need to determine timing and approach.

**Options**:
A) **Hash on registration, compare hash on login** - Standard approach  
B) **Hash on both registration and login, compare hashes** - Double hashing  
C) **Hash in storage utility** - Centralized hashing logic  
D) **Hash in AuthComponent** - Component-level hashing

**Considerations**:
- Security best practices
- Code organization
- Performance

[Answer]: A) **Hash on registration, compare hash on login** - Standard approach  


---

#### Q3: Session Management - Session Duration
**Question**: How long should user sessions persist?

**Context**: User logs in and session is stored in localStorage. Need to determine session lifetime.

**Options**:
A) **Indefinite** - Session persists until explicit logout  
B) **Time-based** - Session expires after X hours/days of inactivity  
C) **Browser session** - Session clears when browser closes  
D) **Hybrid** - Long-term with "Remember Me" option

**Considerations**:
- Security vs. convenience
- User expectations
- Implementation complexity

[Answer]: C) **Browser session** - Session clears when browser closes  


---

#### Q4: Login Failure - Error Messages
**Question**: What error message should be shown for failed login attempts?

**Context**: User enters incorrect email or password.

**Options**:
A) **Specific errors** - "Email not found" or "Incorrect password"  
B) **Generic error** - "Invalid email or password"  
C) **No error** - Silent failure with generic message  
D) **Detailed feedback** - "Email exists but password incorrect"

**Considerations**:
- Security (preventing email enumeration)
- User experience
- Account security

[Answer]: B) **Generic error** - "Invalid email or password"  


---

### Book Management

#### Q5: Book Data Model - Required Fields
**Question**: Which fields are required when adding a book manually?

**Context**: User fills out book entry form. Need to determine minimum required data.

**Options**:
A) **Title only** - Only title is required  
B) **Title and Author** - Both required  
C) **Title, Author, Status** - Core fields required  
D) **All fields** - Title, Author, Status, Total Pages all required

**Considerations**:
- User experience (ease of entry)
- Data quality
- Future feature requirements (progress tracking needs total pages)

[Answer]: D) **All fields** - Title, Author, Status, Total Pages all required


---

#### Q6: Book Status - Initial Status
**Question**: What should be the default status when adding a new book?

**Context**: User adds a book without explicitly selecting status.

**Options**:
A) **Wishlist** - Default to wishlist (intent to read)  
B) **Reading** - Default to currently reading  
C) **No default** - Force user to select status  
D) **Smart default** - Based on whether pages read is entered

**Considerations**:
- User workflow
- Data consistency
- User expectations

[Answer]: A) **Wishlist** - Default to wishlist (intent to read)  


---

#### Q7: Book Editing - Partial Updates
**Question**: Can users edit individual fields or must they edit the entire book record?

**Context**: User wants to update book information.

**Options**:
A) **Full record edit** - Edit form shows all fields, all must be valid  
B) **Partial field edit** - Can edit individual fields independently  
C) **Field-level edit** - Click field to edit in-place  
D) **Modal edit** - Edit in modal with all fields

**Considerations**:
- User experience
- Validation complexity
- Implementation approach

[Answer]: D) **Modal edit** - Edit in modal with all fields


---

#### Q8: Book Deletion - Confirmation
**Question**: Should book deletion require confirmation?

**Context**: User clicks delete button on a book.

**Options**:
A) **No confirmation** - Immediate deletion  
B) **Simple confirmation** - "Are you sure?" dialog  
C) **Detailed confirmation** - Show book details, require confirmation  
D) **Soft delete** - Mark as deleted, allow undo

**Considerations**:
- Data safety
- User experience
- Accidental deletions

[Answer]: B) **Simple confirmation** - "Are you sure?" dialog  


---

#### Q9: Book List - Sorting and Filtering
**Question**: How should books be sorted and filtered in the book list?

**Context**: User views their book list. Need to determine default sort and available filters.

**Options**:
A) **No sorting/filtering** - Display in order added  
B) **Sort by date added** - Newest first, no filtering  
C) **Sort by title** - Alphabetical, filter by status  
D) **Multiple options** - User can choose sort (title/author/date) and filter (status)

**Considerations**:
- User experience
- Implementation complexity
- Future extensibility

[Answer]: A) **No sorting/filtering** - Display in order added  


---

#### Q10: Book List - Empty State
**Question**: What should be displayed when user has no books?

**Context**: New user or user who deleted all books views book list.

**Options**:
A) **Empty list** - Just show empty container  
B) **Helpful message** - "No books yet. Add your first book!"  
C) **Call to action** - Message with prominent "Add Book" button  
D) **Onboarding** - Tutorial or guide for adding books

**Considerations**:
- User experience
- Onboarding
- Visual design

[Answer]: B) **Helpful message** - "No books yet. Add your first book!"  


---

### Data Validation

#### Q11: Title Validation - Length Limits
**Question**: What are the minimum and maximum lengths for book titles?

**Context**: User enters book title in form.

**Options**:
A) **No limits** - Any length accepted  
B) **Minimum only** - At least 1 character, no maximum  
C) **Reasonable limits** - 1-200 characters  
D) **Strict limits** - 3-100 characters

**Considerations**:
- Real-world book titles
- Storage constraints
- User experience

[Answer]: C) **Reasonable limits** - 1-200 characters 

---

#### Q12: Author Validation - Format
**Question**: How should author names be validated?

**Context**: User enters author name in form.

**Options**:
A) **No validation** - Any text accepted  
B) **Basic validation** - Non-empty string  
C) **Format validation** - Letters, spaces, hyphens only  
D) **Structured format** - First name, Last name fields

**Considerations**:
- International names
- Multiple authors
- Pseudonyms

[Answer]: C) **Format validation** - Letters, spaces, hyphens only  


---

#### Q13: Total Pages - Validation
**Question**: What validation should be applied to total pages field?

**Context**: User enters total pages for a book.

**Options**:
A) **No validation** - Any number accepted  
B) **Positive only** - Must be > 0  
C) **Reasonable range** - Between 1 and 10,000  
D) **Optional field** - Can be left empty

**Considerations**:
- Real-world book lengths
- Progress tracking requirements
- User experience

[Answer]: C) **Reasonable range** - Between 1 and 10,000  


---

### Data Storage

#### Q14: User Data Structure
**Question**: How should user data be structured in localStorage?

**Context**: Need to define user object structure for storage.

**Options**:
A) **Minimal** - { userId, email, passwordHash }  
B) **Standard** - { userId, email, passwordHash, createdAt }  
C) **Extended** - { userId, email, passwordHash, createdAt, lastLogin }  
D) **Comprehensive** - { userId, email, passwordHash, createdAt, lastLogin, preferences }

**Considerations**:
- Current requirements
- Future extensibility
- Storage efficiency

[Answer]: C) **Extended** - { userId, email, passwordHash, createdAt, lastLogin }  


---

#### Q15: Book Data Structure
**Question**: How should book data be structured in localStorage?

**Context**: Need to define book object structure for storage.

**Options**:
A) **Basic** - { bookId, userId, title, author, status }  
B) **Standard** - { bookId, userId, title, author, status, totalPages, createdAt }  
C) **Extended** - { bookId, userId, title, author, status, totalPages, pagesRead, createdAt, updatedAt }  
D) **Comprehensive** - { bookId, userId, title, author, status, totalPages, pagesRead, notes, rating, createdAt, updatedAt }

**Considerations**:
- Unit 2 requirements (basic book management)
- Unit 3 requirements (progress, notes, ratings)
- Data migration complexity

[Answer]: B) **Standard** - { bookId, userId, title, author, status, totalPages, createdAt }  

---

#### Q16: Data Isolation - Implementation
**Question**: How should user data isolation be implemented?

**Context**: Multiple users can register. Each user should only see their own books.

**Options**:
A) **Filter on read** - Load all books, filter by userId in component  
B) **Separate storage keys** - Each user has own localStorage key (books_userId)  
C) **Single array with userId** - All books in one array, filtered by userId  
D) **Indexed structure** - { userId: [books] } object structure

**Considerations**:
- Performance
- Code simplicity
- Storage efficiency

[Answer]: D) **Indexed structure** - { userId: [books] } object structure


---

### Error Handling

#### Q17: Registration Errors - Handling
**Question**: How should registration errors be handled and displayed?

**Context**: Registration can fail for various reasons (duplicate email, validation errors, storage errors).

**Options**:
A) **Inline errors** - Show errors next to relevant fields  
B) **Summary error** - Show single error message at top of form  
C) **Both** - Field-level errors + summary  
D) **Modal error** - Show error in modal dialog

**Considerations**:
- User experience
- Error clarity
- Consistency with UI Foundation

[Answer]: A) **Inline errors** - Show errors next to relevant fields  


---

#### Q18: Storage Quota Exceeded
**Question**: How should the system handle localStorage quota exceeded errors?

**Context**: User has too much data and localStorage is full.

**Options**:
A) **Alert only** - Show alert, operation fails  
B) **Alert with guidance** - Show alert with instructions to delete data  
C) **Automatic cleanup** - Offer to delete old data  
D) **Graceful degradation** - Continue without saving

**Considerations**:
- User experience
- Data safety
- Recovery options

[Answer]: C) **Automatic cleanup** - Offer to delete old data  


---

#### Q19: Network Errors - Future Consideration
**Question**: Should the design account for future network operations (even though Unit 2 is local-only)?

**Context**: Unit 3 will add ISBN lookup (external API). Should Unit 2 design consider this?

**Options**:
A) **No** - Design for local-only, refactor later  
B) **Yes** - Design with async patterns even for local operations  
C) **Partial** - Use async for storage operations only  
D) **Abstraction** - Create data access layer for future flexibility

**Considerations**:
- Code maintainability
- Future refactoring effort
- Current complexity

[Answer]: A) **No** - Design for local-only, refactor later  


---

### Business Logic

#### Q20: Book ID Generation
**Question**: How should book IDs be generated?

**Context**: Each book needs a unique identifier.

**Options**:
A) **UUID** - Use generateId() utility (crypto.randomUUID)  
B) **Timestamp** - Use timestamp as ID  
C) **Sequential** - Increment counter per user  
D) **Composite** - userId + timestamp

**Considerations**:
- Uniqueness guarantee
- Collision risk
- Simplicity

[Answer]: C) **Sequential** - Increment counter per user  


---

## Next Steps

After answering these questions:
1. AI will analyze answers for ambiguities
2. AI will create clarification questions if needed
3. AI will generate functional design artifacts based on approved answers
4. User will review and approve functional design
5. Proceed to next stage (NFR Requirements)

---

## Notes

- This is Unit 2 of 4 in the Reading List Tracker project
- Unit 2 implements core authentication and book management
- Unit 2 depends on Unit 1 (UI Foundation) which is complete
- Focus on business logic and domain model, not UI implementation
- All questions should be answered before proceeding to artifact generation

