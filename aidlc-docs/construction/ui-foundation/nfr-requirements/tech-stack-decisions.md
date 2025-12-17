# Tech Stack Decisions - UI Foundation

## Overview
This document records all technology stack decisions for the UI Foundation unit, including rationale, alternatives considered, and implications.

---

## 1. JavaScript Framework: React

### Decision
**Selected**: React 18+

### Rationale
- **Most Popular**: Largest ecosystem and community support
- **Component-Based**: Aligns with component-centric architecture
- **Virtual DOM**: Efficient rendering and updates
- **Mature**: Stable, well-documented, battle-tested
- **Job Market**: Most in-demand framework skill
- **Ecosystem**: Rich library ecosystem for future needs

### Alternatives Considered
- **Vue**: Easier learning curve but smaller ecosystem
- **Angular**: Too opinionated and heavy for this project
- **Svelte**: Smaller bundle but less mature ecosystem
- **Vanilla JavaScript**: Too much boilerplate for component management

### Implications
- **Bundle Size**: React + ReactDOM ~45KB gzipped (acceptable within 500KB budget)
- **Learning Curve**: Moderate, but well-documented
- **Development Speed**: Fast with component reusability
- **Future Maintenance**: Easy to find developers familiar with React

### Version
- **Target**: React 18.2+ (latest stable)
- **Rationale**: Latest features (concurrent rendering, automatic batching)

---

## 2. CSS Approach: CSS Modules

### Decision
**Selected**: CSS Modules

### Rationale
- **Scoped Styles**: Automatic class name scoping prevents conflicts
- **Traditional CSS**: Familiar syntax, no learning curve
- **Design System Friendly**: Easy to implement design tokens with CSS variables
- **No Runtime**: Styles processed at build time, no runtime overhead
- **Simple**: No complex configuration or additional libraries

### Alternatives Considered
- **CSS-in-JS** (styled-components): Runtime overhead, larger bundle
- **Sass/SCSS**: Adds build complexity, CSS variables sufficient
- **Tailwind CSS**: Utility-first doesn't fit design system approach
- **Plain CSS**: No scoping, risk of naming conflicts

### Implications
- **Bundle Size**: Minimal impact, CSS is small
- **Development Speed**: Fast with familiar CSS syntax
- **Maintainability**: Clear separation of styles and logic
- **Design System**: Implement tokens as CSS custom properties

### Implementation Pattern
```javascript
// Component.module.css
.button {
  background-color: var(--color-primary);
  padding: var(--spacing-md);
}

// Component.jsx
import styles from './Component.module.css';
<button className={styles.button}>Click</button>
```

---

## 3. Build Tool: Vite

### Decision
**Selected**: Vite 4+

### Rationale
- **Fast**: Lightning-fast dev server with instant HMR
- **Modern**: ESM-based, leverages native browser modules
- **Simple Configuration**: Minimal config needed for React
- **Excellent DX**: Best-in-class developer experience
- **Production Optimized**: Rollup-based production builds
- **React Support**: First-class React support with @vitejs/plugin-react

### Alternatives Considered
- **Webpack**: Slower, more complex configuration
- **Parcel**: Less control, smaller ecosystem
- **Rollup**: Better for libraries than applications
- **esbuild**: Less mature, fewer plugins

### Implications
- **Dev Server**: Instant startup, fast HMR
- **Build Speed**: Fast production builds (< 30 seconds)
- **Bundle Size**: Automatic code splitting and tree-shaking
- **Configuration**: Minimal vite.config.js needed

### Configuration
```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom']
        }
      }
    }
  }
});
```

---

## 4. Language: Plain JavaScript (ES2020+)

### Decision
**Selected**: Plain JavaScript (no TypeScript)

### Rationale
- **Simplicity**: No compilation step for types
- **Faster Development**: No type definitions to write
- **Smaller Bundle**: No TypeScript overhead
- **Modern Features**: Use ES2020+ features (optional chaining, nullish coalescing)
- **Sufficient for Project**: Small project doesn't require type safety

### Alternatives Considered
- **TypeScript**: Type safety but adds complexity
- **JavaScript with JSDoc**: Type hints without compilation, but verbose

### Implications
- **Type Safety**: No compile-time type checking
- **IDE Support**: Still good with modern IDEs (VS Code IntelliSense)
- **Refactoring**: More manual, less automated refactoring
- **Learning Curve**: Lower, standard JavaScript

### Modern JavaScript Features to Use
- ES Modules (import/export)
- Arrow functions
- Destructuring
- Spread operator
- Template literals
- Optional chaining (?.)
- Nullish coalescing (??)
- Async/await
- Array methods (map, filter, reduce)

---

## 5. Routing: React Router

### Decision
**Selected**: React Router v6

### Rationale
- **Standard**: De facto routing library for React
- **History API**: Supports clean URLs (no hash routing)
- **Declarative**: Route definitions as components
- **Code Splitting**: Easy lazy loading of route components
- **Well Documented**: Extensive documentation and examples

### Alternatives Considered
- **Custom Routing**: Too much work to implement History API routing
- **Reach Router**: Merged into React Router v6
- **Wouter**: Smaller but less features

### Implications
- **Bundle Size**: ~10KB gzipped (acceptable)
- **Learning Curve**: Moderate, well-documented
- **Route Guards**: Implement custom authentication guards

### Implementation Pattern
```javascript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<AuthComponent />} />
        <Route path="/books" element={<ProtectedRoute><BookListComponent /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
```

---

## 6. State Management: React useState/useContext

### Decision
**Selected**: Built-in React hooks (useState, useContext)

### Rationale
- **No External Library**: Reduces bundle size
- **Sufficient for Project**: Simple state management needs
- **Component-Centric**: Aligns with architecture decision
- **Built-in**: No additional dependencies

### Alternatives Considered
- **Redux**: Overkill for this project, adds complexity
- **Zustand**: Simpler than Redux but still unnecessary
- **Recoil**: Too complex for simple state needs
- **MobX**: Adds magic, harder to debug

### Implications
- **Bundle Size**: Zero additional bytes
- **Learning Curve**: Standard React patterns
- **State Scope**: Component-local state, context for global state (auth)

### State Management Pattern
```javascript
// Local state
const [books, setBooks] = useState([]);

// Global state (authentication)
const AuthContext = createContext();

function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  
  return (
    <AuthContext.Provider value={{ isAuthenticated, currentUserId, setIsAuthenticated, setCurrentUserId }}>
      {children}
    </AuthContext.Provider>
  );
}
```

---

## 7. Password Hashing: bcryptjs

### Decision
**Selected**: bcryptjs

### Rationale
- **Pure JavaScript**: Works in browser, no native dependencies
- **Secure**: Industry-standard password hashing
- **Configurable**: Adjustable salt rounds for security/performance balance
- **Small**: ~5KB gzipped

### Alternatives Considered
- **bcrypt**: Requires native dependencies, doesn't work in browser
- **crypto-js**: Less secure for password hashing
- **argon2**: Not available for browser

### Implications
- **Bundle Size**: ~5KB gzipped (acceptable)
- **Performance**: Hashing is intentionally slow (security feature)
- **Security**: Meets NFR-6.1 requirement for secure password storage

### Implementation Pattern
```javascript
import bcrypt from 'bcryptjs';

// Hash password on registration
const saltRounds = 10;
const hashedPassword = await bcrypt.hash(password, saltRounds);

// Verify password on login
const isValid = await bcrypt.compare(password, hashedPassword);
```

---

## 8. Local Storage Wrapper: Custom Implementation

### Decision
**Selected**: Custom localStorage wrapper functions

### Rationale
- **Simple**: localStorage API is straightforward
- **No Library Needed**: Avoid unnecessary dependencies
- **Type Safety**: JSON serialization/deserialization
- **Error Handling**: Custom error handling for quota exceeded

### Alternatives Considered
- **localForage**: Overkill, adds IndexedDB complexity
- **store.js**: Unnecessary abstraction

### Implications
- **Bundle Size**: Zero additional bytes
- **Flexibility**: Full control over storage logic
- **Error Handling**: Custom error messages

### Implementation Pattern
```javascript
// storage.js
export function getFromStorage(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error reading from storage:', error);
    return null;
  }
}

export function setToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    if (error.name === 'QuotaExceededError') {
      alert('Storage quota exceeded. Please delete some books.');
    }
    return false;
  }
}
```

---

## 9. ISBN API: Open Library API

### Decision
**Selected**: Open Library API (https://openlibrary.org/api)

### Rationale
- **Free**: No API key required
- **No Rate Limits**: Reasonable usage allowed
- **Good Coverage**: Large book database
- **Simple API**: Easy to integrate
- **No Authentication**: No OAuth or API keys needed

### Alternatives Considered
- **Google Books API**: Requires API key, rate limits
- **Goodreads API**: Deprecated, no longer available
- **ISBN DB**: Requires paid subscription

### Implications
- **Cost**: Free
- **Reliability**: Dependent on external service
- **Error Handling**: Need graceful fallback if API unavailable

### API Endpoint
```javascript
// ISBN lookup
const response = await fetch(`https://openlibrary.org/isbn/${isbn}.json`);
const bookData = await response.json();
```

---

## 10. Testing: Manual Testing Only

### Decision
**Selected**: Manual testing during development

### Rationale
- **Minimal Approach**: Focus on development speed
- **Small Project**: Limited scope, low complexity
- **No CI/CD**: Local only, no automated testing pipeline needed
- **Developer Testing**: Manual testing sufficient for personal project

### Alternatives Considered
- **Jest + React Testing Library**: Standard but adds complexity
- **Vitest**: Fast but still requires test writing
- **Cypress/Playwright**: E2E testing overkill for this project

### Implications
- **Bundle Size**: Zero test framework overhead
- **Development Speed**: Faster without writing tests
- **Quality Assurance**: Relies on manual testing
- **Regression Risk**: Higher risk of breaking changes

### Manual Testing Checklist
- Test all user workflows manually
- Test on different browsers (Chrome, Firefox, Safari, Edge)
- Test responsive design on different screen sizes
- Test keyboard navigation
- Test error scenarios

---

## 11. Code Quality: Manual Code Review

### Decision
**Selected**: Manual code review only (no linting tools)

### Rationale
- **Minimal Tooling**: Simplifies setup
- **Small Project**: Single developer, consistent style naturally
- **No CI/CD**: No automated checks needed
- **Focus on Development**: Avoid tooling overhead

### Alternatives Considered
- **ESLint + Prettier**: Standard but adds configuration
- **ESLint only**: Still requires setup and configuration

### Implications
- **Code Consistency**: Relies on developer discipline
- **Error Detection**: No automated error detection
- **Setup Time**: Faster initial setup

---

## 12. Development Environment

### Decision
**Selected**: Vite Dev Server (default configuration)

### Rationale
- **Fast HMR**: Instant hot module replacement
- **No Configuration**: Works out of the box
- **Modern**: ESM-based, leverages browser capabilities
- **Excellent DX**: Best developer experience

### Features
- Hot Module Replacement (HMR)
- Fast refresh for React components
- Instant server start
- On-demand compilation
- Source maps for debugging

---

## 13. Deployment: Local Only

### Decision
**Selected**: Local development only, no deployment

### Rationale
- **Project Scope**: Personal tool, not production application
- **Simplicity**: No hosting costs or configuration
- **Development Focus**: Focus on features, not operations

### Alternatives Considered
- **Netlify/Vercel**: Free static hosting but unnecessary
- **GitHub Pages**: Free but adds deployment complexity
- **AWS S3 + CloudFront**: Professional but overkill

### Implications
- **Accessibility**: Only accessible on developer's machine
- **Sharing**: Cannot share with others easily
- **Backup**: No automatic backup (user must export data)

---

## Complete Tech Stack Summary

### Core Technologies
- **Framework**: React 18+
- **Language**: JavaScript (ES2020+)
- **Build Tool**: Vite 4+
- **CSS**: CSS Modules with CSS Variables

### Libraries
- **Routing**: React Router v6
- **State Management**: React hooks (useState, useContext)
- **Password Hashing**: bcryptjs
- **ISBN API**: Open Library API

### Development Tools
- **Dev Server**: Vite (HMR enabled)
- **Testing**: Manual testing only
- **Linting**: Manual code review only
- **Deployment**: Local only

### Bundle Size Estimate
- React + ReactDOM: ~45KB gzipped
- React Router: ~10KB gzipped
- bcryptjs: ~5KB gzipped
- Application Code: ~50KB gzipped (estimated)
- CSS: ~20KB gzipped (estimated)
- **Total**: ~130KB gzipped (well within 250KB initial load budget)

### Browser Targets
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

### Performance Targets
- Initial load: < 2 seconds
- Interactions: < 100ms
- Animations: 30fps minimum
- Bundle size: < 500KB gzipped total

---

## Decision Rationale Summary

All technology choices prioritize:
1. **Simplicity**: Minimal configuration and tooling
2. **Modern**: Latest features and best practices
3. **Performance**: Fast development and runtime performance
4. **Maintainability**: Standard, well-documented technologies
5. **Bundle Size**: Moderate constraints, no bloat

The tech stack is optimized for a small, personal project with focus on development speed and modern best practices, while avoiding unnecessary complexity and tooling overhead.
