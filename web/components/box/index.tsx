import clsx from 'clsx';
import * as React from 'react';
import styles from './style.module.css';

const Box = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>((props, ref) => {
  const { className, ...restProps } = props;
  return <div ref={ref} className={clsx(styles.box, className)} {...restProps} />;
});

Box.displayName = 'Box';

export default Box;
