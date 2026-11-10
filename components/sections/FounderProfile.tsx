import Image from "next/image";
import type { Founder } from "@/lib/content";
import { CopyText } from "@/components/ui/CopyText";
import { Placeholder } from "@/components/ui/Placeholder";

type FounderProfileProps = {
  founder: Founder;
  index: number;
  /** Rendered portrait width(s) for srcset selection. */
  sizes: string;
};

/**
 * Editorial profile: portrait, then name, designation and biography set as
 * type rather than boxed into a card. Every owner gets identical treatment.
 */
export function FounderProfile({ founder, index, sizes }: FounderProfileProps) {
  const number = String(index + 1).padStart(2, "0");

  return (
    <article className="group flex flex-col">
      {founder.photo ? (
        <div className="relative aspect-[4/5] overflow-hidden rounded-card bg-navy-900">
          <Image
            src={founder.photo}
            alt={`Portrait of ${founder.name.text}`}
            fill
            sizes={sizes}
            className="object-cover grayscale-[35%] transition duration-700 ease-out group-hover:scale-[1.03] group-hover:grayscale-0"
          />
          {/* Subtle navy grade at the foot of the photo for depth. */}
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-navy-950/50 to-transparent"
          />
        </div>
      ) : (
        <Placeholder label="Genuine professional photograph" aspect="aspect-[4/5]">
          Real portrait of the owner only — no generated or stock images.
        </Placeholder>
      )}

      <div className="mt-7 flex items-baseline gap-4">
        <span aria-hidden className="font-mono text-label text-fg-muted">
          {number}
        </span>
        <div>
          <h3 className="text-h3 font-semibold tracking-tight">
            <CopyText copy={founder.name} />
          </h3>
          <p className="mt-1.5 font-mono text-label uppercase tracking-[0.16em] text-accent">
            <CopyText copy={founder.designation} />
          </p>
        </div>
      </div>

      <div
        aria-hidden
        className="ml-10 mt-5 h-px w-10 bg-accent transition-all duration-500 group-hover:w-20"
      />

      <p className="ml-10 mt-5 text-body text-pretty text-fg-muted">
        <CopyText copy={founder.bio} />
      </p>

      {founder.expertise && founder.expertise.length > 0 ? (
        <ul className="ml-10 mt-5 flex flex-wrap gap-2" aria-label="Areas of expertise">
          {founder.expertise.map((area) => (
            <li
              key={area}
              className="rounded-full border border-line px-3 py-1 text-sm text-fg-muted"
            >
              {area}
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}
