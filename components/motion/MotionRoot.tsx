"use client";

import { gsap, MEDIA, motion, ScrollTrigger, SplitText, useGSAP } from "./gsap";

/*
 * Site-wide declarative animation layer. Mounted once, after all sections
 * (so pinned sections above it are measured first). Server components opt in
 * with data attributes — no per-section client code needed:
 *
 *   data-reveal                 rise + fade (default)
 *   data-reveal="fade"          fade only
 *   data-reveal="clip"          clip-path wipe upward (portraits, imagery);
 *                               a child [data-reveal-media] settles from 1.08 scale
 *   data-reveal="line"          hairline draws left → right (scaleX)
 *   data-reveal="lines"         heading revealed line by line behind masks
 *   data-reveal-group           container: its [data-reveal] items play in
 *                               DOM order as one staggered sequence
 *   data-parallax="8"           subtle yPercent drift while scrolling (desktop)
 *   data-draw                   SVG path drawn on entry (needs pathLength=1)
 *   data-nav-link               anchor gets aria-current="location" while its
 *                               section is in view (works with reduced motion)
 *
 * Robustness rules:
 *  - Nothing is hidden by CSS. Elements are hidden by JS only if they start
 *    below the fold, so there is no flash, and with no JS everything shows.
 *  - Elements already on screen at load are left untouched.
 *  - Reduced motion: no reveals, no parallax; nav state still works.
 *  - Everything is reverted on unmount via useGSAP + matchMedia.
 */

type Variant = "up" | "fade" | "clip" | "line" | "lines";

const variantOf = (el: Element): Variant =>
  ((el.getAttribute("data-reveal") || "up") as Variant);

/** Builds the entrance tween for one element (paused state = hidden). */
function revealTween(el: HTMLElement): gsap.core.Animation {
  switch (variantOf(el)) {
    case "fade":
      return gsap.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: motion.duration, ease: "power2.out" });
    case "line":
      return gsap.fromTo(
        el,
        { scaleX: 0, transformOrigin: "left center" },
        { scaleX: 1, duration: 1.1, ease: "power3.inOut" },
      );
    case "clip": {
      const tl = gsap.timeline();
      tl.fromTo(
        el,
        { clipPath: "inset(100% 0% 0% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: "power3.inOut" },
      );
      const media = el.querySelector("[data-reveal-media]");
      if (media) tl.fromTo(media, { scale: 1.08 }, { scale: 1, duration: 1.6, ease: "power3.out" }, 0);
      return tl;
    }
    default:
      return gsap.fromTo(
        el,
        { autoAlpha: 0, y: motion.rise },
        { autoAlpha: 1, y: 0, duration: motion.duration, ease: motion.ease },
      );
  }
}

export function MotionRoot() {
  useGSAP(() => {
    const splits: SplitText[] = [];
    const mm = gsap.matchMedia();

    /* Reveals ---------------------------------------------------------- */
    mm.add(MEDIA.motion, () => {
      const fold = window.innerHeight * 0.9;
      const startsBelowFold = (el: Element) => el.getBoundingClientRect().top > fold;
      const grouped = new Set<Element>();

      // Staggered groups.
      gsap.utils.toArray<HTMLElement>("[data-reveal-group]").forEach((group) => {
        const items = [...group.querySelectorAll<HTMLElement>("[data-reveal]")].filter(
          (el) => variantOf(el) !== "lines",
        );
        items.forEach((el) => grouped.add(el));
        if (!startsBelowFold(group) || items.length === 0) return;
        const tl = gsap.timeline({
          scrollTrigger: { trigger: group, start: motion.start, once: true },
        });
        items.forEach((el, i) => tl.add(revealTween(el), i * motion.stagger * 1.5));
      });

      // Single elements (and every "lines" heading).
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        if (grouped.has(el) || !startsBelowFold(el)) return;

        if (variantOf(el) === "lines") {
          splits.push(
            SplitText.create(el, {
              type: "lines",
              mask: "lines",
              autoSplit: true,
              onSplit: (self) =>
                gsap.from(self.lines, {
                  yPercent: 110,
                  duration: 1.05,
                  stagger: 0.09,
                  ease: "power4.out",
                  scrollTrigger: { trigger: el, start: motion.start, once: true },
                }),
            }),
          );
          return;
        }

        gsap.timeline({ scrollTrigger: { trigger: el, start: motion.start, once: true } }).add(revealTween(el));
      });

      // SVG line drawing.
      gsap.utils.toArray<SVGGeometryElement>("[data-draw]").forEach((path) => {
        if (!startsBelowFold(path)) return;
        gsap.fromTo(
          path,
          { strokeDashoffset: "1px" },
          {
            strokeDashoffset: "0px",
            autoRound: false, // offsets are fractions of pathLength=1
            duration: 1.4,
            ease: "power2.inOut",
            scrollTrigger: { trigger: path, start: motion.start, once: true },
          },
        );
      });
    });

    /* Parallax: desktop only, never on revealed elements themselves ----- */
    mm.add(MEDIA.desktopMotion, () => {
      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        const amount = Number(el.dataset.parallax) || 6;
        gsap.fromTo(
          el,
          { yPercent: -amount },
          {
            yPercent: amount,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });
    });

    /* Active navigation link (independent of motion preference) -------- */
    const links = gsap.utils.toArray<HTMLAnchorElement>("[data-nav-link]");
    const ids = [...new Set(links.map((a) => a.hash.slice(1)).filter(Boolean))];
    let current = "";
    const setCurrent = (id: string) => {
      current = id;
      links.forEach((a) => {
        if (id && a.hash === `#${id}`) a.setAttribute("aria-current", "location");
        else a.removeAttribute("aria-current");
      });
    };
    ids.forEach((id) => {
      const section = document.getElementById(id);
      if (!section) return;
      ScrollTrigger.create({
        trigger: section,
        start: "top 45%",
        end: "bottom 45%",
        onToggle: (self) => {
          if (self.isActive) setCurrent(id);
          else if (current === id) setCurrent("");
        },
      });
    });

    // Fonts change text metrics; re-measure every trigger once loaded.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => {
      splits.forEach((split) => split.revert());
      mm.revert();
    };
  });

  return null;
}
