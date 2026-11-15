import Image from "next/image";
import { founders, leadershipIntro, visibleOnly, type Founder } from "@/lib/content";
import { CopyText } from "@/components/ui/CopyText";
import { Section } from "@/components/ui/Section";
import { LeadershipMotion } from "./LeadershipMotion";
import "./leadership.css";

/*
 * About page: "The People Behind Xentra" — the two owners as a corporate
 * executive leadership block: a structured two-column layout with equal
 * weight, divided by a silver hairline. Each profile: a medium
 * head-and-shoulders portrait (the owner's own photograph, cropped for
 * display only — no frame, square edges, a short blue rule beneath), the
 * designation and name beside it, a divider, then the biography.
 * Minimal effects: one restrained entrance (LeadershipMotion).
 *
 * Content: lib/content/founders.ts. Draft owners (designation / bio still
 * to come) show with marked placeholders in dev and review builds only;
 * the section is absent from production until an owner is approved.
 */
export function Leadership() {
  const leaders = visibleOnly(founders);
  if (leaders.length === 0) return null;

  return (
    <Section id="leadership" tone="white" labelledBy="leadership-title" edge>
      <LeadershipMotion>
        <header className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-12">
          <div data-ld-reveal className="lg:col-span-7">
            <p className="flex items-center gap-4 font-mono text-label font-medium tracking-[0.3em] text-accent uppercase">
              <span aria-hidden className="h-px w-10 bg-current" />
              Leadership
            </p>
            <h2 id="leadership-title" className="mt-5 text-[clamp(2rem,1.4rem+2.2vw,3.25rem)] leading-[1.08] font-semibold tracking-tight text-balance text-[#14233b]">
              <CopyText copy={leadershipIntro.title} />
            </h2>
          </div>
          <p data-ld-reveal className="text-lead text-pretty text-fg-muted lg:col-span-5 lg:pb-1.5">
            <CopyText copy={leadershipIntro.subtitle} />
          </p>
        </header>

        {/* Architectural rule: silver, with a short electric-blue lead. */}
        <div aria-hidden data-ld-reveal className="ld-rule mt-10 lg:mt-14" />

        {/* The profiles sit on a full-width band above the site-wide ambient
            particle canvas (fixed, z-30), so no particles drift near the
            owners' portraits; still below the WhatsApp button and navbar. */}
        <ol className="ld-profiles relative z-[31] mt-2 grid lg:grid-cols-2">
          {leaders.map((leader) => (
            <LeaderProfile key={leader.key} leader={leader} />
          ))}
        </ol>
      </LeadershipMotion>
    </Section>
  );
}

function LeaderProfile({ leader }: { leader: Founder }) {
  const nameId = `leader-${leader.key}`;
  const crop = leader.crop ?? { focus: "50% 20%", zoom: 1 };

  return (
    <li data-ld-reveal className="ld-profile">
      <article aria-labelledby={nameId}>
        <div className="flex items-end gap-5 sm:gap-8">
          <div className="ld-portrait relative aspect-[4/5] w-[7.5rem] shrink-0 overflow-hidden sm:w-40 xl:w-44">
            {leader.photo ? (
              <Image
                src={leader.photo}
                alt={`Portrait of ${leader.name.text}`}
                fill
                placeholder="blur"
                sizes="(min-width: 640px) 18rem, 13rem"
                className="object-cover"
                style={{ objectPosition: crop.focus, transform: `scale(${crop.zoom})`, transformOrigin: crop.focus }}
              />
            ) : null}
          </div>

          <div className="min-w-0 pb-1">
            <p className="font-mono text-[0.72rem] font-medium tracking-[0.2em] text-[#2563eb] uppercase">
              <CopyText copy={leader.designation} />
            </p>
            <h3 id={nameId} className="mt-2.5 text-[clamp(1.4rem,1.15rem+0.8vw,1.875rem)] leading-tight font-semibold tracking-tight text-[#14233b]">
              <CopyText copy={leader.name} />
            </h3>
            <p className="mt-1.5 text-sm text-[#626d7e]">Xentra Technologies</p>
            {leader.linkedin ? (
              <a
                href={leader.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex min-h-11 items-center text-sm font-medium text-[#2563eb] underline-offset-4 transition-colors hover:text-[#14233b] hover:underline focus-visible:text-[#14233b]"
              >
                LinkedIn
                <span className="sr-only"> profile of {leader.name.text} (opens in a new tab)</span>
              </a>
            ) : null}
          </div>
        </div>

        <div aria-hidden className="ld-divider mt-7" />
        <p className="mt-6 max-w-[34rem] text-body leading-relaxed text-pretty text-[#4f5b6d]">
          <CopyText copy={leader.bio} />
        </p>
      </article>
    </li>
  );
}
