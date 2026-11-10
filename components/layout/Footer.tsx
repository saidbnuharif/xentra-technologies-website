import { Mail } from "lucide-react";
import {
  company,
  email,
  navItems,
  serviceCategories,
  showDrafts,
  whatsapp,
  whatsappCtaVisible,
} from "@/lib/content";
import { Logo } from "@/components/brand/Logo";
import { Container } from "@/components/ui/Container";
import { CopyText } from "@/components/ui/CopyText";
import { Placeholder } from "@/components/ui/Placeholder";
import { WhatsAppCta } from "@/components/ui/WhatsAppCta";

function FooterHeading({ children }: { children: string }) {
  return (
    <h2 className="font-mono text-label uppercase tracking-[0.18em] text-fg-muted">
      {children}
    </h2>
  );
}

const linkClass =
  "inline-flex min-h-11 items-center text-body text-silver-200 transition-colors hover:text-white";

/*
 * No copyright year on purpose: `new Date()` during prerender is a build
 * error under cacheComponents. Add a fixed year once confirmed.
 */
export function Footer() {
  return (
    <footer className="tone-black border-t border-line pt-16 pb-10 lg:pt-20">
      {/* Navigate and Services sit side by side from phone widths up. */}
      <Container data-reveal-group className="grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-12 lg:gap-10">
        <div data-reveal className="col-span-2 lg:col-span-4">
          {/* The logo artwork already carries the tagline. */}
          <Logo sizeClass="w-32" sizes="128px" className="-ml-4" />
          <p className="mt-2 max-w-sm text-body text-pretty text-fg-muted">
            <CopyText copy={company.description} />
          </p>
        </div>

        <nav data-reveal aria-label="Footer" className="lg:col-span-2">
          <FooterHeading>Navigate</FooterHeading>
          <ul className="mt-4">
            {navItems.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`} className={linkClass}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div data-reveal className="lg:col-span-3">
          <FooterHeading>Services</FooterHeading>
          <ul className="mt-4">
            {serviceCategories.map((category) => (
              <li key={category.id}>
                <a href="#services" className={linkClass}>
                  <CopyText copy={category.name} />
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Only when there is something to show: a real method, or review mode. */}
        {whatsappCtaVisible() || email || showDrafts ? (
        <div data-reveal className="col-span-2 lg:col-span-3">
          <FooterHeading>Get in touch</FooterHeading>
          <div className="mt-5 flex flex-col items-start gap-4">
            {whatsappCtaVisible() ? (
              <WhatsAppCta label={whatsapp.ctaNav.text} variant="secondary" size="md" />
            ) : null}
            {email ? (
              <a href={`mailto:${email}`} className={`${linkClass} gap-2.5`}>
                <Mail aria-hidden size={18} />
                {email}
              </a>
            ) : null}
            <Placeholder kind="content" label="Location, hours & social profiles" className="w-full">
              Shown once supplied.
            </Placeholder>
          </div>
        </div>
        ) : null}
      </Container>

      <Container className="mt-14 flex flex-col gap-3 border-t border-line pt-8 text-sm text-fg-muted sm:flex-row sm:items-center sm:justify-between">
        <p>© {company.legalName ?? company.name}</p>
        <p className="empty:hidden">
          {company.legalName ? null : (
            <CopyText copy={{ text: "Registered company name pending", status: "draft" }} />
          )}
        </p>
      </Container>
    </footer>
  );
}
