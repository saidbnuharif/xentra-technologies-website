import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { caseStudies, visibleOnly } from "@/lib/content";
import { SiteShell } from "@/components/layout/SiteShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { CopyText } from "@/components/ui/CopyText";
import { CaseStudyTemplate } from "@/components/sections/case-studies/CaseStudyTemplate";
import { EnquiryBand } from "@/components/sections/EnquiryBand";

/**
 * Only approved studies (or drafts in review builds) are generated.
 * With Cache Components, generateStaticParams must return at least one
 * entry, so when nothing is publishable a placeholder slug is returned and
 * resolves to a 404 below (pattern from the Next.js docs).
 */
const PLACEHOLDER = "__none__";

export function generateStaticParams() {
  const slugs = visibleOnly(caseStudies).map((study) => ({ slug: study.slug }));
  // The placeholder is always prerendered (as a static 404): proxy.ts rewrites
  // every unknown slug to it, in normal and review builds alike.
  return [...slugs, { slug: PLACEHOLDER }];
}

function findStudy(slug: string) {
  return visibleOnly(caseStudies).find((study) => study.slug === slug);
}

export async function generateMetadata({ params }: PageProps<"/case-studies/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const study = findStudy(slug);
  if (!study) return { title: "Case study not found" };
  return {
    title: `${study.title.text} — Case Study`,
    // Drafts are never indexed, even on a staging deployment.
    robots: study.status === "approved" ? undefined : { index: false, follow: false },
  };
}

export default async function CaseStudyPage({ params }: PageProps<"/case-studies/[slug]">) {
  const { slug } = await params;
  const study = findStudy(slug);
  if (!study) notFound();

  return (
    <SiteShell current={null}>
      <PageHeader eyebrow="Case Study" title={<CopyText copy={study.title} />} />
      <CaseStudyTemplate study={study} />
      <EnquiryBand />
    </SiteShell>
  );
}
