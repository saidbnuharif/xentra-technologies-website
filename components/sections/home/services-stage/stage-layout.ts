/*
 * Services stage (Home): per-service composition and visual identity.
 *
 * Desktop places the six panels around the central screen in CSS 3D: three
 * on the left turned towards the centre, three on the right mirrored, each
 * at its own depth and height. Smaller screens ignore these values and
 * stack the panels flat.
 */
export type ServiceKey =
  | "website-development"
  | "digital-marketing"
  | "ai-automation"
  | "seo-lead-generation"
  | "business-consultancy"
  | "branding-social-media";

export type PanelPlacement = {
  side: "left" | "right";
  /** Offset from the stage's side edge and top, in % of the stage. */
  x: string;
  y: string;
  /** Turn towards the centre (deg), roll (deg), depth (px). */
  ry: number;
  rz: number;
  z: number;
  /** Float period (s) for the ambient motion stage. */
  float: number;
};

export const PLACEMENTS: readonly PanelPlacement[] = [
  { side: "left", x: "3%", y: "2%", ry: 24, rz: -1.5, z: -40, float: 7.4 },
  { side: "left", x: "0%", y: "36%", ry: 20, rz: 1, z: 50, float: 8.6 },
  { side: "left", x: "6%", y: "68%", ry: 15, rz: -1, z: -10, float: 6.9 },
  { side: "right", x: "3%", y: "0%", ry: -24, rz: 1.5, z: -30, float: 8.1 },
  { side: "right", x: "0%", y: "34%", ry: -20, rz: -1, z: 60, float: 7.1 },
  { side: "right", x: "5%", y: "66%", ry: -15, rz: 1, z: 0, float: 9.2 },
];

/** Each service's screen: an icy gradient with a touch of lavender light. */
export const SCREENS: Record<ServiceKey, string> = {
  "website-development": "linear-gradient(135deg,#eaf2ff 0%,#a9c8ff 55%,#6f9cf8 100%)",
  "digital-marketing": "linear-gradient(135deg,#e4edff 0%,#93b6fb 50%,#b4adf0 100%)",
  "ai-automation": "linear-gradient(135deg,#e7e5fb 0%,#a8b7f7 45%,#5f92f7 100%)",
  "seo-lead-generation": "linear-gradient(135deg,#e6f4fc 0%,#a3d0f2 50%,#78a6f6 100%)",
  "business-consultancy": "linear-gradient(135deg,#f1f4f9 0%,#c7ced8 45%,#8db0f4 100%)",
  "branding-social-media": "linear-gradient(135deg,#efebfc 0%,#bcc5f6 50%,#86aef8 100%)",
};
