"use client";

import { useEffect, useRef } from "react";

/*
 * Site-wide ambient particle field — electric blue and metallic silver only.
 *
 * One fixed, click-through <canvas> above the page content (sections have
 * opaque backgrounds, so a canvas behind them would never be seen) and below
 * the navbar, mobile menu and WhatsApp button. Particles are small, sparse
 * and low-opacity so text stays fully legible.
 *
 *  - Blue particles glow softly and leave short, faint light trails.
 *  - Silver particles shimmer (slow opacity oscillation).
 *  - Occasional tiny four-point sparkles in blue or silver.
 *  - Colours adapt to the section underneath: luminous on dark tones,
 *    deeper blue / darker silver on light tones, so the effect stays
 *    understated but visible on both.
 *  - ~40 particles on desktop, 30 on tablet, 22 on phones; drawn at ~30fps
 *    below desktop width. Glows are pre-rendered sprites (cheap to stamp).
 *  - prefers-reduced-motion: a static frame, no animation.
 *  - Pauses when the tab is hidden; DPR capped; no dependencies.
 */

type Kind = "blue" | "silver";

type Particle = {
  kind: Kind;
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  phase: number;
  /** Twinkle / wander speed. */
  speed: number;
  /** Parallax depth: how much the particle shifts with page scroll. */
  depth: number;
  trail: { x: number; y: number }[];
};

type Sparkle = { x: number; y: number; kind: Kind; born: number; life: number; size: number };

/* Brand colours as RGB triples (dark-tone / light-tone variants). */
const COLORS = {
  dark: { blue: "90, 139, 255", silver: "214, 220, 229" }, // --xt-blue-400, silver-200
  light: { blue: "31, 86, 224", silver: "95, 104, 120" }, // --xt-blue-600, silver-500
} as const;

const TRAIL_LENGTH = 7;
const TRAIL_EVERY_MS = 70;
/** Below desktop width, draw at ~30fps: the motion is slow, so it looks the same. */
const MOBILE_FRAME_MS = 32;

type Tone = "dark" | "light";

/**
 * Pre-rendered glow sprite (bright core fading to transparent). Stamping a
 * cached sprite is far cheaper than building a radial gradient per particle
 * per frame.
 */
function makeSprite(rgb: string): HTMLCanvasElement {
  const size = 64;
  const sprite = document.createElement("canvas");
  sprite.width = sprite.height = size;
  const c = sprite.getContext("2d");
  if (!c) return sprite;
  const g = c.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, `rgba(${rgb}, 1)`);
  g.addColorStop(0.14, `rgba(${rgb}, 0.9)`);
  g.addColorStop(0.32, `rgba(${rgb}, 0.28)`);
  g.addColorStop(1, `rgba(${rgb}, 0)`);
  c.fillStyle = g;
  c.fillRect(0, 0, size, size);
  return sprite;
}

function countFor(width: number): number {
  if (width >= 1024) return 40;
  if (width >= 640) return 30;
  return 22;
}

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function makeParticle(w: number, h: number, index: number): Particle {
  // Strictly alternating kinds = an even blue / silver balance.
  const kind: Kind = index % 2 === 0 ? "blue" : "silver";
  const angle = rand(0, Math.PI * 2);
  const speed = rand(0.06, 0.16); // px per frame at 60fps — slow, floating
  return {
    kind,
    x: rand(0, w),
    y: rand(0, h),
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed - 0.03, // gentle upward bias
    r: kind === "blue" ? rand(1.1, 2.0) : rand(1.0, 1.8),
    phase: rand(0, Math.PI * 2),
    speed: rand(0.6, 1.4),
    depth: rand(0.04, 0.16),
    trail: [],
  };
}

export function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let width = 0;
    let height = 0;
    let dpr = 1;
    let particles: Particle[] = [];
    let sparkles: Sparkle[] = [];
    let raf = 0;
    let lastTime = 0;
    let lastTrail = 0;
    let lastRender = 0;
    let nextSparkle = 0;
    let lastScroll = window.scrollY;

    /* Light/dark regions of the page, in document coordinates. */
    let regions: { top: number; bottom: number; light: boolean }[] = [];
    const measureRegions = () => {
      regions = [...document.querySelectorAll<HTMLElement>("[class*='tone-']")]
        .filter((el) => !el.closest("header")) // navbar sits above the canvas
        .map((el) => {
          const r = el.getBoundingClientRect();
          return {
            top: r.top + window.scrollY,
            bottom: r.bottom + window.scrollY,
            light: /\btone-(light|white)\b/.test(el.className),
          };
        });
    };
    // Innermost match wins (nested panels like About's dark domain panel).
    const isLightAt = (viewportY: number) => {
      const y = viewportY + window.scrollY;
      let light = false;
      let best = Infinity;
      for (const region of regions) {
        const size = region.bottom - region.top;
        if (y >= region.top && y < region.bottom && size < best) {
          best = size;
          light = region.light;
        }
      }
      return light;
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, width < 640 ? 1.5 : 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const target = countFor(width);
      if (particles.length !== target) {
        particles = Array.from({ length: target }, (_, i) => particles[i] ?? makeParticle(width, height, i));
      }
      measureRegions();
    };

    /* Drawing ----------------------------------------------------------- */

    // One cached glow sprite per colour × tone (4 total).
    const sprites: Record<Tone, Record<Kind, HTMLCanvasElement>> = {
      dark: { blue: makeSprite(COLORS.dark.blue), silver: makeSprite(COLORS.dark.silver) },
      light: { blue: makeSprite(COLORS.light.blue), silver: makeSprite(COLORS.light.silver) },
    };

    const drawParticle = (p: Particle, t: number) => {
      const tone: Tone = isLightAt(p.y) ? "light" : "dark";
      const light = tone === "light";

      let alpha: number;
      let size: number;
      if (p.kind === "blue") {
        // Faint light trail (one path, alpha fades along it).
        if (p.trail.length > 1) {
          const rgb = COLORS[tone].blue;
          ctx.lineWidth = p.r * 0.9;
          for (let i = 1; i < p.trail.length; i++) {
            ctx.strokeStyle = `rgba(${rgb}, ${(i / p.trail.length) * (light ? 0.12 : 0.18)})`;
            ctx.beginPath();
            ctx.moveTo(p.trail[i - 1].x, p.trail[i - 1].y);
            ctx.lineTo(p.trail[i].x, p.trail[i].y);
            ctx.stroke();
          }
        }
        alpha = light ? 0.5 : 0.62;
        size = p.r * 10; // soft glow halo
      } else {
        // Metallic shimmer: slow opacity oscillation, with a smaller halo so
        // silver reads as clearly as blue (a balanced mix, not blue-dominant).
        const shimmer = 0.5 + 0.5 * Math.sin(t * 0.0018 * p.speed + p.phase);
        alpha = light ? 0.35 + shimmer * 0.35 : 0.35 + shimmer * 0.5;
        size = p.r * 9;
      }
      ctx.globalAlpha = alpha;
      ctx.drawImage(sprites[tone][p.kind], p.x - size / 2, p.y - size / 2, size, size);
      ctx.globalAlpha = 1;
    };

    const drawSparkle = (s: Sparkle, t: number) => {
      const age = (t - s.born) / s.life; // 0 → 1
      if (age >= 1) return;
      const strength = Math.sin(age * Math.PI); // fade in, then out
      const light = isLightAt(s.y);
      const rgb = (light ? COLORS.light : COLORS.dark)[s.kind];
      const len = s.size * (0.6 + strength * 0.6);
      ctx.strokeStyle = `rgba(${rgb}, ${strength * (light ? 0.5 : 0.75)})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(s.x - len, s.y);
      ctx.lineTo(s.x + len, s.y);
      ctx.moveTo(s.x, s.y - len);
      ctx.lineTo(s.x, s.y + len);
      ctx.stroke();
    };

    const render = (t: number) => {
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) drawParticle(p, t);
      for (const s of sparkles) drawSparkle(s, t);
    };

    /* Motion ------------------------------------------------------------ */

    const step = (t: number) => {
      // Below desktop width, do no work at all on in-between frames (~30fps);
      // the next step covers the elapsed time via dt, so speed is unchanged.
      if (width < 1024 && t - lastRender < MOBILE_FRAME_MS) {
        raf = requestAnimationFrame(step);
        return;
      }
      lastRender = t;

      const dt = Math.min((t - (lastTime || t)) / 16.67, 3); // frames elapsed, clamped
      lastTime = t;

      // Subtle parallax: particles drift against the scroll by their depth.
      const scrolled = window.scrollY - lastScroll;
      lastScroll = window.scrollY;

      const recordTrail = t - lastTrail > TRAIL_EVERY_MS;
      if (recordTrail) lastTrail = t;

      for (const p of particles) {
        // Gentle wander so paths curve rather than run straight.
        p.vx += Math.sin(t * 0.0004 * p.speed + p.phase) * 0.0015 * dt;
        p.vy += Math.cos(t * 0.0003 * p.speed + p.phase) * 0.0015 * dt;
        const v = Math.hypot(p.vx, p.vy);
        if (v > 0.2) {
          p.vx *= 0.2 / v;
          p.vy *= 0.2 / v;
        }
        p.x += p.vx * dt;
        p.y += p.vy * dt - scrolled * p.depth;

        // Wrap around the edges; a wrapped particle drops its trail.
        const m = 12;
        let wrapped = false;
        if (p.x < -m) { p.x = width + m; wrapped = true; }
        else if (p.x > width + m) { p.x = -m; wrapped = true; }
        if (p.y < -m) { p.y = height + m; wrapped = true; }
        else if (p.y > height + m) { p.y = -m; wrapped = true; }
        if (wrapped) p.trail = [];

        if (p.kind === "blue" && recordTrail) {
          p.trail.push({ x: p.x, y: p.y });
          if (p.trail.length > TRAIL_LENGTH) p.trail.shift();
        }
      }

      // Occasional sparkle: roughly one every 1.2–3 s, never more than 3 alive.
      sparkles = sparkles.filter((s) => t - s.born < s.life);
      if (t > nextSparkle && sparkles.length < 3) {
        const host = particles[Math.floor(Math.random() * particles.length)];
        sparkles.push({ x: host.x, y: host.y, kind: host.kind, born: t, life: rand(500, 900), size: rand(3, 5.5) });
        nextSparkle = t + rand(1200, 3000);
      }

      render(t);
      raf = requestAnimationFrame(step);
    };

    const start = () => {
      cancelAnimationFrame(raf);
      lastTime = 0;
      lastScroll = window.scrollY;
      if (reduced.matches) {
        // Static version: one still frame, re-coloured if layout/scroll changes.
        sparkles = [];
        particles.forEach((p) => (p.trail = []));
        render(performance.now());
        return;
      }
      raf = requestAnimationFrame(step);
    };

    /* Events ------------------------------------------------------------ */

    let staticFrame = 0;
    const onScrollStatic = () => {
      if (!reduced.matches) return;
      cancelAnimationFrame(staticFrame);
      staticFrame = requestAnimationFrame(() => render(performance.now()));
    };
    const onResize = () => {
      resize();
      start();
    };
    const onVisibility = () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else start();
    };

    resize();
    start();

    // Section heights change after fonts load and when pinned sections set up.
    const remeasure = window.setInterval(measureRegions, 2000);
    const ro = new ResizeObserver(() => measureRegions());
    ro.observe(document.body);

    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScrollStatic, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    reduced.addEventListener("change", start);

    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(staticFrame);
      window.clearInterval(remeasure);
      ro.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScrollStatic);
      document.removeEventListener("visibilitychange", onVisibility);
      reduced.removeEventListener("change", start);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-30 h-svh w-screen"
    />
  );
}
