"use client";

import { useRef, type ReactNode } from "react";
import { gsap, MEDIA, ScrollTrigger, useGSAP } from "@/components/motion/gsap";

/*
 * Glass service panels (GlassServices):
 *  - Entrance: as the section comes into view, the panels assemble —
 *    rising from depth, tipped back, in a staggered cascade (desktop);
 *    a simple rise on phones and tablets.
 *  - Mouse depth (desktop, fine pointer): the whole composition shifts a
 *    little with the cursor, each panel by its own depth.
 *  - Hover tilt (desktop, fine pointer): the hovered panel tilts toward
 *    the cursor and settles back (the lift and glow are CSS).
 * Only the [data-gp-*] layers are animated, never an element carrying the
 * CSS layout transforms. Reduced motion / no JS: still and complete.
 */
export function GlassServicesMotion({ children, className = "" }: { children: ReactNode; className?: string }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const el = root.current;
      if (!el || !contextSafe) return;
      const q = gsap.utils.selector(el);
      const mm = gsap.matchMedia();

      mm.add({ desktop: "(min-width: 64rem)", motion: MEDIA.motion }, (ctx) => {
        const { desktop, motion } = ctx.conditions as { desktop: boolean; motion: boolean };
        if (!motion) return;
        const panels = q("[data-gp-enter]") as HTMLElement[];
        // Each panel can arrive from its own direction (data-from).
        const FROM: Record<string, { x: number; y: number; rotationY: number; rotationX: number }> = {
          left: { x: -140, y: 30, rotationY: 22, rotationX: 0 },
          right: { x: 140, y: 30, rotationY: -22, rotationX: 0 },
          top: { x: 0, y: -90, rotationY: 0, rotationX: -18 },
          bottom: { x: 0, y: 90, rotationY: 0, rotationX: 18 },
        };
        panels.forEach((p) => {
          const f = FROM[p.dataset.from ?? "bottom"] ?? FROM.bottom;
          gsap.set(
            p,
            desktop
              ? { autoAlpha: 0, ...f, scale: 0.88, transformPerspective: 1100, transformOrigin: "50% 50%" }
              : { autoAlpha: 0, y: 36 },
          );
        });
        const batch = ScrollTrigger.batch(panels, {
          start: "top 88%",
          once: true,
          onEnter: (els) =>
            gsap.to(els, {
              autoAlpha: 1,
              x: 0,
              y: 0,
              rotationX: 0,
              rotationY: 0,
              scale: 1,
              duration: desktop ? 1.2 : 0.8,
              stagger: 0.09,
              ease: "power3.out",
              clearProps: "transform,transformOrigin",
            }),
        });
        return () => batch.forEach((t) => t.kill());
      });

      mm.add(`(hover: hover) and (pointer: fine) and (min-width: 64rem) and ${MEDIA.motion}`, () => {
        // Composition depth: each panel follows the cursor by its depth.
        const layers = (q("[data-gp-depth]") as HTMLElement[]).map((layer) => ({
          depth: Number(layer.dataset.depth) || 0.7,
          x: gsap.quickTo(layer, "x", { duration: 0.9, ease: "power3.out" }),
          y: gsap.quickTo(layer, "y", { duration: 0.9, ease: "power3.out" }),
        }));
        const onField = contextSafe((e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - 0.5;
          const py = (e.clientY - r.top) / r.height - 0.5;
          layers.forEach((l) => {
            l.x(px * 22 * l.depth);
            l.y(py * 14 * l.depth);
          });
        });
        const onFieldLeave = contextSafe(() => layers.forEach((l) => (l.x(0), l.y(0))));
        el.addEventListener("pointermove", onField);
        el.addEventListener("pointerleave", onFieldLeave);

        // Hover tilt per panel.
        const cleanups = (q("[data-gp-panel]") as HTMLElement[]).map((panel) => {
          gsap.set(panel, { transformPerspective: 900 });
          const rx = gsap.quickTo(panel, "rotationX", { duration: 0.5, ease: "power3.out" });
          const ry = gsap.quickTo(panel, "rotationY", { duration: 0.5, ease: "power3.out" });
          const move = contextSafe((e: PointerEvent) => {
            const r = panel.getBoundingClientRect();
            ry(((e.clientX - r.left) / r.width - 0.5) * 9);
            rx(-((e.clientY - r.top) / r.height - 0.5) * 7);
          });
          const leave = contextSafe(() => {
            rx(0);
            ry(0);
          });
          panel.addEventListener("pointermove", move);
          panel.addEventListener("pointerleave", leave);
          return () => {
            panel.removeEventListener("pointermove", move);
            panel.removeEventListener("pointerleave", leave);
          };
        });
        return () => {
          el.removeEventListener("pointermove", onField);
          el.removeEventListener("pointerleave", onFieldLeave);
          cleanups.forEach((fn) => fn());
        };
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
