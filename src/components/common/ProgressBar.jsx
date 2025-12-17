import styles from './ProgressBar.module.css';

function ProgressBar({ value = 0, showPercentage = true, color }) {
  const clampedValue = Math.min(100, Math.max(0, value));
  
  return (
    <div className={styles.container}>
      <div 
        className={styles.bar}
        role="progressbar"
        aria-valuenow={clampedValue}
        aria-valuemin="0"
        aria-valuemax="100"
      >
        <div 
          className={styles.fill}
          style={{ 
            width: `${clampedValue}%`,
            backgroundColor: color || 'var(--color-primary)'
          }}
        />
      </div>
      {showPercentage && (
        <span className={styles.percentage}>{Math.round(clampedValue)}%</span>
      )}
    </div>
  );
}

export default ProgressBar;
