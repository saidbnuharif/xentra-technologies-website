import { ArrowRight, Mail } from "lucide-react";
import { email, homeCopy, mailtoHref, whatsapp } from "@/lib/content";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { CopyText } from "@/components/ui/CopyText";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { Section } from "@/components/ui/Section";
import { InViewFlag } from "@/components/ui/InViewFlag";
import { WhatsAppCta } from "@/components/ui/WhatsAppCta";

type EnquiryBandProps = {
  /** Show the "choose a service" route to /contact (hidden on /contact itself). */
  showServicePicker?: boolean;
};

/** Light trails sweeping across the band (decorative SVG, CSS-animated). */
function LightTrails() {
  const trails = [
    { d: "M-40 300 C 260 220, 520 330, 820 210 S 1300 90, 1500 140", w: 1.5, o: 0.7, dur: "9s", delay: "0s" },
    { d: "M-40 360 C 300 300, 600 380, 900 280 S 1320 200, 1500 230", w: 1, o: 0.45, dur: "12s", delay: "-4s" },
    { d: "M-40 120 C 240 180, 560 60, 880 130 S 1280 260, 1500 200", w: 0.8, o: 0.3, dur: "15s", delay: "-7s" },
  ];
  return (
    <svg
      aria-hidden
      viewBox="0 0 1440 420"
      preserveAspectRatio="xMidYMid slice"
      // Fades out behind the statement text, so no trail crosses a line of copy.
      className="pointer-events-none absolute inset-0 size-full [mask-image:linear-gradient(to_bottom,black_40%,transparent)] lg:[mask-image:linear-gradient(to_right,transparent_25%,black_60%)]"
    >
      <defs>
        <linearGradient id="trail-stroke" x1="0" x2="1">
          <stop offset="0" stopColor="#2f6bff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#5a8bff" />
          <stop offset="1" stopColor="#93b3ff" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      {trails.map((t, i) => (
        <g key={i} opacity={t.o}>
          {/* Faint full path… */}
          <path d={t.d} fill="none" stroke="url(#trail-stroke)" strokeOpacity="0.25" strokeWidth={t.w} />
          {/* …and a bright segment travelling along it. */}
          <path
            d={t.d}
            pathLength={1}
            fill="none"
            stroke="#93b3ff"
            strokeWidth={t.w + 0.6}
            strokeLinecap="round"
            strokeDasharray="0.18 0.82"
            // Animated on desktop only, and only while the band is on screen
            // (InViewFlag): SVG stroke animation runs on the main thread.
            // Phones and tablets keep a still light segment.
            className="lg:group-data-[in-view=true]/trails:animate-[xt-trail_var(--dur)_linear_infinite] [filter:drop-shadow(0_0_4px_rgb(47_107_255/0.9))]"
            style={{ ["--dur" as string]: t.dur, animationDelay: t.delay, strokeDashoffset: (i * 0.3 + 0.2).toFixed(2) }}
          />
        </g>
      ))}
    </svg>
  );
}

/**
 * Closing enquiry call-to-action used at the foot of every main page
 * (redesign step H6): black band with a curved top and light trails;
 * statement on the left, actions in a glass panel on the right.
 * WhatsApp is primary; choosing a specific service and email are secondary.
 * data-hide-float: the floating WhatsApp button steps aside from here down.
 */
export function EnquiryBand({ showServicePicker = true }: EnquiryBandProps) {
  const mail = mailtoHref("Enquiry from the Xentra Technologies website");

  return (
    <Section id="enquire" tone="black" labelledBy="enquire-title" edge className="group/trails">
      <InViewFlag />
      <LightTrails />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(45%_70%_at_80%_60%,rgb(47_107_255/0.14),transparent_70%)]"
      />
      <div data-hide-float className="relative grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-16">
        <div className="lg:col-span-7">
          <Eyebrow reveal>Contact</Eyebrow>
          <h2
            id="enquire-title"
            data-reveal="lines"
            className="mt-6 text-statement font-semibold tracking-tight text-balance"
          >
            <CopyText copy={homeCopy.enquiryHeading} />
          </h2>
          <p data-reveal className="mt-6 max-w-xl text-lead text-pretty text-fg-muted">
            <CopyText copy={homeCopy.enquiryBody} />
          </p>
        </div>

        <div
          data-reveal-group
          // Glass panel from sm up; on phones the buttons keep the full width.
          className="flex flex-col gap-3 sm:rounded-[1.25rem] sm:border sm:border-white/10 sm:bg-[linear-gradient(160deg,rgb(255_255_255/0.07),rgb(255_255_255/0.02)_50%,rgb(47_107_255/0.06))] sm:p-7 sm:shadow-[0_30px_70px_-30px_rgb(47_107_255/0.45),inset_0_1px_0_rgb(255_255_255/0.08)] sm:backdrop-blur-md lg:col-span-5"
        >
          <div data-reveal>
            <WhatsAppCta
              label={whatsapp.ctaContact.text}
              className="w-full hover:shadow-[0_0_0_3px_rgb(47_107_255/0.18),0_12px_30px_-8px_rgb(47_107_255/0.8)]"
            />
          </div>
          {showServicePicker ? (
            <div data-reveal>
              <ButtonLink href="/contact" variant="secondary" className="w-full hover:border-blue-400/60">
                Choose a service to enquire about
                <ArrowRight aria-hidden size={18} />
              </ButtonLink>
            </div>
          ) : null}
          {email && mail ? (
            <a
              data-reveal
              href={mail}
              className="group mt-1 inline-flex min-h-11 items-center justify-center gap-3 break-all text-body text-silver-200 transition-colors hover:text-white focus-visible:text-white"
            >
              <Mail aria-hidden size={18} className="shrink-0 text-accent" />
              {email}
            </a>
          ) : null}
        </div>
      </div>
    </Section>
  );
}
