import { BLUE_BOTTOM, BLUE_TOP, MARK_BOX, MARK_COLOURS, SILVER, toPath } from "./mark-geometry";
import { HeroMarkScene } from "./HeroMarkScene";
import "./hero-mark.css";

/*
 * Hero centrepiece: the Xentra X mark in 3D (WebGL, HeroMarkScene) with a
 * server-rendered SVG poster of the same mark underneath. The poster uses
 * the geometry and colours measured from the official logo, so the no-JS /
 * no-WebGL version is the real mark, not an approximation.
 *
 * Decorative: the brand name is already in the navbar logo and the hero
 * text, so the stage is aria-hidden.
 */
const pad = 150;
const viewBox = `${MARK_BOX.x - pad} ${MARK_BOX.y - pad * 1.25} ${MARK_BOX.width + pad * 2} ${MARK_BOX.height + pad * 2.5}`;
const cx = MARK_BOX.x + MARK_BOX.width / 2;
const cy = 474;

export function HeroMark({ className = "" }: { className?: string }) {
  return (
    <div data-hero-mark aria-hidden className={`pointer-events-none relative select-none ${className}`}>
      <svg data-mark-poster viewBox={viewBox} className="absolute inset-0 size-full" role="presentation">
        <defs>
          <linearGradient id="hm-silver" x1="0" y1={MARK_BOX.y} x2="0" y2={MARK_BOX.y + MARK_BOX.height} gradientUnits="userSpaceOnUse">
            {MARK_COLOURS.silver.map((c, i) => (
              <stop key={c} offset={i / (MARK_COLOURS.silver.length - 1)} stopColor={c} />
            ))}
          </linearGradient>
          <linearGradient id="hm-blue-top" x1="0" y1="302" x2="0" y2="465" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor={MARK_COLOURS.blueTop[0]} />
            <stop offset="1" stopColor={MARK_COLOURS.blueTop[1]} />
          </linearGradient>
          <linearGradient id="hm-blue-bottom" x1="0" y1="483" x2="0" y2="646" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor={MARK_COLOURS.blueBottom[0]} />
            <stop offset="1" stopColor={MARK_COLOURS.blueBottom[1]} />
          </linearGradient>
          <radialGradient id="hm-halo">
            <stop offset="0" stopColor="#2f6bff" stopOpacity="0.45" />
            <stop offset="1" stopColor="#2f6bff" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx={cx + 30} cy={cy} rx="420" ry="300" fill="url(#hm-halo)" />
        <g fill="none" stroke="#3d7dff" transform={`rotate(-17 ${cx} ${cy})`}>
          <ellipse cx={cx} cy={cy + 10} rx="390" ry="105" strokeOpacity="0.55" strokeWidth="2" />
          <ellipse cx={cx} cy={cy + 20} rx="460" ry="140" strokeOpacity="0.25" strokeWidth="1.2" />
        </g>
        <path d={toPath(SILVER)} fill="url(#hm-silver)" />
        <path d={toPath(BLUE_TOP)} fill="url(#hm-blue-top)" />
        <path d={toPath(BLUE_BOTTOM)} fill="url(#hm-blue-bottom)" />
      </svg>
      <HeroMarkScene />
    </div>
  );
}
