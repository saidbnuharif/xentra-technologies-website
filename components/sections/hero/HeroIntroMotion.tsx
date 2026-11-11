"use client";

import { useRef, type ReactNode } from "react";
import { gsap, MEDIA, ScrollTrigger, useGSAP } from "@/components/motion/gsap";

/*
 * Hero text behaviour (the visual keeps its own HeroVisualMotion).
 *
 *  1. First load: hero-intro.css plays the entrance (no JS needed).
 *  2. Replay: when the text block has fully left the viewport it resets to
 *     its start state; when it comes back the same sequence replays with
 *     GSAP. Nothing restarts while it stays visible.
 *  3. "Explore Our Services" ([data-hero-scroll]): smooth native scroll to
 *     the target section, then focus moves there (keyboard / screen reader
 *     users land where they asked). Instant for reduced motion.
 *  4. Magnetic CTAs ([data-magnetic]): desktop with a fine pointer only;
 *     the button eases a few pixels toward the cursor, then settles back.
 *
 * Everything is scoped to this component and reverted on unmount.
 */
const FINE_POINTER = "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

export function HeroIntroMotion({ children, className }: { children: ReactNode; className?: string }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const el = root.current;
      if (!el || !contextSafe) return;
      const q = gsap.utils.selector(el);
      const mm = gsap.matchMedia();

      /* Smooth scroll to the services section ------------------------- */
      const onClick = contextSafe((event: MouseEvent) => {
        const link = (event.target as HTMLElement).closest<HTMLAnchorElement>("[data-hero-scroll]");
        if (!link) return;
        const target = document.querySelector<HTMLElement>(link.hash);
        if (!target) return; // fall back to the browser's own anchor jump
        event.preventDefault();
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
        // Move focus for keyboard and screen-reader users without a second jump.
        if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
        history.replaceState(null, "", link.hash);
      });
      el.addEventListener("click", onClick);

      /* Replay on re-entry --------------------------------------------- */
      mm.add(MEDIA.motion, () => {
        const words = q("[data-hero-word]");
        const fades = q("[data-hero-fade]");
        const light = q("[data-hero-light]");

        const tl = gsap
          .timeline({ paused: true, defaults: { ease: "power3.out" } })
          .fromTo(light, { opacity: 0 }, { opacity: 1, duration: 1.4, ease: "power1.out" }, 0)
          // y: 0 is explicit on purpose. If hydration happens while the CSS
          // entrance is still running, GSAP would otherwise read the
          // mid-animation offset as the element's base `y` and keep it,
          // leaving the headline stuck below its mask.
          .fromTo(words, { yPercent: 108, y: 0 }, { yPercent: 0, y: 0, duration: 0.95, stagger: 0.07 }, 0.32)
          .fromTo(
            fades,
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: "power2.out" },
            0.7,
          );
        tl.progress(1); // first load is played by CSS; start from the end state

        ScrollTrigger.create({
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          onEnterBack: () => {
            el.dataset.heroReady = "true"; // e.g. page reloaded below the hero
            tl.restart();
          },
          onEnter: (self) => {
            // Ignore the initial "already in view" callback; CSS handled it.
            if (el.dataset.heroReady) tl.restart();
            else if (self.direction !== 1) tl.progress(1);
          },
          onLeave: () => {
            el.dataset.heroReady = "true"; // GSAP owns the text from here
            tl.pause(0);
          },
          onLeaveBack: () => {
            el.dataset.heroReady = "true";
            tl.pause(0);
          },
        });

        return () => {
          delete el.dataset.heroReady;
        };
      });

      /* Magnetic CTAs (desktop, fine pointer) ------------------------- */
      mm.add(FINE_POINTER, () => {
        const cleanups: (() => void)[] = [];
        (q("[data-magnetic]") as HTMLElement[]).forEach((button) => {
          const toX = gsap.quickTo(button, "x", { duration: 0.45, ease: "power3.out" });
          const toY = gsap.quickTo(button, "y", { duration: 0.45, ease: "power3.out" });
          const strength = 0.22;
          const limit = 7; // px — subtle, never a "chasing" button
          const onMove = contextSafe((event: PointerEvent) => {
            const r = button.getBoundingClientRect();
            const dx = event.clientX - (r.left + r.width / 2);
            const dy = event.clientY - (r.top + r.height / 2);
            toX(gsap.utils.clamp(-limit, limit, dx * strength));
            toY(gsap.utils.clamp(-limit, limit, dy * strength));
          });
          const onLeave = contextSafe(() => {
            toX(0);
            toY(0);
          });
          button.addEventListener("pointermove", onMove);
          button.addEventListener("pointerleave", onLeave);
          cleanups.push(() => {
            button.removeEventListener("pointermove", onMove);
            button.removeEventListener("pointerleave", onLeave);
          });
        });
        return () => cleanups.forEach((fn) => fn());
      });

      return () => {
        el.removeEventListener("click", onClick);
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
