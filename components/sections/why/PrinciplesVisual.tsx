/*
 * Compact diagram for the Why Xentra sticky column (desktop only): one node
 * per approach statement, each linked to a shared centre — the statements
 * work together rather than as separate claims. Numbers match the list.
 * Lines use pathLength=1 so MotionRoot can draw them in ([data-draw]).
 */
export function PrinciplesVisual({ count }: { count: number }) {
  const cx = 140;
  const cy = 140;
  const r = 100;
  const nodes = Array.from({ length: count }, (_, i) => {
    const angle = (-90 + (360 / count) * i + 45) * (Math.PI / 180);
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  });

  return (
    <svg aria-hidden viewBox="0 0 280 280" className="mt-14 hidden w-full max-w-[17.5rem] lg:block">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--xt-silver-300)" strokeOpacity="0.14" strokeDasharray="3 5" />
      <circle cx={cx} cy={cy} r={r * 0.45} fill="none" stroke="var(--xt-silver-300)" strokeOpacity="0.1" />
      {nodes.map((n, i) => (
        <path
          key={`l${i}`}
          data-draw
          d={`M${cx} ${cy} L${n.x.toFixed(1)} ${n.y.toFixed(1)}`}
          pathLength={1}
          strokeDasharray="1"
          stroke="var(--xt-blue-400)"
          strokeOpacity="0.55"
          strokeWidth="1"
          fill="none"
        />
      ))}
      <circle cx={cx} cy={cy} r="20" fill="var(--xt-navy-900)" stroke="var(--xt-blue-500)" strokeOpacity="0.7" />
      <circle cx={cx} cy={cy} r="5" fill="var(--xt-blue-400)" />
      {nodes.map((n, i) => (
        <g key={`n${i}`}>
          <circle cx={n.x} cy={n.y} r="17" fill="var(--xt-navy-950)" stroke="var(--xt-silver-300)" strokeOpacity="0.4" />
          <text
            x={n.x}
            y={n.y + 3.5}
            textAnchor="middle"
            fontSize="10"
            fontFamily="var(--font-geist-mono)"
            fill="var(--xt-silver-100)"
          >
            {String(i + 1).padStart(2, "0")}
          </text>
        </g>
      ))}
    </svg>
  );
}
