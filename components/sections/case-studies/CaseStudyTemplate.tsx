import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { isVisible, serviceEnquiryMessage, type CaseStudy, type Copy } from "@/lib/content";
import { CopyText } from "@/components/ui/CopyText";
import { Section } from "@/components/ui/Section";
import { WhatsAppCta } from "@/components/ui/WhatsAppCta";

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div data-reveal className="border-t border-line py-8 first:border-t-0 first:pt-0 sm:grid sm:grid-cols-[14rem_1fr] sm:gap-10">
      <h2 className="flex items-center gap-2.5 font-mono text-label uppercase tracking-[0.18em] text-accent">
        <span aria-hidden className="size-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgb(47_107_255/0.8)]" />
        {title}
      </h2>
      <div className="mt-4 text-body text-pretty text-fg sm:mt-0">{children}</div>
    </div>
  );
}

function CopyList({ items }: { items: readonly Copy[] }) {
  return (
    <ul className="space-y-2.5">
      {items.filter(isVisible).map((item, i) => (
        <li key={i} className="flex gap-3">
          <span aria-hidden className="mt-[0.7em] h-px w-4 shrink-0 bg-accent" />
          <span>
            <CopyText copy={item} />
          </span>
        </li>
      ))}
    </ul>
  );
}

/**
 * Reusable case study layout. Renders only the fields that are filled and
 * approved: verified outcomes are omitted entirely when there are none, as are
 * images, technologies and the project link.
 */
export function CaseStudyTemplate({ study }: { study: CaseStudy }) {
  const outcomes = study.outcomes.filter(isVisible);

  return (
    <Section id="case-study" tone="white" labelledBy="case-study-overview" edge>
      <h2 id="case-study-overview" className="sr-only">
        Case study details
      </h2>
      {/* Redesign (P5): the study reads as one glass document on the white band. */}
      <div
        data-reveal-group
        className="rounded-[1.5rem] border border-blue-500/12 bg-white/90 p-6 shadow-[0_30px_70px_-36px_rgb(31_86_224/0.4),inset_0_1px_0_white] sm:p-10 lg:p-14"
      >
        <Block title="Client">
          <p>
            <CopyText copy={study.client} />
          </p>
        </Block>
        <Block title="Industry">
          <p>
            <CopyText copy={study.industry} />
          </p>
        </Block>
        <Block title="The challenge">
          <p className="max-w-2xl">
            <CopyText copy={study.challenge} />
          </p>
        </Block>
        <Block title="Objectives">
          <CopyList items={study.objectives} />
        </Block>
        <Block title="Work delivered">
          <CopyList items={study.workDelivered} />
        </Block>
        {study.services.length > 0 ? (
          <Block title="Services involved">
            <ul className="flex flex-wrap gap-2">
              {study.services.map((s) => (
                <li key={s} className="rounded-full border border-line px-3 py-1 text-sm text-fg-muted">
                  {s}
                </li>
              ))}
            </ul>
          </Block>
        ) : null}
        {study.technologies.length > 0 ? (
          <Block title="Technologies used">
            <ul className="flex flex-wrap gap-2">
              {study.technologies.map((t) => (
                <li key={t} className="rounded-full bg-paper px-3 py-1 font-mono text-sm text-fg-muted">
                  {t}
                </li>
              ))}
            </ul>
          </Block>
        ) : null}
        {outcomes.length > 0 ? (
          <Block title="Verified outcomes">
            <CopyList items={outcomes} />
          </Block>
        ) : null}
        {study.images.length > 0 ? (
          <div data-reveal className="grid gap-6 border-t border-line py-8 sm:grid-cols-2">
            {study.images.map((image) => (
              <figure key={image.src} className="relative aspect-[16/10] overflow-hidden rounded-card bg-paper">
                <Image src={image.src} alt={image.alt} fill sizes="(min-width: 640px) 50vw, 100vw" className="object-cover" />
              </figure>
            ))}
          </div>
        ) : null}
        <div data-reveal className="flex flex-col gap-3 border-t border-line pt-8 sm:flex-row sm:items-center">
          {study.link ? (
            <a
              href={study.link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 font-medium text-accent"
            >
              {study.link.label}
              <ArrowUpRight aria-hidden size={18} />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          ) : null}
          {study.services[0] ? (
            <WhatsAppCta
              label="Enquire about a similar project"
              message={serviceEnquiryMessage(study.services[0])}
              size="md"
              className="sm:ml-auto"
            />
          ) : null}
        </div>
      </div>
    </Section>
  );
}
