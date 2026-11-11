import { ArrowRight } from "lucide-react";
import { company, companyFacts, sectionVisible } from "@/lib/content";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { Section } from "@/components/ui/Section";
import { DomainMatrix } from "./about/DomainMatrix";

/**
 * Editorial About: positioning statement (revealed line by line) beside the
 * approved description, then the four connected domains in a dark panel.
 *
 * Company facts (location, founding year, …) render only once APPROVED —
 * drafts are never shown here, not even in review builds.
 */
export function About() {
  const facts = companyFacts.filter((fact) => fact.value.status === "approved");

  return (
    <Section id="about" tone="white" labelledBy="about-title">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <Eyebrow reveal>About Xentra</Eyebrow>
          <h2
            id="about-title"
            data-reveal="lines"
            className="mt-6 text-statement font-semibold tracking-tight text-balance"
          >
            Your {company.positioning.text.replace(/\.$/, "").toLowerCase()}.
          </h2>
        </div>

        <div data-reveal-group className="flex flex-col gap-8 lg:col-span-5 lg:pt-14">
          <p data-reveal className="text-lead text-pretty text-fg-muted">
            {company.description.text}
          </p>
          {sectionVisible.leadership ? (
            <a
              data-reveal
              href="#leadership"
              className="group inline-flex min-h-11 items-center gap-2 self-start font-medium text-accent"
            >
              Meet the people behind Xentra
              <ArrowRight
                aria-hidden
                size={18}
                className="transition-transform group-hover:translate-x-1 group-focus-visible:translate-x-1"
              />
            </a>
          ) : null}
        </div>
      </div>

      <DomainMatrix />

      {facts.length > 0 ? (
        <dl data-reveal-group className="mt-14 grid border-y border-line sm:grid-cols-3">
          {facts.map((fact) => (
            <div key={fact.label} data-reveal className="py-6 sm:pr-8">
              <dt className="font-mono text-label uppercase tracking-[0.16em] text-fg-muted">
                {fact.label}
              </dt>
              <dd className="mt-2 text-body font-medium">{fact.value.text}</dd>
            </div>
          ))}
        </dl>
      ) : null}
    </Section>
  );
}
