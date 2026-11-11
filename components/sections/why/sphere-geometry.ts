/*
 * Network sphere geometry (shared by the server render and the client
 * animation). Everything is in a 400 × 400 viewBox, sphere centred at
 * (200, 200). The sphere turns about its vertical axis (yaw `t`) and is
 * viewed from slightly above (PITCH), so latitudes read as ellipses.
 */

export const VIEW = 400;
export const C = 200;
export const R = 132;
const PITCH = 0.38;
const cosP = Math.cos(PITCH);
const sinP = Math.sin(PITCH);

export type Node = { lat: number; lon: number };

/** Deterministic pseudo-random sequence (same nodes on server and client). */
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const rand = seeded(20261111);
export const NODES: readonly Node[] = Array.from({ length: 26 }, () => ({
  lat: Math.asin(rand() * 1.7 - 0.85),
  lon: rand() * Math.PI * 2,
}));

const unit = (n: Node) => [Math.cos(n.lat) * Math.sin(n.lon), Math.sin(n.lat), Math.cos(n.lat) * Math.cos(n.lon)];

/** Pairs of nearby nodes to connect (by distance on the sphere). */
export const LINKS: readonly [number, number][] = (() => {
  const out: [number, number][] = [];
  NODES.forEach((a, i) => {
    const ua = unit(a);
    NODES.forEach((b, j) => {
      if (j <= i) return;
      const ub = unit(b);
      const d = Math.hypot(ua[0] - ub[0], ua[1] - ub[1], ua[2] - ub[2]);
      if (d < 0.62) out.push([i, j]);
    });
  });
  return out;
})();

/** Project a point on the unit sphere, turned by yaw t. z > 0 faces the viewer. */
export function project(lat: number, lon: number, t: number) {
  const x = Math.cos(lat) * Math.sin(lon + t);
  const y = Math.sin(lat);
  const z = Math.cos(lat) * Math.cos(lon + t);
  const y2 = y * cosP - z * sinP;
  const z2 = y * sinP + z * cosP;
  return { x: C + R * x, y: C - R * y2, z: z2 };
}

/** Latitude rings (static under yaw): ellipses. */
export const LATITUDES = [-0.95, -0.5, 0, 0.5, 0.95].map((lat) => ({
  cx: C,
  cy: C - R * Math.sin(lat) * cosP,
  rx: R * Math.cos(lat),
  ry: R * Math.cos(lat) * sinP,
}));

/** Meridian paths for yaw t (front half only reads clearly; back is faint). */
export const MERIDIAN_COUNT = 6;
export function meridianPath(k: number, t: number) {
  const lon = (k / MERIDIAN_COUNT) * Math.PI;
  let d = "";
  for (let s = 0; s <= 32; s++) {
    const lat = -Math.PI / 2 + (s / 32) * Math.PI;
    const p = project(lat, lon, t);
    d += `${s ? "L" : "M"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
  }
  for (let s = 32; s >= 0; s--) {
    const lat = -Math.PI / 2 + (s / 32) * Math.PI;
    const p = project(lat, lon + Math.PI, t);
    d += `L${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
  }
  return d;
}

/** Labels around the sphere: chip position (% of stage) and limb anchor. */
export const LABELS = [
  { text: "Strategy", chip: { x: 15, y: 22 }, angle: -145 },
  { text: "Technology", chip: { x: 82, y: 15 }, angle: -40 },
  { text: "Automation", chip: { x: 84, y: 63 }, angle: 12 },
  { text: "Growth", chip: { x: 17, y: 79 }, angle: 150 },
].map((l) => {
  const a = (l.angle * Math.PI) / 180;
  return { ...l, anchor: { x: C + R * Math.cos(a), y: C + R * Math.sin(a) } };
});

export const STATIC_YAW = 0.6;
