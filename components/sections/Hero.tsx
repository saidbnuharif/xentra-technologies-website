import { company, whatsapp } from "@/lib/content";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { HeroVisual } from "./hero/HeroVisual";
import { WhatsAppCta } from "@/components/ui/WhatsAppCta";
import { Eyebrow } from "@/components/ui/SectionHeading";

/**
 * Structural hero with approved copy and the primary WhatsApp CTA.
 * The detailed hero composition is a later, separately approved stage.
 */
export function Hero() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      className="tone-black flex min-h-svh items-center pb-20 pt-[calc(var(--xt-nav-height)+4rem)]"
    >
      <Container className="grid items-center gap-14 lg:grid-cols-[1.15fr_1fr]">
        <div>
          <Eyebrow>{company.name}</Eyebrow>
          <h1
            id="hero-title"
            className="mt-6 text-display font-semibold tracking-tight text-balance"
          >
            {company.tagline.text}
          </h1>
          <p className="mt-6 max-w-xl text-lead text-pretty text-fg-muted">
            {company.description.text}
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <WhatsAppCta label={whatsapp.ctaPrimary.text} />
            <ButtonLink href="#services" variant="secondary">
              Explore services
            </ButtonLink>
          </div>
        </div>

        <HeroVisual />
      </Container>
    </section>
  );
}
