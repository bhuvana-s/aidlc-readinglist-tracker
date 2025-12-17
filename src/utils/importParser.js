/**
 * Import Parser
 * Parse and validate JSON/CSV import files
 */

/**
 * Parse JSON import file
 * @param {string} jsonText - JSON file content
 * @returns {Array<Object>} - Array of book objects
 * @throws {Error} - If JSON is invalid or not an array
 */
export function parseJSON(jsonText) {
  const data = JSON.parse(jsonText);
  
  if (!Array.isArray(data)) {
    throw new Error('Invalid JSON format. Expected an array of books.');
  }
  
  return data;
}

/**
 * Parse CSV import file
 * Expected column order: title, author, status, totalPages, currentPage, isbn, notes, rating, dateCompleted
 * @param {string} csvText - CSV file content
 * @returns {Array<Object>} - Array of book objects
 */
export function parseCSV(csvText) {
  const lines = csvText.split('\n').filter(line => line.trim());
  
  if (lines.length < 2) {
    throw new Error('CSV file must have a header row and at least one data row.');
  }
  
  // Skip header row (first line)
  const dataLines = lines.slice(1);
  
  return dataLines.map(line => {
    // Simple CSV parsing (doesn't handle quoted commas)
    const columns = line.split(',').map(col => col.trim());
    
    return {
      title: columns[0] || '',
      author: columns[1] || '',
      status: columns[2] || 'Wishlist',
      totalPages: parseInt(columns[3]) || 0,
      currentPage: parseInt(columns[4]) || 0,
      isbn: columns[5] || null,
      notes: columns[6] || null,
      rating: parseFloat(columns[7]) || null,
      dateCompleted: columns[8] || null
    };
  });
}

/**
 * Validate book object has required fields
 * @param {Object} book - Book object to validate
 * @returns {boolean} - True if valid (has title and author)
 */
export function validateBook(book) {
  return !!(book && book.title && book.title.trim() && book.author && book.author.trim());
}

/**
 * Check if book is duplicate (same title and author, case-insensitive)
 * @param {Object} newBook - Book to check
 * @param {Array<Object>} existingBooks - Existing books
 * @returns {boolean} - True if duplicate found
 */
export function isDuplicate(newBook, existingBooks) {
  const normalizedTitle = newBook.title.toLowerCase().trim();
  const normalizedAuthor = newBook.author.toLowerCase().trim();
  
  return existingBooks.some(book =>
    book.title.toLowerCase().trim() === normalizedTitle &&
    book.author.toLowerCase().trim() === normalizedAuthor
  );
}
