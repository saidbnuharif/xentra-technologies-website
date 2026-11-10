import { whatsappHref } from "@/lib/content";
import { WhatsAppIcon } from "@/components/brand/WhatsAppIcon";
import { buttonClasses, type ButtonSize, type ButtonVariant } from "./button-styles";

type WhatsAppCtaProps = {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
};

/**
 * The site's primary enquiry action. Opens WhatsApp with the official
 * Xentra number and the approved pre-filled message, in a new tab with
 * noopener/noreferrer. Renders nothing if no number is configured.
 */
export function WhatsAppCta({
  label,
  variant = "primary",
  size = "lg",
  className = "",
}: WhatsAppCtaProps) {
  const href = whatsappHref();
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={buttonClasses(variant, size, className)}
    >
      <WhatsAppIcon className={size === "lg" ? "size-5" : "size-[1.125rem]"} />
      {label}
      <span className="sr-only">(opens WhatsApp in a new tab)</span>
    </a>
  );
}
