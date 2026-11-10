import { ArrowRight } from "lucide-react";
import { company, companyFacts, isVisible, sectionVisible } from "@/lib/content";
import { CopyText } from "@/components/ui/CopyText";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { Section } from "@/components/ui/Section";

/**
 * Typography-led About: a large positioning statement with the approved
 * description. No image slot — no empty frame unless real imagery exists.
 */
export function About() {
  const facts = companyFacts.filter((fact) => isVisible(fact.value));

  return (
    <Section id="about" tone="white" labelledBy="about-title">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <Eyebrow>About Xentra</Eyebrow>
          <h2
            id="about-title"
            className="mt-6 text-statement font-semibold tracking-tight text-balance"
          >
            Your {company.positioning.text.replace(/\.$/, "").toLowerCase()}.
          </h2>
        </div>

        <div className="flex flex-col gap-8 lg:col-span-5 lg:pt-14">
          <p className="text-lead text-pretty text-fg-muted">
            {company.description.text}
          </p>
          {sectionVisible.leadership ? (
            <a
              href="#leadership"
              className="group inline-flex min-h-11 items-center gap-2 self-start font-medium text-accent"
            >
              Meet the people behind Xentra
              <ArrowRight
                aria-hidden
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </a>
          ) : null}
        </div>
      </div>

      {facts.length > 0 ? (
        <dl className="mt-16 grid gap-px overflow-hidden border-y border-line sm:grid-cols-3">
          {facts.map((fact) => (
            <div key={fact.label} className="py-6 sm:pr-8">
              <dt className="font-mono text-label uppercase tracking-[0.16em] text-fg-muted">
                {fact.label}
              </dt>
              <dd className="mt-2 text-body font-medium">
                <CopyText copy={fact.value} />
              </dd>
            </div>
          ))}
        </dl>
      ) : null}
    </Section>
  );
}
