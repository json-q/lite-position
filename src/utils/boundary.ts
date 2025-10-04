import { EMPTYRect } from '../constants';
import type { ClientRectObject } from '../type';
import getBoundingClientRect from './getBoundingClientRect';
import rectToClientRect from './rectToClientRect';

export function getClipMinBoundaryClientRect(boundary: Array<Element | Window>) {
  const clipBoundary = boundary.map((el) => getInnerBoundingClientRect(el));

  const clipRect = clipBoundary.reduce((accRect, rect) => {
    accRect.top = Math.max(rect.top, accRect.top);
    accRect.right = Math.min(rect.right, accRect.right);
    accRect.bottom = Math.min(rect.bottom, accRect.bottom);
    accRect.left = Math.max(rect.left, accRect.left);

    return accRect;
  }, clipBoundary[0]);

  return rectToClientRect({
    width: clipRect.right - clipRect.left,
    height: clipRect.bottom - clipRect.top,
    x: clipRect.left,
    y: clipRect.top,
  });
}

function getInnerBoundingClientRect(element: Element | Window): ClientRectObject {
  const rect = { ...EMPTYRect };

  if (element instanceof Window) {
    rect.width = element.document.documentElement.clientWidth;
    rect.height = element.document.documentElement.clientHeight;
    rect.x = element.visualViewport?.offsetLeft || 0;
    rect.y = element.visualViewport?.offsetTop || 0;
  } else {
    const clientRect = getBoundingClientRect(element);
    const top = clientRect.top + element.clientTop;
    const left = clientRect.left + element.clientLeft;
    rect.width = element.clientWidth;
    rect.height = element.clientHeight;
    rect.x = left;
    rect.y = top;
  }

  return rectToClientRect(rect);
}
