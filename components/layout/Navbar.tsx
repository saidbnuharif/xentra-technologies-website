import { email, mailtoHref, siteNav, type PageKey } from "@/lib/content";
import { HeaderScroll } from "./HeaderScroll";
import { MobileNav } from "./MobileNav";
import { NavLinks } from "./NavLinks";

/**
 * Site navigation — a minimal floating pill, centred at the top of the
 * screen. No logo and no WhatsApp button in the bar (the owner's choice,
 * 13 Nov 2026; the floating WhatsApp button stays site-wide).
 *
 * Two states (HeaderScroll sets data-past-hero on the header):
 *  - over the page's opening section: transparent — no container, just
 *    the links, readable over the light hero;
 *  - past it: white frosted glass, platinum border, soft shadow, blur.
 * The change is a smooth CSS transition; scrolling back restores it.
 *
 * Desktop: the five links with the gliding blue indicator (NavLinks).
 * Phones and tablets: a compact centred "Menu" pill opening the dropdown
 * (MobileNav). The header itself is click-through; only the pill takes
 * the pointer. A thin progress line runs along the top edge.
 */
export function Navbar({ current }: { current: PageKey | null }) {
  return (
    <header data-site-header className="group/header pointer-events-none fixed inset-x-0 top-0 z-50">
      <div className="flex h-nav items-center justify-center px-gutter">
        <nav aria-label="Primary" className="pointer-events-auto hidden lg:block">
          <NavLinks items={siteNav} current={current} />
        </nav>
        <div className="pointer-events-auto lg:hidden">
          <MobileNav
            items={siteNav}
            current={current}
            cta={
              email ? (
                <a
                  href={mailtoHref() ?? undefined}
                  className="inline-flex min-h-11 w-full items-center justify-center text-sm text-fg-muted transition-colors hover:text-fg"
                >
                  {email}
                </a>
              ) : undefined
            }
          />
        </div>
      </div>

      {/* Scroll progress: a hairline along the top edge, filling left → right. */}
      <div
        aria-hidden
        style={{ transform: "scaleX(var(--progress, 0))" }}
        className="pointer-events-none absolute inset-x-0 top-0 h-0.5 origin-left bg-[linear-gradient(90deg,#3478f6,#4f8dfa)] opacity-0 transition-opacity duration-500 group-data-[past-hero=true]/header:opacity-80"
      />
      <HeaderScroll />
    </header>
  );
}
