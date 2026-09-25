"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";

/**
 * Animates its own height to whatever its content currently needs, so content
 * that swaps for something much shorter closes the page up instead of jumping.
 *
 * Height is a layout property, which is normally the wrong thing to animate;
 * this is the accordion case, where nothing on the compositor can stand in for
 * it. The inner padding and matching negative margin keep focus rings on edge
 * controls from being clipped by the overflow.
 */
export function AutoHeight({ children }: { children: ReactNode }) {
  const inner = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>();

  useLayoutEffect(() => {
    const node = inner.current;
    if (!node) return;
    const observer = new ResizeObserver(([entry]) => {
      setHeight(entry.borderBoxSize?.[0]?.blockSize ?? node.offsetHeight);
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      style={{ height }}
      className="-m-1 overflow-hidden transition-[height] duration-[260ms] ease-strong"
    >
      <div ref={inner} className="p-1">
        {children}
      </div>
    </div>
  );
}
