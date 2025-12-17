# Domain Entities - UI Foundation

## Overview
This document defines the domain entities (data structures, design tokens, and component specifications) for the UI Foundation unit.

---

## 1. Design Tokens

### 1.1 Color Tokens

```javascript
const colorTokens = {
  // Primary Colors
  primary: {
    main: '#3B82F6',
    dark: '#2563EB',
    light: '#DBEAFE'
  },
  
  // Secondary Colors
  secondary: {
    main: '#8B5CF6',
    dark: '#7C3AED',
    light: '#EDE9FE'
  },
  
  // Semantic Colors
  success: {
    main: '#10B981',
    dark: '#059669',
    light: '#D1FAE5'
  },
  warning: {
    main: '#F59E0B',
    dark: '#D97706',
    light: '#FEF3C7'
  },
  error: {
    main: '#EF4444',
    dark: '#DC2626',
    light: '#FEE2E2'
  },
  info: {
    main: '#06B6D4',
    dark: '#0891B2',
    light: '#CFFAFE'
  },
  
  // Neutral Colors
  gray: {
    900: '#111827',
    700: '#374151',
    500: '#6B7280',
    300: '#D1D5DB',
    200: '#E5E7EB',
    100: '#F3F4F6',
    50: '#F9FAFB'
  },
  
  // Base Colors
  white: '#FFFFFF',
  black: '#000000'
};
```

### 1.2 Typography Tokens

```javascript
const typographyTokens = {
  // Font Families
  fontFamily: {
    primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    monospace: "'Fira Code', 'Courier New', monospace"
  },
  
  // Font Sizes
  fontSize: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '30px'
  },
  
  // Font Weights
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700
  },
  
  // Line Heights
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75
  }
};
```

### 1.3 Spacing Tokens

```javascript
const spacingTokens = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
  '3xl': '64px'
};
```

### 1.4 Border Tokens

```javascript
const borderTokens = {
  // Border Widths
  width: {
    thin: '1px',
    medium: '2px',
    thick: '4px'
  },
  
  // Border Radius
  radius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    full: '9999px'
  },
  
  // Border Colors
  color: {
    default: '#D1D5DB', // gray.300
    focus: '#3B82F6',   // primary.main
    error: '#EF4444'    // error.main
  }
};
```

### 1.5 Shadow Tokens

```javascript
const shadowTokens = {
  sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px rgba(0, 0, 0, 0.15)'
};
```

### 1.6 Animation Tokens

```javascript
const animationTokens = {
  // Durations
  duration: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms'
  },
  
  // Easing Functions
  easing: {
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)'
  }
};
```

### 1.7 Breakpoint Tokens

```javascript
const breakpointTokens = {
  mobile: '320px',
  tablet: '768px',
  desktop: '1024px'
};
```

---

## 2. Application State Entities

### 2.1 Authentication State

```typescript
interface AuthenticationState {
  isAuthenticated: boolean;
  currentUserId: string | null;
}
```

**Properties**:
- `isAuthenticated`: Boolean indicating if user is logged in
- `currentUserId`: ID of currently logged-in user, null if not authenticated

**Example**:
```javascript
{
  isAuthenticated: true,
  currentUserId: "user-123-abc"
}
```

### 2.2 Route State

```typescript
interface RouteState {
  currentPath: string;
  previousPath: string | null;
  params: Record<string, string>;
}
```

**Properties**:
- `currentPath`: Current URL path (e.g., "/books")
- `previousPath`: Previous URL path for back navigation
- `params`: Route parameters (e.g., { id: "book-123" })

**Example**:
```javascript
{
  currentPath: "/books/book-123/edit",
  previousPath: "/books",
  params: { id: "book-123" }
}
```

### 2.3 Loading State

```typescript
interface LoadingState {
  isLoading: boolean;
  loadingCounter: number;
  loadingMessage: string | null;
}
```

**Properties**:
- `isLoading`: Boolean indicating if loading overlay is visible
- `loadingCounter`: Counter for tracking multiple loading operations
- `loadingMessage`: Optional message to display during loading

**Example**:
```javascript
{
  isLoading: true,
  loadingCounter: 2,
  loadingMessage: "Loading books..."
}
```

### 2.4 Modal State

```typescript
interface ModalState {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel: (() => void) | null;
}
```

**Properties**:
- `isOpen`: Boolean indicating if modal is visible
- `title`: Modal title text
- `message`: Modal message/content text
- `confirmText`: Text for confirm button (e.g., "Delete")
- `cancelText`: Text for cancel button (e.g., "Cancel")
- `onConfirm`: Callback function for confirm action
- `onCancel`: Optional callback function for cancel action

**Example**:
```javascript
{
  isOpen: true,
  title: "Delete Book",
  message: "Are you sure you want to delete this book? This action cannot be undone.",
  confirmText: "Delete",
  cancelText: "Cancel",
  onConfirm: () => deleteBook(bookId),
  onCancel: () => closeModal()
}
```

---

## 3. Component Specifications

### 3.1 Button Component

```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'outline' | 'ghost';
  size: 'small' | 'medium' | 'large';
  disabled: boolean;
  type: 'button' | 'submit' | 'reset';
  onClick: () => void;
  children: string | ReactNode;
  ariaLabel?: string;
}
```

**Variants**:
- `primary`: Primary color background, white text
- `secondary`: Secondary color background, white text
- `outline`: Transparent background, colored border and text
- `ghost`: Transparent background, colored text, no border

**Sizes**:
- `small`: 32px height, 12px padding, 14px font
- `medium`: 40px height, 16px padding, 16px font
- `large`: 48px height, 20px padding, 18px font

**States**:
- Default, Hover, Active, Disabled, Focus

### 3.2 Input Component

```typescript
interface InputProps {
  type: 'text' | 'number' | 'email' | 'password';
  value: string | number;
  onChange: (value: string | number) => void;
  onBlur: () => void;
  label: string;
  placeholder?: string;
  required: boolean;
  disabled: boolean;
  readOnly: boolean;
  error: string | null;
  ariaLabel?: string;
}
```

**Types**:
- `text`: Single-line text input
- `number`: Numeric input
- `email`: Email input with validation
- `password`: Masked text input

**States**:
- Default, Focus, Error, Disabled, Read-only

### 3.3 Form Component

```typescript
interface FormProps {
  onSubmit: (data: Record<string, any>) => void;
  children: ReactNode;
  validateOnBlur: boolean;
  validateOnSubmit: boolean;
}
```

**Behavior**:
- Validates fields on blur
- Validates all fields on submit
- Prevents submission with errors
- Focuses first error field

### 3.4 Card Component

```typescript
interface CardProps {
  children: ReactNode;
  clickable: boolean;
  onClick?: () => void;
  padding: 'small' | 'medium' | 'large';
  elevation: 'sm' | 'md' | 'lg';
}
```

**Padding Sizes**:
- `small`: 12px
- `medium`: 16px
- `large`: 24px

**Elevation Levels**:
- `sm`: Subtle shadow
- `md`: Standard shadow
- `lg`: High shadow

### 3.5 Modal Component

```typescript
interface ModalProps {
  isOpen: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
  showCloseButton: boolean;
  maxWidth: string;
  footer?: ReactNode;
}
```

**Behavior**:
- Opens with fade-in animation
- Closes with fade-out animation
- Traps focus while open
- Closes on ESC key or overlay click

### 3.6 Progress Bar Component

```typescript
interface ProgressBarProps {
  value: number; // 0-100
  showPercentage: boolean;
  color: 'primary' | 'success' | 'warning' | 'error';
  height: 'small' | 'medium' | 'large';
  animated: boolean;
}
```

**Height Sizes**:
- `small`: 4px
- `medium`: 8px
- `large`: 12px

**Colors**:
- `primary`: Blue
- `success`: Green
- `warning`: Amber
- `error`: Red

### 3.7 Star Rating Component

```typescript
interface StarRatingProps {
  value: number; // 0-5
  onChange?: (value: number) => void;
  readOnly: boolean;
  size: 'small' | 'medium' | 'large';
  color: string;
}
```

**Sizes**:
- `small`: 16px
- `medium`: 24px
- `large`: 32px

**Modes**:
- Interactive: Clickable, onChange callback
- Display: Read-only, no interaction

### 3.8 Notification Component

```typescript
interface NotificationProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  dismissible: boolean;
  onDismiss?: () => void;
  icon?: ReactNode;
}
```

**Types**:
- `success`: Green background, checkmark icon
- `error`: Red background, X icon
- `warning`: Amber background, exclamation icon
- `info`: Cyan background, info icon

### 3.9 Loading Spinner Component

```typescript
interface LoadingSpinnerProps {
  size: 'small' | 'medium' | 'large';
  color: string;
  message?: string;
}
```

**Sizes**:
- `small`: 16px
- `medium`: 32px
- `large`: 48px

### 3.10 Loading Overlay Component

```typescript
interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  spinnerSize: 'small' | 'medium' | 'large';
}
```

**Behavior**:
- Full-screen overlay
- Semi-transparent white background
- Centered spinner
- Optional loading message

---

## 4. Route Entities

### 4.1 Route Definition

```typescript
interface Route {
  path: string;
  component: Component;
  isProtected: boolean;
  exact: boolean;
}
```

**Properties**:
- `path`: URL path pattern (e.g., "/books/:id")
- `component`: Component to render for this route
- `isProtected`: Whether route requires authentication
- `exact`: Whether path must match exactly

**Example**:
```javascript
{
  path: "/books/:id/edit",
  component: BookFormComponent,
  isProtected: true,
  exact: true
}
```

### 4.2 Route Map

```typescript
const routeMap: Route[] = [
  // Public Routes
  { path: '/login', component: AuthComponent, isProtected: false, exact: true },
  { path: '/register', component: AuthComponent, isProtected: false, exact: true },
  
  // Protected Routes
  { path: '/books', component: BookListComponent, isProtected: true, exact: true },
  { path: '/books/add', component: BookFormComponent, isProtected: true, exact: true },
  { path: '/books/:id/edit', component: BookFormComponent, isProtected: true, exact: true },
  { path: '/books/:id/progress', component: ProgressTrackerComponent, isProtected: true, exact: true },
  { path: '/books/:id/notes', component: NotesRatingsComponent, isProtected: true, exact: true },
  { path: '/statistics', component: StatisticsComponent, isProtected: true, exact: true },
  { path: '/search', component: SearchComponent, isProtected: true, exact: true },
  { path: '/export', component: ExportComponent, isProtected: true, exact: true }
];
```

---

## 5. Error Entities

### 5.1 Error State

```typescript
interface ErrorState {
  hasError: boolean;
  errorMessage: string;
  errorType: 'validation' | 'system' | 'network';
}
```

**Properties**:
- `hasError`: Boolean indicating if error exists
- `errorMessage`: Human-readable error message
- `errorType`: Category of error

**Example**:
```javascript
{
  hasError: true,
  errorMessage: "Email is required",
  errorType: "validation"
}
```

### 5.2 Validation Error

```typescript
interface ValidationError {
  field: string;
  message: string;
  rule: string;
}
```

**Properties**:
- `field`: Name of field with error
- `message`: Error message to display
- `rule`: Validation rule that failed

**Example**:
```javascript
{
  field: "email",
  message: "Email must be a valid email address",
  rule: "email_format"
}
```

---

## 6. Layout Entities

### 6.1 Container Configuration

```typescript
interface ContainerConfig {
  maxWidth: string;
  padding: {
    mobile: string;
    tablet: string;
    desktop: string;
  };
  centered: boolean;
}
```

**Default Configuration**:
```javascript
{
  maxWidth: '1200px',
  padding: {
    mobile: '16px',
    tablet: '24px',
    desktop: '24px'
  },
  centered: true
}
```

### 6.2 Grid Configuration

```typescript
interface GridConfig {
  columns: number;
  gutter: string;
  responsive: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
}
```

**Default Configuration**:
```javascript
{
  columns: 12,
  gutter: '16px',
  responsive: {
    mobile: 1,    // 1 column on mobile
    tablet: 2,    // 2 columns on tablet
    desktop: 12   // 12 columns on desktop
  }
}
```

---

## 7. Accessibility Entities

### 7.1 ARIA Attributes

```typescript
interface AriaAttributes {
  label?: string;
  labelledBy?: string;
  describedBy?: string;
  hidden?: boolean;
  live?: 'off' | 'polite' | 'assertive';
  role?: string;
}
```

**Common Roles**:
- `button`: Button element
- `dialog`: Modal dialog
- `alert`: Alert message
- `navigation`: Navigation menu
- `main`: Main content area

### 7.2 Focus State

```typescript
interface FocusState {
  hasFocus: boolean;
  focusedElement: HTMLElement | null;
  previousFocusedElement: HTMLElement | null;
}
```

**Properties**:
- `hasFocus`: Boolean indicating if element has focus
- `focusedElement`: Currently focused element
- `previousFocusedElement`: Previously focused element (for restoration)

---

## 8. Local Storage Entities

### 8.1 Storage Keys

```typescript
const storageKeys = {
  USERS: 'users',
  BOOKS: 'books',
  CURRENT_USER: 'currentUser'
};
```

### 8.2 Storage Operations

```typescript
interface StorageOperation {
  key: string;
  operation: 'read' | 'write' | 'delete';
  data?: any;
}
```

---

## Summary

This document defines all domain entities for the UI Foundation:

**Design Tokens**:
- Color tokens (primary, secondary, semantic, neutral)
- Typography tokens (fonts, sizes, weights, line heights)
- Spacing tokens (xs to 3xl)
- Border tokens (widths, radius, colors)
- Shadow tokens (sm to xl)
- Animation tokens (durations, easing)
- Breakpoint tokens (mobile, tablet, desktop)

**State Entities**:
- Authentication state
- Route state
- Loading state
- Modal state
- Error state
- Focus state

**Component Specifications**:
- Button, Input, Form, Card, Modal
- Progress Bar, Star Rating, Notification
- Loading Spinner, Loading Overlay

**Route Entities**:
- Route definitions
- Route map (public and protected routes)

**Layout Entities**:
- Container configuration
- Grid configuration

**Accessibility Entities**:
- ARIA attributes
- Focus state

All entities are technology-agnostic and can be implemented in any modern JavaScript framework.
