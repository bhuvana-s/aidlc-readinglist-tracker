import styles from './Card.module.css';

function Card({ children, clickable = false, onClick }) {
  const className = clickable ? `${styles.card} ${styles.cardClickable}` : styles.card;

  return (
    <div 
      className={className}
      onClick={clickable ? onClick : undefined}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      onKeyDown={clickable ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      } : undefined}
    >
      {children}
    </div>
  );
}

export default Card;
