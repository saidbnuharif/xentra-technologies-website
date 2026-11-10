import { approved, draft } from "./status";

/** Approved company positioning (supplied by Xentra). */
export const company = {
  name: "Xentra Technologies",
  shortName: "Xentra",
  tagline: approved("Intelligent Systems. Limitless Possibilities."),
  positioning: approved("Technology and business growth partner."),
  description: approved(
    "We help businesses build their digital presence, reach the right customers and move their business forward with practical technology and growth solutions.",
  ),
  /** Registered legal name for the footer — PENDING from Xentra. */
  legalName: null,
} as const;

/**
 * Company facts for the About section. Every value is PENDING: nothing here
 * may be filled in without confirmation from Xentra.
 */
export const companyFacts = [
  { label: "Based in", value: draft("Location to be confirmed") },
  { label: "Founded", value: draft("Year to be confirmed") },
  { label: "Who we serve", value: draft("Industries / client types to be confirmed") },
] as const;
