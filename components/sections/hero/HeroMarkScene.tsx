"use client";

import { useEffect, useRef } from "react";
import type { MarkScene } from "./mark-scene";

/**
 * Mounts the 3D X mark (mark-scene.ts) into a canvas once the page is idle.
 * three.js is loaded with a dynamic import, so it never delays the first
 * paint or the headline. The parent [data-hero-mark] gets
 * data-mark-state="ready" once the scene renders, or "fallback" if WebGL is
 * unavailable — hero-mark.css then keeps the SVG poster on screen instead.
 */
export function HeroMarkScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.closest<HTMLElement>("[data-hero-mark]");
    if (!canvas || !host) return;

    let scene: MarkScene | null = null;
    let cancelled = false;
    const fallback = () => {
      host.dataset.markState = "fallback";
    };

    const mount = async () => {
      try {
        const probe = document.createElement("canvas");
        if (!probe.getContext("webgl2") && !probe.getContext("webgl")) return fallback();
        const { createMarkScene } = await import("./mark-scene");
        if (cancelled) return;
        scene = createMarkScene(canvas, host, {
          reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
          finePointer: window.matchMedia("(hover: hover) and (pointer: fine)").matches,
          lowPower: window.matchMedia("(max-width: 63.99rem)").matches,
          onFallback: fallback,
        });
        if (!scene) return fallback();
        host.dataset.markState = "ready";
      } catch {
        fallback();
      }
    };

    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1));
    const cancelIdle = window.cancelIdleCallback ?? window.clearTimeout;
    const handle = idle(() => void mount(), { timeout: 500 });

    return () => {
      cancelled = true;
      cancelIdle(handle);
      scene?.dispose();
      delete host.dataset.markState;
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden data-mark-canvas className="absolute inset-0 size-full" />;
}
