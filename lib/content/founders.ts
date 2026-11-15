import type { StaticImageData } from "next/image";
import antony from "@/public/images/team/antony.jpg";
import gireeshNair from "@/public/images/team/gireesh-nair.jpg";
import { approved, draft, type ContentStatus, type Copy } from "./status";

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
 * photographs are the owner's own (supplied); designations and bios are
 * still to come, so both entries stay `draft`: the section shows, with
 * marked placeholders, in dev and review builds only, never in production.
 * When the details arrive: replace the drafts with approved(...) and set
 * status: "approved" (and add linkedin if supplied).
 */
export const founders: readonly Founder[] = [
  {
    key: "gireesh-nair",
    status: "draft",
    name: approved("Gireesh Nair"),
    designation: draft("Designation to be confirmed"),
    bio: draft("A short professional biography (2–3 sentences), to be supplied and approved by Gireesh Nair."),
    photo: gireeshNair,
    crop: { focus: "48% 29%", zoom: 2.1 },
  },
  {
    key: "antony",
    status: "draft",
    // Surname to be confirmed.
    name: approved("Antony"),
    designation: draft("Designation to be confirmed"),
    bio: draft("A short professional biography (2–3 sentences), to be supplied and approved by Antony."),
    photo: antony,
    crop: { focus: "50% 10%", zoom: 1.7 },
  },
];
