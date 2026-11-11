import { sectionCopy, steps, visibleOnly } from "@/lib/content";
import { CopyText } from "@/components/ui/CopyText";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProcessTimeline } from "./process/ProcessTimeline";

/*
 * Interactive timeline. Server-rendered and complete on its own; the
 * <ProcessTimeline> client wrapper adds scroll-linked progress and step
 * states (data-state on each step). The Tailwind classes below style those
 * states; with no state set (no JS / reduced motion) every step is in full.
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

      <ProcessTimeline>
        <div className="relative mt-12 lg:mt-16">
          {/* Track + scroll-driven fill: vertical on small screens, horizontal on lg. */}
          <div
            aria-hidden
            data-process-track
            className="absolute bottom-6 left-[1.375rem] top-6 w-px bg-line lg:inset-x-0 lg:bottom-auto lg:left-0 lg:top-[1.375rem] lg:h-px lg:w-full"
          >
            <div data-process-fill className="absolute inset-0 bg-accent" />
          </div>

          <ol className="relative grid gap-12 lg:grid-cols-4 lg:gap-8">
            {items.map((step, index) => (
              <li
                key={step.title.text}
                data-process-step
                className="group/step relative grid grid-cols-[2.75rem_1fr] gap-5 lg:block"
              >
                <span
                  aria-hidden
                  data-process-marker
                  className="relative z-10 grid size-11 place-items-center rounded-full border border-accent bg-surface font-mono text-label font-medium text-accent transition-all duration-500 group-data-[state=active]/step:scale-110 group-data-[state=active]/step:bg-accent group-data-[state=active]/step:text-white group-data-[state=active]/step:shadow-[0_0_0_6px_rgb(31_86_224/0.12)] group-data-[state=upcoming]/step:border-line group-data-[state=upcoming]/step:text-fg-muted group-hover/step:ring-4 group-hover/step:ring-accent/15"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="transition-[opacity,translate] duration-500 group-data-[state=upcoming]/step:translate-y-1.5 group-data-[state=upcoming]/step:opacity-40 group-data-[state=done]/step:opacity-75 lg:mt-8">
                  <p className="font-mono text-label uppercase tracking-[0.16em] text-fg-muted">
                    Step {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-2 text-h3 font-semibold tracking-tight">
                    <CopyText copy={step.title} />
                  </h3>
                  <p className="mt-3 max-w-xs text-body text-pretty text-fg-muted">
                    <CopyText copy={step.body} />
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </ProcessTimeline>
    </Section>
  );
}
