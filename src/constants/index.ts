import type { ClientRectObject, Side } from '../type';

export const EMPTYRect: ClientRectObject = {
  width: 0,
  height: 0,
  x: 0,
  y: 0,
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
};

export const FLIP_SIDES: Record<Side, Side> = {
  top: 'bottom',
  right: 'left',
  bottom: 'top',
  left: 'right',
};
