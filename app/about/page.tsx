import type { Metadata } from "next";
import { pageOpenGraph } from "@/lib/site";
import { isVisible, mission, sectionVisible, values, vision, company } from "@/lib/content";
import { SiteShell } from "@/components/layout/SiteShell";
import { AboutOpening } from "@/components/sections/about/AboutOpening";
import { Leadership } from "@/components/sections/about/Leadership";
import { AboutBackground, Commitment, MissionVision, Values } from "@/components/sections/about/MissionValues";
import { EnquiryBand } from "@/components/sections/EnquiryBand";

const title = "About Us";
const description =
  "About Xentra Technologies — a technology and business growth partner. Our background, mission, vision, values and leadership.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: pageOpenGraph({ title: `${title} | ${company.name}`, description, path: "/about" }),
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
      {/* The owners; absent from production until an owner is approved. */}
      {sectionVisible.leadership ? <Leadership /> : null}
      <Commitment />
      <EnquiryBand />
    </SiteShell>
  );
}
