import { draft, type ContentStatus, type Copy } from "./status";

/*
 * Industries served — DRAFT. The ten industries come from the existing
 * xentratechnologies.com site (as listed in the content brief); the three
 * groupings and their one-line explanations are the proposals from
 * design-review/content-review.md §6. Owner confirmation pending (review
 * item 16): until each entry is switched to approved(), the Industries
 * section renders only in review builds, never in production.
 */

export type IndustryGroup = {
  status: ContentStatus;
  slug: string;
  name: Copy;
  /** Where Xentra is relevant to these businesses (no claimed results). */
  summary: Copy;
  industries: readonly Copy[];
};

export const industryGroups: readonly IndustryGroup[] = [
  {
    status: "draft",
    slug: "goods",
    name: draft("Making and moving goods"),
    summary: draft(
      "Finding distributors and new regional markets, keeping stock and orders accurate as volume grows, and B2B websites that bring in trade enquiries.",
    ),
    industries: [
      draft("Manufacturing"),
      draft("Warehousing and inventory"),
      draft("Logistics"),
      draft("Retail and distribution"),
      draft("Trading businesses"),
    ],
  },
  {
    status: "draft",
    slug: "services",
    name: draft("Service providers"),
    summary: draft(
      "Websites and communication that make services easy to understand and book, with customer and appointment workflows behind them.",
    ),
    industries: [draft("Healthcare and clinics"), draft("Service businesses")],
  },
  {
    status: "draft",
    slug: "stage",
    name: draft("By stage of growth"),
    summary: draft(
      "Go-to-market and first partnerships for startups, structured growth plans for SMEs, and market research and workflow automation for enterprise teams.",
    ),
    industries: [draft("Startups"), draft("SMEs"), draft("Enterprise teams")],
  },
];

export const industriesIntro: Copy = draft(
  "Our work is most useful where growth depends on reaching new buyers and keeping operations under control as volume rises.",
);
