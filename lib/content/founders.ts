import type { StaticImageData } from "next/image";
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
