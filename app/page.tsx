import type { Metadata } from "next";
import { homeCopy } from "@/lib/content";
import { SiteShell } from "@/components/layout/SiteShell";
import { Hero } from "@/components/sections/Hero";
import { CompanyIntro } from "@/components/sections/home/CompanyIntro";
import { ServicesShowcase } from "@/components/sections/home/ServicesShowcase";
import { WhyXentra } from "@/components/sections/WhyXentra";
import { Industries } from "@/components/sections/Industries";
import { Process } from "@/components/sections/Process";
import { EnquiryBand } from "@/components/sections/EnquiryBand";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

/*
 * Home. Hero (3D mark) → introduction → pinned services showcase
 * (confirmed groups) → Why Xentra → How We Work preview → enquiry.
 * Sections without approved content render only in review builds.
 */
export default function Home() {
  return (
    <SiteShell current="home">
      <Hero />
      <CompanyIntro />
      <ServicesShowcase />
      <WhyXentra />
      <Industries />
      <Process variant="preview" intro={homeCopy.howWeWorkIntro} />
      <EnquiryBand />
    </SiteShell>
  );
}
