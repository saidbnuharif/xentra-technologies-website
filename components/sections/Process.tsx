import { sectionCopy, steps, visibleOnly } from "@/lib/content";
import { CopyText } from "@/components/ui/CopyText";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

/**
 * Timeline: vertical on mobile/tablet, horizontal from lg. The connecting
 * line is a static rule for now; a scroll-driven fill comes with the
 * animation stage.
 */
export function Process() {
  const items = visibleOnly(steps);
  if (items.length === 0) return null;

  return (
    <Section id="process" tone="light" labelledBy="process-title">
      <SectionHeading
        id="process-title"
        eyebrow="How We Work"
        title="How We Work"
        intro={sectionCopy.processIntro}
      />

      <div className="relative mt-12 lg:mt-14">
        {/* Connecting line: vertical on small screens, horizontal on lg. */}
        <span
          aria-hidden
          className="absolute bottom-2 left-[1.1875rem] top-2 w-px bg-line lg:inset-x-0 lg:bottom-auto lg:left-0 lg:top-[1.1875rem] lg:h-px lg:w-full"
        />
        <ol className="relative grid gap-10 lg:grid-cols-4 lg:gap-8">
        {items.map((step, index) => (
          <li key={step.title.text} className="relative grid grid-cols-[2.5rem_1fr] gap-5 lg:block">
            <span
              aria-hidden
              className="relative z-10 grid size-10 place-items-center rounded-full border border-accent bg-surface font-mono text-label font-medium text-accent"
            >
              {index + 1}
            </span>
            <div className="lg:mt-8">
              <h3 className="text-h3 font-semibold tracking-tight">
                <CopyText copy={step.title} />
              </h3>
              <p className="mt-3 text-body text-pretty text-fg-muted">
                <CopyText copy={step.body} />
              </p>
            </div>
          </li>
        ))}
        </ol>
      </div>
    </Section>
  );
}
