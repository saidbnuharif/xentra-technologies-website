import type { CSSProperties } from "react";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { ShowcaseService } from "@/lib/content/services-showcase";
import { CopyText } from "@/components/ui/CopyText";
import { ServiceMotif } from "./ServiceMotif";
import { SCREENS, type PanelPlacement, type ServiceKey } from "./stage-layout";

const pad = (n: number) => String(n).padStart(2, "0");

/*
 * One floating glass panel: a holographic screen with the service's own
 * gradient and line art, then its number, icon and title. The description
 * and Explore appear on hover or keyboard focus (desktop); smaller screens
 * show them always. The whole panel is one link to the service.
 */
export function ServicePanel({
  service,
  index,
  Icon,
  place,
}: {
  service: ShowcaseService;
  index: number;
  Icon: LucideIcon;
  place: PanelPlacement;
}) {
  const key = service.key as ServiceKey;
  const style = {
    "--x": place.x,
    "--y": place.y,
    "--ry": `${place.ry}deg`,
    "--rz": `${place.rz}deg`,
    "--z": `${place.z}px`,
    "--float": `${place.float}s`,
    "--screen": SCREENS[key],
  } as CSSProperties;

  return (
    <li
      data-ss-panel={key}
      data-side={place.side}
      data-depth={place.z}
      className="ss-panel"
      style={style}
    >
      {/* Motion layers (ServicesStageMotion): scroll parallax, entrance,
          ambient float (CSS), hover tilt on the glass. The li keeps the
          CSS placement and the hover lift. */}
      <div data-ss-depth>
        <div data-ss-enter>
          <div data-ss-float>
            <article
              data-ss-tilt
              aria-labelledby={`ss-${key}`}
              className="ss-glass group/ss relative"
            >
              <div className="ss-screen relative h-24 overflow-hidden rounded-[0.9rem]">
                <div className="absolute inset-0 px-4 py-2">
                  <ServiceMotif service={key} />
                </div>
                <span
                  aria-hidden
                  className="absolute left-3 top-2.5 flex gap-1"
                >
                  <span className="size-1.5 rounded-full bg-white/90" />
                  <span className="size-1.5 rounded-full bg-white/60" />
                  <span className="size-1.5 rounded-full bg-white/40" />
                </span>
              </div>

              <div className="px-1.5 pb-1 pt-4">
                <div className="flex items-center gap-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[linear-gradient(145deg,#4f8dfa,#3478f6_55%,#2563eb)] text-white shadow-[0_8px_18px_-8px_rgb(52_120_246/0.7),inset_0_1px_0_rgb(255_255_255/0.4)]">
                    <Icon aria-hidden size={18} strokeWidth={2} />
                  </span>
                  <h3
                    id={`ss-${key}`}
                    className="text-[1.0625rem] font-semibold leading-snug tracking-tight text-[#14233b]"
                  >
                    <CopyText copy={service.title} />
                  </h3>
                  <span
                    aria-hidden
                    className="ml-auto self-start font-mono text-[0.68rem] tracking-[0.18em] text-[#8995a5]"
                  >
                    {pad(index + 1)}
                  </span>
                </div>

                <div className="ss-more">
                  <div className="min-h-0">
                    <p className="pt-3 text-sm leading-relaxed text-pretty text-[#626d7e]">
                      <CopyText copy={service.description} />
                    </p>
                    <Link
                      href={service.href}
                      className="mt-3 inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-[#2563eb] after:absolute after:inset-0 after:rounded-[1.25rem] hover:text-[#1d4ed8] focus-visible:text-[#1d4ed8]"
                    >
                      Explore
                      <ArrowUpRight aria-hidden size={16} />
                      <span className="sr-only"> {service.title.text}</span>
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </li>
  );
}
