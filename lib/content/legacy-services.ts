/*
 * LEGACY service model (four categories / eight earlier services).
 * Still used by the approved Hero visual (its four domain labels) and kept
 * for the pinned showcase pending a decision on adapting it to the new
 * service scope. The current service scope lives in ./services.ts.
 */
import { approved, draft, type Copy } from "./status";

/** Which custom illustrative composition represents the service. */
export type ServiceVisual =
  | "website"
  | "branding"
  | "marketing"
  | "seo"
  | "consultancy"
  | "automation"
  | "crm"
  | "erp";

export type Service = {
  id: string;
  name: Copy;
  /** DRAFT descriptions are proposals for Xentra to approve or rewrite. */
  description: Copy;
  /** Exactly three key capabilities — DRAFT until approved. */
  capabilities: readonly [Copy, Copy, Copy];
  visual: ServiceVisual;
};

export type ServiceCategory = {
  id: string;
  name: Copy;
  summary: Copy;
  services: readonly Service[];
};

/**
 * Service names and category names are APPROVED, as is the grouping.
 * Summaries, descriptions and capabilities are DRAFT.
 */
export const serviceCategories: readonly ServiceCategory[] = [
  {
    id: "digital-presence",
    name: approved("Digital Presence"),
    summary: draft("How your business looks, and how easily it is found, online."),
    services: [
      {
        id: "website-development",
        name: approved("Website Development"),
        description: draft(
          "Responsive, fast-loading websites that present your business clearly and make it easy for customers to get in touch.",
        ),
        capabilities: [
          draft("Responsive design for every screen size"),
          draft("Fast, search-friendly page structure"),
          draft("Clear enquiry paths and calls to action"),
        ],
        visual: "website",
      },
      {
        id: "branding-social-media",
        name: approved("Branding & Social Media"),
        description: draft(
          "A consistent identity and social media presence that helps people recognise and remember your business.",
        ),
        capabilities: [
          draft("Visual identity: colour, type and logo usage"),
          draft("Social media templates and content styling"),
          draft("Brand guidelines for consistent use"),
        ],
        visual: "branding",
      },
    ],
  },
  {
    id: "digital-growth",
    name: approved("Digital Growth"),
    summary: draft("Reaching the right customers and turning their interest into enquiries."),
    services: [
      {
        id: "digital-marketing",
        name: approved("Digital Marketing"),
        description: draft(
          "Campaigns planned around your goals and audience, on the channels your customers actually use.",
        ),
        capabilities: [
          draft("Campaign planning across search, social and email"),
          draft("Audience targeting and ad creative"),
          draft("Performance tracking and reporting"),
        ],
        visual: "marketing",
      },
      {
        id: "seo-lead-generation",
        name: approved("SEO & Lead Generation"),
        description: draft(
          "Search visibility and clear enquiry paths that help the right people find you and take the next step.",
        ),
        capabilities: [
          draft("Keyword research and on-page optimisation"),
          draft("Local search and business listings"),
          draft("Landing pages and lead capture"),
        ],
        visual: "seo",
      },
      {
        id: "business-consultancy",
        name: approved("Business Consultancy"),
        description: draft(
          "Practical guidance on where technology and digital channels can move your business forward.",
        ),
        capabilities: [
          draft("Digital and technology assessment"),
          draft("Prioritised roadmap and planning"),
          draft("Process and growth recommendations"),
        ],
        visual: "consultancy",
      },
    ],
  },
  {
    id: "intelligent-technology",
    name: approved("Intelligent Technology"),
    summary: draft("Putting AI and automation to practical use in your business."),
    services: [
      {
        id: "ai-business-automation",
        name: approved("AI & Business Automation"),
        description: draft(
          "Automating repetitive work and adding intelligent tools where they save time and reduce manual effort.",
        ),
        capabilities: [
          draft("Workflow automation between your tools"),
          draft("AI assistants for enquiries and support"),
          draft("Document and data processing"),
        ],
        visual: "automation",
      },
    ],
  },
  {
    id: "business-systems",
    name: approved("Business Systems"),
    summary: draft("The software that organises and runs your day-to-day operations."),
    services: [
      {
        id: "crm-business-software",
        name: approved("CRM & Business Software"),
        description: draft(
          "Systems that bring customer relationships, sales and daily operations together in one place.",
        ),
        capabilities: [
          draft("Contact and customer history management"),
          draft("Sales pipeline and follow-up tracking"),
          draft("Setup, data migration and team onboarding"),
        ],
        visual: "crm",
      },
      {
        id: "erp-custom-applications",
        name: approved("ERP & Custom Applications"),
        description: draft(
          "ERP solutions and custom-built applications shaped around how your business actually works.",
        ),
        capabilities: [
          draft("Finance, inventory and operations in one system"),
          draft("Custom applications for specific workflows"),
          draft("Integration with your existing tools"),
        ],
        visual: "erp",
      },
    ],
  },
];

/** Flattened, ordered list used by the services showcase. */
export const allServices = serviceCategories.flatMap((category) =>
  category.services.map((service) => ({ ...service, category: category.name })),
);
