"use client";

import { useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/components/motion/gsap";

/*
 * Entrance for the hero visual. Owns no content.
 * Sequence: glow + orbits settle → centre appears → connectors draw outward
 * → the four domains arrive in order → the static glow remains.
 *
 * Replay: one ScrollTrigger watches the visual itself.
 *  - comes into view (initial load, or scrolling back from either side)
 *    → the timeline restarts from the beginning;
 *  - leaves the viewport completely → the timeline resets to its start
 *    (hidden) state, ready to replay. Nothing restarts while it stays
 *    visible, because enter callbacks only fire on crossing a boundary.
 *
 * Reduced motion: nothing runs (and hero-visual.css never hides anything),
 * so the finished composition shows at once. The headline and buttons are
 * outside this component and never wait on it.
 */
export function HeroVisualMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const q = gsap.utils.selector(el);
        // GSAP now owns the visual: switch off the CSS timed fallback, which
        // would otherwise pin everything visible after 3.2s and break replays.
        el.dataset.hvReady = "true";

        const tl = gsap
          .timeline({ paused: true, delay: 0.25, defaults: { ease: "power3.out" } })
          .fromTo(q("[data-hv-glow]"), { opacity: 0 }, { opacity: 1, duration: 1.4 }, 0)
          .fromTo(
            q("[data-hv-ring]"),
            { opacity: 0, scale: 0.94 },
            { opacity: 1, scale: 1, duration: 1, stagger: 0.12 },
            0,
          )
          .fromTo(
            q("[data-hv-center]"),
            { opacity: 0, scale: 0.88 },
            { opacity: 1, scale: 1, duration: 0.7 },
            0.1,
          )
          // Paths are normalised to pathLength=1, so the offset runs 1 → 0.
          // autoRound must be off: GSAP rounds px values to whole numbers by
          // default, which made the lines snap instead of draw.
          .fromTo(
            q("[data-hv-line]"),
            { strokeDashoffset: "1px" },
            {
              strokeDashoffset: "0px",
              autoRound: false,
              duration: 0.7,
              stagger: 0.12,
              ease: "power2.inOut",
            },
            0.55,
          )
          .fromTo(
            q("[data-hv-domain]"),
            { opacity: 0, y: 12 },
            { opacity: 1, y: 0, duration: 0.6, stagger: 0.15 },
            0.95,
          );

        const visual = q("[data-hero-visual]")[0] ?? el;
        const replay = () => tl.restart(true); // include the short lead-in delay
        const reset = () => tl.pause(0); // back to the hidden start state

        ScrollTrigger.create({
          trigger: visual,
          start: "top bottom", // any part of the visual on screen…
          end: "bottom top", // …until it has fully left the top
          onEnter: replay,
          onEnterBack: replay,
          onLeave: reset,
          onLeaveBack: reset,
        });

        return () => {
          delete el.dataset.hvReady;
        };
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return <div ref={root}>{children}</div>;
}
