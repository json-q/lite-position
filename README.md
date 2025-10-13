An experimental lite position like popper.js

# Lite Position

This is an experimental package that contains some core functionalities of `popper.js` but with a smaller size.

> This is for my own learning and use. I don't guarantee continuous maintenance, so I don't recommend using it in your production environment. Thanks.:)

## Usage

**We only support `position: fixed`**

```js
import {
  shift,
  offset,
  flip,
  arrow,
  autoUpdate,
  computePosition,
} from "lite-position";

function updatePosition() {
  const { x, y } = computePosition(btnEl, tooltipEl, {
    placement: "top",
    middleware: [
      shift(),
      // arrow({ element: arrowEl }), // if you need
      // offset({ offset: 0 }), // if you need
      flip(),
    ],
  });
  Object.assign(tooltipEl.style, {
    left: `${x}px`,
    top: `${y}px`,
  });
}

updatePosition();

const cleanup = autoUpdate({
  elements: { reference: btnEl, popper: tooltipEl },
  update: () => requestAnimationFrame(updatePosition),
});

// when you want to remove listener
// cleanup()
```

We don't handle performance issues internally.

Recommended to use `requestAnimationFrame` when calling `update`, otherwise `autoUpdate({ update: updatePosition })` will be very laggy when scrolling quickly.

Recommended to add `will-change` to the popper element.

## Polyfill

If you need to support older browsers and can't use `requestAnimationFrame`, you can `import { raf } from "lite-position/polyfill"`

We provide the following API to ensure compatibility

- `raf`: requestAnimationFrame
- `caf`: cancelAnimationFrame
- `now`: performance.now
