'use client';
import { useState, useRef, useEffect } from 'react';

function Collapse({ isOpen, children }: any) {
  const [height, setHeight] = useState(isOpen ? 'auto' : '0');
  const ref = useRef(null);

  useEffect(() => {
    setHeight(isOpen ? `${(ref as any).current.scrollHeight}px` : '0');
  }, [isOpen]);

  return (
    <div
      className={`merchi-collapse ${isOpen ? 'show' : ''}`}
      ref={ref}
      style={{ transition: 'height 0.35s ease', overflow: 'hidden', height }}
    >
      {children}
    </div>
  );
}

export default Collapse;
