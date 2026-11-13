"use client";

import { useRef } from "react";
import { gsap, MEDIA, ScrollTrigger, useGSAP } from "@/components/motion/gsap";
import { C, CROSS, HUBS, NODES, RING } from "./ecosystem-geometry";

/*
 * About (Home): the X grows into a business ecosystem.
 *
 * Sits around the About X slot (1.48× its size, so every node and label
 * clears the mark), under the page's 3D canvas. Once the X has
 * popped up (XStage), continuing to scroll builds the network out of it:
 * energy spokes draw from the X to three hubs (the approved "Strategy.
 * Technology. Growth."), the hubs light up with their labels, then the
 * outer ring of nodes connects. Scrubbed, so it reverses on the way back.
 * When it is built and on screen, small pulses travel from the X along the
 * spokes; they stop off screen.
 *
 * Reduced motion / no JS: the finished network, no pulses.
 */
export function AboutEcosystem({ labels }: { labels: readonly string[] }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MEDIA.motion, () => {
        const q = gsap.utils.selector(el);
        const slot = el.closest("[data-x-slot]") ?? el;
        const touch = window.matchMedia("(hover: none), (pointer: coarse)").matches;
        // Pulses from the X out to each hub, looping while built and in view.
        const pulses = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 0.8 });
        let built = false;
        let inView = false;
        const syncPulses = () => (built && inView ? pulses.play() : pulses.pause());

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: slot, start: "center 60%", end: "center 30%", scrub: touch ? 0.4 : 0.8 },
          onUpdate: () => {
            built = tl.progress() > 0.65;
            syncPulses();
          },
        });
        tl.fromTo(q("[data-eco-spoke]"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.3, stagger: 0.05, autoRound: false }, 0)
          .fromTo(q("[data-eco-hub]"), { scale: 0, autoAlpha: 0, transformOrigin: "50% 50%" }, { scale: 1, autoAlpha: 1, duration: 0.12, stagger: 0.05, ease: "back.out(2.2)" }, 0.24)
          .fromTo(q("[data-eco-label]"), { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.12, stagger: 0.05, ease: "power2.out" }, 0.3)
          .fromTo(q("[data-eco-link]"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.3, stagger: 0.015, autoRound: false }, 0.42)
          .fromTo(q("[data-eco-node]"), { scale: 0, autoAlpha: 0, transformOrigin: "50% 50%" }, { scale: 1, autoAlpha: 1, duration: 0.08, stagger: 0.02, ease: "back.out(2)" }, 0.46)
          .set({}, {}, 1);

        q("[data-eco-pulse]").forEach((p, i) => {
          const hub = NODES[HUBS[i]];
          pulses
            .fromTo(p, { attr: { cx: C, cy: C } }, { attr: { cx: hub.x, cy: hub.y }, duration: 1.4, ease: "sine.in" }, i * 0.45)
            .fromTo(p, { opacity: 0 }, { opacity: 1, duration: 0.25 }, i * 0.45)
            .to(p, { opacity: 0, duration: 0.3 }, i * 0.45 + 1.1);
        });
        const view = ScrollTrigger.create({
          trigger: slot,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => {
            inView = self.isActive;
            syncPulses();
          },
        });
        return () => {
          pulses.kill();
          view.kill();
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const hubSet = new Set<number>(HUBS);
  return (
    <div ref={root} aria-hidden className="pointer-events-none absolute -inset-[24%]">
      <svg viewBox="0 0 1000 1000" className="absolute inset-0 size-full overflow-visible">
        <defs>
          {HUBS.map((h, i) => (
            <linearGradient key={h} id={`eco-spoke-${i}`} gradientUnits="userSpaceOnUse" x1={C} y1={C} x2={NODES[h].x} y2={NODES[h].y}>
              <stop offset="0.25" stopColor="#5a8bff" stopOpacity="0" />
              <stop offset="1" stopColor="#8fb0ff" stopOpacity="0.95" />
            </linearGradient>
          ))}
          <radialGradient id="eco-pulse">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="0.4" stopColor="#a9c4ff" stopOpacity="0.8" />
            <stop offset="1" stopColor="#2f6bff" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Outer ring and cross links */}
        <g fill="none" stroke="#5a8bff" strokeOpacity="0.32" strokeWidth="1.6">
          {[...RING, ...CROSS].map(([a, b], k) => (
            <line
              key={k}
              data-eco-link
              x1={NODES[a].x}
              y1={NODES[a].y}
              x2={NODES[b].x}
              y2={NODES[b].y}
              pathLength={1}
              strokeDasharray="1"
              strokeDashoffset="0"
              strokeOpacity={k >= RING.length ? 0.2 : undefined}
            />
          ))}
        </g>

        {/* Spokes from the X to the hubs */}
        <g fill="none" strokeWidth="2.4" strokeLinecap="round" className="[filter:drop-shadow(0_0_6px_rgb(47_107_255/0.85))]">
          {HUBS.map((h, i) => (
            <line key={h} data-eco-spoke x1={C} y1={C} x2={NODES[h].x} y2={NODES[h].y} stroke={`url(#eco-spoke-${i})`} pathLength={1} strokeDasharray="1" strokeDashoffset="0" />
          ))}
        </g>

        {/* Nodes */}
        {NODES.map((n, i) =>
          hubSet.has(i) ? null : (
            <g key={i} data-eco-node>
              <circle cx={n.x} cy={n.y} r="13" fill="#2f6bff" fillOpacity="0.12" />
              <circle cx={n.x} cy={n.y} r="5" fill="#070b18" stroke="#8fb0ff" strokeWidth="2" />
            </g>
          ),
        )}
        {HUBS.map((h) => (
          <g key={h} data-eco-hub>
            <circle cx={NODES[h].x} cy={NODES[h].y} r="30" fill="#2f6bff" fillOpacity="0.16" />
            <circle cx={NODES[h].x} cy={NODES[h].y} r="11" fill="#0b1226" stroke="#a9c4ff" strokeWidth="2.5" className="[filter:drop-shadow(0_0_8px_rgb(47_107_255/0.9))]" />
            <circle cx={NODES[h].x} cy={NODES[h].y} r="4" fill="#dbe6ff" />
          </g>
        ))}

        {/* Signals travelling out from the X (motion only) */}
        {HUBS.map((h) => (
          <circle key={h} data-eco-pulse cx={C} cy={C} r="14" fill="url(#eco-pulse)" opacity="0" />
        ))}
      </svg>

      {/* Hub labels */}
      {HUBS.map((h, i) => (
        <span
          key={h}
          className="absolute -translate-x-1/2"
          style={{
            left: `${NODES[h].x / 10}%`,
            top: `${NODES[h].y / 10}%`,
            marginTop: NODES[h].y > C ? "1.6rem" : "-3.1rem",
          }}
        >
          <span
            data-eco-label
            className="block whitespace-nowrap rounded-full border border-blue-400/30 bg-black/70 px-3 py-1 font-mono text-[0.7rem] font-medium tracking-[0.22em] text-silver-100 uppercase shadow-[0_0_18px_-6px_rgb(47_107_255/0.9)]"
          >
            {labels[i]}
          </span>
        </span>
      ))}
    </div>
  );
}
