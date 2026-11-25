import { type ContentStatus, type Copy } from "./status";

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
 * Published case studies. Add only real, approved client work (with the
 * client's permission). Empty: the case study pages return 404.
 */
export const caseStudies: readonly CaseStudy[] = [];
