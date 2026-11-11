import { approved, draft, type Copy } from "./status";

/*
 * CURRENT service scope (Xentra team requirement, Nov 2026): exactly two
 * groups, eight services. Names are APPROVED exactly as supplied.
 * Descriptions are PENDING — they come from the Xentra Website Handoff
 * document and must not be written here from memory.
 */

export type ServiceItem = {
  /** Stable anchor on /services, also used by the contact picker. */
  slug: string;
  name: Copy;
  /** PENDING: from the Website Handoff document. */
  description: Copy;
};

export type ServiceGroup = {
  slug: string;
  name: Copy;
  /** PENDING: optional group introduction from the handoff. */
  intro: Copy;
  services: readonly ServiceItem[];
};

const pendingDescription = (name: string) =>
  draft(`Description for "${name}" — to be taken from the Website Handoff document.`);

const service = (slug: string, name: string): ServiceItem => ({
  slug,
  name: approved(name),
  description: pendingDescription(name),
});

export const serviceGroups: readonly ServiceGroup[] = [
  {
    slug: "business-growth-advisory",
    name: approved("Business Growth & Advisory"),
    intro: draft("Group introduction — to be taken from the Website Handoff document."),
    services: [
      service("business-growth-advisory", "Business growth advisory"),
      service("market-research-expansion", "Market research and expansion"),
      service("strategic-partnerships", "Strategic partnerships"),
      service("enterprise-sales-support", "Enterprise sales support"),
      service("corporate-strategy", "Corporate strategy"),
      service("management-consulting", "Management consulting"),
    ],
  },
  {
    slug: "digital-services",
    name: approved("Digital Services"),
    intro: draft("Group introduction — to be taken from the Website Handoff document."),
    services: [
      service("website-design-development", "Website design and development"),
      service("digital-marketing-brand-communication", "Digital marketing and brand communication"),
    ],
  },
];

/** All eight services in order, each with its group. */
export const serviceList = serviceGroups.flatMap((group) =>
  group.services.map((item) => ({ ...item, group })),
);

export function findService(slug: string) {
  return serviceList.find((item) => item.slug === slug);
}
