import { approved, showDrafts } from "./status";

/**
 * WhatsApp is the approved primary contact channel.
 * Official Xentra Technologies WhatsApp Business number: +91 91106 14757.
 * `number` is international-format digits only (no "+" or spaces).
 */
export const whatsapp = {
  number: "919110614757",
  message: approved(
    "Hello Xentra Technologies, I'm interested in your services. I'd like to discuss a project.",
  ),
  /** Hero, Services and section-level CTA. */
  ctaPrimary: approved("Start a Conversation"),
  /** Navbar, mobile menu and footer. */
  ctaNav: approved("Chat on WhatsApp"),
  /** Contact section button. */
  ctaContact: approved("Chat with Xentra on WhatsApp"),
  /** Accessible name for the icon-only floating button. */
  floatingLabel: approved("Chat with Xentra Technologies on WhatsApp"),
} as const;

/** Secondary channel — PENDING. Only shown once supplied. */
export const email: string | null = null;

export function whatsappHref(): string | null {
  if (!whatsapp.number) return null;
  const digits = whatsapp.number.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(whatsapp.message.text)}`;
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
