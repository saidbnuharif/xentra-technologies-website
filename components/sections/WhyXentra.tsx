import { Layers, Puzzle, Target, TrendingUp, type LucideIcon } from "lucide-react";
import { reasons, sectionCopy, visibleOnly } from "@/lib/content";
import { CopyText } from "@/components/ui/CopyText";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { NetworkSphere } from "./why/NetworkSphere";

/*
 * Why Xentra (Home): navy band with a curved top edge. Left, the network
 * sphere; right, the heading, the one-line statement and the four reasons
 * as titles only. Kept minimal on purpose: no paragraphs on Home.
 *
 * Reasons are built from Xentra's approved About Us copy (sections.ts).
 */

/** Icons follow the order of `reasons` (sections.ts); update together. */
const icons: readonly LucideIcon[] = [Layers, TrendingUp, Puzzle, Target];

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

          {/* Minimal on Home: the four reasons as titles only (no cards, no
              paragraphs), each on a hairline that lights up in blue on hover. */}
          <ol data-reveal-group className="mt-10 grid gap-x-10 sm:grid-cols-2">
            {items.map((reason, index) => {
              const Icon = icons[index % icons.length];
              return (
                <li
                  key={reason.title.text}
                  data-reveal
                  className="group/reason relative flex items-center gap-4 border-t border-white/10 py-5"
                >
                  <span
                    aria-hidden
                    className="absolute left-0 top-[-1px] h-px w-0 bg-[linear-gradient(to_right,#5a8bff,transparent)] shadow-[0_0_10px_rgb(47_107_255/0.9)] transition-[width] duration-500 group-hover/reason:w-full"
                  />
                  <span aria-hidden className="font-mono text-label text-accent">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <Icon aria-hidden size={18} strokeWidth={1.75} className="shrink-0 text-blue-300 transition-colors group-hover/reason:text-white" />
                  <h3 className="text-[1.0625rem] font-semibold leading-snug tracking-tight text-balance">
                    <CopyText copy={reason.title} />
                  </h3>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </Section>
  );
}
