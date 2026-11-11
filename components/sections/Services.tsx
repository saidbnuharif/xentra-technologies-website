/*
 * LEGACY (not currently rendered): built for the earlier four-category
 * service scope. Kept pending the decision on adapting it to the new
 * two-group scope (see lib/content/legacy-services.ts).
 */
import {
  allServices,
  isVisible,
  sectionCopy,
  whatsapp,
  whatsappCtaVisible,
} from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { CopyText } from "@/components/ui/CopyText";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { WhatsAppCta } from "@/components/ui/WhatsAppCta";
import { ServicesExperience } from "./services/ServicesExperience";
import { ServiceVisual } from "./services/visuals";

/*
 * Server component. Renders every service in full — readable with no
 * JavaScript, with reduced motion, and on mobile as a stacked sequence.
 * <ServicesExperience> (client) only enhances this markup:
 *   desktop → pinned, scroll-driven showcase (sets data-pinned="true")
 *   mobile  → light one-time reveals
 * Pinned-state styles use the literal `group-data-[pinned=true]/svc:` variant
 * (written out in full so Tailwind can detect it).
 */

const pad = (n: number) => String(n).padStart(2, "0");

export function Services() {
  const total = allServices.length;

  return (
    <section id="services" aria-labelledby="services-title" className="tone-black relative">
      <ServicesExperience>
        {/* Opening */}
        <Container data-svc-intro className="pt-section pb-12 lg:pb-16">
          <Eyebrow>Services</Eyebrow>
          <div className="mt-6 grid gap-6 lg:grid-cols-12 lg:items-end">
            <h2
              id="services-title"
              className="text-h2 font-semibold tracking-tight text-balance lg:col-span-7"
            >
              Our Services
            </h2>
            <p className="text-lead text-pretty text-fg-muted empty:hidden lg:col-span-5">
              <CopyText copy={sectionCopy.servicesIntro} />
            </p>
          </div>
        </Container>

        {/* Showcase: stacked by default, pinned stage on desktop */}
        <div data-svc-stage className={`relative group-data-[pinned=true]/svc:h-svh group-data-[pinned=true]/svc:overflow-hidden`}>
          <Container
            className={`relative group-data-[pinned=true]/svc:h-full group-data-[pinned=true]/svc:pt-nav`}
          >
            <div data-svc-track className={`relative group-data-[pinned=true]/svc:h-full`}>
              {allServices.map((service, index) => (
                <article
                  key={service.id}
                  data-svc-panel
                  aria-labelledby={`svc-${service.id}`}
                  className={`grid gap-10 border-t border-line py-14 sm:py-16 md:grid-cols-2 md:items-center md:gap-10 lg:grid-cols-12 lg:gap-14 group-data-[pinned=true]/svc:absolute group-data-[pinned=true]/svc:inset-0 group-data-[pinned=true]/svc:border-t-0 group-data-[pinned=true]/svc:py-0 group-data-[pinned=true]/svc:pb-28`}
                >
                  <div className="lg:col-span-5">
                    <p
                      data-svc-text
                      className="flex items-center gap-3 font-mono text-label uppercase tracking-[0.18em] text-fg-muted"
                    >
                      <span className="text-accent">{pad(index + 1)}</span>
                      <span aria-hidden className="h-px w-6 bg-line" />
                      <CopyText copy={service.category} />
                    </p>
                    <h3
                      id={`svc-${service.id}`}
                      data-svc-text
                      className="mt-5 text-[clamp(1.75rem,1.2rem+1.9vw,2.75rem)] font-semibold leading-[1.05] tracking-tight text-balance"
                    >
                      <CopyText copy={service.name} />
                    </h3>
                    {isVisible(service.description) ? (
                      <p data-svc-text className="mt-5 max-w-md text-lead text-pretty text-fg-muted">
                        <CopyText copy={service.description} />
                      </p>
                    ) : null}
                    {service.capabilities.some((c) => isVisible(c)) ? (
                      <ul data-svc-text className="mt-7 space-y-3 border-t border-line pt-6">
                        {service.capabilities.map((capability) =>
                          isVisible(capability) ? (
                            <li key={capability.text} className="flex gap-3 text-body text-silver-200">
                              <span aria-hidden className="mt-[0.7em] h-px w-4 shrink-0 bg-accent" />
                              <span>
                                <CopyText copy={capability} />
                              </span>
                            </li>
                          ) : null,
                        )}
                      </ul>
                    ) : null}
                  </div>

                  <div
                    data-svc-visual
                    className={`aspect-[4/3] w-full lg:col-span-7 group-data-[pinned=true]/svc:aspect-auto group-data-[pinned=true]/svc:h-[min(64svh,36rem)]`}
                  >
                    <ServiceVisual visual={service.visual} />
                  </div>
                </article>
              ))}
            </div>

            {/* Progress + index: only shown in pinned mode */}
            <div
              className={`hidden group-data-[pinned=true]/svc:absolute group-data-[pinned=true]/svc:inset-x-gutter group-data-[pinned=true]/svc:bottom-8 group-data-[pinned=true]/svc:flex group-data-[pinned=true]/svc:items-center group-data-[pinned=true]/svc:gap-6`}
            >
              <p className="font-mono text-label tabular-nums text-fg-muted">
                <span data-svc-counter className="text-fg">
                  01
                </span>{" "}
                / {pad(total)}
              </p>
              <div className="h-px w-40 overflow-hidden bg-line xl:w-56">
                <div data-svc-progress className="h-full w-full origin-left bg-accent" />
              </div>
              <nav aria-label="Jump to a service" className="flex">
                {allServices.map((service, index) => (
                  <button
                    key={service.id}
                    type="button"
                    data-svc-jump={index}
                    aria-label={`Show ${service.name.text}`}
                    className="group/dot relative grid size-11 place-items-center"
                  >
                    <span className="size-1.5 rounded-full bg-silver-500 transition-all duration-300 group-hover/dot:bg-silver-200 group-aria-[current=step]/dot:w-5 group-aria-[current=step]/dot:bg-accent" />
                    {/* Name label on hover / keyboard focus — shows where a dot jumps. */}
                    <span
                      aria-hidden
                      className="pointer-events-none absolute bottom-full left-1/2 mb-1 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-md border border-white/10 bg-navy-900 px-2.5 py-1 text-xs text-silver-100 opacity-0 shadow-lg transition-[opacity,translate] duration-200 group-hover/dot:translate-y-0 group-hover/dot:opacity-100 group-focus-visible/dot:translate-y-0 group-focus-visible/dot:opacity-100"
                    >
                      {service.name.text}
                    </span>
                  </button>
                ))}
              </nav>
            </div>
          </Container>
        </div>
      </ServicesExperience>

      {whatsappCtaVisible() ? (
        <Container className="pb-section pt-4">
          <div className="flex flex-col gap-6 border-t border-line pt-10 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-md text-lead text-pretty empty:hidden">
              <CopyText copy={sectionCopy.servicesCta} />
            </p>
            <WhatsAppCta label={whatsapp.ctaPrimary.text} variant="secondary" />
          </div>
        </Container>
      ) : (
        <div className="pb-section" />
      )}
    </section>
  );
}
