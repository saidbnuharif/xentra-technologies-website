import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/SiteShell";
import { Hero } from "@/components/sections/Hero";
import { CompanyIntro } from "@/components/sections/home/CompanyIntro";
import { ServicesShowcase } from "@/components/sections/home/ServicesShowcase";
import { WhyXentra } from "@/components/sections/WhyXentra";
import { EnquiryBand } from "@/components/sections/EnquiryBand";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

/*
 * Home. Hero (3D mark) → introduction (the mark re-emerges there) → pinned
 * services showcase (confirmed groups) → Why Xentra → contact finale.
 * Kept short: How We Work has its own page; Industries is not on Home.
 * Sections without approved content render only in review builds.
 */
export default function Home() {
  return (
    <SiteShell current="home">
      {/* Hero → About: one 3D X carried along an energy curve (XStage). */}
      <Hero />
      <CompanyIntro />
      <ServicesShowcase />
      <WhyXentra />
      <EnquiryBand />
    </SiteShell>
  );
}
