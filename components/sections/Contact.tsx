import { Mail } from "lucide-react";
import { email, sectionCopy, sectionVisible, whatsapp } from "@/lib/content";
import { CopyText } from "@/components/ui/CopyText";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { Placeholder } from "@/components/ui/Placeholder";
import { Section } from "@/components/ui/Section";
import { WhatsAppCta } from "@/components/ui/WhatsAppCta";

/**
 * Closing call-to-action band. WhatsApp is the primary channel; email is
 * secondary and appears only once supplied. Omitted from production until a
 * real contact method exists.
 */
export function Contact() {
  if (!sectionVisible.contact) return null;

  return (
    <Section id="contact" tone="black" labelledBy="contact-title">
      {/* data-hide-float: the floating WhatsApp button fades out from here on. */}
      <div data-hide-float className="grid gap-12 lg:grid-cols-12 lg:items-end lg:gap-16">
        <div className="lg:col-span-7">
          <Eyebrow reveal>Contact</Eyebrow>
          <h2
            id="contact-title"
            data-reveal="lines"
            className="mt-6 text-statement font-semibold tracking-tight text-balance"
          >
            {whatsapp.ctaPrimary.text}
          </h2>
          <p data-reveal className="mt-6 max-w-xl text-lead text-pretty text-fg-muted empty:hidden">
            <CopyText copy={sectionCopy.contactIntro} />
          </p>
        </div>

        <div data-reveal className="rounded-card border border-line bg-navy-950 p-6 sm:p-8 lg:col-span-5">
          <div className="h-px w-12 bg-accent" aria-hidden />
          <p className="mt-6 font-mono text-label uppercase tracking-[0.16em] text-fg-muted">
            Primary contact
          </p>
          <WhatsAppCta
            label={whatsapp.ctaContact.text}
            className="mt-4 w-full"
          />

          {email ? (
            <a
              href={`mailto:${email}`}
              className="mt-6 inline-flex min-h-11 items-center gap-3 text-body text-fg-muted transition-colors hover:text-fg"
            >
              <Mail aria-hidden size={18} />
              {email}
            </a>
          ) : (
            <Placeholder kind="content" label="Email address (secondary)" className="mt-6">
              Shown once supplied.
            </Placeholder>
          )}
        </div>
      </div>
    </Section>
  );
}
