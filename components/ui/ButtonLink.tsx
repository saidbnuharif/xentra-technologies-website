import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import { buttonClasses, type ButtonSize, type ButtonVariant } from "./button-styles";

type ButtonLinkProps = ComponentPropsWithoutRef<"a"> & {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
};

/**
 * Link styled as a button. Internal routes ("/…") use next/link for instant
 * client-side navigation; anything else (mailto:, in-page #anchors,
 * external URLs) renders a plain anchor.
 */
export function ButtonLink({
  variant = "primary",
  size = "lg",
  className = "",
  href,
  ...props
}: ButtonLinkProps) {
  const classes = buttonClasses(variant, size, className);
  if (href.startsWith("/")) return <Link href={href} className={classes} {...props} />;
  return <a href={href} className={classes} {...props} />;
}
