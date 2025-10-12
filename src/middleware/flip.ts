import type { Boundary, ClientRectObject, Middleware, Side } from '../type';
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
    console.log(x, y);

    const { popper } = rects;
    const popperRect = rectToClientRect({
      height: popper.height,
      width: popper.width,
      x,
      y,
    });

    // Check if current placement overflows
    const isOverflow = detectIsOverflow(side, { boundary: boundaryRect, popper: popperRect });

    // If no overflow, no need to flip
    if (!isOverflow) return {};

    // If overflow, flip first
    const flippedPlacement = getOppositePlacement(placement);
    const [oppositeSide] = splitPlacement(flippedPlacement);

    // Check if overflow still occurs after flipping
    const isFlippedOverflow = detectIsOverflow(oppositeSide, { boundary: boundaryRect, popper: popperRect });

    // If still overflow after flipping, keep original position
    if (isFlippedOverflow) return {};

    // Return flipped position
    return {
      reset: {
        rects: true,
        placement: flippedPlacement,
      },
    };
  },
});

export default flip;

interface DetectOverflowRects {
  popper: ClientRectObject;
  boundary: ClientRectObject;
}
function detectIsOverflow(side: Side, rects: DetectOverflowRects) {
  const { popper, boundary } = rects;
  let isOverflow = false;
  switch (side) {
    case 'top':
      isOverflow = popper.top < boundary.top;
      break;
    case 'bottom':
      isOverflow = popper.bottom > boundary.bottom;
      break;
    case 'left':
      isOverflow = popper.left < boundary.left;
      break;
    case 'right':
      isOverflow = popper.right > boundary.right;
      break;
  }
  return isOverflow;
}
