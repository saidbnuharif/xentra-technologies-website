"use client";

import { useRef, type ReactNode } from "react";
import { gsap, MEDIA, ScrollTrigger, useGSAP } from "@/components/motion/gsap";
import { playXTransition } from "@/components/transition/x-transition-store";

/** Event the page's 3D scene listens for: the energy core turns towards a
 *  focused panel (window-normalised -1..1), or relaxes (null). */
export const CORE_FOCUS_EVENT = "xentra:core-focus";
export type CoreFocus = { x: number; y: number } | null;

const focusCore = (detail: CoreFocus) => window.dispatchEvent(new CustomEvent<CoreFocus>(CORE_FOCUS_EVENT, { detail }));

/*
 * Services stage motion (Home):
 *  - Entrance: as the stage comes into view the screen fades up and the
 *    panels glide in from their sides, turning into place, front ones
 *    first (desktop); a simple rise on phones and tablets.
 *  - Scroll parallax (desktop): each panel drifts by its depth.
 *  - Perspective (desktop, fine pointer): the composition turns a few
 *    degrees with the cursor; the hovered panel tilts towards it.
 *  - Focus: hovering or focusing a panel turns the 3D core towards it and
 *    brightens it (CORE_FOCUS_EVENT); the screen's light shifts to blue
 *    (CSS).
 *  - The ambient float is CSS ([data-ss-float], on screen only).
 * Only the [data-ss-*] layers are animated, never an element carrying the
 * CSS placement or hover transforms. Reduced motion / no JS: still and
 * complete.
 */
export function ServicesStageMotion({ children, className = "" }: { children: ReactNode; className?: string }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const el = root.current;
      if (!el || !contextSafe) return;
      const q = gsap.utils.selector(el);
      const panels = q("[data-ss-panel]") as HTMLElement[];
      const mm = gsap.matchMedia();

      /* Entrance */
      mm.add({ desktop: "(min-width: 64rem)", motion: MEDIA.motion }, (ctx) => {
        const { desktop, motion } = ctx.conditions as { desktop: boolean; motion: boolean };
        if (!motion) return;
        const enter = panels.map((p) => p.querySelector<HTMLElement>("[data-ss-enter]")!);
        // Opacity only (never visibility), so every link stays in the tab
        // order while the entrance plays; keyboard focus inside the stage
        // completes it at once.
        if (!desktop) {
          gsap.set(enter, { opacity: 0, y: 32 });
          const batch = ScrollTrigger.batch(enter, {
            start: "top 90%",
            once: true,
            onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 0.8, stagger: 0.08, ease: "power3.out", clearProps: "transform" }),
          });
          const onFocus = (e: FocusEvent) => {
            const layer = (e.target as Element).closest("[data-ss-enter]");
            if (layer) gsap.to(layer, { opacity: 1, y: 0, duration: 0.25, overwrite: true, clearProps: "transform" });
          };
          el.addEventListener("focusin", onFocus);
          return () => {
            el.removeEventListener("focusin", onFocus);
            batch.forEach((t) => t.kill());
          };
        }
        // Front panels (nearest the viewer) arrive first.
        const order = panels
          .map((p, i) => ({ i, z: Number(p.dataset.depth) || 0 }))
          .sort((a, b) => b.z - a.z)
          .map(({ i }) => enter[i]);
        const screen = q("[data-ss-screen]") as HTMLElement[];
        gsap.set(screen, { opacity: 0 });
        panels.forEach((p, i) => {
          const left = p.dataset.side === "left";
          gsap.set(enter[i], { opacity: 0, x: left ? -120 : 120, rotationY: left ? 28 : -28, scale: 0.9, transformPerspective: 1000 });
        });
        const tl = gsap
          .timeline({ paused: true })
          .to(screen, { opacity: 1, duration: 1.1, ease: "power2.out" }, 0)
          .to(order, { opacity: 1, x: 0, rotationY: 0, scale: 1, duration: 1.3, ease: "power3.out", stagger: 0.11, clearProps: "transform" }, 0.15);
        const trigger = ScrollTrigger.create({ trigger: el, start: "top 78%", once: true, onEnter: () => tl.play() });
        const onFocus = () => tl.progress(1);
        el.addEventListener("focusin", onFocus);
        return () => {
          el.removeEventListener("focusin", onFocus);
          trigger.kill();
          tl.kill();
        };
      });

      /* Scroll parallax by depth */
      mm.add(MEDIA.desktopMotion, () => {
        const tweens = panels.map((p) => {
          const k = 0.35 + ((Number(p.dataset.depth) || 0) + 40) / 100; // 0.35 (back) … 1.35 (front)
          return gsap.fromTo(
            p.querySelector("[data-ss-depth]"),
            { y: 34 * k },
            { y: -34 * k, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.8 } },
          );
        });
        return () => tweens.forEach((t) => (t.scrollTrigger?.kill(), t.kill()));
      });

      /* Perspective and tilt (mouse) */
      mm.add(`(hover: hover) and (pointer: fine) and ${MEDIA.desktopMotion}`, () => {
        const layer = q("[data-ss-panels]")[0] as HTMLElement;
        const turnY = gsap.quickTo(layer, "rotationY", { duration: 1.2, ease: "power3.out" });
        const turnX = gsap.quickTo(layer, "rotationX", { duration: 1.2, ease: "power3.out" });
        const onMove = contextSafe((e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          turnY(((e.clientX - r.left) / r.width - 0.5) * 6);
          turnX(-((e.clientY - r.top) / r.height - 0.5) * 4);
        });
        const onLeave = contextSafe(() => (turnY(0), turnX(0)));
        el.addEventListener("pointermove", onMove);
        el.addEventListener("pointerleave", onLeave);

        const tilts = panels.map((panel) => {
          const glass = panel.querySelector<HTMLElement>("[data-ss-tilt]")!;
          gsap.set(glass, { transformPerspective: 900 });
          const rx = gsap.quickTo(glass, "rotationX", { duration: 0.5, ease: "power3.out" });
          const ry = gsap.quickTo(glass, "rotationY", { duration: 0.5, ease: "power3.out" });
          const move = contextSafe((e: PointerEvent) => {
            const r = glass.getBoundingClientRect();
            ry(((e.clientX - r.left) / r.width - 0.5) * 8);
            rx(-((e.clientY - r.top) / r.height - 0.5) * 6);
          });
          const leave = contextSafe(() => (rx(0), ry(0)));
          glass.addEventListener("pointermove", move);
          glass.addEventListener("pointerleave", leave);
          return () => {
            glass.removeEventListener("pointermove", move);
            glass.removeEventListener("pointerleave", leave);
          };
        });
        return () => {
          el.removeEventListener("pointermove", onMove);
          el.removeEventListener("pointerleave", onLeave);
          tilts.forEach((fn) => fn());
          gsap.set([layer, ...panels.map((p) => p.querySelector("[data-ss-tilt]"))], { clearProps: "transform" });
        };
      });

      /* Focus → the 3D core (pointer and keyboard; the scene ignores it with
         reduced motion). */
      const focusOn = (panel: HTMLElement) => {
        const r = panel.getBoundingClientRect();
        focusCore({ x: ((r.left + r.width / 2) / window.innerWidth) * 2 - 1, y: ((r.top + r.height / 2) / window.innerHeight) * 2 - 1 });
      };
      const handlers = panels.map((panel) => {
        const enter = () => focusOn(panel);
        const leave = (e: Event) => {
          const next = (e as FocusEvent).relatedTarget as Node | null;
          if (e.type === "focusout" && next && panel.contains(next)) return;
          if ("ssSelected" in panel.dataset) return; // chosen: hold the focus
          focusCore(null);
        };
        panel.addEventListener("pointerenter", enter);
        panel.addEventListener("pointerleave", leave);
        panel.addEventListener("focusin", enter);
        panel.addEventListener("focusout", leave);
        return () => {
          panel.removeEventListener("pointerenter", enter);
          panel.removeEventListener("pointerleave", leave);
          panel.removeEventListener("focusin", enter);
          panel.removeEventListener("focusout", leave);
        };
      });

      /* Click: the chosen service takes the stage (it stays lifted, the
         others recede, the core holds on it), then the X transition carries
         the visitor to it. Modified clicks, reduced motion or no overlay:
         the link navigates as normal. */
      const clicks = panels.map((panel) => {
        const link = panel.querySelector<HTMLAnchorElement>("a[href]");
        if (!link) return () => {};
        const onClick = contextSafe((e: MouseEvent) => {
          if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
          if (!window.matchMedia(MEDIA.motion).matches) return;
          const r = panel.getBoundingClientRect();
          const started = playXTransition({ href: link.href, origin: { x: r.left + r.width / 2, y: r.top + r.height / 2 } });
          if (!started) return;
          e.preventDefault();
          panel.dataset.ssSelected = "";
          focusOn(panel);
          const others = panels.filter((p) => p !== panel).map((p) => p.querySelector("[data-ss-enter]"));
          gsap.to(others, { autoAlpha: 0.25, scale: 0.94, duration: 0.5, ease: "power2.out" });
          gsap.to(panel.querySelector("[data-ss-enter]"), { scale: 1.05, duration: 0.6, ease: "power3.out" });
        });
        link.addEventListener("click", onClick);
        return () => link.removeEventListener("click", onClick);
      });

      return () => {
        handlers.forEach((fn) => fn());
        clicks.forEach((fn) => fn());
        panels.forEach((p) => delete p.dataset.ssSelected);
        focusCore(null);
        mm.revert();
      };
    },
    { scope: root },
  );

  return (
    <div ref={root} className={className}>
      {children}
    </div>
  );
}
