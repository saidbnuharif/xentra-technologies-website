/*
 * Single GSAP entry point for the site. Import gsap and plugins from here
 * (client components only) so plugins are registered exactly once.
 */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

/** Shared motion vocabulary — keep every section on the same timing feel. */
export const motion = {
  ease: "power3.out",
  duration: 0.9,
  stagger: 0.08,
  /** Distance content rises from, in px. */
  rise: 28,
  /** Where a reveal triggers: element top reaches 85% of the viewport. */
  start: "top 85%",
} as const;

export const MEDIA = {
  motion: "(prefers-reduced-motion: no-preference)",
  desktopMotion: "(min-width: 64rem) and (prefers-reduced-motion: no-preference)",
} as const;

export { gsap, ScrollTrigger, SplitText, useGSAP };
