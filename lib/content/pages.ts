import { approved, draft, type Copy } from "./status";

/*
 * Page-level copy for the multi-page site. Anything marked PENDING comes
 * from the Xentra Website Handoff document and must be pasted in verbatim
 * (then switched to approved()). Pending items render only in review
 * builds, clearly marked, and never in production.
 */

const fromHandoff = (what: string) => draft(`${what} — to be taken from the Website Handoff document.`);

export const pageIntro = {
  about: fromHandoff("About Us page introduction"),
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

export const mission: Copy = fromHandoff("Mission statement");
export const vision: Copy = fromHandoff("Vision statement");

export type Value = { title: Copy; body: Copy };

/**
 * Company values — PENDING. The number of values is not known yet, so a
 * single structural slot is shown in review builds; replace with the
 * handoff's values (title + explanation each).
 */
export const values: readonly Value[] = [
  { title: draft("Value title"), body: fromHandoff("Value explanation") },
];

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
 * design-review/content-review.md §5.2 (owner to approve or replace).
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
