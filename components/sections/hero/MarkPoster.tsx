import { BLUE_BOTTOM, BLUE_TOP, MARK_BOX, MARK_COLOURS, MARK_CENTRE, MARK_FIT, SILVER, toPath } from "./mark-geometry";

/*
 * The Xentra X mark as a flat SVG, built from the same measured geometry
 * and colours as the 3D scene — the no-JS / no-WebGL / reduced-motion
 * version of the mark, and the space holder while the 3D scene loads.
 *
 * Framed exactly like the 3D camera framing (mark-scene.ts: the mark padded
 * 1.25× in width and 1.32× in height, fitted to the stage), so the poster ⇄
 * canvas hand-off never jumps in size. Rings and halo spill past the frame.
 */
const w = MARK_BOX.width * MARK_FIT.w;
const h = MARK_BOX.height * MARK_FIT.h;
const viewBox = `${MARK_CENTRE.x - w / 2} ${MARK_CENTRE.y - h / 2} ${w} ${h}`;
const cx = MARK_CENTRE.x;
const cy = MARK_CENTRE.y;

export function MarkPoster({ id, className = "" }: { id: string; className?: string }) {
  const ref = (name: string) => `${id}-${name}`;
  return (
    <svg
      data-mark-poster
      aria-hidden
      viewBox={viewBox}
      className={`absolute inset-0 size-full overflow-visible ${className}`}
      role="presentation"
    >
      <defs>
        <linearGradient id={ref("silver")} x1="0" y1={MARK_BOX.y} x2="0" y2={MARK_BOX.y + MARK_BOX.height} gradientUnits="userSpaceOnUse">
          {MARK_COLOURS.silver.map((c, i) => (
            <stop key={c} offset={i / (MARK_COLOURS.silver.length - 1)} stopColor={c} />
          ))}
        </linearGradient>
        <linearGradient id={ref("blue-top")} x1="0" y1="302" x2="0" y2="465" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={MARK_COLOURS.blueTop[0]} />
          <stop offset="1" stopColor={MARK_COLOURS.blueTop[1]} />
        </linearGradient>
        <linearGradient id={ref("blue-bottom")} x1="0" y1="483" x2="0" y2="646" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={MARK_COLOURS.blueBottom[0]} />
          <stop offset="1" stopColor={MARK_COLOURS.blueBottom[1]} />
        </linearGradient>
        <radialGradient id={ref("halo")}>
          <stop offset="0" stopColor="#2f6bff" stopOpacity="0.42" />
          <stop offset="1" stopColor="#2f6bff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx={cx + 20} cy={cy} rx="380" ry="260" fill={`url(#${ref("halo")})`} />
      <g fill="none" stroke="#3d7dff" transform={`rotate(-17 ${cx} ${cy})`}>
        <ellipse cx={cx} cy={cy + 10} rx="350" ry="92" strokeOpacity="0.5" strokeWidth="2" />
        <ellipse cx={cx} cy={cy + 18} rx="410" ry="122" strokeOpacity="0.22" strokeWidth="1.2" />
      </g>
      <path d={toPath(SILVER)} fill={`url(#${ref("silver")})`} />
      <path d={toPath(BLUE_TOP)} fill={`url(#${ref("blue-top")})`} />
      <path d={toPath(BLUE_BOTTOM)} fill={`url(#${ref("blue-bottom")})`} />
    </svg>
  );
}
