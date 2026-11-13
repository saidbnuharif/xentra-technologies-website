/*
 * Energy curve between the hero X and the About X (XStage).
 *
 * One path in the stage's own pixel space (origin: the stage's top-left
 * corner), always heading downward, so any height on the page maps to a
 * single point along it. It leaves from under the hero X, sweeps out
 * beside the hero text, crosses over above the About text (never through
 * it), drops into the centre of the About X and runs on beneath it.
 */

type Pt = { x: number; y: number };

export type CurveInput = {
  /** Stage width. */
  width: number;
  /** Centre of the hero X slot. */
  hero: Pt;
  /** Bottom edge of the hero section. */
  heroBottom: number;
  /** Centre of the About X slot, and half its height. */
  about: Pt;
  aboutHalf: number;
  /** Top and bottom edges of the About section. */
  aboutTop: number;
  aboutBottom: number;
  /** Narrow layout (single column: X above the text). */
  compact: boolean;
};

const r1 = (v: number) => Math.round(v * 10) / 10;
const c = (...pts: Pt[]) => pts.map((p) => `${r1(p.x)} ${r1(p.y)}`).join(" ");

export function curvePath(o: CurveInput) {
  const { width: W, hero: H, heroBottom, about: A, aboutHalf, aboutTop, aboutBottom, compact } = o;
  // Beside the hero text: off to the right, inside the page edge.
  const side = compact ? W - 14 : Math.min(W - 40, H.x + Math.min(W * 0.36, 600));
  const P1 = { x: side, y: heroBottom - (compact ? 40 : 90) };
  const d1 = P1.y - H.y;
  const start = [`M${c(H)}`, `C${c({ x: H.x + W * 0.04, y: H.y + d1 * 0.38 }, { x: side, y: H.y + d1 * 0.42 }, P1)}`];

  if (compact) {
    // X above the text: swing straight into it, then hug the left edge
    // past the text.
    const edge = 6;
    const E1 = { x: edge, y: A.y + aboutHalf * 0.95 };
    const d2 = A.y - P1.y;
    return [
      ...start,
      `C${c({ x: side, y: P1.y + d2 * 0.45 }, { x: A.x + (side - A.x) * 0.35, y: A.y - d2 * 0.28 }, A)}`,
      `C${c({ x: A.x - W * 0.15, y: A.y + aboutHalf * 0.3 }, { x: edge, y: A.y + aboutHalf * 0.5 }, E1)}`,
      `L${c({ x: edge, y: aboutBottom })}`,
    ].join(" ");
  }

  // Two columns (X left, text right): cross over in the gap above the text,
  // then drop into the X from the upper right.
  const Q = { x: A.x + (side - A.x) * 0.45, y: aboutTop + 36 };
  const E = { x: Math.max(24, A.x - W * 0.22), y: aboutBottom };
  const d3 = E.y - A.y;
  return [
    ...start,
    `C${c({ x: side, y: P1.y + (Q.y - P1.y) * 0.6 }, { x: side - (side - Q.x) * 0.4, y: Q.y }, Q)}`,
    `C${c({ x: Q.x - (Q.x - A.x) * 0.55, y: Q.y }, { x: A.x + 40, y: A.y - (A.y - Q.y) * 0.5 }, A)}`,
    `C${c({ x: A.x - (A.x - E.x) * 0.25, y: A.y + d3 * 0.3 }, { x: E.x + W * 0.04, y: E.y - d3 * 0.35 }, E)}`,
  ].join(" ");
}

/** Length along the path ↔ height, sampled once per layout. */
export function sampleByHeight(path: SVGPathElement, steps = 360) {
  const total = path.getTotalLength();
  const len = new Float32Array(steps + 1);
  const ys = new Float32Array(steps + 1);
  let maxY = -Infinity;
  for (let i = 0; i <= steps; i++) {
    const l = (total * i) / steps;
    len[i] = l;
    // Running maximum keeps the table monotonic even where the path runs
    // level (the cross-over).
    maxY = Math.max(maxY, path.getPointAtLength(l).y);
    ys[i] = maxY;
  }
  /** Length of path above height y (0 before the start, total past the end). */
  const lengthAtY = (y: number) => {
    if (y <= ys[0]) return 0;
    if (y >= ys[steps]) return total;
    let lo = 0;
    let hi = steps;
    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1;
      if (ys[mid] <= y) lo = mid;
      else hi = mid;
    }
    const t = ys[hi] === ys[lo] ? 0 : (y - ys[lo]) / (ys[hi] - ys[lo]);
    return len[lo] + (len[hi] - len[lo]) * t;
  };
  return { total, lengthAtY };
}
