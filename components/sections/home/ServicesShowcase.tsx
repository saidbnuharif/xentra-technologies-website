import type { CSSProperties } from "react";
import { ArrowUpRight, ChartColumnIncreasing, CodeXml, Cpu, Layers, Megaphone, ScanSearch, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { servicesShowcase } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { CopyText } from "@/components/ui/CopyText";
import { InViewFlag } from "@/components/ui/InViewFlag";
import { GlassServicesMotion } from "../services/GlassServicesMotion";
import "../services/glass-services.css";

const pad = (n: number) => String(n).padStart(2, "0");

/*
 * Home: "Our Services" — after the owner's visual reference (13 Nov 2026).
 *
 * Six floating glassmorphism cards (frosted, translucent interface windows
 * with thin glowing blue / violet borders and a neon glow on one corner of
 * each) in a layered composition over a deep black / midnight-navy field
 * with floating glass cubes, particles and soft light. Two rows of three
 * on desktop, each card with its own rotation, offset, scale and depth,
 * overlapping only at their edges; two columns on tablets; one clean
 * column on phones. Copy is word for word from the reference; each
 * Explore opens the closest service on /services.
 *
 * Motion (GlassServicesMotion): cards arrive from different directions in
 * a stagger as the section enters; they float at their own speeds while on
 * screen (desktop); the composition shifts in depth with the mouse; a
 * hovered card lifts, tilts toward the cursor and its border lights up.
 * Reduced motion / no JS: the finished composition, still.
 * id stays "services-overview" for existing links.
 */

const ICONS: readonly LucideIcon[] = [CodeXml, Megaphone, Cpu, ScanSearch, ChartColumnIncreasing, Layers];

/** Composition per card (desktop): offset, rotation, scale, depth, float,
 *  neon corner and colour, entrance direction. */
const CARDS = [
  { tx: "0rem", ty: "0rem", r: "4deg", s: 1, d: 0.85, dur: "7.5s", glow: "bl", edge: "violet", from: "left" },
  { tx: "-0.5rem", ty: "0.5rem", r: "5deg", s: 0.96, d: 0.6, dur: "8.8s", glow: "br", edge: "blue", from: "top" },
  { tx: "0.5rem", ty: "-0.75rem", r: "-4deg", s: 1.03, d: 1, dur: "6.8s", glow: "tr", edge: "blue", from: "right" },
  { tx: "1rem", ty: "-1.25rem", r: "-5deg", s: 1, d: 0.9, dur: "8.2s", glow: "br", edge: "violet", from: "left" },
  { tx: "-0.25rem", ty: "-0.75rem", r: "-4deg", s: 1.02, d: 0.7, dur: "9.4s", glow: "bl", edge: "violet", from: "bottom" },
  { tx: "-0.5rem", ty: "-1rem", r: "-3deg", s: 0.98, d: 0.8, dur: "7.2s", glow: "tl", edge: "blue", from: "right" },
] as const;

export function ServicesShowcase() {
  const { eyebrow, title, intro, items } = servicesShowcase;
  const total = items.length;

  return (
    <section id="services-overview" aria-labelledby="services-overview-title" className="tone-black relative overflow-x-clip">
      <InViewFlag />
      {/* Midnight field: navy depth, blue and violet light. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(40%_45%_at_12%_55%,rgb(47_107_255/0.22),transparent_70%),radial-gradient(38%_45%_at_90%_80%,rgb(124_92_255/0.22),transparent_70%),radial-gradient(60%_50%_at_50%_45%,rgb(12_22_60/0.9),transparent_80%)]"
      />
      <Container className="relative py-section">
        <div className="mx-auto max-w-3xl text-center">
          <p data-reveal className="flex items-center justify-center gap-4 font-mono text-label font-medium tracking-[0.42em] text-silver-200 uppercase">
            <span aria-hidden className="h-px w-12 bg-gradient-to-r from-transparent to-blue-400/80" />
            <CopyText copy={eyebrow} />
            <span aria-hidden className="h-px w-12 bg-gradient-to-l from-transparent to-blue-400/80" />
          </p>
          <h2
            id="services-overview-title"
            data-reveal="lines"
            className="mt-5 text-[clamp(1.9rem,1.2rem+2.6vw,3.5rem)] leading-[1.08] font-semibold tracking-tight text-balance"
          >
            <CopyText copy={title} />
          </h2>
          <p data-reveal className="mx-auto mt-5 max-w-xl text-lead text-pretty text-silver-300">
            <CopyText copy={intro} />
          </p>
        </div>

        <GlassServicesMotion className="gp-field relative mt-14 lg:mt-20">
          {/* Background: floating glass cubes, bokeh, particles. */}
          <div aria-hidden className="pointer-events-none absolute -inset-x-[12%] -inset-y-24 overflow-hidden">
            <div className="absolute left-[4%] top-[12%] size-[20rem] rounded-full bg-[radial-gradient(closest-side,rgb(47_107_255/0.3),transparent)]" />
            <div className="absolute bottom-[0%] right-[6%] size-[24rem] rounded-full bg-[radial-gradient(closest-side,rgb(124_92_255/0.26),transparent)]" />
            <span className="hs-cube gp-shape absolute left-[2%] top-[30%] size-24 rotate-[18deg]" />
            <span className="hs-cube hs-cube--violet gp-shape gp-shape--slow absolute bottom-[8%] left-[6%] size-20 -rotate-12" />
            <span className="hs-cube gp-shape gp-shape--slow absolute right-[3%] top-[2%] size-20 rotate-[24deg]" />
            <span className="hs-cube hs-cube--violet gp-shape absolute bottom-[2%] right-[1%] size-28 rotate-12" />
            <span className="hs-cube gp-shape absolute left-[47%] top-[44%] size-14 rotate-45 opacity-70" />
            <div className="gp-particles absolute inset-0" />
          </div>

          <ol className="relative grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-x-6 lg:gap-y-8">
            {items.map((service, i) => {
              const Icon = ICONS[i % ICONS.length];
              const C = CARDS[i % CARDS.length];
              const style = {
                "--tx": C.tx,
                "--ty": C.ty,
                "--r": C.r,
                "--s": String(C.s),
                "--dur": C.dur,
                "--delay": `${-i * 1.4}s`,
                zIndex: Math.round(C.d * 10),
              } as CSSProperties;
              return (
                <li key={service.key} data-gp-item className="gp-item hs-item relative" style={style}>
                  <div data-gp-depth data-depth={C.d} className="h-full">
                    <div data-gp-float className="h-full">
                      <div data-gp-enter data-from={C.from} className="h-full">
                        <article
                          data-gp-panel
                          data-glow={C.glow}
                          data-edge={C.edge}
                          aria-labelledby={`hs-${service.key}`}
                          className="group/gp gp-panel hs-card relative flex h-full min-h-[18rem] flex-col rounded-[1.6rem]"
                        >
                          {/* Window indicators + index */}
                          <div aria-hidden className="flex items-center justify-between px-6 pt-5">
                            <span className="flex gap-2">
                              <span className="size-2.5 rounded-full bg-white/80 shadow-[0_0_8px_rgb(255_255_255/0.6)]" />
                              <span className="size-2.5 rounded-full bg-white/60" />
                              <span className="size-2.5 rounded-full bg-white/40" />
                            </span>
                            <span className="font-mono text-[0.72rem] font-medium tracking-[0.2em] text-silver-200">
                              SVC.{pad(i + 1)} / {pad(total)}
                            </span>
                          </div>

                          <div className="relative flex flex-1 flex-col px-6 pb-6 pt-5 sm:px-7">
                            <span className="grid size-14 place-items-center rounded-2xl border border-white/20 bg-[linear-gradient(145deg,#3d7dff,#2a3fd6_55%,#6b4dff)] text-white shadow-[0_10px_30px_-8px_rgb(80_110_255/0.9),inset_0_1px_0_rgb(255_255_255/0.35)] transition-shadow duration-300 group-hover/gp:shadow-[0_12px_38px_-6px_rgb(110_130_255/1),inset_0_1px_0_rgb(255_255_255/0.4)]">
                              <Icon aria-hidden size={26} strokeWidth={2} />
                            </span>
                            <h3 id={`hs-${service.key}`} className="mt-5 text-[clamp(1.35rem,1.1rem+0.7vw,1.75rem)] font-semibold leading-tight tracking-tight text-white">
                              <CopyText copy={service.title} />
                            </h3>
                            <p className="mt-3 max-w-[22rem] text-body leading-relaxed text-pretty text-silver-200">
                              <CopyText copy={service.description} />
                            </p>
                            <Link
                              href={service.href}
                              className="hs-explore mt-auto inline-flex min-h-11 items-center gap-1.5 self-start rounded-full border border-white/15 bg-white/[0.08] px-5 py-2 text-sm font-medium text-white transition-[background-color,border-color,box-shadow] duration-300 after:absolute after:inset-0 after:rounded-[1.6rem] hover:border-blue-300/50 hover:bg-white/[0.14] focus-visible:border-blue-300/60"
                            >
                              Explore
                              <ArrowUpRight aria-hidden size={16} />
                              <span className="sr-only"> {service.title.text}</span>
                            </Link>
                          </div>
                        </article>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </GlassServicesMotion>
      </Container>
    </section>
  );
}
