import { autoUpdate, computedPosition, type Placement } from 'lite-position';
import * as React from 'react';
import { createPortal } from 'react-dom';
import { useTransitionState } from 'react-transition-state';
import Box from '../../components/box';
import Button from '../../components/button';
import ScrollBox from '../../components/scroll-box';
import './style.css';
import flip from 'lite-position/middleware/flip';
import shift from 'lite-position/middleware/shift';

export const placements: Placement[] = [
  'top',
  'right',
  'bottom',
  'left',
  'top-start',
  'top-end',
  'right-start',
  'right-end',
  'bottom-start',
  'bottom-end',
  'left-start',
  'left-end',
];

export default function Demo() {
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
      const data = computedPosition(referenceEl, popperEl, {
        placement: placement,
        middleware: [flip(), shift()],
      });
      console.log(data);

      popperEl.style.transform = `translate(${data.x}px, ${data.y}px)`;
    };

    handlePopperStyle();

    cleanup.current = autoUpdate({
      update: handlePopperStyle,
      elements: { reference: referenceEl, popper: popperEl },
    });

    return () => cleanup.current?.();
  }, [referenceEl, popperEl, placement]);

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
      </div>

      <ScrollBox ref={scrollBoxRef}>
        <Button ref={setReferenceEl} onClick={() => toggle()}>
          reference
        </Button>
      </ScrollBox>

      {isMounted &&
        createPortal(
          <div ref={setPopperEl} style={{ position: 'fixed', left: 0, top: 0, minWidth: 'max-content' }}>
            <div className={`transition-apply ${status}`}>
              <Box>Popper</Box>
              {showArrow && <div className="arrow" ref={setArrowEl} style={{ position: 'fixed', top: 0, left: 0 }} />}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
