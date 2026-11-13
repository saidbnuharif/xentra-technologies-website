import { approved, type Copy } from "./status";

/*
 * Home "Our Services" section: the six service categories supplied by the
 * owner with their visual reference (13 Nov 2026). Heading, intro and every
 * description are taken word for word from that reference.
 *
 * Each category opens the closest approved service on /services (the full
 * 8-service catalog with enquiry buttons stays there).
 */
export type ShowcaseService = {
  key: string;
  title: Copy;
  description: Copy;
  /** /services anchor of the closest approved core service. */
  href: string;
};

export const servicesShowcase = {
  eyebrow: approved("Our Services"),
  title: approved("Complete Digital Growth Solutions"),
  intro: approved(
    "A comprehensive range of technology and business services to build, grow and scale your business.",
  ),
  items: [
    {
      key: "website-development",
      title: approved("Website Development"),
      description: approved("Modern, responsive and high-performance websites for your business."),
      href: "/services#website-development-digital-experiences",
    },
    {
      key: "digital-marketing",
      title: approved("Digital Marketing"),
      description: approved("Result-driven marketing to increase your brand visibility and generate leads."),
      href: "/services#digital-marketing-performance-marketing",
    },
    {
      key: "ai-automation",
      title: approved("AI & Automation"),
      description: approved("Smart automation and AI solutions to improve efficiency and reduce costs."),
      href: "/services#crm-automation-business-process-solutions",
    },
    {
      key: "seo-lead-generation",
      title: approved("SEO & Lead Generation"),
      description: approved("Improve search visibility, attract the right audience and generate quality leads."),
      href: "/services#digital-marketing-performance-marketing",
    },
    {
      key: "business-consultancy",
      title: approved("Business Consultancy"),
      description: approved("Strategic guidance to streamline operations, improve performance and drive growth."),
      href: "/services#business-strategy-growth-advisory",
    },
    {
      key: "branding-social-media",
      title: approved("Branding & Social Media"),
      description: approved("Build a strong brand identity and grow your presence across digital platforms."),
      href: "/services#branding-creative-solutions",
    },
  ] satisfies ShowcaseService[],
} as const;
