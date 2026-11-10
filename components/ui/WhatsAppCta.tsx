import { MessageCircle } from "lucide-react";
import { showDrafts, whatsappHref } from "@/lib/content";
import { buttonClasses, type ButtonSize, type ButtonVariant } from "./button-styles";

type WhatsAppCtaProps = {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
};

/**
 * The site's primary enquiry action. Opens WhatsApp with the official number
 * and the approved pre-filled message.
 *
 * Until the number is supplied:
 *  - review/dev builds show a clearly marked, non-interactive "pending" button
 *  - production builds render nothing (never a dead button)
 */
export function WhatsAppCta({
  label,
  variant = "primary",
  size = "lg",
  className = "",
}: WhatsAppCtaProps) {
  const href = whatsappHref();

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClasses(variant, size, className)}
      >
        <MessageCircle aria-hidden size={size === "lg" ? 20 : 18} />
        {label}
        <span className="sr-only">(opens WhatsApp in a new tab)</span>
      </a>
    );
  }

  if (!showDrafts) return null;

  return (
    <span
      role="link"
      aria-disabled="true"
      data-pending="whatsapp-number"
      title="WhatsApp number pending — this button is inactive"
      className={buttonClasses(
        variant,
        size,
        `cursor-not-allowed opacity-70 outline-2 outline-offset-2 outline-dashed outline-accent/60 ${className}`,
      )}
    >
      <MessageCircle aria-hidden size={size === "lg" ? 20 : 18} />
      {label}
      <span className="whitespace-nowrap rounded-sm bg-black/30 px-1.5 py-0.5 font-mono text-[0.6875rem] uppercase tracking-wider">
        Pending
      </span>
    </span>
  );
}
