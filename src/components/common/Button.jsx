import styles from './Button.module.css';

function Button({ 
  variant = 'primary', 
  size = 'medium', 
  disabled = false,
  type = 'button',
  onClick, 
  children,
  ariaLabel
}) {
  const classNames = [
    styles.button,
    styles[`button${variant.charAt(0).toUpperCase() + variant.slice(1)}`],
    styles[`button${size.charAt(0).toUpperCase() + size.slice(1)}`]
  ].join(' ');

  return (
    <button
      type={type}
      className={classNames}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
    >
      {children}
    </button>
  );
}

export default Button;
