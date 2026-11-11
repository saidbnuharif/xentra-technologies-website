import { ClipboardList, Code, Database, GraduationCap, PenTool, Wrench, type LucideIcon } from "lucide-react";
import { deliveryIntro, deliverySteps, isVisible } from "@/lib/content";
import { CopyText } from "@/components/ui/CopyText";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { DeliveryLine } from "./DeliveryLine";

/** One icon per delivery step, in order (update together with deliverySteps). */
const icons: readonly LucideIcon[] = [ClipboardList, PenTool, Code, Database, GraduationCap, Wrench];

/*
 * How We Work: second track — the software delivery steps inside the
 * Execute stage (redesign step P3). Navy band, vertical glowing line that
 * fills with scroll (DeliveryLine); on desktop the steps alternate left and
 * right of the line. DRAFT content: renders in review builds only until
 * the owner confirms the process.
 */
export function DeliveryTrack() {
  const items = deliverySteps.filter((s) => isVisible(s.title));
  if (items.length === 0) return null;

  return (
    <Section id="software-delivery" tone="navy" labelledBy="delivery-title" edge className="overflow-x-clip">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(40%_50%_at_50%_45%,rgb(47_107_255/0.12),transparent_70%)]"
      />
      <div className="relative">
        <SectionHeading
          id="delivery-title"
          eyebrow="Software delivery"
          title={
            <>
              For software <span className="text-accent-gradient">projects</span>
            </>
          }
          intro={deliveryIntro}
          align="center"
        />

        <DeliveryLine>
          <div className="relative mx-auto mt-14 max-w-5xl lg:mt-20">
            {/* Track: left on phones, centred from lg. */}
            <div
              aria-hidden
              data-dl-track
              className="absolute bottom-7 left-7 top-7 w-px bg-[linear-gradient(to_bottom,transparent,rgb(255_255_255/0.14)_6%,rgb(255_255_255/0.14)_94%,transparent)] lg:left-1/2"
            >
              <div
                data-dl-fill
                className="absolute inset-0 bg-[linear-gradient(to_bottom,var(--xt-blue-500),var(--xt-blue-300))] shadow-[0_0_12px_rgb(47_107_255/0.8)]"
              />
            </div>

            <ol className="relative grid gap-8 lg:gap-6">
              {items.map((step, index) => {
                const Icon = icons[index % icons.length];
                const right = index % 2 === 1;
                return (
                  <li
                    key={step.title.text}
                    data-dl-step
                    // Reveal on the row; the card keeps its own opacity for the dim state.
                    data-reveal
                    className="group/dl relative grid grid-cols-[3.5rem_1fr] items-start gap-5 lg:grid-cols-[1fr_3.5rem_1fr] lg:gap-10"
                  >
                    {/* Node on the line. Lit by default; dims until reached when JS runs. */}
                    <span
                      data-dl-node
                      aria-hidden
                      className="relative z-10 grid size-14 place-items-center rounded-2xl border border-blue-400/60 bg-blue-500 text-white shadow-[0_0_0_5px_rgb(47_107_255/0.14),0_10px_28px_-8px_rgb(47_107_255/0.8)] transition-all duration-500 group-data-[reached=false]/dl:border-white/12 group-data-[reached=false]/dl:bg-navy-900 group-data-[reached=false]/dl:text-silver-400 group-data-[reached=false]/dl:shadow-none lg:col-start-2 lg:row-start-1"
                    >
                      <Icon size={22} strokeWidth={1.75} />
                    </span>
                    <article
                      className={`rounded-2xl border border-white/8 bg-[linear-gradient(160deg,rgb(255_255_255/0.055),rgb(255_255_255/0.015))] p-6 shadow-[inset_0_1px_0_rgb(255_255_255/0.07)] transition-[border-color,box-shadow,opacity] duration-500 group-data-[reached=false]/dl:opacity-60 group-data-[reached=true]/dl:border-blue-400/30 group-data-[reached=true]/dl:shadow-[0_24px_50px_-28px_rgb(47_107_255/0.7),inset_0_1px_0_rgb(255_255_255/0.08)] sm:p-7 lg:row-start-1 ${right ? "lg:col-start-3" : "lg:col-start-1 lg:text-right"}`}
                    >
                      <p className="font-mono text-label font-medium uppercase tracking-[0.16em] text-accent">
                        Step {String(index + 1).padStart(2, "0")}
                      </p>
                      <h3 className="mt-2 text-h3 font-semibold tracking-tight">
                        <CopyText copy={step.title} />
                      </h3>
                      <p className="mt-2 text-body text-pretty text-fg-muted">
                        <CopyText copy={step.body} />
                      </p>
                    </article>
                  </li>
                );
              })}
            </ol>
          </div>
        </DeliveryLine>
      </div>
    </Section>
  );
}
