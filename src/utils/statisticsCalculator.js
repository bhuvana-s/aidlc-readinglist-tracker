// Statistics Calculator Utility
// Calculates reading statistics from book data

import { getFromStorage } from './storage';

/**
 * Calculate all statistics for a user's book collection
 * @param {string} userId - User ID
 * @returns {Object|null} Statistics object or null if no books
 */
export function calculateStatistics(userId) {
  const key = `books_${userId}`;
  const books = getFromStorage(key) || [];
  
  if (!books || books.length === 0) {
    return null;
  }

  return {
    totalBooks: books.length,
    booksByStatus: calculateStatusCounts(books),
    booksByStatusPercentage: calculateStatusPercentages(books),
    booksAddedPerMonth: calculateMonthlyAdded(books),
    booksCompletedPerMonth: calculateMonthlyCompleted(books),
    readingPace: calculateReadingPace(books),
    lastCalculated: new Date().toISOString()
  };
}

/**
 * Calculate book counts by status
 */
function calculateStatusCounts(books) {
  return {
    reading: books.filter(b => b.status === 'Reading').length,
    completed: books.filter(b => b.status === 'Completed').length,
    wishlist: books.filter(b => b.status === 'Wishlist').length
  };
}

/**
 * Calculate percentages by status
 */
function calculateStatusPercentages(books) {
  const total = books.length;
  const counts = calculateStatusCounts(books);
  
  return {
    reading: Math.round((counts.reading / total) * 100),
    completed: Math.round((counts.completed / total) * 100),
    wishlist: Math.round((counts.wishlist / total) * 100)
  };
}

/**
 * Calculate books added per month
 */
function calculateMonthlyAdded(books) {
  return calculateMonthlyBookCounts(books, 'createdAt');
}

/**
 * Calculate books completed per month
 */
function calculateMonthlyCompleted(books) {
  const completedBooks = books.filter(b => b.status === 'Completed' && b.completedAt);
  return calculateMonthlyBookCounts(completedBooks, 'completedAt');
}

/**
 * Generic function to calculate monthly book counts
 */
function calculateMonthlyBookCounts(books, dateField) {
  const monthCounts = new Map();
  const now = new Date();
  
  // Generate last 12 months
  for (let i = 0; i < 12; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
    monthCounts.set(monthKey, {
      month: formatMonth(date),
      count: 0,
      year: date.getFullYear(),
      monthNumber: date.getMonth() + 1
    });
  }
  
  // Count books per month
  for (const book of books) {
    const dateValue = book[dateField];
    if (!dateValue) continue;
    
    const date = new Date(dateValue);
    const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
    
    if (monthCounts.has(monthKey)) {
      monthCounts.get(monthKey).count++;
    } else {
      // Older month - add if not present
      monthCounts.set(monthKey, {
        month: formatMonth(date),
        count: 1,
        year: date.getFullYear(),
        monthNumber: date.getMonth() + 1
      });
    }
  }
  
  // Convert to array and filter
  const result = Array.from(monthCounts.values())
    .filter(item => {
      const isLast12Months = isWithinLast12Months(item.year, item.monthNumber, now);
      return isLast12Months || item.count > 0;
    })
    .sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return b.monthNumber - a.monthNumber;
    });
  
  return result;
}

/**
 * Calculate reading pace (pages per day)
 */
function calculateReadingPace(books) {
  const validPaces = [];
  const warnings = [];
  const now = new Date();
  
  for (const book of books) {
    // Validate required fields
    if (!book.totalPages || !book.createdAt) {
      warnings.push(`"${book.title || 'Unknown'}" excluded: missing required fields`);
      continue;
    }
    
    let pace = null;
    let duration = 0;
    
    if (book.status === 'Completed' && book.completedAt) {
      // Completed book
      const startDate = new Date(book.createdAt);
      const endDate = new Date(book.completedAt);
      duration = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));
      
      if (duration === 0) {
        warnings.push(`"${book.title}" excluded: same-day completion`);
        continue;
      }
      
      pace = book.totalPages / duration;
      
    } else if (book.status === 'Reading' && book.pagesRead > 0) {
      // Currently reading book
      const startDate = new Date(book.createdAt);
      duration = Math.floor((now - startDate) / (1000 * 60 * 60 * 24));
      
      if (duration > 0) {
        pace = book.pagesRead / duration;
      }
    }
    
    if (pace !== null && pace > 0) {
      validPaces.push(pace);
    }
  }
  
  // Calculate average
  if (validPaces.length === 0) {
    return {
      pagesPerDay: null,
      bookCount: 0,
      warnings: warnings
    };
  }
  
  const averagePace = validPaces.reduce((sum, pace) => sum + pace, 0) / validPaces.length;
  
  return {
    pagesPerDay: Math.round(averagePace * 10) / 10,
    bookCount: validPaces.length,
    warnings: warnings
  };
}

/**
 * Format date as "MMM YYYY"
 */
function formatMonth(date) {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
}

/**
 * Check if month is within last 12 months
 */
function isWithinLast12Months(year, month, now) {
  const monthDate = new Date(year, month - 1, 1);
  const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);
  return monthDate >= twelveMonthsAgo;
}
