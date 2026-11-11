/*
 * One drawn glyph per business domain. Strokes use pathLength=1 so the shared
 * MotionRoot can draw them in ([data-draw]); without JS they render solid.
 * Decorative — the domain name next to each glyph carries the meaning.
 */

type GlyphProps = { domain: string };

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  pathLength: 1,
  strokeDasharray: "1",
  "data-draw": true,
};

const accent = { ...stroke, stroke: "var(--xt-blue-400)" };

function Presence() {
  // Layered interface frames: how a business appears across screens.
  return (
    <>
      <rect x="6" y="14" width="38" height="28" rx="4" {...stroke} />
      <path d="M6 21 H44" {...stroke} />
      <rect x="20" y="26" width="38" height="28" rx="4" {...accent} />
      <path d="M20 33 H58 M27 41 H46 M27 47 H40" {...accent} />
    </>
  );
}

function Growth() {
  // Rising path through stages: reach, engagement, enquiry.
  return (
    <>
      <path d="M6 56 H58 M6 56 V8" {...stroke} />
      <path d="M10 48 C22 46 26 34 34 30 S48 18 56 12" {...accent} />
      <circle cx="34" cy="30" r="3" {...accent} />
      <circle cx="56" cy="12" r="3" {...accent} />
    </>
  );
}

function Intelligent() {
  // Connected nodes around a decision point.
  return (
    <>
      <path d="M32 32 L12 14 M32 32 L52 14 M32 32 L12 50 M32 32 L52 50" {...stroke} />
      <circle cx="12" cy="14" r="4" {...stroke} />
      <circle cx="52" cy="14" r="4" {...stroke} />
      <circle cx="12" cy="50" r="4" {...stroke} />
      <circle cx="52" cy="50" r="4" {...stroke} />
      <circle cx="32" cy="32" r="8" {...accent} />
    </>
  );
}

function Systems() {
  // Stacked operational layers working as one system.
  return (
    <>
      <path d="M32 10 L56 22 L32 34 L8 22 Z" {...accent} />
      <path d="M8 32 L32 44 L56 32" {...stroke} />
      <path d="M8 42 L32 54 L56 42" {...stroke} />
    </>
  );
}

const glyphs: Record<string, () => React.JSX.Element> = {
  "digital-presence": Presence,
  "digital-growth": Growth,
  "intelligent-technology": Intelligent,
  "business-systems": Systems,
};

export function DomainGlyph({ domain }: GlyphProps) {
  const Glyph = glyphs[domain];
  if (!Glyph) return null;
  return (
    // Hover (inside a DomainMatrix column): the glyph lifts slightly and its
    // silver strokes turn blue. The parallax wrapper around it is separate.
    <svg
      aria-hidden
      viewBox="0 0 64 64"
      className="size-14 text-silver-300 transition-[color,translate] duration-300 ease-out group-hover/domain:-translate-y-1 group-hover/domain:text-blue-300 lg:size-16"
    >
      <Glyph />
    </svg>
  );
}
