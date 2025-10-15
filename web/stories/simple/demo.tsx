import { arrow, autoUpdate, computePosition, flip, type Placement, shift } from 'lite-position';
import * as React from 'react';
import { createPortal } from 'react-dom';
import { useTransitionState } from 'react-transition-state';
import Box from '../../components/box';
import Button from '../../components/button';
import { placements } from '../../util';
import '../example/style.css';

const positionStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  bottom: 'auto',
  right: 'auto',
};

export default function Demo() {
  const cleanup = React.useRef<() => void>(null);

  const [referenceEl, setReferenceEl] = React.useState<HTMLButtonElement | null>(null);
  const [popperEl, setPopperEl] = React.useState<HTMLDivElement | null>(null);
  const [arrowEl, setArrowEl] = React.useState<HTMLDivElement | null>(null);

  const [placement, setPlacement] = React.useState<Placement>('top');

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

      const data = computePosition(referenceEl, popperEl, {
        placement: placement,
        middleware: [shift(), arrow({ element: arrowEl }), flip()],
      });
      popperEl.style.transform = `translate(${data.x}px, ${data.y}px)`;

      if (arrowEl) {
        arrowEl.style.top = `${data.middlewareData.arrow?.y}px`;
        arrowEl.style.left = `${data.middlewareData.arrow?.x}px`;
      }
    };

    handlePopperStyle();

    cleanup.current = autoUpdate({
      update: () => requestAnimationFrame(handlePopperStyle),
      elements: { reference: referenceEl, popper: popperEl },
    });

    return () => cleanup.current?.();
  }, [referenceEl, popperEl, placement, arrowEl]);

  const onChangePlacement = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPlacement(e.target.value as Placement);
  };

  return (
    <>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <select value={placement} onChange={onChangePlacement}>
          {placements.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>

        <Button ref={setReferenceEl} onClick={() => toggle()}>
          reference
        </Button>
      </div>

      {isMounted &&
        createPortal(
          <div ref={setPopperEl} style={{ ...positionStyle, minWidth: 'max-content', willChange: 'transform' }}>
            <div className={`transition-apply ${status}`}>
              <Box>Popper</Box>
              <div className="arrow" ref={setArrowEl} style={{ ...positionStyle, willChange: 'top,left' }} />
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
