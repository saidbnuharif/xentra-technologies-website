"use client";

import { useEffect } from "react";

/**
 * Header scroll state (renders nothing). On the parent <header>:
 *  - data-scrolled="true" once the page has moved past the top;
 *  - data-past-hero="true" once the page's opening section (the first
 *    section in <main>) has scrolled up under the navbar — the floating
 *    pill then turns to white glass;
 *  - --progress: page scroll progress 0–1 for the progress hairline.
 * One passive scroll listener, batched to animation frames.
 */
export function HeaderScroll() {
  useEffect(() => {
    const header = document.querySelector<HTMLElement>("[data-site-header]");
    if (!header) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const hero = document.querySelector("main section");
      // The pill turns to glass a little before the hero's foot reaches it.
      const pastHero = hero ? hero.getBoundingClientRect().bottom <= header.offsetHeight + 24 : window.scrollY > 24;
      header.dataset.scrolled = String(window.scrollY > 24);
      header.dataset.pastHero = String(pastHero);
      header.style.setProperty("--progress", max > 0 ? (window.scrollY / max).toFixed(4) : "0");
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return null;
}
