import { useLoading } from '../contexts/LoadingContext';
import LoadingSpinner from './common/LoadingSpinner';
import styles from './LoadingOverlay.module.css';

function LoadingOverlay() {
  const { isLoading, message } = useLoading();

  if (!isLoading) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.content}>
        <LoadingSpinner size="large" />
        {message && <p className={styles.message}>{message}</p>}
      </div>
    </div>
  );
}

export default LoadingOverlay;
