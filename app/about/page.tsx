import type { Metadata } from "next";
import { isVisible, mission, pageIntro, philosophy, values, vision } from "@/lib/content";
import { SiteShell } from "@/components/layout/SiteShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { AboutBackground, MissionVision, Philosophy, Values } from "@/components/sections/about/MissionValues";
import { Leadership } from "@/components/sections/Leadership";
import { EnquiryBand } from "@/components/sections/EnquiryBand";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "About Xentra Technologies — a technology and business growth partner. Our background, mission, vision, values and leadership.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  // Blocks with no approved content stay out of production entirely.
  const showMissionVision = isVisible(mission) || isVisible(vision);
  const showValues = values.some((value) => isVisible(value.title));
  const showPhilosophy = isVisible(philosophy.body);

  return (
    <SiteShell current="about">
      <PageHeader
        eyebrow="About Us"
        title={
          <>
            About <span className="text-accent-gradient">Xentra Technologies</span>
          </>
        }
        intro={pageIntro.about}
      />
      <AboutBackground />
      {showMissionVision ? <MissionVision /> : null}
      {showValues ? <Values /> : null}
      {showPhilosophy ? <Philosophy /> : null}
      <Leadership />
      <EnquiryBand />
    </SiteShell>
  );
}
