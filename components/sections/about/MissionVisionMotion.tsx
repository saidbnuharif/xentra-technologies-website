"use client";

import { useRef, type ReactNode } from "react";
import { gsap, MEDIA, useGSAP } from "@/components/motion/gsap";

/*
 * Mission & Vision — scroll-linked horizon (cinematic scroll, step 3).
 * Normal scrolling (no pin). As the section passes through the viewport:
 *   1. the Mission point and card light up, the beam pointing at Mission;
 *   2. the beam swings across the dial from Mission to Vision;
 *   3. rings ripple out from the Vision point as the Vision card arrives.
 * Server markup shows the finished frame (beam on Vision, both cards lit),
 * which is what reduced-motion and no-JS visitors see.
 */
export function MissionVisionMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MEDIA.motion, () => {
        const q = gsap.utils.selector(el);
        const touch = window.matchMedia("(hover: none), (pointer: coarse)").matches;
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: el, start: "top 78%", end: "bottom 50%", scrub: touch ? 0.4 : 0.8 },
        });
        tl.set(q("[data-mv-beam]"), { rotation: -60, svgOrigin: "600 330" }, 0)
          .fromTo(q('[data-mv-card="mission"]'), { autoAlpha: 0.2, y: 28 }, { autoAlpha: 1, y: 0, duration: 0.2, ease: "power2.out" }, 0)
          .fromTo(q('[data-mv-dot="mission"]'), { attr: { r: 3 } }, { attr: { r: 8 }, duration: 0.15 }, 0.06)
          .fromTo(q('[data-mv-card="vision"]'), { autoAlpha: 0.2, y: 28 }, { autoAlpha: 0.35, y: 14, duration: 0.2 }, 0)
          .to(q("[data-mv-beam]"), { rotation: 60, duration: 0.42, ease: "power1.inOut" }, 0.22)
          .fromTo(q("[data-mv-sweep]"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.42, autoRound: false }, 0.22)
          .fromTo(q('[data-mv-dot="vision"]'), { attr: { r: 3 } }, { attr: { r: 8 }, duration: 0.12 }, 0.6)
          .to(q('[data-mv-card="vision"]'), { autoAlpha: 1, y: 0, duration: 0.22, ease: "power2.out" }, 0.58)
          .fromTo(
            q("[data-mv-ring]"),
            { attr: { r: 8 }, autoAlpha: 0.9 },
            { attr: { r: (i: number) => 40 + i * 36 }, autoAlpha: 0.32, duration: 0.32, stagger: 0.07, ease: "power2.out" },
            0.62,
          );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} className="relative">
      {children}
    </div>
  );
}
