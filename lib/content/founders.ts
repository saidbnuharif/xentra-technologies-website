import type { StaticImageData } from "next/image";
import antony from "@/public/images/team/antony.jpg";
import gireeshNair from "@/public/images/team/gireesh-nair.jpg";
import { approved, type ContentStatus, type Copy } from "./status";

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
  /**
   * Short introduction (about 45–60 words), from the owner's supplied
   * profile only. `**text**` renders as emphasis.
   */
  bio: Copy;
  /** Up to 4 concise expertise areas, from the owner's supplied profile. */
  expertise?: readonly Copy[];
  /** One short quote from the owner's own founder's message. */
  quote?: Copy;
  /** The owner's stated philosophy (shown instead of a quote when the
   *  source has no direct quote). */
  philosophy?: Copy;
  /**
   * Genuine professional photograph — import from /public/images/team.
   * Never a generated or stock image. Null renders a marked placeholder in
   * draft mode.
   */
  photo: StaticImageData | null;
  /**
   * Head-and-shoulders crop of the photograph (display only; the file is
   * untouched): the focal point (CSS position, around the face) and zoom.
   * Tune the zoom per photograph so every owner's head reads the same size.
   */
  crop?: { focus: string; zoom: number };
  /** Public LinkedIn profile URL — only if supplied by the owner. */
  linkedin?: string;
  /** Stable key for anchors and ids. */
  key: string;
};

/*
 * The two owners, in the order supplied (15 Nov 2026). Names and
 * photographs are the owners' own (supplied).
 *  - Both approved (profiles supplied 23 Nov 2026) — on the live site.
 *  - Designations are "Co-Founder" only (owner's instruction: no company
 *    name appended).
 *  - LinkedIn URLs: add `linkedin` if supplied.
 */
export const founders: readonly Founder[] = [
  {
    // Approved 23 Nov 2026. Condensed (owner's request) from the profile he
    // supplied: intro built only from its sentences; expertise = the four
    // areas it names; philosophy as stated in it.
    key: "gireesh-nair",
    status: "approved",
    name: approved("Gireesh B. Nair"),
    designation: approved("Co-Founder"),
    bio: approved(
      "Gireesh is an entrepreneur and business strategist with an MBA and a diverse background in business development, sales, operations, and strategic partnerships. As the founder of Pinaca Construction Solutions and Co-Founder of Xentra Technologies, he brings hands-on entrepreneurial experience and a practical understanding of business challenges, helping businesses unlock opportunities and achieve sustainable growth.",
    ),
    expertise: [approved("Market Expansion"), approved("B2B Sales"), approved("Client Relationship Management"), approved("Growth Strategy")],
    philosophy: approved("Turning business potential into measurable success."),
    photo: gireeshNair,
    crop: { focus: "48% 29%", zoom: 2.1 },
  },
  {
    // Approved 23 Nov 2026. Condensed (owner's request) from the profile he
    // supplied: intro built only from its sentences; 4 of his 6 Core
    // Strengths, verbatim; the quote is the first sentence of his Founder's
    // Message. Name shown as "Antony" only (no surname supplied).
    key: "antony",
    status: "approved",
    name: approved("Antony"),
    designation: approved("Co-Founder"),
    bio: approved(
      "Antony is an MBA-qualified professional with **20 years of experience in Finance, Administration, Accounting, and Business Management**. Associated with MJ2 Associates – Tax & Financial Consultants, he has developed strong expertise in financial consultancy and business advisory. As Co-Founder of XENTRA TECHNOLOGIES, he combines business and financial experience with modern technology, AI, and digital innovation.",
    ),
    expertise: [
      approved("Financial Management & Strategic Planning"),
      approved("Accounting, Taxation & Compliance"),
      approved("Business Consulting & Development"),
      approved("Entrepreneurship & Leadership"),
    ],
    quote: approved("I believe in combining business knowledge with technology to create smarter, simpler, and more effective solutions."),
    photo: antony,
    crop: { focus: "50% 10%", zoom: 1.7 },
  },
];
