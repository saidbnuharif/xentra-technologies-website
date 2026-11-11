import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { homeCopy, serviceGroups } from "@/lib/content";
import { CopyText } from "@/components/ui/CopyText";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

/**
 * Home: concise overview of the two service groups and their eight services.
 * Each service links straight to its entry on /services (with its own
 * enquiry button); each group links to its section there.
 */
export function ServicesOverview() {
  return (
    <Section id="services-overview" tone="navy" labelledBy="services-overview-title">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading
          id="services-overview-title"
          eyebrow="Services"
          title="Our Services"
          intro={homeCopy.servicesIntro}
        />
        <Link
          href="/services"
          className="group inline-flex min-h-11 shrink-0 items-center gap-2 font-medium text-accent"
        >
          View all services
          <ArrowRight
            aria-hidden
            size={18}
            className="transition-transform group-hover:translate-x-1 group-focus-visible:translate-x-1"
          />
        </Link>
      </div>

      <div data-reveal-group className="mt-12 grid gap-6 lg:mt-16 lg:grid-cols-12">
        {serviceGroups.map((group, g) => (
          <article
            key={group.slug}
            data-reveal
            aria-labelledby={`overview-${group.slug}`}
            className={`rounded-[1.25rem] border border-line bg-navy-900/60 p-6 sm:p-8 ${g === 0 ? "lg:col-span-7" : "lg:col-span-5"}`}
          >
            <p className="font-mono text-label uppercase tracking-[0.18em] text-accent">
              {String(g + 1).padStart(2, "0")} · {group.services.length} services
            </p>
            <h3 id={`overview-${group.slug}`} className="mt-4 text-h3 font-semibold tracking-tight">
              <Link href={`/services#${group.slug}`} className="transition-colors hover:text-blue-300 focus-visible:text-blue-300">
                <CopyText copy={group.name} />
              </Link>
            </h3>
            <ul className={`mt-6 grid gap-x-6 ${g === 0 ? "sm:grid-cols-2" : ""}`}>
              {group.services.map((service) => (
                <li key={service.slug} className="border-t border-line">
                  <Link
                    href={`/services#${service.slug}`}
                    className="group/svc flex min-h-12 items-center justify-between gap-3 py-2 text-body text-silver-100 transition-colors hover:text-white focus-visible:text-white"
                  >
                    <CopyText copy={service.name} />
                    <ArrowUpRight
                      aria-hidden
                      size={16}
                      className="shrink-0 text-silver-500 transition-[color,translate] duration-300 group-hover/svc:-translate-y-0.5 group-hover/svc:translate-x-0.5 group-hover/svc:text-blue-300 group-focus-visible/svc:text-blue-300"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </Section>
  );
}
