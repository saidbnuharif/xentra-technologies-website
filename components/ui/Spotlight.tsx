"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Cursor-responsive light for glass cards (shared design-system piece).
 * One pointer listener on the wrapper sets --mx / --my (px) on whichever
 * [data-spotlight] card is under the cursor; the card's CSS paints a soft
 * radial light there (see `spotlight` classes at the call site).
 * Desktop fine pointer and motion allowed only; elsewhere it does nothing.
 */
export function Spotlight({ children, className = "" }: { children: ReactNode; className?: string }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const media = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    if (!media.matches) return;
    let frame = 0;
    let last: PointerEvent | null = null;
    const apply = () => {
      frame = 0;
      if (!last) return;
      const card = (last.target as HTMLElement).closest<HTMLElement>("[data-spotlight]");
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${last.clientX - r.left}px`);
      card.style.setProperty("--my", `${last.clientY - r.top}px`);
    };
    const onMove = (event: PointerEvent) => {
      last = event;
      if (!frame) frame = requestAnimationFrame(apply);
    };
    el.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div ref={root} className={className}>
      {children}
    </div>
  );
}
