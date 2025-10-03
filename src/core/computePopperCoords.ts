import type { Coords, ElementRects, Placement } from '../type';

export default function computePopperCoords(rects: ElementRects, placement: Placement): Coords {
  const { reference, popper } = rects;

  const [side, alignment = 'center'] = placement.split('-');

  const isVertical = side === 'top' || side === 'bottom';
  const alignmentAxis = isVertical ? 'x' : 'y';
  const alignRectKey = alignmentAxis === 'x' ? 'width' : 'height';
  // Position popper at reference center point, align popper center with reference center, then offset for edge alignment
  const commonX = reference.x + reference.width / 2 - popper.width / 2;
  const commonY = reference.y + reference.height / 2 - popper.height / 2;
  // Distance between popper center and reference center (calculated based on main axis direction x/y)
  const differAlignDistance = reference[alignRectKey] / 2 - popper[alignRectKey] / 2;

  let coords: Coords;
  switch (side) {
    case 'top':
      coords = { x: commonX, y: reference.y - popper.height };
      break;
    case 'bottom':
      coords = { x: commonX, y: reference.y + reference.height };
      break;
    case 'right':
      coords = { x: reference.x + reference.width, y: commonY };
      break;
    case 'left':
      coords = { x: reference.x - popper.width, y: commonY };
      break;
    default:
      coords = { x: reference.x, y: reference.y };
  }

  switch (alignment) {
    case 'start':
      // Offset by half the difference in width/height
      coords[alignmentAxis] -= differAlignDistance;
      break;
    case 'end':
      coords[alignmentAxis] += differAlignDistance;
      break;
    default:
      break;
  }

  return coords;
}
