import { EMPTYRect } from '../constants';
import type { ClientRectObject } from '../type';
import getBoundingClientRect from './getBoundingClientRect';
import rectToClientRect from './rectToClientRect';

export function getClipBoundaryClientRect(boundary: Element | Window) {
  const rect = getInnerBoundingClientRect(boundary);
  return rectToClientRect({
    width: Math.max(0, rect.right - rect.left),
    height: Math.max(0, rect.bottom - rect.top),
    x: rect.left,
    y: rect.top,
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
