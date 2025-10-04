import type { Coords, Middleware } from '../type';
import getBoundingClientRect from '../utils/getBoundingClientRect';

interface ArrowOptions {
  /**
   * @description 箭头元素
   * @descEN Arrow element
   */
  element?: HTMLElement | null;
}

const arrow = (options: ArrowOptions): Middleware => ({
  name: 'arrow',
  options,
  fn: (state) => {
    const { placement, rects, x, y } = state;
    const { popper } = rects;
    const { element: arrowElement } = options;

    if (!arrowElement) return {};
    const arrow = getBoundingClientRect(arrowElement);

    const [side, alignment = 'center'] = placement.split('-');

    const isVertical = side === 'top' || side === 'bottom';
    const alignmentAxis = isVertical ? 'x' : 'y';
    const commonX = popper.x + popper.width / 2 - arrow.width / 2;
    const commonY = popper.y + popper.height / 2 - arrow.height / 2;
    const alignRectKey = alignmentAxis === 'x' ? 'width' : 'height';
    const differAlignDistance = popper[alignRectKey] / 2 - arrow[alignRectKey] / 2;

    // calc arrow coords
    let coords: Coords = { x: 0, y: 0 };
    switch (side) {
      case 'top':
        coords = { x: commonX, y: popper.y + popper.height };
        break;
      case 'bottom':
        coords = { x: commonX, y: popper.y - arrow.height };
        break;
      case 'left':
        coords = { x: popper.x + popper.width, y: commonY };
        break;
      case 'right':
        coords = { x: popper.x - arrow.width, y: commonY };
        break;
      default:
        coords = { x: popper.x, y: popper.y };
    }

    switch (alignment) {
      case 'start':
        coords[alignmentAxis] = isVertical ? popper.x : popper.y;
        break;
      case 'end':
        coords[alignmentAxis] = isVertical ? commonX + differAlignDistance : commonY + differAlignDistance;
        break;
    }

    // recalculate popper coords
    const popperCoords: Coords = { x, y };

    if (isVertical) {
      popperCoords.y = side === 'top' ? popperCoords.y - arrow.height : popperCoords.y + arrow.height;
    } else {
      popperCoords.x = side === 'left' ? popperCoords.x - arrow.width : popperCoords.x + arrow.width;
    }

    return {
      ...popperCoords,
      data: {
        ...coords,
        rect: arrow,
      },
    };
  },
});

export default arrow;
