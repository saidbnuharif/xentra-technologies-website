import type { CSSProperties } from "react";
import { company } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { EnergyCurveLayer } from "./hero/EnergyCurveLayer";
import { HeroIntroMotion } from "./hero/HeroIntroMotion";
import { MarkPoster } from "./hero/MarkPoster";
import "./hero/hero-intro.css";

/** Entrance delay for a [data-hero-fade] element (first load, CSS). */
const delay = (seconds: number) => ({ "--d": `${seconds}s` }) as CSSProperties;

/** Words of the headline from this index on carry the blue accent. */
const ACCENT_FROM = 2;

/**
 * Hero — one centred composition on the first screen:
 *   top    XENTRA TECHNOLOGIES
 *   middle the 3D X mark (dominant) — an empty slot here; the one WebGL
 *          canvas (XStage) sits over it, the SVG poster inside it
 *          is the no-JS / no-WebGL version
 *   bottom the approved tagline (h1).
 * No buttons here (owner's request): the navbar and the floating button
 * carry WhatsApp, and the page continues straight into About.
 * The slot takes all the height the text leaves, so the whole X fits the
 * first screen on every size.
 *
 * Layers (bottom to top): the section's deep black and navy light → the
 * energy curve → the page's one 3D canvas (XStage gives it the whole
 * section here: the X in its slot inside a full-bleed "digital universe")
 * → the text (z-[2]). The section is deliberately not a stacking context,
 * so the canvas can sit between its background and its copy, and no
 * effect ever covers text or buttons.
 *
 * Motion: text entrance is CSS on first load and GSAP on re-entry; on
 * scroll the words lift away (HeroIntroMotion) while the camera moves
 * toward the About section and the X dissolves into the energy curve that
 * carries it there (XStage, mark-scene.ts).
 */
export function Hero() {
  const words = company.tagline.text.split(" ");

  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      className="tone-black relative flex min-h-svh flex-col overflow-hidden pb-8 pt-[calc(var(--xt-nav-height)+1.25rem)] lg:pb-12"
    >
      {/* Deep space: navy depth behind the mark, a darker rim, a navy
          horizon, and a fade to black into the next section. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent_74%,var(--surface)),radial-gradient(48%_52%_at_50%_46%,rgb(23_52_130/0.42),transparent_72%),radial-gradient(90%_60%_at_50%_50%,rgb(8_16_40/0.9),transparent_100%),radial-gradient(70%_36%_at_50%_88%,rgb(17_34_80/0.6),transparent_75%)]"
      />
      <EnergyCurveLayer id="hero-curve" layer="base" />

      <HeroIntroMotion className="relative z-[2] flex w-full flex-1 flex-col">
        <Container className="flex flex-1 flex-col items-center text-center">
          {/* Top: the company name, set wide in brushed silver. */}
          <div data-hero-exit-fade className="relative">
            <div data-hero-fade style={delay(0.12)} className="flex items-center justify-center gap-4">
              <span aria-hidden className="hidden h-px w-12 bg-gradient-to-r from-transparent to-blue-400/70 sm:block" />
              <p className="bg-[linear-gradient(180deg,#ffffff_0%,#e3e8ef_40%,#9aa6b8_100%)] bg-clip-text pl-[0.42em] text-[clamp(0.95rem,0.75rem+0.8vw,1.5rem)] font-semibold tracking-[0.42em] text-transparent uppercase [filter:drop-shadow(0_0_14px_rgb(90_139_255/0.35))]">
                {company.name}
              </p>
              <span aria-hidden className="hidden h-px w-12 bg-gradient-to-l from-transparent to-blue-400/70 sm:block" />
            </div>
          </div>

          {/* Middle: the X. */}
          <div
            data-x-slot="hero"
            data-x-claim="start"
            className="relative my-3 min-h-[15rem] w-full max-w-[64rem] flex-1 sm:min-h-[19rem]"
          >
            <MarkPoster id="hero-mark" />
          </div>

          {/* Bottom: the approved tagline. */}
          <h1
            id="hero-title"
            className="relative text-[clamp(1.125rem,0.85rem+1.1vw,1.875rem)] leading-[1.2] font-medium tracking-[0.01em] text-balance [filter:drop-shadow(0_2px_18px_rgb(0_0_0/0.55))]"
          >
            {words.map((word, i) => (
              <span key={i}>
                {/* Mask: the word rises from below its own line box. Padding
                    keeps descenders (y, g, p) from being clipped. */}
                <span className="-mb-[0.14em] inline-block overflow-hidden pb-[0.14em] align-top">
                  {/* Exit layer: lifts the word out of its mask on scroll. */}
                  <span data-hero-exit className="inline-block">
                    <span
                      data-hero-word
                      style={{ "--i": i } as CSSProperties}
                      className={`inline-block ${i >= ACCENT_FROM ? "text-accent-gradient" : "bg-[linear-gradient(180deg,#ffffff_25%,#c3ccd8_100%)] bg-clip-text text-transparent"}`}
                    >
                      {word}
                    </span>
                  </span>
                </span>
                {i < words.length - 1 ? " " : null}
              </span>
            ))}
          </h1>
        </Container>
      </HeroIntroMotion>
    </section>
  );
}
