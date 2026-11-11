import { ArrowRight, ChartColumn, ClipboardCheck, Gauge, Rocket, Search, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { steps, type Copy } from "@/lib/content";
import { CopyText } from "@/components/ui/CopyText";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProcessTimeline } from "./process/ProcessTimeline";

type ProcessProps = {
  /** "full" on /how-we-work (stage explanations); "preview" on Home. */
  variant?: "full" | "preview";
  intro?: Copy | null;
};

/** One icon per approved stage, in order (update together with `steps`). */
const icons: readonly LucideIcon[] = [Search, ChartColumn, ClipboardCheck, Rocket, Gauge];

/*
 * Five-stage timeline (redesign step H5): light band with a curved top,
 * glass icon badges joined by a glowing line. Server-rendered and complete
 * on its own; <ProcessTimeline> (client) adds the scroll-linked fill, a
 * spark of light at its tip, and step states (data-state on each step,
 * styled below with Tailwind data variants). With no state set (no JS /
 * reduced motion) every step shows in full.
 * Stage names are approved; explanations are pending (handoff document).
 */
export function Process({ variant = "full", intro = null }: ProcessProps) {
  const preview = variant === "preview";

  return (
    <Section id={preview ? "how-we-work-preview" : "stages"} tone="light" labelledBy="process-title" edge>
      {/* Faint dot grid fading out from the centre, plus soft blue light. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgb(31_86_224/0.09)_1px,transparent_1.3px)] bg-size-[26px_26px] [mask-image:radial-gradient(70%_60%_at_50%_60%,black,transparent)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(40%_50%_at_85%_20%,rgb(47_107_255/0.08),transparent_70%)]"
      />

      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading
          id="process-title"
          eyebrow={preview ? "Our approach" : "How We Work"}
          title={
            preview ? (
              <>
                How We <span className="text-accent-gradient">Work</span>
              </>
            ) : (
              <>
                Five stages, <span className="text-accent-gradient">one clear process</span>
              </>
            )
          }
          intro={intro}
        />
        {preview ? (
          <Link
            href="/how-we-work"
            className="group inline-flex min-h-11 shrink-0 items-center gap-2 font-medium text-accent"
          >
            See each stage in detail
            <ArrowRight
              aria-hidden
              size={18}
              className="transition-transform group-hover:translate-x-1 group-focus-visible:translate-x-1"
            />
          </Link>
        ) : null}
      </div>

      <ProcessTimeline>
        <div className="relative mt-12 lg:mt-16">
          {/* Track + scroll-driven fill + spark: vertical on small screens, horizontal on lg. */}
          <div
            aria-hidden
            data-process-track
            className="absolute bottom-7 left-7 top-7 w-px bg-[linear-gradient(to_bottom,transparent,#c9d2e3_8%,#c9d2e3_92%,transparent)] lg:inset-x-0 lg:bottom-auto lg:left-0 lg:top-7 lg:h-px lg:w-full lg:bg-[linear-gradient(to_right,transparent,#c9d2e3_6%,#c9d2e3_94%,transparent)]"
          >
            <div
              data-process-fill
              className="absolute inset-0 bg-[linear-gradient(to_bottom,var(--xt-blue-500),var(--xt-blue-400))] shadow-[0_0_10px_rgb(47_107_255/0.7)] lg:bg-[linear-gradient(to_right,var(--xt-blue-600),var(--xt-blue-400))]"
            />
            <span
              data-process-spark
              className="absolute left-0 top-0 hidden size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_0_3px_rgb(47_107_255/0.35),0_0_16px_4px_rgb(47_107_255/0.8)]"
            />
          </div>

          <ol className="relative grid gap-10 lg:grid-cols-5 lg:gap-8">
            {steps.map((step, index) => {
              const Icon = icons[index % icons.length];
              return (
                <li
                  key={step.title.text}
                  data-process-step
                  className="group/step relative grid grid-cols-[3.5rem_1fr] gap-5 lg:block"
                >
                  {/* Glass badge. States: upcoming (muted), active (blue,
                      glowing), done (blue outline). Default = full colour. */}
                  <span
                    aria-hidden
                    data-process-marker
                    className="relative z-10 grid size-14 place-items-center rounded-2xl border border-blue-500/30 bg-white/80 text-blue-600 shadow-[0_10px_24px_-12px_rgb(31_86_224/0.45),inset_0_1px_0_white] backdrop-blur-sm transition-all duration-500 group-hover/step:-translate-y-0.5 group-hover/step:shadow-[0_14px_30px_-12px_rgb(31_86_224/0.6),inset_0_1px_0_white] group-data-[state=active]/step:scale-110 group-data-[state=active]/step:border-blue-500 group-data-[state=active]/step:bg-blue-500 group-data-[state=active]/step:text-white group-data-[state=active]/step:shadow-[0_0_0_6px_rgb(47_107_255/0.14),0_12px_30px_-8px_rgb(47_107_255/0.8)] group-data-[state=upcoming]/step:border-line group-data-[state=upcoming]/step:text-silver-400 group-data-[state=upcoming]/step:shadow-none"
                  >
                    <Icon size={22} strokeWidth={1.75} />
                  </span>
                  <div className="transition-[opacity,translate] duration-500 group-data-[state=upcoming]/step:translate-y-1.5 group-data-[state=upcoming]/step:opacity-40 group-data-[state=done]/step:opacity-80 lg:mt-7">
                    <p className="font-mono text-label font-medium uppercase tracking-[0.16em] text-accent">
                      {String(index + 1).padStart(2, "0")}
                      <span className="sr-only"> — stage {index + 1} of {steps.length}</span>
                    </p>
                    <h3 className="mt-2 text-h3 font-semibold tracking-tight">
                      <CopyText copy={step.title} />
                    </h3>
                    {preview ? null : (
                      <p className="mt-3 max-w-xs text-body text-pretty text-fg-muted empty:hidden">
                        <CopyText copy={step.body} />
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </ProcessTimeline>
    </Section>
  );
}
