"use client";

import { useRef, type ReactNode } from "react";
import { gsap, MEDIA, ScrollTrigger, useGSAP } from "@/components/motion/gsap";

/*
 * Scroll-linked progress for the How We Work timeline. Owns no content.
 * As the timeline passes through the viewport, [data-process-fill] grows
 * along the track (horizontal ≥1024px, vertical below) and each
 * [data-process-step] gets data-state="upcoming" | "active" | "done"
 * depending on whether the line has reached its marker. Styling for those
 * states lives in the server markup (Tailwind data variants) and transitions
 * (a [data-process-spark] dot rides the tip of the fill while it moves)
 * in CSS. No pinning, no added scroll length.
 *
 * Reduced motion / no JS: no state is set, so every step shows in full.
 */
export function ProcessTimeline({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();

      mm.add(
        { desktop: "(min-width: 64rem)", motion: MEDIA.motion },
        (context) => {
          const { desktop, motion } = context.conditions as { desktop: boolean; motion: boolean };
          if (!motion) return;

          const q = gsap.utils.selector(el);
          const track = q("[data-process-track]")[0];
          const fill = q("[data-process-fill]")[0];
          const steps = q("[data-process-step]");
          const markers = q("[data-process-marker]");
          const spark = q("[data-process-spark]")[0];
          if (!track || !fill || steps.length === 0) return;

          // Marker centres as fractions of the track length.
          let positions: number[] = [];
          const measure = () => {
            const t = track.getBoundingClientRect();
            positions = markers.map((m) => {
              const r = m.getBoundingClientRect();
              return desktop
                ? (r.left + r.width / 2 - t.left) / t.width
                : (r.top + r.height / 2 - t.top) / t.height;
            });
          };

          let active = -2;
          const setActive = (i: number) => {
            if (i === active) return;
            active = i;
            steps.forEach((step, j) => {
              step.dataset.state = j < i ? "done" : j === i ? "active" : "upcoming";
            });
          };

          measure();
          setActive(-1);

          gsap.fromTo(
            fill,
            desktop
              ? { scaleX: 0, scaleY: 1, transformOrigin: "left center" }
              : { scaleY: 0, scaleX: 1, transformOrigin: "center top" },
            {
              scaleX: 1,
              scaleY: 1,
              ease: "none",
              scrollTrigger: {
                trigger: el,
                start: "top 72%",
                // Short, natural distance: no pin, no extra scroll length.
                end: desktop ? "top 28%" : "bottom 55%",
                scrub: 0.5,
                onRefresh: measure,
              },
              onUpdate() {
                const p = this.progress();
                // Spark of light rides the tip of the fill while it moves.
                if (spark) {
                  spark.style.display = p > 0.001 && p < 0.999 ? "block" : "none";
                  spark.style.left = desktop ? `${p * 100}%` : "50%";
                  spark.style.top = desktop ? "50%" : `${p * 100}%`;
                }
                let i = -1;
                while (i + 1 < positions.length && p >= positions[i + 1] - 0.01) i++;
                setActive(i);
              },
            },
          );

          return () => {
            steps.forEach((step) => delete step.dataset.state);
            if (spark) spark.removeAttribute("style");
          };
        },
      );

      document.fonts?.ready.then(() => ScrollTrigger.refresh());
      return () => mm.revert();
    },
    { scope: root },
  );

  return <div ref={root}>{children}</div>;
}
