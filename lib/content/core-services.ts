import { approved, type Copy } from "./status";

/*
 * Our 8 Core Services — APPROVED (supplied by Xentra, 12 Nov 2026),
 * verbatim. Used on the Services page ONLY (owner's instruction: "change
 * only inside services page"). Home, Contact, the footer and How We Work
 * still use lib/content/services.ts and the five stages in sections.ts.
 */

export type CoreService = {
  /** Stable anchor on /services (#slug). */
  slug: string;
  name: Copy;
  points: readonly Copy[];
  /**
   * Older /services anchors (from the previous service list) that should
   * land on this service, so links elsewhere on the site keep working.
   */
  aliases?: readonly string[];
};

const service = (
  slug: string,
  name: string,
  points: readonly string[],
  aliases: readonly string[] = [],
): CoreService => ({ slug, name: approved(name), points: points.map((p) => approved(p)), aliases });

export const coreServicesIntro = {
  title: approved("Our 8 Core Services"),
  body: approved(
    "Xentra Technologies provides integrated business growth, strategic consulting, marketing and digital solutions to help businesses expand, improve their market presence and achieve sustainable growth.",
  ),
} as const;

export const coreServices: readonly CoreService[] = [
  service(
    "business-development-sales-growth",
    "Business Development & Sales Growth",
    [
      "B2B lead generation and prospect identification",
      "Customer acquisition and sales development",
      "Sales strategy and pipeline management",
      "Corporate client acquisition and business networking",
      "Business opportunity identification",
    ],
    ["enterprise-sales-support"],
  ),
  service(
    "market-research-expansion",
    "Market Research & Expansion",
    [
      "Market research and competitor analysis",
      "New market identification and entry strategies",
      "Regional and geographical business expansion",
      "Customer and industry research",
      "Market feasibility and opportunity assessment",
    ],
  ),
  service(
    "strategic-partnerships-channel-development",
    "Strategic Partnerships & Channel Development",
    [
      "Dealer and distributor network development",
      "Channel partner identification and onboarding",
      "Strategic business alliances",
      "Vendor and supplier relationship development",
      "B2B partnership facilitation",
    ],
    ["strategic-partnerships"],
  ),
  service(
    "digital-marketing-performance-marketing",
    "Digital Marketing & Performance Marketing",
    [
      "Social media management and marketing",
      "Google Ads and Meta Ads campaigns",
      "Search Engine Optimization (SEO)",
      "Content marketing and digital campaigns",
      "Online lead generation and brand promotion",
    ],
    ["digital-marketing-brand-communication", "digital-services"],
  ),
  service(
    "branding-creative-solutions",
    "Branding & Creative Solutions",
    [
      "Brand identity and logo development",
      "Corporate profiles and brochures",
      "Marketing materials and promotional creatives",
      "Brand positioning and communication strategy",
      "Social media creatives and visual design",
    ],
  ),
  service(
    "website-development-digital-experiences",
    "Website Development & Digital Experiences",
    [
      "Corporate and business website development",
      "Responsive and interactive website design",
      "Landing pages and lead-generation websites",
      "Website redesign and optimization",
      "UI/UX design and website maintenance",
    ],
    ["website-design-development"],
  ),
  service(
    "crm-automation-business-process-solutions",
    "CRM, Automation & Business Process Solutions",
    [
      "CRM implementation and configuration",
      "Customer and lead management systems",
      "Sales follow-up and workflow automation",
      "WhatsApp Business integration and automation",
      "Business process digitization and optimization",
    ],
  ),
  service(
    "business-strategy-growth-advisory",
    "Business Strategy & Growth Advisory",
    [
      "Business growth planning and consulting",
      "Go-to-market strategy development",
      "Business model and revenue strategy advisory",
      "Sales and marketing strategy alignment",
      "Operational and commercial improvement consulting",
    ],
    ["business-growth-advisory", "corporate-strategy", "management-consulting"],
  ),
];

/** "Our Approach" as listed on the services sheet (Services page only). */
export const coreApproach: readonly Copy[] = ["Discover", "Analyze", "Strategize", "Execute", "Optimize"].map((s) =>
  approved(s),
);

/**
 * Vision as worded on the services sheet (Services page only). NOTE: differs
 * from the About page vision (pages.ts) — owner to confirm which is official.
 */
export const coreServicesVision: Copy = approved(
  "To become a trusted business growth and technology solutions partner, helping businesses unlock new opportunities through strategic thinking, innovation and practical execution.",
);
