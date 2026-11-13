import { caseStudies } from "./case-studies";
import { founders } from "./founders";
import { reasons } from "./sections";
import { visibleOnly } from "./status";

/** The five main pages (multi-page site). */
export type PageKey = "home" | "about" | "services" | "how-we-work" | "contact";

export type NavItem = { key: PageKey; href: string; label: string };

export const siteNav: readonly NavItem[] = [
  { key: "home", href: "/", label: "Home" },
  { key: "about", href: "/about", label: "About Us" },
  { key: "services", href: "/services", label: "Services" },
  { key: "how-we-work", href: "/how-we-work", label: "How We Work" },
  { key: "contact", href: "/contact", label: "Contact Us" },
];

/** Section ids used for in-page anchors. */
export type SectionId = string;

/** Whether content-dependent blocks render in the current build. */
export const sectionVisible = {
  leadership: visibleOnly(founders).length > 0,
  whyXentra: visibleOnly(reasons).length > 0,
  caseStudies: visibleOnly(caseStudies).length > 0,
} as const;
