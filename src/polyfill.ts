export type Raf = (callback: (timestamp: number) => void) => number;
export type Caf = (handle: number) => void;

const u = 'undefined',
  win = typeof window !== u ? window : ({} as any),
  p = typeof performance !== u ? performance : Date,
  now = () => p.now(),
  Caf = `cancelAnimationFrame`,
  Raf = `requestAnimationFrame`;

let raf: Raf = win[Raf]?.bind(win),
  caf: Caf = win[Caf]?.bind(win);

const vendors = ['webkit', 'ms', 'moz', 'o'];

if (!raf || !caf) {
  vendors.some((prefix) => {
    raf = win[`${prefix}RequestAnimationFrame`];
    caf = win[`${prefix}CancelAnimationFrame`] || win[`${prefix}CancelRequestAnimationFrame`];
    return !!raf && !!caf;
  });

  let lastTime = 0;
  raf = (callback: FrameRequestCallback) => {
    const curr = now(),
      next = Math.max(lastTime + 1000 / 60, curr);
    return setTimeout(() => {
      lastTime = next;
      callback(lastTime);
    }, next - curr) as any;
  };
  caf = (h) => clearTimeout(h);
}

export { raf, caf, now };
