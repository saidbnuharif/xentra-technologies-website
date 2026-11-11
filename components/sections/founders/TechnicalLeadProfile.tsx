import Image from "next/image";
import {
  Boxes,
  Bot,
  Code,
  Gauge,
  MonitorSmartphone,
  PenTool,
  Rocket,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { technicalHead, type ExpertiseIcon } from "@/lib/content";
import { CopyText } from "@/components/ui/CopyText";
import { PortraitPlaceholder } from "./PortraitPlaceholder";

const icons: Record<ExpertiseIcon, LucideIcon> = {
  web: MonitorSmartphone,
  code: Code,
  design: PenTool,
  motion: Sparkles,
  systems: Boxes,
  ai: Bot,
  performance: Gauge,
  deploy: Rocket,
};

/**
 * Featured leadership profile for the Technical Head, inside the Founders &
 * Leadership section. A dark navy panel (the same treatment as About's
 * domain panel) gives it more prominence than the founder profiles; the
 * portrait reuses the section's framed, clip-revealed style.
 *
 * Animation (shared MotionRoot attributes): panel rises in, portrait wipes
 * upward, then label → name → designation → rule → intro → expertise items
 * arrive in sequence. Desktop hover warms the portrait and opens the frame.
 */
export function TechnicalLeadProfile() {
  const lead = technicalHead;
  const nameId = "technical-head-name";

  return (
    <article
      data-reveal
      aria-labelledby={nameId}
      className="tone-navy group relative mt-16 overflow-hidden rounded-[1.5rem] lg:mt-20"
    >
      {/* Faint blueprint grid + restrained light from the portrait side. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgb(255_255_255/0.035)_1px,transparent_1px),linear-gradient(90deg,rgb(255_255_255/0.035)_1px,transparent_1px)] bg-size-[48px_48px] [mask-image:radial-gradient(ellipse_at_left,black,transparent_70%)]"
      />
      <div aria-hidden className="pointer-events-none absolute -left-24 top-1/4 size-96 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="relative grid gap-12 p-6 sm:p-10 lg:grid-cols-12 lg:items-center lg:gap-14 lg:p-14">
        {/* Portrait */}
        <div className="relative mx-auto w-full max-w-sm lg:col-span-5 lg:max-w-none">
          <div aria-hidden className="pointer-events-none absolute -inset-3">
            {(["left-0 top-0 border-l border-t", "right-0 top-0 border-r border-t", "bottom-0 left-0 border-b border-l", "bottom-0 right-0 border-b border-r"] as const).map((pos) => (
              <span
                key={pos}
                className={`absolute size-5 border-silver-400/60 transition-all duration-500 group-hover:border-blue-400 ${pos}`}
              />
            ))}
          </div>
          <div data-reveal="clip" className="relative aspect-[4/5] overflow-hidden rounded-card bg-navy-900">
            {lead.photo ? (
              <div data-reveal-media className="absolute inset-0">
                <Image
                  src={lead.photo}
                  alt={`Portrait of ${lead.name.text}, ${lead.designation.text}`}
                  fill
                  sizes="(min-width: 64rem) 420px, (min-width: 24rem) 384px, 100vw"
                  className="object-cover grayscale-[30%] transition duration-700 ease-out group-hover:scale-[1.03] group-hover:grayscale-0"
                />
                <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-navy-950/60 to-transparent" />
              </div>
            ) : (
              // Neutral branded stand-in until the genuine photograph arrives.
              <PortraitPlaceholder />
            )}
            {/* Role badge set into the portrait. */}
            <span className="absolute right-4 top-4 rounded-full border border-blue-400/40 bg-navy-950/80 px-3 py-1 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-blue-300 backdrop-blur-sm">
              {lead.designation.text}
            </span>
          </div>
        </div>

        {/* Profile */}
        <div data-reveal-group className="lg:col-span-7">
          <p data-reveal className="flex items-center gap-3 font-mono text-label uppercase tracking-[0.2em] text-accent">
            <span aria-hidden className="h-px w-8 bg-current" />
            Technical Leadership
          </p>

          <h3 id={nameId} data-reveal className="mt-6 text-statement font-semibold tracking-tight text-balance">
            <CopyText copy={lead.name} />
          </h3>

          <p data-reveal className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-body">
            <span className="rounded-md bg-blue-500 px-3 py-1 font-medium text-white">
              {lead.designation.text}
            </span>
            <span className="text-silver-300">{lead.organisation}</span>
          </p>

          <span aria-hidden data-reveal="line" className="mt-8 block h-px w-full bg-line" />

          <p data-reveal className="mt-8 max-w-2xl text-lead text-pretty text-silver-200">
            <CopyText copy={lead.intro} />
          </p>

          <h4 data-reveal className="mt-10 font-mono text-label uppercase tracking-[0.18em] text-fg-muted">
            Areas of expertise
          </h4>
          <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
            {lead.expertise.map((item) => {
              const Icon = icons[item.icon];
              return (
                <li
                  key={item.label}
                  data-reveal
                  className="group/skill flex items-center gap-3 rounded-lg border border-line bg-white/[0.02] px-3.5 py-3 transition-colors duration-300 hover:border-blue-400/50 hover:bg-blue-500/[0.06]"
                >
                  <span aria-hidden className="grid size-9 shrink-0 place-items-center rounded-md border border-blue-400/30 bg-blue-500/10 text-blue-300 transition-colors duration-300 group-hover/skill:bg-blue-500 group-hover/skill:text-white">
                    <Icon size={17} strokeWidth={1.75} />
                  </span>
                  <span className="text-[0.9375rem] leading-snug text-silver-100">{item.label}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </article>
  );
}
