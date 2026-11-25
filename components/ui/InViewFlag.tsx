"use client";

import { useEffect, useRef } from "react";

/**
 * Sets data-in-view="true" | "false" on its enclosing section while that
 * section is on screen. Lets CSS run decorative loops (e.g. the light
 * trails) only when visible, so off-screen sections cost nothing.
 * Renders an empty, hidden span.
 */
export function InViewFlag() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // The enclosing <section> (Section wraps its children in a Container).
    const target = ref.current?.closest<HTMLElement>("section") ?? ref.current?.parentElement;
    if (!target) return;
    const observer = new IntersectionObserver(([entry]) => {
      target.dataset.inView = String(entry.isIntersecting);
    });
    observer.observe(target);
    return () => {
      observer.disconnect();
      delete target.dataset.inView;
    };
  }, []);

  return <span ref={ref} hidden />;
}
