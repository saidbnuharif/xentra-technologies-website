/*
 * Geometry and colours of the Xentra "X" mark, measured from the official
 * logo file (public/images/xentra-logo.svg.jpeg, 1254 × 1254 px) — edge
 * positions traced row by row, colours sampled from the artwork. Not
 * redrawn by eye: every edge runs at 45° and the mark is symmetric about
 * its horizontal centre line (y = 474), as in the original.
 *
 * Coordinates are in the logo's pixel space (y down). The 3D scene and the
 * SVG poster both build from this single source.
 */

export type Point = readonly [x: number, y: number];

/** Left silver chevron. */
export const SILVER: readonly Point[] = [
  [373, 302],
  [519, 302],
  [687, 474],
  [519, 646],
  [373, 646],
  [545, 474],
];

/** Upper-right blue blade. */
export const BLUE_TOP: readonly Point[] = [
  [755, 302],
  [884, 302],
  [721, 465],
  [657, 401],
];

/** Lower-right blue blade (mirror of the upper one). */
export const BLUE_BOTTOM: readonly Point[] = [
  [657, 547],
  [721, 483],
  [884, 646],
  [755, 646],
];

/** Bounding box of the whole mark, in logo pixels. */
export const MARK_BOX = { x: 373, y: 302, width: 511, height: 344 } as const;
export const MARK_CENTRE = { x: MARK_BOX.x + MARK_BOX.width / 2, y: 474 } as const;

/** Framing shared by the 3D scene, the SVG poster and the stage: the mark
 *  padded this much (width, height) is fitted to its slot. */
export const MARK_FIT = { w: 1.25, h: 1.32 } as const;

/** Sampled colours (top → bottom of each piece). */
export const MARK_COLOURS = {
  silver: ["#fefefe", "#c4c5c8", "#929294", "#616164"],
  blueTop: ["#0a8ffd", "#0171d7"],
  blueBottom: ["#0257c4", "#00185f"],
} as const;

export const toPath = (points: readonly Point[]) =>
  `M${points.map(([x, y]) => `${x} ${y}`).join("L")}Z`;
