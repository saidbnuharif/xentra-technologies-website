import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { company, pageIntro } from "@/lib/content";
import { CopyText } from "@/components/ui/CopyText";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { Container } from "@/components/ui/Container";
import { EnergyCurveLayer } from "../hero/EnergyCurveLayer";
import { MarkPoster } from "../hero/MarkPoster";
import { sceneWords } from "../about/scene-words";
import { AboutEcosystem } from "./AboutEcosystem";

/**
 * Home: About Xentra. The X re-emerges here from the energy curve that
 * leaves the hero (XStage) and grows into a business ecosystem as you
 * scroll on (AboutEcosystem): hubs named from the approved line
 * "Strategy. Technology. Growth.", connected nodes, signals.
 *
 * Kept short on Home (owner's direction): the statement, the approved
 * line and a link. The full Company Overview is on the About page.
 */
export function CompanyIntro() {
  const words = sceneWords(pageIntro.about).map((w) => w.replace(/\.$/, ""));

  return (
    <section
      id="introduction"
      aria-labelledby="intro-title"
      className="tone-black relative isolate overflow-x-clip"
    >
      <EnergyCurveLayer id="intro-curve" />
      <Container className="pb-section pt-16 sm:pt-20 lg:pt-24">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="relative lg:col-span-7">
            {/* Blue light behind the X (rises when it arrives). */}
            <div
              aria-hidden
              data-x-glow
              className="pointer-events-none absolute left-1/2 top-1/2 -z-10 aspect-square w-[130%] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(closest-side,rgb(47_107_255/0.22),rgb(47_107_255/0.06)_55%,transparent)]"
            />
            <div
              data-x-slot="about"
              data-x-claim="curve"
              className="relative mx-auto my-[16%] aspect-square w-[66%] max-w-[min(26rem,calc((100svh-var(--xt-nav-height))*0.6))]"
            >
              <AboutEcosystem labels={words} />
              <MarkPoster id="about-mark" />
            </div>
          </div>

          <div className="lg:col-span-5">
            <Eyebrow reveal>About Xentra</Eyebrow>
            <h2
              id="intro-title"
              data-reveal="lines"
              className="mt-6 text-statement font-semibold tracking-tight text-balance"
            >
              Your {company.positioning.text.replace(/\.$/, "").toLowerCase()}.
            </h2>
            {pageIntro.about ? (
              <p data-reveal className="mt-5 font-mono text-sm font-medium tracking-[0.24em] text-accent uppercase">
                <CopyText copy={pageIntro.about} />
              </p>
            ) : null}
            <Link
              data-reveal
              href="/about"
              className="group mt-8 inline-flex min-h-11 items-center gap-2 font-medium text-accent"
            >
              More about Xentra
              <ArrowRight
                aria-hidden
                size={18}
                className="transition-transform group-hover:translate-x-1 group-focus-visible:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
