import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { calculateStatistics } from '../../utils/statisticsCalculator';
import styles from './StatisticsComponent.module.css';

function StatisticsComponent({ onExport }) {
  const { currentUserId } = useAuth();
  const [statistics, setStatistics] = useState(null);
  const [error, setError] = useState(null);

  const handleRefresh = () => {
    try {
      const stats = calculateStatistics(currentUserId);
      setStatistics(stats);
      setError(null);
    } catch (err) {
      setError('Failed to calculate statistics. Please try again.');
      setStatistics(null);
    }
  };

  const handleClear = () => {
    setStatistics(null);
    setError(null);
  };

  const handleExport = () => {
    if (onExport) {
      onExport();
    }
  };

  if (!statistics && !error) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>Reading Statistics</h2>
          <div className={styles.buttons}>
            <button onClick={handleRefresh} className={styles.refreshButton}>
              Refresh Statistics
            </button>
            <button onClick={handleExport} className={styles.exportButton}>
              Export Books
            </button>
          </div>
        </div>
        <p className={styles.emptyMessage}>
          Click "Refresh Statistics" to view your reading statistics.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Reading Statistics</h2>
        <div className={styles.buttons}>
          <button onClick={handleRefresh} className={styles.refreshButton}>
            Refresh Statistics
          </button>
          <button onClick={handleClear} className={styles.clearButton}>
            Clear Statistics
          </button>
          <button onClick={handleExport} className={styles.exportButton}>
            Export Books
          </button>
        </div>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {statistics && (
        <div className={styles.statsGrid}>
          {/* Status Counts Section */}
          <section className={styles.section}>
            <h3>Books by Status</h3>
            <div className={styles.statusList}>
              <div className={styles.statusItem}>
                <span className={styles.statusLabel}>Reading:</span>
                <span className={styles.statusValue}>
                  {statistics.booksByStatus.reading} ({statistics.booksByStatusPercentage.reading}%)
                </span>
              </div>
              <div className={styles.statusItem}>
                <span className={styles.statusLabel}>Completed:</span>
                <span className={styles.statusValue}>
                  {statistics.booksByStatus.completed} ({statistics.booksByStatusPercentage.completed}%)
                </span>
              </div>
              <div className={styles.statusItem}>
                <span className={styles.statusLabel}>Wishlist:</span>
                <span className={styles.statusValue}>
                  {statistics.booksByStatus.wishlist} ({statistics.booksByStatusPercentage.wishlist}%)
                </span>
              </div>
              <div className={styles.statusItem + ' ' + styles.total}>
                <span className={styles.statusLabel}>Total Books:</span>
                <span className={styles.statusValue}>{statistics.totalBooks}</span>
              </div>
            </div>
          </section>

          {/* Reading Pace Section */}
          <section className={styles.section}>
            <h3>Reading Pace</h3>
            {statistics.readingPace.pagesPerDay ? (
              <div className={styles.paceInfo}>
                <div className={styles.paceValue}>
                  {statistics.readingPace.pagesPerDay} pages/day
                </div>
                <div className={styles.paceDetail}>
                  Based on {statistics.readingPace.bookCount} book{statistics.readingPace.bookCount !== 1 ? 's' : ''}
                </div>
              </div>
            ) : (
              <div className={styles.noPace}>No pace data available</div>
            )}
            {statistics.readingPace.warnings.length > 0 && (
              <div className={styles.warnings}>
                {statistics.readingPace.warnings.map((warning, i) => (
                  <div key={i} className={styles.warning}>{warning}</div>
                ))}
              </div>
            )}
          </section>

          {/* Books Added Per Month */}
          <section className={styles.section}>
            <h3>Books Added Per Month</h3>
            <div className={styles.monthlyList}>
              {statistics.booksAddedPerMonth.map(item => (
                <div key={item.month} className={styles.monthlyItem}>
                  <span className={styles.monthLabel}>{item.month}:</span>
                  <span className={styles.monthValue}>{item.count}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Books Completed Per Month */}
          <section className={styles.section}>
            <h3>Books Completed Per Month</h3>
            <div className={styles.monthlyList}>
              {statistics.booksCompletedPerMonth.map(item => (
                <div key={item.month} className={styles.monthlyItem}>
                  <span className={styles.monthLabel}>{item.month}:</span>
                  <span className={styles.monthValue}>{item.count}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {statistics && (
        <div className={styles.footer}>
          Last updated: {new Date(statistics.lastCalculated).toLocaleString()}
        </div>
      )}
    </div>
  );
}

export default StatisticsComponent;
