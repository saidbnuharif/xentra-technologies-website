import type { Metadata } from "next";
import Link from "next/link";
import { coreServices, coreServicesIntro } from "@/lib/content";
import { CopyText } from "@/components/ui/CopyText";
import { SiteShell } from "@/components/layout/SiteShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { CoreApproach, CoreVision, ServiceCatalog } from "@/components/sections/services/ServiceCatalog";
import { EnquiryBand } from "@/components/sections/EnquiryBand";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Xentra Technologies' 8 core services: business development, market research and expansion, strategic partnerships, digital marketing, branding, websites, CRM and automation, and growth advisory.",
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
              className="inline-flex min-h-11 items-center gap-2.5 rounded-full border border-white/12 bg-white/[0.04] px-4 py-2 text-sm text-silver-100 backdrop-blur-sm transition-[border-color,background-color,box-shadow] duration-300 hover:border-blue-400/50 hover:bg-blue-500/10 hover:shadow-[0_0_20px_-6px_rgb(47_107_255/0.7)] focus-visible:border-blue-400/60"
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
