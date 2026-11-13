import { ChartColumn, ClipboardCheck, Gauge, Rocket, Search, type LucideIcon } from "lucide-react";
import { steps, type Copy } from "@/lib/content";
import { CopyText } from "@/components/ui/CopyText";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProcessJourney } from "./process/ProcessJourney";

/** One icon per approved stage, in order (update together with `steps`). */
const icons: readonly LucideIcon[] = [Search, ChartColumn, ClipboardCheck, Rocket, Gauge];
const pad = (n: number) => String(n).padStart(2, "0");

/*
 * How We Work: a five-stage journey on a light band (the site's contrast
 * section).
 *  - Desktop with motion (ProcessJourney): the section pins and scrolling
 *    carries the five stages past horizontally; a progress rail above
 *    fills and lights each stage's marker; the stage in the centre is lit,
 *    the others wait, dimmed and slightly smaller.
 *  - Phones, reduced motion, no JS: the same stage panels stacked, joined
 *    by a connector line with a node per stage. No pin.
 * Stage names are approved (sections.ts); no invented descriptions.
 */
export function Process({ intro = null }: { intro?: Copy | null }) {
  return (
    <Section id="stages" tone="light" labelledBy="process-title" edge className="overflow-x-clip">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgb(31_86_224/0.09)_1px,transparent_1.3px)] bg-size-[26px_26px] [mask-image:radial-gradient(70%_60%_at_50%_60%,black,transparent)]"
      />
      <ProcessJourney>
        {/* Pinned frame on desktop (full screen); plain flow otherwise. */}
        <div
          data-journey-frame
          className="relative group-data-[journey=track]/j:flex group-data-[journey=track]/j:h-svh group-data-[journey=track]/j:flex-col group-data-[journey=track]/j:justify-center group-data-[journey=track]/j:pt-[var(--xt-nav-height)]"
        >
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              id="process-title"
              eyebrow="How We Work"
              title={
                <>
                  Five stages, <span className="text-accent-gradient">one clear process</span>
                </>
              }
              intro={intro}
            />
            {/* Progress rail (desktop journey only; decorative — the
                stages themselves carry the names). */}
            <ol aria-hidden className="relative hidden w-full max-w-xl grid-cols-5 group-data-[journey=track]/j:grid">
              <span className="absolute left-[10%] right-[10%] top-[7px] h-px bg-blue-500/15" />
              <span
                data-journey-fill
                className="absolute left-[10%] right-[10%] top-[7px] h-px origin-left scale-x-0 bg-[linear-gradient(90deg,var(--xt-blue-600),var(--xt-blue-400))] shadow-[0_0_10px_rgb(47_107_255/0.7)]"
              />
              {steps.map((step, i) => (
                <li key={step.title.text} data-journey-mark className="group/mark relative flex flex-col items-center gap-2 text-center">
                  <span className="relative size-[15px] rounded-full border-2 border-blue-500/30 bg-white transition-all duration-300 group-data-[on=true]/mark:scale-110 group-data-[on=true]/mark:border-blue-500 group-data-[on=true]/mark:bg-blue-500 group-data-[on=true]/mark:shadow-[0_0_0_5px_rgb(47_107_255/0.15),0_0_14px_rgb(47_107_255/0.7)]" />
                  <span className="font-mono text-[0.65rem] font-medium tracking-[0.18em] text-silver-400 transition-colors group-data-[on=true]/mark:text-blue-600">
                    {pad(i + 1)}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          {/* Stages: full-bleed horizontal track on desktop; stacked
              column with a connector line elsewhere. */}
          <div
            data-journey-viewport
            className="relative mt-12 group-data-[journey=track]/j:mx-[calc(50%-50vw)] group-data-[journey=track]/j:mt-14 group-data-[journey=track]/j:pl-[calc(50vw-50%)]"
          >
            <span
              aria-hidden
              className="absolute bottom-10 left-[11px] top-10 w-px bg-[linear-gradient(to_bottom,rgb(47_107_255/0),rgb(47_107_255/0.6)_8%,rgb(47_107_255/0.6)_92%,rgb(47_107_255/0))] group-data-[journey=track]/j:hidden"
            />
            <ol data-journey-track className="relative flex flex-col gap-5 pl-9 group-data-[journey=track]/j:w-max group-data-[journey=track]/j:flex-row group-data-[journey=track]/j:gap-8 group-data-[journey=track]/j:pl-0">
              {steps.map((step, index) => {
                const Icon = icons[index % icons.length];
                return (
                  <li
                    key={step.title.text}
                    data-journey-stage
                    className="group/stage relative group-data-[journey=track]/j:w-[min(56vw,44rem)]"
                  >
                    {/* Node on the connector (stacked layout). */}
                    <span
                      aria-hidden
                      className="absolute -left-[30px] top-12 size-[11px] rounded-full border-2 border-blue-500 bg-white shadow-[0_0_10px_rgb(47_107_255/0.6)] group-data-[journey=track]/j:hidden"
                    />
                    <article
                      data-journey-card
                      className="relative flex min-h-[16rem] flex-col justify-between overflow-hidden rounded-3xl border border-blue-500/15 bg-[linear-gradient(150deg,rgb(255_255_255/0.95),rgb(255_255_255/0.75)_55%,rgb(220_230_255/0.7))] p-7 shadow-[0_30px_60px_-36px_rgb(31_86_224/0.45),inset_0_1px_0_white] transition-[opacity,scale,border-color,box-shadow] duration-500 sm:p-10 group-data-[journey=track]/j:h-[min(52svh,28rem)] group-data-[on=false]/stage:scale-[0.94] group-data-[on=false]/stage:opacity-55 group-data-[on=true]/stage:border-blue-500/40 group-data-[on=true]/stage:shadow-[0_40px_80px_-36px_rgb(31_86_224/0.6),0_0_0_1px_rgb(47_107_255/0.12),inset_0_1px_0_white]"
                    >
                      {/* Large stage number, set into the glass. */}
                      <span
                        aria-hidden
                        className="pointer-events-none absolute -right-2 -top-6 font-mono text-[clamp(6rem,4rem+8vw,11rem)] font-semibold leading-none text-blue-600/[0.07]"
                      >
                        {pad(index + 1)}
                      </span>
                      {/* Icon orb with orbit rings. */}
                      <span aria-hidden className="relative grid size-20 place-items-center">
                        <span className="absolute inset-0 rounded-full border border-blue-500/25" />
                        <span className="absolute -inset-3 rounded-full border border-dashed border-blue-500/20" />
                        <span className="grid size-14 place-items-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#6f9bff,#1f56e0_70%)] text-white shadow-[0_12px_30px_-8px_rgb(31_86_224/0.8),inset_0_1px_1px_rgb(255_255_255/0.5)]">
                          <Icon size={24} strokeWidth={1.75} />
                        </span>
                      </span>
                      <div className="relative mt-10">
                        <p className="font-mono text-label font-medium uppercase tracking-[0.2em] text-accent">
                          Stage {pad(index + 1)}
                          <span className="sr-only"> of {steps.length}</span>
                        </p>
                        <h3 className="mt-3 text-[clamp(1.75rem,1.2rem+2vw,3.25rem)] font-semibold leading-[1.05] tracking-tight text-balance">
                          <CopyText copy={step.title} />
                        </h3>
                        {step.body ? (
                          <p className="mt-4 max-w-md text-body text-pretty text-fg-muted">
                            <CopyText copy={step.body} />
                          </p>
                        ) : null}
                      </div>
                    </article>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </ProcessJourney>
    </Section>
  );
}
