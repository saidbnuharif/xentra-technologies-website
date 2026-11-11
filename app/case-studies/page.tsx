import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { caseStudies, visibleOnly } from "@/lib/content";
import { SiteShell } from "@/components/layout/SiteShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { CopyText } from "@/components/ui/CopyText";
import { Section } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Case Studies",
  description: "Selected Xentra Technologies projects, published with our clients' permission.",
  alternates: { canonical: "/case-studies" },
};

/** Index of publishable case studies; 404 until at least one is approved. */
export default function CaseStudiesPage() {
  const studies = visibleOnly(caseStudies);
  if (studies.length === 0) notFound();

  return (
    <SiteShell current={null}>
      <PageHeader
        eyebrow="Case Studies"
        title={
          <>
            Selected <span className="text-accent-gradient">Work</span>
          </>
        }
      />
      <Section id="case-study-list" tone="white" labelledBy="case-study-list-title" edge>
        <h2 id="case-study-list-title" className="sr-only">
          All case studies
        </h2>
        <ul data-reveal-group className="grid gap-4 md:grid-cols-2">
          {studies.map((study) => (
            <li key={study.slug} data-reveal>
              <Link
                href={`/case-studies/${study.slug}`}
                className="group flex h-full min-h-20 items-center justify-between gap-6 rounded-2xl border border-blue-500/12 bg-white/85 p-6 shadow-[0_18px_40px_-26px_rgb(31_86_224/0.35),inset_0_1px_0_white] transition-[border-color,box-shadow] duration-300 hover:border-blue-500/35 hover:shadow-[0_24px_50px_-24px_rgb(31_86_224/0.5)] focus-visible:border-blue-500/50 sm:p-8"
              >
                <span>
                  <span className="block font-mono text-label uppercase tracking-[0.16em] text-fg-muted">
                    <CopyText copy={study.industry} />
                  </span>
                  <span className="mt-2 block text-h3 font-semibold tracking-tight transition-colors group-hover:text-accent group-focus-visible:text-accent">
                    <CopyText copy={study.title} />
                  </span>
                </span>
                <ArrowRight
                  aria-hidden
                  className="shrink-0 text-fg-muted transition-[color,translate] group-hover:translate-x-1 group-hover:text-accent"
                />
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </SiteShell>
  );
}
