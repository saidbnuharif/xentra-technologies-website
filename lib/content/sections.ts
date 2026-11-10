import { draft, type Copy, type ContentStatus } from "./status";
import type { ServiceVisual } from "./services";

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

export type Step = { status: ContentStatus; title: Copy; body: Copy };

/** DRAFT proposal of Xentra's process — to be confirmed. */
export const steps: readonly Step[] = [
  {
    status: "draft",
    title: draft("Discover"),
    body: draft("We learn about your business, your goals and the customers you want to reach."),
  },
  {
    status: "draft",
    title: draft("Plan"),
    body: draft("We recommend the right solution, agree the scope and set a clear timeline."),
  },
  {
    status: "draft",
    title: draft("Build"),
    body: draft("We design, develop and set everything up, keeping you informed along the way."),
  },
  {
    status: "draft",
    title: draft("Grow"),
    body: draft("We launch, measure and refine so the solution keeps moving your business forward."),
  },
];

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
