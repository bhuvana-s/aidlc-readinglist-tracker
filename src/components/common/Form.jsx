import styles from './Form.module.css';

function Form({ onSubmit, children, ariaLabel }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(e);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className={styles.form}
      aria-label={ariaLabel}
    >
      {children}
    </form>
  );
}

export default Form;
