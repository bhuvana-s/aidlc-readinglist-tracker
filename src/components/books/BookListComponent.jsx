import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getFromStorage, setToStorage } from '../../utils/storage';
import { generateId } from '../../utils/idGenerator';
import { getCurrentDate } from '../../utils/dateUtils';
import BookItemComponent from './BookItemComponent';
import BookFormModal from './BookFormModal';
import StatisticsComponent from './StatisticsComponent';
import SearchComponent from './SearchComponent';
import Modal from '../common/Modal';
import Button from '../common/Button';
import styles from './BookListComponent.module.css';

function BookListComponent() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportPreview, setExportPreview] = useState(null);
  const { currentUserId, logout } = useAuth();
  const navigate = useNavigate();
  
  // Load books on mount
  useEffect(() => {
    loadBooks();
  }, [currentUserId]);
  
  const loadBooks = () => {
    setLoading(true);
    try {
      const key = `books_${currentUserId}`;
      const userBooks = getFromStorage(key) || [];
      setBooks(userBooks);
    } catch (error) {
      console.error('Error loading books:', error);
      alert('Failed to load books');
    } finally {
      setLoading(false);
    }
  };
  
  const saveBooks = (updatedBooks) => {
    const key = `books_${currentUserId}`;
    const saved = setToStorage(key, updatedBooks);
    if (!saved) {
      alert('Storage quota exceeded. Please delete some books to free up space.');
      return false;
    }
    return true;
  };
  
  const handleAddBook = (bookData) => {
    const newBook = {
      bookId: generateId(),
      userId: currentUserId,
      ...bookData,
      pagesRead: 0,
      createdAt: getCurrentDate()
    };
    
    const updatedBooks = [...books, newBook];
    if (saveBooks(updatedBooks)) {
      setBooks(updatedBooks);
      setShowAddModal(false);
    }
  };

  
  const handleEditBook = (bookId, bookData) => {
    const updatedBooks = books.map(book =>
      book.bookId === bookId ? { ...book, ...bookData } : book
    );
    
    if (saveBooks(updatedBooks)) {
      setBooks(updatedBooks);
      setEditingBook(null);
    }
  };
  
  const handleDeleteBook = (bookId) => {
    if (!window.confirm('Are you sure you want to delete this book?')) {
      return;
    }
    
    const updatedBooks = books.filter(book => book.bookId !== bookId);
    if (saveBooks(updatedBooks)) {
      setBooks(updatedBooks);
    }
  };
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const handleExport = () => {
    try {
      const key = `books_${currentUserId}`;
      const userBooks = getFromStorage(key) || [];
      
      if (userBooks.length === 0) {
        alert('No books to export');
        return;
      }
      
      setExportPreview({
        books: userBooks.slice(0, 5),
        totalCount: userBooks.length
      });
      setShowExportModal(true);
    } catch (err) {
      alert('Export failed. Please try again.');
    }
  };
  
  const confirmExport = () => {
    try {
      const key = `books_${currentUserId}`;
      const userBooks = getFromStorage(key) || [];
      const jsonString = JSON.stringify(userBooks, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      // Generate filename
      const timestamp = new Date().toISOString().replace(/:/g, '-').replace(/\..+/, '');
      const sanitizedEmail = currentUserId.replace(/@/g, '-').replace(/\./g, '-');
      const filename = `reading-list-${sanitizedEmail}-${timestamp}.json`;
      
      // Trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
      
      URL.revokeObjectURL(url);
      setShowExportModal(false);
      alert(`Export complete: ${userBooks.length} books exported`);
    } catch (err) {
      alert('Export failed. Please copy the data manually.');
    }
  };
  
  const handleSearchResults = (matchingIds) => {
    setSearchResults(matchingIds);
  };
  
  // Filter books based on search results
  const displayedBooks = searchResults 
    ? books.filter(book => searchResults.includes(book.bookId))
    : books;
  
  if (loading) {
    return (
      <div className={styles.loading}>
        <p>Loading books...</p>
      </div>
    );
  }
  
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.pageTitle}>My Reading List</h1>
          <Button variant="secondary" size="small" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </header>
      
      <div className={styles.content}>
        {/* Statistics Section */}
        <StatisticsComponent onExport={handleExport} />
        
        {/* Search Section */}
        <SearchComponent onSearchResults={handleSearchResults} />
        
        <div className={styles.toolbar}>
          <div className={styles.stats}>
            <span className={styles.count}>
              {searchResults ? `${displayedBooks.length} of ${books.length}` : books.length} {books.length === 1 ? 'book' : 'books'}
            </span>
          </div>
          <Button variant="primary" onClick={() => setShowAddModal(true)}>
            + Add Book
          </Button>
        </div>
        
        {books.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📚</div>
            <h2 className={styles.emptyTitle}>No books yet</h2>
            <p className={styles.emptyText}>
              Start building your reading list by adding your first book!
            </p>
            <Button variant="primary" onClick={() => setShowAddModal(true)}>
              Add Your First Book
            </Button>
          </div>
        ) : displayedBooks.length === 0 ? (
          <div className={styles.emptyState}>
            <h2 className={styles.emptyTitle}>No books found</h2>
            <p className={styles.emptyText}>
              No books match your search. Try a different search term.
            </p>
          </div>
        ) : (
          <div className={styles.bookGrid}>
            {displayedBooks.map(book => (
              <BookItemComponent
                key={book.bookId}
                book={book}
                isSearchMatch={searchResults ? searchResults.includes(book.bookId) : null}
                onEdit={() => setEditingBook(book)}
                onDelete={() => handleDeleteBook(book.bookId)}
              />
            ))}
          </div>
        )}
      </div>
      
      {showAddModal && (
        <BookFormModal
          currentUser={{ userId: currentUserId }}
          onSave={handleAddBook}
          onCancel={() => setShowAddModal(false)}
        />
      )}
      
      {editingBook && (
        <BookFormModal
          book={editingBook}
          currentUser={{ userId: currentUserId }}
          onSave={(data) => handleEditBook(editingBook.bookId, data)}
          onCancel={() => setEditingBook(null)}
        />
      )}
      
      {showExportModal && exportPreview && (
        <Modal onClose={() => setShowExportModal(false)}>
          <div className={styles.exportModal}>
            <h2>Export Preview</h2>
            <p className={styles.exportCount}>Total books: {exportPreview.totalCount}</p>
            <h3>First 5 books:</h3>
            <ul className={styles.exportList}>
              {exportPreview.books.map(book => (
                <li key={book.bookId}>
                  <strong>{book.title}</strong> by {book.author} ({book.status})
                </li>
              ))}
            </ul>
            <div className={styles.exportButtons}>
              <Button variant="primary" onClick={confirmExport}>
                Confirm Export
              </Button>
              <Button variant="secondary" onClick={() => setShowExportModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default BookListComponent;
