import Link from "next/link";
import { company } from "@/lib/content";
import { XentraLogo } from "./XentraLogo";

type LogoProps = {
  /** Width utility for the square logo, e.g. "w-[4.5rem]". */
  sizeClass?: string;
  /** Matching pixel width for srcset selection. */
  sizes?: string;
  className?: string;
};

/**
 * Home link using the official logo. Only place it on `black` tone surfaces;
 * see XentraLogo for why.
 */
export function Logo({
  sizeClass = "w-[4.5rem]",
  sizes = "72px",
  className = "",
}: LogoProps) {
  return (
    <Link
      href="/"
      aria-label={`${company.name} — home`}
      className={`inline-flex shrink-0 ${className}`}
    >
      <XentraLogo alt="" className={sizeClass} sizes={sizes} />
    </Link>
  );
}
