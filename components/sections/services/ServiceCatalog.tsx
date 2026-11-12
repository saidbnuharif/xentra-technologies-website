import {
  ArrowRight,
  Check,
  Compass,
  Globe,
  Mail,
  Megaphone,
  MonitorSmartphone,
  Network,
  Palette,
  TrendingUp,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import {
  coreApproach,
  coreServices,
  coreServicesVision,
  mailtoHref,
  serviceEnquiryMessage,
} from "@/lib/content";
import { CopyText } from "@/components/ui/CopyText";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { Section } from "@/components/ui/Section";
import { Spotlight } from "@/components/ui/Spotlight";
import { WhatsAppCta } from "@/components/ui/WhatsAppCta";

/** One icon per core service, in the owner's order (update together). */
const icons: readonly LucideIcon[] = [TrendingUp, Globe, Network, Megaphone, Palette, MonitorSmartphone, Workflow, Compass];

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * /services: Our 8 Core Services (approved copy, Services page only).
 * Each service is a glass card with its five points, a WhatsApp enquiry
 * (service-specific prefilled message) and an email alternative, and a
 * stable anchor (#slug). Older anchors from the previous service list are
 * kept as aliases so links from other pages still land on the right card.
 */
export function ServiceCatalog() {
  return (
    <Section id="core-services" tone="white" labelledBy="core-services-title" edge className="overflow-x-clip">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgb(31_86_224/0.07)_1px,transparent_1.3px)] bg-size-[26px_26px] [mask-image:radial-gradient(60%_50%_at_50%_30%,black,transparent)]"
      />
      <h2 id="core-services-title" className="sr-only">
        Our 8 core services
      </h2>
      <Spotlight className="relative">
        <ol className="grid gap-5 md:grid-cols-2 lg:gap-6">
          {coreServices.map((service, index) => {
            const Icon = icons[index % icons.length];
            const message = serviceEnquiryMessage(service.name.text);
            const mail = mailtoHref(`Enquiry: ${service.name.text}`, message);
            return (
              <li
                key={service.slug}
                id={service.slug}
                data-reveal
                data-spotlight
                className="group/card relative flex scroll-mt-[calc(var(--xt-nav-height)+1.5rem)] flex-col overflow-hidden rounded-2xl border border-blue-500/12 bg-white/85 p-6 shadow-[0_18px_40px_-26px_rgb(31_86_224/0.35),inset_0_1px_0_white] transition-[border-color,box-shadow] duration-300 hover:border-blue-500/35 hover:shadow-[0_24px_50px_-24px_rgb(31_86_224/0.45),inset_0_1px_0_white] sm:p-8"
              >
                {/* Older anchors land here (links from other pages). */}
                {service.aliases?.map((alias) => (
                  <span
                    key={alias}
                    id={alias}
                    aria-hidden
                    className="absolute top-0 scroll-mt-[calc(var(--xt-nav-height)+1.5rem)]"
                  />
                ))}
                {/* Cursor light (desktop). */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/card:opacity-100 bg-[radial-gradient(280px_circle_at_var(--mx,50%)_var(--my,0%),rgb(47_107_255/0.08),transparent_70%)]"
                />
                <article aria-labelledby={`${service.slug}-name`} className="relative flex h-full flex-col">
                  <div className="flex items-center justify-between">
                    <span className="grid size-12 place-items-center rounded-xl border border-blue-400/30 bg-blue-500/10 text-blue-600 transition-[background-color,color,box-shadow] duration-300 group-hover/card:bg-blue-600 group-hover/card:text-white group-hover/card:shadow-[0_0_20px_-4px_rgb(47_107_255/0.8)]">
                      <Icon aria-hidden size={22} strokeWidth={1.75} />
                    </span>
                    <span aria-hidden className="font-mono text-label font-medium text-accent">
                      {pad(index + 1)}
                    </span>
                  </div>
                  <h3 id={`${service.slug}-name`} className="mt-6 text-h3 font-semibold tracking-tight text-balance">
                    <CopyText copy={service.name} />
                  </h3>
                  <ul className="mt-5 grid gap-2.5 border-t border-line pt-5">
                    {service.points.map((point) => (
                      <li key={point.text} className="flex gap-3 text-body text-fg-muted">
                        <Check aria-hidden size={18} strokeWidth={2} className="mt-0.5 shrink-0 text-blue-600" />
                        <span>
                          <CopyText copy={point} />
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto flex flex-col gap-3 pt-7 sm:flex-row sm:items-center">
                    <WhatsAppCta
                      label="Enquire on WhatsApp"
                      message={message}
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
                </article>
              </li>
            );
          })}
        </ol>
      </Spotlight>
    </Section>
  );
}

/** Our Approach (from the services sheet): five steps joined by arrows. */
export function CoreApproach() {
  return (
    <Section id="our-approach" tone="navy" labelledBy="our-approach-title" edge className="overflow-x-clip">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(45%_60%_at_50%_50%,rgb(47_107_255/0.14),transparent_70%)]"
      />
      <div className="relative text-center">
        <Eyebrow reveal>How we deliver</Eyebrow>
        <h2 id="our-approach-title" data-reveal className="mt-5 text-h2 font-semibold tracking-tight">
          Our <span className="text-accent-gradient">Approach</span>
        </h2>
        <ol data-reveal-group className="mx-auto mt-12 flex max-w-5xl flex-col items-stretch gap-3 lg:flex-row lg:items-center lg:gap-0">
          {coreApproach.map((step, index) => (
            <li key={step.text} data-reveal className="flex flex-col items-center lg:flex-1 lg:flex-row">
              <span className="flex w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-[linear-gradient(160deg,rgb(255_255_255/0.07),rgb(255_255_255/0.02))] px-5 py-4 shadow-[inset_0_1px_0_rgb(255_255_255/0.08)] lg:w-auto lg:flex-1">
                <span className="font-mono text-label text-accent">{pad(index + 1)}</span>
                <span className="text-lg font-semibold tracking-tight">
                  <CopyText copy={step} />
                </span>
              </span>
              {index < coreApproach.length - 1 ? (
                <ArrowRight
                  aria-hidden
                  size={20}
                  className="my-1 rotate-90 text-blue-400 drop-shadow-[0_0_6px_rgb(47_107_255/0.9)] lg:mx-2 lg:my-0 lg:rotate-0"
                />
              ) : null}
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}

/** Our Vision (as worded on the services sheet): one statement on black. */
export function CoreVision() {
  return (
    <Section id="services-vision" tone="black" labelledBy="services-vision-title" edge className="overflow-x-clip">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_60%_at_20%_60%,rgb(47_107_255/0.12),transparent_70%)]"
      />
      <div className="relative grid gap-8 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <Eyebrow reveal>Where we are heading</Eyebrow>
          <h2 id="services-vision-title" data-reveal className="mt-6 text-h2 font-semibold tracking-tight">
            Our <span className="text-accent-gradient">Vision</span>
          </h2>
        </div>
        <blockquote className="relative lg:col-span-8">
          <span aria-hidden data-reveal="line" className="mb-8 block h-px w-24 bg-[linear-gradient(90deg,var(--xt-blue-400),transparent)]" />
          <p data-reveal="lines" className="text-[clamp(1.375rem,1.1rem+1.1vw,2rem)] font-medium leading-snug tracking-tight text-pretty text-silver-50">
            <CopyText copy={coreServicesVision} />
          </p>
        </blockquote>
      </div>
    </Section>
  );
}
