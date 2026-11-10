"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/*
 * Animation layer for the Services section. It owns no content: all markup
 * is server-rendered and readable without JavaScript. Everything here is
 * scoped to `root` and reverted by useGSAP / gsap.matchMedia on unmount or
 * when a media query stops matching.
 *
 * Selectors (data attributes set in Services.tsx):
 *   [data-svc-intro]     opening heading block
 *   [data-svc-stage]     element pinned on desktop
 *   [data-svc-track]     wrapper of all service panels
 *   [data-svc-panel]     one service (text + visual)
 *   [data-svc-text]      text items inside a panel, revealed in order
 *   [data-svc-visual]    the visual composition wrapper
 *   [data-v-el]          pieces inside a visual, staggered in
 *   [data-svc-progress]  progress bar fill
 *   [data-svc-counter]   "01" active number
 *   [data-svc-jump]      index buttons
 */

const DESKTOP =
  "(min-width: 64rem) and (min-height: 40rem) and (prefers-reduced-motion: no-preference)";
const COMPACT =
  "((max-width: 63.99rem) or (max-height: 39.99rem)) and (prefers-reduced-motion: no-preference)";

// Timeline units (scrubbed, so these are proportions of scroll distance).
const HOLD = 0.6; // a service rests on screen
const OUT = 0.5; // outgoing content leaves
const IN = 0.7; // incoming content arrives
const OVERLAP = 0.3; // incoming starts before outgoing finishes

export function ServicesExperience({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const q = gsap.utils.selector(el);
      const mm = gsap.matchMedia();

      /* Opening: subtle rise of the heading block (all sizes). */
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(q("[data-svc-intro] > *"), {
          y: 28,
          autoAlpha: 0,
          duration: 0.9,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: q("[data-svc-intro]")[0], start: "top 80%", once: true },
        });
      });

      /* Desktop: pinned, scroll-driven showcase. */
      mm.add(DESKTOP, () => {
        el.dataset.pinned = "true";

        const stage = q("[data-svc-stage]")[0];
        const track = q("[data-svc-track]")[0];
        const panels = q("[data-svc-panel]");
        const fill = q("[data-svc-progress]")[0];
        const counter = q("[data-svc-counter]")[0];
        const jumps = q("[data-svc-jump]");
        const n = panels.length;
        if (!stage || n === 0) return;

        const pad = (i: number) => String(i + 1).padStart(2, "0");
        let active = -1;
        const setActive = (i: number) => {
          if (i === active) return;
          active = i;
          if (counter) counter.textContent = pad(i);
          jumps.forEach((button, j) => {
            if (j === i) button.setAttribute("aria-current", "step");
            else button.removeAttribute("aria-current");
          });
        };

        // Only the first service is visible at rest.
        gsap.set(panels.slice(1), { autoAlpha: 0 });
        gsap.set(fill, { scaleX: 1 / n });
        setActive(0);

        const labels: number[] = [0];
        const switchAt: number[] = [0];

        const tl = gsap.timeline({
          defaults: { ease: "power2.inOut" },
          scrollTrigger: {
            trigger: stage,
            start: "top top",
            end: () => `+=${(n - 1) * window.innerHeight * 0.85}`,
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            snap: {
              snapTo: "labels",
              duration: { min: 0.25, max: 0.6 },
              delay: 0.08,
              ease: "power1.inOut",
              // Without these, a programmatic jump reads as a fast fling and
              // snap predicts (and lands on) a far-away service.
              inertia: false,
              directional: false,
            },
          },
          // Driven by the scrubbed timeline itself, so the counter always
          // matches what is on screen (ScrollTrigger's onUpdate runs ahead).
          onUpdate: () => {
            const time = tl.time();
            let i = 0;
            while (i + 1 < n && time >= switchAt[i + 1]) i++;
            setActive(i);
          },
        });

        tl.addLabel("s0", 0);

        for (let i = 1; i < n; i++) {
          const prev = panels[i - 1];
          const next = panels[i];
          tl.to({}, { duration: HOLD });
          const at = tl.duration();

          // Outgoing: text lifts away in order, visual recedes.
          tl.to(prev.querySelectorAll("[data-svc-text]"), {
            y: -28,
            autoAlpha: 0,
            duration: OUT,
            stagger: 0.04,
            ease: "power2.in",
          }, at)
            .to(prev.querySelector("[data-svc-visual]"), {
              autoAlpha: 0,
              scale: 0.96,
              y: -24,
              duration: OUT + 0.1,
              ease: "power2.in",
            }, at)
            .set(prev, { autoAlpha: 0 }, at + OUT + 0.1);

          // Incoming: panel shown, then text, visual and its pieces in sequence.
          const inAt = at + OUT - OVERLAP;
          tl.set(next, { autoAlpha: 1 }, inAt)
            .fromTo(next.querySelector("[data-svc-visual]"),
              { autoAlpha: 0, scale: 1.04, y: 28 },
              { autoAlpha: 1, scale: 1, y: 0, duration: IN, ease: "power3.out" },
              inAt)
            // Text waits for the outgoing text to clear: visuals may
            // crossfade, but two titles must never overlap.
            .fromTo(next.querySelectorAll("[data-svc-text]"),
              { autoAlpha: 0, y: 36 },
              { autoAlpha: 1, y: 0, duration: IN, stagger: 0.07, ease: "power3.out" },
              at + OUT + 0.05)
            .fromTo(next.querySelectorAll("[data-v-el]"),
              { autoAlpha: 0, y: 14 },
              { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.04, ease: "power2.out" },
              inAt + 0.2)
            .to(fill, { scaleX: (i + 1) / n, duration: OUT + IN - OVERLAP }, at);

          switchAt.push(inAt + IN / 2);
          const settled = tl.duration();
          labels.push(settled);
          tl.addLabel(`s${i}`, settled);
        }
        // Let the final service rest before the section scrolls on.
        tl.to({}, { duration: HOLD });

        // Entrance of the stage itself (separate elements from the timeline).
        gsap.from(track, {
          autoAlpha: 0,
          y: 48,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: stage, start: "top 75%", once: true },
        });
        gsap.from(panels[0].querySelectorAll("[data-v-el]"), {
          autoAlpha: 0,
          y: 14,
          duration: 0.6,
          stagger: 0.05,
          delay: 0.35,
          ease: "power2.out",
          scrollTrigger: { trigger: stage, start: "top 75%", once: true },
        });

        // Index buttons: jump to a service's resting position.
        const onClick = (event: MouseEvent) => {
          const button = (event.target as HTMLElement).closest<HTMLElement>("[data-svc-jump]");
          const st = tl.scrollTrigger;
          if (!button || !st) return;
          const i = Number(button.dataset.svcJump);
          // Cancel a snap still in progress so it cannot override the jump.
          // (getTween returns 0, not null, when no snap is running.)
          const snapTween = st.getTween(true);
          if (snapTween) snapTween.kill();
          const y = st.start + (st.end - st.start) * (labels[i] / tl.duration());
          window.scrollTo({ top: Math.round(y) });
        };
        el.addEventListener("click", onClick);

        return () => {
          el.removeEventListener("click", onClick);
          delete el.dataset.pinned;
          jumps.forEach((button) => button.removeAttribute("aria-current"));
        };
      });

      /* Mobile, tablet and short screens: natural scroll, light reveals. */
      mm.add(COMPACT, () => {
        q("[data-svc-panel]").forEach((panel) => {
          gsap.from(panel.querySelectorAll("[data-svc-text]"), {
            y: 24,
            autoAlpha: 0,
            duration: 0.7,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: { trigger: panel, start: "top 82%", once: true },
          });
          const visual = panel.querySelector("[data-svc-visual]");
          if (!visual) return;
          gsap.from(visual, {
            y: 32,
            autoAlpha: 0,
            scale: 0.97,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: visual, start: "top 88%", once: true },
          });
          gsap.from(visual.querySelectorAll("[data-v-el]"), {
            y: 12,
            autoAlpha: 0,
            duration: 0.5,
            stagger: 0.04,
            delay: 0.25,
            ease: "power2.out",
            scrollTrigger: { trigger: visual, start: "top 88%", once: true },
          });
        });
      });

      // Fonts change text metrics; recalculate trigger positions once loaded.
      document.fonts?.ready.then(() => ScrollTrigger.refresh());

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} className="group/svc">
      {children}
    </div>
  );
}
