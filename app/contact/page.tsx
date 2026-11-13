import type { Metadata } from "next";
import { ArrowUpRight, Mail } from "lucide-react";
import {
  email,
  mailtoHref,
  serviceEnquiryMessage,
  serviceList,
  whatsapp,
  whatsappHref,
} from "@/lib/content";
import { WhatsAppIcon } from "@/components/brand/WhatsAppIcon";
import { SiteShell } from "@/components/layout/SiteShell";
import { ContactOpening } from "@/components/sections/contact/ContactOpening";
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
      {/* Opening: the finale — the 3D X, converging light, WhatsApp first. */}
      <ContactOpening />

      {/* Light band: choose a service (prefilled WhatsApp/email), or direct links. */}
      <Section id="enquiry" tone="light" labelledBy="enquiry-title" edge className="overflow-x-clip">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(45%_55%_at_30%_40%,rgb(52_120_246/0.06),transparent_70%)]"
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
                    className="group flex min-h-11 items-center gap-4 rounded-2xl border border-[#e9eef5] bg-white p-5 shadow-[0_14px_30px_-22px_rgb(16_24_40/0.3)] transition-[border-color,box-shadow,background-color] duration-300 hover:border-[#3478f6]/45 hover:shadow-[0_18px_40px_-20px_rgb(52_120_246/0.45)] focus-visible:border-[#3478f6]/60"
                  >
                    <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-[linear-gradient(145deg,#4f8dfa,#2563eb)] text-white shadow-[0_8px_20px_-8px_rgb(52_120_246/0.6)]">
                      <WhatsAppIcon className="size-6" />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-mono text-label uppercase tracking-[0.18em] text-fg-muted">WhatsApp</span>
                      <span className="mt-1 block text-lead font-medium text-fg">{whatsapp.displayNumber}</span>
                    </span>
                    <ArrowUpRight aria-hidden size={18} className="ml-auto shrink-0 text-[#8995a5] transition-[color,translate] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#2563eb]" />
                    <span className="sr-only"> (opens WhatsApp in a new tab)</span>
                  </a>
                </li>
              ) : null}
              {email && mail ? (
                <li>
                  <a
                    href={mail}
                    className="group flex min-h-11 items-center gap-4 rounded-2xl border border-[#e9eef5] bg-white p-5 shadow-[0_14px_30px_-22px_rgb(16_24_40/0.3)] transition-[border-color,box-shadow,background-color] duration-300 hover:border-[#3478f6]/45 hover:shadow-[0_18px_40px_-20px_rgb(52_120_246/0.45)] focus-visible:border-[#3478f6]/60"
                  >
                    <span className="grid size-12 shrink-0 place-items-center rounded-xl border border-[#e9eef5] bg-[#eef1f5] text-[#2563eb]">
                      <Mail aria-hidden size={22} />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-mono text-label uppercase tracking-[0.18em] text-fg-muted">Email</span>
                      <span className="mt-1 block text-lead font-medium text-fg [overflow-wrap:anywhere]">
                        {email.split("@")[0]}@<wbr />
                        {email.split("@")[1]}
                      </span>
                    </span>
                    <ArrowUpRight aria-hidden size={18} className="ml-auto shrink-0 text-[#8995a5] transition-[color,translate] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#2563eb]" />
                  </a>
                </li>
              ) : null}
            </ul>
          </aside>
        </div>
      </Section>
    </SiteShell>
  );
}
