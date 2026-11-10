import type { ReactNode } from "react";
import { showDrafts } from "@/lib/content";

type PlaceholderProps = {
  /** What belongs here, e.g. "Owner portrait" or "Project screenshot". */
  label: string;
  kind?: "image" | "content" | "logo";
  /** Tailwind aspect class for image slots, e.g. "aspect-video". */
  aspect?: string;
  className?: string;
  children?: ReactNode;
};

const kindLabel: Record<NonNullable<PlaceholderProps["kind"]>, string> = {
  image: "Image pending",
  content: "Content pending",
  logo: "Logo pending",
};

/**
 * Marks a slot awaiting real Xentra assets or approved copy.
 * Renders nothing in production builds, so it can never be published.
 */
export function Placeholder({
  label,
  kind = "image",
  aspect,
  className = "",
  children,
}: PlaceholderProps) {
  if (!showDrafts) return null;

  return (
    <div
      data-placeholder={kind}
      className={`flex flex-col items-start justify-end gap-2 rounded-card border border-dashed border-fg/25 bg-surface-raised p-5 ${aspect ?? ""} ${className}`}
    >
      <span className="font-mono text-label font-medium uppercase tracking-[0.16em] text-accent">
        {kindLabel[kind]}
      </span>
      <span className="text-body font-medium text-fg">{label}</span>
      {children ? <div className="text-sm text-fg-muted">{children}</div> : null}
    </div>
  );
}

/** Inline marker for temporary copy (dev / review builds only). */
export function Draft({ children }: { children: ReactNode }) {
  if (!showDrafts) return null;
  return (
    <span data-draft>
      <span
        aria-hidden
        className="mr-2 inline-block translate-y-[-0.15em] rounded-sm border border-dashed border-accent/60 px-1.5 py-px align-middle font-mono text-[0.6875rem] font-normal uppercase leading-normal tracking-[0.14em] text-accent"
      >
        Draft
      </span>
      {children}
    </span>
  );
}
