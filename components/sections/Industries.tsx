import { Factory, HeartPulse, Sprout, type LucideIcon } from "lucide-react";
import { industriesIntro, industryGroups, isVisible, visibleOnly } from "@/lib/content";
import { CopyText } from "@/components/ui/CopyText";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Spotlight } from "@/components/ui/Spotlight";

/** Icon per group, keyed by slug (lib/content/industries.ts). */
const icons: Record<string, LucideIcon> = { goods: Factory, services: HeartPulse, stage: Sprout };

/*
 * Industries we work with (redesign step H6): three layered glass panels on
 * a black band with a curved top. Cursor light on desktop (Spotlight).
 * Content is DRAFT until the owner confirms it, so in production this
 * section renders nothing; review builds show it with draft markers.
 */
export function Industries() {
  const groups = visibleOnly(industryGroups);
  if (groups.length === 0) return null;

  return (
    <Section id="industries" tone="black" labelledBy="industries-title" edge className="overflow-x-clip">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_45%_at_50%_70%,rgb(47_107_255/0.12),transparent_70%)]"
      />
      <div className="relative">
        <SectionHeading
          id="industries-title"
          eyebrow="Industries"
          title={
            <>
              Industries we <span className="text-accent-gradient">work with</span>
            </>
          }
          intro={isVisible(industriesIntro) ? industriesIntro : null}
        />

        <Spotlight className="mt-12 grid gap-5 lg:mt-16 lg:grid-cols-3 lg:gap-6">
          {groups.map((group, index) => {
            const Icon = icons[group.slug] ?? Factory;
            return (
              <article
                key={group.slug}
                data-reveal
                data-spotlight
                aria-labelledby={`industry-${group.slug}`}
                // Layered: the middle panel sits lower on desktop.
                className={`group/ind relative overflow-hidden rounded-[1.25rem] border border-white/8 bg-[linear-gradient(165deg,rgb(255_255_255/0.06),rgb(255_255_255/0.015)_45%,rgb(47_107_255/0.05))] p-6 shadow-[0_30px_60px_-30px_rgb(0_0_0/0.9),inset_0_1px_0_rgb(255_255_255/0.07)] transition-[border-color,box-shadow] duration-300 hover:border-blue-400/35 hover:shadow-[0_30px_60px_-28px_rgb(47_107_255/0.45),inset_0_1px_0_rgb(255_255_255/0.09)] sm:p-8 ${index === 1 ? "lg:mt-10" : ""}`}
              >
                {/* Cursor light (desktop); invisible until --mx/--my are set. */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/ind:opacity-100 bg-[radial-gradient(260px_circle_at_var(--mx,50%)_var(--my,0%),rgb(47_107_255/0.16),transparent_70%)]"
                />
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <span className="grid size-12 place-items-center rounded-xl border border-blue-400/25 bg-blue-500/10 text-blue-300 shadow-[0_0_24px_-8px_rgb(47_107_255/0.7)]">
                      <Icon aria-hidden size={22} strokeWidth={1.75} />
                    </span>
                    <span aria-hidden className="font-mono text-label text-fg-muted/70">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 id={`industry-${group.slug}`} className="mt-6 text-h3 font-semibold tracking-tight">
                    <CopyText copy={group.name} />
                  </h3>
                  <p className="mt-3 text-body text-pretty text-fg-muted">
                    <CopyText copy={group.summary} />
                  </p>
                  <ul className="mt-6 flex flex-wrap gap-2 border-t border-line pt-6">
                    {group.industries.map((industry) => (
                      <li
                        key={industry.text}
                        className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-sm text-silver-100"
                      >
                        <CopyText copy={industry} />
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            );
          })}
        </Spotlight>
      </div>
    </Section>
  );
}
