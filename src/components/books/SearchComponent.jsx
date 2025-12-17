import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getFromStorage } from '../../utils/storage';
import styles from './SearchComponent.module.css';

function SearchComponent({ onSearchResults }) {
  const { currentUserId } = useAuth();
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    const key = `books_${currentUserId}`;
    const books = getFromStorage(key) || [];
    const normalizedQuery = query.trim().toLowerCase();
    
    if (normalizedQuery === '') {
      onSearchResults(null); // Show all books
      return;
    }

    const matchingIds = books
      .filter(book => {
        const title = (book.title || '').toLowerCase();
        const author = (book.author || '').toLowerCase();
        return title.includes(normalizedQuery) || author.includes(normalizedQuery);
      })
      .map(book => book.bookId);

    onSearchResults(matchingIds);
  };

  const handleClear = () => {
    setQuery('');
    onSearchResults(null); // Show all books
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.searchBox}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Search by title or author..."
          className={styles.input}
        />
        <button onClick={handleSearch} className={styles.searchButton}>
          Search
        </button>
        <button onClick={handleClear} className={styles.clearButton}>
          Clear
        </button>
      </div>
    </div>
  );
}

export default SearchComponent;
