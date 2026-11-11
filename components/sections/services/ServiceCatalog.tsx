import { Mail } from "lucide-react";
import { mailtoHref, serviceEnquiryMessage, serviceGroups, type ServiceVisual as VisualKey } from "@/lib/content";
import { CopyText } from "@/components/ui/CopyText";
import { Section } from "@/components/ui/Section";
import { Spotlight } from "@/components/ui/Spotlight";
import { WhatsAppCta } from "@/components/ui/WhatsAppCta";
import { ServiceVisual } from "./visuals";

/** Group illustrations — the same pairing as the homepage showcase. */
const visualFor: Record<string, VisualKey> = {
  "business-growth-advisory": "consultancy",
  "digital-services": "website",
  "business-software-automation": "erp",
};

/**
 * /services (redesign step P2): one band per service group, alternating
 * light and dark, each rising on a curved edge. Left (sticky on desktop):
 * group number, name, intro and its illustration in a glass frame. Right:
 * the group's services as glass cards.
 *
 * Unchanged journey: every service keeps its stable anchor (#slug), its
 * description slot (pending → content review), a WhatsApp enquiry button
 * with a service-specific prefilled message, and an email alternative with
 * a matching subject line.
 */
export function ServiceCatalog() {
  // Continuous numbering across groups: each group's offset is the number
  // of services in the groups before it.
  const offsets = serviceGroups.map((_, g) =>
    serviceGroups.slice(0, g).reduce((n, group) => n + group.services.length, 0),
  );

  return (
    <>
      {serviceGroups.map((group, g) => {
        const dark = g % 2 === 1;
        return (
          <Section
            key={group.slug}
            id={group.slug}
            tone={dark ? "navy" : "white"}
            labelledBy={`${group.slug}-title`}
            edge
            className="overflow-x-clip"
          >
            <div
              aria-hidden
              className={`pointer-events-none absolute inset-0 ${dark ? "bg-[radial-gradient(45%_50%_at_20%_40%,rgb(47_107_255/0.14),transparent_70%)]" : "bg-[radial-gradient(rgb(31_86_224/0.07)_1px,transparent_1.3px)] bg-size-[26px_26px] [mask-image:radial-gradient(60%_60%_at_25%_40%,black,transparent)]"}`}
            />
            <div className="relative grid gap-12 lg:grid-cols-12 lg:gap-16">
              <header className="lg:col-span-5">
                <div data-reveal-group className="lg:sticky lg:top-[calc(var(--xt-nav-height)+2.5rem)]">
                  <p data-reveal className="flex items-center gap-3 font-mono text-label uppercase tracking-[0.18em] text-accent">
                    <span aria-hidden className="h-px w-8 bg-current" />
                    Group {String(g + 1).padStart(2, "0")} · {group.services.length} services
                  </p>
                  <h2
                    id={`${group.slug}-title`}
                    data-reveal
                    className="mt-5 text-h2 font-semibold tracking-tight text-balance"
                  >
                    <CopyText copy={group.name} />
                  </h2>
                  <p data-reveal className="mt-5 text-body text-pretty text-fg-muted empty:hidden">
                    <CopyText copy={group.intro} />
                  </p>
                  {/* Group illustration in a glass frame (decorative). */}
                  <div data-reveal aria-hidden className="relative mt-10 hidden aspect-[4/3] md:block">
                    <div className="pointer-events-none absolute -inset-4 -z-10 rounded-[2rem] bg-[radial-gradient(60%_60%_at_50%_55%,rgb(47_107_255/0.22),transparent_70%)] blur-2xl" />
                    <div className="h-full rounded-[1.5rem] border border-white/10 bg-[linear-gradient(160deg,#121b36,#070b18)] p-2.5 shadow-[0_30px_70px_-30px_rgb(7_11_24/0.8),inset_0_1px_0_rgb(255_255_255/0.08)]">
                      <ServiceVisual visual={visualFor[group.slug] ?? "consultancy"} />
                    </div>
                  </div>
                </div>
              </header>

              <Spotlight className="lg:col-span-7">
                <ol className="grid gap-4">
                  {group.services.map((service, i) => {
                    const number = String(offsets[g] + i + 1).padStart(2, "0");
                    const mail = mailtoHref(
                      `Enquiry: ${service.name.text}`,
                      serviceEnquiryMessage(service.name.text),
                    );
                    return (
                      <li
                        key={service.slug}
                        id={service.slug}
                        data-reveal
                        data-spotlight
                        className={`group/card relative scroll-mt-[calc(var(--xt-nav-height)+1.5rem)] overflow-hidden rounded-2xl border p-6 transition-[border-color,box-shadow] duration-300 sm:p-8 ${
                          dark
                            ? "border-white/8 bg-[linear-gradient(160deg,rgb(255_255_255/0.055),rgb(255_255_255/0.015))] shadow-[inset_0_1px_0_rgb(255_255_255/0.07)] hover:border-blue-400/35 hover:shadow-[0_24px_50px_-26px_rgb(47_107_255/0.6),inset_0_1px_0_rgb(255_255_255/0.08)]"
                            : "border-blue-500/12 bg-white/85 shadow-[0_18px_40px_-26px_rgb(31_86_224/0.35),inset_0_1px_0_white] hover:border-blue-500/35 hover:shadow-[0_24px_50px_-24px_rgb(31_86_224/0.45),inset_0_1px_0_white]"
                        }`}
                      >
                        {/* Cursor light (desktop). */}
                        <div
                          aria-hidden
                          className={`pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/card:opacity-100 ${dark ? "bg-[radial-gradient(260px_circle_at_var(--mx,50%)_var(--my,0%),rgb(47_107_255/0.15),transparent_70%)]" : "bg-[radial-gradient(260px_circle_at_var(--mx,50%)_var(--my,0%),rgb(47_107_255/0.08),transparent_70%)]"}`}
                        />
                        <article aria-labelledby={`${service.slug}-name`} className="relative grid gap-4 sm:grid-cols-[3.5rem_1fr]">
                          <span
                            aria-hidden
                            className="grid size-10 place-items-center rounded-xl border border-blue-400/30 bg-blue-500/10 font-mono text-label font-medium text-accent transition-[background-color,color,box-shadow] duration-300 group-hover/card:bg-blue-500 group-hover/card:text-white group-hover/card:shadow-[0_0_18px_-4px_rgb(47_107_255/0.9)]"
                          >
                            {number}
                          </span>
                          <div>
                            <h3 id={`${service.slug}-name`} className="text-h3 font-semibold tracking-tight">
                              <CopyText copy={service.name} />
                            </h3>
                            <p className="mt-3 max-w-2xl text-body text-pretty text-fg-muted empty:hidden">
                              <CopyText copy={service.description} />
                            </p>
                            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                              <WhatsAppCta
                                label="Enquire on WhatsApp"
                                message={serviceEnquiryMessage(service.name.text)}
                                accessibleContext={service.name.text}
                                size="md"
                                className="hover:shadow-[0_0_0_3px_rgb(47_107_255/0.18),0_10px_24px_-8px_rgb(47_107_255/0.75)]"
                              />
                              {mail ? (
                                <a
                                  href={mail}
                                  className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-fg-muted transition-colors hover:text-fg focus-visible:text-fg"
                                >
                                  <Mail aria-hidden size={16} />
                                  Enquire by email
                                  <span className="sr-only">about {service.name.text}</span>
                                </a>
                              ) : null}
                            </div>
                          </div>
                        </article>
                      </li>
                    );
                  })}
                </ol>
              </Spotlight>
            </div>
          </Section>
        );
      })}
    </>
  );
}
