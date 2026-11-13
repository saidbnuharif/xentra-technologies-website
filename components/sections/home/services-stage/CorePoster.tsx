/*
 * The central energy core, still: a particle shell drawn as SVG (a
 * Fibonacci sphere with a gentle wave in its radius, tilted, front points
 * blue and brighter, back points silver and fainter). It is what shows
 * without WebGL, with reduced motion, and before the 3D core is ready.
 */
const N = 380;
const R = 128;
const C = 160;
const TILT = 0.42;

function points() {
  const golden = Math.PI * (3 - Math.sqrt(5));
  const out: { x: number; y: number; z: number }[] = [];
  for (let i = 0; i < N; i++) {
    const y = 1 - (i / (N - 1)) * 2;
    const ring = Math.sqrt(1 - y * y);
    const t = golden * i;
    let x = Math.cos(t) * ring;
    let z = Math.sin(t) * ring;
    // Energy wave: the shell breathes along its latitude.
    const k = 1 + 0.06 * Math.sin(y * 7 + t * 0.15);
    // Tilt towards the viewer.
    const y2 = y * Math.cos(TILT) - z * Math.sin(TILT);
    z = y * Math.sin(TILT) + z * Math.cos(TILT);
    x *= k;
    out.push({ x: C + x * R, y: C + y2 * k * R, z });
  }
  return out.sort((a, b) => a.z - b.z);
}

const PTS = points();
const round = (n: number) => Math.round(n * 10) / 10;

export function CorePoster({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden data-mark-poster viewBox="0 0 320 320" className={className}>
      <defs>
        <radialGradient id="core-glow">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="0.35" stopColor="#cfe0ff" stopOpacity="0.6" />
          <stop offset="0.7" stopColor="#a9a6f2" stopOpacity="0.16" />
          <stop offset="1" stopColor="#a9a6f2" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx={C} cy={C} r={R * 0.95} fill="url(#core-glow)" />
      <ellipse cx={C} cy={C} rx={R * 1.22} ry={R * 0.32} fill="none" stroke="#8995a5" strokeOpacity="0.35" transform={`rotate(-14 ${C} ${C})`} />
      <ellipse cx={C} cy={C} rx={R * 1.1} ry={R * 0.5} fill="none" stroke="#3478f6" strokeOpacity="0.22" strokeDasharray="2 5" transform={`rotate(22 ${C} ${C})`} />
      {PTS.map((p, i) => {
        const front = (p.z + 1) / 2;
        return (
          <circle
            key={i}
            cx={round(p.x)}
            cy={round(p.y)}
            r={round(0.7 + front * 1.5)}
            fill={front > 0.5 ? "#3478f6" : "#8995a5"}
            fillOpacity={round(0.18 + front * 0.72)}
          />
        );
      })}
    </svg>
  );
}
