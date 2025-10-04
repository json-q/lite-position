import type { Boundary, ClientRectObject, Middleware, MiddlewareReturn, Side } from '../type';
import { getClipMinBoundaryClientRect } from '../utils/boundary';
import { getAllScrollElements } from '../utils/dom';
import { getOppositePlacement, splitPlacement } from '../utils/placement';
import rectToClientRect from '../utils/rectToClientRect';

interface FlipOptions {
  /**
   * @description 边缘检测的节点
   * @descEN Boundary elements for edge detection
   */
  boundary?: Boundary;
}

const flip = (options: FlipOptions = {}): Middleware => ({
  name: 'flip',
  options,
  fn: (state) => {
    const { placement, rects, x, y, elements } = state;
    const { boundary } = options;

    const mergedBoundary = boundary ? [...boundary] : getAllScrollElements(elements);

    const [side] = splitPlacement(placement);

    // Get minimum boundary
    const boundaryRect = getClipMinBoundaryClientRect(mergedBoundary);
    // Share minimum boundary rect (shift detection)
    const baseShared: MiddlewareReturn = {
      data: {
        boundaryRect,
      },
    };

    const { popper } = rects;
    const popperRect = rectToClientRect({
      height: popper.height,
      width: popper.width,
      x,
      y,
    });

    // Check if current placement overflows
    const isOverflow = detectIsOverflow(side, popperRect, boundaryRect);
    // If no overflow, no need to flip
    if (!isOverflow) return { ...baseShared };

    // If overflow, flip first
    const flippedPlacement = getOppositePlacement(placement);
    const [oppositeSide] = splitPlacement(flippedPlacement);

    // Check if overflow still occurs after flipping
    const isFlippedOverflow = detectIsOverflow(oppositeSide, popperRect, boundaryRect);

    // If still overflow after flipping, keep original position
    if (isFlippedOverflow) return { ...baseShared };

    // Return flipped position
    return {
      ...baseShared,
      reset: {
        rects: true,
        placement: flippedPlacement,
      },
    };
  },
});

export default flip;

function detectIsOverflow(side: Side, popperRect: ClientRectObject, boundaryRect: ClientRectObject) {
  let isOverflow = false;
  switch (side) {
    case 'top':
      isOverflow = popperRect.top < boundaryRect.top;
      break;
    case 'bottom':
      isOverflow = popperRect.bottom > boundaryRect.bottom;
      break;
    case 'left':
      isOverflow = popperRect.left < boundaryRect.left;
      break;
    case 'right':
      isOverflow = popperRect.right > boundaryRect.right;
      break;
  }
  return isOverflow;
}
