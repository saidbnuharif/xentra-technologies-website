import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { company, companyIntro } from "@/lib/content";
import { CopyText } from "@/components/ui/CopyText";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { Section } from "@/components/ui/Section";

/**
 * Home: company introduction. The approved description is shown now; the
 * fuller introduction from the Website Handoff document drops into the
 * pending slot (review builds only until approved).
 */
export function CompanyIntro() {
  return (
    <Section id="introduction" tone="white" labelledBy="intro-title" edge>
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <Eyebrow reveal>About Xentra</Eyebrow>
          <h2
            id="intro-title"
            data-reveal="lines"
            className="mt-6 text-statement font-semibold tracking-tight text-balance"
          >
            Your {company.positioning.text.replace(/\.$/, "").toLowerCase()}.
          </h2>
        </div>

        <div data-reveal-group className="flex flex-col gap-6 lg:col-span-5 lg:pt-14">
          <p data-reveal className="text-lead text-pretty text-fg-muted">
            {company.description.text}
          </p>
          <p data-reveal className="text-body text-pretty text-fg-muted empty:hidden">
            <CopyText copy={companyIntro.introduction} />
          </p>
          <Link
            data-reveal
            href="/about"
            className="group inline-flex min-h-11 items-center gap-2 self-start font-medium text-accent"
          >
            More about Xentra
            <ArrowRight
              aria-hidden
              size={18}
              className="transition-transform group-hover:translate-x-1 group-focus-visible:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </Section>
  );
}
