"use client";

import { useRef, type ReactNode } from "react";
import { gsap, MEDIA, useGSAP } from "@/components/motion/gsap";

/*
 * How We Work journey (see Process.tsx).
 *
 * Desktop with motion only: sets data-journey="track" (which switches the
 * stages to one horizontal row), pins the frame and moves the row
 * sideways as you scroll — one screen of scrolling per screen of travel,
 * native scroll, scrubbed. The rail fills with progress and each stage
 * marker lights as its stage reaches the centre; the centred stage is
 * lit (data-on="true"), the rest wait dimmed.
 * Everywhere else (phones, reduced motion, no JS): no attribute, so the
 * stacked layout stands, every stage fully shown.
 */
export function ProcessJourney({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(`(min-width: 64rem) and (min-height: 38rem) and ${MEDIA.motion}`, () => {
        el.dataset.journey = "track";
        const q = gsap.utils.selector(el);
        const frame = q("[data-journey-frame]")[0] as HTMLElement;
        const viewport = q("[data-journey-viewport]")[0] as HTMLElement;
        const track = q("[data-journey-track]")[0] as HTMLElement;
        const stages = q("[data-journey-stage]") as HTMLElement[];
        const marks = q("[data-journey-mark]") as HTMLElement[];
        const fill = q("[data-journey-fill]")[0] as HTMLElement;

        /** Travel so the last stage ends at the same margin it started. */
        const distance = () => {
          // Where the first stage starts (measured, without the current
          // travel), so the last one can end at the same margin.
          const x = Number(gsap.getProperty(track, "x")) || 0;
          const start = track.getBoundingClientRect().left - x - viewport.getBoundingClientRect().left;
          return Math.max(0, track.scrollWidth - (viewport.clientWidth - 2 * start));
        };

        const setStates = (p: number) => {
          const active = Math.min(stages.length - 1, Math.round(p * (stages.length - 1)));
          stages.forEach((s, i) => (s.dataset.on = String(i === active)));
          marks.forEach((m, i) => (m.dataset.on = String(i <= active)));
          fill.style.transform = `scaleX(${p.toFixed(3)})`;
        };

        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: frame,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => setStates(self.progress),
          },
        });
        setStates(0);

        return () => {
          tween.scrollTrigger?.kill();
          tween.kill();
          delete el.dataset.journey;
          stages.forEach((s) => delete s.dataset.on);
          marks.forEach((m) => delete m.dataset.on);
          fill.style.transform = "";
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} className="group/j relative">
      {children}
    </div>
  );
}
