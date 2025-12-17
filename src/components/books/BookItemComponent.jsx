import Card from '../common/Card';
import Button from '../common/Button';
import StarRating from '../common/StarRating';
import { calculateProgress } from '../../utils/progressCalculator';
import styles from './BookItemComponent.module.css';

function BookItemComponent({ book, isSearchMatch, onEdit, onDelete }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'wishlist':
        return 'blue';
      case 'reading':
        return 'yellow';
      case 'completed':
        return 'green';
      default:
        return 'gray';
    }
  };
  
  const getStatusLabel = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };
  
  const progress = calculateProgress(
    book.currentPage || 0,
    book.totalPages || 0,
    book.status
  );
  
  const cardClassName = `${styles.bookCard} ${isSearchMatch === false ? styles.dimmed : ''}`;
  
  return (
    <Card className={cardClassName}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h3 className={styles.title}>{book.title}</h3>
          <span className={`${styles.badge} ${styles[getStatusColor(book.status)]}`}>
            {getStatusLabel(book.status)}
          </span>
        </div>
        
        <p className={styles.author}>by {book.author}</p>
        
        <div className={styles.details}>
          <span className={styles.pages}>
            📖 {book.totalPages} pages
          </span>
        </div>
        
        {book.status === 'reading' && (
          <div className={styles.progressSection}>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill} 
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className={styles.progressInfo}>
              <span className={styles.progressText}>{progress}%</span>
              <span className={styles.pageCount}>
                {book.currentPage || 0} / {book.totalPages} pages
              </span>
            </div>
          </div>
        )}
        
        {book.rating && (
          <div className={styles.ratingSection}>
            <StarRating value={book.rating} readOnly />
            <span className={styles.ratingValue}>{book.rating.toFixed(1)}</span>
          </div>
        )}
        
        {book.notes && (
          <div className={styles.notesPreview}>
            <p>{book.notes.substring(0, 100)}{book.notes.length > 100 ? '...' : ''}</p>
          </div>
        )}
      </div>
      
      <div className={styles.actions}>
        <Button 
          variant="secondary" 
          size="small" 
          onClick={onEdit}
        >
          Edit
        </Button>
        <Button 
          variant="danger" 
          size="small" 
          onClick={onDelete}
        >
          Delete
        </Button>
      </div>
    </Card>
  );
}

export default BookItemComponent;
