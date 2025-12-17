/**
 * ISBN Validator
 * Validates ISBN-10 and ISBN-13 format and checksums
 */

/**
 * Validate ISBN (10 or 13 digits)
 * @param {string} isbn - ISBN to validate
 * @returns {boolean} - True if valid ISBN-10 or ISBN-13
 */
export function validateISBN(isbn) {
  if (!isbn) return false;
  
  const cleaned = stripISBN(isbn);
  
  if (cleaned.length === 10) {
    return validateISBN10(cleaned);
  } else if (cleaned.length === 13) {
    return validateISBN13(cleaned);
  }
  
  return false;
}

/**
 * Validate ISBN-10 checksum
 * @param {string} isbn - 10-digit ISBN (may include 'X' as check digit)
 * @returns {boolean} - True if valid checksum
 */
export function validateISBN10(isbn) {
  if (isbn.length !== 10) return false;
  
  let sum = 0;
  
  // Calculate weighted sum for first 9 digits
  for (let i = 0; i < 9; i++) {
    const digit = parseInt(isbn[i]);
    if (isNaN(digit)) return false;
    sum += digit * (10 - i);
  }
  
  // Handle check digit (can be 'X' for 10)
  const checkDigit = isbn[9];
  if (checkDigit === 'X' || checkDigit === 'x') {
    sum += 10;
  } else {
    const digit = parseInt(checkDigit);
    if (isNaN(digit)) return false;
    sum += digit;
  }
  
  // Valid if sum is divisible by 11
  return sum % 11 === 0;
}

/**
 * Validate ISBN-13 checksum
 * @param {string} isbn - 13-digit ISBN
 * @returns {boolean} - True if valid checksum
 */
export function validateISBN13(isbn) {
  if (isbn.length !== 13) return false;
  
  let sum = 0;
  
  // Calculate weighted sum (alternating 1 and 3)
  for (let i = 0; i < 12; i++) {
    const digit = parseInt(isbn[i]);
    if (isNaN(digit)) return false;
    
    const weight = i % 2 === 0 ? 1 : 3;
    sum += digit * weight;
  }
  
  // Calculate check digit
  const checkDigit = parseInt(isbn[12]);
  if (isNaN(checkDigit)) return false;
  
  const calculatedCheck = (10 - (sum % 10)) % 10;
  
  return checkDigit === calculatedCheck;
}

/**
 * Strip hyphens and spaces from ISBN
 * @param {string} isbn - ISBN with formatting
 * @returns {string} - Clean ISBN with digits only (and 'X' for ISBN-10)
 */
export function stripISBN(isbn) {
  return isbn.replace(/[-\s]/g, '').toUpperCase();
}
