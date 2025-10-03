import * as React from 'react';
import styles from './style.module.css';

const Button = React.forwardRef<HTMLButtonElement, React.HTMLAttributes<HTMLButtonElement>>((props, ref) => {
  return <button type="button" ref={ref} {...props} className={styles.button} />;
});

Button.displayName = 'Button';

export default Button;
