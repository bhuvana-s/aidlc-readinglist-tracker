/**
 * Date Utility Functions
 * Provides date formatting and manipulation functions
 */

/**
 * Format date for display
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date string (e.g., "Jan 15, 2024")
 */
export function formatDate(date) {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return '';
  }
  
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return dateObj.toLocaleDateString('en-US', options);
}

/**
 * Get current date in ISO format
 * @returns {string} Current date in ISO format (YYYY-MM-DD)
 */
export function getCurrentDate() {
  return new Date().toISOString().split('T')[0];
}

/**
 * Extract month and year from date
 * @param {string|Date} date - Date to extract from
 * @returns {string} Month and year (e.g., "2024-01")
 */
export function getMonthYear(date) {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return '';
  }
  
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

/**
 * Calculate days between two dates
 * @param {string|Date} startDate - Start date
 * @param {string|Date} endDate - End date
 * @returns {number} Number of days between dates
 */
export function daysBetween(startDate, endDate) {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
  
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return 0;
  }
  
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}
