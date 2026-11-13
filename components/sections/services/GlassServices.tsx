import type { CSSProperties } from "react";
import { ArrowUpRight, Check, Mail } from "lucide-react";
import Link from "next/link";
import { coreServices, mailtoHref, serviceEnquiryMessage } from "@/lib/content";
import { CopyText } from "@/components/ui/CopyText";
import { WhatsAppCta } from "@/components/ui/WhatsAppCta";
import { GlassServicesMotion } from "./GlassServicesMotion";
import { serviceIcons } from "./service-icons";
import "./glass-services.css";

const pad = (n: number) => String(n).padStart(2, "0");

/*
 * The 8 approved core services as floating glass panels — frosted,
 * translucent "interface windows" with thin glowing borders, set over a
 * deep navy field with blurred geometric shapes, soft particles and
 * electric-blue / violet light. Used in two forms:
 *
 *  - compact (Home): window bar, icon, name, the service's first approved
 *    point as its description (verbatim), a small decorative indicator;
 *    links to the service on /services. Desktop: an overlapping floating
 *    composition (four across, panels nudged into each other with their
 *    own rotation, scale and depth). Tablet: two across, gentler. Phones:
 *    one column, no overlap or rotation.
 *  - full (Services page): the same panels with all five approved points
 *    and the WhatsApp / email enquiry, two staggered columns that never
 *    overlap text; stable #slug anchors (and older aliases) kept.
 *
 * Motion (GlassServicesMotion): panels assemble into place as the section
 * enters; they float at different speeds (desktop, only while on screen);
 * the composition shifts in depth with the mouse and a hovered panel lifts,
 * tilts toward the cursor and brightens. Reduced motion / no JS: the
 * finished composition, still.
 *
 * Layers per panel (so no two motions share an element): li = layout,
 * rotation, scale (CSS) › [data-gp-depth] = mouse parallax › [data-gp-float]
 * = idle float (CSS) › [data-gp-enter] = entrance › article = hover tilt.
 */

/** Composition (desktop): offset, rotation, scale, depth, float timing. */
const LAYOUT = [
  { tx: "0rem", ty: "1.5rem", r: "-3deg", s: 1, d: 0.9, dur: "7s" },
  { tx: "-1.75rem", ty: "-1.25rem", r: "2deg", s: 0.94, d: 0.5, dur: "8.5s" },
  { tx: "-3rem", ty: "1.25rem", r: "-1.5deg", s: 1.03, d: 1, dur: "6.5s" },
  { tx: "-4.25rem", ty: "-0.5rem", r: "2.5deg", s: 0.92, d: 0.6, dur: "9s" },
  { tx: "1.5rem", ty: "-0.75rem", r: "1.75deg", s: 0.95, d: 0.55, dur: "8s" },
  { tx: "-0.25rem", ty: "1rem", r: "-2deg", s: 1.02, d: 0.95, dur: "7.5s" },
  { tx: "-1.75rem", ty: "-1rem", r: "1.25deg", s: 0.93, d: 0.6, dur: "9.5s" },
  { tx: "-3.25rem", ty: "1.25rem", r: "-2.5deg", s: 1, d: 0.85, dur: "6.8s" },
];

/** A small decorative indicator per panel (no data, no claims). */
function Indicator({ kind }: { kind: number }) {
  const common = "pointer-events-none shrink-0 text-blue-300";
  switch (kind % 4) {
    case 0:
      return (
        <svg aria-hidden viewBox="0 0 40 20" className={`${common} h-4 w-8`}>
          {[6, 11, 8, 15, 12].map((h, i) => (
            <rect key={i} x={i * 8 + 1} y={20 - h} width="5" height={h} rx="1.5" fill="currentColor" opacity={0.35 + i * 0.13} />
          ))}
        </svg>
      );
    case 1:
      return (
        <svg aria-hidden viewBox="0 0 20 20" className={`${common} size-5`}>
          <circle cx="10" cy="10" r="7.5" fill="none" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2.5" />
          <circle cx="10" cy="10" r="7.5" fill="none" stroke="url(#gp-violet)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="47" strokeDashoffset="14" transform="rotate(-90 10 10)" />
        </svg>
      );
    case 2:
      return (
        <svg aria-hidden viewBox="0 0 40 16" className={`${common} h-4 w-10`}>
          <path d="M1 12 L8 9 L14 11 L21 4 L28 7 L35 2 L39 3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    default:
      return (
        <span aria-hidden className={`${common} flex items-center gap-1`}>
          <span className="gp-pulse size-1.5 rounded-full bg-blue-300 shadow-[0_0_8px_rgb(147_179_255/0.9)]" />
          <span className="size-1.5 rounded-full bg-blue-300/40" />
          <span className="size-1.5 rounded-full bg-blue-300/20" />
        </span>
      );
  }
}

export function GlassServices({ variant }: { variant: "compact" | "full" }) {
  const full = variant === "full";
  const total = coreServices.length;

  return (
    <GlassServicesMotion className="gp-field relative">
      {/* Gradient defs shared by the indicators. */}
      <svg aria-hidden className="absolute size-0">
        <defs>
          <linearGradient id="gp-violet" x1="0" x2="1">
            <stop offset="0" stopColor="#5a8bff" />
            <stop offset="1" stopColor="#8b6cff" />
          </linearGradient>
        </defs>
      </svg>

      {/* Background: blurred geometric shapes, soft particles, blue / violet light. */}
      <div aria-hidden className="pointer-events-none absolute -inset-x-[10%] -inset-y-16 -z-0 overflow-hidden">
        <div className="absolute left-[8%] top-[10%] size-[22rem] rounded-full bg-[radial-gradient(closest-side,rgb(47_107_255/0.28),transparent)]" />
        <div className="absolute right-[6%] top-[30%] size-[26rem] rounded-full bg-[radial-gradient(closest-side,rgb(124_92_255/0.22),transparent)]" />
        <div className="absolute bottom-[4%] left-[38%] size-[20rem] rounded-full bg-[radial-gradient(closest-side,rgb(47_107_255/0.18),transparent)]" />
        <div className="gp-shape absolute left-[18%] top-[58%] size-40 rotate-12 rounded-[2.5rem] border border-blue-400/20 bg-blue-500/10 blur-[2px]" />
        <div className="gp-shape gp-shape--slow absolute right-[16%] top-[6%] size-28 -rotate-12 rounded-[2rem] border border-violet-400/20 bg-violet-500/10 blur-[3px]" />
        <div className="absolute right-[30%] bottom-[10%] size-20 rotate-45 rounded-2xl border border-blue-300/15 blur-[1px]" />
        <div className="gp-particles absolute inset-0" />
      </div>

      <ol
        className={
          full
            ? "relative grid gap-6 md:grid-cols-2 md:gap-x-8 md:gap-y-10"
            : "relative grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-x-0 lg:gap-y-16 lg:py-10"
        }
      >
        {coreServices.map((service, i) => {
          const Icon = serviceIcons[i % serviceIcons.length];
          const L = LAYOUT[i % LAYOUT.length];
          const message = serviceEnquiryMessage(service.name.text);
          const mail = mailtoHref(`Enquiry: ${service.name.text}`, message);
          const style = {
            "--tx": L.tx,
            "--ty": L.ty,
            "--r": L.r,
            "--s": String(L.s),
            "--dur": L.dur,
            "--delay": `${-i * 1.3}s`,
            zIndex: Math.round(L.d * 10),
          } as CSSProperties;
          return (
            <li
              key={service.slug}
              id={full ? service.slug : undefined}
              data-gp-item
              data-full={full ? "" : undefined}
              className={`gp-item relative ${full ? "scroll-mt-[calc(var(--xt-nav-height)+1.5rem)]" : ""}`}
              style={style}
            >
              {/* Older anchors land on the full panels (links from other pages). */}
              {full
                ? service.aliases?.map((alias) => (
                    <span key={alias} id={alias} aria-hidden className="absolute top-0 scroll-mt-[calc(var(--xt-nav-height)+1.5rem)]" />
                  ))
                : null}
              <div data-gp-depth data-depth={L.d} className="h-full">
                <div data-gp-float className="h-full">
                  <div data-gp-enter className="h-full">
                    <article
                      data-gp-panel
                      aria-labelledby={`gp-${variant}-${service.slug}`}
                      className="group/gp gp-panel relative flex h-full flex-col overflow-hidden rounded-[1.375rem]"
                    >
                      {/* Window bar */}
                      <div aria-hidden className="flex items-center justify-between border-b border-white/[0.07] px-4 py-2.5">
                        <span className="flex gap-1.5">
                          <span className="size-2 rounded-full bg-white/20" />
                          <span className="size-2 rounded-full bg-white/15" />
                          <span className="size-2 rounded-full bg-blue-400/60 shadow-[0_0_6px_rgb(90_139_255/0.9)]" />
                        </span>
                        <span className="font-mono text-[0.62rem] font-medium tracking-[0.22em] text-silver-400">
                          SVC.{pad(i + 1)} / {pad(total)}
                        </span>
                      </div>

                      <div className={`relative flex flex-1 flex-col ${full ? "p-6 sm:p-8" : "p-5"}`}>
                        <div className="flex items-start justify-between gap-3">
                          <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-blue-300/25 bg-[linear-gradient(145deg,rgb(47_107_255/0.35),rgb(124_92_255/0.18))] text-white shadow-[0_0_22px_-6px_rgb(90_139_255/0.9),inset_0_1px_0_rgb(255_255_255/0.2)] transition-shadow duration-300 group-hover/gp:shadow-[0_0_30px_-4px_rgb(120_150_255/1),inset_0_1px_0_rgb(255_255_255/0.25)]">
                            <Icon aria-hidden size={20} strokeWidth={1.75} />
                          </span>
                          <Indicator kind={i} />
                        </div>
                        <h3
                          id={`gp-${variant}-${service.slug}`}
                          className={`mt-4 font-semibold tracking-tight text-balance text-white ${full ? "text-h3" : "text-[1.05rem] leading-snug"}`}
                        >
                          <CopyText copy={service.name} />
                        </h3>

                        {full ? (
                          <>
                            <ul className="mt-4 grid gap-2.5 border-t border-white/[0.08] pt-4">
                              {service.points.map((point) => (
                                <li key={point.text} className="flex gap-3 text-body text-silver-200">
                                  <Check aria-hidden size={18} strokeWidth={2} className="mt-0.5 shrink-0 text-blue-300" />
                                  <span>
                                    <CopyText copy={point} />
                                  </span>
                                </li>
                              ))}
                            </ul>
                            <div className="mt-auto flex flex-col gap-3 pt-7 sm:flex-row sm:items-center">
                              <WhatsAppCta
                                label="Enquire on WhatsApp"
                                message={message}
                                accessibleContext={service.name.text}
                                size="md"
                                className="hover:shadow-[0_0_0_3px_rgb(47_107_255/0.2),0_10px_24px_-8px_rgb(47_107_255/0.8)]"
                              />
                              {mail ? (
                                <a
                                  href={mail}
                                  className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-silver-300 transition-colors hover:text-white focus-visible:text-white"
                                >
                                  <Mail aria-hidden size={16} />
                                  Enquire by email
                                  <span className="sr-only">about {service.name.text}</span>
                                </a>
                              ) : null}
                            </div>
                          </>
                        ) : (
                          <>
                            {service.points[0] ? (
                              <p className="mt-2 text-sm leading-relaxed text-pretty text-silver-300">
                                <CopyText copy={service.points[0]} />
                              </p>
                            ) : null}
                            <Link
                              href={`/services#${service.slug}`}
                              className="mt-auto inline-flex min-h-11 items-center gap-1.5 pt-3 text-sm font-medium text-blue-300 transition-colors after:absolute after:inset-0 after:rounded-[1.375rem] hover:text-white focus-visible:text-white"
                            >
                              Explore
                              <ArrowUpRight aria-hidden size={15} />
                              <span className="sr-only"> {service.name.text}</span>
                            </Link>
                          </>
                        )}
                      </div>
                    </article>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </GlassServicesMotion>
  );
}
