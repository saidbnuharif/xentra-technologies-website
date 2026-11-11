import { approved, showDrafts } from "./status";

/**
 * WhatsApp is the approved primary contact channel.
 * Official Xentra Technologies WhatsApp Business number: +91 91106 14757.
 * `number` is international-format digits only (no "+" or spaces).
 */
export const whatsapp = {
  number: "919110614757",
  /** Shown to visitors, e.g. on the Contact page. */
  displayNumber: "+91 91106 14757",
  /** General enquiry message (no specific service). */
  message: approved(
    "Hello Xentra Technologies, I'm interested in your services. I'd like to discuss a project.",
  ),
  /** Hero and section-level CTA. */
  ctaPrimary: approved("Start a Conversation"),
  /** Navbar, mobile menu and footer. */
  ctaNav: approved("Chat on WhatsApp"),
  /** Contact section button. */
  ctaContact: approved("Chat with Xentra on WhatsApp"),
  /** Accessible name for the icon-only floating button. */
  floatingLabel: approved("Chat with Xentra Technologies on WhatsApp"),
} as const;

/** Confirmed public email (approved by the Xentra team). */
export const email: string | null = "xentratechnologies@gmail.com";

/**
 * Service-specific prefilled WhatsApp message. Wording proposed by the site
 * build to satisfy the "relevant, prefilled enquiry message" requirement —
 * listed in the report for the team to confirm.
 */
export function serviceEnquiryMessage(serviceName: string): string {
  return `Hello Xentra Technologies, I'm interested in your ${serviceName.toLowerCase()} service. I'd like to discuss my requirements.`;
}

/** WhatsApp deep link; general message unless a specific one is given. */
export function whatsappHref(message: string = whatsapp.message.text): string | null {
  if (!whatsapp.number) return null;
  const digits = whatsapp.number.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

/** mailto link with an optional subject and body. */
export function mailtoHref(subject?: string, body?: string): string | null {
  if (!email) return null;
  const params = new URLSearchParams();
  if (subject) params.set("subject", subject);
  if (body) params.set("body", body);
  const query = params.toString().replace(/\+/g, "%20");
  return `mailto:${email}${query ? `?${query}` : ""}`;
}

/** Whether a WhatsApp CTA renders (only when a real number is configured). */
export function whatsappCtaVisible(): boolean {
  return Boolean(whatsappHref());
}

/** Whether any working contact method exists in the current build. */
export function hasContactMethod(): boolean {
  return Boolean(whatsappHref() || email);
}

/** Whether the Contact section should render (real method, or review mode). */
export function showContactSection(): boolean {
  return hasContactMethod() || showDrafts;
}
