import type { Metadata } from "next";
import { ArrowUpRight, Mail } from "lucide-react";
import {
  email,
  isVisible,
  mailtoHref,
  nextSteps,
  pageIntro,
  serviceEnquiryMessage,
  serviceList,
  whatsapp,
  whatsappHref,
} from "@/lib/content";
import { WhatsAppIcon } from "@/components/brand/WhatsAppIcon";
import { SiteShell } from "@/components/layout/SiteShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { CopyText } from "@/components/ui/CopyText";
import { Placeholder } from "@/components/ui/Placeholder";
import { Section } from "@/components/ui/Section";
import { EnquiryPicker, type EnquiryOption } from "@/components/sections/contact/EnquiryPicker";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Contact Xentra Technologies. Choose the service you're interested in and start a conversation on WhatsApp, or email xentratechnologies@gmail.com.",
  alternates: { canonical: "/contact" },
};

/** Every option's links are built here on the server (no secrets involved). */
function buildOptions(): EnquiryOption[] {
  const general: EnquiryOption = {
    value: "general",
    label: "General enquiry / not sure yet",
    group: null,
    message: whatsapp.message.text,
    whatsappHref: whatsappHref() ?? "#",
    mailtoHref: mailtoHref("Enquiry from the Xentra Technologies website", whatsapp.message.text),
  };
  const services = serviceList.map<EnquiryOption>((item) => {
    const message = serviceEnquiryMessage(item.name.text);
    return {
      value: item.slug,
      label: item.name.text,
      group: item.group.name.text,
      message,
      whatsappHref: whatsappHref(message) ?? "#",
      mailtoHref: mailtoHref(`Enquiry: ${item.name.text}`, message),
    };
  });
  return [general, ...services];
}

export default function ContactPage() {
  const mail = mailtoHref("Enquiry from the Xentra Technologies website");
  const wa = whatsappHref();

  return (
    <SiteShell current="contact">
      <PageHeader
        eyebrow="Contact Us"
        title={
          <>
            Start a <span className="text-accent-gradient">Conversation</span>
          </>
        }
        intro={pageIntro.contact}
      />

      {/* Redesign (P4): navy band, glass enquiry panel, glowing contact cards. */}
      <Section id="enquiry" tone="navy" labelledBy="enquiry-title" edge className="overflow-x-clip">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(45%_55%_at_30%_40%,rgb(47_107_255/0.14),transparent_70%)]"
        />
        {/* data-hide-float: the floating WhatsApp button would duplicate this page's CTAs. */}
        <div data-hide-float className="relative grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <h2 id="enquiry-title" className="text-h3 font-semibold tracking-tight">
              Send us an enquiry
            </h2>
            <div className="mt-6">
              <EnquiryPicker options={buildOptions()} />
            </div>
          </div>

          <aside aria-labelledby="direct-title" className="lg:col-span-5">
            <h2 id="direct-title" className="text-h3 font-semibold tracking-tight">
              Contact us directly
            </h2>
            <ul className="mt-6 grid gap-4">
              {wa ? (
                <li>
                  <a
                    href={wa}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex min-h-11 items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition-[border-color,box-shadow,background-color] duration-300 hover:border-blue-400/50 hover:bg-blue-500/10 hover:shadow-[0_18px_40px_-20px_rgb(47_107_255/0.7)] focus-visible:border-blue-400/60"
                  >
                    <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-blue-500 text-white shadow-[0_8px_22px_-6px_rgb(47_107_255/0.9)]">
                      <WhatsAppIcon className="size-6" />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-mono text-label uppercase tracking-[0.18em] text-fg-muted">WhatsApp</span>
                      <span className="mt-1 block text-lead font-medium text-fg">{whatsapp.displayNumber}</span>
                    </span>
                    <ArrowUpRight aria-hidden size={18} className="ml-auto shrink-0 text-silver-400 transition-[color,translate] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-blue-300" />
                    <span className="sr-only"> (opens WhatsApp in a new tab)</span>
                  </a>
                </li>
              ) : null}
              {email && mail ? (
                <li>
                  <a
                    href={mail}
                    className="group flex min-h-11 items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition-[border-color,box-shadow,background-color] duration-300 hover:border-blue-400/50 hover:bg-blue-500/10 hover:shadow-[0_18px_40px_-20px_rgb(47_107_255/0.7)] focus-visible:border-blue-400/60"
                  >
                    <span className="grid size-12 shrink-0 place-items-center rounded-xl border border-blue-400/30 bg-blue-500/10 text-blue-300">
                      <Mail aria-hidden size={22} />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-mono text-label uppercase tracking-[0.18em] text-fg-muted">Email</span>
                      <span className="mt-1 block text-lead font-medium text-fg [overflow-wrap:anywhere]">
                        {email.split("@")[0]}@<wbr />
                        {email.split("@")[1]}
                      </span>
                    </span>
                    <ArrowUpRight aria-hidden size={18} className="ml-auto shrink-0 text-silver-400 transition-[color,translate] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-blue-300" />
                  </a>
                </li>
              ) : null}
            </ul>
            <Placeholder kind="content" label="Location, business hours & social profiles" className="mt-6">
              Shown once supplied by Xentra.
            </Placeholder>

            {/* What happens next (draft until approved). */}
            {nextSteps.some((s) => isVisible(s.title)) ? (
              <div className="mt-10">
                <h2 className="font-mono text-label uppercase tracking-[0.18em] text-accent">What happens next</h2>
                <ol className="relative mt-5 grid gap-5 before:absolute before:bottom-4 before:left-[1.125rem] before:top-4 before:w-px before:bg-[linear-gradient(to_bottom,var(--xt-blue-500),transparent)]">
                  {nextSteps.map((step, i) => (
                    <li key={i} className="relative grid grid-cols-[2.25rem_1fr] gap-4">
                      <span aria-hidden className="relative grid size-9 place-items-center rounded-full border border-blue-400/40 bg-navy-900 font-mono text-label text-blue-300 shadow-[0_0_14px_-4px_rgb(47_107_255/0.8)]">
                        {i + 1}
                      </span>
                      <div className="pt-1.5">
                        <h3 className="font-semibold tracking-tight">
                          <CopyText copy={step.title} />
                        </h3>
                        <p className="mt-1 text-body text-pretty text-fg-muted">
                          <CopyText copy={step.body} />
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            ) : null}
          </aside>
        </div>
      </Section>
    </SiteShell>
  );
}
