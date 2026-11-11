import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { homeCopy, serviceGroups, type ServiceVisual as VisualKey } from "@/lib/content";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { CopyText } from "@/components/ui/CopyText";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { SectionEdge } from "@/components/ui/SectionEdge";
import { ServicesExperience } from "../services/ServicesExperience";
import { ServiceVisual } from "../services/visuals";

/*
 * Home: services showcase (redesign step H3).
 *
 * The approved pinned-scroll experience (ServicesExperience — unchanged:
 * pin, scrubbed transitions, snapping, counter, progress, jump dots) now
 * presents the CONFIRMED service groups, one panel per group, built from
 * lib/content/services.ts. A group added there (e.g. Business Software &
 * Automation) appears here automatically, with its illustration below.
 *
 * Server-rendered and fully readable without JavaScript, with reduced
 * motion and on small screens (stacked panels). id stays
 * "services-overview": the hero's "Explore Our Services" scrolls here.
 */

/** Existing illustrations, matched to each group. */
const visualFor: Record<string, VisualKey> = {
  "business-growth-advisory": "consultancy",
  "digital-services": "website",
  "business-software-automation": "erp",
};

const pad = (n: number) => String(n).padStart(2, "0");

export function ServicesShowcase() {
  const total = serviceGroups.length;

  return (
    <section id="services-overview" aria-labelledby="services-overview-title" className="tone-black relative">
      <SectionEdge glowId="edge-services-overview" />
      {/* Atmosphere: soft blue light behind the stage. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_40%_at_75%_55%,rgb(47_107_255/0.1),transparent_70%),radial-gradient(35%_30%_at_10%_20%,rgb(214_220_229/0.03),transparent_70%)]"
      />

      <ServicesExperience>
        <Container data-svc-intro className="relative pt-section pb-12 lg:pb-16">
          <Eyebrow>What we do</Eyebrow>
          <div className="mt-6 grid gap-6 lg:grid-cols-12 lg:items-end">
            <h2
              id="services-overview-title"
              className="text-h2 font-semibold tracking-tight text-balance lg:col-span-7"
            >
              Our <span className="text-accent-gradient">Services</span>
            </h2>
            <div className="flex flex-col items-start gap-4 lg:col-span-5">
              <p className="text-lead text-pretty text-fg-muted empty:hidden">
                <CopyText copy={homeCopy.servicesIntro} />
              </p>
              <Link
                href="/services"
                className="group inline-flex min-h-11 items-center gap-2 font-medium text-accent"
              >
                View all services
                <ArrowRight
                  aria-hidden
                  size={18}
                  className="transition-transform group-hover:translate-x-1 group-focus-visible:translate-x-1"
                />
              </Link>
            </div>
          </div>
        </Container>

        <div
          data-svc-stage
          className="relative group-data-[pinned=true]/svc:h-svh group-data-[pinned=true]/svc:overflow-hidden"
        >
          <Container className="relative group-data-[pinned=true]/svc:h-full group-data-[pinned=true]/svc:pt-nav">
            <div data-svc-track className="relative group-data-[pinned=true]/svc:h-full">
              {serviceGroups.map((group, index) => (
                <article
                  key={group.slug}
                  data-svc-panel
                  aria-labelledby={`showcase-${group.slug}`}
                  className="grid gap-10 border-t border-line py-14 sm:py-16 md:grid-cols-2 md:items-center md:gap-10 lg:grid-cols-12 lg:gap-14 group-data-[pinned=true]/svc:absolute group-data-[pinned=true]/svc:inset-0 group-data-[pinned=true]/svc:border-t-0 group-data-[pinned=true]/svc:py-0 group-data-[pinned=true]/svc:pb-28"
                >
                  <div className="lg:col-span-5">
                    <p
                      data-svc-text
                      className="flex items-center gap-3 font-mono text-label uppercase tracking-[0.18em] text-fg-muted"
                    >
                      <span className="text-accent">{pad(index + 1)}</span>
                      <span aria-hidden className="h-px w-6 bg-line" />
                      {group.services.length} services
                    </p>
                    <h3
                      id={`showcase-${group.slug}`}
                      data-svc-text
                      className="mt-5 text-[clamp(1.75rem,1.2rem+1.9vw,2.75rem)] font-semibold leading-[1.05] tracking-tight text-balance"
                    >
                      <CopyText copy={group.name} />
                    </h3>
                    <p data-svc-text className="mt-5 max-w-md text-lead text-pretty text-fg-muted empty:hidden">
                      <CopyText copy={group.intro} />
                    </p>

                    {/* Each service: a glass chip linking to its entry (and
                        enquiry button) on the Services page. */}
                    <ul data-svc-text className="mt-7 grid gap-2 sm:grid-cols-2">
                      {group.services.map((service) => (
                        <li key={service.slug}>
                          <Link
                            href={`/services#${service.slug}`}
                            className="group/chip flex min-h-12 items-center justify-between gap-3 rounded-xl border border-white/8 bg-white/[0.035] px-4 py-2.5 text-sm text-silver-100 backdrop-blur-sm transition-[border-color,background-color,color,box-shadow] duration-300 hover:border-blue-400/45 hover:bg-blue-500/10 hover:text-white hover:shadow-[0_0_24px_-8px_rgb(47_107_255/0.6)] focus-visible:border-blue-400/60 focus-visible:text-white"
                          >
                            <CopyText copy={service.name} />
                            <ArrowUpRight
                              aria-hidden
                              size={15}
                              className="shrink-0 text-silver-500 transition-[color,translate] duration-300 group-hover/chip:-translate-y-0.5 group-hover/chip:translate-x-0.5 group-hover/chip:text-blue-300 group-focus-visible/chip:text-blue-300"
                            />
                          </Link>
                        </li>
                      ))}
                    </ul>

                    <div data-svc-text className="mt-7">
                      <ButtonLink href={`/services#${group.slug}`} variant="secondary" size="md">
                        Explore {group.name.text}
                        <ArrowRight aria-hidden size={16} />
                      </ButtonLink>
                    </div>
                  </div>

                  {/* Visual in a glass frame with an electric-blue glow. */}
                  <div
                    data-svc-visual
                    className="relative aspect-[4/3] w-full lg:col-span-7 group-data-[pinned=true]/svc:aspect-auto group-data-[pinned=true]/svc:h-[min(62svh,35rem)]"
                  >
                    <div
                      aria-hidden
                      className="pointer-events-none absolute -inset-x-3 -inset-y-6 -z-10 rounded-[2rem] lg:-inset-6 bg-[radial-gradient(60%_60%_at_50%_55%,rgb(47_107_255/0.22),transparent_70%)] blur-2xl"
                    />
                    <div className="relative h-full rounded-[1.5rem] border border-white/10 bg-[linear-gradient(160deg,rgb(255_255_255/0.06),rgb(255_255_255/0.015)_40%,rgb(47_107_255/0.05))] p-2.5 shadow-[0_30px_80px_-30px_rgb(0_0_0/0.9),inset_0_1px_0_rgb(255_255_255/0.08)] sm:p-3">
                      <ServiceVisual visual={visualFor[group.slug] ?? "consultancy"} />
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Progress + index: only shown in pinned mode */}
            <div className="hidden group-data-[pinned=true]/svc:absolute group-data-[pinned=true]/svc:inset-x-gutter group-data-[pinned=true]/svc:bottom-8 group-data-[pinned=true]/svc:flex group-data-[pinned=true]/svc:items-center group-data-[pinned=true]/svc:gap-6">
              <p className="font-mono text-label tabular-nums text-fg-muted">
                <span data-svc-counter className="text-fg">
                  01
                </span>{" "}
                / {pad(total)}
              </p>
              <div className="h-px w-40 overflow-hidden bg-line xl:w-56">
                <div data-svc-progress className="h-full w-full origin-left bg-[linear-gradient(90deg,var(--xt-blue-500),var(--xt-blue-300))] shadow-[0_0_8px_rgb(47_107_255/0.8)]" />
              </div>
              <nav aria-label="Jump to a service group" className="flex">
                {serviceGroups.map((group, index) => (
                  <button
                    key={group.slug}
                    type="button"
                    data-svc-jump={index}
                    aria-label={`Show ${group.name.text}`}
                    className="group/dot relative grid size-11 place-items-center"
                  >
                    <span className="size-1.5 rounded-full bg-silver-500 transition-all duration-300 group-hover/dot:bg-silver-200 group-aria-[current=step]/dot:w-5 group-aria-[current=step]/dot:bg-accent group-aria-[current=step]/dot:shadow-[0_0_8px_rgb(47_107_255/0.9)]" />
                    <span
                      aria-hidden
                      className="pointer-events-none absolute bottom-full left-1/2 mb-1 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-md border border-white/10 bg-navy-900 px-2.5 py-1 text-xs text-silver-100 opacity-0 shadow-lg transition-[opacity,translate] duration-200 group-hover/dot:translate-y-0 group-hover/dot:opacity-100 group-focus-visible/dot:translate-y-0 group-focus-visible/dot:opacity-100"
                    >
                      {group.name.text}
                    </span>
                  </button>
                ))}
              </nav>
            </div>
          </Container>
        </div>
      </ServicesExperience>
      <div className="pb-section-compact" />
    </section>
  );
}
