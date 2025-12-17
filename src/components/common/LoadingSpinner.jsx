import styles from './LoadingSpinner.module.css';

function LoadingSpinner({ size = 'medium' }) {
  return (
    <div 
      className={`${styles.spinner} ${styles[`spinner${size.charAt(0).toUpperCase() + size.slice(1)}`]}`}
      role="status"
      aria-label="Loading"
    >
      <span className={styles.visuallyHidden}>Loading...</span>
    </div>
  );
}

export default LoadingSpinner;
