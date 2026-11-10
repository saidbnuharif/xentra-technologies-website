import Image from "next/image";
import type { Founder } from "@/lib/content";
import { CopyText } from "@/components/ui/CopyText";
import { PortraitPlaceholder } from "./founders/PortraitPlaceholder";

type FounderProfileProps = {
  founder: Founder;
  index: number;
  /** Rendered portrait width(s) for srcset selection. */
  sizes: string;
};

/** Registration marks framing the portrait — an editorial print detail. */
function CornerMarks() {
  const mark =
    "absolute size-4 border-silver-500 transition-all duration-500 ease-out group-hover:border-blue-500";
  return (
    <div aria-hidden className="pointer-events-none absolute -inset-3">
      <span className={`${mark} left-0 top-0 border-l border-t group-hover:-left-1 group-hover:-top-1`} />
      <span className={`${mark} right-0 top-0 border-r border-t group-hover:-right-1 group-hover:-top-1`} />
      <span className={`${mark} bottom-0 left-0 border-b border-l group-hover:-bottom-1 group-hover:-left-1`} />
      <span className={`${mark} bottom-0 right-0 border-b border-r group-hover:-bottom-1 group-hover:-right-1`} />
    </div>
  );
}

/**
 * Editorial profile: a framed portrait (clip-path reveal), then name,
 * designation and biography arriving in sequence. Identical treatment for
 * every owner. Desktop hover: portrait warms to full colour, frame opens,
 * accent rule extends.
 */
export function FounderProfile({ founder, index, sizes }: FounderProfileProps) {
  const number = String(index + 1).padStart(2, "0");

  return (
    <article data-reveal-group className="group flex flex-col">
      <div className="relative">
        <CornerMarks />
        <div data-reveal="clip" className="relative aspect-[4/5] overflow-hidden rounded-card bg-navy-900">
          {founder.photo ? (
            <div data-reveal-media className="absolute inset-0">
              <Image
                src={founder.photo}
                alt={`Portrait of ${founder.name.text}`}
                fill
                sizes={sizes}
                className="object-cover grayscale-[40%] transition duration-700 ease-out group-hover:scale-[1.03] group-hover:grayscale-0"
              />
              <div
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-navy-950/55 to-transparent"
              />
            </div>
          ) : (
            // Neutral branded stand-in — never a generated or stock person.
            <PortraitPlaceholder />
          )}
          {/* Large index set into the portrait corner. */}
          <span
            aria-hidden
            className="absolute right-4 top-3 font-mono text-[2.75rem] font-light leading-none text-white/25 mix-blend-plus-lighter"
          >
            {number}
          </span>
        </div>
      </div>

      <div className="mt-9 grid grid-cols-[auto_1fr] gap-x-5">
        <span data-reveal="line" aria-hidden className="mt-[0.9em] h-px w-8 bg-accent transition-all duration-500 group-hover:w-14" />
        <div>
          <h3 data-reveal className="text-h3 font-semibold tracking-tight">
            <CopyText copy={founder.name} />
          </h3>
          <p data-reveal className="mt-2 font-mono text-label uppercase tracking-[0.16em] text-accent">
            <CopyText copy={founder.designation} />
          </p>
          <p data-reveal className="mt-5 max-w-md text-body text-pretty text-fg-muted">
            <CopyText copy={founder.bio} />
          </p>

          {founder.expertise && founder.expertise.length > 0 ? (
            <ul data-reveal className="mt-5 flex flex-wrap gap-2" aria-label="Areas of expertise">
              {founder.expertise.map((area) => (
                <li key={area} className="rounded-full border border-line px-3 py-1 text-sm text-fg-muted">
                  {area}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </article>
  );
}
