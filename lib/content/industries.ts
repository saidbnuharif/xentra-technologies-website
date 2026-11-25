import { approved, type Copy } from "./status";

/*
 * Industries served — the ten industries from the existing
 * xentratechnologies.com site, as supplied in Xentra's content brief.
 * Names only: no groupings, summaries or claims are added.
 */

export type Industry = { slug: string; name: Copy };

export const industries: readonly Industry[] = [
  ["manufacturing", "Manufacturing"],
  ["retail-distribution", "Retail and Distribution"],
  ["logistics", "Logistics"],
  ["healthcare-clinics", "Healthcare and Clinics"],
  ["trading", "Trading Businesses"],
  ["service-businesses", "Service Businesses"],
  ["startups", "Startups"],
  ["smes", "SMEs"],
  ["enterprise-teams", "Enterprise Teams"],
  ["warehousing-inventory", "Warehousing and Inventory"],
].map(([slug, name]) => ({ slug, name: approved(name) }));
