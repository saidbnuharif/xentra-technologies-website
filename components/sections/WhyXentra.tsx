import { reasons, sectionCopy, visibleOnly } from "@/lib/content";
import { CopyText } from "@/components/ui/CopyText";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

/**
 * Editorial numbered statements beside a sticky heading (desktop).
 * Shares the navy band with Services, separated by a hairline.
 */
export function WhyXentra() {
  const items = visibleOnly(reasons);
  if (items.length === 0) return null;

  return (
    <Section id="why-xentra" tone="navy" labelledBy="why-title">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <SectionHeading
            id="why-title"
            eyebrow="Our approach"
            title="Why Xentra"
            intro={sectionCopy.whyIntro}
            className="lg:sticky lg:top-[calc(var(--xt-nav-height)+3rem)]"
          />
        </div>

        <ol className="lg:col-span-7">
          {items.map((reason, index) => (
            <li
              key={reason.title.text}
              className="grid grid-cols-[3.5rem_1fr] gap-x-4 border-t border-line py-8 first:border-t-0 first:pt-0 sm:grid-cols-[5rem_1fr] lg:py-10"
            >
              <span
                aria-hidden
                className="text-h2 font-semibold leading-none tracking-tight text-silver-500"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="text-h3 font-semibold tracking-tight">
                  <CopyText copy={reason.title} />
                </h3>
                <p className="mt-3 max-w-prose text-body text-pretty text-fg-muted">
                  <CopyText copy={reason.body} />
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
