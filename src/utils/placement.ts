import { FLIP_SIDES } from '../constants';
import type { Alignment, Placement, Side } from '../type';

export function splitPlacement(placement: Placement): [Side, Alignment] {
  return placement.split('-') as [Side, Alignment];
}

export function getOppositePlacement(placement: Placement): Placement {
  const [side, align] = splitPlacement(placement);
  const oppositeSide = FLIP_SIDES[side];

  return align ? `${oppositeSide}-${align}` : oppositeSide;
}
