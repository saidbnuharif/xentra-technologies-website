import type { ReactNode } from "react";
import type { SectionId } from "@/lib/content";
import { Container } from "./Container";

export type SectionTone = "black" | "navy" | "light" | "white";

type SectionProps = {
  id: SectionId;
  /** Colour context; sets the semantic tokens (surface, fg, line, accent). */
  tone: SectionTone;
  /** id of the section's heading, for aria-labelledby. */
  labelledBy: string;
  children: ReactNode;
  /** `compact` for short or continuing sections. */
  spacing?: "default" | "compact";
  /** Hairline at the top — use when following a section of the same tone. */
  divider?: boolean;
  className?: string;
};

const spacingClass = {
  default: "py-section",
  compact: "py-section-compact",
} as const;

/** Semantic page section with a tone and consistent vertical rhythm. */
export function Section({
  id,
  tone,
  labelledBy,
  children,
  spacing = "default",
  divider = false,
  className = "",
}: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={`tone-${tone} relative ${className}`}
    >
      {divider ? (
        <Container>
          <div className="border-t border-line" />
        </Container>
      ) : null}
      <Container className={spacingClass[spacing]}>{children}</Container>
    </section>
  );
}
