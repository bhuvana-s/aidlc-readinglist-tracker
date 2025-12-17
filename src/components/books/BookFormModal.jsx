import { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import Form from '../common/Form';
import StarRating from '../common/StarRating';
import { validateISBN } from '../../utils/isbnValidator';
import { parseJSON, parseCSV, validateBook, isDuplicate } from '../../utils/importParser';
import { calculateProgress, shouldAutoComplete } from '../../utils/progressCalculator';
import { generateId } from '../../utils/idGenerator';
import * as storage from '../../utils/storage';
import styles from './BookFormModal.module.css';

function BookFormModal({ book, onSave, onCancel, currentUser }) {
  const [mode, setMode] = useState('manual');
  const [formData, setFormData] = useState(book || {
    title: '',
    author: '',
    status: 'wishlist',
    totalPages: '',
    currentPage: 0,
    isbn: '',
    notes: '',
    rating: null
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState(null);
  
  const isEditMode = !!book;
  
  const validateField = (name, value) => {
    let error = null;
    
    switch (name) {
      case 'title':
        if (!value || value.trim() === '') {
          error = 'Title is required';
        } else if (value.length > 200) {
          error = 'Title must be between 1 and 200 characters';
        }
        break;
        
      case 'author':
        if (!value || value.trim() === '') {
          error = 'Author is required';
        } else if (!/^[a-zA-Z\s-]+$/.test(value)) {
          error = 'Author must contain only letters, spaces, and hyphens';
        }
        break;
        
      case 'status':
        if (!['wishlist', 'reading', 'completed'].includes(value)) {
          error = 'Status must be wishlist, reading, or completed';
        }
        break;
        
      case 'totalPages':
        const num = Number(value);
        if (!value) {
          error = 'Total pages is required';
        } else if (isNaN(num)) {
          error = 'Total pages must be a number';
        } else if (num < 1 || num > 10000) {
          error = 'Total pages must be between 1 and 10,000';
        }
        break;
        
      case 'currentPage':
        const currentNum = Number(value);
        const totalNum = Number(formData.totalPages);
        if (value !== '' && (isNaN(currentNum) || currentNum < 0 || currentNum > totalNum)) {
          error = `Current page must be between 0 and ${totalNum}`;
        }
        break;
        
      case 'notes':
        if (value && value.length > 5000) {
          error = 'Notes must be 5000 characters or less';
        }
        break;
    }
    
    setErrors(prev => ({ ...prev, [name]: error }));
    return !error;
  };

  const handleISBNLookup = async () => {
    setError(null);
    setIsLoading(true);
    
    try {
      const isbn = formData.isbn.trim();
      
      if (!validateISBN(isbn)) {
        throw new Error('Invalid ISBN format. Please enter a valid 10 or 13 digit ISBN.');
      }
      
      const url = `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Unable to lookup ISBN. Please try manual entry.');
      }
      
      const data = await response.json();
      const bookKey = `ISBN:${isbn}`;
      const bookData = data[bookKey];
      
      if (!bookData) {
        throw new Error('ISBN not found in database. Please try manual entry.');
      }
      
      setFormData({
        ...formData,
        title: bookData.title || '',
        author: bookData.authors?.[0]?.name || '',
        totalPages: bookData.number_of_pages || 0
      });
      
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const isJSON = file.name.endsWith('.json');
    const isCSV = file.name.endsWith('.csv');
    
    if (!isJSON && !isCSV) {
      setError('Invalid file type. Please select a JSON or CSV file.');
      return;
    }
    
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const content = e.target.result;
      if (isJSON) {
        processJSONImport(content);
      } else if (isCSV) {
        processCSVImport(content);
      }
    };
    
    reader.onerror = () => {
      setError('Failed to read file. Please try again.');
    };
    
    reader.readAsText(file);
  };

  const processJSONImport = (jsonText) => {
    setIsImporting(true);
    setError(null);
    
    try {
      const books = parseJSON(jsonText);
      const existingBooks = storage.getBooks(currentUser.userId);
      
      let imported = 0;
      let skipped = 0;
      let failed = 0;
      
      books.forEach(bookData => {
        if (!validateBook(bookData)) {
          failed++;
          return;
        }
        
        if (isDuplicate(bookData, existingBooks)) {
          skipped++;
          return;
        }
        
        const newBook = {
          bookId: generateId(),
          userId: currentUser.userId,
          title: bookData.title,
          author: bookData.author,
          status: bookData.status || 'wishlist',
          totalPages: bookData.totalPages || 0,
          currentPage: bookData.currentPage || 0,
          isbn: bookData.isbn || null,
          notes: bookData.notes || null,
          rating: bookData.rating || null,
          dateAdded: new Date().toISOString(),
          dateCompleted: bookData.dateCompleted || null,
          progress: calculateProgress(
            bookData.currentPage || 0,
            bookData.totalPages || 0,
            bookData.status || 'wishlist'
          )
        };
        
        storage.addBook(newBook);
        imported++;
      });
      
      setImportResult({
        message: `Imported ${imported} of ${books.length} books. ${skipped} skipped (duplicates), ${failed} failed (invalid).`
      });
      
      setTimeout(() => {
        onSave();
      }, 2000);
      
    } catch (err) {
      setError(err.message || 'Import failed. Please check file format.');
    } finally {
      setIsImporting(false);
    }
  };

  const processCSVImport = (csvText) => {
    setIsImporting(true);
    setError(null);
    
    try {
      const books = parseCSV(csvText);
      const existingBooks = storage.getBooks(currentUser.userId);
      
      let imported = 0;
      let skipped = 0;
      let failed = 0;
      
      books.forEach(bookData => {
        if (!validateBook(bookData)) {
          failed++;
          return;
        }
        
        if (isDuplicate(bookData, existingBooks)) {
          skipped++;
          return;
        }
        
        const newBook = {
          bookId: generateId(),
          userId: currentUser.userId,
          title: bookData.title,
          author: bookData.author,
          status: bookData.status || 'wishlist',
          totalPages: bookData.totalPages || 0,
          currentPage: bookData.currentPage || 0,
          isbn: bookData.isbn || null,
          notes: bookData.notes || null,
          rating: bookData.rating || null,
          dateAdded: new Date().toISOString(),
          dateCompleted: bookData.dateCompleted || null,
          progress: calculateProgress(
            bookData.currentPage || 0,
            bookData.totalPages || 0,
            bookData.status || 'wishlist'
          )
        };
        
        storage.addBook(newBook);
        imported++;
      });
      
      setImportResult({
        message: `Imported ${imported} of ${books.length} books. ${skipped} skipped (duplicates), ${failed} failed (invalid).`
      });
      
      setTimeout(() => {
        onSave();
      }, 2000);
      
    } catch (err) {
      setError(err.message || 'Import failed. Please check file format.');
    } finally {
      setIsImporting(false);
    }
  };

  
  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all fields
    const titleValid = validateField('title', formData.title);
    const authorValid = validateField('author', formData.author);
    const statusValid = validateField('status', formData.status);
    const pagesValid = validateField('totalPages', formData.totalPages);
    const currentPageValid = validateField('currentPage', formData.currentPage);
    const notesValid = validateField('notes', formData.notes);
    
    if (titleValid && authorValid && statusValid && pagesValid && currentPageValid && notesValid) {
      const progress = calculateProgress(
        Number(formData.currentPage) || 0,
        Number(formData.totalPages) || 0,
        formData.status
      );
      
      let finalStatus = formData.status;
      let finalDateCompleted = formData.dateCompleted || null;
      
      if (shouldAutoComplete(progress, formData.status)) {
        finalStatus = 'completed';
        finalDateCompleted = new Date().toISOString();
        alert('Book marked as completed!');
      }
      
      const bookData = {
        ...formData,
        status: finalStatus,
        dateCompleted: finalDateCompleted,
        progress,
        currentPage: Number(formData.currentPage) || 0,
        totalPages: Number(formData.totalPages) || 0
      };
      
      onSave(bookData);
    }
  };
  
  return (
    <Modal isOpen={true} onClose={onCancel}>
      <div className={styles.modalContent}>
        <h2 className={styles.title}>
          {isEditMode ? 'Edit Book' : 'Add New Book'}
        </h2>
        
        {!isEditMode && (
          <div className={styles.modeSelector}>
            <button 
              type="button"
              className={mode === 'manual' ? styles.active : ''}
              onClick={() => setMode('manual')}
            >
              Manual Entry
            </button>
            <button 
              type="button"
              className={mode === 'isbn' ? styles.active : ''}
              onClick={() => setMode('isbn')}
            >
              ISBN Lookup
            </button>
            <button 
              type="button"
              className={mode === 'json' ? styles.active : ''}
              onClick={() => setMode('json')}
            >
              Import JSON
            </button>
            <button 
              type="button"
              className={mode === 'csv' ? styles.active : ''}
              onClick={() => setMode('csv')}
            >
              Import CSV
            </button>
          </div>
        )}
        
        {error && <div className={styles.errorMessage}>{error}</div>}
        {importResult && <div className={styles.importResult}>{importResult.message}</div>}
        
        {mode === 'isbn' && !isEditMode && (
          <div className={styles.isbnSection}>
            <div className={styles.field}>
              <label htmlFor="isbn">ISBN</label>
              <Input
                id="isbn"
                name="isbn"
                value={formData.isbn}
                onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                placeholder="Enter ISBN-10 or ISBN-13"
              />
            </div>
            <Button 
              type="button" 
              variant="primary" 
              onClick={handleISBNLookup}
              disabled={isLoading}
            >
              {isLoading ? 'Looking up...' : 'Lookup ISBN'}
            </Button>
          </div>
        )}
        
        {mode === 'json' && !isEditMode && (
          <div className={styles.importSection}>
            <div className={styles.field}>
              <label htmlFor="jsonFile">Select JSON File</label>
              <input
                type="file"
                id="jsonFile"
                accept=".json"
                onChange={handleFileSelect}
                disabled={isImporting}
              />
            </div>
            {isImporting && <p>Importing books...</p>}
          </div>
        )}
        
        {mode === 'csv' && !isEditMode && (
          <div className={styles.importSection}>
            <div className={styles.field}>
              <label htmlFor="csvFile">Select CSV File</label>
              <input
                type="file"
                id="csvFile"
                accept=".csv"
                onChange={handleFileSelect}
                disabled={isImporting}
              />
            </div>
            {isImporting && <p>Importing books...</p>}
            <p className={styles.csvHelp}>
              CSV format: title, author, status, totalPages, currentPage, isbn, notes, rating, dateCompleted
            </p>
          </div>
        )}
        
        {(mode === 'manual' || mode === 'isbn' || isEditMode) && (
          <Form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label htmlFor="title">Title *</label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                onBlur={handleBlur}
                placeholder="Enter book title"
                hasError={!!errors.title}
              />
              {errors.title && <span className={styles.error}>{errors.title}</span>}
            </div>
            
            <div className={styles.field}>
              <label htmlFor="author">Author *</label>
              <Input
                id="author"
                name="author"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                onBlur={handleBlur}
                placeholder="Enter author name"
                hasError={!!errors.author}
              />
              {errors.author && <span className={styles.error}>{errors.author}</span>}
            </div>
            
            <div className={styles.field}>
              <label htmlFor="status">Status *</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                onBlur={handleBlur}
                className={styles.select}
              >
                <option value="wishlist">Wishlist</option>
                <option value="reading">Reading</option>
                <option value="completed">Completed</option>
              </select>
              {errors.status && <span className={styles.error}>{errors.status}</span>}
            </div>
            
            <div className={styles.field}>
              <label htmlFor="totalPages">Total Pages *</label>
              <Input
                id="totalPages"
                name="totalPages"
                type="number"
                value={formData.totalPages}
                onChange={(e) => setFormData({ ...formData, totalPages: e.target.value })}
                onBlur={handleBlur}
                placeholder="Enter total pages"
                min="1"
                max="10000"
                hasError={!!errors.totalPages}
              />
              {errors.totalPages && <span className={styles.error}>{errors.totalPages}</span>}
            </div>
            
            <div className={styles.field}>
              <label htmlFor="currentPage">Current Page</label>
              <Input
                id="currentPage"
                name="currentPage"
                type="number"
                value={formData.currentPage}
                onChange={(e) => setFormData({ ...formData, currentPage: e.target.value })}
                onBlur={handleBlur}
                placeholder="Enter current page"
                min="0"
                max={formData.totalPages}
                hasError={!!errors.currentPage}
              />
              {errors.currentPage && <span className={styles.error}>{errors.currentPage}</span>}
              {formData.totalPages > 0 && (
                <span className={styles.progressText}>
                  Progress: {calculateProgress(Number(formData.currentPage) || 0, Number(formData.totalPages) || 0, formData.status)}%
                </span>
              )}
            </div>
            
            <div className={styles.field}>
              <label htmlFor="notes">Notes</label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes || ''}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                onBlur={handleBlur}
                maxLength={5000}
                rows={4}
                placeholder="Add your thoughts about this book..."
                className={styles.textarea}
              />
              {errors.notes && <span className={styles.error}>{errors.notes}</span>}
              <span className={styles.charCount}>
                {(formData.notes || '').length} / 5000 characters
              </span>
            </div>
            
            <div className={styles.field}>
              <label>Rating</label>
              <StarRating
                value={formData.rating || 0}
                onChange={(rating) => setFormData({ ...formData, rating })}
              />
            </div>
            
            <div className={styles.actions}>
              <Button type="submit" variant="primary">
                {isEditMode ? 'Update Book' : 'Add Book'}
              </Button>
              <Button type="button" variant="secondary" onClick={onCancel}>
                Cancel
              </Button>
            </div>
          </Form>
        )}
      </div>
    </Modal>
  );
}

export default BookFormModal;
