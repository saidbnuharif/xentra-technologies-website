import Image from "next/image";
import logo from "@/public/images/xentra-logo.svg.jpeg";

/*
 * Official Xentra logo — used exactly as supplied.
 *
 * Asset facts (public/images/xentra-logo.svg.jpeg):
 * - Despite the name it is a JPEG, 1254 × 1254 (1:1), no transparency.
 * - The full lockup (X mark, XENTRA wordmark, tagline, underline) sits on a
 *   baked-in near-black background, average #020307.
 * - It must only be placed on surfaces of that colour: --xt-black is set to
 *   match it exactly. It is NOT suitable for light or navy backgrounds,
 *   where the black square would show; do not recolour or mask it.
 *
 * Never crop, recolour or stretch it. Size it through `className` (width);
 * height follows automatically from the 1:1 intrinsic ratio.
 */

type XentraLogoProps = {
  /** Width utilities, e.g. "w-[4.5rem]" or "w-64 lg:w-96". */
  className?: string;
  /** Rendered width(s) for srcset selection, e.g. "72px" or "(min-width: 64rem) 384px, 256px". */
  sizes: string;
  /** Preload when the logo is above the fold and likely the LCP element (hero). */
  preload?: boolean;
  /** Empty when the parent (e.g. a link) already supplies the accessible name. */
  alt?: string;
};

export function XentraLogo({
  className = "",
  sizes,
  preload = false,
  alt = "Xentra Technologies — Intelligent Systems. Limitless Possibilities.",
}: XentraLogoProps) {
  return (
    <Image
      src={logo}
      alt={alt}
      sizes={sizes}
      preload={preload}
      className={`block aspect-square h-auto max-w-full shrink-0 ${className}`}
    />
  );
}

export const logoAsset = {
  width: logo.width,
  height: logo.height,
  /** Measured average of the baked-in background. */
  background: "#020307",
} as const;
