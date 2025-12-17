# Reading List Tracker

A web application to track your reading list with progress, notes, ratings, and statistics.

## Features

### ✅ Implemented (Units 1-4)

#### Authentication & User Management
- **User Authentication**: Register and login with email and password (bcrypt hashing)
- **Session Management**: Persistent sessions across page reloads
- **Data Isolation**: Each user has their own private book collection

#### Book Management
- **Add Books**: Manual entry with title, author, status, and page count
- **Edit Books**: Update any book details
- **Delete Books**: Remove books with confirmation
- **Book Status**: Track as Wishlist, Reading, or Completed
- **ISBN Validation**: Optional ISBN-10/ISBN-13 validation
- **Import Books**: Import from JSON files

#### Progress Tracking
- **Page Progress**: Track current page and calculate completion percentage
- **Visual Progress**: Progress bars with percentage indicators
- **Completion Dates**: Automatic date tracking when books are completed
- **Progress Updates**: Update progress directly from book cards

#### Notes & Ratings
- **Book Notes**: Add personal notes to any book
- **Star Ratings**: Rate books with 1-5 stars
- **Interactive Rating**: Click to rate, visual star display

#### Statistics & Analytics
- **Books by Status**: Count and percentage breakdown (Reading/Completed/Wishlist)
- **Monthly Trends**: Books added per month (last 12 months)
- **Completion Tracking**: Books completed per month
- **Reading Pace**: Average pages per day based on completed books
- **Refresh Statistics**: On-demand calculation
- **Clear Statistics**: Hide statistics panel

#### Search & Filter
- **Search by Title**: Find books by partial title match
- **Search by Author**: Find books by partial author match
- **Case-Insensitive**: Search works regardless of capitalization
- **Visual Highlighting**: Non-matching books dimmed during search
- **Clear Search**: Reset to show all books

#### Data Management
- **Export to JSON**: Download complete book collection
- **Export Preview**: Preview first 5 books before export
- **Timestamped Files**: Automatic filename with date/time
- **Import from JSON**: Restore or migrate book data

#### User Experience
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Modern UI**: Clean, colorful design with visual appeal
- **Loading States**: Visual feedback during operations
- **Error Handling**: Graceful error messages and validation
- **Keyboard Support**: Full keyboard navigation

## Technology Stack

- **Framework**: React 18+
- **Build Tool**: Vite 4+
- **Routing**: React Router v6
- **Styling**: CSS Modules + CSS Custom Properties
- **Language**: Plain JavaScript ES2020+
- **Storage**: Browser localStorage
- **Security**: bcryptjs for password hashing

## Project Structure

```
reading-list-tracker/
├── src/
│   ├── components/
│   │   ├── auth/             # Authentication components (Unit 2)
│   │   │   ├── AuthComponent.jsx
│   │   │   └── AuthComponent.module.css
│   │   ├── books/            # Book management components (Units 2-4)
│   │   │   ├── BookListComponent.jsx
│   │   │   ├── BookListComponent.module.css
│   │   │   ├── BookFormModal.jsx
│   │   │   ├── BookFormModal.module.css
│   │   │   ├── BookItemComponent.jsx
│   │   │   ├── BookItemComponent.module.css
│   │   │   ├── StatisticsComponent.jsx      # Unit 4
│   │   │   ├── StatisticsComponent.module.css
│   │   │   ├── SearchComponent.jsx          # Unit 4
│   │   │   └── SearchComponent.module.css
│   │   ├── common/           # Reusable UI components (Unit 1)
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Form.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── ProgressBar.jsx
│   │   │   ├── StarRating.jsx
│   │   │   ├── Notification.jsx
│   │   │   └── LoadingSpinner.jsx
│   │   ├── ErrorBoundary.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── LoadingOverlay.jsx
│   │   └── PlaceholderComponent.jsx
│   ├── contexts/
│   │   ├── AuthContext.jsx   # Authentication state management
│   │   └── LoadingContext.jsx # Loading state management
│   ├── utils/
│   │   ├── storage.js        # localStorage wrapper functions
│   │   ├── validation.js     # Form validation functions
│   │   ├── idGenerator.js    # UUID generation
│   │   ├── dateUtils.js      # Date formatting utilities
│   │   ├── isbnValidator.js  # ISBN validation (Unit 3)
│   │   ├── importParser.js   # JSON import parser (Unit 3)
│   │   ├── progressCalculator.js  # Progress calculations (Unit 3)
│   │   └── statisticsCalculator.js # Statistics calculations (Unit 4)
│   ├── styles/
│   │   └── global.css        # Global styles and design tokens
│   ├── App.jsx               # Root component with routing
│   └── main.jsx              # Entry point
├── index.html
├── package.json
├── vite.config.js
├── README.md
└── TESTING.md
```

## Design System

The application uses a comprehensive design system defined in `src/styles/global.css`:

### Colors
- **Primary**: Blue (#3B82F6) - Main actions
- **Secondary**: Purple (#8B5CF6) - Secondary actions
- **Success**: Green (#10B981) - Success states
- **Error**: Red (#EF4444) - Error states
- **Warning**: Amber (#F59E0B) - Warning states
- **Info**: Cyan (#06B6D4) - Informational states

### Typography
- **Font Family**: Inter (with system fallbacks)
- **Font Sizes**: 12px - 30px (xs to 3xl)
- **Font Weights**: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)

### Spacing
- **Scale**: 4px, 8px, 16px, 24px, 32px, 48px, 64px (xs to 3xl)

### Components
All components follow consistent patterns:
- Minimum 40px touch targets
- Keyboard accessible
- ARIA attributes for screen readers
- Focus visible indicators
- Responsive design (desktop-first)

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd reading-list-tracker
```

2. Install dependencies
```bash
npm install
```

3. Start development server
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

### First Time Usage

1. **Register**: Navigate to `/register` or click "Register here" on the login page
   - Enter a valid email address
   - Create a password (minimum 8 characters, must contain at least one letter and one number)
   - Click "Register" - you'll be automatically logged in

2. **Add Books**: After registration, you'll be redirected to your book list
   - Click "+ Add Book" to add your first book
   - Fill in the book details:
     - Title and Author (required)
     - Status: Wishlist, Reading, or Completed
     - Total Pages (required)
     - ISBN (optional, validates ISBN-10/ISBN-13)
     - Current Page (for tracking progress)
     - Notes (personal notes about the book)
     - Rating (1-5 stars)
   - Click "Add Book" to save

3. **Track Progress**: 
   - Update "Current Page" in the edit form
   - Progress percentage calculated automatically
   - Visual progress bar shows completion
   - Completion date tracked automatically when status changes to "Completed"

4. **View Statistics**:
   - Click "Refresh Statistics" to calculate your reading stats
   - View books by status (Reading/Completed/Wishlist)
   - See monthly trends (books added and completed)
   - Check your reading pace (pages per day)
   - Click "Clear Statistics" to hide the panel

5. **Search Books**:
   - Enter title or author in the search box
   - Click "Search" or press Enter
   - Non-matching books are dimmed
   - Click "Clear" to show all books

6. **Export Data**:
   - Click "Export Books" button
   - Preview first 5 books in modal
   - Click "Confirm Export" to download JSON file
   - File includes all book data with timestamp

7. **Import Data**:
   - Click "+ Add Book"
   - Click "Import from JSON" button
   - Select a previously exported JSON file
   - Books are added to your collection

8. **Manage Books**: 
   - **Edit**: Click "Edit" on any book to update its details
   - **Delete**: Click "Delete" on any book to remove it (confirmation required)
   - **View**: All your books are displayed in a grid layout with progress bars

9. **Logout**: Click "Logout" in the header to end your session

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## Development Status

### Unit 1: UI Foundation ✅ COMPLETE
- Application shell and routing
- Design system with CSS custom properties
- 9 common UI components (Button, Input, Form, Card, Modal, ProgressBar, StarRating, Notification, LoadingSpinner)
- 3 utility components (ErrorBoundary, ProtectedRoute, LoadingOverlay)
- 2 context providers (Auth, Loading)
- 4 utility modules (storage, validation, idGenerator, dateUtils)

### Unit 2: Core Features ✅ COMPLETE
- User authentication (registration, login, logout, session management)
- Password security (bcryptjs hashing with 10 salt rounds)
- Book management (add, view, edit, delete)
- Data isolation (each user has private book collection)
- Form validation (inline errors, on blur + on submit)
- Local storage integration
- 4 new components: AuthComponent, BookListComponent, BookFormModal, BookItemComponent

### Unit 3: Enhanced Features ✅ COMPLETE
- ISBN validation (ISBN-10 and ISBN-13 with checksum verification)
- JSON import functionality (bulk book import)
- Progress tracking (current page, percentage, visual progress bars)
- Notes and ratings (personal notes + 5-star rating system)
- Completion date tracking (automatic when status changes to Completed)
- 3 new utilities: isbnValidator, importParser, progressCalculator
- Enhanced BookFormModal with all new fields
- Enhanced BookItemComponent with progress display

### Unit 4: Analytics & Utilities ✅ COMPLETE
- Statistics dashboard (books by status, monthly trends, reading pace)
- Search functionality (by title/author with visual highlighting)
- Data export (JSON export with preview modal)
- 2 new components: StatisticsComponent, SearchComponent
- 1 new utility: statisticsCalculator
- Integrated statistics, search, and export into BookListComponent

## Component Usage Examples

### Button
```jsx
import Button from './components/common/Button';

<Button variant="primary" size="medium" onClick={handleClick}>
  Click Me
</Button>
```

### Input
```jsx
import Input from './components/common/Input';

<Input
  type="email"
  name="email"
  label="Email Address"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={emailError}
  required
/>
```

### Modal
```jsx
import Modal from './components/common/Modal';

<Modal isOpen={isOpen} title="Confirm Action" onClose={handleClose}>
  <p>Are you sure you want to proceed?</p>
  <Button onClick={handleConfirm}>Confirm</Button>
</Modal>
```

### ProgressBar
```jsx
import ProgressBar from './components/common/ProgressBar';

<ProgressBar value={75} showPercentage={true} />
```

### StarRating
```jsx
import StarRating from './components/common/StarRating';

<StarRating value={rating} onChange={setRating} />
```

## Browser Support

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

## Data Storage

All data is stored locally in the browser's localStorage:

### Storage Keys
- `users` - Array of all registered users (with hashed passwords)
- `books_{userId}` - Separate array of books for each user (data isolation)
- `currentUser` - Current logged-in user's ID (session management)

### Data Structure

**User Object**:
```json
{
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "email": "reader@example.com",
  "passwordHash": "$2a$10$...",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

**Book Object**:
```json
{
  "bookId": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "status": "Reading",
  "totalPages": 180,
  "currentPage": 45,
  "progress": 25,
  "isbn": "978-0-7432-7356-5",
  "notes": "Beautiful prose, exploring themes of wealth and the American Dream",
  "rating": 5,
  "createdAt": "2024-01-20T14:22:00Z",
  "completedAt": null
}
```

**Note**: Data is not synced across devices or browsers. Use the export feature (Unit 4) to backup your data.

## Security

- Passwords are hashed using bcryptjs before storage
- No plain text passwords stored
- User data isolated per account
- XSS protection via React's built-in escaping

## Accessibility

- Keyboard navigation support
- ARIA labels and roles
- Focus management
- Minimum 4.5:1 color contrast ratio (WCAG AA)
- Minimum 40px touch targets on mobile

## License

MIT

## Contributing

This project is part of a structured development workflow using AI-DLC methodology. Contributions should follow the established unit-based development approach.
