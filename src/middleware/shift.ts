import type { Middleware } from '../type';
import { getClipMinBoundaryClientRect } from '../utils/boundary';
import { getAllScrollElements } from '../utils/dom';
import { splitPlacement } from '../utils/placement';
import rectToClientRect from '../utils/rectToClientRect';

const shift = (): Middleware => ({
  name: 'shift',
  options: {},
  fn: (state) => {
    const { placement, rects, x, y, elements } = state;

    const boundaryRect = getClipMinBoundaryClientRect(getAllScrollElements(elements));

    const { popper } = rects;
    const popperRect = rectToClientRect({ height: popper.height, width: popper.width, x, y });

    const [side] = splitPlacement(placement);

    // Calculate offset to keep popper within boundary on cross axis only
    let offsetX = 0;
    let offsetY = 0;

    // Only shift on cross axis to avoid interfering with flip
    switch (side) {
      case 'top':
      case 'bottom':
        //  only shift horizontally (cross axis)
        if (popperRect.left < boundaryRect.left) {
          offsetX = boundaryRect.left - popperRect.left;
        } else if (popperRect.right > boundaryRect.right) {
          offsetX = boundaryRect.right - popperRect.right;
        }
        break;
      case 'left':
      case 'right':
        // only shift vertically (cross axis)
        if (popperRect.top < boundaryRect.top) {
          offsetY = boundaryRect.top - popperRect.top;
        } else if (popperRect.bottom > boundaryRect.bottom) {
          offsetY = boundaryRect.bottom - popperRect.bottom;
        }
        break;
    }

    // Return shifted coordinates if needed
    if (offsetX !== 0 || offsetY !== 0) {
      return {
        x: x + offsetX,
        y: y + offsetY,
        data: {
          offsetX,
          offsetY,
        },
      };
    }

    return {};
  },
});

export default shift;
