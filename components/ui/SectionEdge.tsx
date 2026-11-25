/**
 * Curved top edge for a section: a gentle swoop, low on the left and rising
 * to the right, filled with the section's own surface colour and drawn over
 * the bottom of the section above (so tones meet on a curve, not a hard
 * line). A thin electric-blue light runs along the curve.
 *
 * Place it as the first child of a `relative` section. Purely decorative;
 * its height is fixed, so it never shifts layout. `glowId` must be unique
 * on the page (SVG gradient ids are global).
 */
export function SectionEdge({ glowId }: { glowId: string }) {
  const curve = "M0 78 C 540 77 980 60 1440 8";
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 bottom-[calc(100%-1px)] h-[clamp(1.75rem,4.5vw,4rem)] text-surface"
    >
      <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="absolute inset-0 size-full overflow-visible">
        <defs>
          <linearGradient id={glowId} x1="0" x2="1440" y1="0" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#5a8bff" stopOpacity="0" />
            <stop offset="0.55" stopColor="#5a8bff" stopOpacity="0.55" />
            <stop offset="0.85" stopColor="#93b3ff" stopOpacity="0.9" />
            <stop offset="1" stopColor="#93b3ff" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        <path d={`${curve} L1440 81 L0 81 Z`} fill="currentColor" />
        <path
          d={curve}
          fill="none"
          stroke={`url(#${glowId})`}
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
          className="[filter:drop-shadow(0_0_5px_rgb(47_107_255/0.8))]"
        />
      </svg>
    </div>
  );
}
