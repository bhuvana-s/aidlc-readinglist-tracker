/**
 * Local Storage Utility Functions
 * Provides wrapper functions for localStorage operations with error handling
 */

/**
 * Read and parse data from localStorage
 * @param {string} key - The localStorage key
 * @returns {any} Parsed data or null if not found/error
 */
export function getFromStorage(key) {
  try {
    const data = localStorage.getItem(key);
    if (data === null) {
      return null;
    }
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading from storage (key: ${key}):`, error);
    return null;
  }
}

/**
 * Stringify and write data to localStorage
 * @param {string} key - The localStorage key
 * @param {any} value - The value to store
 * @returns {boolean} True if successful, false otherwise
 */
export function setToStorage(key, value) {
  try {
    const data = JSON.stringify(value);
    localStorage.setItem(key, data);
    return true;
  } catch (error) {
    if (error.name === 'QuotaExceededError') {
      alert('Storage quota exceeded. Please delete some data to free up space.');
    }
    console.error(`Error writing to storage (key: ${key}):`, error);
    return false;
  }
}

/**
 * Remove item from localStorage
 * @param {string} key - The localStorage key
 * @returns {boolean} True if successful, false otherwise
 */
export function removeFromStorage(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing from storage (key: ${key}):`, error);
    return false;
  }
}

/**
 * Get all books for a specific user
 * @param {string} userId - The user ID
 * @returns {Array} Array of book objects
 */
export function getBooks(userId) {
  const books = getFromStorage('books') || [];
  if (userId) {
    return books.filter(book => book.userId === userId);
  }
  return books;
}

/**
 * Add a new book
 * @param {Object} book - The book object to add
 * @returns {boolean} True if successful
 */
export function addBook(book) {
  const books = getFromStorage('books') || [];
  books.push(book);
  return setToStorage('books', books);
}

/**
 * Update an existing book
 * @param {string} bookId - The book ID
 * @param {Object} updatedBook - The updated book object
 * @returns {boolean} True if successful
 */
export function updateBook(bookId, updatedBook) {
  const books = getFromStorage('books') || [];
  const index = books.findIndex(book => book.bookId === bookId);
  if (index !== -1) {
    books[index] = { ...books[index], ...updatedBook };
    return setToStorage('books', books);
  }
  return false;
}

/**
 * Delete a book
 * @param {string} bookId - The book ID
 * @returns {boolean} True if successful
 */
export function deleteBook(bookId) {
  const books = getFromStorage('books') || [];
  const filtered = books.filter(book => book.bookId !== bookId);
  return setToStorage('books', filtered);
}

/**
 * Migrate existing books to include new Unit 3 fields
 * Adds default values for: isbn, currentPage, progress, notes, rating, dateCompleted
 * @returns {boolean} True if migration successful
 */
export function migrateBooks() {
  try {
    const books = getFromStorage('books') || [];
    
    const migratedBooks = books.map(book => {
      // Only add fields if they don't exist
      return {
        ...book,
        isbn: book.isbn ?? null,
        currentPage: book.currentPage ?? 0,
        progress: book.progress ?? (book.status === 'completed' ? 100 : 0),
        notes: book.notes ?? null,
        rating: book.rating ?? null,
        dateCompleted: book.dateCompleted ?? null
      };
    });
    
    return setToStorage('books', migratedBooks);
  } catch (error) {
    console.error('Error migrating books:', error);
    return false;
  }
}
