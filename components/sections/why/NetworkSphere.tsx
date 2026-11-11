"use client";

import { useRef } from "react";
import { gsap, MEDIA, ScrollTrigger, useGSAP } from "@/components/motion/gsap";
import {
  C,
  LABELS,
  LATITUDES,
  LINKS,
  MERIDIAN_COUNT,
  meridianPath,
  NODES,
  project,
  R,
  STATIC_YAW,
  VIEW,
} from "./sphere-geometry";

/*
 * Why Xentra visual: a wireframe network sphere — latitude and meridian
 * lines, connected nodes, an orbit ring with travelling light, and four
 * labels for the areas Xentra works across (strategy, technology,
 * automation, growth — all confirmed services).
 *
 * Server-rendered at a fixed angle, so it is complete without JavaScript
 * and for reduced motion. With motion allowed, the sphere turns slowly
 * (GSAP ticker, only while on screen), the labels float, and on first view
 * the sphere grows in while the connectors draw. Decorative: aria-hidden.
 */

const ORBIT = { rx: R + 50, ry: (R + 50) * 0.26, tilt: -16 };

function orbitPoint(angle: number) {
  const x = ORBIT.rx * Math.cos(angle);
  const y = ORBIT.ry * Math.sin(angle);
  const a = (ORBIT.tilt * Math.PI) / 180;
  return { x: C + x * Math.cos(a) - y * Math.sin(a), y: C + x * Math.sin(a) + y * Math.cos(a), front: Math.sin(angle) > 0 };
}

export function NetworkSphere() {
  const root = useRef<HTMLDivElement>(null);
  const initial = NODES.map((n) => project(n.lat, n.lon, STATIC_YAW));
  const comets = [0.4, 3.4].map(orbitPoint);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();

      mm.add(MEDIA.motion, () => {
        const q = gsap.utils.selector(el);
        const meridians = q("[data-meridian]");
        const nodes = q("[data-node]");
        const links = q("[data-link]");
        const cometEls = q("[data-comet]");
        let t = STATIC_YAW;
        let orbit = 0;

        const draw = (dt: number) => {
          t += dt * 0.14;
          orbit += dt * 0.45;
          meridians.forEach((m, k) => m.setAttribute("d", meridianPath(k, t)));
          const pts = NODES.map((n) => project(n.lat, n.lon, t));
          nodes.forEach((c, i) => {
            const p = pts[i];
            c.setAttribute("cx", p.x.toFixed(1));
            c.setAttribute("cy", p.y.toFixed(1));
            c.setAttribute("opacity", (0.18 + 0.82 * Math.max(0, p.z)).toFixed(2));
          });
          links.forEach((l, k) => {
            const [a, b] = LINKS[k];
            const pa = pts[a];
            const pb = pts[b];
            l.setAttribute("x1", pa.x.toFixed(1));
            l.setAttribute("y1", pa.y.toFixed(1));
            l.setAttribute("x2", pb.x.toFixed(1));
            l.setAttribute("y2", pb.y.toFixed(1));
            l.setAttribute("opacity", (0.06 + 0.5 * Math.max(0, (pa.z + pb.z) / 2)).toFixed(2));
          });
          cometEls.forEach((c, i) => {
            const p = orbitPoint(orbit + i * Math.PI);
            c.setAttribute("transform", `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`);
            c.setAttribute("opacity", p.front ? "1" : "0.25");
          });
        };

        // Turn only while the sphere is on screen.
        const tick = (_time: number, deltaMs: number) => draw(Math.min(deltaMs, 50) / 1000);
        const st = ScrollTrigger.create({
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => (self.isActive ? gsap.ticker.add(tick) : gsap.ticker.remove(tick)),
        });

        // First view: sphere grows in, connectors draw, labels arrive.
        const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 80%", once: true } });
        tl.from(q("[data-sphere]"), { scale: 0.86, autoAlpha: 0, transformOrigin: "50% 50%", duration: 1.2, ease: "power3.out" })
          .from(q("[data-connector]"), { strokeDashoffset: 1, duration: 0.7, stagger: 0.1, ease: "power2.out" }, 0.45)
          .from(q("[data-chip]"), { autoAlpha: 0, y: 12, duration: 0.6, stagger: 0.1, ease: "power3.out" }, 0.6);

        // Labels drift gently, each on its own rhythm.
        q("[data-chip-float]").forEach((chip, i) => {
          gsap.to(chip, { y: i % 2 ? 6 : -6, duration: 3.2 + i * 0.4, ease: "sine.inOut", repeat: -1, yoyo: true });
        });

        return () => {
          gsap.ticker.remove(tick);
          st.kill();
        };
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} aria-hidden className="relative mx-auto aspect-square w-full max-w-[34rem] select-none">
      <svg viewBox={`0 0 ${VIEW} ${VIEW}`} className="absolute inset-0 size-full overflow-visible">
        <defs>
          <radialGradient id="ns-atmosphere">
            <stop offset="0.55" stopColor="#2f6bff" stopOpacity="0.22" />
            <stop offset="1" stopColor="#2f6bff" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="ns-body" cx="0.38" cy="0.32" r="0.75">
            <stop offset="0" stopColor="#1c2f6b" />
            <stop offset="0.6" stopColor="#0b1226" />
            <stop offset="1" stopColor="#050913" />
          </radialGradient>
        </defs>

        <g data-sphere>
          <circle cx={C} cy={C} r={R + 60} fill="url(#ns-atmosphere)" />
          <circle cx={C} cy={C} r={R} fill="url(#ns-body)" />
          {LATITUDES.map((l, i) => (
            <ellipse key={i} cx={l.cx} cy={l.cy} rx={l.rx} ry={l.ry} fill="none" stroke="#cfd5de" strokeOpacity="0.1" />
          ))}
          {Array.from({ length: MERIDIAN_COUNT }, (_, k) => (
            <path key={k} data-meridian d={meridianPath(k, STATIC_YAW)} fill="none" stroke="#5a8bff" strokeOpacity="0.16" />
          ))}
          {LINKS.map(([a, b], k) => (
            <line
              key={k}
              data-link
              x1={initial[a].x}
              y1={initial[a].y}
              x2={initial[b].x}
              y2={initial[b].y}
              stroke="#5a8bff"
              strokeWidth="0.8"
              opacity={0.06 + 0.5 * Math.max(0, (initial[a].z + initial[b].z) / 2)}
            />
          ))}
          {initial.map((p, i) => (
            <circle
              key={i}
              data-node
              cx={p.x}
              cy={p.y}
              r={i % 5 === 0 ? 2.6 : 1.7}
              fill={i % 5 === 0 ? "#cfe0ff" : "#7fa6ff"}
              opacity={0.18 + 0.82 * Math.max(0, p.z)}
            />
          ))}
          {/* Rim light */}
          <circle cx={C} cy={C} r={R} fill="none" stroke="#5a8bff" strokeOpacity="0.55" strokeWidth="1.2" className="[filter:drop-shadow(0_0_6px_rgb(47_107_255/0.8))]" />

          {/* Orbit ring with travelling light */}
          <ellipse
            cx={C}
            cy={C}
            rx={ORBIT.rx}
            ry={ORBIT.ry}
            transform={`rotate(${ORBIT.tilt} ${C} ${C})`}
            fill="none"
            stroke="#5a8bff"
            strokeOpacity="0.45"
            strokeWidth="1"
          />
          {comets.map((p, i) => (
            <g key={i} data-comet transform={`translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`} opacity={p.front ? 1 : 0.25}>
              <circle r="9" fill="#2f6bff" opacity="0.25" />
              <circle r="3" fill="#dbe6ff" />
            </g>
          ))}
        </g>

        {/* Label connectors */}
        {LABELS.map((l) => (
          <g key={l.text}>
            <path
              data-connector
              d={`M${l.anchor.x.toFixed(1)} ${l.anchor.y.toFixed(1)} L${(l.chip.x * 4).toFixed(1)} ${(l.chip.y * 4).toFixed(1)}`}
              pathLength={1}
              strokeDasharray="1"
              stroke="#5a8bff"
              strokeOpacity="0.6"
              fill="none"
            />
            <circle cx={l.anchor.x} cy={l.anchor.y} r="3.5" fill="#93b3ff" className="[filter:drop-shadow(0_0_4px_rgb(47_107_255/0.9))]" />
          </g>
        ))}
      </svg>

      {LABELS.map((l) => (
        // Three layers so CSS centring and the two GSAP motions never share
        // an element (GSAP owns `transform` on the inner two).
        <div
          key={l.text}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${l.chip.x}%`, top: `${l.chip.y}%` }}
        >
          <div data-chip>
            <span
              data-chip-float
              className="block rounded-md border border-white/12 bg-navy-950/80 px-3 py-1.5 font-mono text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-silver-100 shadow-[0_0_20px_-6px_rgb(47_107_255/0.6)] backdrop-blur-sm sm:text-label"
            >
              {l.text}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
