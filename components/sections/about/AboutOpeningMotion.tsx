"use client";

import { useRef, type ReactNode } from "react";
import { gsap, MEDIA, useGSAP } from "@/components/motion/gsap";

/*
 * About opening words. On load they arrive from the X ("Strategy." and
 * "Growth." slide out from behind it, "Technology." rises), timed with the
 * X's own entrance. On scroll they part outward and fade while the X
 * dissolves (scrubbed across the section's height, no pin). Title lines
 * lift away a little ahead of them. Reduced motion / no JS: still.
 */
export function AboutOpeningMotion({ children, className = "" }: { children: ReactNode; className?: string }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MEDIA.motion, () => {
        const q = gsap.utils.selector(el);
        const section = el.closest("section") ?? el;
        const left = q('[data-ao-word="left"]');
        const right = q('[data-ao-word="right"]');
        const mid = q('[data-ao-word="mid"]');
        const fades = q("[data-ao-fade]");

        // Entrance (time-based, once).
        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .fromTo(fades, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.12 }, 0.15)
          .fromTo(left, { autoAlpha: 0, x: 120 }, { autoAlpha: 1, x: 0, duration: 1.4 }, 0.7)
          .fromTo(right, { autoAlpha: 0, x: -120 }, { autoAlpha: 1, x: 0, duration: 1.4 }, 0.7)
          .fromTo(mid, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 1.1 }, 1.05);

        // Scroll exit: the words part and fade.
        const touch = window.matchMedia("(hover: none), (pointer: coarse)").matches;
        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: touch ? 0.4 : 0.8 },
          })
          .to(fades, { y: -50, autoAlpha: 0, duration: 0.35, stagger: 0.05 }, 0.05)
          .to(left, { x: () => -window.innerWidth * 0.12, autoAlpha: 0, duration: 0.6 }, 0.1)
          .to(right, { x: () => window.innerWidth * 0.12, autoAlpha: 0, duration: 0.6 }, 0.1)
          .to(mid, { y: 40, autoAlpha: 0, duration: 0.5 }, 0.15)
          .set({}, {}, 1);
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
