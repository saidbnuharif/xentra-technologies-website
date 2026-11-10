import type { CSSProperties } from "react";
import { Bot, Boxes, Globe, TrendingUp, type LucideIcon } from "lucide-react";
import { serviceCategories } from "@/lib/content";
import "./hero-visual.css";
import { HeroVisualMotion } from "./HeroVisualMotion";

/*
 * Connected-services ecosystem: one central XENTRA element linked to the
 * four approved solution domains. Server-rendered HTML + SVG — no images.
 *
 * Geometry is expressed in percentages of the stage so the same markup
 * works as a 1:1 square in the desktop column and a shorter 5:4 stage on
 * tablet and mobile. Connector lines use a 0–100 viewBox stretched to the
 * stage, so their endpoints always meet the domain positions.
 *
 * Entrance animation lives in <HeroVisualMotion> (client). Elements marked
 * data-hv-anim / data-hv-line start hidden only when scripting is on and
 * motion is allowed (see hero-visual.css), so there is no flash.
 */

type Domain = {
  icon: LucideIcon;
  /** Domain centre, as % of the stage. */
  x: number;
  y: number;
  /** Phone (<640px) vertical position: symmetric, as the 5:4 stage is short. */
  yPhone: number;
  /** Curve control point for the connector, as % of the stage. */
  cx: number;
  cy: number;
};

// Pinwheel arrangement around the centre: balanced but not a rigid grid.
// On phones the cards sit level so they clear the centre; connector ends
// still fall inside each card, so the lines need no phone variant.
const layout: readonly Domain[] = [
  { icon: Globe, x: 21, y: 17, yPhone: 14, cx: 30, cy: 40 },
  { icon: TrendingUp, x: 79, y: 23, yPhone: 14, cx: 62, cy: 30 },
  { icon: Bot, x: 79, y: 83, yPhone: 86, cx: 70, cy: 60 },
  { icon: Boxes, x: 21, y: 77, yPhone: 86, cx: 38, cy: 70 },
];

export function HeroVisual() {
  const domains = serviceCategories.map((category, i) => ({
    name: category.name.text,
    ...layout[i],
  }));

  return (
    <HeroVisualMotion>
      <div
        data-hero-visual
        role="img"
        aria-label={`Xentra connects four solution areas: ${domains.map((d) => d.name).join(", ")}.`}
        className="relative mx-auto aspect-[5/4] w-full max-w-[34rem] select-none lg:aspect-square lg:max-w-none"
      >
        {/* Fine dot field, fading out from the centre. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(rgb(255_255_255/0.08)_1px,transparent_1.2px)] bg-size-[22px_22px] [mask-image:radial-gradient(circle_at_center,black_10%,transparent_68%)]"
        />

        {/* Static blue glow behind the centre. */}
        <div
          aria-hidden
          data-hv-glow
          data-hv-anim
          className={`absolute left-1/2 top-1/2 aspect-square h-[58%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/20 blur-3xl`}
        />

        {/* Orbits: inner solid, outer dashed — depth without motion. */}
        <div
          aria-hidden
          data-hv-ring
          data-hv-anim
          className={`absolute left-1/2 top-1/2 aspect-square h-[60%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-silver-300/15`}
        />
        <div
          aria-hidden
          data-hv-ring
          data-hv-anim
          className={`absolute left-1/2 top-1/2 aspect-square h-[94%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-silver-300/10`}
        />

        {/* Connectors: centre → each domain. */}
        <svg
          aria-hidden
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 size-full overflow-visible"
        >
          <defs>
            <linearGradient id="hv-line" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="var(--xt-blue-400)" />
              <stop offset="1" stopColor="var(--xt-silver-300)" stopOpacity="0.55" />
            </linearGradient>
          </defs>
          {domains.map((d) => (
            <path
              key={d.name}
              data-hv-line
              d={`M50 50 Q${d.cx} ${d.cy} ${d.x} ${d.y}`}
              pathLength={1}
              strokeDasharray="1"
              fill="none"
              stroke="url(#hv-line)"
              // In viewBox units (~1.2px at 495px). Deliberately not
              // vector-effect="non-scaling-stroke": that breaks the
              // pathLength-based line drawing in Chromium.
              strokeWidth="0.25"
            />
          ))}
        </svg>

        {/* Central ecosystem element (wordmark set in type — not the logo). */}
        <div
          data-hv-center
          data-hv-anim
          className={`absolute left-1/2 top-1/2 grid aspect-square h-[30%] -translate-x-1/2 sm:h-[36%] -translate-y-1/2 place-items-center rounded-full border border-blue-500/50 bg-navy-950 shadow-[0_0_0_10px_rgb(47_107_255/0.06),inset_0_1px_0_rgb(255_255_255/0.08)]`}
        >
          <div className="absolute inset-[9%] rounded-full border border-silver-300/15" />
          <div className="relative text-center">
            {/* Phones get tighter type so both words clear the inner ring. */}
            <span className="block pl-[0.22em] text-[0.75rem] font-semibold tracking-[0.22em] text-silver-50 sm:pl-[0.3em] sm:text-[clamp(0.8125rem,0.6rem+1vw,1.125rem)] sm:tracking-[0.3em]">
              XENTRA
            </span>
            <span className="mt-1 block pl-[0.12em] font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-blue-300 sm:mt-1.5 sm:pl-[0.2em] sm:text-[0.6875rem] sm:tracking-[0.2em]">
              Ecosystem
            </span>
          </div>
        </div>

        {/* Four solution domains. */}
        {domains.map((d, i) => {
          const Icon = d.icon;
          return (
            <div
              key={d.name}
              data-hv-domain
              data-hv-anim
              style={
                {
                  left: `${d.x}%`,
                  "--hv-y": `${d.y}%`,
                  "--hv-y-phone": `${d.yPhone}%`,
                } as CSSProperties
              }
              className="absolute top-(--hv-y-phone) w-[38%] max-w-[11.5rem] -translate-x-1/2 -translate-y-1/2 sm:top-(--hv-y)"
            >
              <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-navy-950/90 p-2.5 shadow-[0_12px_32px_-12px_rgb(0_0_0/0.8)] backdrop-blur-sm sm:gap-3 sm:p-3">
                <span className="grid size-7 shrink-0 place-items-center rounded-lg border border-blue-500/40 bg-blue-500/10 text-blue-300 sm:size-9">
                  <Icon aria-hidden strokeWidth={1.5} className="size-3.5 sm:size-[1.125rem]" />
                </span>
                <span className="min-w-0">
                  <span className="block font-mono text-[0.625rem] text-blue-300 sm:text-[0.6875rem]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="block text-[0.75rem] font-medium leading-tight text-silver-100 sm:text-[0.8125rem]">
                    {d.name}
                  </span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </HeroVisualMotion>
  );
}
