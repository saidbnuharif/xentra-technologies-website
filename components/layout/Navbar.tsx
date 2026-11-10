import { navItems, whatsapp, whatsappCtaVisible } from "@/lib/content";
import { Logo } from "@/components/brand/Logo";
import { Container } from "@/components/ui/Container";
import { WhatsAppCta } from "@/components/ui/WhatsAppCta";
import { MobileNav } from "./MobileNav";

/**
 * Server component. Only the mobile menu toggle is a client component; the
 * WhatsApp CTA is rendered here and passed into it as a prop.
 * Desktop navigation starts at lg (1024px): with seven links and a CTA,
 * tablets get the menu instead of a cramped bar.
 */
export function Navbar() {
  const cta = whatsapp.ctaPrimary.text;
  // Only reserve space for the CTA when it will actually render.
  const hasCta = whatsappCtaVisible();

  return (
    // Opaque on purpose: the logo's baked-in black background must sit on
    // exactly --xt-black. A translucent bar would show the logo's square
    // edge whenever light sections scroll underneath.
    <header className="tone-black fixed inset-x-0 top-0 z-50 border-b border-line">
      <Container className="flex h-nav items-center justify-between gap-6">
        <Logo />

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => (
              <li key={item.id}>
                {/* data-nav-link: MotionRoot sets aria-current while the
                    section is in view; the underline grows on hover/active. */}
                <a
                  href={`#${item.id}`}
                  data-nav-link
                  className="relative inline-flex min-h-11 items-center px-2.5 text-sm text-fg-muted transition-colors duration-300 after:absolute after:inset-x-2.5 after:bottom-2.5 after:h-px after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-300 hover:text-fg hover:after:scale-x-100 aria-[current=location]:text-fg aria-[current=location]:after:scale-x-100"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {hasCta ? (
          <div className="hidden lg:block">
            <WhatsAppCta label={cta} size="md" />
          </div>
        ) : null}

        <MobileNav
          items={navItems}
          cta={
            hasCta ? <WhatsAppCta label={cta} size="lg" className="w-full" /> : undefined
          }
        />
      </Container>
    </header>
  );
}
