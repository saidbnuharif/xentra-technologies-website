import { email, mailtoHref, siteNav, whatsapp, whatsappCtaVisible, type PageKey } from "@/lib/content";
import { Logo } from "@/components/brand/Logo";
import { Container } from "@/components/ui/Container";
import { WhatsAppCta } from "@/components/ui/WhatsAppCta";
import { HeaderScroll } from "./HeaderScroll";
import { MobileNav } from "./MobileNav";
import { NavLinks } from "./NavLinks";

/**
 * Site navigation — a glass bar in the visual language of the Services
 * glass panels: midnight-navy frosted glass with a thin blue-violet edge,
 * fixed to the top; it firms up (more opaque, soft shadow, slimmer on
 * desktop) once the page scrolls (HeaderScroll sets data-scrolled).
 *
 * The official logo keeps its solid black: it sits, unaltered and uncropped,
 * in a black capsule (padding wider than the corner radius), so it is on
 * true black even though the bar around it is translucent.
 *
 * Desktop: logo left, links centred in a glass rail with a gliding
 * indicator (NavLinks), WhatsApp CTA right. Mobile: logo and an animated
 * menu button opening a glass dropdown (MobileNav). Routes, links, the
 * current-page marking (aria-current) and the scroll-progress line are as
 * before.
 */

/** WhatsApp CTA: electric-blue gradient, soft glow, lift and sheen on hover. */
const ctaClass = [
  "relative isolate overflow-hidden border border-white/15",
  "bg-[linear-gradient(135deg,#4f8dfa_0%,#3478f6_50%,#2563eb_100%)]",
  "shadow-[0_8px_22px_-10px_rgb(52_120_246/0.75),inset_0_1px_0_rgb(255_255_255/0.3)]",
  "transition-[translate,box-shadow,filter] duration-300",
  "hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[0_0_0_3px_rgb(90_139_255/0.18),0_12px_32px_-8px_rgb(90_110_255/0.95),inset_0_1px_0_rgb(255_255_255/0.3)]",
  "focus-visible:shadow-[0_0_0_3px_rgb(90_139_255/0.3),0_12px_32px_-8px_rgb(90_110_255/0.95)]",
  "after:pointer-events-none after:absolute after:inset-y-0 after:-left-1/2 after:w-1/3 after:-skew-x-12 after:bg-[linear-gradient(90deg,transparent,rgb(255_255_255/0.35),transparent)] after:opacity-0 after:transition-[translate,opacity] after:duration-700 after:ease-out hover:after:translate-x-[420%] hover:after:opacity-100",
].join(" ");

export function Navbar({ current }: { current: PageKey | null }) {
  const cta = whatsapp.ctaNav.text;
  const hasCta = whatsappCtaVisible();

  return (
    <header
      data-site-header
      className={[
        "group/header tone-white fixed inset-x-0 top-0 z-50 bg-transparent",
        // Glass: translucent white, frosted; firmer once scrolled.
        "bg-[linear-gradient(180deg,rgb(255_255_255/0.84),rgb(248_250_253/0.72))] backdrop-blur-xl backdrop-saturate-150",
        "transition-[background-color,box-shadow] duration-500",
        "data-[scrolled=true]:bg-[linear-gradient(180deg,rgb(255_255_255/0.95),rgb(248_249_251/0.9))] data-[scrolled=true]:shadow-[0_12px_30px_-18px_rgb(16_24_40/0.28),0_1px_0_rgb(233_238_245/0.9)]",
      ].join(" ")}
    >
      <Container className="grid h-nav grid-cols-[auto_1fr_auto] items-center gap-6 transition-[height] duration-500 ease-out lg:grid-cols-[1fr_auto_1fr] lg:group-data-[scrolled=true]/header:h-16">
        {/* Logo on true black (capsule wider than its corner radius: the
            artwork is never clipped). */}
        <div className="flex justify-self-start rounded-xl bg-black p-1 shadow-[0_0_0_1px_rgb(255_255_255/0.06),0_0_24px_-10px_rgb(90_139_255/0.55)]">
          <Logo
            sizeClass="w-[3.75rem] transition-[width] duration-500 ease-out lg:group-data-[scrolled=true]/header:w-[3.25rem]"
            sizes="60px"
            preload
          />
        </div>

        <nav aria-label="Primary" className="hidden justify-self-center lg:block">
          <NavLinks items={siteNav} current={current} />
        </nav>

        <div className="flex items-center justify-self-end gap-3">
          {hasCta ? (
            <div className="hidden lg:block">
              <WhatsAppCta label={cta} size="md" className={ctaClass} />
            </div>
          ) : null}
          <MobileNav
            items={siteNav}
            current={current}
            cta={
              hasCta || email ? (
                <div className="flex flex-col gap-3">
                  {hasCta ? <WhatsAppCta label={cta} size="lg" className={`w-full ${ctaClass}`} /> : null}
                  {email ? (
                    <a
                      href={mailtoHref() ?? undefined}
                      className="inline-flex min-h-11 items-center justify-center text-sm text-fg-muted transition-colors hover:text-fg"
                    >
                      {email}
                    </a>
                  ) : null}
                </div>
              ) : undefined
            }
          />
        </div>
      </Container>

      {/* Thin silver-blue edge. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-[linear-gradient(90deg,transparent,rgb(199_206_216/0.9)_25%,rgb(52_120_246/0.45)_50%,rgb(199_206_216/0.9)_75%,transparent)]"
      />
      {/* Scroll progress: fills left → right as the page is read. */}
      <div
        aria-hidden
        style={{ transform: "scaleX(var(--progress, 0))" }}
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left bg-[linear-gradient(90deg,#3478f6,#4f8dfa)] shadow-[0_0_8px_rgb(47_107_255/0.8)]"
      />
      <HeaderScroll />
    </header>
  );
}
