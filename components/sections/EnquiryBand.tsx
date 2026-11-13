import { ArrowRight, Mail } from "lucide-react";
import { email, homeCopy, mailtoHref, whatsapp } from "@/lib/content";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { CopyText } from "@/components/ui/CopyText";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { Section } from "@/components/ui/Section";
import { WhatsAppCta } from "@/components/ui/WhatsAppCta";
import { MarkPoster } from "./hero/MarkPoster";
import { FinaleTrails } from "./finale/FinaleTrails";

type EnquiryBandProps = {
  /** Show the "choose a service" route to /contact (hidden on /contact itself). */
  showServicePicker?: boolean;
};

/**
 * Contact finale — the close of every main page.
 *
 * The metallic X returns: an X slot (XStage moves the page's one 3D canvas
 * here and pops the X up as the band arrives) with blue light trails
 * converging on it and on the WhatsApp button (FinaleTrails). Below it, the
 * approved heading and line, then the actions: WhatsApp first, choosing a
 * service and email second. Centred, so the trails arrive from both sides
 * above and beside the copy, never across it.
 * data-hide-float: the floating WhatsApp button steps aside from here down.
 */
export function EnquiryBand({ showServicePicker = true }: EnquiryBandProps) {
  const mail = mailtoHref("Enquiry from the Xentra Technologies website");

  return (
    <Section id="enquire" tone="black" labelledBy="enquire-title" edge className="isolate overflow-x-clip">
      <FinaleTrails />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-[2] bg-[radial-gradient(38%_42%_at_50%_30%,rgb(47_107_255/0.16),transparent_70%),radial-gradient(60%_40%_at_50%_100%,rgb(17_34_80/0.5),transparent_75%)]"
      />
      <div data-hide-float className="relative flex flex-col items-center text-center">
        <div
          data-x-slot="finale"
          data-x-claim="view"
          className="relative aspect-[5/4] w-full max-w-[17rem] sm:max-w-[22rem] lg:max-w-[26rem]"
        >
          <MarkPoster id="finale-mark" />
        </div>

        <div className="mt-8 flex flex-col items-center">
          <Eyebrow reveal>Contact</Eyebrow>
          <h2
            id="enquire-title"
            data-reveal="lines"
            className="mt-6 max-w-3xl text-statement font-semibold tracking-tight text-balance"
          >
            <CopyText copy={homeCopy.enquiryHeading} />
          </h2>
          <p data-reveal className="mt-5 max-w-xl text-lead text-pretty text-fg-muted">
            <CopyText copy={homeCopy.enquiryBody} />
          </p>
        </div>

        <div data-reveal-group className="mt-9 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row">
          <div data-reveal data-finale-cta className="w-full sm:w-auto">
            <WhatsAppCta
              label={whatsapp.ctaContact.text}
              size="lg"
              className="w-full hover:shadow-[0_0_0_3px_rgb(47_107_255/0.18),0_12px_30px_-8px_rgb(47_107_255/0.8)] sm:w-auto"
            />
          </div>
          {showServicePicker ? (
            <div data-reveal className="w-full sm:w-auto">
              <ButtonLink href="/contact" variant="secondary" className="w-full hover:border-blue-400/60 sm:w-auto">
                Choose a service to enquire about
                <ArrowRight aria-hidden size={18} />
              </ButtonLink>
            </div>
          ) : null}
        </div>
        {email && mail ? (
          <a
            data-reveal
            href={mail}
            className="mt-4 inline-flex min-h-11 items-center justify-center gap-3 break-all text-body text-silver-200 transition-colors hover:text-white focus-visible:text-white"
          >
            <Mail aria-hidden size={18} className="shrink-0 text-accent" />
            {email}
          </a>
        ) : null}
      </div>
    </Section>
  );
}
