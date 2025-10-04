import rectToClientRect from 'lite-position/utils/rectToClientRect';
import type { Middleware } from '../type';

const shift = (): Middleware => ({
  name: 'shift',
  options: {},
  fn: (state) => {
    const { rects, x, y, middlewareData } = state;

    if (!middlewareData.flip?.boundaryRect) return {};
    const boundaryRect = { ...middlewareData.flip.boundaryRect };

    const { popper } = rects;
    const popperRect = rectToClientRect({
      height: popper.height,
      width: popper.width,
      x,
      y,
    });

    // Calculate offset to keep popper within boundary
    let offsetX = 0;
    let offsetY = 0;

    // Check overflow and calculate shifts
    if (popperRect.left < boundaryRect.left) {
      offsetX = boundaryRect.left - popperRect.left;
    } else if (popperRect.right > boundaryRect.right) {
      offsetX = boundaryRect.right - popperRect.right;
    }

    if (popperRect.top < boundaryRect.top) {
      offsetY = boundaryRect.top - popperRect.top;
    } else if (popperRect.bottom > boundaryRect.bottom) {
      offsetY = boundaryRect.bottom - popperRect.bottom;
    }

    // Return shifted coordinates if needed
    if (offsetX !== 0 || offsetY !== 0) {
      return {
        x: x + offsetX,
        y: y + offsetY,
      };
    }

    return {};
  },
});

export default shift;
