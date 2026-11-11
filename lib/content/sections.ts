import { approved, draft, type Copy, type ContentStatus } from "./status";
import type { ServiceVisual } from "./legacy-services";

/* ---------- Why Xentra ------------------------------------------------- */

export type Reason = { status: ContentStatus; title: Copy; body: Copy };

/** DRAFT proposals — every differentiator needs Xentra's confirmation. */
export const reasons: readonly Reason[] = [
  {
    status: "draft",
    title: draft("One partner, end to end"),
    body: draft(
      "Your website, marketing, automation and business software are planned together instead of being split across several providers.",
    ),
  },
  {
    status: "draft",
    title: draft("Practical, not just technical"),
    body: draft(
      "Recommendations are based on what will move your business forward, explained in plain language.",
    ),
  },
  {
    status: "draft",
    title: draft("Built around your goals"),
    body: draft(
      "Every engagement starts with understanding your business, your customers and your priorities.",
    ),
  },
  {
    status: "draft",
    title: draft("Support beyond launch"),
    body: draft(
      "Guidance and improvements after delivery, so the solution keeps working for you. (Confirm the support Xentra offers.)",
    ),
  },
];

/* ---------- Selected Work ---------------------------------------------- */

export type Project = {
  status: ContentStatus;
  title: Copy;
  client: Copy | null;
  summary: Copy;
  services: readonly string[];
  /** Real project imagery only (none approved yet). */
  image: null;
  /**
   * Illustrative mockup shown in review builds until real imagery exists.
   * Always labelled on screen as a concept, never as client work.
   */
  conceptVisual: ServiceVisual;
};

/** PENDING: no approved projects yet. Section is hidden in production. */
export const projects: readonly Project[] = [
  {
    status: "draft",
    title: draft("Project title"),
    client: draft("Client name (with permission)"),
    summary: draft("The challenge, what was built and how it helped — qualitative unless results are verified."),
    services: ["Website Development"],
    image: null,
    conceptVisual: "website",
  },
  {
    status: "draft",
    title: draft("Project title"),
    client: draft("Client name (with permission)"),
    summary: draft("The challenge, what was built and how it helped — qualitative unless results are verified."),
    services: ["CRM & Business Software"],
    image: null,
    conceptVisual: "crm",
  },
];

/* ---------- How We Work ------------------------------------------------ */

/**
 * The five stages from the Xentra team (names APPROVED). Each stage's
 * explanation is PENDING — it comes from the Website Handoff document and
 * must not promise outcomes or guarantees.
 */
export type Step = { title: Copy; body: Copy };

const stage = (title: string): Step => ({
  title: approved(title),
  body: draft(`Explanation of "${title}" — to be taken from the Website Handoff document.`),
});

export const steps: readonly Step[] = [
  stage("Understand"),
  stage("Research and analyse"),
  stage("Agree on a plan"),
  stage("Execute"),
  stage("Measure and refine"),
];

/**
 * Software delivery steps (inside the Execute stage, for business-software
 * projects) — DRAFT, proposed in design-review/content-review.md §5.4.
 * Replace with the existing site's implementation process if it differs;
 * owner to confirm (review item 14). Review builds only until approved.
 */
export const deliveryIntro: Copy = draft(
  "Business systems follow these additional delivery steps inside the Execute stage.",
);

export const deliverySteps: readonly Step[] = [
  ["Requirement study", "Map how work happens today, and what the system must do."],
  ["Design and prototype", "Screens and workflows reviewed with your team before development."],
  ["Build and configure", "Development in stages, with demos along the way."],
  ["Data migration and testing", "Existing records moved across and checked; the system tested against real scenarios."],
  ["Onboarding and go-live", "Team training and a supported launch."],
  ["Support and improvement", "Ongoing maintenance and changes as the business grows."],
].map(([title, body]) => ({ title: draft(title), body: draft(body) }));

/* ---------- Section copy ----------------------------------------------- */

export const sectionCopy = {
  servicesIntro: draft(
    "Eight services in four areas — so your online presence, growth and internal systems work together. Scroll to explore each one.",
  ),
  servicesCta: draft("Not sure which service fits? Tell us what you need."),
  whyIntro: draft("What working with Xentra is like."),
  workIntro: draft("A selection of projects, shared with our clients' permission."),
  processIntro: draft("A clear, collaborative process from first conversation to launch and beyond."),
  contactIntro: draft(
    "Tell us about your business and what you want to achieve. The quickest way to reach us is WhatsApp.",
  ),
} as const;
