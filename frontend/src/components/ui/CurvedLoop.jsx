import { useRef, useEffect, useState, useMemo, useId } from 'react';

const CurvedLoop = ({
  marqueeText = '',
  speed = 0,
  className,
  curveAmount = 40, // slightly visible curve
  direction = 'left',
  interactive = true
}) => {
  const text = useMemo(() => {
    const hasTrailing = /\s|\u00A0$/.test(marqueeText);
    return (hasTrailing ? marqueeText.replace(/\s+$/, '') : marqueeText) + '\u00A0';
  }, [marqueeText]);

  const measureRef = useRef(null);
  const textPathRef = useRef(null);


  const [spacing, setSpacing] = useState(0);
  const [offset, setOffset] = useState(0);

  const uid = useId();
  const pathId = `curve-${uid}`;

  // ✅ Smaller, proportional curve path
  const pathD = `M-50,60 Q400,${60 + curveAmount} 850,60`;

  const dragRef = useRef(false);
  const lastXRef = useRef(0);
  const dirRef = useRef(direction);
  const velRef = useRef(0);

  const totalText = spacing
    ? Array(Math.ceil(1200 / spacing) + 2)
        .fill(text)
        .join('')
    : text;

  const ready = spacing > 0;
  useEffect(() => {
  const updateSpacing = () => {
    if (measureRef.current) {
      const length = measureRef.current.getBBox().width;
      setSpacing(length);
    }
  };

  updateSpacing();
  window.addEventListener("resize", updateSpacing);

   return () => window.removeEventListener("resize", updateSpacing);
  }, [text]);

  useEffect(() => {
    if (measureRef.current) {
      const length = measureRef.current.getBBox().width;
      setSpacing(length);
    }
  }, [text]);

  // Initial offset
  useEffect(() => {
    if (!spacing) return;
    if (textPathRef.current) {
      const initial = -spacing;
      textPathRef.current.setAttribute('startOffset', initial + 'px');
      setOffset(initial);
    }
  }, [spacing]);

  // Animation loop
  useEffect(() => {
    if (!spacing || !ready) return;

    let frame = 0;

    const step = () => {
      if (!dragRef.current && textPathRef.current) {
        const delta = dirRef.current === 'right' ? speed : -speed;

        const currentOffset = parseFloat(
          textPathRef.current.getAttribute('startOffset') || '0'
        );

        let newOffset = currentOffset + delta;

        const wrapPoint = spacing;

        if (newOffset <= -wrapPoint) newOffset += wrapPoint;
        if (newOffset > 0) newOffset -= wrapPoint;

        textPathRef.current.setAttribute('startOffset', newOffset + 'px');
        setOffset(newOffset);
      }

      frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [spacing, speed, ready]);

  // Drag interaction
  const onPointerDown = (e) => {
    if (!interactive) return;
    dragRef.current = true;
    lastXRef.current = e.clientX;
    velRef.current = 0;
    e.target.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (!interactive || !dragRef.current || !textPathRef.current) return;

    const dx = e.clientX - lastXRef.current;
    lastXRef.current = e.clientX;
    velRef.current = dx;

    const currentOffset = parseFloat(
      textPathRef.current.getAttribute('startOffset') || '0'
    );

    let newOffset = currentOffset + dx;

    const wrapPoint = spacing;

    if (newOffset <= -wrapPoint) newOffset += wrapPoint;
    if (newOffset > 0) newOffset -= wrapPoint;

    textPathRef.current.setAttribute('startOffset', newOffset + 'px');
    setOffset(newOffset);
  };

  const endDrag = () => {
    if (!interactive) return;
    dragRef.current = false;
    dirRef.current = velRef.current > 0 ? 'right' : 'left';
  };

  const cursorStyle = interactive
    ? dragRef.current
      ? 'grabbing'
      : 'grab'
    : 'auto';

  return (
    <div
      className="w-full h-6 py-2 overflow-hidden flex items-center justify-center"
      style={{ visibility: ready ? 'visible' : 'hidden', cursor: cursorStyle }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerLeave={endDrag}
    >
      <svg
        className="select-none w-full overflow-visible block font-normal uppercase"
        viewBox="0 0 800 112"
      >
        {/* Hidden measurement */}
        <text
          ref={measureRef}
          xmlSpace="preserve"
          style={{
            visibility: 'hidden',
            opacity: 0,
            fontSize: "clamp(10px, 2.5vw, 10px)"
          }}
        >
          {text}
        </text>

        <defs>
          <path id={pathId} d={pathD} fill="none" stroke="transparent" />
        </defs>

        {ready && (
          <text
             xmlSpace="preserve"
             className={className ?? 'fill-black'}
             style={{ fontSize: "clamp(10px, 2vw, 10px)" }}
           >
            <textPath
              ref={textPathRef}
              href={`#${pathId}`}
              startOffset={offset + 'px'}
            >
              {totalText}
            </textPath>
          </text>
        )}
      </svg>
    </div>
  );
};

export default CurvedLoop;