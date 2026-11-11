import type { Metadata } from "next";
import { pageIntro } from "@/lib/content";
import { SiteShell } from "@/components/layout/SiteShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { Process } from "@/components/sections/Process";
import { EnquiryBand } from "@/components/sections/EnquiryBand";
import { DeliveryTrack } from "@/components/sections/process/DeliveryTrack";

export const metadata: Metadata = {
  title: "How We Work",
  description:
    "How Xentra Technologies works with you: understand, research and analyse, agree on a plan, execute, then measure and refine.",
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
      <Process variant="full" />
      <DeliveryTrack />
      <EnquiryBand />
    </SiteShell>
  );
}
