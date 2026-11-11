import type { StaticImageData } from "next/image";
import { approved, showDrafts, type ContentStatus, type Copy } from "./status";

export const leadershipIntro = {
  title: approved("The People Behind Xentra"),
  /** Supplied as a suggestion — treat as approved once confirmed. */
  subtitle: approved("Driven by vision. Built through collaboration."),
} as const;

export type Founder = {
  /**
   * `approved` only when name, designation, bio AND a genuine photograph are
   * all confirmed by the owner. Draft founders never reach production.
   */
  status: ContentStatus;
  name: Copy;
  /** Confirmed designation only (Founder, Co-Founder, Managing Director, ...). */
  designation: Copy;
  bio: Copy;
  /** Optional — include only if approved. */
  expertise?: readonly string[];
  /**
   * Genuine professional photograph — import from /public/images/team.
   * Never a generated or stock image. Null renders a marked placeholder in
   * draft mode.
   */
  photo: StaticImageData | null;
};

/*
 * PENDING: the number of owners and all of their details.
 * The two slots below are structural placeholders only — they are not
 * names, roles or biographies, and they never render in production.
 */
const pendingOwner = (slot: string): Founder => ({
  status: "draft",
  name: { text: `Owner ${slot} — full name`, status: "draft" },
  designation: { text: "Confirmed designation", status: "draft" },
  bio: {
    text: "Short professional biography (2–3 sentences) to be supplied and approved by the owner.",
    status: "draft",
  },
  expertise: undefined,
  photo: null,
});

export const founders: readonly Founder[] = [pendingOwner("A"), pendingOwner("B")];

/* ---------- Technical Head (featured leadership profile) -------------- */

export type ExpertiseIcon =
  | "web"
  | "code"
  | "design"
  | "motion"
  | "systems"
  | "ai"
  | "performance"
  | "deploy";

export type TechnicalLead = {
  /** APPROVED: supplied by the Technical Head. */
  name: Copy;
  designation: Copy;
  organisation: string;
  intro: Copy;
  expertise: readonly { label: string; icon: ExpertiseIcon }[];
  /** Genuine professional photograph only. PENDING. */
  photo: StaticImageData | null;
};

/**
 * Designation, introduction and expertise are APPROVED (supplied by the
 * Technical Head), as is the name. The photograph is PENDING.
 */
export const technicalHead: TechnicalLead = {
  name: approved("Saidbnu Harif"),
  designation: approved("Technical Head"),
  organisation: "Xentra Technologies",
  intro: approved(
    "Leads the technical direction at Xentra Technologies, transforming business requirements into modern websites, applications and intelligent business solutions.",
  ),
  expertise: [
    { label: "Website Design & Development", icon: "web" },
    { label: "Next.js, React and TypeScript", icon: "code" },
    { label: "UI/UX Design", icon: "design" },
    { label: "GSAP and Advanced Website Animations", icon: "motion" },
    { label: "CRM, ERP and Custom Business Applications", icon: "systems" },
    { label: "AI Integration and Business Automation", icon: "ai" },
    { label: "SEO and Website Performance", icon: "performance" },
    { label: "Technical Architecture and Deployment", icon: "deploy" },
  ],
  photo: null,
};

/**
 * The profile ships to production only once both the name is approved and a
 * genuine photograph is supplied — placeholders are never published.
 * Review builds always show it, with pending items clearly marked.
 */
export const technicalHeadReady =
  technicalHead.name.status === "approved" && technicalHead.photo !== null;
export const technicalHeadVisible = technicalHeadReady || showDrafts;
