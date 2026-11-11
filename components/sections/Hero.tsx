import type { CSSProperties } from "react";
import { ArrowDown, ArrowRight } from "lucide-react";
import { company, serviceGroups } from "@/lib/content";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { WhatsAppCta } from "@/components/ui/WhatsAppCta";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { HeroMark } from "./hero/HeroMark";
import { HeroIntroMotion } from "./hero/HeroIntroMotion";
import "./hero/hero-intro.css";

/** Entrance delay for a [data-hero-fade] element (first load, CSS). */
const delay = (seconds: number) => ({ "--d": `${seconds}s` }) as CSSProperties;

/** Words of the headline from this index on carry the blue accent. */
const ACCENT_FROM = 2;

/**
 * Hero — cinematic layout (redesign step H1).
 *
 * Left: approved headline, copy and CTAs, unchanged in wording; the second
 * phrase carries the electric-blue accent. Below them a factual capability
 * strip (service counts per confirmed group — replaces the reference's
 * placeholder statistics). Right: the Xentra X mark in 3D (HeroMark),
 * bleeding past the container edge on desktop.
 *
 * Motion: text entrance is CSS on first load and GSAP on re-entry
 * (HeroIntroMotion); the 3D mark builds itself and replays the same way.
 * Reduced motion: everything static. No JS: everything visible, SVG mark.
 */
export function Hero() {
  const words = company.tagline.text.split(" ");

  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      className="tone-black relative isolate flex min-h-svh items-center overflow-hidden pb-24 pt-[calc(var(--xt-nav-height)+3.5rem)] lg:pb-28"
    >
      {/* Horizon glow: light rising from below the mark. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-2/3 bg-[radial-gradient(55%_70%_at_72%_100%,rgb(47_107_255/0.16),transparent_70%),linear-gradient(to_top,rgb(11_18_38/0.9),transparent_45%)]"
      />

      <HeroIntroMotion className="w-full">
        {/* Ambient light — section-wide (the motion wrapper is not
            positioned), so it is never cut at the container edge. */}
        <div
          aria-hidden
          data-hero-light
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(40%_55%_at_76%_48%,rgb(47_107_255/0.12),transparent_70%),radial-gradient(35%_45%_at_14%_30%,rgb(214_220_229/0.035),transparent_70%)]"
        />
        <Container>

          <div className="max-w-xl lg:max-w-[34rem] xl:max-w-[36rem]">
            <div data-hero-fade style={delay(0.12)}>
              <Eyebrow>{company.name}</Eyebrow>
            </div>
            <h1
              id="hero-title"
              className="mt-6 text-[clamp(2.5rem,1.55rem+3.7vw,4.375rem)] leading-[1.03] font-semibold tracking-tight text-balance"
            >
              {words.map((word, i) => (
                <span key={i}>
                  {/* Mask: the word rises from below its own line box. Padding
                      keeps descenders (y, g, p) from being clipped. */}
                  <span className="-mb-[0.14em] inline-block overflow-hidden pb-[0.14em] align-top">
                    <span
                      data-hero-word
                      style={{ "--i": i } as CSSProperties}
                      className={`inline-block ${i >= ACCENT_FROM ? "text-accent-gradient" : ""}`}
                    >
                      {word}
                    </span>
                  </span>
                  {i < words.length - 1 ? " " : null}
                </span>
              ))}
            </h1>
            <p data-hero-fade style={delay(0.72)} className="mt-6 max-w-lg text-lead text-pretty text-fg-muted">
              {company.description.text}
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <div data-hero-fade style={delay(0.9)}>
                <ButtonLink
                  href="#services-overview"
                  data-hero-scroll
                  data-magnetic
                  className="w-full hover:shadow-[0_0_0_4px_rgb(47_107_255/0.16),0_14px_34px_-10px_rgb(47_107_255/0.75)] focus-visible:shadow-[0_0_0_4px_rgb(47_107_255/0.16),0_14px_34px_-10px_rgb(47_107_255/0.75)] active:bg-blue-600 active:shadow-[0_0_0_2px_rgb(47_107_255/0.25)] sm:w-auto"
                >
                  Explore Our Services
                  <ArrowRight aria-hidden size={18} />
                </ButtonLink>
              </div>
              <div data-hero-fade style={delay(1.02)}>
                <WhatsAppCta
                  label="Let's Talk Business"
                  variant="secondary"
                  magnetic
                  className="w-full backdrop-blur-sm hover:border-blue-400/70 hover:shadow-[0_0_0_3px_rgb(47_107_255/0.14),0_0_24px_-6px_rgb(47_107_255/0.45)] focus-visible:border-blue-400/70 active:bg-fg/10 sm:w-auto"
                />
              </div>
            </div>

            {/* Capability strip — factual: confirmed groups and how many
                services each holds (grows automatically with the content). */}
            <dl data-hero-fade style={delay(1.16)} className="mt-12 flex flex-wrap gap-y-4 border-t border-line pt-6">
              {serviceGroups.map((group) => (
                <div
                  key={group.slug}
                  className="flex flex-col-reverse gap-1 border-line pr-6 not-first:border-l not-first:pl-6 sm:pr-8 sm:not-first:pl-8"
                >
                  <dt className="text-label text-fg-muted">{group.name.text}</dt>
                  <dd className="font-mono text-h3 font-medium text-fg">
                    {String(group.services.length).padStart(2, "0")}
                    <span className="sr-only"> services</span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Desktop: positioned against the section (nothing between is
              positioned) and centred on the FIRST SCREEN below the navbar,
              not on the text column — so it stays centred even when the
              text runs taller than a short window. Size also capped by
              window height. */}
          <HeroMark className="-z-[5] -mx-gutter mt-6 aspect-[5/4] sm:mx-auto sm:max-w-[40rem] lg:absolute lg:top-[calc(var(--xt-nav-height)_+_(100svh_-_var(--xt-nav-height))_/_2)] lg:left-[calc(50%_+_min(27vw,_21rem))] lg:mx-0 lg:mt-0 lg:aspect-square lg:w-[min(56vw,_52rem,_calc((100svh_-_var(--xt-nav-height))_*_1.2))] lg:max-w-none lg:-translate-x-1/2 lg:-translate-y-1/2" />
        </Container>

        {/* Scroll cue (desktop): smooth-scrolls to the next section. */}
          <a
            href="#introduction"
            data-hero-scroll
            data-hero-fade
            style={delay(1.4)}
            aria-label="Scroll to the next section"
            className="group absolute inset-x-0 bottom-12 mx-auto hidden size-11 items-center justify-center rounded-full border border-line text-fg-muted transition-colors duration-300 hover:border-blue-400/60 hover:text-fg lg:flex"
          >
            <ArrowDown aria-hidden size={18} className="transition-transform duration-300 group-hover:translate-y-0.5" />
          </a>
      </HeroIntroMotion>
    </section>
  );
}
