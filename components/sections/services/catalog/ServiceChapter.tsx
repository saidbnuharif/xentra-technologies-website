import { ArrowUpRight, Mail } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { mailtoHref, serviceEnquiryMessage, type CoreService } from "@/lib/content";
import { CopyText } from "@/components/ui/CopyText";
import { WhatsAppCta } from "@/components/ui/WhatsAppCta";

const pad = (n: number) => String(n).padStart(2, "0");

/*
 * One core service as a borderless chapter: index line, title, the five
 * approved points as hairline rows with glowing markers, and the WhatsApp
 * / email enquiry (unchanged links and messages). Keeps the stable #slug
 * anchor (and older aliases) used by other pages and the X transition.
 * Phones and tablets show the service's glass icon tile here; desktop
 * shows it in the lens.
 */
export function ServiceChapter({ service, index, total, Icon }: { service: CoreService; index: number; total: number; Icon: LucideIcon }) {
  const message = serviceEnquiryMessage(service.name.text);
  const mail = mailtoHref(`Enquiry: ${service.name.text}`, message);
  const titleId = `sc-${service.slug}`;

  return (
    <li id={service.slug} data-sc-chapter={index} className="sc-chapter relative scroll-mt-[calc(var(--xt-nav-height)+1.5rem)]">
      {/* Older anchors land on the same chapter (links from other pages). */}
      {service.aliases?.map((alias) => (
        <span key={alias} id={alias} aria-hidden className="absolute top-0 scroll-mt-[calc(var(--xt-nav-height)+1.5rem)]" />
      ))}
      <article aria-labelledby={titleId}>
        <div data-sc-reveal className="flex items-center gap-4">
          <span aria-hidden className="sc-chapter-icon">
            <Icon size={22} strokeWidth={1.75} />
          </span>
          <p className="sc-index font-mono text-label font-medium tracking-[0.3em] uppercase">
            Service <span className="sc-index-num">{pad(index + 1)}</span> <span className="text-[#8995a5]">/ {pad(total)}</span>
          </p>
          <span aria-hidden className="sc-index-line h-px flex-1" />
        </div>

        <h3 id={titleId} data-sc-reveal className="sc-title mt-5 text-[clamp(1.75rem,1.15rem+1.7vw,2.6rem)] leading-[1.1] font-semibold tracking-tight text-balance">
          <CopyText copy={service.name} />
        </h3>

        <ul data-sc-reveal className="sc-points mt-8">
          {service.points.map((point) => (
            <li key={point.text} className="sc-point">
              <span aria-hidden className="sc-marker" />
              <span>
                <CopyText copy={point} />
              </span>
            </li>
          ))}
        </ul>

        <div data-sc-reveal className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
          <WhatsAppCta
            label="Enquire on WhatsApp"
            message={message}
            accessibleContext={service.name.text}
            size="md"
            className="shadow-[0_10px_24px_-12px_rgb(52_120_246/0.7)] hover:shadow-[0_0_0_3px_rgb(52_120_246/0.18),0_12px_28px_-10px_rgb(52_120_246/0.8)]"
          />
          {mail ? (
            <a href={mail} className="sc-mail group/mail inline-flex min-h-11 items-center gap-2 text-sm font-medium text-[#626d7e] transition-colors hover:text-[#14233b] focus-visible:text-[#14233b]">
              <Mail aria-hidden size={16} />
              Enquire by email
              <ArrowUpRight aria-hidden size={15} className="transition-transform duration-300 group-hover/mail:-translate-y-0.5 group-hover/mail:translate-x-0.5" />
              <span className="sr-only">about {service.name.text}</span>
            </a>
          ) : null}
        </div>
      </article>
    </li>
  );
}
