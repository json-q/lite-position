import type { Placement } from 'lite-position';
import { arrow, autoUpdate, computePosition, flip, offset, shift } from 'lite-position';
import * as React from 'react';
import { createPortal } from 'react-dom';
import { useTransitionState } from 'react-transition-state';
import Box from '../../components/box';
import Button from '../../components/button';
import ScrollBox from '../../components/scroll-box';
import { placements } from '../../util';
import './style.css';

const positionStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  bottom: 'auto',
  right: 'auto',
};

export default function Demo() {
  const [offsetNum, setOffsetNum] = React.useState(0);
  const [showArrow, setShowArrow] = React.useState(false);
  const [placement, setPlacement] = React.useState<Placement>('top');

  const scrollBoxRef = React.useRef<HTMLDivElement>(null);
  const cleanup = React.useRef<() => void>(null);

  const [referenceEl, setReferenceEl] = React.useState<HTMLButtonElement | null>(null);
  const [popperEl, setPopperEl] = React.useState<HTMLDivElement | null>(null);
  const [arrowEl, setArrowEl] = React.useState<HTMLDivElement | null>(null);

  const [{ status, isMounted }, toggle] = useTransitionState({
    timeout: 150,
    preEnter: true,
    initialEntered: false,
    mountOnEnter: true,
    unmountOnExit: true,
  });

  React.useEffect(() => {
    cleanup.current?.();
    if (!referenceEl || !popperEl) return;

    const handlePopperStyle = () => {
      popperEl.style.transform = 'translate(0, 0)';

      const { x, y, middlewareData } = computePosition(referenceEl, popperEl, {
        placement: placement,
        middleware: [shift(), arrow({ element: arrowEl }), offset({ offset: offsetNum }), flip()],
      });
      popperEl.style.transform = `translate(${x}px, ${y}px)`;

      if (arrowEl) {
        arrowEl.style.top = `${middlewareData.arrow?.y}px`;
        arrowEl.style.left = `${middlewareData.arrow?.x}px`;
      }
    };

    handlePopperStyle();

    cleanup.current = autoUpdate({
      update: () => requestAnimationFrame(handlePopperStyle),
      elements: { reference: referenceEl, popper: popperEl },
    });

    return () => cleanup.current?.();
  }, [referenceEl, popperEl, placement, arrowEl, offsetNum]);

  const onChangePlacement = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPlacement(e.target.value as Placement);
  };

  return (
    <>
      <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
        <select value={placement} onChange={onChangePlacement}>
          {placements.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
        <label htmlFor="arrow">
          <input type="checkbox" checked={showArrow} id="arrow" onChange={(e) => setShowArrow(e.target.checked)} />
          <span style={{ fontSize: 14 }}>ShowArrow</span>
        </label>

        <input type="number" value={offsetNum} onChange={(e) => setOffsetNum(Number(e.target.value))} />
      </div>

      <ScrollBox ref={scrollBoxRef}>
        <Button ref={setReferenceEl} onClick={() => toggle()}>
          reference
        </Button>
      </ScrollBox>

      {isMounted &&
        createPortal(
          <div ref={setPopperEl} style={{ ...positionStyle, minWidth: 'max-content', willChange: 'transform' }}>
            <div className={`transition-apply ${status}`}>
              <Box>Popper</Box>
              {showArrow && (
                <div className="arrow" ref={setArrowEl} style={{ ...positionStyle, willChange: 'top,left' }} />
              )}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
