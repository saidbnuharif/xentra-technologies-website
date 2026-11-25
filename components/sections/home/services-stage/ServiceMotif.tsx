import type { ServiceKey } from "./stage-layout";

/*
 * Holographic line art for each service's screen (decorative): thin white
 * strokes and nodes, one idea per service.
 */
const stroke = { fill: "none", stroke: "#fff", strokeWidth: 1.4, strokeLinecap: "round", strokeLinejoin: "round" } as const;

function Node({ x, y, r = 2.6 }: { x: number; y: number; r?: number }) {
  return <circle cx={x} cy={y} r={r} fill="#fff" />;
}

const MOTIFS: Record<ServiceKey, React.ReactNode> = {
  // A browser window with layout blocks.
  "website-development": (
    <g {...stroke}>
      <rect x="58" y="14" width="124" height="66" rx="6" />
      <path d="M58 26h124" />
      <circle cx="66" cy="20" r="1.6" fill="#fff" />
      <circle cx="72" cy="20" r="1.6" fill="#fff" />
      <rect x="68" y="34" width="44" height="34" rx="3" strokeOpacity="0.9" />
      <path d="M122 36h48M122 46h38M122 56h44M122 66h26" strokeOpacity="0.8" />
    </g>
  ),
  // A rising line over soft bars.
  "digital-marketing": (
    <g {...stroke}>
      <path d="M40 78h160" strokeOpacity="0.6" />
      {[58, 84, 110, 136, 162].map((x, i) => (
        <rect key={x} x={x} y={70 - i * 9} width="12" height={8 + i * 9} rx="2" strokeOpacity="0.55" />
      ))}
      <path d="M50 64 82 52l26 8 30-24 26-6 26-16" />
      <Node x={82} y={52} />
      <Node x={138} y={36} />
      <Node x={190} y={14} r={3.4} />
    </g>
  ),
  // A circuit of connected nodes.
  "ai-automation": (
    <g {...stroke}>
      <path d="M30 46h34l14-18h36l12 18h22l16-22h44M78 28v-12M126 46l14 22h40M64 46l16 24h22" strokeOpacity="0.85" />
      <Node x={64} y={46} />
      <Node x={78} y={28} />
      <Node x={114} y={28} />
      <Node x={126} y={46} r={4} />
      <Node x={164} y={24} />
      <Node x={180} y={68} />
      <Node x={102} y={70} />
      <circle cx="126" cy="46" r="10" strokeOpacity="0.5" />
    </g>
  ),
  // A search lens over ranked results.
  "seo-lead-generation": (
    <g {...stroke}>
      <path d="M44 22h62M44 36h48M44 50h56M44 64h40" strokeOpacity="0.6" />
      <circle cx="150" cy="40" r="22" />
      <circle cx="150" cy="40" r="32" strokeOpacity="0.35" />
      <path d="m166 56 18 18" strokeWidth="3" />
      <path d="M140 46l8-8 6 5 8-10" />
    </g>
  ),
  // A target with a growth arrow.
  "business-consultancy": (
    <g {...stroke}>
      <circle cx="96" cy="46" r="30" strokeOpacity="0.5" />
      <circle cx="96" cy="46" r="18" strokeOpacity="0.75" />
      <Node x={96} y={46} r={4} />
      <path d="M96 46 168 18" />
      <path d="m156 16 12 2-4 11" />
      <path d="M150 74h44M150 62h30" strokeOpacity="0.6" />
    </g>
  ),
  // Overlapping swatches and an orbit.
  "branding-social-media": (
    <g {...stroke}>
      <circle cx="92" cy="46" r="22" />
      <circle cx="120" cy="46" r="22" strokeOpacity="0.8" />
      <circle cx="148" cy="46" r="22" strokeOpacity="0.6" />
      <ellipse cx="120" cy="46" rx="74" ry="18" strokeOpacity="0.35" />
      <Node x={46} y={46} />
      <Node x={194} y={46} />
    </g>
  ),
};

export function ServiceMotif({ service }: { service: ServiceKey }) {
  return (
    <svg aria-hidden viewBox="0 0 240 92" className="h-full w-full">
      {MOTIFS[service]}
    </svg>
  );
}
