# NFR Requirements Plan - Unit 2: Core Features

## Unit Context
**Unit Name**: Core Features  
**Purpose**: Implement authentication and core book management  
**Stories**: 8 stories (AUTH-01 to AUTH-04, BOOK-01 to BOOK-04)  
**Functional Design**: Complete  
**Tech Stack Inheritance**: Unit 1 established React, Vite, CSS Modules, Plain JavaScript, bcryptjs

---

## Overview

Unit 2 inherits the tech stack from Unit 1 (UI Foundation). This NFR assessment will:
1. Confirm existing tech stack is sufficient for authentication and book management
2. Identify any unit-specific NFR requirements
3. Assess if any additional libraries or tools are needed
4. Document performance, security, and reliability requirements

---

## NFR Assessment Steps

### Step 1: Analyze Functional Design
- [x] Read functional design artifacts
- [x] Understand authentication and book management requirements
- [x] Identify NFR implications

### Step 2: Create NFR Requirements Plan
- [x] Generate plan with checkboxes for NFR assessment
- [x] Focus on security (authentication), performance, reliability
- [x] Include clarification questions

### Step 3: Generate Context-Appropriate Questions
- [x] Create questions for security requirements
- [x] Create questions for performance requirements
- [x] Create questions for reliability requirements
- [x] Create questions for tech stack validation

### Step 4: Collect and Analyze Answers
- [ ] Wait for user to complete all [Answer]: tags
- [ ] Review responses for ambiguities
- [ ] Create clarification questions if needed

### Step 5: Generate NFR Requirements Artifacts
- [x] Create nfr-requirements.md
- [x] Create tech-stack-decisions.md

### Step 6: Present Completion Message
- [x] Present NFR requirements summary
- [ ] Wait for user review and approval

---

## Inherited Tech Stack (from Unit 1)

**Already Decided**:
- Framework: React 18+
- Build Tool: Vite 4+
- Styling: CSS Modules + CSS Custom Properties
- Language: Plain JavaScript ES2020+
- Routing: React Router v6
- Password Hashing: bcryptjs
- Testing: Manual testing only
- Deployment: Local only

**Question**: Are these sufficient for Unit 2, or do we need additional libraries/tools?

---

## NFR Assessment Questions

### Security Requirements

#### Q1: Password Hashing - bcryptjs Configuration
**Question**: What bcryptjs configuration should be used for password hashing?

**Context**: Unit 1 included bcryptjs. Need to determine salt rounds and any other configuration.

**Options**:
A) **Standard (10 rounds)** - Industry standard, good balance of security and performance  
B) **High security (12 rounds)** - More secure but slower  
C) **Low (8 rounds)** - Faster but less secure  
D) **Adaptive** - Adjust based on device capability

**Considerations**:
- Security vs. performance trade-off
- Client-side hashing (runs in browser)
- User experience (registration/login speed)

**Recommendation**: Option A (10 rounds) - Industry standard, proven secure, acceptable performance

[Answer]: A) **Standard (10 rounds)** - Industry standard, good balance of security and performance 

---

#### Q2: Session Security - Additional Measures
**Question**: Should any additional session security measures be implemented?

**Context**: Sessions stored in localStorage, cleared on browser close.

**Options**:
A) **No additional measures** - localStorage + browser session is sufficient  
B) **Session timeout** - Add inactivity timeout (e.g., 30 minutes)  
C) **Session token** - Use cryptographic session tokens instead of just userId  
D) **CSRF protection** - Add CSRF tokens (overkill for local-only app)

**Considerations**:
- Local-only application (no server)
- Browser session already provides some security
- Complexity vs. benefit

**Recommendation**: Option A - For local-only app, current approach is sufficient

[Answer]: A) **No additional measures** - localStorage + browser session is sufficient  


---

#### Q3: Data Encryption - localStorage
**Question**: Should data in localStorage be encrypted?

**Context**: User data and books stored in plain JSON in localStorage.

**Options**:
A) **No encryption** - Data stored as plain JSON  
B) **Password encryption only** - Only passwords are hashed (already decided)  
C) **Full encryption** - Encrypt all user data and books  
D) **Selective encryption** - Encrypt sensitive fields only

**Considerations**:
- Local-only application (data never leaves device)
- Encryption adds complexity
- Passwords already hashed
- Performance impact

**Recommendation**: Option A - For local-only app with hashed passwords, additional encryption not necessary

[Answer]: A) **No encryption** - Data stored as plain JSON  


---

### Performance Requirements

#### Q4: Authentication Performance - Target Times
**Question**: What are acceptable performance targets for authentication operations?

**Context**: Registration and login involve password hashing (bcryptjs), which is intentionally slow.

**Options**:
A) **No specific targets** - As fast as bcryptjs allows  
B) **< 1 second** - Registration and login complete in under 1 second  
C) **< 2 seconds** - Allow up to 2 seconds for hashing  
D) **< 500ms** - Very fast (may require fewer salt rounds)

**Considerations**:
- bcryptjs with 10 rounds typically takes 100-300ms
- User experience expectations
- Security vs. speed trade-off

**Recommendation**: Option B (< 1 second) - Achievable with 10 rounds, good UX

[Answer]: A) **No specific targets** - As fast as bcryptjs allows  


---

#### Q5: Book Operations Performance - Target Times
**Question**: What are acceptable performance targets for book CRUD operations?

**Context**: Book operations involve localStorage read/write, which is synchronous and fast.

**Options**:
A) **No specific targets** - As fast as localStorage allows  
B) **< 100ms** - Near-instant operations  
C) **< 500ms** - Acceptable for user interactions  
D) **< 1 second** - Slower but acceptable

**Considerations**:
- localStorage is very fast (typically < 10ms)
- User experience expectations
- No network latency (local-only)

**Recommendation**: Option B (< 100ms) - Easily achievable with localStorage

[Answer]: A) **No specific targets** - As fast as localStorage allows  


---

#### Q6: Book List Rendering - Performance
**Question**: What performance is expected for rendering the book list?

**Context**: Book list displays all user's books. Need to determine if optimization is needed.

**Options**:
A) **No optimization** - Render all books, trust React  
B) **Pagination** - Show 10-20 books per page  
C) **Virtual scrolling** - Only render visible books  
D) **Lazy loading** - Load books on demand

**Considerations**:
- Expected number of books per user (probably < 100)
- React can handle hundreds of items easily
- Complexity vs. benefit

**Recommendation**: Option A - For expected book counts, no optimization needed

[Answer]: A) **No optimization** - Render all books, trust React  


---

### Reliability Requirements

#### Q7: Error Recovery - localStorage Failures
**Question**: How should the application handle localStorage failures?

**Context**: localStorage can fail (quota exceeded, browser restrictions, corruption).

**Options**:
A) **Alert only** - Show error, operation fails  
B) **Retry logic** - Attempt operation multiple times  
C) **Fallback storage** - Use sessionStorage or memory as fallback  
D) **Graceful degradation** - Continue with limited functionality

**Considerations**:
- localStorage is generally reliable
- Quota exceeded is most common failure
- User experience during failures

**Recommendation**: Option A - Simple alert, user manually resolves (already decided in functional design)

[Answer]: A) **Alert only** - Show error, operation fails  


---

#### Q8: Data Validation - Client-Side Only
**Question**: Is client-side validation sufficient, or should we plan for future server-side validation?

**Context**: All validation currently happens in browser. No server exists.

**Options**:
A) **Client-side only** - Sufficient for local-only app  
B) **Design for future server** - Structure validation for easy server migration  
C) **Dual validation** - Validate on both client and server (no server yet)  
D) **Server-side only** - Skip client validation (bad UX)

**Considerations**:
- Local-only application (no server)
- Future extensibility
- Code organization

**Recommendation**: Option A - Client-side sufficient for current scope

[Answer]: A) **Client-side only** - Sufficient for local-only app  


---

### Tech Stack Validation

#### Q9: Additional Libraries - Authentication
**Question**: Are any additional libraries needed for authentication beyond bcryptjs?

**Context**: bcryptjs already included for password hashing.

**Options**:
A) **No additional libraries** - bcryptjs is sufficient  
B) **JWT library** - For token-based auth (overkill for local-only)  
C) **Auth library** - Use authentication library like Auth0 (requires server)  
D) **Crypto library** - Additional cryptographic functions

**Considerations**:
- Local-only application
- bcryptjs handles password hashing
- No server for token validation

**Recommendation**: Option A - bcryptjs is sufficient for local authentication

[Answer]: A) **No additional libraries** - bcryptjs is sufficient  


---

#### Q10: Additional Libraries - Data Management
**Question**: Are any additional libraries needed for data management?

**Context**: Currently using plain localStorage with utility functions.

**Options**:
A) **No additional libraries** - localStorage utilities sufficient  
B) **LocalForage** - Enhanced localStorage with better API  
C) **Dexie.js** - IndexedDB wrapper for complex queries  
D) **Redux/Zustand** - State management library

**Considerations**:
- Simple data model (users, books)
- localStorage is sufficient for current needs
- Complexity vs. benefit

**Recommendation**: Option A - Current approach is sufficient

[Answer]: A) **No additional libraries** - localStorage utilities sufficient  


---

#### Q11: Form Handling - Library Needed?
**Question**: Should we use a form library for authentication and book forms?

**Context**: Forms will be built with React controlled components.

**Options**:
A) **No library** - Use React controlled components  
B) **React Hook Form** - Lightweight form library  
C) **Formik** - Full-featured form library  
D) **Custom form utilities** - Build reusable form helpers

**Considerations**:
- Simple forms (login, register, book entry)
- Bundle size impact
- Complexity vs. benefit
- Unit 1 decision: component-level validation

**Recommendation**: Option A - Consistent with Unit 1 approach (component-level logic)

[Answer]: A) **No library** - Use React controlled components  


---

#### Q12: Testing Approach - Unit 2
**Question**: Should Unit 2 include any automated testing?

**Context**: Unit 1 used manual testing only.

**Options**:
A) **Manual testing only** - Consistent with Unit 1  
B) **Unit tests** - Add Jest/Vitest for critical functions  
C) **Integration tests** - Test authentication and book flows  
D) **E2E tests** - Full user workflow testing

**Considerations**:
- Unit 1 decision: manual testing only
- Consistency across units
- Testing effort vs. benefit

**Recommendation**: Option A - Maintain consistency with Unit 1

[Answer]: A) **Manual testing only** - Consistent with Unit 1  


---

## Next Steps

After answering these questions:
1. AI will analyze answers for ambiguities
2. AI will create clarification questions if needed
3. AI will generate NFR requirements artifacts based on approved answers
4. User will review and approve NFR requirements
5. Proceed to next stage (NFR Design)

---

## Notes

- Unit 2 inherits tech stack from Unit 1 (React, Vite, CSS Modules, JavaScript, bcryptjs)
- Focus on confirming existing stack is sufficient
- Identify any unit-specific NFR requirements
- Maintain consistency with Unit 1 decisions where possible
- Keep it simple - avoid over-engineering for local-only application

