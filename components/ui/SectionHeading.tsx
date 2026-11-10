import type { ReactNode } from "react";
import type { Copy } from "@/lib/content";
import { CopyText } from "./CopyText";

type SectionHeadingProps = {
  id: string;
  /** Short label above the title, e.g. "Services". */
  eyebrow: string;
  title: ReactNode;
  intro?: Copy | null;
  align?: "left" | "center";
  className?: string;
};

type EyebrowProps = {
  children: ReactNode;
  /**
   * Opt in to the shared MotionRoot reveal. Leave off where another
   * animation already owns the element (Hero, Services) — one engine per
   * element.
   */
  reveal?: boolean;
};

export function Eyebrow({ children, reveal = false }: EyebrowProps) {
  return (
    <p
      data-reveal={reveal ? "fade" : undefined}
      className="flex items-center gap-3 font-mono text-label font-medium uppercase tracking-[0.2em] text-accent"
    >
      <span
        aria-hidden
        data-reveal={reveal ? "line" : undefined}
        className="h-px w-8 bg-current"
      />
      {children}
    </p>
  );
}

/** Section heading with the site's standard entrance: label → title → intro. */
export function SectionHeading({
  id,
  eyebrow,
  title,
  intro,
  align = "left",
  className = "",
}: SectionHeadingProps) {
  const alignment = align === "center" ? "mx-auto text-center [&>p]:justify-center" : "";

  return (
    <header data-reveal-group className={`max-w-2xl ${alignment} ${className}`}>
      <Eyebrow reveal>{eyebrow}</Eyebrow>
      <h2
        id={id}
        data-reveal
        className="mt-5 text-h2 font-semibold tracking-tight text-balance"
      >
        {title}
      </h2>
      {intro ? (
        <p data-reveal className="mt-5 text-lead text-pretty text-fg-muted empty:hidden">
          <CopyText copy={intro} />
        </p>
      ) : null}
    </header>
  );
}
