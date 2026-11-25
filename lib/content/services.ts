import { approved, type Copy } from "./status";

/*
 * Earlier service list (two groups, names APPROVED). Still used by the
 * Home services showcase, the footer and the Contact picker. The Services
 * page uses the approved "Our 8 Core Services" in core-services.ts.
 */

export type ServiceItem = {
  /** Stable anchor on /services, also used by the contact picker. */
  slug: string;
  name: Copy;
  /** No approved description for these names; the Services page uses core-services.ts. */
  description: Copy | null;
};

export type ServiceGroup = {
  slug: string;
  name: Copy;
  intro: Copy | null;
  services: readonly ServiceItem[];
};

const service = (slug: string, name: string): ServiceItem => ({
  slug,
  name: approved(name),
  description: null,
});

export const serviceGroups: readonly ServiceGroup[] = [
  {
    slug: "business-growth-advisory",
    name: approved("Business Growth & Advisory"),
    intro: null,
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
    intro: null,
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
