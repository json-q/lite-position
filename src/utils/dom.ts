import type { Boundary, Elements } from '../type';

export function getWin(ele: Element) {
  return ele.ownerDocument.defaultView || window;
}

export function isScrollElement(element: HTMLElement): boolean {
  const { overflow, overflowX, overflowY, display } = getWin(element).getComputedStyle(element);
  // hidden clip 虽然隐藏了滚动条，但仍是滚动容器，其中 hidden 可以使用 js 去操控滚动
  // display: contents 会使元素自身不生成任何盒子，即该元素本身在布局中不存在，因此 contents 的元素无法视为滚动容器
  return /auto|scroll|overlay|hidden|clip/.test(overflow + overflowY + overflowX) && !['contents'].includes(display);
}

export const collectScrollElements = (element?: HTMLElement): HTMLElement[] => {
  if (!element) return [];

  const scrollParents: HTMLElement[] = [];
  let currentParent = element.parentElement;

  while (currentParent) {
    if (isScrollElement(currentParent)) {
      scrollParents.push(currentParent);
    }
    currentParent = currentParent.parentElement;
  }

  return scrollParents;
};

export const getAllScrollElements = (elements: Partial<Elements> = {}): Boundary => {
  const scrollElements = [
    ...collectScrollElements(elements.reference),
    ...collectScrollElements(elements.popper),
    elements.popper && getWin(elements.popper),
  ].filter(Boolean) as Boundary;
  return [...new Map(scrollElements.map((element) => [element, element])).values()];
};
