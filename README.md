An experimental lite position like popper.js

# Lite Position

This is an experimental package that contains some core functionalities of `popper.js` but with a smaller size. Gzip is less than 3kb

> This is for my own learning and use. I don't guarantee continuous maintenance, so I don't recommend using it in your production environment. Thanks. :)

## Usage

```bash
npm install lite-position
```

**Only support `position: fixed`**. Recommended to set the middleware in the order of `shift`, `arrow`, `offset`, `flip`

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
      flip(), // only detect nearest element/window
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

- Use `requestAnimationFrame` when calling `update`
- Add `will-change` to the popper element.

## Polyfill

`lite-position` only supports modern browsers by default. If you need to support IE11, please use `core-js` to polyfill `lite-position`

```js
includes: [/node_modules[\\/]lite-position[\\/]/];
```

We provide the following API to ensure compatibility, you can `import { xxx } from "lite-position"`

- `raf`: requestAnimationFrame
- `caf`: cancelAnimationFrame
- `now`: performance.now
