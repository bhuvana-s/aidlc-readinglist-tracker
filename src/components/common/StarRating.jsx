import { useState } from 'react';
import styles from './StarRating.module.css';

function StarRating({ value = 0, onChange, readOnly = false }) {
  const [hoverValue, setHoverValue] = useState(0);
  
  const displayValue = hoverValue || value;
  
  const handleClick = (rating) => {
    if (!readOnly && onChange) {
      onChange(rating);
    }
  };
  
  return (
    <div 
      className={`${styles.container} ${readOnly ? styles.readOnly : ''}`}
      role="radiogroup"
      aria-label="Rating"
    >
      {[1, 2, 3, 4, 5].map((rating) => (
        <button
          key={rating}
          type="button"
          className={`${styles.star} ${rating <= displayValue ? styles.starFilled : ''}`}
          onClick={() => handleClick(rating)}
          onMouseEnter={() => !readOnly && setHoverValue(rating)}
          onMouseLeave={() => !readOnly && setHoverValue(0)}
          disabled={readOnly}
          aria-label={`${rating} star${rating > 1 ? 's' : ''}`}
          role="radio"
          aria-checked={rating === value}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export default StarRating;
