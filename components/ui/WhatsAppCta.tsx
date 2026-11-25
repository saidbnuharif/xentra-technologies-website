import { whatsappHref } from "@/lib/content";
import { WhatsAppIcon } from "@/components/brand/WhatsAppIcon";
import { buttonClasses, type ButtonSize, type ButtonVariant } from "./button-styles";

type WhatsAppCtaProps = {
  label: string;
  /** Prefilled message; defaults to the general enquiry message. */
  message?: string;
  /**
   * Extra context for screen readers when the visible label is generic,
   * e.g. the service name for a list of "Enquire on WhatsApp" buttons.
   */
  accessibleContext?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  /** Opt in to the hero's desktop magnetic hover (HeroIntroMotion). */
  magnetic?: boolean;
};

/**
 * Opens WhatsApp with the official Xentra number and a prefilled message,
 * in a new tab with noopener/noreferrer. Renders nothing if no number is
 * configured.
 */
export function WhatsAppCta({
  label,
  message,
  accessibleContext,
  variant = "primary",
  size = "lg",
  className = "",
  magnetic = false,
}: WhatsAppCtaProps) {
  const href = whatsappHref(message);
  if (!href) return null;

  return (
    <a
      data-magnetic={magnetic || undefined}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={buttonClasses(variant, size, className)}
    >
      <WhatsAppIcon className={size === "lg" ? "size-5" : "size-[1.125rem]"} />
      {label}
      <span className="sr-only">
        {accessibleContext ? ` about ${accessibleContext}` : ""} (opens WhatsApp in a new tab)
      </span>
    </a>
  );
}
