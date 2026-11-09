"use client";

import { useState, useRef, useLayoutEffect } from "react";

// Teks 1 baris yang otomatis mengecil biar muat di lebar kontainernya
export default function FitText({
  children,
  maxSize,
  minSize = 12,
  className = "",
}: {
  children: string;
  maxSize: number;
  minSize?: number;
  className?: string;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [size, setSize] = useState(maxSize);

  useLayoutEffect(() => {
    const box = boxRef.current;
    const text = textRef.current;
    if (!box || !text) return;

    const fit = () => {
      const available = box.clientWidth;
      const currentWidth = text.offsetWidth;
      if (!available || !currentWidth) return;
      // lebar teks per 1px font-size -> hitung ukuran ideal
      const widthPerPx = currentWidth / size;
      const ideal = Math.floor(available / widthPerPx);
      const next = Math.max(minSize, Math.min(maxSize, ideal));
      if (next !== size) setSize(next);
    };

    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(box);
    // font mincho bisa telat load -> ukur ulang setelah siap
    if (document.fonts?.ready) document.fonts.ready.then(fit);
    return () => ro.disconnect();
  }, [children, size, maxSize, minSize]);

  return (
    <div ref={boxRef} className="w-full text-center overflow-hidden">
      <span
        ref={textRef}
        className={`inline-block whitespace-nowrap ${className}`}
        style={{ fontSize: size, lineHeight: 1.2 }}
      >
        {children}
      </span>
    </div>
  );
}
