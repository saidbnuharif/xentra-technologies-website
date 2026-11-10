import { projects, sectionCopy, visibleOnly } from "@/lib/content";
import { CopyText } from "@/components/ui/CopyText";
import { Placeholder } from "@/components/ui/Placeholder";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

/**
 * Case-study rows alternating image and text. Real projects only: with no
 * approved project this section is omitted from production entirely.
 */
export function SelectedWork() {
  const items = visibleOnly(projects);
  if (items.length === 0) return null;

  return (
    <Section id="work" tone="black" labelledBy="work-title">
      <SectionHeading
        id="work-title"
        eyebrow="Selected Work"
        title="Selected Work"
        intro={sectionCopy.workIntro}
      />

      <ul className="mt-12 space-y-16 lg:mt-14 lg:space-y-24">
        {items.map((project, index) => (
          <li
            key={index}
            className="grid items-center gap-8 lg:grid-cols-12 lg:gap-14"
          >
            <div data-reveal="clip" className={`lg:col-span-7 ${index % 2 === 1 ? "lg:order-2" : ""}`}>
              <Placeholder label="Real project imagery" aspect="aspect-[16/10]" />
            </div>
            <div data-reveal-group className="lg:col-span-5">
              <p data-reveal className="font-mono text-label uppercase tracking-[0.16em] text-fg-muted">
                <CopyText copy={project.client} />
              </p>
              <h3 data-reveal className="mt-3 text-h3 font-semibold tracking-tight">
                <CopyText copy={project.title} />
              </h3>
              <p data-reveal className="mt-4 text-body text-pretty text-fg-muted">
                <CopyText copy={project.summary} />
              </p>
              <ul data-reveal className="mt-5 flex flex-wrap gap-2" aria-label="Services used">
                {project.services.map((service) => (
                  <li
                    key={service}
                    className="rounded-full border border-line px-3 py-1 text-sm text-fg-muted"
                  >
                    {service}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
