"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "@/components/motion/gsap";
import { MarkPoster } from "@/components/sections/hero/MarkPoster";
import { MARK_BOX, MARK_FIT } from "@/components/sections/hero/mark-geometry";
import { registerXTransition, type XTransitionRequest } from "./x-transition-store";
import "./x-transition.css";

const MARK_ASPECT = `${MARK_BOX.width * MARK_FIT.w} / ${MARK_BOX.height * MARK_FIT.h}`;

/*
 * The Xentra X page transition (root layout, so it survives navigation).
 *
 * 1. Light: a soft white / icy-blue field grows from the clicked element
 *    until it fills the screen.
 * 2. The X: the mark resolves in the centre out of a blur, rings of light
 *    ripple from it and a blue highlight sweeps across.
 * 3. The route changes underneath; once the new page (and its #section,
 *    if any) is in the DOM it is scrolled into place and focused.
 * 4. Reveal: the X moves towards the viewer and dissolves as the field
 *    fades, uncovering the destination.
 * Requested via playXTransition. Reduced motion: never runs (links
 * navigate as normal). A safety timeout reveals the page if the route
 * takes too long.
 */
export function XTransition() {
  const router = useRouter();
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const q = gsap.utils.selector(el);
    const [bg] = q("[data-xt-bg]");
    const [mark] = q("[data-xt-mark]");
    const [sweep] = q("[data-xt-sweep]");
    const rings = q("[data-xt-ring]");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let busy = false;
    let tl: gsap.core.Timeline | null = null;
    let wait = 0;

    const finish = () => {
      busy = false;
      el.dataset.active = "false";
      gsap.set(el, { autoAlpha: 0 });
      gsap.set([bg, mark, sweep, ...rings], { clearProps: "all" });
    };

    /** The new page is in: put its target in place, then uncover it. */
    const reveal = (hash: string) => {
      cancelAnimationFrame(wait);
      const target = hash ? document.getElementById(decodeURIComponent(hash)) : null;
      if (target) {
        target.scrollIntoView({ block: "start", behavior: "instant" });
        if (!target.matches("a, button, input, select, textarea, [tabindex]")) target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
      } else window.scrollTo({ top: 0, behavior: "instant" });
      tl?.kill();
      tl = gsap
        .timeline({ onComplete: finish })
        .to(mark, { scale: 1.6, autoAlpha: 0, filter: "blur(10px)", duration: 0.7, ease: "power2.in" }, 0.05)
        .to(sweep, { autoAlpha: 0, duration: 0.3 }, 0)
        .to(bg, { autoAlpha: 0, duration: 0.75, ease: "power2.inOut" }, 0.25);
    };

    /** Poll until the route and its target exist (max ~5s). */
    const arrive = (path: string, hash: string) => {
      const started = performance.now();
      const check = () => {
        const here = window.location.pathname === path;
        const ready = here && (!hash || document.getElementById(decodeURIComponent(hash)));
        if (ready || performance.now() - started > 5000) {
          // Two frames for the page's own layout effects to settle.
          wait = requestAnimationFrame(() => (wait = requestAnimationFrame(() => reveal(hash))));
          return;
        }
        wait = requestAnimationFrame(check);
      };
      check();
    };

    const play = ({ href, origin }: XTransitionRequest) => {
      if (busy || reduced.matches) return false;
      busy = true;
      const url = new URL(href, window.location.href);
      const hash = url.hash.slice(1);
      router.prefetch(url.pathname);
      const ox = ((origin.x / window.innerWidth) * 100).toFixed(1);
      const oy = ((origin.y / window.innerHeight) * 100).toFixed(1);
      el.dataset.active = "true";
      gsap.set(el, { autoAlpha: 1 });
      tl?.kill();
      tl = gsap
        .timeline()
        .fromTo(bg, { clipPath: `circle(0% at ${ox}% ${oy}%)` }, { clipPath: `circle(150% at ${ox}% ${oy}%)`, duration: 0.8, ease: "power3.inOut" }, 0.3)
        .fromTo(mark, { autoAlpha: 0, scale: 0.62, filter: "blur(12px)" }, { autoAlpha: 1, scale: 1, filter: "blur(0px)", duration: 0.7, ease: "power3.out" }, 0.62)
        .fromTo(rings, { scale: 0.45, autoAlpha: 0.7 }, { scale: 1.9, autoAlpha: 0, duration: 1.3, ease: "power2.out", stagger: 0.22 }, 0.72)
        .fromTo(sweep, { xPercent: -140, autoAlpha: 0 }, { xPercent: 140, autoAlpha: 1, duration: 0.9, ease: "power2.inOut" }, 0.82)
        .add(() => {
          router.push(url.pathname + url.search + url.hash, { scroll: false });
          arrive(url.pathname, hash);
        }, 1.15);
      return true;
    };

    const unregister = registerXTransition(play);
    return () => {
      unregister();
      cancelAnimationFrame(wait);
      tl?.kill();
    };
  }, [router]);

  return (
    <div ref={root} aria-hidden data-active="false" className="xt-overlay">
      <div data-xt-bg className="xt-bg absolute inset-0" />
      <div className="absolute inset-0 grid place-items-center">
        <div className="relative w-[min(52vw,17rem)]" style={{ aspectRatio: MARK_ASPECT }}>
          <span data-xt-ring className="xt-ring" />
          <span data-xt-ring className="xt-ring" />
          <div data-xt-mark className="absolute inset-0">
            <MarkPoster id="xt-mark" />
          </div>
          <span data-xt-sweep className="xt-sweep" />
        </div>
      </div>
    </div>
  );
}
