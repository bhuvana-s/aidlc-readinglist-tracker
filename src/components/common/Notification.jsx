import styles from './Notification.module.css';

function Notification({ type = 'info', message, onDismiss }) {
  const icons = {
    success: '✓',
    error: '✕',
    warning: '!',
    info: 'i'
  };

  return (
    <div 
      className={`${styles.notification} ${styles[`notification${type.charAt(0).toUpperCase() + type.slice(1)}`]}`}
      role="alert"
      aria-live="polite"
    >
      <span className={styles.icon} aria-hidden="true">
        {icons[type]}
      </span>
      <span className={styles.message}>{message}</span>
      {onDismiss && (
        <button 
          className={styles.dismissButton}
          onClick={onDismiss}
          aria-label="Dismiss notification"
        >
          ×
        </button>
      )}
    </div>
  );
}

export default Notification;
