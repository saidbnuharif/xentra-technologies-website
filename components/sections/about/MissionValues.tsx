import { aboutOverview, commitment, company, isVisible, mission, values, vision } from "@/lib/content";
import { CopyText } from "@/components/ui/CopyText";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { Section } from "@/components/ui/Section";
import { MissionVisionMotion } from "./MissionVisionMotion";
import "./mission-vision.css";
import { Spotlight } from "@/components/ui/Spotlight";

/*
 * About page sections (redesign step P1). Each has its own composition but
 * shares the system: curved section edges, glass panels, electric-blue
 * accents, MotionRoot reveals. All About copy is approved (supplied by
 * Xentra, 12 Nov 2026) and rendered verbatim.
 */

/**
 * Company Overview (approved copy, verbatim) — the full detail lives here,
 * on the About page. Dark band after the opening scene, with a soft blue
 * light. Left: heading and the closing line of the overview set as a
 * statement, held in view on desktop. Right: the overview paragraphs, the
 * first as the lead.
 */
export function AboutBackground() {
  const [lead, ...rest] = aboutOverview.paragraphs;
  return (
    <Section id="background" tone="light" labelledBy="background-title" className="overflow-x-clip">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(40%_50%_at_85%_40%,rgb(52_120_246/0.07),transparent_70%)]"
      />
      <div className="relative grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-[calc(var(--xt-nav-height)+2.5rem)]">
            <Eyebrow reveal>Who we are</Eyebrow>
            <h2 id="background-title" data-reveal className="mt-6 text-h2 font-semibold tracking-tight">
              <CopyText copy={aboutOverview.title} />
            </h2>
            <p
              data-reveal="lines"
              className="mt-8 border-l-2 border-blue-500 pl-6 text-[clamp(1.375rem,1.1rem+1.1vw,2rem)] leading-snug font-semibold tracking-tight text-balance text-fg"
            >
              <CopyText copy={aboutOverview.statement} />
            </p>
            {/* The approved tagline, set as a quiet signature line. */}
            <p data-reveal className="mt-8 flex items-center gap-3 font-mono text-label uppercase tracking-[0.18em] text-accent">
              <span aria-hidden className="h-px w-8 bg-current" />
              {company.tagline.text}
            </p>
          </div>
        </div>
        <div data-reveal-group className="flex flex-col gap-6 lg:col-span-7 lg:pt-14">
          <p data-reveal className="text-lead text-pretty text-fg">
            <CopyText copy={lead} />
          </p>
          {rest.map((paragraph) => (
            <p key={paragraph.text} data-reveal className="text-body text-pretty text-fg-muted">
              <CopyText copy={paragraph} />
            </p>
          ))}
        </div>
      </div>
    </Section>
  );
}

/**
 * Mission and Vision: a compact editorial block. The heading sits on the
 * left (desktop) or above (smaller screens); Mission, then Vision directly
 * below it, as numbered (01 / 02) layered panels — a white surface on an
 * offset platinum plate (mission-vision.css). Statements in Sora Medium.
 * Approved copy, verbatim. Motion: a gentle one-time GSAP reveal
 * (MissionVisionMotion) and a small hover lift; reduced motion = static.
 */
export function MissionVision() {
  const items = [
    { key: "mission", number: "01", label: "Our Mission", copy: mission },
    { key: "vision", number: "02", label: "Our Vision", copy: vision },
  ].filter((item) => isVisible(item.copy));

  return (
    <Section id="mission-vision" tone="white" labelledBy="mission-title" spacing="compact" edge className="overflow-x-clip">
      <div className="relative grid gap-8 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <Eyebrow reveal>What drives us</Eyebrow>
          <h2 id="mission-title" data-reveal className="mt-5 text-[clamp(1.75rem,1.45rem+0.8vw,2.25rem)] leading-[1.1] font-semibold tracking-tight text-[#14233b]">
            {/* No serif accent in this section: the "&" stays in Sora. */}
            Mission <span className="text-accent-gradient font-display font-semibold not-italic">&amp;</span> Vision
          </h2>
        </div>

        <MissionVisionMotion className="lg:col-span-8">
          <ol className="grid gap-4 sm:gap-5">
            {items.map(({ key, number, label, copy }) => (
              <li key={key} data-mv-panel className="mv-panel">
                <span aria-hidden data-mv-plate className="mv-plate" />
                <div data-mv-surface className="mv-surface px-6 py-6 sm:px-7">
                  {/* Labels: Inter, small and spaced. Statements: Sora
                      Medium, dark navy — the same size and weight for both. */}
                  <h3 className="flex items-baseline gap-3 font-sans text-[0.72rem] font-medium tracking-[0.2em] uppercase">
                    <span className="font-semibold text-[#3478f6]">{number}</span>
                    <span aria-hidden className="h-px w-5 self-center bg-[#d6dde7]" />
                    <span className="text-[#626d7e]">{label}</span>
                  </h3>
                  <p className="mt-3 font-display text-[clamp(1.125rem,0.95rem+0.45vw,1.375rem)] leading-[1.5] font-medium tracking-[-0.012em] text-pretty text-[#14233b]">
                    <CopyText copy={copy} />
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </MissionVisionMotion>
      </div>
    </Section>
  );
}

/**
 * Values: glass cards on a light band, numbered, linked like nodes — an
 * energy connector runs from each card's badge to the next (across each
 * row on desktop, down the column below that), drawn in as they reveal.
 */
export function Values() {
  return (
    <Section id="values" tone="light" labelledBy="values-title" edge>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgb(31_86_224/0.08)_1px,transparent_1.3px)] bg-size-[26px_26px] [mask-image:radial-gradient(70%_60%_at_50%_60%,black,transparent)]"
      />
      <div className="relative">
        <Eyebrow reveal>What guides us</Eyebrow>
        <h2 id="values-title" data-reveal className="mt-5 text-h2 font-semibold tracking-tight">
          Our Core <span className="text-accent-gradient">Values</span>
        </h2>
        <Spotlight className="mt-12">
          <ol data-reveal-group className="grid gap-4 lg:grid-cols-3">
            {values.map((value, index) => (
              <li
                key={index}
                data-reveal
                data-spotlight
                className="group/value relative rounded-2xl border border-[#e9eef5] bg-white/90 p-6 shadow-[0_18px_40px_-24px_rgb(16_24_40/0.25),inset_0_1px_0_white] backdrop-blur-sm transition-[border-color,box-shadow] duration-300 hover:border-[#3478f6]/40 hover:shadow-[0_24px_50px_-24px_rgb(52_120_246/0.4),inset_0_1px_0_white] sm:p-8"
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover/value:opacity-100 bg-[radial-gradient(220px_circle_at_var(--mx,50%)_var(--my,0%),rgb(52_120_246/0.07),transparent_70%)]"
                />
                {/* Connector to the next value: across the row (desktop),
                    down the column (smaller screens). */}
                {index < values.length - 1 ? (
                  <>
                    <span
                      aria-hidden
                      data-reveal="line"
                      className={`pointer-events-none absolute left-[calc(1.5rem+2.5rem)] top-[calc(1.5rem+1.25rem)] hidden h-px w-[calc(100%-1.5rem)] bg-[linear-gradient(90deg,#2f6bff,rgb(47_107_255/0.15))] shadow-[0_0_8px_rgb(47_107_255/0.6)] sm:left-[calc(2rem+2.5rem)] sm:top-[calc(2rem+1.25rem)] ${index % 3 === 2 ? "" : "lg:block"}`}
                    />
                    <span
                      aria-hidden
                      data-reveal="fade"
                      className="pointer-events-none absolute left-[calc(1.5rem+1.25rem)] top-[calc(1.5rem+2.5rem)] h-[calc(100%-1.5rem)] w-px bg-[linear-gradient(to_bottom,rgb(47_107_255/0.8),rgb(47_107_255/0.2))] sm:left-[calc(2rem+1.25rem)] sm:top-[calc(2rem+2.5rem)] lg:hidden"
                    />
                  </>
                ) : null}
                <div className="relative">
                  <span className="grid size-10 place-items-center rounded-xl bg-[linear-gradient(145deg,#4f8dfa,#2563eb)] font-mono text-label font-medium text-white shadow-[0_8px_18px_-6px_rgb(31_86_224/0.7),0_0_0_4px_rgb(47_107_255/0.12)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-5 text-h3 font-semibold tracking-tight empty:hidden">
                    <CopyText copy={value.title} />
                  </h3>
                  <p className="mt-3 text-body text-pretty text-fg-muted empty:hidden">
                    <CopyText copy={value.body} />
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </Spotlight>
      </div>
    </Section>
  );
}

/** Our Commitment (approved copy): a large statement on black. */
export function Commitment() {
  const [first, ...rest] = commitment.paragraphs;
  return (
    <Section id="commitment" tone="white" labelledBy="commitment-title" edge className="overflow-x-clip">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_60%_at_20%_60%,rgb(52_120_246/0.06),transparent_70%)]"
      />
      <div className="relative grid gap-8 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <Eyebrow reveal>What we stand by</Eyebrow>
          <h2 id="commitment-title" data-reveal className="mt-6 text-h2 font-semibold tracking-tight">
            {/* The whole title is highlighted, so it stays in Sora (the
                serif accent is for a single word or phrase). */}
            <span className="text-accent-gradient font-display font-semibold not-italic">
              <CopyText copy={commitment.title} />
            </span>
          </h2>
        </div>
        <blockquote className="relative lg:col-span-8">
          <span aria-hidden data-reveal="line" className="mb-8 block h-px w-24 bg-[linear-gradient(90deg,var(--xt-blue-400),transparent)]" />
          <p data-reveal="lines" className="text-[clamp(1.375rem,1.1rem+1.1vw,2rem)] font-medium leading-snug tracking-tight text-pretty text-fg">
            <CopyText copy={first} />
          </p>
          {rest.map((paragraph) => (
            <p key={paragraph.text} data-reveal className="mt-6 text-lead text-pretty text-fg-muted">
              <CopyText copy={paragraph} />
            </p>
          ))}
        </blockquote>
      </div>
    </Section>
  );
}
