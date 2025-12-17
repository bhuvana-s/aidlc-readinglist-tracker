# Manual Testing Checklist - UI Foundation

## Overview
This document provides a comprehensive manual testing checklist for Unit 1: UI Foundation components.

---

## Setup Testing

### Project Build
- [ ] Run `npm install` - All dependencies install without errors
- [ ] Run `npm run dev` - Development server starts successfully
- [ ] Open `http://localhost:5173` - Application loads without errors
- [ ] Check browser console - No JavaScript errors
- [ ] Run `npm run build` - Production build completes successfully
- [ ] Run `npm run preview` - Production preview works

---

## Design System Testing

### Global Styles
- [ ] Page background is white
- [ ] Default font is Inter (or system fallback)
- [ ] Base font size is 16px
- [ ] Text color is dark gray (#111827)
- [ ] Links are blue and change color on hover

### CSS Custom Properties
- [ ] Open browser DevTools
- [ ] Inspect `:root` element
- [ ] Verify all CSS custom properties are defined
- [ ] Verify color values match design system
- [ ] Verify spacing values are multiples of 4px

---

## Component Testing

### Button Component
- [ ] **Variants**: Primary (blue), Secondary (purple), Outline (transparent with border), Ghost (transparent)
- [ ] **Sizes**: Small (32px), Medium (40px), Large (48px)
- [ ] **Hover**: Background darkens, slight scale up (1.02)
- [ ] **Active**: Scale down (0.98)
- [ ] **Disabled**: Reduced opacity (0.5), no hover effect, not clickable
- [ ] **Focus**: 2px blue outline visible when tabbed to
- [ ] **Keyboard**: Enter key activates button
- [ ] **Accessibility**: aria-label present

### Input Component
- [ ] **Types**: Text, Number, Email, Password work correctly
- [ ] **Label**: Displays above input
- [ ] **Required**: Asterisk (*) shows for required fields
- [ ] **Placeholder**: Gray text displays when empty
- [ ] **Focus**: Blue border appears on focus
- [ ] **Error**: Red border and error message display below input
- [ ] **Disabled**: Gray background, not editable
- [ ] **Read-only**: Gray background, not editable
- [ ] **Keyboard**: Tab moves between inputs
- [ ] **Accessibility**: aria-label, aria-invalid, aria-describedby present

### Form Component
- [ ] **Layout**: Vertical layout with proper spacing
- [ ] **Submit**: Prevents default form submission
- [ ] **Callback**: onSubmit callback fires on submit
- [ ] **Keyboard**: Enter key submits form
- [ ] **Accessibility**: aria-label present

### Card Component
- [ ] **Appearance**: White background, rounded corners, shadow
- [ ] **Clickable**: Hover increases shadow, cursor changes to pointer
- [ ] **Non-clickable**: No hover effect
- [ ] **Keyboard**: Tab focuses clickable cards, Enter/Space activates
- [ ] **Accessibility**: role="button" for clickable cards

### Modal Component
- [ ] **Open**: Modal appears with fade-in animation
- [ ] **Overlay**: Semi-transparent black background
- [ ] **Close Button**: X button in top-right closes modal
- [ ] **Overlay Click**: Clicking overlay closes modal
- [ ] **ESC Key**: Pressing ESC closes modal
- [ ] **Focus**: Focus moves to modal when opened
- [ ] **Focus Return**: Focus returns to trigger element when closed
- [ ] **Scroll**: Content scrolls if exceeds max height
- [ ] **Keyboard**: Tab cycles through modal elements only
- [ ] **Accessibility**: role="dialog", aria-modal, aria-labelledby present

### ProgressBar Component
- [ ] **Value**: Bar fills to correct percentage (0-100)
- [ ] **Percentage**: Text displays correct percentage
- [ ] **Animation**: Bar animates smoothly when value changes
- [ ] **Color**: Default blue, custom color works
- [ ] **Accessibility**: role="progressbar", aria-valuenow present

### StarRating Component
- [ ] **Display**: 5 stars display horizontally
- [ ] **Value**: Correct number of stars filled (0-5)
- [ ] **Interactive**: Clicking star sets rating
- [ ] **Hover**: Stars highlight on hover (interactive mode)
- [ ] **Read-only**: Stars not clickable in read-only mode
- [ ] **Keyboard**: Tab focuses stars, Enter/Space selects
- [ ] **Accessibility**: role="radiogroup", aria-label present

### Notification Component
- [ ] **Types**: Success (green), Error (red), Warning (amber), Info (cyan)
- [ ] **Icon**: Correct icon displays for each type
- [ ] **Message**: Message text displays correctly
- [ ] **Dismiss**: X button closes notification
- [ ] **Accessibility**: role="alert", aria-live present

### LoadingSpinner Component
- [ ] **Sizes**: Small (16px), Medium (32px), Large (48px)
- [ ] **Animation**: Spinner rotates continuously
- [ ] **Color**: Blue spinner
- [ ] **Accessibility**: role="status", aria-label present

---

## Utility Component Testing

### ErrorBoundary Component
- [ ] **Error Catch**: Catches errors in child components
- [ ] **Error Display**: Shows error message
- [ ] **Try Again**: Button resets error state
- [ ] **Console**: Error logged to console

### ProtectedRoute Component
- [ ] **Authenticated**: Renders children when authenticated
- [ ] **Unauthenticated**: Redirects to /login when not authenticated
- [ ] **Navigation**: Uses React Router Navigate component

### LoadingOverlay Component
- [ ] **Display**: Shows when loading state is true
- [ ] **Hide**: Hides when loading state is false
- [ ] **Spinner**: Large spinner displays
- [ ] **Message**: Optional message displays below spinner
- [ ] **Overlay**: Semi-transparent white background
- [ ] **Z-index**: Appears above all other content (z-index: 9999)
- [ ] **Interaction**: Prevents interaction with page content

---

## Context Testing

### AuthContext
- [ ] **Initial State**: isAuthenticated is false, currentUserId is null
- [ ] **Session Check**: Checks localStorage for existing session on mount
- [ ] **Login**: Sets isAuthenticated to true, stores userId in localStorage
- [ ] **Logout**: Sets isAuthenticated to false, removes userId from localStorage
- [ ] **useAuth Hook**: Throws error when used outside AuthProvider

### LoadingContext
- [ ] **Initial State**: isLoading is false, loadingCounter is 0
- [ ] **Show Loading**: Increments counter, sets isLoading to true
- [ ] **Hide Loading**: Decrements counter, sets isLoading to false when counter reaches 0
- [ ] **Multiple Calls**: Counter handles multiple simultaneous loading operations
- [ ] **useLoading Hook**: Throws error when used outside LoadingProvider

---

## Utility Module Testing

### storage.js
- [ ] **getFromStorage**: Returns parsed data from localStorage
- [ ] **getFromStorage**: Returns null if key doesn't exist
- [ ] **getFromStorage**: Returns null on JSON parse error
- [ ] **setToStorage**: Stores stringified data in localStorage
- [ ] **setToStorage**: Returns true on success
- [ ] **setToStorage**: Returns false on error (quota exceeded)
- [ ] **removeFromStorage**: Removes item from localStorage

### validation.js
- [ ] **validateEmail**: Returns error for empty email
- [ ] **validateEmail**: Returns error for invalid format
- [ ] **validateEmail**: Returns valid for correct email
- [ ] **validatePassword**: Returns error for empty password
- [ ] **validatePassword**: Returns error for password < 8 characters
- [ ] **validatePassword**: Returns error for password without letter
- [ ] **validatePassword**: Returns error for password without number
- [ ] **validatePassword**: Returns valid for correct password
- [ ] **validateRequired**: Returns error for empty value
- [ ] **validateRequired**: Returns valid for non-empty value
- [ ] **validateNumber**: Returns error for non-numeric value
- [ ] **validateNumber**: Returns error for value below min
- [ ] **validateNumber**: Returns error for value above max
- [ ] **validateNumber**: Returns valid for value in range

### idGenerator.js
- [ ] **generateId**: Returns a string
- [ ] **generateId**: Returns unique IDs on multiple calls
- [ ] **generateId**: Uses crypto.randomUUID if available
- [ ] **generateId**: Falls back to manual UUID generation

### dateUtils.js
- [ ] **formatDate**: Returns formatted date string (e.g., "Jan 15, 2024")
- [ ] **formatDate**: Returns empty string for invalid date
- [ ] **getCurrentDate**: Returns current date in ISO format (YYYY-MM-DD)
- [ ] **getMonthYear**: Returns month and year (e.g., "2024-01")
- [ ] **getMonthYear**: Returns empty string for invalid date
- [ ] **daysBetween**: Returns number of days between two dates
- [ ] **daysBetween**: Returns 0 for invalid dates

---

## Routing Testing

### Public Routes
- [ ] `/login` - Displays login placeholder
- [ ] `/register` - Displays register placeholder
- [ ] Public routes accessible without authentication

### Protected Routes
- [ ] `/books` - Redirects to /login when not authenticated
- [ ] `/statistics` - Redirects to /login when not authenticated
- [ ] `/search` - Redirects to /login when not authenticated
- [ ] `/export` - Redirects to /login when not authenticated
- [ ] Protected routes accessible when authenticated (after implementing auth in Unit 2)

### Navigation
- [ ] `/` - Redirects to /login
- [ ] Unknown routes - Redirect to /login
- [ ] Browser back button works
- [ ] Browser forward button works

### Header
- [ ] Header hidden on login/register pages
- [ ] Header visible on protected routes (when authenticated)
- [ ] Logo displays "Reading List Tracker"
- [ ] Navigation links work (Books, Statistics, Search, Export)
- [ ] Logout button visible
- [ ] Logout button clears session and redirects to login

---

## Accessibility Testing

### Keyboard Navigation
- [ ] Tab key moves focus through interactive elements
- [ ] Shift+Tab moves focus backwards
- [ ] Enter key activates buttons and links
- [ ] Space key activates buttons
- [ ] ESC key closes modals
- [ ] Focus visible on all interactive elements (2px blue outline)

### Screen Reader Testing
- [ ] All images have alt text
- [ ] All form inputs have labels
- [ ] All buttons have descriptive text or aria-label
- [ ] Error messages announced with role="alert"
- [ ] Loading states announced with aria-live
- [ ] Modal dialogs have aria-labelledby and aria-describedby

### Color Contrast
- [ ] Text on white background has 4.5:1 contrast ratio
- [ ] Button text on colored backgrounds has 4.5:1 contrast ratio
- [ ] Error messages have sufficient contrast
- [ ] Links have sufficient contrast

---

## Responsive Design Testing

### Desktop (1024px+)
- [ ] Layout uses full width up to 1200px max
- [ ] Header displays horizontally
- [ ] Navigation displays horizontally
- [ ] Content centered with proper margins

### Tablet (768px - 1023px)
- [ ] Layout scales down proportionally
- [ ] Touch targets remain at least 40px
- [ ] Content readable and usable

### Mobile (320px - 767px)
- [ ] Header stacks vertically
- [ ] Navigation stacks vertically
- [ ] Touch targets at least 44px
- [ ] Content readable without horizontal scroll
- [ ] Buttons full width where appropriate

---

## Browser Compatibility Testing

### Chrome (latest)
- [ ] All features work
- [ ] No console errors
- [ ] Styles render correctly

### Firefox (latest)
- [ ] All features work
- [ ] No console errors
- [ ] Styles render correctly

### Safari (latest)
- [ ] All features work
- [ ] No console errors
- [ ] Styles render correctly

### Edge (latest)
- [ ] All features work
- [ ] No console errors
- [ ] Styles render correctly

---

## Performance Testing

### Load Time
- [ ] Initial page load < 2 seconds
- [ ] No layout shift on load
- [ ] Fonts load without flash of unstyled text

### Interactions
- [ ] Button clicks respond < 100ms
- [ ] Input typing has no lag
- [ ] Modal open/close animations smooth (300ms)
- [ ] Transitions smooth (no jank)

### Bundle Size
- [ ] Production build < 250KB gzipped
- [ ] Vendor bundle separated
- [ ] No unnecessary dependencies

---

## Error Handling Testing

### Component Errors
- [ ] ErrorBoundary catches component errors
- [ ] Error message displays to user
- [ ] Try Again button resets error state
- [ ] Error logged to console

### Storage Errors
- [ ] Quota exceeded error shows alert
- [ ] JSON parse errors handled gracefully
- [ ] Missing keys return null

### Validation Errors
- [ ] Form validation errors display inline
- [ ] Error messages are clear and actionable
- [ ] Errors clear when user corrects input

---

## Success Criteria

All checkboxes above must be checked for Unit 1: UI Foundation to be considered complete and ready for Unit 2 development.

---

## Notes

- Test in incognito/private mode to ensure clean localStorage
- Clear localStorage between tests: `localStorage.clear()`
- Use browser DevTools to inspect elements and check accessibility
- Test with keyboard only (no mouse) to verify keyboard accessibility
- Test with screen reader (VoiceOver on Mac, NVDA on Windows) for accessibility
- Test on actual mobile devices, not just browser DevTools responsive mode


---

# Manual Testing Checklist - Core Features (Unit 2)

## Overview
This document provides a comprehensive manual testing checklist for Unit 2: Core Features (Authentication and Book Management).

---

## Authentication Testing

### User Registration
- [ ] Navigate to `/register`
- [ ] **Valid Registration**: Enter valid email and password (8+ chars, 1 letter, 1 number)
- [ ] **Submit**: Click "Register" button
- [ ] **Loading**: Global loading overlay appears during bcrypt hashing (~100-300ms)
- [ ] **Success**: Auto-login and redirect to `/books`
- [ ] **Session**: Refresh page, user remains logged in

### Registration Validation
- [ ] **Empty Email**: Shows "Email is required" error
- [ ] **Invalid Email**: Shows "Invalid email format" error (e.g., "test@")
- [ ] **Duplicate Email**: Shows "Email already registered" error
- [ ] **Empty Password**: Shows "Password is required" error
- [ ] **Short Password**: Shows "Password must be at least 8 characters" error (e.g., "pass123")
- [ ] **No Letter**: Shows "Password must contain at least one letter" error (e.g., "12345678")
- [ ] **No Number**: Shows "Password must contain at least one number" error (e.g., "password")
- [ ] **On Blur Validation**: Errors appear when leaving field
- [ ] **On Submit Validation**: All fields validated on submit

### User Login
- [ ] Navigate to `/login`
- [ ] **Valid Login**: Enter registered email and password
- [ ] **Submit**: Click "Login" button
- [ ] **Loading**: Global loading overlay appears during bcrypt verification (~100-300ms)
- [ ] **Success**: Redirect to `/books`
- [ ] **Session**: Refresh page, user remains logged in

### Login Validation
- [ ] **Empty Email**: Shows "Email is required" error
- [ ] **Invalid Email**: Shows "Invalid email format" error
- [ ] **Empty Password**: Shows "Password is required" error
- [ ] **Wrong Email**: Shows "Invalid email or password" error (generic for security)
- [ ] **Wrong Password**: Shows "Invalid email or password" error (generic for security)
- [ ] **On Blur Validation**: Errors appear when leaving field
- [ ] **On Submit Validation**: All fields validated on submit

### Session Management
- [ ] **Login**: User logs in successfully
- [ ] **Refresh**: Refresh page, user remains logged in
- [ ] **Close Browser**: Close and reopen browser, user remains logged in (browser session)
- [ ] **Invalid Session**: Manually delete user from localStorage, refresh page, redirects to login
- [ ] **Session Check**: Initial session check shows loading state briefly

### User Logout
- [ ] **Logout Button**: Click "Logout" button in BookListComponent header
- [ ] **Session Clear**: localStorage currentUser removed
- [ ] **Redirect**: Redirects to `/login`
- [ ] **Protected Routes**: Cannot access `/books` after logout (redirects to login)

### Navigation Between Auth Pages
- [ ] **Login to Register**: Click "Register here" link on login page
- [ ] **Register to Login**: Click "Login here" link on register page
- [ ] **Links Work**: Navigation works without page reload

---

## Book Management Testing

### Add Book
- [ ] **Login**: Login as a user
- [ ] **Navigate**: Go to `/books`
- [ ] **Empty State**: See "No books yet" message with "Add Your First Book" button
- [ ] **Click Add**: Click "+ Add Book" button
- [ ] **Modal Opens**: BookFormModal appears with "Add New Book" title
- [ ] **Fill Form**: Enter title, author, select status, enter total pages
- [ ] **Submit**: Click "Add Book" button
- [ ] **Success**: Modal closes, book appears in list
- [ ] **Count**: Book count updates (e.g., "1 book")

### Add Book Validation
- [ ] **Empty Title**: Shows "Title is required" error
- [ ] **Long Title**: Shows error for title > 200 characters
- [ ] **Empty Author**: Shows "Author is required" error
- [ ] **Invalid Author**: Shows error for author with numbers/special chars (e.g., "John123")
- [ ] **Empty Total Pages**: Shows "Total pages is required" error
- [ ] **Invalid Total Pages**: Shows error for non-numeric value
- [ ] **Low Total Pages**: Shows error for pages < 1
- [ ] **High Total Pages**: Shows error for pages > 10,000
- [ ] **On Blur Validation**: Errors appear when leaving field
- [ ] **On Submit Validation**: All fields validated on submit

### View Book List
- [ ] **Empty State**: No books shows "No books yet" message
- [ ] **With Books**: Books display in grid layout
- [ ] **Book Card**: Each book shows title, author, status badge, total pages
- [ ] **Status Badge**: Wishlist (blue), Reading (yellow), Completed (green)
- [ ] **Book Count**: Header shows correct count (e.g., "3 books")
- [ ] **Hover Effect**: Book cards lift slightly on hover

### Edit Book
- [ ] **Click Edit**: Click "Edit" button on a book
- [ ] **Modal Opens**: BookFormModal appears with "Edit Book" title
- [ ] **Pre-filled**: Form fields pre-filled with book data
- [ ] **Update**: Change title, author, status, or total pages
- [ ] **Submit**: Click "Update Book" button
- [ ] **Success**: Modal closes, book updates in list
- [ ] **Validation**: Same validation rules as Add Book apply

### Delete Book
- [ ] **Click Delete**: Click "Delete" button on a book
- [ ] **Confirmation**: Browser confirm dialog appears with "Are you sure?" message
- [ ] **Cancel**: Click "Cancel", book not deleted
- [ ] **Confirm**: Click "OK", book deleted from list
- [ ] **Count**: Book count updates
- [ ] **Empty State**: Deleting last book shows empty state

### Book List UI
- [ ] **Header**: Shows "My Reading List" title and "Logout" button
- [ ] **Toolbar**: Shows book count and "+ Add Book" button
- [ ] **Grid Layout**: Books display in responsive grid (350px min width)
- [ ] **Loading State**: Shows "Loading books..." during initial load
- [ ] **Responsive**: Grid adjusts to screen size

---

## Data Isolation Testing

### Multiple Users
- [ ] **Register User A**: Register with email "usera@test.com"
- [ ] **Add Books**: Add 2-3 books for User A
- [ ] **Logout**: Logout User A
- [ ] **Register User B**: Register with email "userb@test.com"
- [ ] **Empty List**: User B sees empty book list (not User A's books)
- [ ] **Add Books**: Add 2-3 books for User B
- [ ] **Logout**: Logout User B
- [ ] **Login User A**: Login as User A
- [ ] **User A Books**: User A sees only their books (not User B's books)
- [ ] **Login User B**: Login as User B
- [ ] **User B Books**: User B sees only their books (not User A's books)

### localStorage Structure
- [ ] **Open DevTools**: Open browser DevTools → Application → Local Storage
- [ ] **users Key**: Verify `users` array contains all registered users
- [ ] **books_{userId} Keys**: Verify separate `books_{userId}` key for each user
- [ ] **currentUser Key**: Verify `currentUser` contains current user's userId
- [ ] **Data Isolation**: Each user's books stored in separate key

---

## Error Handling Testing

### Storage Quota Exceeded
- [ ] **Fill Storage**: Add many books until localStorage quota exceeded (~5-10MB)
- [ ] **Alert**: Alert appears: "Storage quota exceeded. Please delete some books to free up space."
- [ ] **Operation Fails**: Book not added/updated
- [ ] **Manual Cleanup**: Delete books manually to free space
- [ ] **Retry**: Try adding book again, should succeed

### Invalid Session
- [ ] **Login**: Login as a user
- [ ] **Manual Delete**: Open DevTools, delete user from `users` array in localStorage
- [ ] **Refresh**: Refresh page
- [ ] **Session Clear**: Invalid session cleared from localStorage
- [ ] **Redirect**: Redirects to `/login`

### Form Validation Errors
- [ ] **Inline Errors**: Validation errors display below fields
- [ ] **Error Color**: Errors in red text
- [ ] **Input Border**: Invalid inputs have red border
- [ ] **Clear Errors**: Errors clear when user starts correcting

### bcrypt Loading State
- [ ] **Registration**: Global loading overlay shows during password hashing
- [ ] **Login**: Global loading overlay shows during password verification
- [ ] **Message**: Loading message displays ("Creating account..." or "Logging in...")
- [ ] **Duration**: Loading visible for ~100-300ms (bcrypt operation time)

### localStorage Loading State
- [ ] **Book Load**: Local loading state shows "Loading books..." briefly
- [ ] **Fast Operations**: No loading indicator for add/edit/delete (< 10ms)

---

## Accessibility Testing

### Keyboard Navigation
- [ ] **Tab**: Tab through all form fields and buttons
- [ ] **Enter**: Enter key submits forms
- [ ] **ESC**: ESC key closes modals
- [ ] **Focus**: Focus visible on all interactive elements

### Screen Reader
- [ ] **Form Labels**: All inputs have labels
- [ ] **Error Messages**: Errors announced
- [ ] **Button Labels**: All buttons have descriptive text
- [ ] **Modal**: Modal has aria-modal and role="dialog"

### Color Contrast
- [ ] **Text**: All text has 4.5:1 contrast ratio
- [ ] **Buttons**: Button text has sufficient contrast
- [ ] **Error Messages**: Error text has sufficient contrast

---

## Responsive Design Testing

### Desktop (1024px+)
- [ ] **Book Grid**: 2-3 columns depending on width
- [ ] **Header**: Horizontal layout
- [ ] **Toolbar**: Horizontal layout
- [ ] **Modals**: Centered, max-width 450px

### Mobile (320px - 767px)
- [ ] **Book Grid**: Single column
- [ ] **Header**: Stacks vertically
- [ ] **Toolbar**: Stacks vertically
- [ ] **Buttons**: Full width where appropriate
- [ ] **Touch Targets**: At least 44px

---

## Integration Testing

### Complete User Flow
- [ ] **Register**: Register new user
- [ ] **Auto-Login**: Automatically logged in after registration
- [ ] **Add Books**: Add 3-5 books with different statuses
- [ ] **Edit Book**: Edit a book's details
- [ ] **Delete Book**: Delete a book
- [ ] **Logout**: Logout
- [ ] **Login**: Login again
- [ ] **Books Persist**: All books still present
- [ ] **Logout**: Logout again

### Cross-Browser Testing
- [ ] **Chrome**: All features work
- [ ] **Firefox**: All features work
- [ ] **Safari**: All features work
- [ ] **Edge**: All features work

---

## Performance Testing

### bcrypt Operations
- [ ] **Registration**: Completes in ~100-300ms
- [ ] **Login**: Completes in ~100-300ms
- [ ] **Loading Indicator**: Shows during operation

### localStorage Operations
- [ ] **Load Books**: Completes in < 10ms
- [ ] **Add Book**: Completes in < 10ms
- [ ] **Edit Book**: Completes in < 10ms
- [ ] **Delete Book**: Completes in < 10ms

### Bundle Size
- [ ] **Total Bundle**: ~141 KB gzipped (Unit 1 + Unit 2)
- [ ] **Well Under Target**: < 250 KB target

---

## Success Criteria

All checkboxes above must be checked for Unit 2: Core Features to be considered complete and ready for Unit 3 development.

---

## Notes

- Test in incognito/private mode for clean localStorage
- Clear localStorage between tests: `localStorage.clear()`
- Test with multiple users to verify data isolation
- Test storage quota by adding many books (use DevTools to monitor localStorage size)
- bcrypt operations are intentionally slow for security (~100-300ms is expected)
- Use browser DevTools to inspect localStorage structure
- Test keyboard navigation without mouse
- Test with screen reader for accessibility
