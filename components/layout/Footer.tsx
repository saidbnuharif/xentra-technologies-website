import Link from "next/link";
import { Mail } from "lucide-react";
import {
  company,
  email,
  mailtoHref,
  sectionVisible,
  serviceGroups,
  siteNav,
  whatsapp,
  whatsappCtaVisible,
} from "@/lib/content";
import { Logo } from "@/components/brand/Logo";
import { Container } from "@/components/ui/Container";
import { CopyText } from "@/components/ui/CopyText";
import { Placeholder } from "@/components/ui/Placeholder";
import { WhatsAppCta } from "@/components/ui/WhatsAppCta";
import { BackToTop } from "./BackToTop";

function FooterHeading({ children }: { children: string }) {
  return (
    <h2 className="flex items-center gap-2.5 font-mono text-label uppercase tracking-[0.18em] text-fg-muted">
      <span aria-hidden className="size-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgb(47_107_255/0.9)]" />
      {children}
    </h2>
  );
}

// Underline slides in on hover/focus, matching the navbar links.
const linkClass =
  "relative inline-flex min-h-11 items-center text-body text-silver-200 transition-colors after:absolute after:inset-x-0 after:bottom-2.5 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 hover:text-white hover:after:scale-x-100 focus-visible:after:scale-x-100";

/*
 * No copyright year on purpose: `new Date()` during prerender is a build
 * error under cacheComponents. Add a fixed year once confirmed.
 */
export function Footer() {
  const mail = mailtoHref("Enquiry from the Xentra Technologies website");

  return (
    // Redesign (H7): stays on --xt-black (the logo artwork needs it), with a
    // glowing top hairline, faint grid and blue horizon light behind.
    <footer className="tone-black relative isolate overflow-hidden pt-16 pb-10 lg:pt-20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgb(90_139_255/0.55)_50%,transparent)] shadow-[0_0_12px_rgb(47_107_255/0.6)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(rgb(255_255_255/0.025)_1px,transparent_1px),linear-gradient(90deg,rgb(255_255_255/0.025)_1px,transparent_1px)] bg-size-[56px_56px] [mask-image:linear-gradient(to_bottom,transparent,black_35%,black_70%,transparent)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-2/3 bg-[radial-gradient(60%_80%_at_50%_100%,rgb(47_107_255/0.14),transparent_70%)]"
      />
      {/* Navigate and Services sit side by side from phone widths up. */}
      <Container data-reveal-group className="grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-12 lg:gap-10">
        <div data-reveal className="col-span-2 lg:col-span-3">
          {/* The logo artwork already carries the tagline. */}
          <Logo sizeClass="w-32" sizes="128px" className="-ml-4" />
          <p className="mt-2 max-w-sm text-body text-pretty text-fg-muted">
            <CopyText copy={company.description} />
          </p>
        </div>

        <nav data-reveal aria-label="Footer" className="lg:col-span-2">
          <FooterHeading>Navigate</FooterHeading>
          <ul className="mt-4">
            {siteNav.map((item) => (
              <li key={item.key}>
                <Link href={item.href} className={linkClass}>
                  {item.label}
                </Link>
              </li>
            ))}
            {sectionVisible.caseStudies ? (
              <li>
                <Link href="/case-studies" className={linkClass}>
                  Case Studies
                </Link>
              </li>
            ) : null}
          </ul>
        </nav>

        <div data-reveal className="lg:col-span-3">
          <FooterHeading>Services</FooterHeading>
          <ul className="mt-4">
            {serviceGroups.map((group) => (
              <li key={group.slug}>
                <Link href={`/services#${group.slug}`} className={linkClass}>
                  <CopyText copy={group.name} />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div data-reveal className="col-span-2 lg:col-span-4 lg:pl-4">
          <FooterHeading>Get in touch</FooterHeading>
          <div className="mt-5 flex flex-col items-start gap-3">
            {whatsappCtaVisible() ? (
              <WhatsAppCta label={whatsapp.ctaNav.text} variant="secondary" size="md" className="hover:border-blue-400/60 hover:shadow-[0_0_20px_-6px_rgb(47_107_255/0.6)]" />
            ) : null}
            {email && mail ? (
              <a href={mail} className={`${linkClass} max-w-full gap-2.5`}>
                <Mail aria-hidden size={18} className="shrink-0 text-accent" />
                {/* If it must wrap, break after the @ — never mid-word. */}
                <span className="min-w-0 [overflow-wrap:anywhere]">
                  {email.split("@")[0]}@<wbr />
                  {email.split("@")[1]}
                </span>
              </a>
            ) : null}
            <Placeholder kind="content" label="Location, hours & social profiles" className="w-full">
              Shown once supplied.
            </Placeholder>
          </div>
        </div>
      </Container>

      <Container className="mt-14 flex flex-col gap-3 border-t border-line pt-6 text-sm text-fg-muted sm:flex-row sm:items-center sm:justify-between">
        <p>© {company.legalName ?? company.name}</p>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <Link href="/privacy" className={`${linkClass} text-sm`}>
            Privacy Policy
          </Link>
          {company.legalName ? null : (
            <span className="empty:hidden">
              <CopyText copy={{ text: "Registered company name pending", status: "draft" }} />
            </span>
          )}
          <BackToTop />
        </div>
      </Container>
    </footer>
  );
}
