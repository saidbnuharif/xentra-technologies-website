import { Mail } from "lucide-react";
import { email, mailtoHref, pageIntro, whatsapp } from "@/lib/content";
import { CopyText } from "@/components/ui/CopyText";
import { WhatsAppCta } from "@/components/ui/WhatsAppCta";
import { MarkPoster } from "../hero/MarkPoster";
import { FinaleTrails } from "../finale/FinaleTrails";

/*
 * Contact page opening — the site's finale as the first screen.
 *
 * The metallic 3D X in its universe (the page's one canvas, XStage: this
 * slot claims "start"), blue light trails sweeping in from both sides on
 * load and converging on the X and on the WhatsApp button (FinaleTrails,
 * play="load"), then the heading, the approved intro line and the
 * actions: WhatsApp first (the site's standard general message, unchanged),
 * email second. Scrolling on, the X dissolves into light as in the hero.
 *
 * Layers as in the Home hero: the section is not a stacking context, so
 * the trails (no z-index) and the canvas sit between its background and
 * its text (z-[2]); nothing covers the copy or the buttons.
 */
export function ContactOpening() {
  const mail = mailtoHref("Enquiry from the Xentra Technologies website");

  return (
    <section
      id="contact-intro"
      aria-labelledby="contact-title"
      className="tone-black relative flex min-h-[88svh] flex-col overflow-hidden pb-12 pt-[calc(var(--xt-nav-height)+1.5rem)]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent_75%,var(--surface)),radial-gradient(44%_42%_at_50%_34%,rgb(23_52_130/0.45),transparent_72%),radial-gradient(90%_60%_at_50%_40%,rgb(8_16_40/0.9),transparent_100%)]"
      />
      <FinaleTrails play="load" layer="base" />

      <div data-hide-float className="relative z-[2] flex flex-1 flex-col items-center px-gutter text-center">
        <div
          data-x-slot="contact"
          data-x-claim="start"
          className="relative aspect-[5/4] w-[min(72vw,28rem,calc((88svh-var(--xt-nav-height)-19rem)*1.25))] min-w-[13rem]"
        >
          <MarkPoster id="contact-mark" />
        </div>

        <p className="mt-6 font-mono text-label font-medium tracking-[0.32em] text-accent uppercase">Contact Us</p>
        <h1
          id="contact-title"
          className="mt-3 text-[clamp(2rem,1.3rem+2.4vw,3.5rem)] font-semibold leading-[1.05] tracking-tight text-balance"
        >
          <span className="bg-[linear-gradient(180deg,#ffffff_25%,#c3ccd8_100%)] bg-clip-text text-transparent">Start a </span>
          <span className="text-accent-gradient">Conversation</span>
        </h1>
        {pageIntro.contact ? (
          <p className="mt-4 max-w-xl text-lead text-pretty text-fg-muted">
            <CopyText copy={pageIntro.contact} />
          </p>
        ) : null}

        <div className="mt-8 flex w-full flex-col items-center gap-4 sm:w-auto sm:flex-row">
          <div data-finale-cta className="w-full sm:w-auto">
            <WhatsAppCta
              label={whatsapp.ctaContact.text}
              size="lg"
              className="w-full shadow-[0_12px_34px_-10px_rgb(47_107_255/0.85)] hover:shadow-[0_0_0_4px_rgb(47_107_255/0.18),0_14px_36px_-8px_rgb(47_107_255/0.9)] sm:w-auto"
            />
          </div>
          {email && mail ? (
            <a
              href={mail}
              className="inline-flex min-h-11 items-center gap-2.5 break-all text-body text-silver-200 transition-colors hover:text-white focus-visible:text-white"
            >
              <Mail aria-hidden size={18} className="shrink-0 text-accent" />
              {email}
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
