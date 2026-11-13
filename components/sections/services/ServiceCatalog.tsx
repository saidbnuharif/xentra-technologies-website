import { ArrowRight } from "lucide-react";
import { coreApproach, coreServicesVision } from "@/lib/content";
import { CopyText } from "@/components/ui/CopyText";
import { InViewFlag } from "@/components/ui/InViewFlag";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { Section } from "@/components/ui/Section";
import { GlassServices } from "./GlassServices";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * /services: Our 8 Core Services (approved copy, Services page only), as
 * floating glass panels (GlassServices, full): frosted interface windows in
 * two staggered columns over blue / violet light, each with its five
 * points, a WhatsApp enquiry (service-specific prefilled message) and an
 * email alternative, and a stable anchor (#slug); older anchors are kept
 * as aliases so links from other pages still land on the right panel.
 */
export function ServiceCatalog() {
  return (
    <Section id="core-services" tone="navy" labelledBy="core-services-title" className="overflow-x-clip">
      <InViewFlag />
      <h2 id="core-services-title" className="sr-only">
        Our 8 core services
      </h2>
      <GlassServices variant="full" />
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
