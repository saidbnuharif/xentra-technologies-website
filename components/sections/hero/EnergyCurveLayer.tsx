/*
 * One section's window onto the energy curve (XStage draws it).
 * layer="base" (hero): no z-index of its own, so it paints under the page's
 * 3D canvas and the curve passes beneath the X.
 *
 * The hero and the About section each hold one of these, behind their text
 * (-z-[1] inside the section's own stacking context) and above its
 * background. XStage gives both the same path in stage coordinates
 * and sets each viewBox to its section's slice of the stage, so the two
 * halves meet seamlessly at the section boundary.
 *
 * Empty (no path) until laid out — nothing shows without JavaScript.
 */
export function EnergyCurveLayer({ id, layer = "behind" }: { id: string; layer?: "behind" | "base" }) {
  return (
    <svg
      aria-hidden
      data-x-curve
      preserveAspectRatio="none"
      className={`pointer-events-none absolute inset-0 ${layer === "behind" ? "-z-[1]" : ""} size-full overflow-hidden`}
    >
      <defs>
        <radialGradient id={`${id}-head`}>
          <stop offset="0" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="0.25" stopColor="#a9c4ff" stopOpacity="0.9" />
          <stop offset="1" stopColor="#2f6bff" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Soft glow (two wide, faint strokes — cheaper than a blur filter). */}
      <path data-x-curve-path fill="none" stroke="#2f6bff" strokeOpacity="0.07" strokeWidth="18" strokeLinecap="round" />
      <path data-x-curve-path fill="none" stroke="#2f6bff" strokeOpacity="0.2" strokeWidth="7" strokeLinecap="round" />
      <path data-x-curve-path fill="none" stroke="#5a8bff" strokeWidth="2" strokeLinecap="round" />
      <path data-x-curve-path fill="none" stroke="#e2ebff" strokeOpacity="0.85" strokeWidth="0.8" strokeLinecap="round" />
      {/* Travelling head of the energy. */}
      <circle data-x-curve-head r="22" cx="-100" cy="-100" fill={`url(#${id}-head)`} opacity="0" />
    </svg>
  );
}
