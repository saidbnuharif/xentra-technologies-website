import { founders, leadershipIntro, visibleOnly } from "@/lib/content";
import { CopyText } from "@/components/ui/CopyText";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { Section } from "@/components/ui/Section";
import { FounderProfile } from "./FounderProfile";

/** Column layout adapts to the number of owners while keeping them equal. */
function layoutFor(count: number) {
  if (count === 1) return { grid: "max-w-xl", sizes: "(min-width: 36rem) 36rem, 100vw" };
  // Two owners: capped width so 4:5 portraits stay within a desktop screen.
  if (count === 2)
    return { grid: "max-w-4xl sm:grid-cols-2", sizes: "(min-width: 64rem) 424px, (min-width: 40rem) 50vw, 100vw" };
  return {
    grid: "sm:grid-cols-2 lg:grid-cols-3",
    sizes: "(min-width: 75rem) 384px, (min-width: 64rem) 33vw, (min-width: 40rem) 50vw, 100vw",
  };
}

export function Leadership() {
  const people = visibleOnly(founders);
  if (people.length === 0) return null;
  const layout = layoutFor(people.length);

  return (
    <Section id="leadership" tone="light" labelledBy="leadership-title">
      <header className={`grid gap-6 lg:grid-cols-12 lg:items-end ${people.length === 2 ? "max-w-4xl" : ""}`}>
        <div className="lg:col-span-7">
          <Eyebrow>Founders &amp; Leadership</Eyebrow>
          <h2
            id="leadership-title"
            className="mt-5 text-h2 font-semibold tracking-tight text-balance"
          >
            <CopyText copy={leadershipIntro.title} />
          </h2>
        </div>
        <p className="text-lead text-pretty text-fg-muted lg:col-span-5 lg:text-right">
          <CopyText copy={leadershipIntro.subtitle} />
        </p>
      </header>

      <div className={`mt-12 grid gap-x-10 gap-y-16 lg:mt-14 lg:gap-x-14 ${layout.grid}`}>
        {people.map((founder, index) => (
          <FounderProfile
            key={`${founder.name.text}-${index}`}
            founder={founder}
            index={index}
            sizes={layout.sizes}
          />
        ))}
      </div>
    </Section>
  );
}
