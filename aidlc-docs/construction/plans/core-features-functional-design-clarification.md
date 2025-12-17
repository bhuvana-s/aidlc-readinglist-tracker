# Functional Design Clarification Questions - Unit 2: Core Features

## Overview
After analyzing your answers, I've identified several ambiguities and conflicts that need clarification before proceeding with functional design artifact generation.

---

## Clarification Q1: Session Management vs. lastLogin Tracking (CONFLICT)

**Issue**: Your answers to Q3 and Q14 conflict:
- **Q3 Answer**: Browser session (clears when browser closes)
- **Q14 Answer**: Extended user structure with `lastLogin` field

**Conflict**: If sessions clear on browser close, tracking `lastLogin` becomes less useful since users will need to login every time they open the browser.

**Question**: How should we resolve this conflict?

**Options**:
A) **Keep browser session, remove lastLogin** - Sessions clear on close, no lastLogin tracking needed  
B) **Change to indefinite session, keep lastLogin** - Sessions persist, lastLogin tracks when user logged in  
C) **Keep both** - Browser session but still track lastLogin for analytics/security  
D) **Hybrid approach** - Default browser session, but track lastLogin for security monitoring

**Recommendation**: Option C or D - Even with browser sessions, tracking lastLogin can be useful for security (detecting unusual login patterns) or user analytics.

[Answer]: A) **Keep browser session, remove lastLogin** - Sessions clear on close, no lastLogin tracking needed  

---

## Clarification Q2: Book Data Structure - pagesRead Field

**Issue**: Your Q15 answer selected "Standard" structure which includes:
- `{ bookId, userId, title, author, status, totalPages, createdAt }`

**Missing**: `pagesRead` field is not included, but:
- Unit 3 will add progress tracking (PROG-01: Update Reading Progress)
- Having `pagesRead` in Unit 2 would avoid data migration in Unit 3
- Initial value would be 0 for all books

**Question**: Should we include `pagesRead` field in Unit 2 even though progress tracking is Unit 3?

**Options**:
A) **No, keep Standard** - Add `pagesRead` in Unit 3, handle data migration  
B) **Yes, add pagesRead now** - Include `pagesRead: 0` in Unit 2, avoid migration  
C) **Add pagesRead and updatedAt** - Use Extended structure from Q15 option C  
D) **Add all future fields** - Use Comprehensive structure from Q15 option D

**Recommendation**: Option B or C - Adding `pagesRead` now (initialized to 0) avoids data migration complexity in Unit 3.

[Answer]: B) **Yes, add pagesRead now** - Include `pagesRead: 0` in Unit 2, avoid migration

---

## Clarification Q3: Data Isolation - Indexed Structure Implementation

**Issue**: Your Q16 answer selected "Indexed structure" - `{ userId: [books] }` object structure.

**Clarification Needed**: How should this be implemented in localStorage?

**Options**:
A) **Single key with object** - Store `{ userId1: [books], userId2: [books] }` in one localStorage key "books"  
B) **Separate keys per user** - Store each user's books in "books_userId" key  
C) **Hybrid** - Store index in one key, actual books in separate keys  
D) **Array with filter** - Store all books in array, filter by userId (simpler than indexed)

**Considerations**:
- Option A: Simple but loads all users' books into memory
- Option B: Efficient but more complex key management
- Option D: Simpler implementation, easier to understand

**Recommendation**: Option D (Array with filter) is simpler and sufficient for client-side app with limited users.

[Answer]: B) **Separate keys per user** - Store each user's books in "books_userId" key  


---

## Clarification Q4: Storage Quota - Automatic Cleanup Details

**Issue**: Your Q18 answer selected "Automatic cleanup - Offer to delete old data".

**Clarification Needed**: What should "automatic cleanup" do specifically?

**Options**:
A) **Offer to delete oldest books** - Show dialog: "Storage full. Delete 10 oldest books?"  
B) **Offer to delete completed books** - Show dialog: "Storage full. Delete completed books?"  
C) **Show cleanup options** - Let user choose what to delete (oldest, completed, by status)  
D) **Just alert, manual cleanup** - Alert user, they manually delete books

**Considerations**:
- Automatic deletion is risky (data loss)
- User should control what gets deleted
- Simple alert might be safest

**Recommendation**: Option D - Alert user with guidance, let them manually delete. Safer than automatic deletion.

[Answer]: D) **Just alert, manual cleanup** - Alert user, they manually delete books


---

## Clarification Q5: Sequential Book ID - Implementation Details

**Issue**: Your Q20 answer selected "Sequential - Increment counter per user".

**Clarification Needed**: How should the sequential counter be implemented?

**Options**:
A) **Counter in user object** - Add `bookCounter` field to user object, increment on each book add  
B) **Counter in separate storage** - Store counters in separate localStorage key `{ userId: counter }`  
C) **Calculate from existing books** - Count existing books, use count + 1 as next ID  
D) **Use UUID instead** - Simpler, no counter management needed

**Considerations**:
- Option A: Simple, counter with user data
- Option C: No extra storage, but slower (must load all books to get count)
- Option D: Simplest, no counter needed, guaranteed unique

**Recommendation**: Option D (UUID) - Simpler implementation, no counter management, guaranteed uniqueness.

[Answer]: **Use UUID instead** - Simpler, no counter management needed

---

## Summary

Please answer these 5 clarification questions to resolve:
1. **Session vs. lastLogin conflict** (Q3 vs Q14)
2. **pagesRead field** (include now or add in Unit 3?)
3. **Indexed structure implementation** (how to store in localStorage?)
4. **Automatic cleanup details** (what should it do?)
5. **Sequential ID implementation** (how to manage counter?)

Once these are clarified, I'll generate the functional design artifacts with complete clarity and no ambiguities.

