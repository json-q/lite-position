import type { Boundary, Elements } from './type';
import { getAllScrollElements } from './utils/dom';

interface ListenUpdateOptions {
  elements?: Partial<Elements>;
  /**
   * @desc 边界元素，默认为 reference 和 popper 的所有可滚动父元素
   * @description Boundary element, defaults to all scrollable parent elements of reference and popper
   */
  boundary?: Boundary;
  update?: () => void;
  /**
   * @desc 是否为 boundary 注册 scroll 监听
   * @descEN Whether to register scroll listener for boundary
   * @default true
   */
  scroll?: boolean;
  /**
   * @desc 是否为 boundary 注册 resize 监听
   * @descEN Whether to register resize listener for boundary
   * @default true
   */
  resize?: boolean;
  /**
   * @desc 当布局导致 reference 或 popper 布局改变时，是否触发 update
   * @descEN Whether to trigger update when layout changes cause reference or popper layout to change
   * @default true
   */
  layout?: boolean;
}

export default function autoUpdate(options: ListenUpdateOptions) {
  const { boundary, scroll = true, resize = true, update, elements } = options;

  const mergedBoundary = boundary ? [...boundary] : getAllScrollElements(elements);

  // When update does not exist, do not register listener, instead of registering noop function
  if (update) {
    mergedBoundary.forEach((parent) => {
      scroll && parent.addEventListener('scroll', update, { passive: true });
      resize && parent.addEventListener('resize', update);
    });
  }

  return () => {
    if (update) {
      mergedBoundary.forEach((parent) => {
        scroll && parent.removeEventListener('scroll', update);
        resize && parent.removeEventListener('resize', update);
      });
    }
  };
}
