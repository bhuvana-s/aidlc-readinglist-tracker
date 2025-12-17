# NFR Design Clarification - Unit 4: Analytics & Utilities

## Detected Ambiguity

### Issue: Search Component Structure Conflict

**Conflict**: Q5 answer (B - Inline in BookListComponent, no separate component) conflicts with Q6, Q7, Q21 answers which reference "SearchComponent" as if it's a separate component.

**Q5 Answer**: B) Inline in BookListComponent (no separate component)  
**Q6 Answer**: A) Local state in SearchComponent, pass results to parent  
**Q7 Answer**: A) Inline function in SearchComponent  
**Q21 Answer**: A) Inline in SearchComponent  

**Problem**: If search is inline in BookListComponent (Q5), there is no separate SearchComponent to have local state (Q6), inline functions (Q7), or inline logic (Q21).

---

## Clarification Question

**Clarification Q1: Search Implementation Structure**

Given the conflict, how should search be implemented?

A) **Inline in BookListComponent** - All search UI (input, button) and logic directly in BookListComponent JSX and methods. No separate SearchComponent file.

B) **Separate SearchComponent** - Create src/components/books/SearchComponent.jsx with search UI and logic, imported and used by BookListComponent.

**Implications**:

**Option A (Inline)**:
- Search input and button in BookListComponent JSX
- Search state (query, matchingIds) in BookListComponent useState
- Search function as method in BookListComponent
- Search styling in BookListComponent.module.css
- Simpler file structure (one less component file)

**Option B (Separate Component)**:
- SearchComponent.jsx + SearchComponent.module.css files
- Search state in SearchComponent
- Search function in SearchComponent
- Props passed to BookListComponent (matchingIds)
- More modular, reusable component

**Which option do you prefer?**

[Answer]: **Option B (Separate Component)**:

---

## Resolution

Once clarified, the following will be updated:
- Q6, Q7, Q21 answers will be interpreted based on clarification
- NFR design artifacts will reflect the chosen structure
- Logical components document will show correct component structure

