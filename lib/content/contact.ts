import { approved, showDrafts } from "./status";

/**
 * WhatsApp is the approved primary contact channel.
 *
 * `number` is PENDING. When supplied, use international format digits only,
 * no "+", spaces or leading zeros (e.g. country code + number).
 * While it is null, WhatsApp buttons render as a marked "pending" state in
 * draft mode and are omitted entirely from production builds.
 */
export const whatsapp = {
  number: null as string | null,
  message: approved(
    "Hello Xentra Technologies, I'm interested in discussing a project. Could you please share more information about your services?",
  ),
  ctaPrimary: approved("Start a Conversation"),
  ctaContact: approved("Chat with Xentra on WhatsApp"),
} as const;

/** Secondary channel — PENDING. Only shown once supplied. */
export const email: string | null = null;

export function whatsappHref(): string | null {
  if (!whatsapp.number) return null;
  const digits = whatsapp.number.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(whatsapp.message.text)}`;
}

/** Whether a WhatsApp CTA renders in this build (live, or pending in review). */
export function whatsappCtaVisible(): boolean {
  return Boolean(whatsappHref()) || showDrafts;
}

/** Whether any working contact method exists in the current build. */
export function hasContactMethod(): boolean {
  return Boolean(whatsappHref() || email);
}

/** Whether the Contact section should render (real method, or review mode). */
export function showContactSection(): boolean {
  return hasContactMethod() || showDrafts;
}
