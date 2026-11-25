"use client";

import { useRef, type ReactNode } from "react";
import { gsap, MEDIA, ScrollTrigger, useGSAP } from "@/components/motion/gsap";

/*
 * Leadership (About page): one restrained entrance — the heading, rule and
 * the two profiles fade up once as the section arrives. Opacity only (never
 * visibility), so links stay focusable; focus completes it at once.
 * Nothing else moves. Reduced motion / no JS: still and complete.
 */
export function LeadershipMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MEDIA.motion, () => {
        const parts = el.querySelectorAll("[data-ld-reveal]");
        gsap.set(parts, { opacity: 0, y: 18 });
        const tl = gsap.timeline({ paused: true }).to(parts, { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power2.out", clearProps: "transform" });
        const trigger = ScrollTrigger.create({ trigger: el, start: "top 78%", once: true, onEnter: () => tl.play() });
        const finish = () => tl.progress(1);
        el.addEventListener("focusin", finish);
        return () => {
          el.removeEventListener("focusin", finish);
          trigger.kill();
          tl.kill();
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return <div ref={root}>{children}</div>;
}
