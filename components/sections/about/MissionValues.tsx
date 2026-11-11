import { Compass, Telescope } from "lucide-react";
import { company, companyIntro, mission, philosophy, values, vision } from "@/lib/content";
import { CopyText } from "@/components/ui/CopyText";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { Section } from "@/components/ui/Section";
import { Spotlight } from "@/components/ui/Spotlight";

/*
 * About page sections (redesign step P1). Each has its own composition but
 * shares the system: curved section edges, glass panels, electric-blue
 * accents, MotionRoot reveals. Copy still pending from the content review
 * stays draft — shown in review builds only.
 */

/** Who we are: statement + approved description, pending introduction. */
export function AboutBackground() {
  return (
    <Section id="background" tone="white" labelledBy="background-title" edge>
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-6">
          <Eyebrow reveal>Who we are</Eyebrow>
          <h2
            id="background-title"
            data-reveal="lines"
            className="mt-6 text-statement font-semibold tracking-tight text-balance"
          >
            Your {company.positioning.text.replace(/\.$/, "").toLowerCase()}.
          </h2>
          {/* The approved tagline, set as a quiet signature line. */}
          <p data-reveal className="mt-8 flex items-center gap-3 font-mono text-label uppercase tracking-[0.18em] text-accent">
            <span aria-hidden className="h-px w-8 bg-current" />
            {company.tagline.text}
          </p>
        </div>
        <div data-reveal-group className="flex flex-col gap-6 lg:col-span-6 lg:pt-14">
          <p data-reveal className="text-lead text-pretty text-fg-muted">
            {company.description.text}
          </p>
          <p data-reveal className="text-body text-pretty text-fg-muted empty:hidden">
            <CopyText copy={companyIntro.introduction} />
          </p>
          <p data-reveal className="text-body text-pretty text-fg-muted empty:hidden">
            <CopyText copy={companyIntro.background} />
          </p>
        </div>
      </div>
    </Section>
  );
}

/** Mission and vision: one glass panel split by a glowing divider. */
export function MissionVision() {
  const items = [
    { label: "Mission", copy: mission, Icon: Compass },
    { label: "Vision", copy: vision, Icon: Telescope },
  ];

  return (
    <Section id="mission-vision" tone="navy" labelledBy="mission-title" edge className="overflow-x-clip">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(40%_60%_at_50%_50%,rgb(47_107_255/0.14),transparent_70%)]"
      />
      <h2 id="mission-title" className="sr-only">
        Mission and vision
      </h2>
      <div
        data-reveal
        className="relative grid overflow-hidden rounded-[1.5rem] border border-white/10 bg-[linear-gradient(160deg,rgb(255_255_255/0.06),rgb(255_255_255/0.015)_50%,rgb(47_107_255/0.06))] shadow-[0_40px_90px_-40px_rgb(47_107_255/0.5),inset_0_1px_0_rgb(255_255_255/0.08)] md:grid-cols-2"
      >
        {/* Glowing divider (horizontal on phones, vertical from md). */}
        <span
          aria-hidden
          className="absolute inset-x-8 top-1/2 h-px bg-[linear-gradient(90deg,transparent,rgb(90_139_255/0.7),transparent)] shadow-[0_0_10px_rgb(47_107_255/0.8)] md:inset-x-auto md:inset-y-8 md:left-1/2 md:top-auto md:h-auto md:w-px md:bg-[linear-gradient(to_bottom,transparent,rgb(90_139_255/0.7),transparent)]"
        />
        {items.map(({ label, copy, Icon }) => (
          <article key={label} className="p-7 sm:p-10 lg:p-14">
            <div className="flex items-center gap-4">
              <span className="grid size-12 place-items-center rounded-xl border border-blue-400/25 bg-blue-500/10 text-blue-300 shadow-[0_0_24px_-8px_rgb(47_107_255/0.8)]">
                <Icon aria-hidden size={22} strokeWidth={1.75} />
              </span>
              <h3 className="font-mono text-label uppercase tracking-[0.2em] text-accent">{label}</h3>
            </div>
            <p className="mt-8 text-[clamp(1.25rem,1.05rem+0.8vw,1.75rem)] leading-snug font-medium tracking-tight text-pretty text-silver-50 empty:hidden">
              <CopyText copy={copy} />
            </p>
          </article>
        ))}
      </div>
    </Section>
  );
}

/** Values: glass cards on a light band, numbered, with cursor light. */
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
          Our <span className="text-accent-gradient">Values</span>
        </h2>
        <Spotlight className="mt-12">
          <ol data-reveal-group className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((value, index) => (
              <li
                key={index}
                data-reveal
                data-spotlight
                className="group/value relative overflow-hidden rounded-2xl border border-blue-500/15 bg-white/80 p-6 shadow-[0_18px_40px_-24px_rgb(31_86_224/0.35),inset_0_1px_0_white] backdrop-blur-sm transition-[border-color,box-shadow] duration-300 hover:border-blue-500/40 hover:shadow-[0_24px_50px_-24px_rgb(31_86_224/0.5),inset_0_1px_0_white] sm:p-8"
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/value:opacity-100 bg-[radial-gradient(220px_circle_at_var(--mx,50%)_var(--my,0%),rgb(47_107_255/0.1),transparent_70%)]"
                />
                <div className="relative">
                  <span className="grid size-10 place-items-center rounded-xl bg-blue-600 font-mono text-label font-medium text-white shadow-[0_8px_18px_-6px_rgb(31_86_224/0.7)]">
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

/** Business philosophy: one large statement on black, light trail beneath. */
export function Philosophy() {
  return (
    <Section id="philosophy" tone="black" labelledBy="philosophy-title" edge className="overflow-x-clip">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_60%_at_20%_60%,rgb(47_107_255/0.12),transparent_70%)]"
      />
      <div className="relative grid gap-8 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <Eyebrow reveal>Our philosophy</Eyebrow>
          {/* Solid blue, not the gradient: background-clip text would also
              clip the draft marker that CopyText renders in review builds. */}
          <h2 id="philosophy-title" data-reveal className="mt-6 text-h2 font-semibold tracking-tight text-blue-400">
            <CopyText copy={philosophy.title} />
          </h2>
        </div>
        <blockquote className="relative lg:col-span-8">
          <span aria-hidden data-reveal="line" className="mb-8 block h-px w-24 bg-[linear-gradient(90deg,var(--xt-blue-400),transparent)]" />
          <p data-reveal="lines" className="text-[clamp(1.375rem,1.1rem+1.1vw,2rem)] font-medium leading-snug tracking-tight text-pretty text-silver-50">
            <CopyText copy={philosophy.body} />
          </p>
        </blockquote>
      </div>
    </Section>
  );
}
