/*
 * Compact diagram for the Why Xentra sticky column (desktop only): one node
 * per approach statement, each linked to a shared centre — the statements
 * work together rather than as separate claims. Numbers match the list.
 * Lines use pathLength=1 so MotionRoot can draw them in ([data-draw]).
 *
 * Interaction (CSS only): hovering statement N in the list
 * ([data-reason="N"]) highlights node N and its connector here, via :has()
 * on the section. The rules are generated for exactly `count` nodes.
 */

const ACTIVE = "var(--xt-blue-400)";

function highlightCss(count: number): string {
  const base = `#why-xentra [data-node-ring], #why-xentra [data-node-line], #why-xentra [data-node-label] {
  transition: stroke 300ms ease-out, stroke-opacity 300ms ease-out, stroke-width 300ms ease-out, fill 300ms ease-out;
}`;
  const rules = Array.from({ length: count }, (_, i) => {
    const when = `#why-xentra:has([data-reason="${i}"]:hover)`;
    return `${when} [data-node-ring="${i}"] { stroke: ${ACTIVE}; stroke-opacity: 1; fill: var(--xt-navy-800); }
${when} [data-node-line="${i}"] { stroke-opacity: 1; stroke-width: 1.75; }
${when} [data-node-label="${i}"] { fill: #fff; }`;
  });
  return [base, ...rules].join("\n");
}

export function PrinciplesVisual({ count }: { count: number }) {
  const cx = 140;
  const cy = 140;
  const r = 100;
  const nodes = Array.from({ length: count }, (_, i) => {
    const angle = (-90 + (360 / count) * i + 45) * (Math.PI / 180);
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  });

  return (
    <>
      <style>{highlightCss(count)}</style>
      <svg aria-hidden viewBox="0 0 280 280" className="mt-14 hidden w-full max-w-[17.5rem] lg:block">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--xt-silver-300)" strokeOpacity="0.14" strokeDasharray="3 5" />
        <circle cx={cx} cy={cy} r={r * 0.45} fill="none" stroke="var(--xt-silver-300)" strokeOpacity="0.1" />
        {nodes.map((n, i) => (
          <path
            key={`l${i}`}
            data-draw
            data-node-line={i}
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
            <circle
              data-node-ring={i}
              cx={n.x}
              cy={n.y}
              r="17"
              fill="var(--xt-navy-950)"
              stroke="var(--xt-silver-300)"
              strokeOpacity="0.4"
            />
            <text
              data-node-label={i}
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
    </>
  );
}
