import type { ClientRectObject, Rect } from '../type';

export default function rectToClientRect(rect: Rect): ClientRectObject {
  const { x, y, width, height } = rect;
  return {
    width,
    height,
    top: y,
    left: x,
    right: x + width,
    bottom: y + height,
    x,
    y,
  };
}
