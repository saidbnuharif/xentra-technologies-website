import type { Metadata } from "next";
import { pageOpenGraph } from "@/lib/site";
import Link from "next/link";
import { coreServices, coreServicesIntro, company } from "@/lib/content";
import { CopyText } from "@/components/ui/CopyText";
import { SiteShell } from "@/components/layout/SiteShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { CoreApproach, CoreVision, ServiceCatalog } from "@/components/sections/services/ServiceCatalog";
import { EnquiryBand } from "@/components/sections/EnquiryBand";

const title = "Services";
const description =
  "Xentra Technologies' 8 core services: business development, market research and expansion, strategic partnerships, digital marketing, branding, websites, CRM and automation, and growth advisory.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: pageOpenGraph({ title: `${title} | ${company.name}`, description, path: "/services" }),
  alternates: { canonical: "/services" },
};

/** Services page — Our 8 Core Services (approved copy, this page only). */
export default function ServicesPage() {
  return (
    <SiteShell current="services">
      <PageHeader
        eyebrow="Services"
        title={
          <>
            Our 8 <span className="text-accent-gradient">Core Services</span>
          </>
        }
        intro={coreServicesIntro.body}
      >
        {/* Quick jump to each service. */}
        <nav aria-label="Services on this page" className="mt-10 flex max-w-4xl flex-wrap gap-2.5">
          {coreServices.map((service, i) => (
            <Link
              key={service.slug}
              href={`#${service.slug}`}
              className="inline-flex min-h-11 items-center gap-2.5 rounded-full border border-[#e9eef5] bg-white/85 px-4 py-2 text-sm text-[#14233b] shadow-[0_1px_2px_rgb(16_24_40/0.06)] backdrop-blur-sm transition-[border-color,background-color,box-shadow] duration-300 hover:border-[#3478f6]/50 hover:bg-white hover:shadow-[0_8px_20px_-10px_rgb(52_120_246/0.5)] focus-visible:border-[#3478f6]/60"
            >
              <span className="font-mono text-label text-accent">{String(i + 1).padStart(2, "0")}</span>
              <CopyText copy={service.name} />
            </Link>
          ))}
        </nav>
      </PageHeader>
      <ServiceCatalog />
      <CoreApproach />
      <CoreVision />
      <EnquiryBand />
    </SiteShell>
  );
}
