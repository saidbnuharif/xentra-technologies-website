import { approved } from "./status";

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
