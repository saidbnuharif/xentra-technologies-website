import { showContactSection } from "./contact";
import { founders, technicalHeadVisible } from "./founders";
import { projects, reasons, steps } from "./sections";
import { visibleOnly } from "./status";

export type SectionId =
  | "hero"
  | "about"
  | "leadership"
  | "services"
  | "why-xentra"
  | "work"
  | "process"
  | "contact";

export type NavItem = { id: SectionId; label: string };

/**
 * Which sections render in the current build. A section with no approved
 * content is omitted in production (and so is its nav link).
 */
export const sectionVisible: Record<SectionId, boolean> = {
  hero: true,
  about: true,
  leadership: visibleOnly(founders).length > 0 || technicalHeadVisible,
  services: true,
  "why-xentra": visibleOnly(reasons).length > 0,
  work: visibleOnly(projects).length > 0,
  process: visibleOnly(steps).length > 0,
  contact: showContactSection(),
};

const allNavItems: readonly NavItem[] = [
  { id: "about", label: "About" },
  { id: "leadership", label: "Leadership" },
  { id: "services", label: "Services" },
  { id: "why-xentra", label: "Why Xentra" },
  { id: "work", label: "Work" },
  { id: "process", label: "Process" },
  { id: "contact", label: "Contact" },
];

export const navItems: readonly NavItem[] = allNavItems.filter(
  (item) => sectionVisible[item.id],
);
