import styles from './PlaceholderComponent.module.css';

function PlaceholderComponent({ title, description }) {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.description}>{description}</p>
        <p className={styles.note}>
          This component will be implemented in a future unit.
        </p>
      </div>
    </div>
  );
}

export default PlaceholderComponent;
