"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger } from "@/components/motion/gsap";
import { curvePath, sampleByHeight } from "@/components/sections/hero/energy-curve";
import type { MarkScene } from "@/components/sections/hero/mark-scene";
import { MARK_BOX, MARK_FIT } from "@/components/sections/hero/mark-geometry";
import "./x-stage.css";

/*
 * XStage — the site-wide stage for the 3D X (part of SiteShell, so every
 * page has one).
 *
 * Sections mark where the X belongs with empty slots:
 *   <div data-x-slot="name" data-x-claim="start | curve | view">
 * each holding the SVG poster of the mark (no-JS / no-WebGL / reduced
 * motion). ONE WebGL canvas per page ([data-x-host]) shows the 3D X in the
 * active slot: the last slot, in page order, whose claim has been met.
 *
 *   start — the X is there from the first frame (Home hero). As the page
 *           scrolls away it sinks and dissolves into light (scene.setExit).
 *   curve — claimed when the energy curve's head reaches its centre (Home
 *           About). The curve runs from the start slot to this slot; the
 *           section windows onto it are [data-x-curve] layers.
 *   view  — claimed when its centre scrolls up to CLAIM_AT in the viewport
 *           (the contact finale at the foot of every main page).
 *
 * The canvas only moves while the X is invisible (dissolved, shrunk away
 * or off screen) and pops up at its new slot, so nothing jumps. Scrolling
 * back reverses. three.js loads only when a slot comes near the viewport.
 *
 * No WebGL: the posters perform the same exit / pop. Reduced motion: the
 * finished state everywhere — the 3D X static in the first slot, posters in
 * the others, the curve fully drawn. No JS: posters only, no curve.
 */

/** The curve-claimed X pops up when its centre reaches this height in the
 *  viewport (0 top, 1 bottom); after that the curve's head stays there. */
const HEAD_AT = 0.6;
/** View-claimed slots pop up when their centre reaches this height. */
const CLAIM_AT = 0.68;
/** The start X has dissolved after this much scrolling (× viewport). */
const EXIT_SPAN = 0.62;

type Claim = "start" | "curve" | "view";

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smoothstep = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};

export function XStage({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = root.current;
    const host = stage?.querySelector<HTMLElement>(":scope > [data-x-host]");
    const canvas = host?.querySelector("canvas");
    if (!stage || !host || !canvas) return;
    const slots = [...stage.querySelectorAll<HTMLElement>("[data-x-slot]")].map((el) => ({
      el,
      claim: (el.dataset.xClaim as Claim) || "view",
      poster: el.querySelector<SVGSVGElement>("[data-mark-poster]"),
    }));
    if (!slots.length) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const touch = window.matchMedia("(hover: none), (pointer: coarse)").matches;
    stage.dataset.xCtl = "";

    const startIndex = slots.findIndex((s) => s.claim === "start");
    const curveIndex = slots.findIndex((s) => s.claim === "curve");
    const hasCurve = startIndex >= 0 && curveIndex > startIndex;
    // Reduced motion: the 3D X stays in the first slot; the rest are posters.
    slots.forEach((s, i) => (s.el.dataset.poster = reduced ? (i === 0 ? "hide" : "show") : i === 0 && s.claim === "start" ? "" : "hide"));
    if (slots[0].el.dataset.poster === "") delete slots[0].el.dataset.poster; // CSS: hidden while 3D loads

    let mode: "loading" | "webgl" | "poster" = "loading";
    let active = reduced ? 0 : startIndex >= 0 ? startIndex : -1;
    let placed = -1; // slot the canvas currently sits over
    let moving = false;
    let scene: MarkScene | null = null;
    let disposed = false;
    let exitAmount = 0;

    /* --- Geometry ------------------------------------------------------- */

    const rel = (el: Element) => {
      const s = stage.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      return { x: r.left - s.left, y: r.top - s.top, w: r.width, h: r.height };
    };
    const centre = (el: Element) => {
      const r = rel(el);
      return { x: r.x + r.w / 2, y: r.y + r.h / 2 };
    };

    /** Canvas over a slot. The start slot (hero) gets the whole section: a
     *  full-bleed 3D environment behind the hero text, with the X fitted to
     *  its slot. Pop-up slots get the slot plus a margin, so the overshoot
     *  and its light are never cut off. data-slot-* tell the scene where the
     *  slot sits inside the canvas. */
    const placeHost = (index: number) => {
      placed = index;
      if (index < 0) {
        delete host.dataset.at;
        return;
      }
      const slot = slots[index];
      const r = rel(slot.el);
      // Full-bleed only on desktop: on phones and tablets the canvas keeps
      // to the slot plus a margin (half the pixels for the GPU), with the
      // environment still drawn around the X.
      const start = slot.claim === "start";
      const full = start && window.innerWidth >= 1024 ? rel(slot.el.closest("section") ?? slot.el) : null;
      const pad = full ? 0 : Math.round(Math.min(r.w, r.h) * 0.1);
      const box = full ?? { x: r.x - pad, y: r.y - pad, w: r.w + pad * 2, h: r.h + pad * 2 };
      host.style.left = `${box.x}px`;
      host.style.top = `${box.y}px`;
      host.style.width = `${box.w}px`;
      host.style.height = `${box.h}px`;
      host.dataset.slotX = String(Math.round(r.x - box.x));
      host.dataset.slotY = String(Math.round(r.y - box.y));
      host.dataset.slotW = String(Math.round(r.w));
      host.dataset.slotH = String(Math.round(r.h));
      host.dataset.at = slot.el.dataset.xSlot ?? String(index);
      if (full) host.dataset.full = "";
      else delete host.dataset.full;
      scene?.setEnvironment(start);
      scene?.redraw();
    };

    /* --- Energy curve (start slot → curve slot) ------------------------- */

    const curves = hasCurve ? [...stage.querySelectorAll<SVGSVGElement>("[data-x-curve]")] : [];
    const paths = curves.flatMap((svg) => [...svg.querySelectorAll<SVGPathElement>("[data-x-curve-path]")]);
    const heads = curves.flatMap((svg) => [...svg.querySelectorAll<SVGCircleElement>("[data-x-curve-head]")]);
    const probe = paths[0];
    let total = 0;
    let lengthAtY = (y: number) => y * 0;
    let curveLength = Infinity;
    let startY = 0;
    let curveY = 0;
    let curveReached = false;

    const layoutCurve = () => {
      if (!hasCurve || !probe) return;
      const from = slots[startIndex].el;
      const to = slots[curveIndex].el;
      const fromSection = rel(from.closest("section") ?? from);
      const toSection = rel(to.closest("section") ?? to);
      // The curve leaves from just beneath the start X (never across it).
      const fr = rel(from);
      const markH = Math.min(fr.h / MARK_FIT.h, (fr.w / MARK_FIT.w) * (MARK_BOX.height / MARK_BOX.width));
      const S = { x: fr.x + fr.w / 2, y: fr.y + fr.h / 2 + markH * 0.42 };
      const A = centre(to);
      startY = S.y;
      curveY = A.y;
      const d = curvePath({
        width: stage.clientWidth,
        hero: S,
        heroBottom: fromSection.y + fromSection.h,
        about: A,
        aboutHalf: rel(to).h / 2,
        aboutTop: toSection.y,
        aboutBottom: toSection.y + toSection.h,
        compact: window.innerWidth < 1024,
      });
      curves.forEach((svg) => {
        const r = rel(svg.closest("section") ?? svg);
        svg.setAttribute("viewBox", `${r.x} ${r.y} ${Math.max(1, r.w)} ${Math.max(1, r.h)}`);
      });
      paths.forEach((p) => p.setAttribute("d", d));
      const sampled = sampleByHeight(probe);
      total = sampled.total;
      lengthAtY = sampled.lengthAtY;
      curveLength = lengthAtY(A.y);
      paths.forEach((p) => (p.style.strokeDasharray = `${total} ${total + 2}`));
    };

    const head = { len: 0 };
    const drawCurve = () => {
      if (!probe) return;
      const len = Math.min(total, head.len);
      const offset = String(total - len);
      paths.forEach((p) => (p.style.strokeDashoffset = offset));
      const pt = probe.getPointAtLength(len);
      const show = reduced ? 0 : clamp01(len / 40) * clamp01((total - len) / 160);
      heads.forEach((h) => {
        h.setAttribute("cx", pt.x.toFixed(1));
        h.setAttribute("cy", pt.y.toFixed(1));
        h.setAttribute("opacity", show.toFixed(2));
      });
      if (reduced) return;
      const reached = curveReached ? len >= curveLength - 40 : len >= curveLength;
      if (reached !== curveReached) {
        curveReached = reached;
        sync();
      }
    };
    const toHead = gsap.quickTo(head, "len", { duration: touch ? 0.3 : 0.5, ease: "power3.out", onUpdate: drawCurve });

    /* --- Posters (no WebGL) --------------------------------------------- */

    const posterExit = (e: number) => {
      const poster = slots[startIndex]?.poster;
      if (!poster) return;
      gsap.set(poster, { scale: 1 - 0.4 * e, y: e * 50, opacity: 1 - smoothstep(0.35, 0.95, e), transformOrigin: "50% 50%" });
    };
    const posterPop = (index: number, show: boolean) => {
      const poster = slots[index]?.poster;
      if (!poster || slots[index].claim === "start") return;
      if (show)
        gsap.fromTo(poster, { scale: 0.05, opacity: 0, transformOrigin: "50% 50%" }, { scale: 1, opacity: 1, duration: 0.95, ease: "back.out(1.7)", overwrite: true });
      else gsap.to(poster, { scale: 0.05, opacity: 0, duration: 0.32, ease: "power2.in", overwrite: true });
    };

    /* --- Active slot ----------------------------------------------------- */

    const claimed = () => {
      const vh = window.innerHeight;
      let index = -1;
      slots.forEach((s, i) => {
        if (s.claim === "start") index = i;
        else if (s.claim === "curve" && curveReached) index = i;
        else if (s.claim === "view") {
          const r = s.el.getBoundingClientRect();
          const mid = r.top + r.height / 2;
          // Hysteresis: once claimed, it lets go a little lower.
          if (mid <= vh * (i === active ? CLAIM_AT + 0.08 : CLAIM_AT)) index = i;
        }
      });
      return index;
    };

    /** Settle the canvas at slot `index` without a pop (it is off screen, or
     *  the start X re-forming as the page scrolls back up). */
    const settleAt = (index: number) => {
      placeHost(index);
      scene?.setExit(index === startIndex ? exitAmount : 0, true);
    };

    const sync = () => {
      if (reduced) return;
      const next = claimed();
      if (next === active) return;
      const prev = active;
      active = next;
      if (prev >= 0 && slots[prev].claim !== "start") delete slots[prev].el.dataset.xPopped;
      if (next >= 0 && slots[next].claim !== "start") slots[next].el.dataset.xPopped = "";
      // Page-level flag (Home About network traces etc.).
      if (slots.some((s) => "xPopped" in s.el.dataset)) stage.dataset.xPopped = "";
      else delete stage.dataset.xPopped;

      if (mode === "poster") {
        if (prev >= 0) posterPop(prev, false);
        if (next >= 0) posterPop(next, true);
        if (next === startIndex) posterExit(exitAmount);
        return;
      }
      if (mode !== "webgl" || !scene) return;
      const s = scene;
      const arrive = () => {
        moving = false;
        if (disposed || active !== next) return;
        if (next < 0) placeHost(-1);
        else if (slots[next].claim === "start") settleAt(next);
        else if (next < prev) settleAt(next); // going back up: it is already there
        else {
          placeHost(next);
          s.popIn();
        }
      };
      // Leave the current slot: the start X is already dissolved; others
      // shrink away first (only visible if that slot is still on screen).
      const leaving = placed >= 0 && slots[placed].claim !== "start" && isOnScreen(slots[placed].el);
      if (leaving) {
        moving = true;
        s.popOut(arrive);
      } else arrive();
    };

    const isOnScreen = (el: Element) => {
      const r = el.getBoundingClientRect();
      return r.bottom > 0 && r.top < window.innerHeight;
    };

    /* --- One scroll reading drives everything ----------------------------- */

    const update = (immediate = false) => {
      const vh = window.innerHeight;
      if (startIndex >= 0) {
        const scrolled = -slots[startIndex].el.closest("section")!.getBoundingClientRect().top;
        exitAmount = clamp01(scrolled / (vh * EXIT_SPAN));
        if (active === startIndex && !moving) {
          if (mode === "webgl") scene?.setExit(exitAmount, immediate);
          else if (mode === "poster") posterExit(exitAmount);
        }
      }
      if (hasCurve && probe) {
        const scrolled = -stage.getBoundingClientRect().top;
        // Head height: at rest it sits under the start X (hidden); scrolling
        // carries it down so it reaches the curve slot exactly as that slot
        // arrives at HEAD_AT in the viewport, then it keeps that height.
        const popScroll = curveY - vh * HEAD_AT;
        const y = scrolled < popScroll && popScroll > 0 ? startY + (curveY - startY) * clamp01(scrolled / popScroll) : scrolled + vh * HEAD_AT;
        const target = lengthAtY(y);
        if (immediate) {
          toHead(target, target);
          head.len = target;
          drawCurve();
        } else toHead(target);
      }
      sync();
    };

    const layout = () => {
      layoutCurve();
      if (reduced && probe) {
        head.len = total;
        drawCurve();
      }
      if (mode === "webgl" && !moving) placeHost(placed);
    };

    layout();
    if (reduced) {
      if (hasCurve) stage.dataset.xPopped = "";
      slots.forEach((s, i) => i > 0 && (s.el.dataset.xPopped = ""));
    }
    const trigger = reduced
      ? null
      : ScrollTrigger.create({ trigger: stage, start: "top bottom", end: "bottom top", onUpdate: () => update() });
    // After every refresh (pins and their spacers settled), re-measure.
    const onRefresh = () => {
      layout();
      if (!reduced) update(true);
    };
    ScrollTrigger.addEventListener("refresh", onRefresh);
    if (!reduced) update(true);
    const observer = new ResizeObserver(onRefresh);
    observer.observe(stage);
    slots.forEach((s) => observer.observe(s.el));

    /* --- Mount the 3D scene once a slot comes near ---------------------- */

    const switchToPosters = () => {
      if (disposed) return;
      mode = "poster";
      scene?.dispose();
      scene = null;
      delete host.dataset.ready;
      placeHost(-1);
      slots.forEach((s) => (s.el.dataset.poster = reduced ? "show" : "js"));
      if (reduced) return;
      slots.forEach((s, i) => {
        if (!s.poster) return;
        if (s.claim === "start") posterExit(i === active ? exitAmount : 1);
        else gsap.set(s.poster, { opacity: i === active ? 1 : 0, scale: 1, transformOrigin: "50% 50%" });
      });
    };

    const mount = async () => {
      try {
        const test = document.createElement("canvas");
        if (!test.getContext("webgl2") && !test.getContext("webgl")) return switchToPosters();
        const { createMarkScene } = await import("@/components/sections/hero/mark-scene");
        if (disposed) return;
        placeHost(active);
        scene = createMarkScene(canvas, host, {
          reducedMotion: reduced,
          finePointer: window.matchMedia("(hover: hover) and (pointer: fine)").matches,
          lowPower: window.matchMedia("(max-width: 63.99rem)").matches,
          environment: active >= 0 && slots[active].claim === "start",
          onFallback: switchToPosters,
        });
        if (!scene) return switchToPosters();
        mode = "webgl";
        host.dataset.ready = "";
        slots.forEach((s, i) => (s.el.dataset.poster = reduced && i > 0 ? "show" : "hide"));
        if (reduced) return;
        if (active >= 0 && slots[active].claim !== "start") scene.popIn();
        else scene.setExit(exitAmount, true);
      } catch {
        switchToPosters();
      }
    };

    // Load three.js when idle once any slot is within a screen of view.
    let handle = 0;
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1));
    const cancelIdle = window.cancelIdleCallback ?? window.clearTimeout;
    const near = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        near.disconnect();
        handle = idle(() => void mount(), { timeout: 500 });
      },
      { rootMargin: "100% 0px" },
    );
    slots.forEach((s) => near.observe(s.el));

    return () => {
      disposed = true;
      near.disconnect();
      cancelIdle(handle);
      trigger?.kill();
      ScrollTrigger.removeEventListener("refresh", onRefresh);
      observer.disconnect();
      gsap.killTweensOf(head);
      slots.forEach((s) => {
        if (s.poster) {
          gsap.killTweensOf(s.poster);
          gsap.set(s.poster, { clearProps: "all" });
        }
        delete s.el.dataset.poster;
        delete s.el.dataset.xPopped;
      });
      scene?.dispose();
      for (const key of ["xCtl", "xPopped"]) delete stage.dataset[key];
      for (const key of ["ready", "at", "full", "slotX", "slotY", "slotW", "slotH"]) delete host.dataset[key];
    };
  }, []);

  return (
    <div ref={root} data-x-stage className="relative overflow-x-clip">
      {children}
      {/* The one 3D canvas, positioned over the active X slot. */}
      <div data-x-host aria-hidden className="pointer-events-none absolute z-[1]">
        <canvas className="absolute inset-0 size-full" />
      </div>
    </div>
  );
}
