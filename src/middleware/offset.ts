import { splitPlacement } from 'lite-position/utils/placement';
import type { Middleware } from '../type';

interface OffsetOptions {
  /**
   * @description 偏移量
   * @descEN Offset value
   */
  offset?: number | [mainAxis: number, crossAxis: number];
}

const offset = (options: OffsetOptions = {}): Middleware => ({
  name: 'offset',
  options,
  fn: (state) => {
    const { placement, x, y } = state;
    const { offset: offsetValue = 0 } = options;

    if (offsetValue === 0) return {};

    // 处理数字偏移量
    if (typeof offsetValue === 'number') {
      const [side] = splitPlacement(placement);

      let offsetX = 0;
      let offsetY = 0;

      switch (side) {
        case 'top':
          offsetY = -offsetValue;
          break;
        case 'bottom':
          offsetY = offsetValue;
          break;
        case 'left':
          offsetX = -offsetValue;
          break;
        case 'right':
          offsetX = offsetValue;
          break;
      }

      return {
        x: x + offsetX,
        y: y + offsetY,
        data: {
          offsetX,
          offsetY,
        },
      };
    }

    if (Array.isArray(offsetValue)) {
      const [mainAxisOffset, crossAxisOffset] = offsetValue;
      const [side] = splitPlacement(placement);

      let offsetX = 0;
      let offsetY = 0;

      switch (side) {
        case 'top':
          offsetY = -mainAxisOffset;
          break;
        case 'bottom':
          offsetY = mainAxisOffset;
          break;
        case 'left':
          offsetX = -mainAxisOffset;
          break;
        case 'right':
          offsetX = mainAxisOffset;
          break;
      }

      switch (side) {
        case 'top':
        case 'bottom':
          offsetX += crossAxisOffset;
          break;
        case 'left':
        case 'right':
          offsetY += crossAxisOffset;
          break;
      }

      return {
        x: x + offsetX,
        y: y + offsetY,
        data: {
          offsetX,
          offsetY,
        },
      };
    }

    return {};
  },
});

export default offset;
