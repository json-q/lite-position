import type { ClientRectObject } from '../type';

// source code & update from https://github.com/floating-ui/floating-ui/blob/v2.x/src/dom-utils/getBoundingClientRect.js
export default function getBoundingClientRect(element: Element): ClientRectObject {
  const clientRect = element.getBoundingClientRect();
  let scaleX = 1;
  let scaleY = 1;

  if (element instanceof HTMLElement) {
    scaleX = element.offsetWidth > 0 ? Math.round(clientRect.width) / element.offsetWidth || 1 : 1;
    scaleY = element.offsetHeight > 0 ? Math.round(clientRect.height) / element.offsetHeight || 1 : 1;
  }

  const x = clientRect.left / scaleX;
  const y = clientRect.top / scaleY;
  const width = clientRect.width / scaleX;
  const height = clientRect.height / scaleY;

  return {
    width,
    height,
    top: y,
    right: x + width,
    bottom: y + height,
    left: x,
    x,
    y,
  };
}
