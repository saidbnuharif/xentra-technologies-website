import { draft, type ContentStatus, type Copy } from "./status";

/*
 * Case studies. Only APPROVED studies are published; drafts render in review
 * builds only. Never add a project, client, metric or result here without
 * written approval (and the client's permission where named).
 */

export type CaseStudyImage = { src: string; alt: string };

export type CaseStudy = {
  status: ContentStatus;
  slug: string;
  title: Copy;
  client: Copy;
  industry: Copy;
  challenge: Copy;
  objectives: readonly Copy[];
  workDelivered: readonly Copy[];
  /** Service names exactly as listed in ./services.ts. */
  services: readonly string[];
  /** Only where relevant. */
  technologies: readonly string[];
  /** Verified outcomes only — leave empty rather than estimate. */
  outcomes: readonly Copy[];
  /** Approved images only (place files under /public/case-studies). */
  images: readonly CaseStudyImage[];
  /** Optional live project link, approved by the client. */
  link: { href: string; label: string } | null;
};

/**
 * The single entry below is a STRUCTURAL TEMPLATE, not a project: every field
 * is a labelled placeholder so the layout can be reviewed. It is a draft and
 * never renders in production.
 */
export const caseStudies: readonly CaseStudy[] = [
  {
    status: "draft",
    slug: "template",
    title: draft("Case study title"),
    client: draft("Client name (with written permission)"),
    industry: draft("Industry"),
    challenge: draft("The business challenge the client faced."),
    objectives: [draft("Objective agreed with the client"), draft("Second objective")],
    workDelivered: [draft("What Xentra delivered"), draft("Second deliverable")],
    services: ["Website design and development"],
    technologies: ["Technology used (if relevant)"],
    outcomes: [draft("Verified outcome only — omit if not verified")],
    images: [],
    link: null,
  },
];
