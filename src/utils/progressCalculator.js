/**
 * Progress Calculator
 * Calculate reading progress percentage
 */

/**
 * Calculate progress percentage
 * @param {number} currentPage - Current page number
 * @param {number} totalPages - Total pages in book
 * @param {string} status - Book status ('Reading', 'Completed', 'Wishlist')
 * @returns {number} - Progress percentage (0-100, integer)
 */
export function calculateProgress(currentPage, totalPages, status) {
  // Fixed progress for non-reading statuses
  if (status === 'Wishlist') return 0;
  if (status === 'Completed') return 100;
  
  // Calculate for Reading status
  if (totalPages === 0) return 0;
  
  const progress = (currentPage / totalPages) * 100;
  
  // Floor to integer and clamp to 0-100
  return Math.floor(Math.max(0, Math.min(100, progress)));
}

/**
 * Check if book should auto-complete
 * @param {number} progress - Current progress percentage
 * @param {string} status - Current book status
 * @returns {boolean} - True if should auto-complete
 */
export function shouldAutoComplete(progress, status) {
  return progress === 100 && status === 'Reading';
}
