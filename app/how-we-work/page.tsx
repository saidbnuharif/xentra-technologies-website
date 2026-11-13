import type { Metadata } from "next";
import { pageOpenGraph } from "@/lib/site";
import { pageIntro, company } from "@/lib/content";
import { SiteShell } from "@/components/layout/SiteShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { Process } from "@/components/sections/Process";
import { EnquiryBand } from "@/components/sections/EnquiryBand";

const title = "How We Work";
const description =
  "How Xentra Technologies works with you: understand, research and analyse, agree on a plan, execute, then measure and refine.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: pageOpenGraph({ title: `${title} | ${company.name}`, description, path: "/how-we-work" }),
  alternates: { canonical: "/how-we-work" },
};

export default function HowWeWorkPage() {
  return (
    <SiteShell current="how-we-work">
      <PageHeader
        eyebrow="How We Work"
        title={
          <>
            How We <span className="text-accent-gradient">Work</span>
          </>
        }
        intro={pageIntro.howWeWork}
      />
      <Process />
      <EnquiryBand />
    </SiteShell>
  );
}
