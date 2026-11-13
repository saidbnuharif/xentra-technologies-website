import { approved, type Copy } from "./status";
import { coreServicesIntro } from "./core-services";

/*
 * Page-level copy. Everything here is APPROVED (supplied by Xentra) or
 * derived verbatim from approved copy. Slots with no approved copy are null
 * and render nothing — no placeholders on the site.
 */

export const pageIntro: Record<"about" | "services" | "howWeWork" | "contact", Copy | null> = {
  about: approved("Strategy. Technology. Growth."),
  services: coreServicesIntro.body,
  howWeWork: null,
  contact: approved("Tell us which service you're interested in and start a conversation on WhatsApp, or email us."),
};

/*
 * About Us — APPROVED (supplied by Xentra, 12 Nov 2026). Verbatim; do not
 * reword without the owner's approval.
 */

/** About: Company Overview. The last paragraph is set as a closing statement. */
export const aboutOverview = {
  title: approved("Company Overview"),
  paragraphs: [
    approved(
      "Xentra Technologies is an emerging business growth and digital solutions company focused on helping organizations unlock opportunities, strengthen market presence, establish meaningful business relationships and achieve sustainable growth.",
    ),
    approved(
      "We bring together business development, strategic consulting, digital marketing, branding and technology-driven solutions under one platform.",
    ),
    approved(
      "Our approach combines commercial insight, market understanding, creativity and practical execution to help businesses move from ideas to measurable progress.",
    ),
    approved(
      "Whether a company is looking to enter a new market, increase sales opportunities, establish distribution networks, develop its digital presence or improve its growth strategy, Xentra aims to serve as a strategic partner throughout that journey.",
    ),
    approved(
      "We believe successful business growth requires more than marketing alone. It demands the right strategy, effective execution, strong partnerships and continuous improvement.",
    ),
  ],
  statement: approved("At Xentra Technologies, we connect business potential with opportunities for growth."),
} as const;

export const mission: Copy = approved(
  "To empower businesses with innovative, practical and results-oriented solutions that accelerate growth, strengthen market competitiveness and create long-term value.",
);
export const vision: Copy = approved(
  "To become a trusted business growth and technology solutions partner, recognized for helping ambitious organizations expand, innovate and succeed across competitive markets.",
);

export type Value = { title: Copy; body: Copy };

/** Our Core Values — approved, in the owner's order. */
export const values: readonly Value[] = [
  ["Integrity", "Building trust through transparency, accountability and ethical business practices."],
  ["Innovation", "Finding smarter ways to solve business challenges through creativity, technology and strategic thinking."],
  ["Collaboration", "Working closely with clients and partners to achieve shared business objectives."],
  ["Excellence", "Maintaining high standards in strategy, communication, delivery and client experience."],
  ["Growth Mindset", "Continuously learning, adapting and exploring new opportunities."],
  ["Client-Centricity", "Understanding each client’s priorities before recommending solutions."],
].map(([title, body]) => ({ title: approved(title), body: approved(body) }));

/** About: Our Commitment — approved. */
export const commitment = {
  title: approved("Our Commitment"),
  paragraphs: [
    approved(
      "We aim to build lasting professional relationships by understanding the unique challenges of each business and delivering solutions aligned with its objectives.",
    ),
    approved(
      "Our focus is not simply to provide services, but to help businesses make informed decisions, create opportunities and build stronger foundations for sustainable growth.",
    ),
  ],
} as const;

export const homeCopy = {
  /** Approved services introduction (services sheet). */
  servicesIntro: coreServicesIntro.body,
  howWeWorkIntro: null as Copy | null,
  enquiryHeading: approved("Start a Conversation"),
  enquiryBody: approved(
    "Choose the service you need, or tell us about your business — we'll take it from there on WhatsApp or email.",
  ),
} as const;
