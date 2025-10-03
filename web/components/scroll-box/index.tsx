import * as React from 'react';
import mergeRefs from '../utils/mergeRefs';
import styles from './style.module.css';

const WIDTH = 500;
const HEIGHT = 380;
const SCROLL_SIZE = 2000;

interface ScrollBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactElement;
}

const ScrollBox = React.forwardRef<HTMLDivElement, ScrollBoxProps>((props, ref) => {
  const { children, ...restProps } = props;
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const childRef = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    const element = scrollRef.current;
    const child = childRef.current;

    const childBox = child ? child.getBoundingClientRect() : { width: 200, height: 50 };

    if (element) {
      element.scrollLeft = SCROLL_SIZE / 2 - WIDTH / 2 + childBox.width / 2;
      element.scrollTop = SCROLL_SIZE / 2 - HEIGHT / 2 + childBox.height / 2;
    }
  }, []);

  return (
    <div ref={mergeRefs(scrollRef, ref)} {...restProps} className={styles['scroll-box']}>
      {React.cloneElement(children as any, {
        style: {
          position: 'relative',
          left: SCROLL_SIZE / 2,
          top: SCROLL_SIZE / 2,
          ...(children.props as any).style,
        },
        ref: mergeRefs(childRef, (children.props as any).ref),
      })}
      <div style={{ width: SCROLL_SIZE, height: SCROLL_SIZE }} />
    </div>
  );
});

ScrollBox.displayName = 'ScrollBox';

export default ScrollBox;
