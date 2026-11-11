import { Layers, LifeBuoy, Lightbulb, Target, type LucideIcon } from "lucide-react";
import { reasons, sectionCopy, visibleOnly } from "@/lib/content";
import { CopyText } from "@/components/ui/CopyText";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { NetworkSphere } from "./why/NetworkSphere";

/*
 * Why Xentra (redesign step H4): navy band with a curved top edge. Left, the
 * network sphere; right, the heading and the reasons as glass cards.
 *
 * Renders only reasons whose copy is approved (all are drafts today, so in
 * production the section stays hidden until the copy is confirmed; review
 * builds show it with draft markers).
 */

/** Icons follow the order of `reasons` (sections.ts); update together. */
const icons: readonly LucideIcon[] = [Layers, Lightbulb, Target, LifeBuoy];

export function WhyXentra() {
  const items = visibleOnly(reasons);
  if (items.length === 0) return null;

  return (
    <Section id="why-xentra" tone="navy" labelledBy="why-title" edge className="overflow-x-clip">
      {/* Atmosphere behind the sphere. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-0 bg-[radial-gradient(45%_55%_at_22%_50%,rgb(47_107_255/0.12),transparent_70%)]"
      />
      <div className="relative grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="order-2 lg:order-1 lg:col-span-6">
          <NetworkSphere />
        </div>

        <div className="order-1 lg:order-2 lg:col-span-6">
          <SectionHeading
            id="why-title"
            eyebrow="Why Xentra"
            title={
              <>
                Why <span className="text-accent-gradient">Xentra</span>
              </>
            }
            intro={sectionCopy.whyIntro}
          />

          <ol data-reveal-group className="mt-10 grid gap-4 sm:grid-cols-2">
            {items.map((reason, index) => {
              const Icon = icons[index % icons.length];
              return (
                <li
                  key={reason.title.text}
                  data-reveal
                  className="group/reason relative rounded-2xl border border-white/8 bg-[linear-gradient(160deg,rgb(255_255_255/0.05),rgb(255_255_255/0.015))] p-5 shadow-[inset_0_1px_0_rgb(255_255_255/0.06)] transition-[border-color,box-shadow] duration-300 hover:border-blue-400/35 hover:shadow-[0_18px_40px_-20px_rgb(47_107_255/0.6),inset_0_1px_0_rgb(255_255_255/0.08)] sm:p-6"
                >
                  <div className="flex items-center justify-between">
                    <span className="grid size-10 place-items-center rounded-xl border border-blue-400/25 bg-blue-500/10 text-blue-300 transition-[background-color,color,box-shadow] duration-300 group-hover/reason:bg-blue-500/20 group-hover/reason:text-white group-hover/reason:shadow-[0_0_18px_-4px_rgb(47_107_255/0.8)]">
                      <Icon aria-hidden size={18} />
                    </span>
                    <span aria-hidden className="font-mono text-label text-fg-muted/70">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="mt-5 text-lg font-semibold tracking-tight text-balance">
                    <CopyText copy={reason.title} />
                  </h3>
                  <p className="mt-2 text-body text-pretty text-fg-muted">
                    <CopyText copy={reason.body} />
                  </p>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </Section>
  );
}
