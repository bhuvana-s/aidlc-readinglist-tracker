/**
 * Validation Utility Functions
 * Provides reusable validation functions for forms
 */

/**
 * Validate email format
 * @param {string} email - Email address to validate
 * @returns {object} { isValid: boolean, errorMessage: string }
 */
export function validateEmail(email) {
  if (!email || email.trim() === '') {
    return { isValid: false, errorMessage: 'Email is required' };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, errorMessage: 'Invalid email format' };
  }
  
  return { isValid: true, errorMessage: '' };
}

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {object} { isValid: boolean, errorMessage: string }
 */
export function validatePassword(password) {
  if (!password || password.trim() === '') {
    return { isValid: false, errorMessage: 'Password is required' };
  }
  
  if (password.length < 8) {
    return { isValid: false, errorMessage: 'Password must be at least 8 characters' };
  }
  
  if (!/[a-zA-Z]/.test(password)) {
    return { isValid: false, errorMessage: 'Password must contain at least one letter' };
  }
  
  if (!/[0-9]/.test(password)) {
    return { isValid: false, errorMessage: 'Password must contain at least one number' };
  }
  
  return { isValid: true, errorMessage: '' };
}

/**
 * Validate required field
 * @param {any} value - Value to validate
 * @param {string} fieldName - Name of the field for error message
 * @returns {object} { isValid: boolean, errorMessage: string }
 */
export function validateRequired(value, fieldName = 'This field') {
  if (value === null || value === undefined || value === '') {
    return { isValid: false, errorMessage: `${fieldName} is required` };
  }
  
  if (typeof value === 'string' && value.trim() === '') {
    return { isValid: false, errorMessage: `${fieldName} is required` };
  }
  
  return { isValid: true, errorMessage: '' };
}

/**
 * Validate number within range
 * @param {number} value - Number to validate
 * @param {number} min - Minimum value (optional)
 * @param {number} max - Maximum value (optional)
 * @param {string} fieldName - Name of the field for error message
 * @returns {object} { isValid: boolean, errorMessage: string }
 */
export function validateNumber(value, min = null, max = null, fieldName = 'This field') {
  if (value === null || value === undefined || value === '') {
    return { isValid: false, errorMessage: `${fieldName} is required` };
  }
  
  const numValue = Number(value);
  
  if (isNaN(numValue)) {
    return { isValid: false, errorMessage: `${fieldName} must be a number` };
  }
  
  if (min !== null && numValue < min) {
    return { isValid: false, errorMessage: `${fieldName} must be at least ${min}` };
  }
  
  if (max !== null && numValue > max) {
    return { isValid: false, errorMessage: `${fieldName} must be at most ${max}` };
  }
  
  return { isValid: true, errorMessage: '' };
}
