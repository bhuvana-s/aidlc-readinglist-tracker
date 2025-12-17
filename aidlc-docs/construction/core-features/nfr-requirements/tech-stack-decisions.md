# Tech Stack Decisions - Core Features

## Overview
This document records the technology stack decisions for Unit 2: Core Features. Most decisions are inherited from Unit 1 (UI Foundation), with validation that the existing stack is sufficient for authentication and book management.

---

## Inherited Tech Stack (from Unit 1)

### Frontend Framework
**Decision**: React 18+

**Rationale**: 
- Established in Unit 1
- Sufficient for authentication and book management
- Component-based architecture fits requirements

**Status**: ✅ Confirmed for Unit 2

---

### Build Tool
**Decision**: Vite 4+

**Rationale**:
- Established in Unit 1
- Fast development server
- Efficient production builds

**Status**: ✅ Confirmed for Unit 2

---

### Styling
**Decision**: CSS Modules + CSS Custom Properties

**Rationale**:
- Established in Unit 1
- Component-scoped styles
- Design system via custom properties

**Status**: ✅ Confirmed for Unit 2

---

### Programming Language
**Decision**: Plain JavaScript ES2020+

**Rationale**:
- Established in Unit 1
- No TypeScript needed for project scope
- Simpler development

**Status**: ✅ Confirmed for Unit 2

---

### Routing
**Decision**: React Router v6

**Rationale**:
- Established in Unit 1
- Handles authentication routing (public/protected routes)
- ProtectedRoute HOC already implemented

**Status**: ✅ Confirmed for Unit 2

---

## Unit 2 Specific Decisions

### Password Hashing
**Decision**: bcryptjs with 10 salt rounds

**Rationale**:
- Industry standard for password hashing
- 10 rounds balances security and performance
- Client-side hashing acceptable for local-only app
- ~100-300ms hashing time is acceptable UX

**Alternatives Considered**:
- 12 rounds: More secure but slower
- 8 rounds: Faster but less secure
- Native crypto API: More complex, no significant benefit

**Status**: ✅ Confirmed

**Configuration**:
```javascript
import bcrypt from 'bcryptjs';

// Registration
const saltRounds = 10;
const hashedPassword = await bcrypt.hash(password, saltRounds);

// Login
const isValid = await bcrypt.compare(password, user.passwordHash);
```

---

### Session Management
**Decision**: localStorage with browser session behavior

**Rationale**:
- Simple implementation
- No additional libraries needed
- Browser session (clears on close) balances security and convenience
- Sufficient for local-only application

**Alternatives Considered**:
- Session tokens: Overkill for local-only app
- JWT: Requires server for validation
- Cookies: More complex, no benefit

**Status**: ✅ Confirmed

**Implementation**:
```javascript
// Store session
localStorage.setItem('currentUser', userId);

// Check session
const userId = localStorage.getItem('currentUser');

// Clear session
localStorage.removeItem('currentUser');
```

---

### Data Storage
**Decision**: localStorage with utility functions

**Rationale**:
- Simple and sufficient for project scope
- No complex queries needed
- Utility functions provide error handling
- Separate keys per user for data isolation

**Alternatives Considered**:
- IndexedDB: Overkill for simple data model
- LocalForage: Unnecessary abstraction
- Redux/Zustand: Not needed for local storage

**Status**: ✅ Confirmed

**Storage Structure**:
```javascript
// Users
localStorage: "users" → [User, User, ...]

// Books per user
localStorage: "books_{userId}" → [Book, Book, ...]

// Current session
localStorage: "currentUser" → userId
```

---

### Form Handling
**Decision**: React controlled components (no form library)

**Rationale**:
- Consistent with Unit 1 approach
- Simple forms (login, register, book entry)
- Component-level validation
- No need for form library complexity

**Alternatives Considered**:
- React Hook Form: Adds bundle size, unnecessary
- Formik: Too heavy for simple forms
- Custom form utilities: Not needed

**Status**: ✅ Confirmed

**Pattern**:
```javascript
const [formData, setFormData] = useState({});
const [errors, setErrors] = useState({});

const handleChange = (e) => {
  setFormData({ ...formData, [e.target.name]: e.target.value });
};

const handleBlur = (e) => {
  validateField(e.target.name, e.target.value);
};
```

---

### Validation
**Decision**: Client-side validation only

**Rationale**:
- Local-only application (no server)
- Validation utility functions from Unit 1
- Sufficient for current scope
- No need for server-side validation

**Alternatives Considered**:
- Server-side validation: No server exists
- Validation library: Unnecessary for simple rules

**Status**: ✅ Confirmed

**Implementation**: Use validation.js utility functions

---

### Testing
**Decision**: Manual testing only

**Rationale**:
- Consistent with Unit 1 decision
- Simple application scope
- Testing checklist in TESTING.md
- No automated test infrastructure

**Alternatives Considered**:
- Jest/Vitest: Adds complexity, not needed
- Integration tests: Overkill for scope
- E2E tests: Too heavy for project

**Status**: ✅ Confirmed

---

### Error Handling
**Decision**: Alert-based error handling (no error tracking service)

**Rationale**:
- Local-only application
- Simple alert dialogs for critical errors
- Inline errors for validation
- No need for error tracking service

**Alternatives Considered**:
- Sentry: Overkill for local-only app
- Custom error logging: Unnecessary complexity

**Status**: ✅ Confirmed

---

## No Additional Libraries Needed

### Authentication Libraries
**Decision**: No additional authentication libraries

**Rationale**:
- bcryptjs sufficient for password hashing
- Simple session management with localStorage
- No JWT, OAuth, or auth services needed

**Status**: ✅ No additional libraries

---

### Data Management Libraries
**Decision**: No additional data management libraries

**Rationale**:
- localStorage utilities sufficient
- Simple data model (users, books)
- No complex queries or relationships

**Status**: ✅ No additional libraries

---

### State Management Libraries
**Decision**: No state management library

**Rationale**:
- React Context API sufficient (AuthContext, LoadingContext from Unit 1)
- Component local state for forms
- No complex global state needs

**Status**: ✅ No additional libraries

---

## Dependencies Summary

### Production Dependencies
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.20.0",
  "bcryptjs": "^2.4.3"
}
```

**No new dependencies added in Unit 2**

### Development Dependencies
```json
{
  "vite": "^5.0.0",
  "@vitejs/plugin-react": "^4.2.0"
}
```

**No new dev dependencies added in Unit 2**

---

## Browser Requirements

### Supported Browsers
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

### Required Browser Features
- ES2020+ support
- localStorage API
- crypto.randomUUID (with fallback)
- bcryptjs compatibility

**Status**: ✅ All modern browsers supported

---

## Performance Targets

### Authentication Operations
- **Target**: No specific target
- **Expected**: ~100-300ms (bcryptjs hashing time)
- **Acceptable**: As fast as bcryptjs allows with 10 rounds

### Book Operations
- **Target**: No specific target
- **Expected**: < 10ms (localStorage operations)
- **Acceptable**: As fast as localStorage allows

### Rendering Performance
- **Target**: No optimization needed
- **Expected**: < 100ms for typical book counts
- **Acceptable**: Trust React default performance

---

## Security Configuration

### Password Hashing
- **Algorithm**: bcrypt
- **Salt Rounds**: 10
- **Library**: bcryptjs v2.4.3

### Session Security
- **Storage**: localStorage
- **Type**: Browser session (clears on close)
- **Validation**: Check on app load

### Data Encryption
- **Passwords**: Hashed with bcryptjs
- **Other Data**: Plain JSON (no encryption)
- **Rationale**: Local-only app, password hashing sufficient

---

## Deployment Configuration

### Build Configuration
- **Tool**: Vite
- **Output**: Static files (HTML, JS, CSS)
- **Target**: Modern browsers (ES2020+)

### Deployment Target
- **Environment**: Local only (file:// or local server)
- **No server required**: Pure client-side application
- **No CDN needed**: Local deployment

---

## Decision Rationale Summary

**Key Principles**:
1. **Inherit from Unit 1**: Maintain consistency across units
2. **Keep it simple**: No unnecessary libraries or complexity
3. **Local-only focus**: Optimize for local storage, no server
4. **Trust defaults**: No premature optimization
5. **Component-level logic**: Consistent with Unit 1 architecture

**Result**: Zero new dependencies, complete tech stack inherited from Unit 1, all requirements met with existing tools.

---

## Future Considerations

### Unit 3 (Enhanced Features)
- May need library for ISBN lookup API calls (fetch API sufficient)
- May need CSV parsing library for import feature
- No other tech stack changes anticipated

### Unit 4 (Analytics & Utilities)
- No additional libraries anticipated
- Date utilities already available (dateUtils.js)
- Export uses native JSON.stringify

**Conclusion**: Current tech stack sufficient for all 4 units.

