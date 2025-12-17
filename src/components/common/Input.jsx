import styles from './Input.module.css';

function Input({
  type = 'text',
  name,
  value,
  onChange,
  onBlur,
  label,
  error,
  required = false,
  disabled = false,
  readOnly = false,
  placeholder,
  min,
  max
}) {
  const inputId = `input-${name}`;
  const errorId = `error-${name}`;

  return (
    <div className={styles.inputWrapper}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
          {required && <span className={styles.required}> *</span>}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`${styles.input} ${error ? styles.inputError : ''}`}
        disabled={disabled}
        readOnly={readOnly}
        placeholder={placeholder}
        min={min}
        max={max}
        aria-label={label}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? errorId : undefined}
      />
      {error && (
        <span id={errorId} className={styles.error} role="alert">
          {error}
        </span>
      )}
    </div>
  );
}

export default Input;
