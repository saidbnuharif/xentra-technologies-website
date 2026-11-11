import Link from "next/link";
import { email, mailtoHref, siteNav, whatsapp, whatsappCtaVisible, type PageKey } from "@/lib/content";
import { Logo } from "@/components/brand/Logo";
import { Container } from "@/components/ui/Container";
import { WhatsAppCta } from "@/components/ui/WhatsAppCta";
import { HeaderScroll } from "./HeaderScroll";
import { MobileNav } from "./MobileNav";

/**
 * Server component. Page links use next/link; the current page is passed in
 * by the page (no client-side pathname hook needed) and marked with
 * aria-current="page". Client pieces: the mobile menu toggle and
 * HeaderScroll (condensed state + scroll-progress hairline).
 *
 * Redesign (H2): the bar stays OPAQUE black on purpose — the logo's
 * baked-in black background must sit on exactly --xt-black, so a
 * translucent "glass" bar would show the logo's square edge over light
 * sections. Depth comes instead from a glowing hairline, a soft shadow and
 * a slimmer bar once the page scrolls (desktop), and a blue progress line.
 */
export function Navbar({ current }: { current: PageKey | null }) {
  const cta = whatsapp.ctaNav.text;
  const hasCta = whatsappCtaVisible();

  return (
    <header
      data-site-header
      className="group/header tone-black fixed inset-x-0 top-0 z-50 transition-shadow duration-500 data-[scrolled=true]:shadow-[0_12px_32px_-14px_rgb(0_0_0/0.9)]"
    >
      <Container className="flex h-nav items-center justify-between gap-6 transition-[height] duration-500 ease-out lg:group-data-[scrolled=true]/header:h-16">
        <Logo
          sizeClass="w-[4.5rem] transition-[width] duration-500 ease-out lg:group-data-[scrolled=true]/header:w-16"
          sizes="72px"
        />

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1 xl:gap-1.5">
            {siteNav.map((item) => (
              <li key={item.key}>
                <Link
                  href={item.href}
                  aria-current={item.key === current ? "page" : undefined}
                  className={[
                    "group/link relative inline-flex min-h-11 items-center rounded-full px-3.5 text-sm text-fg-muted transition-colors duration-300",
                    // Hover: a soft pill of light behind the label.
                    "before:absolute before:inset-x-0 before:inset-y-1.5 before:-z-10 before:rounded-full before:bg-fg/6 before:opacity-0 before:transition-opacity before:duration-300",
                    "hover:text-fg hover:before:opacity-100 focus-visible:text-fg focus-visible:before:opacity-100",
                    // Current page: glowing electric-blue underline that grows from the centre.
                    "after:absolute after:inset-x-3.5 after:bottom-1.5 after:h-0.5 after:scale-x-0 after:rounded-full after:bg-[linear-gradient(90deg,transparent,var(--xt-blue-400),transparent)] after:shadow-[0_0_10px_rgb(47_107_255/0.9)] after:transition-transform after:duration-500 after:ease-out",
                    "aria-[current=page]:text-fg aria-[current=page]:after:scale-x-100",
                  ].join(" ")}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {hasCta ? (
          <div className="hidden lg:block">
            <WhatsAppCta
              label={cta}
              size="md"
              className="relative isolate overflow-hidden hover:shadow-[0_0_0_3px_rgb(47_107_255/0.18),0_10px_28px_-8px_rgb(47_107_255/0.8)] focus-visible:shadow-[0_0_0_3px_rgb(47_107_255/0.18),0_10px_28px_-8px_rgb(47_107_255/0.8)] after:pointer-events-none after:absolute after:inset-y-0 after:-left-1/2 after:w-1/3 after:-skew-x-12 after:bg-[linear-gradient(90deg,transparent,rgb(255_255_255/0.35),transparent)] after:opacity-0 after:transition-[translate,opacity] after:duration-700 after:ease-out hover:after:translate-x-[420%] hover:after:opacity-100"
            />
          </div>
        ) : null}

        <MobileNav
          items={siteNav}
          current={current}
          cta={
            hasCta || email ? (
              <div className="flex flex-col gap-4">
                {hasCta ? <WhatsAppCta label={cta} size="lg" className="w-full" /> : null}
                {email ? (
                  <a href={mailtoHref() ?? undefined} className="inline-flex min-h-11 items-center justify-center text-sm text-fg-muted transition-colors hover:text-fg">
                    {email}
                  </a>
                ) : null}
              </div>
            ) : undefined
          }
        />
      </Container>

      {/* Bottom edge: a hairline that glows blue at its centre. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-[linear-gradient(90deg,rgb(255_255_255/0.05),rgb(90_139_255/0.45)_50%,rgb(255_255_255/0.05))]"
      />
      {/* Scroll progress: fills left → right as the page is read. */}
      <div
        aria-hidden
        style={{ transform: "scaleX(var(--progress, 0))" }}
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left bg-[linear-gradient(90deg,var(--xt-blue-500),var(--xt-blue-300))] shadow-[0_0_8px_rgb(47_107_255/0.8)]"
      />
      <HeaderScroll />
    </header>
  );
}
