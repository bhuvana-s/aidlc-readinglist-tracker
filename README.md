# Reading List Tracker

A web application to track your reading list with progress, notes, ratings, and statistics.

## Features

### ✅ Implemented (Unit 1 + Unit 2)
- **User Authentication**: Register and login with email and password (bcrypt hashing)
- **Session Management**: Persistent sessions across page reloads
- **Book Management**: Add, edit, and delete books in your collection
- **Book Details**: Title, author, status (wishlist/reading/completed), total pages
- **Data Isolation**: Each user has their own private book collection
- **Responsive Design**: Works on desktop, tablet, and mobile devices

### 📋 Planned (Unit 3 + Unit 4)
- **Multiple Entry Methods**: ISBN lookup or import from JSON/CSV
- **Progress Tracking**: Track reading progress with page numbers and visual indicators
- **Notes & Ratings**: Add notes and rate books with a 5-star system
- **Statistics Dashboard**: View books per month, reading pace, and status counts
- **Search**: Search books by title or author
- **Data Export**: Export your reading list to JSON

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
│   │   ├── books/            # Book management components (Unit 2)
│   │   │   ├── BookListComponent.jsx
│   │   │   ├── BookListComponent.module.css
│   │   │   ├── BookFormModal.jsx
│   │   │   ├── BookFormModal.module.css
│   │   │   ├── BookItemComponent.jsx
│   │   │   └── BookItemComponent.module.css
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
│   │   └── dateUtils.js      # Date formatting utilities
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
   - Fill in the book details (title, author, status, total pages)
   - Click "Add Book" to save

3. **Manage Books**: 
   - **Edit**: Click "Edit" on any book to update its details
   - **Delete**: Click "Delete" on any book to remove it (confirmation required)
   - **View**: All your books are displayed in a grid layout

4. **Logout**: Click "Logout" in the header to end your session

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

### Unit 3: Enhanced Features 📋 PLANNED
- ISBN lookup
- Import from JSON/CSV
- Progress tracking
- Notes and ratings

### Unit 4: Analytics & Utilities 📋 PLANNED
- Statistics dashboard
- Search functionality
- Data export

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
  "status": "reading",
  "totalPages": 180,
  "pagesRead": 0,
  "createdAt": "2024-01-20T14:22:00Z"
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
