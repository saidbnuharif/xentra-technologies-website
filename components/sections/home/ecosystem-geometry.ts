/*
 * The business ecosystem around the About X (AboutEcosystem), in a 0–1000
 * space 1.48× the X slot. The mark fills roughly x 165–835, y 355–645,
 * centred on (500, 500), so the ring of nodes sits clear of it.
 *
 * Twelve nodes on an ellipse around the mark; three of them are hubs named
 * from Xentra's approved line "Strategy. Technology. Growth." Spokes run
 * from the X to the hubs; links join the ring and tie each hub to a node
 * two steps away. Deterministic and rounded, so server and client render
 * identical SVG.
 */
export const C = 500;
const r1 = (v: number) => Math.round(v * 10) / 10;

const RADIUS = [1, 0.95, 1, 0.97, 1, 0.94, 1, 0.95, 1, 0.97, 1, 0.94];
export const NODES = RADIUS.map((k, i) => {
  const a = ((-90 + i * 30) * Math.PI) / 180;
  return { x: r1(C + Math.cos(a) * 455 * k), y: r1(C + Math.sin(a) * 432 * k) };
});

/** Hub node indices, in the order of the approved line's three words. */
export const HUBS = [10, 2, 6] as const; // upper left, upper right, bottom

export const RING: [number, number][] = NODES.map((_, i) => [i, (i + 1) % NODES.length]);
export const CROSS: [number, number][] = [
  [10, 0],
  [2, 4],
  [6, 8],
];
