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

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="flex items-center gap-3 font-mono text-label font-medium uppercase tracking-[0.2em] text-accent">
      <span aria-hidden className="h-px w-8 bg-current" />
      {children}
    </p>
  );
}

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
    <header className={`max-w-2xl ${alignment} ${className}`}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2
        id={id}
        className="mt-5 text-h2 font-semibold tracking-tight text-balance"
      >
        {title}
      </h2>
      {intro ? (
        <p className="mt-5 text-lead text-pretty text-fg-muted empty:hidden">
          <CopyText copy={intro} />
        </p>
      ) : null}
    </header>
  );
}
