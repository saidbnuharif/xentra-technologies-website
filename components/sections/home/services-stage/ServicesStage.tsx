import { ChartColumnIncreasing, CodeXml, Cpu, Megaphone, Palette, ScanSearch, type LucideIcon } from "lucide-react";
import { servicesShowcase } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { CopyText } from "@/components/ui/CopyText";
import { InViewFlag } from "@/components/ui/InViewFlag";
import { CorePoster } from "./CorePoster";
import { ServicePanel } from "./ServicePanel";
import { ServicesStageMotion } from "./ServicesStageMotion";
import { PLACEMENTS } from "./stage-layout";
import "./services-stage.css";

/*
 * Home "Our Services" as a 3D technology showcase (silver theme
 * experiment).
 *
 * A large holographic screen holds the central energy core; the six
 * service panels float around it in perspective, turned towards it, above
 * a white glass platform, in icy white and blue with lavender light at the
 * edges. Copy and links are the approved showcase content, unchanged.
 * Phones and tablets: the screen, then the panels flat in a grid.
 * id stays "services-overview" for existing links.
 *
 * Stage 2: the WebGL core in the page's one canvas (XStage slot, subject
 * "core"). Stage 3: motion (ServicesStageMotion). Later: click focus and
 * the X transition. The ServicesShowcase grid it replaces on Home is kept,
 * unused.
 */
const ICONS: readonly LucideIcon[] = [CodeXml, Megaphone, Cpu, ScanSearch, ChartColumnIncreasing, Palette];

export function ServicesStage() {
  const { eyebrow, title, intro, items } = servicesShowcase;

  return (
    <section id="services-overview" aria-labelledby="services-overview-title" className="ss-section tone-white relative overflow-x-clip">
      <InViewFlag />
      {/* Environment: white to icy blue, lavender light at the edges. */}
      <div aria-hidden className="ss-environment pointer-events-none absolute inset-0" />

      <Container className="relative py-section">
        <div className="max-w-xl">
          <p data-reveal className="flex items-center gap-4 font-mono text-label font-medium tracking-[0.32em] text-accent uppercase">
            <span aria-hidden className="h-px w-10 bg-current" />
            <CopyText copy={eyebrow} />
          </p>
          <h2
            id="services-overview-title"
            data-reveal="lines"
            className="mt-5 text-[clamp(1.9rem,1.2rem+2.6vw,3.25rem)] leading-[1.08] font-semibold tracking-tight text-balance"
          >
            <CopyText copy={title} />
          </h2>
          <p data-reveal className="mt-5 text-lead text-pretty text-fg-muted">
            <CopyText copy={intro} />
          </p>
        </div>

        <ServicesStageMotion className="ss-stage relative mt-12 lg:mt-6">
          <div aria-hidden className="ss-platform" />

          {/* The holographic screen with the energy core. */}
          <div aria-hidden data-ss-screen className="ss-core-screen">
            <div className="ss-core-chrome">
              <span className="flex gap-1.5">
                <span className="size-2 rounded-full bg-[#c7ced8]" />
                <span className="size-2 rounded-full bg-[#e9eef5]" />
                <span className="size-2 rounded-full bg-[#3478f6]/70" />
              </span>
              <span className="font-mono text-[0.65rem] tracking-[0.28em] text-[#8995a5]">XENTRA · SERVICES</span>
            </div>
            {/* The page's one canvas shows the 3D energy core here (XStage
                slot); the SVG core is its poster. */}
            <div data-ss-core data-x-slot="services" data-x-claim="view" data-x-subject="core" className="ss-core relative">
              <CorePoster className="absolute inset-0 m-auto h-full w-full" />
            </div>
          </div>

          <ol data-ss-panels className="ss-panels">
            {items.map((service, i) => (
              <ServicePanel key={service.key} service={service} index={i} Icon={ICONS[i]} place={PLACEMENTS[i]} />
            ))}
          </ol>
        </ServicesStageMotion>
      </Container>
    </section>
  );
}
