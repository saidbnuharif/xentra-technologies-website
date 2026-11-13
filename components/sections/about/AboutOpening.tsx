import { pageIntro } from "@/lib/content";
import { MarkPoster } from "../hero/MarkPoster";
import { AboutOpeningMotion } from "./AboutOpeningMotion";
import { sceneWords } from "./scene-words";

/*
 * About page opening (cinematic system, About page).
 *
 * The page's title, then the 3D X in its "digital universe" — the same
 * scene as the Home hero, through the page's one canvas (XStage: this slot
 * claims "start", so on desktop the canvas fills the section behind the
 * text) — with the approved line "Strategy. Technology. Growth." set
 * around it: "Strategy." and "Growth." either side, "Technology." beneath.
 * On scroll the words part outward and fade while the X dissolves into
 * light (AboutOpeningMotion, XStage). Phones: the X, then the line below.
 *
 * Layers as in the Home hero: the section is not a stacking context, so
 * the canvas sits between its background and its text (z-[2]).
 * Reduced motion / no JS: the composition, still; the SVG mark if no WebGL.
 */
export function AboutOpening() {
  const [left, mid, right] = sceneWords(pageIntro.about);
  const word = "font-semibold tracking-tight text-[clamp(1.75rem,0.9rem+2.6vw,3.5rem)] leading-none";

  return (
    <section
      id="about-intro"
      aria-labelledby="about-title"
      className="tone-black relative flex min-h-[92svh] flex-col overflow-hidden pb-10 pt-[calc(var(--xt-nav-height)+2.5rem)]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent_74%,var(--surface)),radial-gradient(46%_50%_at_50%_54%,rgb(23_52_130/0.42),transparent_72%),radial-gradient(90%_60%_at_50%_50%,rgb(8_16_40/0.9),transparent_100%)]"
      />

      <AboutOpeningMotion className="relative z-[2] flex flex-1 flex-col items-center px-gutter text-center">
        <p data-ao-fade className="font-mono text-label font-medium tracking-[0.32em] text-accent uppercase">
          About Us
        </p>
        <h1
          id="about-title"
          data-ao-fade
          className="mt-4 text-[clamp(1.5rem,1.1rem+1.4vw,2.5rem)] font-semibold tracking-tight text-balance"
        >
          <span className="bg-[linear-gradient(180deg,#ffffff_25%,#c3ccd8_100%)] bg-clip-text text-transparent">About </span>
          <span className="text-accent-gradient">Xentra Technologies</span>
        </h1>

        {/* The approved line around the X. */}
        <p className="sr-only">{pageIntro.about?.text}</p>
        <div aria-hidden className="relative mt-4 flex w-full max-w-6xl flex-1 items-center justify-center">
          <span data-ao-word="left" className={`hidden sm:block ${word} bg-[linear-gradient(180deg,#ffffff_25%,#c3ccd8_100%)] bg-clip-text text-transparent`}>
            {left}
          </span>
          <div className="relative flex flex-col items-center">
            <div
              data-x-slot="about-intro"
              data-x-claim="start"
              className="relative aspect-[5/4] w-[min(78vw,32rem,calc((92svh-var(--xt-nav-height)-12rem)*1.25))] min-w-[15rem]"
            >
              <MarkPoster id="about-intro-mark" />
            </div>
            <span data-ao-word="mid" className="-mt-2 hidden text-[clamp(1.25rem,0.8rem+1.4vw,2.25rem)] font-semibold leading-none tracking-tight text-accent-gradient sm:block">
              {mid}
            </span>
          </div>
          <span data-ao-word="right" className={`hidden sm:block ${word} bg-[linear-gradient(180deg,#ffffff_25%,#c3ccd8_100%)] bg-clip-text text-transparent`}>
            {right}
          </span>
        </div>
        {/* Phones: the line under the X. */}
        <p aria-hidden data-ao-fade className="mt-6 font-mono text-sm font-medium tracking-[0.2em] text-accent uppercase sm:hidden">
          {pageIntro.about?.text}
        </p>
      </AboutOpeningMotion>
    </section>
  );
}
