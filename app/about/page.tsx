import type { Metadata } from "next";
import { isVisible, mission, values, vision } from "@/lib/content";
import { SiteShell } from "@/components/layout/SiteShell";
import { AboutOpening } from "@/components/sections/about/AboutOpening";
import { AboutBackground, Commitment, MissionVision, Values } from "@/components/sections/about/MissionValues";
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

  return (
    <SiteShell current="about">
      {/* Opening: the 3D X in its universe, the approved line around it. */}
      <AboutOpening />
      <AboutBackground />
      {showMissionVision ? <MissionVision /> : null}
      {showValues ? <Values /> : null}
      <Commitment />
      <EnquiryBand />
    </SiteShell>
  );
}
