import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getFromStorage, setToStorage } from '../../utils/storage';
import { generateId } from '../../utils/idGenerator';
import { getCurrentDate } from '../../utils/dateUtils';
import BookItemComponent from './BookItemComponent';
import BookFormModal from './BookFormModal';
import Button from '../common/Button';
import styles from './BookListComponent.module.css';

function BookListComponent() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
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
        <div className={styles.toolbar}>
          <div className={styles.stats}>
            <span className={styles.count}>
              {books.length} {books.length === 1 ? 'book' : 'books'}
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
        ) : (
          <div className={styles.bookGrid}>
            {books.map(book => (
              <BookItemComponent
                key={book.bookId}
                book={book}
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
    </div>
  );
}

export default BookListComponent;
