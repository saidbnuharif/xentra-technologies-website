import { approved, draft, type Copy } from "./status";

/*
 * Page-level copy for the multi-page site. Anything marked PENDING comes
 * from the Xentra Website Handoff document and must be pasted in verbatim
 * (then switched to approved()). Pending items render only in review
 * builds, clearly marked, and never in production.
 */

const fromHandoff = (what: string) => draft(`${what} — to be taken from the Website Handoff document.`);

export const pageIntro = {
  about: approved("Strategy. Technology. Growth."),
  services: fromHandoff("Services page introduction"),
  howWeWork: fromHandoff("How We Work page introduction"),
  contact: approved("Tell us which service you're interested in and start a conversation on WhatsApp, or email us."),
} as const;

export const companyIntro = {
  /** Home + About: the company introduction from the handoff. PENDING. */
  introduction: fromHandoff("Company introduction"),
  /** About: background / history. PENDING. */
  background: fromHandoff("Company background"),
} as const;

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
  servicesIntro: fromHandoff("Home: short services overview introduction"),
  howWeWorkIntro: fromHandoff("Home: How We Work preview introduction"),
  enquiryHeading: approved("Start a Conversation"),
  enquiryBody: approved(
    "Choose the service you need, or tell us about your business — we'll take it from there on WhatsApp or email.",
  ),
} as const;

/**
 * About: business philosophy — DRAFT, proposed in
 * design-review/content-review.md §5.2. Superseded on the About page by
 * the owner's "Our Commitment" (12 Nov 2026); kept for reference only.
 */
export const philosophy = {
  title: draft("Shared growth"),
  body: draft(
    "Our headline — Your Vision. Our Strategy. Shared Growth. — is also how we judge our work. A project succeeds when the business is measurably further ahead than when we started, not when a deliverable is handed over. That is why each engagement starts with understanding and ends with measurement.",
  ),
} as const;

/**
 * Contact: what happens after an enquiry — DRAFT, proposed in
 * design-review/content-review.md §5.5. No reply time is promised until
 * Xentra confirms one (review item 11).
 */
export const nextSteps = [
  { title: draft("We read your enquiry"), body: draft("We note the service and the goals you mention.") },
  { title: draft("We contact you"), body: draft("On WhatsApp or email, to arrange a first conversation.") },
  {
    title: draft("We start with Understand"),
    body: draft("The first of our five stages. There's no obligation until a plan is agreed."),
  },
] as const;
