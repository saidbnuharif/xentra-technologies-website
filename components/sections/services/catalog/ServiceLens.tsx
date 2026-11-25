import { coreServices } from "@/lib/content";
import { CorePoster } from "@/components/sections/home/services-stage/CorePoster";
import { serviceIcons } from "../service-icons";

const pad = (n: number) => String(n).padStart(2, "0");
const R = 150; // orbit radius (viewBox 360)
const C = 180;

/*
 * The service lens (Services page, desktop): a sticky glass instrument
 * beside the chapters. A silver orbit carries one node per service and
 * turns so the service being read sits at the top; a blue arc fills with
 * progress through the list. In the centre, a floating glass tile shows
 * that service's icon, a metallic numeral and its name, over the slowly
 * turning particle core from Home. Decorative (aria-hidden): the chapters
 * carry the content. State comes from ServiceChaptersMotion
 * (--sc-active on the root, data-on on the matching items); without JS it
 * shows the first service.
 */
export function ServiceLens() {
  const total = coreServices.length;
  const step = 360 / total;

  return (
    <div aria-hidden className="sc-lens">
      <div className="sc-lens-light" />
      <div className="sc-lens-core">
        <CorePoster className="size-full" />
      </div>

      <svg viewBox="0 0 360 360" className="sc-lens-orbit">
        <defs>
          <linearGradient id="sc-arc" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#4f8dfa" />
            <stop offset="1" stopColor="#2563eb" />
          </linearGradient>
        </defs>
        <circle cx={C} cy={C} r={R + 22} fill="none" stroke="#c7ced8" strokeOpacity="0.5" strokeDasharray="1 7" />
        <circle cx={C} cy={C} r={R} fill="none" stroke="#c7ced8" strokeWidth="1.2" />
        {/* Progress through the list. */}
        <circle className="sc-lens-arc" cx={C} cy={C} r={R} fill="none" stroke="url(#sc-arc)" strokeWidth="2.5" strokeLinecap="round" pathLength={1} transform={`rotate(-90 ${C} ${C})`} />
        {/* The ring of service nodes turns so the active one is at the top. */}
        <g className="sc-lens-ring">
          {coreServices.map((service, i) => {
            const a = ((i * step - 90) * Math.PI) / 180;
            return (
              <g key={service.slug} data-sc-node={i} data-on={i === 0 ? "" : undefined} className="sc-node" transform={`translate(${(C + R * Math.cos(a)).toFixed(1)} ${(C + R * Math.sin(a)).toFixed(1)})`}>
                <circle r="9" className="sc-node-halo" />
                <circle r="4.5" className="sc-node-dot" />
              </g>
            );
          })}
        </g>
      </svg>

      {/* The floating glass tile: one face per service, the active one shown. */}
      <div className="sc-lens-tile-wrap">
        <div data-sc-tilt className="sc-lens-tile">
          {coreServices.map((service, i) => {
            const Icon = serviceIcons[i % serviceIcons.length];
            return (
              <div key={service.slug} data-sc-face={i} data-on={i === 0 ? "" : undefined} className="sc-face">
                <span className="sc-face-icon">
                  <Icon size={30} strokeWidth={1.6} />
                </span>
                <span className="sc-face-num">{pad(i + 1)}</span>
                <span className="sc-face-name">{service.name.text}</span>
              </div>
            );
          })}
          <span className="sc-face-total">/ {pad(total)}</span>
        </div>
      </div>
    </div>
  );
}
