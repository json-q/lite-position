import type { Coords, Middleware } from '../type';
import getBoundingClientRect from '../utils/getBoundingClientRect';
import { splitPlacement } from '../utils/placement';

interface ArrowOptions {
  /**
   * @description 箭头元素
   * @descEN Arrow element
   */
  element?: HTMLElement | null;
}

const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

const arrow = (options: ArrowOptions): Middleware => ({
  name: 'arrow',
  options,
  fn: (state) => {
    const { placement, rects, x, y } = state;
    const { reference, popper } = rects;
    const { element: arrowElement } = options;

    if (!arrowElement) return {};

    const arrowRect = getBoundingClientRect(arrowElement);
    const [side, alignment = 'center'] = splitPlacement(placement);
    const isVertical = side === 'top' || side === 'bottom';
    const crossAxis = isVertical ? 'x' : 'y';
    const crossAxisPropKey = isVertical ? 'width' : 'height';

    // 调整 popper 坐标以容纳箭头
    const popperCoords: Coords = { x, y };

    if (isVertical) {
      popperCoords.y = side === 'top' ? popperCoords.y - arrowRect.height : popperCoords.y + arrowRect.height;
    } else {
      popperCoords.x = side === 'left' ? popperCoords.x - arrowRect.width : popperCoords.x + arrowRect.width;
    }

    // reference 中心相对于popper的位置
    const referenceCenter = {
      x: reference.x + reference.width / 2 - popperCoords.x,
      y: reference.y + reference.height / 2 - popperCoords.y,
    };

    let arrowCoords: Coords = { x: 0, y: 0 };
    switch (side) {
      case 'top':
        arrowCoords = {
          x: referenceCenter.x - arrowRect.width / 2,
          y: popper.height,
        };
        break;
      case 'bottom':
        arrowCoords = {
          x: referenceCenter.x - arrowRect.width / 2,
          y: -arrowRect.height,
        };
        break;
      case 'left':
        arrowCoords = {
          x: popper.width,
          y: referenceCenter.y - arrowRect.height / 2,
        };
        break;
      case 'right':
        arrowCoords = {
          x: -arrowRect.width,
          y: referenceCenter.y - arrowRect.height / 2,
        };
        break;
    }

    const minCross = 0;
    const maxCross = popper[crossAxisPropKey] - arrowRect[crossAxisPropKey];

    arrowCoords[crossAxis] = clamp(arrowCoords[crossAxis], minCross, maxCross);

    if (alignment !== 'center') {
      // reference 在交叉轴上的边界
      const referenceCrossStart = reference[crossAxis] - (isVertical ? popperCoords.x : popperCoords.y);
      const referenceCrossEnd = referenceCrossStart + reference[crossAxisPropKey];

      // popper 在交叉轴上的边界
      const popperCrossStart = 0;
      const popperCrossEnd = popper[crossAxisPropKey];

      let alignedPosition: number;

      if (alignment === 'start') {
        // 箭头不超出 reference 起始边界和 popper 边界
        alignedPosition = clamp(
          referenceCrossStart,
          popperCrossStart,
          Math.min(referenceCrossEnd - arrowRect[crossAxisPropKey], popperCrossEnd - arrowRect[crossAxisPropKey]),
        );
      } else {
        // 'end'
        alignedPosition = clamp(
          referenceCrossEnd - arrowRect[crossAxisPropKey],
          Math.max(referenceCrossStart, popperCrossStart),
          popperCrossEnd - arrowRect[crossAxisPropKey],
        );
      }

      arrowCoords[crossAxis] = alignedPosition;
    }

    return {
      ...popperCoords,
      data: {
        x: arrowCoords.x,
        y: arrowCoords.y,
        rect: arrowRect,
      },
    };
  },
});

export default arrow;
