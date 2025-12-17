# Component Methods - Reading List Tracker

## Purpose
This document defines method signatures for each component. Detailed business rules and implementation logic will be defined later in the Functional Design phase (per-unit, CONSTRUCTION phase).

---

## 1. App Component Methods

### initialize()
**Purpose**: Initialize the application on load
**Parameters**: None
**Returns**: void
**Description**: Sets up routing, checks for existing session, loads initial data

### checkSession()
**Purpose**: Check if user has an active session
**Parameters**: None
**Returns**: userId (string) or null
**Description**: Reads currentUser from local storage

### handleLogin(userId: string)
**Purpose**: Handle successful login event
**Parameters**: userId - ID of logged-in user
**Returns**: void
**Description**: Updates session state, navigates to main app

### handleLogout()
**Purpose**: Handle user logout
**Parameters**: None
**Returns**: void
**Description**: Clears session, navigates to login screen

### navigateTo(route: string)
**Purpose**: Navigate to different component/view
**Parameters**: route - Target route name
**Returns**: void
**Description**: Updates current view/component

---

## 2. AuthComponent Methods

### showRegistrationForm()
**Purpose**: Display registration form
**Parameters**: None
**Returns**: void
**Description**: Switches view to registration mode

### showLoginForm()
**Purpose**: Display login form
**Parameters**: None
**Returns**: void
**Description**: Switches view to login mode

### handleRegister(email: string, password: string)
**Purpose**: Process user registration
**Parameters**: 
  - email - User's email address
  - password - User's password (plain text, will be hashed)
**Returns**: Promise<userId: string>
**Description**: Validates input, hashes password, creates user, stores in local storage, emits success event

### handleLogin(email: string, password: string)
**Purpose**: Process user login
**Parameters**: 
  - email - User's email address
  - password - User's password (plain text)
**Returns**: Promise<userId: string>
**Description**: Validates credentials, verifies password hash, updates session, emits success event

### validateEmail(email: string)
**Purpose**: Validate email format
**Parameters**: email - Email address to validate
**Returns**: boolean
**Description**: Checks email format is valid

### validatePassword(password: string)
**Purpose**: Validate password meets requirements
**Parameters**: password - Password to validate
**Returns**: boolean
**Description**: Checks password meets minimum requirements

### hashPassword(password: string)
**Purpose**: Hash password for secure storage
**Parameters**: password - Plain text password
**Returns**: string (hashed password)
**Description**: Uses bcrypt or similar to hash password

### verifyPassword(password: string, hash: string)
**Purpose**: Verify password against stored hash
**Parameters**: 
  - password - Plain text password
  - hash - Stored password hash
**Returns**: boolean
**Description**: Compares password with hash

### getUserByEmail(email: string)
**Purpose**: Retrieve user by email address
**Parameters**: email - Email to search for
**Returns**: User object or null
**Description**: Reads from local storage, finds user by email

### createUser(email: string, passwordHash: string)
**Purpose**: Create new user account
**Parameters**: 
  - email - User's email
  - passwordHash - Hashed password
**Returns**: userId (string)
**Description**: Generates user ID, creates user object, stores in local storage

### setCurrentUser(userId: string)
**Purpose**: Set current logged-in user
**Parameters**: userId - ID of user to set as current
**Returns**: void
**Description**: Writes currentUser to local storage

### showError(message: string)
**Purpose**: Display error message to user
**Parameters**: message - Error message text
**Returns**: void
**Description**: Shows error in UI

---

## 3. BookListComponent Methods

### loadBooks()
**Purpose**: Load all books for current user
**Parameters**: None (uses component's userId)
**Returns**: Promise<Book[]>
**Description**: Reads books from local storage, filters by userId

### displayBooks(books: Book[])
**Purpose**: Render book list in UI
**Parameters**: books - Array of book objects
**Returns**: void
**Description**: Updates UI with book list

### filterByStatus(status: string)
**Purpose**: Filter books by status
**Parameters**: status - 'reading', 'completed', or 'wishlist'
**Returns**: Book[]
**Description**: Filters book array by status

### handleAddBook()
**Purpose**: Show add book form
**Parameters**: None
**Returns**: void
**Description**: Opens BookFormComponent in add mode

### handleEditBook(bookId: string)
**Purpose**: Show edit book form
**Parameters**: bookId - ID of book to edit
**Returns**: void
**Description**: Opens BookFormComponent in edit mode with book data

### handleDeleteBook(bookId: string)
**Purpose**: Delete a book
**Parameters**: bookId - ID of book to delete
**Returns**: Promise<void>
**Description**: Shows confirmation, deletes book from local storage, refreshes list

### saveBook(bookData: Book)
**Purpose**: Save new or updated book
**Parameters**: bookData - Book object to save
**Returns**: Promise<bookId: string>
**Description**: Validates data, generates ID if new, writes to local storage

### deleteBook(bookId: string)
**Purpose**: Remove book from storage
**Parameters**: bookId - ID of book to delete
**Returns**: Promise<void>
**Description**: Removes book from local storage books array

### getBookById(bookId: string)
**Purpose**: Retrieve specific book
**Parameters**: bookId - ID of book to retrieve
**Returns**: Book object or null
**Description**: Reads from local storage, finds book by ID

### showConfirmation(message: string)
**Purpose**: Show confirmation dialog
**Parameters**: message - Confirmation message
**Returns**: Promise<boolean>
**Description**: Displays confirmation dialog, returns user's choice

### showSuccess(message: string)
**Purpose**: Display success message
**Parameters**: message - Success message text
**Returns**: void
**Description**: Shows success notification in UI

### showError(message: string)
**Purpose**: Display error message
**Parameters**: message - Error message text
**Returns**: void
**Description**: Shows error notification in UI

---

## 4. BookFormComponent Methods

### initialize(book: Book | null, mode: string)
**Purpose**: Initialize form with data
**Parameters**: 
  - book - Book object for editing (null for new)
  - mode - 'manual', 'isbn', or 'import'
**Returns**: void
**Description**: Sets up form fields with book data or empty values

### handleSubmit()
**Purpose**: Process form submission
**Parameters**: None (reads from form fields)
**Returns**: void
**Description**: Validates data, emits onSave event with book data

### handleCancel()
**Purpose**: Cancel form and close
**Parameters**: None
**Returns**: void
**Description**: Emits onCancel event

### validateForm()
**Purpose**: Validate all form fields
**Parameters**: None (reads from form fields)
**Returns**: boolean
**Description**: Checks all required fields, validates data types

### validateTitle(title: string)
**Purpose**: Validate book title
**Parameters**: title - Title to validate
**Returns**: boolean
**Description**: Checks title is not empty

### validateAuthor(author: string)
**Purpose**: Validate author name
**Parameters**: author - Author to validate
**Returns**: boolean
**Description**: Checks author is not empty

### validatePages(pages: number)
**Purpose**: Validate page numbers
**Parameters**: pages - Total pages to validate
**Returns**: boolean
**Description**: Checks pages is positive integer

### handleISBNLookup(isbn: string)
**Purpose**: Look up book by ISBN
**Parameters**: isbn - ISBN number (10 or 13 digits)
**Returns**: Promise<BookData>
**Description**: Calls ISBN API, retrieves book data, auto-fills form

### callISBNAPI(isbn: string)
**Purpose**: Make API call to ISBN service
**Parameters**: isbn - ISBN number
**Returns**: Promise<APIResponse>
**Description**: Calls external API (Open Library or Google Books)

### parseISBNResponse(response: APIResponse)
**Purpose**: Parse API response data
**Parameters**: response - API response object
**Returns**: BookData object
**Description**: Extracts title, author from API response

### handleFileImport(file: File)
**Purpose**: Import books from file
**Parameters**: file - JSON or CSV file
**Returns**: Promise<Book[]>
**Description**: Reads file, parses data, validates, returns book array

### parseJSONFile(fileContent: string)
**Purpose**: Parse JSON file content
**Parameters**: fileContent - File content as string
**Returns**: Book[]
**Description**: Parses JSON, validates structure

### parseCSVFile(fileContent: string)
**Purpose**: Parse CSV file content
**Parameters**: fileContent - File content as string
**Returns**: Book[]
**Description**: Parses CSV rows, maps to book objects

### showFieldError(field: string, message: string)
**Purpose**: Display field-specific error
**Parameters**: 
  - field - Field name
  - message - Error message
**Returns**: void
**Description**: Shows error message next to form field

### showError(message: string)
**Purpose**: Display general error message
**Parameters**: message - Error message text
**Returns**: void
**Description**: Shows error notification

---

## 5. BookItemComponent Methods

### displayBook(book: Book)
**Purpose**: Render book information
**Parameters**: book - Book object to display
**Returns**: void
**Description**: Updates UI with book details

### displayProgressBar(progress: number)
**Purpose**: Render progress bar
**Parameters**: progress - Progress percentage (0-100)
**Returns**: void
**Description**: Displays visual progress indicator

### displayRating(rating: number)
**Purpose**: Render star rating
**Parameters**: rating - Rating value (0-5)
**Returns**: void
**Description**: Displays star icons for rating

### handleClick()
**Purpose**: Handle book item click
**Parameters**: None
**Returns**: void
**Description**: Emits onClick event with bookId

### handleEdit()
**Purpose**: Handle edit button click
**Parameters**: None
**Returns**: void
**Description**: Emits onEdit event with bookId

### handleDelete()
**Purpose**: Handle delete button click
**Parameters**: None
**Returns**: void
**Description**: Emits onDelete event with bookId

---

## 6. ProgressTrackerComponent Methods

### loadBook(bookId: string)
**Purpose**: Load book data for progress tracking
**Parameters**: bookId - ID of book to track
**Returns**: Promise<Book>
**Description**: Reads book from local storage

### displayProgress(book: Book)
**Purpose**: Display current progress
**Parameters**: book - Book object with progress data
**Returns**: void
**Description**: Shows current page, total pages, percentage, progress bar

### handleUpdateProgress(currentPage: number)
**Purpose**: Update reading progress
**Parameters**: currentPage - New current page number
**Returns**: Promise<void>
**Description**: Validates page, calculates percentage, saves to storage, updates UI

### calculateProgress(currentPage: number, totalPages: number)
**Purpose**: Calculate progress percentage
**Parameters**: 
  - currentPage - Current page number
  - totalPages - Total pages in book
**Returns**: number (percentage)
**Description**: Calculates (currentPage / totalPages) * 100

### validatePageNumber(page: number, totalPages: number)
**Purpose**: Validate page number input
**Parameters**: 
  - page - Page number to validate
  - totalPages - Total pages in book
**Returns**: boolean
**Description**: Checks page is between 0 and totalPages

### checkIfComplete(progress: number)
**Purpose**: Check if book is complete
**Parameters**: progress - Progress percentage
**Returns**: boolean
**Description**: Returns true if progress >= 100

### suggestCompletion()
**Purpose**: Suggest marking book as complete
**Parameters**: None
**Returns**: void
**Description**: Shows prompt to mark book complete

### handleMarkComplete()
**Purpose**: Mark book as completed
**Parameters**: None
**Returns**: Promise<void>
**Description**: Updates status to 'completed', sets completion date, saves to storage

### updateBookProgress(bookId: string, currentPage: number, progress: number)
**Purpose**: Save progress to storage
**Parameters**: 
  - bookId - ID of book
  - currentPage - New current page
  - progress - Calculated progress percentage
**Returns**: Promise<void>
**Description**: Updates book in local storage

### updateBookStatus(bookId: string, status: string, completionDate: string)
**Purpose**: Update book status
**Parameters**: 
  - bookId - ID of book
  - status - New status value
  - completionDate - Completion date (ISO format)
**Returns**: Promise<void>
**Description**: Updates book status and date in local storage

### showSuccess(message: string)
**Purpose**: Display success message
**Parameters**: message - Success message text
**Returns**: void
**Description**: Shows success notification

### showError(message: string)
**Purpose**: Display error message
**Parameters**: message - Error message text
**Returns**: void
**Description**: Shows error notification

---

## 7. NotesRatingsComponent Methods

### loadBook(bookId: string)
**Purpose**: Load book data for notes/ratings
**Parameters**: bookId - ID of book
**Returns**: Promise<Book>
**Description**: Reads book from local storage

### displayNotes(notes: string)
**Purpose**: Display current notes
**Parameters**: notes - Notes text
**Returns**: void
**Description**: Shows notes in editor

### displayRating(rating: number)
**Purpose**: Display current rating
**Parameters**: rating - Rating value (0-5)
**Returns**: void
**Description**: Shows star rating selector

### handleNotesChange(notes: string)
**Purpose**: Handle notes text change
**Parameters**: notes - New notes text
**Returns**: void
**Description**: Updates local state with new notes

### handleRatingChange(rating: number)
**Purpose**: Handle rating change
**Parameters**: rating - New rating value
**Returns**: void
**Description**: Updates local state with new rating

### handleSave()
**Purpose**: Save notes and rating
**Parameters**: None (reads from local state)
**Returns**: Promise<void>
**Description**: Validates data, saves to local storage, emits events

### validateRating(rating: number)
**Purpose**: Validate rating value
**Parameters**: rating - Rating to validate
**Returns**: boolean
**Description**: Checks rating is between 0 and 5

### updateBookNotes(bookId: string, notes: string)
**Purpose**: Save notes to storage
**Parameters**: 
  - bookId - ID of book
  - notes - Notes text
**Returns**: Promise<void>
**Description**: Updates book notes in local storage

### updateBookRating(bookId: string, rating: number)
**Purpose**: Save rating to storage
**Parameters**: 
  - bookId - ID of book
  - rating - Rating value
**Returns**: Promise<void>
**Description**: Updates book rating in local storage

### showSuccess(message: string)
**Purpose**: Display success message
**Parameters**: message - Success message text
**Returns**: void
**Description**: Shows success notification

### showError(message: string)
**Purpose**: Display error message
**Parameters**: message - Error message text
**Returns**: void
**Description**: Shows error notification

---

## 8. StatisticsComponent Methods

### loadBooks()
**Purpose**: Load all books for statistics
**Parameters**: None (uses component's userId)
**Returns**: Promise<Book[]>
**Description**: Reads books from local storage, filters by userId

### calculateBooksPerMonth(books: Book[])
**Purpose**: Calculate books completed per month
**Parameters**: books - Array of book objects
**Returns**: Map<string, number> (month -> count)
**Description**: Groups completed books by month, counts per month

### calculateReadingPace(books: Book[])
**Purpose**: Calculate reading pace
**Parameters**: books - Array of book objects
**Returns**: { pagesPerDay: number, pagesPerWeek: number }
**Description**: Calculates average pages per day and week from completed books

### calculateBooksByStatus(books: Book[])
**Purpose**: Calculate book counts by status
**Parameters**: books - Array of book objects
**Returns**: { reading: number, completed: number, wishlist: number, total: number }
**Description**: Counts books in each status category

### displayStatistics(stats: Statistics)
**Purpose**: Render statistics in UI
**Parameters**: stats - Statistics object with all calculated data
**Returns**: void
**Description**: Updates UI with statistics displays

### formatMonthYear(date: Date)
**Purpose**: Format date as month-year string
**Parameters**: date - Date object
**Returns**: string (e.g., "December 2025")
**Description**: Formats date for display

### handleInsufficientData()
**Purpose**: Handle case with no data
**Parameters**: None
**Returns**: void
**Description**: Shows message when no completed books exist

---

## 9. SearchComponent Methods

### loadBooks()
**Purpose**: Load all books for searching
**Parameters**: None (uses component's userId)
**Returns**: Promise<Book[]>
**Description**: Reads books from local storage, filters by userId

### handleSearchInput(query: string)
**Purpose**: Handle search query input
**Parameters**: query - Search query text
**Returns**: void
**Description**: Filters books in real-time, updates results display

### searchBooks(query: string, books: Book[])
**Purpose**: Search books by title and author
**Parameters**: 
  - query - Search query
  - books - Array of books to search
**Returns**: Book[]
**Description**: Filters books matching query in title or author (case-insensitive)

### searchByTitle(query: string, books: Book[])
**Purpose**: Search books by title only
**Parameters**: 
  - query - Search query
  - books - Array of books to search
**Returns**: Book[]
**Description**: Filters books with matching title

### searchByAuthor(query: string, books: Book[])
**Purpose**: Search books by author only
**Parameters**: 
  - query - Search query
  - books - Array of books to search
**Returns**: Book[]
**Description**: Filters books with matching author

### displayResults(books: Book[])
**Purpose**: Display search results
**Parameters**: books - Array of matching books
**Returns**: void
**Description**: Updates UI with search results

### handleClearSearch()
**Purpose**: Clear search and show all books
**Parameters**: None
**Returns**: void
**Description**: Clears search query, displays full book list

### handleBookSelected(bookId: string)
**Purpose**: Handle search result selection
**Parameters**: bookId - ID of selected book
**Returns**: void
**Description**: Emits onBookSelected event

### showEmptyResults()
**Purpose**: Display empty results message
**Parameters**: None
**Returns**: void
**Description**: Shows message when no books match search

---

## 10. ExportComponent Methods

### handleExport()
**Purpose**: Trigger data export
**Parameters**: None (uses component's userId)
**Returns**: Promise<void>
**Description**: Generates JSON, triggers download, shows confirmation

### loadUserData(userId: string)
**Purpose**: Load user data for export
**Parameters**: userId - ID of user
**Returns**: Promise<User>
**Description**: Reads user from local storage

### loadBooks(userId: string)
**Purpose**: Load all books for export
**Parameters**: userId - ID of user
**Returns**: Promise<Book[]>
**Description**: Reads books from local storage, filters by userId

### generateJSON(user: User, books: Book[])
**Purpose**: Generate JSON export data
**Parameters**: 
  - user - User object
  - books - Array of book objects
**Returns**: string (JSON)
**Description**: Creates JSON structure with user and books data

### generateFilename()
**Purpose**: Generate export filename
**Parameters**: None
**Returns**: string (e.g., "reading-list-2025-12-16.json")
**Description**: Creates filename with current date

### triggerDownload(data: string, filename: string)
**Purpose**: Trigger browser download
**Parameters**: 
  - data - JSON data string
  - filename - File name
**Returns**: void
**Description**: Creates download link, triggers browser download

### showSuccess(message: string)
**Purpose**: Display success message
**Parameters**: message - Success message text
**Returns**: void
**Description**: Shows success notification

### showError(message: string)
**Purpose**: Display error message
**Parameters**: message - Error message text
**Returns**: void
**Description**: Shows error notification

---

## Method Naming Conventions

- **handle[Action]**: Event handler methods (e.g., handleSubmit, handleClick)
- **validate[Field]**: Validation methods (e.g., validateEmail, validatePages)
- **display[Element]**: UI rendering methods (e.g., displayBooks, displayProgress)
- **load[Data]**: Data loading methods (e.g., loadBooks, loadUser)
- **calculate[Metric]**: Calculation methods (e.g., calculateProgress, calculateStatistics)
- **show[Message]**: UI notification methods (e.g., showError, showSuccess)
- **update[Field]**: Data update methods (e.g., updateBookProgress, updateBookStatus)

---

## Notes

- **Method signatures only**: Detailed business rules and implementation logic will be defined in Functional Design (CONSTRUCTION phase)
- **Type hints**: Parameter and return types shown for clarity (actual syntax depends on chosen framework)
- **Async operations**: Methods that access local storage or APIs return Promises
- **Error handling**: Each component handles its own errors locally
- **Validation**: Inline validation methods within each component
- **No shared services**: All methods are component-specific, no external service dependencies
