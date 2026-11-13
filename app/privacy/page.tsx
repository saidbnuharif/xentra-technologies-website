import type { Metadata } from "next";
import { company, email, mailtoHref, whatsapp } from "@/lib/content";
import { SiteShell } from "@/components/layout/SiteShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How the Xentra Technologies website handles personal information.",
  // Not legally reviewed yet: kept out of search indexes until it has been.
  robots: { index: false, follow: false },
  alternates: { canonical: "/privacy" },
};

/*
 * Every statement about the website below reflects the current
 * implementation (checked in the codebase): no forms, no cookies or local
 * storage, no analytics, fonts bundled at build time, enquiries handed off
 * to WhatsApp or the visitor's own email app. Update this page whenever any
 * of that changes (e.g. adding analytics or a form). Not legally reviewed.
 */
export default function PrivacyPage() {
  const mail = mailtoHref("Privacy enquiry");

  return (
    <SiteShell current={null}>
      <PageHeader eyebrow="Legal" title="Privacy Policy" />

      <Section id="policy" tone="white" labelledBy="policy-title" edge>
        <h2 id="policy-title" className="sr-only">
          Policy details
        </h2>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        {/* Contents (desktop: sticky beside the policy). */}
        <nav aria-label="Policy contents" className="lg:col-span-4">
          <div className="rounded-2xl border border-blue-500/12 bg-white/85 p-6 shadow-[0_18px_40px_-26px_rgb(31_86_224/0.35)] lg:sticky lg:top-[calc(var(--xt-nav-height)+2rem)]">
            <p className="font-mono text-label uppercase tracking-[0.18em] text-accent">Contents</p>
            <ol className="mt-4 space-y-1">
              <li>
                <a href="#who-we-are" className="group flex min-h-10 items-center gap-3 text-sm text-fg-muted transition-colors hover:text-fg focus-visible:text-fg">
                  <span className="font-mono text-label text-accent">01</span>
                  Who we are
                </a>
              </li>
              <li>
                <a href="#information-this-website-collects" className="group flex min-h-10 items-center gap-3 text-sm text-fg-muted transition-colors hover:text-fg focus-visible:text-fg">
                  <span className="font-mono text-label text-accent">02</span>
                  Information this website collects
                </a>
              </li>
              <li>
                <a href="#when-you-contact-us" className="group flex min-h-10 items-center gap-3 text-sm text-fg-muted transition-colors hover:text-fg focus-visible:text-fg">
                  <span className="font-mono text-label text-accent">03</span>
                  When you contact us
                </a>
              </li>
              <li>
                <a href="#website-hosting" className="group flex min-h-10 items-center gap-3 text-sm text-fg-muted transition-colors hover:text-fg focus-visible:text-fg">
                  <span className="font-mono text-label text-accent">04</span>
                  Website hosting
                </a>
              </li>
              <li>
                <a href="#links-to-other-services" className="group flex min-h-10 items-center gap-3 text-sm text-fg-muted transition-colors hover:text-fg focus-visible:text-fg">
                  <span className="font-mono text-label text-accent">05</span>
                  Links to other services
                </a>
              </li>
              <li>
                <a href="#your-choices-and-rights" className="group flex min-h-10 items-center gap-3 text-sm text-fg-muted transition-colors hover:text-fg focus-visible:text-fg">
                  <span className="font-mono text-label text-accent">06</span>
                  Your choices and rights
                </a>
              </li>
              <li>
                <a href="#changes-to-this-policy" className="group flex min-h-10 items-center gap-3 text-sm text-fg-muted transition-colors hover:text-fg focus-visible:text-fg">
                  <span className="font-mono text-label text-accent">07</span>
                  Changes to this policy
                </a>
              </li>
            </ol>
          </div>
        </nav>
        <div className="max-w-3xl space-y-12 lg:col-span-8 text-body text-pretty text-fg [&_h3]:text-h3 [&_h3]:font-semibold [&_h3]:tracking-tight [&_li]:ml-5 [&_li]:list-disc [&_p]:mt-3 [&_ul]:mt-3 [&_ul]:space-y-2">
          <section id="who-we-are" aria-labelledby="who-we-are-title" className="scroll-mt-[calc(var(--xt-nav-height)+2rem)]">
            <h3 id="who-we-are-title">Who we are</h3>
            <p>
              This website is operated by {company.name}. For any question about this policy or your
              information, contact us at{" "}
              {mail ? (
                <a href={mail} className="font-medium text-accent underline-offset-4 hover:underline">
                  {email}
                </a>
              ) : null}
              .
            </p>
          </section>

          <section id="information-this-website-collects" aria-labelledby="information-this-website-collects-title" className="scroll-mt-[calc(var(--xt-nav-height)+2rem)]">
            <h3 id="information-this-website-collects-title">Information this website collects</h3>
            <p>Browsing this website does not require you to give us any personal information. The website:</p>
            <ul>
              <li>has no forms, accounts or sign-in;</li>
              <li>does not set cookies and does not store information in your browser;</li>
              <li>does not use analytics, advertising or tracking tools;</li>
              <li>serves its fonts from the website itself, so no request is made to a font provider while you browse.</li>
            </ul>
          </section>

          <section id="when-you-contact-us" aria-labelledby="when-you-contact-us-title" className="scroll-mt-[calc(var(--xt-nav-height)+2rem)]">
            <h3 id="when-you-contact-us-title">When you contact us</h3>
            <p>
              <strong>WhatsApp.</strong> Our &ldquo;WhatsApp&rdquo; buttons open WhatsApp with a suggested message
              addressed to our business number ({whatsapp.displayNumber}). Nothing is sent until you choose to send
              it in WhatsApp, and you can edit the message first. If you send it, we receive what WhatsApp shares
              with us — typically your phone number, your WhatsApp profile name and your message. WhatsApp is
              operated by WhatsApp LLC / Meta, and your use of it is governed by WhatsApp&rsquo;s own terms and
              privacy policy.
            </p>
            <p>
              <strong>Email.</strong> Our email links open your own email app with our address filled in. If you send
              an email, we receive your email address and whatever you include in the message.
            </p>
          </section>

          <section id="website-hosting" aria-labelledby="website-hosting-title" className="scroll-mt-[calc(var(--xt-nav-height)+2rem)]">
            <h3 id="website-hosting-title">Website hosting</h3>
            <p>
              Like most websites, the service that hosts this site may automatically record technical information
              about requests made to it — such as IP address, browser type and the page requested — to operate and
              secure the service.
            </p>
          </section>

          <section id="links-to-other-services" aria-labelledby="links-to-other-services-title" className="scroll-mt-[calc(var(--xt-nav-height)+2rem)]">
            <h3 id="links-to-other-services-title">Links to other services</h3>
            <p>
              This website links to WhatsApp and may link to other websites. Their handling of your information is
              governed by their own policies, not this one.
            </p>
          </section>

          <section id="your-choices-and-rights" aria-labelledby="your-choices-and-rights-title" className="scroll-mt-[calc(var(--xt-nav-height)+2rem)]">
            <h3 id="your-choices-and-rights-title">Your choices and rights</h3>
            <p>
              You can ask us about the information we hold from your enquiries, or ask us to correct or delete it,
              by contacting us at the email address above.
            </p>
          </section>

          <section id="changes-to-this-policy" aria-labelledby="changes-to-this-policy-title" className="scroll-mt-[calc(var(--xt-nav-height)+2rem)]">
            <h3 id="changes-to-this-policy-title">Changes to this policy</h3>
            <p>
              We will update this page if the website changes how it handles information — for example, if a contact
              form or analytics is added.
            </p>
            <p className="text-sm text-fg-muted">Last updated: 11 November 2026.</p>
          </section>
        </div>
        </div>
      </Section>
    </SiteShell>
  );
}
