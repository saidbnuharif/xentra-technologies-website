"use client";

import { useRef, type ReactNode } from "react";
import { gsap, MEDIA, motion, useGSAP } from "@/components/motion/gsap";

/*
 * Mission & Vision — a gentle, one-time reveal. Each panel rises into
 * place, then its platinum back plate settles out from behind it to
 * its offset, so the depth builds as the row arrives. No looping motion.
 * Server markup is the finished frame (what reduced-motion and no-JS
 * visitors see). Hover depth is CSS (mission-vision.css).
 */
export function MissionVisionMotion({ children, className = "" }: { children: ReactNode; className?: string }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MEDIA.motion, () => {
        for (const panel of gsap.utils.toArray<HTMLElement>("[data-mv-panel]", el)) {
          // The whole panel rises (the surface's own transform is left to
          // the CSS hover transition, which would fight a GSAP tween).
          const plate = panel.querySelector("[data-mv-plate]");
          const tl = gsap.timeline({ scrollTrigger: { trigger: panel, start: motion.start, once: true } });
          tl.from(panel, { y: motion.rise, autoAlpha: 0, duration: motion.duration, ease: motion.ease, clearProps: "transform,opacity,visibility" })
            .from(plate, { x: -5, y: -5, autoAlpha: 0, duration: 0.8, ease: "power2.out", clearProps: "transform,opacity,visibility" }, 0.25);
        }
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} className={className}>
      {children}
    </div>
  );
}
