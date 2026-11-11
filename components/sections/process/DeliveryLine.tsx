"use client";

import { useRef, type ReactNode } from "react";
import { gsap, MEDIA, ScrollTrigger, useGSAP } from "@/components/motion/gsap";

/*
 * Scroll-linked line for the software delivery track (vertical at every
 * size). [data-dl-fill] grows down [data-dl-track] as the list passes the
 * middle of the screen; each [data-dl-step] gets data-reached="true" once
 * the fill passes its [data-dl-node]. Styling lives in the server markup.
 * Reduced motion / no JS: no state is set — every step shows fully lit.
 */
export function DeliveryLine({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MEDIA.motion, () => {
        const q = gsap.utils.selector(el);
        const track = q("[data-dl-track]")[0];
        const fill = q("[data-dl-fill]")[0];
        const steps = q("[data-dl-step]");
        const nodes = q("[data-dl-node]");
        if (!track || !fill) return;

        let positions: number[] = [];
        const measure = () => {
          const t = track.getBoundingClientRect();
          positions = nodes.map((n) => {
            const r = n.getBoundingClientRect();
            return (r.top + r.height / 2 - t.top) / t.height;
          });
        };
        steps.forEach((s) => (s.dataset.reached = "false"));
        measure();

        gsap.fromTo(
          fill,
          { scaleY: 0, transformOrigin: "center top" },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: { trigger: track, start: "top 60%", end: "bottom 60%", scrub: 0.5, onRefresh: measure },
            onUpdate() {
              const p = this.progress();
              steps.forEach((s, i) => (s.dataset.reached = String(p >= positions[i] - 0.01)));
            },
          },
        );

        return () => steps.forEach((s) => delete s.dataset.reached);
      });
      document.fonts?.ready.then(() => ScrollTrigger.refresh());
      return () => mm.revert();
    },
    { scope: root },
  );

  return <div ref={root}>{children}</div>;
}
