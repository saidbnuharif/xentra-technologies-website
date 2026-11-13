import { approved, type Copy, type ContentStatus } from "./status";

/* ---------- Why Xentra ------------------------------------------------- */

export type Reason = { status: ContentStatus; title: Copy; body: Copy };

/**
 * Why Xentra — built ONLY from Xentra's approved About Us copy (12 Nov
 * 2026): each body is a verbatim sentence from the Company Overview or Our
 * Commitment; the short titles label those sentences.
 */
export const reasons: readonly Reason[] = [
  {
    status: "approved",
    title: approved("One platform"),
    body: approved(
      "We bring together business development, strategic consulting, digital marketing, branding and technology-driven solutions under one platform.",
    ),
  },
  {
    status: "approved",
    title: approved("From ideas to measurable progress"),
    body: approved(
      "Our approach combines commercial insight, market understanding, creativity and practical execution to help businesses move from ideas to measurable progress.",
    ),
  },
  {
    status: "approved",
    title: approved("More than marketing"),
    body: approved(
      "We believe successful business growth requires more than marketing alone. It demands the right strategy, effective execution, strong partnerships and continuous improvement.",
    ),
  },
  {
    status: "approved",
    title: approved("Built around your objectives"),
    body: approved(
      "We aim to build lasting professional relationships by understanding the unique challenges of each business and delivering solutions aligned with its objectives.",
    ),
  },
];

/* ---------- How We Work ------------------------------------------------ */

/** The five stages from the Xentra team (names APPROVED; no explanations). */
export type Step = { title: Copy; body: Copy | null };

export const steps: readonly Step[] = [
  "Understand",
  "Research and analyse",
  "Agree on a plan",
  "Execute",
  "Measure and refine",
].map((title) => ({ title: approved(title), body: null }));

/* ---------- Section copy ----------------------------------------------- */

export const sectionCopy = {
  /** Why Xentra intro: the closing line of the approved Company Overview. */
  whyIntro: approved("At Xentra Technologies, we connect business potential with opportunities for growth."),
} as const;
