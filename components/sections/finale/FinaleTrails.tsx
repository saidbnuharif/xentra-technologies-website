"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/components/motion/gsap";

/*
 * Contact finale: blue light trails sweeping in from both edges and
 * converging on the X (and, on wider screens, on the WhatsApp button) as
 * the band scrolls into view. Drawn by scroll position (ScrollTrigger
 * scrub); they finish as the X pops up in its slot (XStage claims it at
 * 68% of the viewport). Sits behind the band's text (-z-[1] inside the
 * isolated section), so it never covers copy or buttons.
 *
 * Paths are built from the live layout (slot and button positions), in the
 * section's own pixel space. Reduced motion: fully drawn, static. No JS:
 * nothing (the band is complete without it).
 */
type P = { x: number; y: number };
const r1 = (v: number) => Math.round(v * 10) / 10;

/** A sweep from an edge point into a target, arriving almost level. */
const sweep = (from: P, to: P) => {
  const dx = to.x - from.x;
  return `M${r1(from.x)} ${r1(from.y)}C${r1(from.x + dx * 0.45)} ${r1(from.y)} ${r1(to.x - dx * 0.3)} ${r1(to.y + (from.y - to.y) * 0.25)} ${r1(to.x)} ${r1(to.y)}`;
};

type FinaleTrailsProps = {
  /** "scroll" (default): drawn by scroll as the band arrives. "load": drawn
   *  once on page load (the Contact page opens with the finale). */
  play?: "scroll" | "load";
  /** "behind" (default, -z-[1] in an isolated section) or "base" (no
   *  z-index, under the page's 3D canvas in a non-isolated section). */
  layer?: "behind" | "base";
};

export function FinaleTrails({ play = "scroll", layer = "behind" }: FinaleTrailsProps) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = ref.current;
    const section = svg?.closest("section");
    const slot = section?.querySelector<HTMLElement>("[data-x-slot]");
    const cta = section?.querySelector<HTMLElement>("[data-finale-cta]");
    if (!svg || !section || !slot) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lines = [...svg.querySelectorAll<SVGPathElement>("[data-trail]")];
    const glows = [...svg.querySelectorAll<SVGPathElement>("[data-trail-glow]")];

    const layout = () => {
      const s = section.getBoundingClientRect();
      const W = s.width;
      const H = s.height;
      svg.setAttribute("viewBox", `0 0 ${Math.max(1, W)} ${Math.max(1, H)}`);
      const sr = slot.getBoundingClientRect();
      const T = { x: sr.left - s.left + sr.width / 2, y: sr.top - s.top + sr.height / 2 };
      const spread = Math.min(H * 0.22, 220);
      const d: (string | null)[] = [
        sweep({ x: -20, y: T.y - spread }, T),
        sweep({ x: W + 20, y: T.y - spread * 0.55 }, T),
        sweep({ x: -20, y: T.y + spread * 0.45 }, T),
        sweep({ x: W + 20, y: T.y + spread * 0.9 }, T),
      ];
      // Two more into the WhatsApp button's sides, where there is room.
      const b = cta?.getBoundingClientRect();
      if (b && b.width < W * 0.5) {
        const y = b.top - s.top + b.height / 2;
        d.push(sweep({ x: -20, y: y + 70 }, { x: b.left - s.left - 10, y }));
        d.push(sweep({ x: W + 20, y: y + 50 }, { x: b.right - s.left + 10, y }));
      } else d.push(null, null);
      lines.forEach((p, i) => {
        const v = d[i];
        p.style.display = glows[i].style.display = v ? "" : "none";
        if (v) {
          p.setAttribute("d", v);
          glows[i].setAttribute("d", v);
        }
      });
    };

    layout();
    const observer = new ResizeObserver(() => {
      layout();
      ScrollTrigger.refresh();
    });
    observer.observe(section);
    if (reduced) return () => observer.disconnect();

    const all = [...lines, ...glows];
    gsap.set(all, { strokeDasharray: "1 1.02", strokeDashoffset: 1 });
    const tl =
      play === "load"
        ? gsap.timeline({ delay: 0.5, defaults: { ease: "power2.inOut" } })
        : gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: slot,
              start: "top bottom",
              end: "center 68%",
              scrub: window.matchMedia("(hover: none), (pointer: coarse)").matches ? 0.4 : 0.8,
            },
          });
    const span = play === "load" ? 1.6 : 0.7;
    lines.forEach((p, i) =>
      tl.to([p, glows[i]], { strokeDashoffset: 0, duration: span, autoRound: false, ease: play === "load" ? "power2.inOut" : "power1.in" }, i * (play === "load" ? 0.14 : 0.06)),
    );
    return () => {
      observer.disconnect();
      tl.scrollTrigger?.kill();
      tl.kill();
      gsap.set(all, { clearProps: "strokeDasharray,strokeDashoffset" });
    };
  }, [play]);

  return (
    <svg
      ref={ref}
      aria-hidden
      preserveAspectRatio="none"
      className={`pointer-events-none absolute inset-0 ${layer === "behind" ? "-z-[1]" : ""} size-full overflow-hidden`}
    >
      <defs>
        <linearGradient id="finale-trail" x1="0" x2="1">
          <stop offset="0" stopColor="#2f6bff" stopOpacity="0.15" />
          <stop offset="0.5" stopColor="#6f9bff" />
          <stop offset="1" stopColor="#2f6bff" stopOpacity="0.15" />
        </linearGradient>
      </defs>
      {Array.from({ length: 6 }, (_, i) => (
        <g key={i} opacity={i < 4 ? 1 - i * 0.12 : 0.55}>
          <path data-trail-glow pathLength={1} fill="none" stroke="#2f6bff" strokeOpacity="0.16" strokeWidth="7" strokeLinecap="round" />
          <path data-trail pathLength={1} fill="none" stroke="url(#finale-trail)" strokeWidth={i < 2 ? 1.8 : 1.2} strokeLinecap="round" />
        </g>
      ))}
    </svg>
  );
}
