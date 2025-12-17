# Business Logic Model - UI Foundation

## Overview
This document defines the business logic for the UI Foundation unit, focusing on application shell behavior, routing logic, and component interaction patterns.

---

## 1. Application Shell Logic

### 1.1 Application Initialization

**Initialization Sequence**:
1. Load application on page load
2. Check for existing session in local storage
3. Read `currentUser` from local storage
4. If `currentUser` exists and is valid → Set authenticated state to true
5. If `currentUser` is null or invalid → Set authenticated state to false
6. Route to appropriate initial view based on authentication state

**Pseudocode**:
```
function initializeApp():
    currentUserId = localStorage.getItem('currentUser')
    
    if currentUserId is not null:
        user = getUserById(currentUserId)
        if user exists:
            setAuthenticatedState(true, currentUserId)
            navigateTo('/books')
        else:
            setAuthenticatedState(false, null)
            navigateTo('/login')
    else:
        setAuthenticatedState(false, null)
        navigateTo('/login')
```

### 1.2 Authentication State Management

**State Structure**:
```javascript
{
    isAuthenticated: boolean,
    currentUserId: string | null
}
```

**State Transitions**:
- **Login Success**: `isAuthenticated = false` → `isAuthenticated = true`, store `currentUserId`
- **Logout**: `isAuthenticated = true` → `isAuthenticated = false`, clear `currentUserId`
- **Session Expiry**: `isAuthenticated = true` → `isAuthenticated = false` (if user data invalid)

**State Persistence**:
- Store `currentUser` in local storage on login
- Clear `currentUser` from local storage on logout
- Check `currentUser` validity on app initialization

### 1.3 Application Shell Structure

**Layout Components**:
```
AppShell
├── Header (when authenticated)
│   ├── Logo/Title
│   ├── Navigation Menu
│   └── User Actions (Logout)
├── Main Content Area
│   └── [Current Route Component]
└── Footer (optional)
```

**Header Visibility Logic**:
- Show header only when `isAuthenticated = true`
- Hide header when `isAuthenticated = false` (login/register screens)

**Navigation Menu Items** (when authenticated):
- Books (default view)
- Statistics
- Search
- Export

---

## 2. Routing Logic

### 2.1 Route Definitions

**Public Routes** (accessible without authentication):
- `/login` - Login screen
- `/register` - Registration screen

**Protected Routes** (require authentication):
- `/books` - Book list view (default after login)
- `/books/add` - Add book form
- `/books/:id/edit` - Edit book form
- `/books/:id/progress` - Progress tracker
- `/books/:id/notes` - Notes and ratings
- `/statistics` - Statistics dashboard
- `/search` - Search interface
- `/export` - Export functionality

### 2.2 Route Guard Logic

**Route Access Control**:
```
function canAccessRoute(route, isAuthenticated):
    if route is public route:
        return true
    
    if route is protected route:
        if isAuthenticated is true:
            return true
        else:
            redirectTo('/login')
            return false
```

**Navigation Flow**:
1. User attempts to navigate to route
2. Check if route is protected
3. If protected, check authentication state
4. If not authenticated, redirect to `/login`
5. If authenticated, allow navigation

### 2.3 History API Integration

**URL Management**:
- Use `history.pushState()` for navigation
- Use `history.replaceState()` for redirects
- Listen to `popstate` event for browser back/forward buttons

**Navigation Function**:
```
function navigateTo(path):
    if canAccessRoute(path, isAuthenticated):
        history.pushState({}, '', path)
        renderComponent(getComponentForRoute(path))
    else:
        history.replaceState({}, '', '/login')
        renderComponent(LoginComponent)
```

### 2.4 Route-to-Component Mapping

**Route Resolution**:
```
function getComponentForRoute(path):
    switch path:
        case '/login': return AuthComponent (login mode)
        case '/register': return AuthComponent (register mode)
        case '/books': return BookListComponent
        case '/books/add': return BookFormComponent (add mode)
        case '/books/:id/edit': return BookFormComponent (edit mode)
        case '/books/:id/progress': return ProgressTrackerComponent
        case '/books/:id/notes': return NotesRatingsComponent
        case '/statistics': return StatisticsComponent
        case '/search': return SearchComponent
        case '/export': return ExportComponent
        default: return NotFoundComponent
```

---

## 3. Component Lifecycle Logic

### 3.1 Component Mounting

**Mount Sequence**:
1. Route changes
2. Unmount current component (if any)
3. Resolve new component from route
4. Mount new component
5. Call component's initialization method
6. Render component in main content area

### 3.2 Component Unmounting

**Unmount Sequence**:
1. Call component's cleanup method
2. Remove component from DOM
3. Clear component state
4. Release event listeners

---

## 4. Session Management Logic

### 4.1 Login Flow

**Login Sequence**:
1. User submits login form (in AuthComponent)
2. AuthComponent validates credentials
3. AuthComponent emits `onLoginSuccess(userId)` event
4. App Component receives event
5. App Component updates authentication state: `isAuthenticated = true`, `currentUserId = userId`
6. App Component stores `currentUser` in local storage
7. App Component navigates to `/books`

### 4.2 Logout Flow

**Logout Sequence**:
1. User clicks logout button
2. App Component clears authentication state: `isAuthenticated = false`, `currentUserId = null`
3. App Component removes `currentUser` from local storage
4. App Component navigates to `/login`

### 4.3 Session Persistence

**Session Check on Page Load**:
```
function checkSession():
    currentUserId = localStorage.getItem('currentUser')
    
    if currentUserId is null:
        return { isAuthenticated: false, userId: null }
    
    user = getUserFromLocalStorage(currentUserId)
    
    if user exists:
        return { isAuthenticated: true, userId: currentUserId }
    else:
        localStorage.removeItem('currentUser')
        return { isAuthenticated: false, userId: null }
```

---

## 5. Error Handling Logic

### 5.1 Error Display Pattern

**Inline Error Display**:
- Errors displayed next to the component/field that caused them
- Each component manages its own error state
- Error messages shown in red text below relevant field/component

**Error State Structure**:
```javascript
{
    hasError: boolean,
    errorMessage: string
}
```

### 5.2 Error Clearing Logic

**Error Clearing Rules**:
- Clear error when user starts correcting the issue
- Clear error on successful operation
- Clear error when component unmounts

---

## 6. Loading State Logic

### 6.1 Global Loading Overlay

**Loading State Management**:
- Single global loading state: `isLoading: boolean`
- Show full-screen overlay with spinner when `isLoading = true`
- Hide overlay when `isLoading = false`

**Loading Trigger Points**:
- Component requests loading state: `setLoading(true)`
- Component completes operation: `setLoading(false)`
- Multiple components can trigger loading (use counter to track)

**Loading Counter Logic**:
```
loadingCounter = 0

function showLoading():
    loadingCounter++
    if loadingCounter > 0:
        display loading overlay

function hideLoading():
    loadingCounter--
    if loadingCounter <= 0:
        loadingCounter = 0
        hide loading overlay
```

### 6.2 Loading Timeout

**Timeout Handling**:
- Set maximum loading duration (e.g., 30 seconds)
- If operation exceeds timeout, hide loading and show error
- Prevent infinite loading states

---

## 7. Modal Dialog Logic

### 7.1 Modal State Management

**Modal State**:
```javascript
{
    isOpen: boolean,
    title: string,
    message: string,
    confirmText: string,
    cancelText: string,
    onConfirm: function,
    onCancel: function
}
```

### 7.2 Modal Display Logic

**Show Modal**:
```
function showModal(title, message, onConfirm, onCancel):
    modalState.isOpen = true
    modalState.title = title
    modalState.message = message
    modalState.onConfirm = onConfirm
    modalState.onCancel = onCancel
    render modal overlay
```

**Hide Modal**:
```
function hideModal():
    modalState.isOpen = false
    remove modal overlay
```

### 7.3 Modal Interaction Logic

**Confirm Action**:
1. User clicks confirm button
2. Execute `onConfirm` callback
3. Hide modal

**Cancel Action**:
1. User clicks cancel button or overlay
2. Execute `onCancel` callback (if provided)
3. Hide modal

**Keyboard Interaction**:
- ESC key → Cancel action
- Enter key → Confirm action (if focused on confirm button)

---

## 8. Form Validation Logic

### 8.1 On-Blur Validation

**Validation Trigger**:
- Validate field when user leaves the field (blur event)
- Do not validate while user is typing
- Show error message immediately after blur if validation fails

**Validation Flow**:
```
function onFieldBlur(field):
    value = field.value
    validationResult = validateField(field.name, value)
    
    if validationResult.isValid:
        clearFieldError(field.name)
    else:
        showFieldError(field.name, validationResult.errorMessage)
```

### 8.2 Form Submission Validation

**Submit Validation**:
1. User submits form
2. Validate all fields
3. If any field invalid, show all errors and prevent submission
4. If all fields valid, proceed with submission

**Validation Flow**:
```
function onFormSubmit(form):
    errors = []
    
    for each field in form:
        validationResult = validateField(field.name, field.value)
        if not validationResult.isValid:
            errors.push({ field: field.name, message: validationResult.errorMessage })
    
    if errors.length > 0:
        displayAllErrors(errors)
        return false
    else:
        submitForm(form)
        return true
```

---

## 9. Responsive Scaling Logic

### 9.1 Desktop-First Approach

**Layout Scaling**:
- Design for desktop viewport (1024px+)
- Scale down proportionally for smaller screens
- Use CSS `viewport` meta tag for proper scaling
- Apply `max-width` constraints to prevent excessive stretching

**Viewport Configuration**:
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

### 9.2 Scaling Breakpoints

**Breakpoint Definitions**:
- Desktop: 1024px and above (base design)
- Tablet: 768px - 1023px (scaled down)
- Mobile: 320px - 767px (scaled down further)

**Scaling Rules**:
- Font sizes scale proportionally
- Spacing scales proportionally
- Layout remains single-column on mobile
- Touch targets increase on mobile (minimum 44px)

---

## 10. Component Communication Logic

### 10.1 Parent-Child Communication

**Props Down**:
- Parent passes data to child via props
- Child receives props and renders accordingly
- Props are read-only in child component

**Events Up**:
- Child emits events to parent
- Parent listens to child events
- Parent handles event and updates state

**Example Flow**:
```
Parent Component (BookListComponent)
    ↓ passes bookId prop
Child Component (BookItemComponent)
    ↑ emits onEdit(bookId) event
Parent Component receives event
    → opens edit form
```

### 10.2 Sibling Communication

**Via Parent Coordination**:
- Siblings do not communicate directly
- Communication flows through shared parent
- Parent coordinates state changes between siblings

**Example Flow**:
```
Component A (BookFormComponent)
    ↑ emits onSave(bookData)
Parent (BookListComponent)
    → updates book list state
    ↓ passes updated books to Component B
Component B (BookItemComponent)
    → re-renders with new data
```

---

## 11. Local Storage Access Logic

### 11.1 Read Operations

**Read Pattern**:
```
function readFromLocalStorage(key):
    try:
        data = localStorage.getItem(key)
        if data is null:
            return default value
        return JSON.parse(data)
    catch error:
        log error
        return default value
```

### 11.2 Write Operations

**Write Pattern**:
```
function writeToLocalStorage(key, value):
    try:
        data = JSON.stringify(value)
        localStorage.setItem(key, data)
        return true
    catch error:
        log error
        show error to user
        return false
```

### 11.3 Storage Keys

**Key Definitions**:
- `users` - Array of user objects
- `books` - Array of book objects
- `currentUser` - Current logged-in user ID

---

## 12. Accessibility Logic

### 12.1 Keyboard Navigation

**Tab Order**:
- Interactive elements receive focus in logical order
- Skip links for main content
- Focus visible indicator on all interactive elements

**Keyboard Shortcuts**:
- Tab: Move to next focusable element
- Shift+Tab: Move to previous focusable element
- Enter: Activate button/link
- Space: Activate button/checkbox
- ESC: Close modal/dialog

### 12.2 ARIA Labels

**Label Requirements**:
- All form inputs have associated labels
- Buttons have descriptive text or aria-label
- Icons have aria-label for screen readers
- Modal dialogs have aria-labelledby and aria-describedby

**ARIA Attributes**:
- `aria-label`: Descriptive label for element
- `aria-labelledby`: Reference to label element
- `aria-describedby`: Reference to description element
- `aria-hidden`: Hide decorative elements from screen readers
- `role`: Define element role (button, dialog, alert, etc.)

### 12.3 Focus Management

**Focus Rules**:
- Focus moves to modal when opened
- Focus returns to trigger element when modal closes
- Focus moves to first error field on validation failure
- Focus visible on all interactive elements

---

## Summary

This business logic model defines:
- Application initialization and session management
- Routing and navigation logic with History API
- Authentication state management (simple boolean)
- Error handling (inline messages)
- Loading state management (global overlay)
- Modal dialog behavior
- Form validation (on-blur)
- Responsive scaling (desktop-first)
- Component communication patterns
- Local storage access patterns
- Basic accessibility features

All logic is technology-agnostic and can be implemented in any modern JavaScript framework (React, Vue, Angular).
