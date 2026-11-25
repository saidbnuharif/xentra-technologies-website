import { coreServices } from "@/lib/content";
import { serviceIcons } from "../service-icons";
import { ServiceChapter } from "./ServiceChapter";
import { ServiceChaptersMotion } from "./ServiceChaptersMotion";
import { ServiceLens } from "./ServiceLens";
import "./services-catalog.css";

/*
 * Services page: the 8 approved core services as a lens and chapters.
 *
 * Desktop: the sticky service lens on the left (ServiceLens) follows the
 * chapter being read on the right; a silver spine beside the chapters
 * fills with blue as you go. Phones and tablets: the chapters alone, each
 * with its own glass icon tile. Same white / platinum / silver /
 * electric-blue system as Home: glass, metallic numerals, particle core,
 * hairline light. Content, enquiry links and #slug anchors unchanged.
 * Motion: ServiceChaptersMotion. Reduced motion / no JS: still, complete.
 */
export function ServiceChapters() {
  const total = coreServices.length;

  return (
    <ServiceChaptersMotion total={total} className="sc-root relative">
      <div aria-hidden className="sc-atmosphere pointer-events-none absolute -inset-x-[8%] -inset-y-24" />

      <div className="relative grid gap-4 lg:grid-cols-12 lg:gap-12">
        <div className="hidden lg:col-span-5 lg:block">
          <div className="sticky top-[calc(var(--xt-nav-height)+1.5rem)]">
            <ServiceLens />
          </div>
        </div>

        <div className="relative lg:col-span-7">
          <span aria-hidden className="sc-spine">
            <span data-sc-progress className="sc-spine-fill" />
          </span>
          <ol className="sc-chapters relative">
            {coreServices.map((service, i) => (
              <ServiceChapter key={service.slug} service={service} index={i} total={total} Icon={serviceIcons[i % serviceIcons.length]} />
            ))}
          </ol>
        </div>
      </div>
    </ServiceChaptersMotion>
  );
}
