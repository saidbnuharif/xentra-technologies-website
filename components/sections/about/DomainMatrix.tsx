import { serviceCategories } from "@/lib/content";
import { CopyText } from "@/components/ui/CopyText";
import { DomainGlyph } from "./DomainGlyph";

/*
 * The four business domains as one connected band: a rail links the
 * domains, each with its drawn glyph and its actual (approved) services.
 * Dark navy panel inside the light About section for depth and contrast.
 * Only approved content: category names and service names.
 */
export function DomainMatrix() {
  const serviceCount = serviceCategories.reduce((n, c) => n + c.services.length, 0);

  return (
    <div
      data-reveal
      className="tone-navy relative mt-16 overflow-hidden rounded-[1.5rem] lg:mt-20"
    >
      {/* Faint blueprint grid, fading toward the edges. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgb(255_255_255/0.04)_1px,transparent_1px),linear-gradient(90deg,rgb(255_255_255/0.04)_1px,transparent_1px)] bg-size-[48px_48px] [mask-image:radial-gradient(ellipse_at_top,black,transparent_75%)]"
      />

      <div className="relative px-6 pt-8 sm:px-10 sm:pt-10 lg:px-12">
        <p className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 font-mono text-label uppercase tracking-[0.18em] text-fg-muted">
          <span className="text-accent">Four connected domains</span>
          <span>
            {serviceCount} services · {serviceCategories.length} domains
          </span>
        </p>
      </div>

      <div data-reveal-group className="relative mt-8 lg:mt-12">
        {/* Connecting rail across the domains (desktop). */}
        <div aria-hidden className="absolute inset-x-12 top-0 hidden lg:block">
          <div data-reveal="line" className="h-px w-full bg-linear-to-r from-blue-400/70 via-silver-300/30 to-blue-400/70" />
        </div>

        <ol className="grid sm:grid-cols-2 lg:grid-cols-4">
          {serviceCategories.map((category, index) => (
            <li
              key={category.id}
              data-reveal
              className="group/domain relative border-t border-line px-6 pb-10 pt-8 sm:px-10 sm:[&:nth-child(even)]:border-l lg:border-l lg:border-t-0 lg:px-12 lg:pb-12 lg:pt-10 lg:first:border-l-0"
            >
              {/* Node on the rail. */}
              <span
                aria-hidden
                className="absolute -top-[5px] left-12 hidden size-[9px] rounded-full border border-blue-400 bg-navy-950 transition-colors duration-300 group-hover/domain:bg-blue-400 lg:block"
              />

              <div className="flex items-start justify-between">
                <span className="font-mono text-label text-accent">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div data-parallax="10">
                  <DomainGlyph domain={category.id} />
                </div>
              </div>

              <h3 className="mt-8 text-h3 font-semibold tracking-tight">
                <CopyText copy={category.name} />
              </h3>

              <ul className="mt-5 space-y-2.5">
                {category.services.map((service) => (
                  <li key={service.id} className="flex items-baseline gap-3 text-body text-silver-200">
                    <span aria-hidden className="h-px w-3 shrink-0 translate-y-[-0.3em] bg-silver-500 transition-all duration-300 group-hover/domain:w-5 group-hover/domain:bg-blue-400" />
                    <CopyText copy={service.name} />
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
