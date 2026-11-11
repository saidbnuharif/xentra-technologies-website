import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDown } from "lucide-react";
import { pageIntro, serviceGroups } from "@/lib/content";
import { CopyText } from "@/components/ui/CopyText";
import { SiteShell } from "@/components/layout/SiteShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { ServiceCatalog } from "@/components/sections/services/ServiceCatalog";
import { EnquiryBand } from "@/components/sections/EnquiryBand";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Xentra Technologies services in two groups: Business Growth & Advisory and Digital Services. Enquire about any service on WhatsApp or by email.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <SiteShell current="services">
      <PageHeader
        eyebrow="Services"
        title={
          <>
            Our <span className="text-accent-gradient">Services</span>
          </>
        }
        intro={pageIntro.services}
      >
        {/* Quick jump to each group. */}
        <nav aria-label="Service groups" className="mt-10 flex flex-wrap gap-3">
          {serviceGroups.map((group, g) => (
            <Link
              key={group.slug}
              href={`#${group.slug}`}
              className="group inline-flex min-h-11 items-center gap-3 rounded-full border border-white/12 bg-white/[0.04] px-4 py-2 text-sm text-silver-100 backdrop-blur-sm transition-[border-color,background-color,box-shadow] duration-300 hover:border-blue-400/50 hover:bg-blue-500/10 hover:shadow-[0_0_20px_-6px_rgb(47_107_255/0.7)] focus-visible:border-blue-400/60"
            >
              <span className="font-mono text-label text-accent">{String(g + 1).padStart(2, "0")}</span>
              <CopyText copy={group.name} />
              <span className="text-fg-muted">· {group.services.length}</span>
              <ArrowDown aria-hidden size={15} className="text-silver-400 transition-transform duration-300 group-hover:translate-y-0.5" />
            </Link>
          ))}
        </nav>
      </PageHeader>
      <ServiceCatalog />
      <EnquiryBand />
    </SiteShell>
  );
}
