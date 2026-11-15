"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";
import { gsap, MEDIA, ScrollTrigger, useGSAP } from "@/components/motion/gsap";

/*
 * Services lens and chapters (ServiceChapters):
 *  - Active service: the chapter crossing the middle of the screen becomes
 *    active (data-active on it; --sc-active and the lens's data-on follow),
 *    on every screen size (state, not motion: CSS drops the transitions
 *    under reduced motion).
 *  - Spine (desktop, motion): fills with blue as the chapters scroll by.
 *  - Entrance (motion): each chapter's parts rise in as it arrives
 *    (opacity only, never visibility, so every link stays focusable).
 *  - Lens tilt (desktop, fine pointer): the glass tile turns gently
 *    towards the cursor.
 */
export function ServiceChaptersMotion({ children, total, className = "" }: { children: ReactNode; total: number; className?: string }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const el = root.current;
      if (!el || !contextSafe) return;
      const q = gsap.utils.selector(el);
      const chapters = q("[data-sc-chapter]") as HTMLElement[];
      const nodes = [...el.querySelectorAll<SVGGElement>("[data-sc-node]")];
      const faces = q("[data-sc-face]") as HTMLElement[];

      /* Active service */
      let active = -1;
      const setActive = (i: number) => {
        if (i === active) return;
        active = i;
        el.style.setProperty("--sc-active", String(i));
        el.style.setProperty("--sc-progress", String((i + 1) / total));
        chapters.forEach((c, n) => (n === i ? (c.dataset.active = "") : delete c.dataset.active));
        [...nodes, ...faces].forEach((item) => (Number(item.dataset.scNode ?? item.dataset.scFace) === i ? item.setAttribute("data-on", "") : item.removeAttribute("data-on")));
      };
      setActive(0);
      const triggers = chapters.map((chapter, i) =>
        ScrollTrigger.create({
          trigger: chapter,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => self.isActive && setActive(i),
        }),
      );

      const mm = gsap.matchMedia();

      /* Entrance */
      mm.add(MEDIA.motion, () => {
        const parts = q("[data-sc-reveal]") as HTMLElement[];
        gsap.set(parts, { opacity: 0, y: 26 });
        const batch = ScrollTrigger.batch(parts, {
          start: "top 88%",
          once: true,
          onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 0.9, stagger: 0.08, ease: "power3.out", clearProps: "transform" }),
        });
        // Keyboard focus never waits for an entrance.
        const onFocus = (e: FocusEvent) => {
          const chapter = (e.target as Element).closest("[data-sc-chapter]");
          if (chapter) gsap.to(chapter.querySelectorAll("[data-sc-reveal]"), { opacity: 1, y: 0, duration: 0.2, overwrite: true });
        };
        el.addEventListener("focusin", onFocus);
        return () => {
          el.removeEventListener("focusin", onFocus);
          batch.forEach((t) => t.kill());
        };
      });

      /* Spine */
      mm.add(MEDIA.desktopMotion, () => {
        const fill = q("[data-sc-progress]")[0];
        const tween = gsap.fromTo(
          fill,
          { scaleY: 0 },
          { scaleY: 1, ease: "none", scrollTrigger: { trigger: q(".sc-chapters")[0], start: "top 55%", end: "bottom 55%", scrub: 0.6 } },
        );
        return () => (tween.scrollTrigger?.kill(), tween.kill());
      });

      /* Lens tilt */
      mm.add(`(hover: hover) and (pointer: fine) and ${MEDIA.desktopMotion}`, () => {
        const tile = q("[data-sc-tilt]")[0];
        if (!tile) return;
        gsap.set(tile, { transformPerspective: 900 });
        const rx = gsap.quickTo(tile, "rotationX", { duration: 1, ease: "power3.out" });
        const ry = gsap.quickTo(tile, "rotationY", { duration: 1, ease: "power3.out" });
        const onMove = contextSafe((e: PointerEvent) => {
          ry(((e.clientX / window.innerWidth) - 0.5) * 16);
          rx(-((e.clientY / window.innerHeight) - 0.5) * 12);
        });
        const onLeave = contextSafe(() => (rx(0), ry(0)));
        el.addEventListener("pointermove", onMove);
        el.addEventListener("pointerleave", onLeave);
        return () => {
          el.removeEventListener("pointermove", onMove);
          el.removeEventListener("pointerleave", onLeave);
          gsap.set(tile, { clearProps: "transform" });
        };
      });

      return () => {
        triggers.forEach((t) => t.kill());
        mm.revert();
      };
    },
    { scope: root, dependencies: [total] },
  );

  // Server values (first service active), so the lens is right without JS.
  const style = { "--sc-active": 0, "--sc-progress": 1 / total, "--sc-step": `${360 / total}deg` } as CSSProperties;
  return (
    <div ref={root} className={className} style={style}>
      {children}
    </div>
  );
}
