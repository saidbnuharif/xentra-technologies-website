import type { CSSProperties, ReactNode } from "react";
import type { Copy } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { CopyText } from "@/components/ui/CopyText";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { InViewFlag } from "@/components/ui/InViewFlag";
import "./page-header.css";

type PageHeaderProps = {
  eyebrow: string;
  /** The page's h1. Wrap one phrase in `text-accent-gradient` to highlight it. */
  title: ReactNode;
  intro?: Copy | null;
  children?: ReactNode;
};

const delay = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;

/** Orbit-line art on the right: tilted rings, nodes and a glowing core. */
function OrbitArt() {
  return (
    <div
      aria-hidden
      data-ph-art
      // Fades out on its left so ring lines never cross the title.
      className="pointer-events-none absolute -right-40 top-1/2 size-[36rem] -translate-y-1/2 opacity-60 [mask-image:linear-gradient(to_right,transparent_8%,black_45%)] sm:-right-24 sm:opacity-80 lg:right-[-10rem] lg:size-[42rem] lg:opacity-100"
    >
      <div className="absolute inset-[22%] rounded-full bg-[radial-gradient(circle,rgb(52_120_246/0.14),rgb(199_206_216/0.12)_45%,transparent_68%)] blur-2xl" />
      <svg viewBox="0 0 400 400" className="absolute inset-0 size-full overflow-visible">
        <defs>
          <linearGradient id="ph-ring" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#3478f6" stopOpacity="0.7" />
            <stop offset="0.6" stopColor="#8995a5" stopOpacity="0.35" />
            <stop offset="1" stopColor="#c7ced8" stopOpacity="0" />
          </linearGradient>
        </defs>
        <g data-ph-orbit>
          <ellipse cx="200" cy="200" rx="185" ry="62" transform="rotate(-24 200 200)" fill="none" stroke="url(#ph-ring)" strokeWidth="1.2" />
          <ellipse cx="200" cy="200" rx="150" ry="150" fill="none" stroke="#8995a5" strokeOpacity="0.3" strokeDasharray="2 6" />
          <ellipse cx="200" cy="200" rx="120" ry="40" transform="rotate(32 200 200)" fill="none" stroke="#c7ced8" strokeOpacity="0.8" />
          <circle cx="363" cy="128" r="3.5" fill="#3478f6" className="[filter:drop-shadow(0_0_6px_rgb(52_120_246/0.6))]" />
          <circle cx="98" cy="268" r="2.5" fill="#8995a5" />
          <circle cx="285" cy="240" r="2" fill="#8995a5" />
        </g>
        <circle cx="200" cy="200" r="64" fill="none" stroke="#c7ced8" strokeOpacity="0.9" />
        <circle cx="200" cy="200" r="5" fill="#3478f6" className="[filter:drop-shadow(0_0_8px_rgb(52_120_246/0.6))]" />
      </svg>
    </div>
  );
}

/**
 * Opening band for inner pages (About, Services, How We Work, Contact, …).
 * Redesign (P1): cinematic — larger title, blue light and orbit-line art,
 * staggered CSS entrance on first paint (no JS, nothing hidden waiting for
 * it), and room at the bottom for the next section's curved edge. Carries
 * the page's single h1. MotionRoot leaves it untouched (in view on load).
 */
export function PageHeader({ eyebrow, title, intro, children }: PageHeaderProps) {
  return (
    <section aria-labelledby="page-title" className="tone-white relative isolate overflow-hidden pb-24 pt-[calc(var(--xt-nav-height)+4.5rem)] lg:pb-32 lg:pt-[calc(var(--xt-nav-height)+6.5rem)]">
      {/* Faint blueprint grid fading out to the right, and blue horizon light. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(rgb(16_24_40/0.045)_1px,transparent_1px),linear-gradient(90deg,rgb(16_24_40/0.045)_1px,transparent_1px)] bg-size-[56px_56px] [mask-image:linear-gradient(to_right,black,transparent_70%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-2/3 bg-[radial-gradient(55%_70%_at_75%_100%,rgb(52_120_246/0.08),transparent_70%),linear-gradient(180deg,#ffffff,#eef1f5)]"
      />
      <OrbitArt />
      <InViewFlag />

      <Container className="relative">
        <div data-ph-in style={delay(0.05)}>
          <Eyebrow>{eyebrow}</Eyebrow>
        </div>
        <h1
          id="page-title"
          data-ph-in
          style={delay(0.15)}
          className="mt-6 max-w-4xl text-[clamp(2.5rem,1.6rem+3.6vw,4.5rem)] leading-[1.04] font-semibold tracking-tight text-balance"
        >
          {title}
        </h1>
        {intro ? (
          <p data-ph-in style={delay(0.3)} className="mt-6 max-w-2xl text-lead text-pretty text-fg-muted empty:hidden">
            <CopyText copy={intro} />
          </p>
        ) : null}
        {children ? (
          <div data-ph-in style={delay(0.4)}>
            {children}
          </div>
        ) : null}
      </Container>
    </section>
  );
}
