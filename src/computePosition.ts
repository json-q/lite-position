import computePopperCoords from './core/computePopperCoords';
import type { ElementRects, Elements, LitePositionOptions, Middleware, MiddlewareData } from './type';
import { getClipMinBoundaryClientRect } from './utils/boundary';
import { getAllScrollElements } from './utils/dom';
import getBoundingClientRect from './utils/getBoundingClientRect';

function getElementRects(reference: HTMLElement, popper: HTMLElement): ElementRects {
  return {
    reference: getBoundingClientRect(reference),
    popper: getBoundingClientRect(popper),
  };
}

export default function computePosition(reference: HTMLElement, popper: HTMLElement, opt: LitePositionOptions = {}) {
  if (!reference || !popper) {
    throw new Error('`reference` or `popper` is missing');
  }

  const { placement = 'bottom', middleware = [] } = opt;

  const elements: Elements = { reference, popper };
  let rects: ElementRects = getElementRects(reference, popper);
  const boundaryRect = getClipMinBoundaryClientRect(getAllScrollElements(elements));

  const validMiddleware = middleware.filter(Boolean) as Middleware[];

  let { x, y } = computePopperCoords(rects, placement);

  let statefulPlacement = placement;
  let middlewareData: MiddlewareData = {};

  for (let i = 0; i < validMiddleware.length; i++) {
    const { name, fn } = validMiddleware[i];

    const {
      x: nextX,
      y: nextY,
      data,
      reset,
    } = fn({
      x,
      y,
      initialPlacement: placement,
      placement: statefulPlacement,
      middlewareData,
      rects,
      elements: { reference, popper },
      boundaryRect,
    });

    x = nextX ?? x;
    y = nextY ?? y;

    middlewareData = {
      ...middlewareData,
      [name]: {
        ...middlewareData[name],
        ...data,
      },
    };

    if (reset) {
      if (typeof reset === 'object') {
        if (reset.placement) {
          statefulPlacement = reset.placement;
        }

        if (reset.rects) {
          rects = reset.rects === true ? getElementRects(reference, popper) : reset.rects;
        }

        ({ x, y } = computePopperCoords(rects, statefulPlacement));
      }

      i = -1;
    }
  }

  return {
    x,
    y,
    placement: statefulPlacement,
    middlewareData,
  };
}
