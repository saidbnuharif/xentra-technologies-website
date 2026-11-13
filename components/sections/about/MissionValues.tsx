import { Compass, Telescope } from "lucide-react";
import { aboutOverview, commitment, company, mission, values, vision } from "@/lib/content";
import { CopyText } from "@/components/ui/CopyText";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { Section } from "@/components/ui/Section";
import { MissionVisionMotion } from "./MissionVisionMotion";
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
    <Section id="background" tone="black" labelledBy="background-title" className="overflow-x-clip">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(40%_50%_at_85%_40%,rgb(47_107_255/0.1),transparent_70%)]"
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
 * Mission and Vision: a horizon dial above two glass cards. A beam swings
 * from the Mission point to the Vision point as you scroll, and rings ripple
 * out from Vision (MissionVisionMotion). Static markup = finished frame.
 */
export function MissionVision() {
  const items = [
    { key: "mission", label: "Mission", copy: mission, Icon: Compass },
    { key: "vision", label: "Vision", copy: vision, Icon: Telescope },
  ] as const;
  // Dial geometry (viewBox 1200 × 360): pivot on the horizon, targets ±60°.
  const pivot = { x: 600, y: 330 };
  const radius = 280;
  const target = (deg: number) => ({
    x: Math.round(pivot.x + radius * Math.sin((deg * Math.PI) / 180)),
    y: Math.round(pivot.y - radius * Math.cos((deg * Math.PI) / 180)),
  });
  const missionPt = target(-60);
  const visionPt = target(60);
  const ticks = Array.from({ length: 13 }, (_, i) => -90 + i * 15);

  return (
    <Section id="mission-vision" tone="navy" labelledBy="mission-title" edge className="overflow-x-clip">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(45%_55%_at_50%_30%,rgb(47_107_255/0.16),transparent_70%)]"
      />
      <h2 id="mission-title" className="sr-only">
        Mission and vision
      </h2>
      <MissionVisionMotion>
        {/* Horizon dial (decorative). */}
        <svg aria-hidden viewBox="0 0 1200 360" className="mx-auto block w-full max-w-5xl overflow-visible">
          <defs>
            <linearGradient id="mv-horizon" x1="0" x2="1200" y1="0" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#5a8bff" stopOpacity="0" />
              <stop offset="0.5" stopColor="#93b3ff" stopOpacity="0.9" />
              <stop offset="1" stopColor="#5a8bff" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="mv-beam" x1={pivot.x} y1={pivot.y} x2={pivot.x} y2={pivot.y - radius - 20} gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#dbe6ff" stopOpacity="0.95" />
              <stop offset="0.6" stopColor="#5a8bff" stopOpacity="0.45" />
              <stop offset="1" stopColor="#2f6bff" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Dial arc + ticks */}
          <path
            d={`M${pivot.x - radius} ${pivot.y} A${radius} ${radius} 0 0 1 ${pivot.x + radius} ${pivot.y}`}
            fill="none"
            stroke="#cfd5de"
            strokeOpacity="0.14"
            strokeDasharray="2 7"
          />
          {/* Lit path of the sweep (Mission → Vision), drawn as the beam turns. */}
          <path
            data-mv-sweep
            d={`M${missionPt.x} ${missionPt.y} A${radius} ${radius} 0 0 1 ${visionPt.x} ${visionPt.y}`}
            pathLength={1}
            strokeDasharray="1"
            strokeDashoffset="0"
            fill="none"
            stroke="#5a8bff"
            strokeWidth="1.5"
            className="[filter:drop-shadow(0_0_5px_rgb(47_107_255/0.9))]"
          />
          {ticks.map((deg) => {
            const a = target(deg);
            const inner = {
              x: pivot.x + (radius - 14) * Math.sin((deg * Math.PI) / 180),
              y: pivot.y - (radius - 14) * Math.cos((deg * Math.PI) / 180),
            };
            return (
              <line
                key={deg}
                x1={a.x}
                y1={a.y}
                x2={Math.round(inner.x)}
                y2={Math.round(inner.y)}
                stroke="#cfd5de"
                strokeOpacity={deg % 45 === 0 ? 0.35 : 0.15}
              />
            );
          })}
          {/* Horizon */}
          <line x1="0" y1={pivot.y} x2="1200" y2={pivot.y} stroke="url(#mv-horizon)" strokeWidth="1.5" className="[filter:drop-shadow(0_0_6px_rgb(47_107_255/0.8))]" />
          {/* Rings rippling out from Vision */}
          {[0, 1, 2].map((i) => (
            <circle key={i} data-mv-ring cx={visionPt.x} cy={visionPt.y} r={40 + i * 36} fill="none" stroke="#5a8bff" strokeOpacity="1" opacity="0.32" />
          ))}
          {/* Beam (finished frame: pointing at Vision) */}
          <g data-mv-beam transform={`rotate(60 ${pivot.x} ${pivot.y})`}>
            <polygon
              points={`${pivot.x},${pivot.y} ${pivot.x - 26},${pivot.y - radius - 20} ${pivot.x + 26},${pivot.y - radius - 20}`}
              fill="url(#mv-beam)"
            />
            <line x1={pivot.x} y1={pivot.y} x2={pivot.x} y2={pivot.y - radius} stroke="#dbe6ff" strokeOpacity="0.7" strokeWidth="1.2" />
          </g>
          {/* Targets */}
          {[
            { key: "mission", pt: missionPt, label: "Mission" },
            { key: "vision", pt: visionPt, label: "Vision" },
          ].map(({ key, pt, label }) => (
            <g key={key}>
              <circle data-mv-dot={key} cx={pt.x} cy={pt.y} r="8" fill="#dbe6ff" className="[filter:drop-shadow(0_0_8px_rgb(47_107_255))]" />
              <text
                x={pt.x}
                y={pt.y - 22}
                textAnchor="middle"
                fontSize="15"
                letterSpacing="3"
                fontFamily="var(--font-geist-mono)"
                fill="#93b3ff"
              >
                {label.toUpperCase()}
              </text>
            </g>
          ))}
          <circle cx={pivot.x} cy={pivot.y} r="6" fill="#dbe6ff" className="[filter:drop-shadow(0_0_10px_rgb(47_107_255))]" />
        </svg>

        <div className="relative mt-8 grid gap-5 md:grid-cols-2 md:gap-6 lg:mt-4">
          {items.map(({ key, label, copy, Icon }) => (
            <article
              key={key}
              data-mv-card={key}
              className="rounded-[1.5rem] border border-white/10 bg-[linear-gradient(160deg,rgb(255_255_255/0.06),rgb(255_255_255/0.015)_50%,rgb(47_107_255/0.06))] p-7 shadow-[0_40px_90px_-40px_rgb(47_107_255/0.5),inset_0_1px_0_rgb(255_255_255/0.08)] sm:p-10"
            >
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
      </MissionVisionMotion>
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
                className="group/value relative rounded-2xl border border-blue-500/15 bg-white/80 p-6 shadow-[0_18px_40px_-24px_rgb(31_86_224/0.35),inset_0_1px_0_white] backdrop-blur-sm transition-[border-color,box-shadow] duration-300 hover:border-blue-500/40 hover:shadow-[0_24px_50px_-24px_rgb(31_86_224/0.5),inset_0_1px_0_white] sm:p-8"
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover/value:opacity-100 bg-[radial-gradient(220px_circle_at_var(--mx,50%)_var(--my,0%),rgb(47_107_255/0.1),transparent_70%)]"
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
                  <span className="grid size-10 place-items-center rounded-xl bg-blue-600 font-mono text-label font-medium text-white shadow-[0_8px_18px_-6px_rgb(31_86_224/0.7),0_0_0_4px_rgb(47_107_255/0.12)]">
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
    <Section id="commitment" tone="black" labelledBy="commitment-title" edge className="overflow-x-clip">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_60%_at_20%_60%,rgb(47_107_255/0.12),transparent_70%)]"
      />
      <div className="relative grid gap-8 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <Eyebrow reveal>What we stand by</Eyebrow>
          <h2 id="commitment-title" data-reveal className="mt-6 text-h2 font-semibold tracking-tight">
            <span className="text-accent-gradient">
              <CopyText copy={commitment.title} />
            </span>
          </h2>
        </div>
        <blockquote className="relative lg:col-span-8">
          <span aria-hidden data-reveal="line" className="mb-8 block h-px w-24 bg-[linear-gradient(90deg,var(--xt-blue-400),transparent)]" />
          <p data-reveal="lines" className="text-[clamp(1.375rem,1.1rem+1.1vw,2rem)] font-medium leading-snug tracking-tight text-pretty text-silver-50">
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
