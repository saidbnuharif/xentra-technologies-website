/*
 * The 3D X and, in the hero, its "digital universe".
 *
 * Loaded on demand by XStage (dynamic import), so three.js never blocks the
 * first paint or the headline. One scene, one canvas per page: XStage moves
 * the canvas between the page's X slots.
 *
 * The X: the official mark extruded from the geometry traced from the logo
 * (mark-geometry.ts) — silver chevron and two blue blades, exact
 * proportions — in polished metal (clearcoat, reflections from a studio
 * environment) and blue glass-metal with a controlled inner glow.
 *
 * The environment (hero only, setEnvironment): layers of depth around the X
 *  - far: star dust and a slowly turning network of connected nodes with
 *    signals running along its links, fading into navy fog;
 *  - middle: floating glass panels with lit edges and slim metal rods,
 *    two small holographic panels, soft volumetric light shafts;
 *  - around the X: orbital rings (one segmented), energy ribbons with light
 *    flowing along them, a halo and dust;
 *  - near: a few out-of-focus particles.
 * The canvas sits BEHIND the hero text (see Hero.tsx), and the
 * environment is kept to the middle band, clear of the copy.
 *
 * Motion
 *  - Entrance: the camera glides in from further back and below while the
 *    X assembles (chevron and blades slide together), the light rises, the
 *    ribbons draw themselves and the environment fades in from the fog.
 *  - Idle: slow float; every few seconds a highlight sweeps across the X's
 *    metal; the ribbons' light flows; nodes signal. Desktop pointer: a
 *    restrained camera parallax (layers at different depths shift by
 *    different amounts) and a light that follows the cursor.
 *  - setExit (hero scroll): the camera moves down and forward toward the
 *    About section, the ribbons' light speeds up, the environment fades and
 *    the X sinks and dissolves into light.
 *  - popIn / popOut: the X re-emerging in another section (About, the
 *    contact finale) with an overshoot, a flash and sparks.
 *  - Reduced motion: one static, finished frame. Rendering pauses while the
 *    canvas is off screen or the tab is hidden; smaller screens render at
 *    30fps with fewer elements and a lower pixel ratio.
 */
import {
  ACESFilmicToneMapping,
  AdditiveBlending,
  AmbientLight,
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  CatmullRomCurve3,
  Color,
  DirectionalLight,
  EdgesGeometry,
  ExtrudeGeometry,
  FogExp2,
  Group,
  LineBasicMaterial,
  LineSegments,
  type Material,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  PMREMGenerator,
  PointLight,
  Points,
  PointsMaterial,
  RepeatWrapping,
  Scene,
  Shape,
  Sprite,
  SpriteMaterial,
  SRGBColorSpace,
  TorusGeometry,
  TubeGeometry,
  Vector3,
  WebGLRenderer,
} from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { gsap } from "@/components/motion/gsap";
import { BLUE_BOTTOM, BLUE_TOP, MARK_BOX, MARK_CENTRE, MARK_COLOURS, MARK_FIT, SILVER, type Point } from "./mark-geometry";

export type MarkSceneOptions = {
  reducedMotion: boolean;
  finePointer: boolean;
  lowPower: boolean;
  /** Start with the hero environment on (and play its entrance). */
  environment: boolean;
  /** Called if WebGL fails or the context is lost (show the SVG poster). */
  onFallback: () => void;
};

export type MarkScene = {
  /** Hero scroll exit, 0 (at rest) → 1 (dissolved). Smoothed internally. */
  setExit: (value: number, immediate?: boolean) => void;
  /** Dramatic entrance where the mark re-emerges (About, contact finale). */
  popIn: () => void;
  /** Quick shrink-away (scrolling back up); `done` runs once it is gone. */
  popOut: (done: () => void) => void;
  /** Hero environment on/off (fades). */
  setEnvironment: (on: boolean) => void;
  /** Re-measure and re-render one frame (after the stage moved or resized). */
  redraw: () => void;
  dispose: () => void;
};

const UNIT = 1 / 100; // logo pixels → scene units (mark ≈ 5.1 × 3.4)
const DEPTH = 0.5;
const REST = { rotX: 0.06, rotY: -0.34 };
const FOV = 30;

/* --- Helpers ---------------------------------------------------------- */

/** Small deterministic random generator (same composition every visit). */
function seeded(seed: number) {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function extrude(points: readonly Point[]) {
  const shape = new Shape();
  points.forEach(([x, y], i) => {
    const X = (x - MARK_CENTRE.x) * UNIT;
    const Y = -(y - MARK_CENTRE.y) * UNIT;
    if (i === 0) shape.moveTo(X, Y);
    else shape.lineTo(X, Y);
  });
  shape.closePath();
  const geometry = new ExtrudeGeometry(shape, {
    depth: DEPTH,
    bevelEnabled: true,
    bevelThickness: 0.07,
    bevelSize: 0.05,
    bevelSegments: 4,
    curveSegments: 1,
  });
  geometry.translate(0, 0, -DEPTH / 2);
  return geometry;
}

/** Vertical colour gradient baked into vertex colours (top → bottom stops). */
function paintGradient(geometry: BufferGeometry, stops: readonly string[], top: number, bottom: number) {
  const position = geometry.getAttribute("position");
  const colours = stops.map((hex) => new Color(hex));
  const out = new Float32Array(position.count * 3);
  const c = new Color();
  for (let i = 0; i < position.count; i++) {
    const t = Math.min(1, Math.max(0, (top - position.getY(i)) / (top - bottom)));
    const scaled = t * (colours.length - 1);
    const k = Math.min(colours.length - 2, Math.floor(scaled));
    c.copy(colours[k]).lerp(colours[k + 1], scaled - k);
    out.set([c.r, c.g, c.b], i * 3);
  }
  geometry.setAttribute("color", new BufferAttribute(out, 3));
}

function canvasTexture(width: number, height: number, draw: (ctx: CanvasRenderingContext2D) => void) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  draw(canvas.getContext("2d")!);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}

/** Soft radial sprite texture (halo, comet heads, dust). */
function glowTexture(inner: string, outer = "rgba(0,0,0,0)") {
  return canvasTexture(128, 128, (ctx) => {
    const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, inner);
    g.addColorStop(0.35, inner.replace(/[\d.]+\)$/, "0.35)"));
    g.addColorStop(1, outer);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
  });
}

/** Light flowing along a ribbon: a faint body with a bright pulse. */
function flowTexture() {
  const texture = canvasTexture(256, 4, (ctx) => {
    const g = ctx.createLinearGradient(0, 0, 256, 0);
    g.addColorStop(0, "rgba(47,107,255,0.10)");
    g.addColorStop(0.5, "rgba(70,125,255,0.22)");
    g.addColorStop(0.78, "rgba(150,190,255,0.75)");
    g.addColorStop(0.84, "rgba(235,243,255,1)");
    g.addColorStop(0.9, "rgba(110,155,255,0.45)");
    g.addColorStop(1, "rgba(47,107,255,0.10)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 256, 4);
  });
  texture.wrapS = RepeatWrapping;
  return texture;
}

/** A soft vertical beam of light (volumetric shaft). */
function shaftTexture() {
  return canvasTexture(64, 256, (ctx) => {
    const v = ctx.createLinearGradient(0, 0, 0, 256);
    v.addColorStop(0, "rgba(120,160,255,0)");
    v.addColorStop(0.25, "rgba(120,160,255,0.9)");
    v.addColorStop(1, "rgba(120,160,255,0)");
    ctx.fillStyle = v;
    ctx.fillRect(0, 0, 64, 256);
    // Soften the sides.
    ctx.globalCompositeOperation = "destination-in";
    const h = ctx.createLinearGradient(0, 0, 64, 0);
    h.addColorStop(0, "rgba(0,0,0,0)");
    h.addColorStop(0.5, "rgba(0,0,0,1)");
    h.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = h;
    ctx.fillRect(0, 0, 64, 256);
  });
}

/** Holographic panel: a thin lit frame with a few data rules. */
function holoTexture() {
  return canvasTexture(320, 200, (ctx) => {
    const r = 18;
    ctx.beginPath();
    ctx.roundRect(4, 4, 312, 192, r);
    ctx.fillStyle = "rgba(47,107,255,0.10)";
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(140,180,255,0.9)";
    ctx.stroke();
    ctx.fillStyle = "rgba(170,200,255,0.9)";
    ctx.fillRect(28, 34, 90, 6);
    ctx.fillStyle = "rgba(120,160,255,0.55)";
    [0.82, 0.6, 0.72].forEach((w, i) => ctx.fillRect(28, 70 + i * 24, 264 * w, 4));
    ctx.strokeStyle = "rgba(120,160,255,0.7)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(28, 168);
    [60, 92, 124, 156, 188, 220, 252, 290].forEach((x, i) => ctx.lineTo(x, 168 - [8, 20, 14, 30, 22, 36, 28, 40][i]));
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(286, 40, 9, 0, Math.PI * 2);
    ctx.stroke();
  });
}

/** Orbit ring whose brightness fades around its circumference. */
function ring(radius: number, tube: number, brightness: number, segments: number, arc = Math.PI * 2) {
  const geometry = new TorusGeometry(radius, tube, 6, segments, arc);
  const position = geometry.getAttribute("position");
  const colours = new Float32Array(position.count * 3);
  const base = new Color("#3d7dff");
  for (let i = 0; i < position.count; i++) {
    const angle = Math.atan2(position.getY(i), position.getX(i));
    // Brightest at the front-bottom of the ellipse, faint at the back.
    const k = brightness * (0.18 + 0.82 * Math.pow((1 + Math.cos(angle + Math.PI / 2)) / 2, 1.6));
    colours.set([base.r * k, base.g * k, base.b * k], i * 3);
  }
  geometry.setAttribute("color", new BufferAttribute(colours, 3));
  const material = new MeshBasicMaterial({
    vertexColors: true,
    transparent: true,
    blending: AdditiveBlending,
    depthWrite: false,
    fog: false,
  });
  return new Mesh(geometry, material);
}

const smoothstep = (a: number, b: number, v: number) => {
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/* --- Scene ------------------------------------------------------------ */

export function createMarkScene(
  canvas: HTMLCanvasElement,
  host: HTMLElement,
  options: MarkSceneOptions,
): MarkScene | null {
  const { reducedMotion, finePointer, lowPower, onFallback } = options;
  const rand = seeded(20251112);

  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  } catch {
    return null;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, lowPower ? 1.35 : 1.75));
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;
  renderer.setClearColor(0x000000, 0);

  const scene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  const environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = environment;
  scene.environmentIntensity = 1.15;
  const fog = new FogExp2(0x040817, 0.05);
  scene.fog = fog;

  const camera = new PerspectiveCamera(FOV, 1, 0.1, 140);
  camera.position.set(0, 0, 17);
  const disposables: { dispose: () => void }[] = [];
  const track = <T extends { dispose: () => void }>(item: T) => {
    disposables.push(item);
    return item;
  };

  /* Lights: white key from the upper left, electric-blue rim from behind
     right, a highlight that sweeps across the metal, and a cool light that
     follows the cursor on desktop. */
  scene.add(new AmbientLight(0x1a2a55, 0.7));
  const key = new DirectionalLight(0xffffff, 2.4);
  key.position.set(-4, 5, 6);
  scene.add(key);
  const fill = new DirectionalLight(0xdfe7ff, 1.3);
  fill.position.set(-1, 0.5, 9);
  scene.add(fill);
  const rim = new PointLight(0x2f6bff, 60, 0, 2);
  rim.position.set(4.5, -1.5, -3);
  const sweepLight = new PointLight(0xdbe8ff, 0, 0, 2);
  const cursorLight = new PointLight(0x8fb4ff, 0, 0, 2);

  /* Everything centred on the X (moved to the slot's centre). */
  const rig = new Group();
  scene.add(rig);
  rig.add(rim, sweepLight, cursorLight);

  /* --- The mark ----------------------------------------------------- */

  const mark = new Group();
  rig.add(mark);
  const top = (MARK_CENTRE.y - 302) * UNIT;
  const silverGeometry = track(extrude(SILVER));
  paintGradient(silverGeometry, MARK_COLOURS.silver, top, -top);
  // Not fully metallic: a pure mirror facing the camera reflects the dark
  // stage and reads black. High-but-partial metalness keeps the logo's
  // light-to-grey gradient, with chrome highlights from the clearcoat.
  const silverMaterial = new MeshPhysicalMaterial({
    vertexColors: true,
    metalness: 0.85,
    roughness: 0.2,
    clearcoat: 1,
    clearcoatRoughness: 0.08,
    envMapIntensity: 1.55,
    fog: false,
  });
  const silver = new Mesh(silverGeometry, silverMaterial);
  const blueTopGeometry = track(extrude(BLUE_TOP));
  paintGradient(blueTopGeometry, MARK_COLOURS.blueTop, top, (MARK_CENTRE.y - 465) * UNIT);
  const blueBottomGeometry = track(extrude(BLUE_BOTTOM));
  paintGradient(blueBottomGeometry, MARK_COLOURS.blueBottom, -(483 - MARK_CENTRE.y) * UNIT, -top);
  const blueMaterial = (emissive: number) =>
    new MeshPhysicalMaterial({
      vertexColors: true,
      metalness: 0.3,
      roughness: 0.26,
      envMapIntensity: 0.6,
      clearcoat: 0.8,
      clearcoatRoughness: 0.05,
      emissive: new Color("#0b4cff"),
      emissiveIntensity: emissive,
      fog: false,
    });
  const blueTopMaterial = blueMaterial(0.34);
  const blueBottomMaterial = blueMaterial(0.14);
  const blueTop = new Mesh(blueTopGeometry, blueTopMaterial);
  const blueBottom = new Mesh(blueBottomGeometry, blueBottomMaterial);
  mark.add(silver, blueTop, blueBottom);
  const pieceMaterials = [silverMaterial, blueTopMaterial, blueBottomMaterial];
  pieceMaterials.forEach(track);

  /* Halo behind the mark */
  const haloTexture = track(glowTexture("rgba(47,107,255,0.9)"));
  const halo = new Sprite(
    track(new SpriteMaterial({ map: haloTexture, color: 0x2f6bff, transparent: true, blending: AdditiveBlending, depthWrite: false, opacity: 0.5, fog: false })),
  );
  halo.scale.set(10, 8, 1);
  halo.position.set(0.4, 0, -1.6);
  rig.add(halo);

  /* Orbital structure: two fine rings, a segmented outer ring, comets. */
  const rings = new Group();
  rig.add(rings);
  const segs = lowPower ? 160 : 260;
  const ringA = ring(3.6, 0.011, 1.1, segs);
  ringA.rotation.set(Math.PI * 0.43, 0.22, -0.32);
  const ringB = ring(4.3, 0.006, 0.55, segs);
  ringB.rotation.set(Math.PI * 0.4, -0.1, -0.16);
  const segmented = new Group();
  segmented.rotation.set(Math.PI * 0.46, -0.18, 0.1);
  const arcs = lowPower ? 3 : 6;
  for (let i = 0; i < arcs; i++) {
    const arc = ring(4.75, 0.01, 0.42, 48, lowPower ? 1.1 : 0.55);
    arc.rotation.z = (i / arcs) * Math.PI * 2;
    segmented.add(arc);
  }
  rings.add(ringA, ringB, segmented);
  const ringMeshes = [ringA, ringB, ...(segmented.children as Mesh[])];
  ringMeshes.forEach((m) => {
    track(m.geometry);
    track(m.material as Material);
  });

  const cometTexture = track(glowTexture("rgba(170,205,255,1)"));
  const comets = [
    { ring: ringA, radius: 3.6, speed: 0.22, phase: 0.6, size: 0.55 },
    { ring: ringB, radius: 4.3, speed: -0.14, phase: 2.6, size: 0.4 },
  ].map((c) => {
    const sprite = new Sprite(track(new SpriteMaterial({ map: cometTexture, transparent: true, blending: AdditiveBlending, depthWrite: false, fog: false })));
    sprite.scale.setScalar(c.size);
    c.ring.add(sprite);
    return { ...c, sprite };
  });

  /* Dust around the X */
  const dustTexture = track(glowTexture("rgba(200,220,255,1)"));
  const dustCount = lowPower ? 36 : 90;
  const dustPositions = new Float32Array(dustCount * 3);
  for (let i = 0; i < dustCount; i++) {
    const r = 2.6 + rand() * 3.6;
    const theta = rand() * Math.PI * 2;
    const phi = Math.acos(2 * rand() - 1);
    dustPositions.set([r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi) * 0.7, r * Math.sin(phi) * Math.sin(theta)], i * 3);
  }
  const dustGeometry = track(new BufferGeometry());
  dustGeometry.setAttribute("position", new BufferAttribute(dustPositions, 3));
  const dustMaterial = track(
    new PointsMaterial({ map: dustTexture, size: 0.09, sizeAttenuation: true, color: 0x9fbfff, transparent: true, opacity: 0.55, blending: AdditiveBlending, depthWrite: false, fog: false }),
  );
  const dust = new Points(dustGeometry, dustMaterial);
  rig.add(dust);

  /* Sparks for the pop-up */
  const burstCount = lowPower ? 40 : 80;
  const burstDirs = new Float32Array(burstCount * 3);
  for (let i = 0; i < burstCount; i++) {
    const theta = rand() * Math.PI * 2;
    const phi = Math.acos(2 * rand() - 1);
    const speed = 2.2 + rand() * 3.8;
    burstDirs.set([Math.sin(phi) * Math.cos(theta) * speed, Math.cos(phi) * speed * 0.75, Math.sin(phi) * Math.sin(theta) * speed * 0.5], i * 3);
  }
  const burstPositions = new Float32Array(burstCount * 3);
  const burstGeometry = track(new BufferGeometry());
  burstGeometry.setAttribute("position", new BufferAttribute(burstPositions, 3));
  const burstMaterial = track(
    new PointsMaterial({ map: dustTexture, size: 0.16, sizeAttenuation: true, color: 0xa9c8ff, transparent: true, opacity: 0, blending: AdditiveBlending, depthWrite: false, fog: false }),
  );
  const burst = new Points(burstGeometry, burstMaterial);
  burst.visible = false;
  rig.add(burst);

  /* --- Hero environment --------------------------------------------- */

  const env = new Group(); // layers placed in the frame (not on the X)
  scene.add(env);
  const envFaders: { material: { opacity: number }; base: number }[] = [];
  const fader = <M extends Material & { opacity: number }>(material: M, base: number) => {
    material.opacity = base;
    envFaders.push({ material, base });
    return track(material);
  };

  /* Energy ribbons orbiting the X (in the rig), light flowing along them. */
  const ribbonCurves = [
    [[-6.6, -0.9, 1.0], [-3.2, -1.75, 1.6], [0.8, -1.7, 1.4], [4.4, -0.55, 0.2], [6.8, 1.1, -1.8]],
    [[-6.9, 1.3, -2.2], [-3.4, 1.95, -1.2], [0.6, 1.85, -2.4], [4.1, 1.05, -3.2], [7.1, 0.0, -4.2]],
    [[-7.2, -0.3, -4.2], [-3.6, 0.9, -5.2], [0.2, 0.2, -5.6], [3.6, -0.7, -5.0], [7.2, 0.4, -4.4]],
  ].slice(0, lowPower ? 1 : 3);
  const ribbons = ribbonCurves.map((pts, i) => {
    const curve = new CatmullRomCurve3(pts.map(([x, y, z]) => new Vector3(x, y, z)));
    const segments = lowPower ? 140 : 220;
    const coreGeometry = track(new TubeGeometry(curve, segments, i === 0 ? 0.016 : 0.012, 6, false));
    const glowGeometry = track(new TubeGeometry(curve, segments, i === 0 ? 0.05 : 0.04, 6, false));
    const texture = track(flowTexture());
    texture.repeat.x = 2;
    const core = new Mesh(coreGeometry, fader(new MeshBasicMaterial({ map: texture, transparent: true, blending: AdditiveBlending, depthWrite: false, fog: false }), 0.8));
    const glow = new Mesh(glowGeometry, fader(new MeshBasicMaterial({ color: 0x2f6bff, transparent: true, blending: AdditiveBlending, depthWrite: false, fog: false }), i === 0 ? 0.05 : 0.04));
    const group = new Group();
    group.add(glow, core);
    rig.add(group);
    return { group, core, glow, texture, speed: 0.11 + i * 0.03, count: coreGeometry.index!.count, glowCount: glowGeometry.index!.count };
  });

  /* Volumetric light: soft shafts falling behind the X. */
  const shaftTex = track(shaftTexture());
  const shaftGeometry = track(new PlaneGeometry(2.6, 18));
  const shafts = [
    { x: -1.6, rz: 0.28, o: 0.07 },
    { x: 1.2, rz: -0.22, o: 0.06 },
    { x: 3.8, rz: -0.4, o: 0.04 },
  ]
    .slice(0, lowPower ? 1 : 3)
    .map((s) => {
    const m = new Mesh(shaftGeometry, fader(new MeshBasicMaterial({ map: shaftTex, color: 0x5a8bff, transparent: true, blending: AdditiveBlending, depthWrite: false, fog: false }), s.o));
    m.position.set(s.x, 3, -6);
    m.rotation.z = s.rz;
    rig.add(m);
    return m;
  });

  /* Floating glass panels and metal rods, placed in screen terms (nx, ny
     across the frame, z in depth) so the composition holds at any aspect,
     kept to the middle band — clear of the name and the tagline. */
  type Floater = { obj: Group; nx: number; ny: number; z: number; phase: number; spin: number };
  const floaters: Floater[] = [];
  const glassMaterial = fader(
    new MeshPhysicalMaterial({ color: 0x0c1838, metalness: 0.3, roughness: 0.12, clearcoat: 1, clearcoatRoughness: 0.05, envMapIntensity: 1.3, transparent: true, depthWrite: false }),
    0.16,
  );
  const edgeMaterial = fader(new LineBasicMaterial({ color: 0x6f9bff, transparent: true, depthWrite: false }), 0.2);
  const rodMaterial = new MeshPhysicalMaterial({ color: 0xc9d1dc, metalness: 1, roughness: 0.28, envMapIntensity: 1.4, transparent: true });
  fader(rodMaterial, 0.5);
  const panelSpecs = [
    { nx: -0.86, ny: 0.16, z: -7, w: 1.6, h: 2.4 },
    { nx: 0.84, ny: 0.22, z: -9, w: 1.9, h: 2.7 },
    { nx: -0.66, ny: -0.24, z: -14, w: 2.6, h: 1.5 },
    { nx: 0.62, ny: -0.26, z: -16, w: 2.8, h: 1.7 },
    { nx: -0.3, ny: 0.32, z: -22, w: 3.4, h: 2.1 },
    { nx: 0.28, ny: -0.34, z: -24, w: 3.6, h: 2.3 },
  ].slice(0, lowPower ? 0 : 6); // glass is the costliest material to fill
  panelSpecs.forEach((p, i) => {
    const geometry = track(new BoxGeometry(p.w, p.h, 0.05));
    const edges = track(new EdgesGeometry(geometry));
    const obj = new Group();
    obj.add(new Mesh(geometry, glassMaterial), new LineSegments(edges, edgeMaterial));
    obj.rotation.set((rand() - 0.5) * 0.5, (p.nx > 0 ? -1 : 1) * (0.45 + rand() * 0.35), (rand() - 0.5) * 0.3);
    env.add(obj);
    floaters.push({ obj, nx: p.nx, ny: p.ny, z: p.z, phase: i * 1.7, spin: (rand() - 0.5) * 0.04 });
  });
  const rodGeometry = track(new BoxGeometry(0.05, 3.4, 0.05));
  [
    { nx: -0.94, ny: -0.08, z: -12 },
    { nx: 0.93, ny: 0.04, z: -13 },
  ]
    .slice(0, lowPower ? 0 : 2)
    .forEach((r, i) => {
      const obj = new Group();
      obj.add(new Mesh(rodGeometry, rodMaterial));
      obj.rotation.set(0.2, 0, (r.nx > 0 ? -1 : 1) * (0.55 + i * 0.08));
      env.add(obj);
      floaters.push({ obj, nx: r.nx, ny: r.ny, z: r.z, phase: 3 + i, spin: 0 });
    });

  /* Holographic panels (desktop): small, lit, facing the X. */
  const holos: Floater[] = [];
  if (!lowPower) {
    const holoTex = track(holoTexture());
    const holoGeometry = track(new PlaneGeometry(1.6, 1));
    [
      { nx: -0.72, ny: -0.1, z: -5, ry: 0.55 },
      { nx: 0.72, ny: 0.12, z: -6, ry: -0.55 },
    ].forEach((h, i) => {
      const obj = new Group();
      obj.add(new Mesh(holoGeometry, fader(new MeshBasicMaterial({ map: holoTex, transparent: true, blending: AdditiveBlending, depthWrite: false, fog: false }), 0.2)));
      obj.rotation.y = h.ry;
      env.add(obj);
      holos.push({ obj, nx: h.nx, ny: h.ny, z: h.z, phase: i * 2.1, spin: 0 });
    });
  }

  /* Far network: nodes on a wide shell, linked to their nearest neighbours,
     with signals travelling along the links. */
  const network = new Group();
  env.add(network);
  const nodeCount = lowPower ? 16 : 40;
  const nodes: Vector3[] = [];
  for (let i = 0; i < nodeCount; i++) {
    const theta = rand() * Math.PI * 2;
    const y = (rand() - 0.5) * 1.3;
    const r = 16 + rand() * 8;
    nodes.push(new Vector3(Math.cos(theta) * r, y * 9, Math.sin(theta) * r * 0.5 - 22));
  }
  const links: [number, number][] = [];
  nodes.forEach((a, i) => {
    nodes
      .map((b, j) => ({ j, d: a.distanceToSquared(b) }))
      .filter((n) => n.j !== i)
      .sort((p, q) => p.d - q.d)
      .slice(0, 2)
      .forEach(({ j }) => {
        if (!links.some(([p, q]) => (p === i && q === j) || (p === j && q === i))) links.push([i, j]);
      });
  });
  const linkPositions = new Float32Array(links.length * 6);
  links.forEach(([a, b], k) => {
    linkPositions.set([nodes[a].x, nodes[a].y, nodes[a].z, nodes[b].x, nodes[b].y, nodes[b].z], k * 6);
  });
  const linkGeometry = track(new BufferGeometry());
  linkGeometry.setAttribute("position", new BufferAttribute(linkPositions, 3));
  network.add(new LineSegments(linkGeometry, fader(new LineBasicMaterial({ color: 0x3d6fe0, transparent: true, depthWrite: false }), 0.13)));
  const nodeGeometry = track(new BufferGeometry());
  nodeGeometry.setAttribute("position", new BufferAttribute(new Float32Array(nodes.flatMap((n) => [n.x, n.y, n.z])), 3));
  network.add(
    new Points(nodeGeometry, fader(new PointsMaterial({ map: dustTexture, size: 0.45, sizeAttenuation: true, color: 0x8fb0ff, transparent: true, blending: AdditiveBlending, depthWrite: false }), 0.5)),
  );
  const signals = Array.from({ length: lowPower ? 1 : 4 }, (_, i) => {
    const sprite = new Sprite(fader(new SpriteMaterial({ map: cometTexture, color: 0xcfe0ff, transparent: true, blending: AdditiveBlending, depthWrite: false }), 0.9));
    sprite.scale.setScalar(0.7);
    network.add(sprite);
    return { sprite, link: (i * 7) % links.length, t: i * 0.27 };
  });

  /* Star dust far behind, and a few out-of-focus particles up close. */
  const starCount = lowPower ? 80 : 240;
  const starPositions = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i++) starPositions.set([(rand() - 0.5) * 60, (rand() - 0.5) * 34, -14 - rand() * 26], i * 3);
  const starGeometry = track(new BufferGeometry());
  starGeometry.setAttribute("position", new BufferAttribute(starPositions, 3));
  const stars = new Points(
    starGeometry,
    fader(new PointsMaterial({ map: dustTexture, size: 0.16, sizeAttenuation: true, color: 0xb7c9ff, transparent: true, blending: AdditiveBlending, depthWrite: false }), 0.7),
  );
  env.add(stars);
  const bokeh: Floater[] = [];
  [
    { nx: -0.86, ny: 0.34, z: 5 },
    { nx: 0.84, ny: -0.36, z: 6 },
    { nx: 0.9, ny: 0.4, z: 4 },
  ]
    .slice(0, lowPower ? 0 : 3)
    .forEach((b, i) => {
    const sprite = new Sprite(fader(new SpriteMaterial({ map: dustTexture, color: 0x6f9bff, transparent: true, blending: AdditiveBlending, depthWrite: false, fog: false }), 0.07));
    sprite.scale.setScalar(1.4 + i * 0.3);
    const obj = new Group();
    obj.add(sprite);
    env.add(obj);
    bokeh.push({ obj, nx: b.nx, ny: b.ny, z: b.z, phase: i * 1.3, spin: 0 });
  });

  /* --- State --------------------------------------------------------- */

  const build = { silverX: 0, blueX: 0, spread: 0, spin: 0, ring: 1, glow: 1, opacity: 1, scale: 1 };
  const intro = { env: options.environment ? 1 : 0, camZ: 1, camY: 0, draw: 1 };
  const envState = { on: options.environment ? 1 : 0 };
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  /** Hero scroll exit: camera toward About, the X sinks and dissolves. */
  const exit = { p: 0, target: 0 };
  /** Pop-up: scale (with overshoot), opacity, spin, light flash, sparks. */
  const pop = { s: 1, o: 1, spin: 0, ring: 1, flash: 0, burst: 0 };
  const POP_REST = { s: 1, o: 1, spin: 0, ring: 1, flash: 0, burst: 0 };
  const sweep = { x: -6, i: 0 };

  let transparentNow = false;
  const setTransparent = (on: boolean) => {
    if (on === transparentNow) return;
    transparentNow = on;
    for (const m of pieceMaterials) {
      m.transparent = on;
      m.needsUpdate = true;
    }
  };

  /* Cinematic entrance: X assembles while the camera glides in and the
     universe fades up out of the fog. */
  const entrance = gsap
    .timeline({ paused: true })
    .fromTo(build, { glow: 0 }, { glow: 1, duration: 1.8, ease: "power1.out" }, 0.1)
    .fromTo(build, { opacity: 0 }, { opacity: 1, duration: 0.8, ease: "power1.out" }, 0.15)
    .fromTo(build, { scale: 0.82 }, { scale: 1, duration: 2.2, ease: "power3.out" }, 0.1)
    .fromTo(build, { spin: 0.95 }, { spin: 0, duration: 2.1, ease: "power3.out" }, 0.1)
    .fromTo(build, { silverX: -2.4 }, { silverX: 0, duration: 1.5, ease: "power3.out" }, 0.2)
    .fromTo(build, { blueX: 2.4, spread: 0.9 }, { blueX: 0, spread: 0, duration: 1.6, ease: "power3.out" }, 0.34)
    .fromTo(build, { ring: 0 }, { ring: 1, duration: 1.6, ease: "power2.out" }, 0.6)
    .fromTo(intro, { env: 0 }, { env: 1, duration: 2.4, ease: "power1.inOut" }, 0)
    .fromTo(intro, { camZ: 1.38, camY: -0.9 }, { camZ: 1, camY: 0, duration: 2.8, ease: "power3.out" }, 0)
    .fromTo(intro, { draw: 0 }, { draw: 1, duration: 2, ease: "power2.inOut" }, 0.7);
  if (reducedMotion) entrance.progress(1);

  /* A highlight sweeping across the X every few seconds. */
  const sweepTl = gsap
    .timeline({ paused: true, repeat: -1, repeatDelay: 5.5, delay: 2.4 })
    .fromTo(sweep, { x: -5.5 }, { x: 5.5, duration: 1.9, ease: "power1.inOut" }, 0)
    .fromTo(sweep, { i: 0 }, { i: 1, duration: 0.6, ease: "sine.out" }, 0)
    .to(sweep, { i: 0, duration: 0.8, ease: "sine.in" }, 1.1);

  const popInTl = gsap
    .timeline({ paused: true })
    .fromTo(pop, { s: 0.05 }, { s: 1, duration: 0.95, ease: "back.out(1.7)" }, 0)
    .fromTo(pop, { o: 0 }, { o: 1, duration: 0.22, ease: "power1.out" }, 0)
    .fromTo(pop, { spin: -1.25 }, { spin: 0, duration: 1.2, ease: "power3.out" }, 0)
    .fromTo(pop, { flash: 0 }, { flash: 1, duration: 0.14, ease: "power2.out" }, 0.04)
    .to(pop, { flash: 0, duration: 0.8, ease: "power2.out" }, 0.18)
    .fromTo(pop, { burst: 0 }, { burst: 1, duration: 1.35, ease: "power2.out" }, 0.04)
    .fromTo(pop, { ring: 0 }, { ring: 1, duration: 1.1, ease: "power3.out" }, 0.18);
  popInTl.progress(1); // the first slot starts at rest
  let popOutTween: gsap.core.Tween | null = null;

  /* --- Framing ------------------------------------------------------- */

  const FIT_W = MARK_BOX.width * UNIT * MARK_FIT.w;
  const FIT_H = MARK_BOX.height * UNIT * MARK_FIT.h;
  const tanHalf = Math.tan((FOV / 2) * (Math.PI / 180));
  let width = 0;
  let height = 0;
  let baseZ = 17;
  let halfW = 5; // visible half-width at the X's depth
  let halfH = 4;
  let haloMaxW = 10;
  let haloMaxH = 8;
  const rigBase = new Vector3();

  /** The host may be larger than the X's slot (the hero's whole section, or
   *  room for a pop-up overshoot): data-slot-* give the slot inside it. The
   *  padded mark is fitted to the slot and the rig moved to its centre. */
  const resize = () => {
    const rect = host.getBoundingClientRect();
    width = Math.max(1, Math.round(rect.width));
    height = Math.max(1, Math.round(rect.height));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    const d = host.dataset;
    const sw = Number(d.slotW) || width;
    const sh = Number(d.slotH) || height;
    const sx = Number(d.slotX) || 0;
    const sy = Number(d.slotY) || 0;
    const perPx = Math.max(FIT_H / sh, FIT_W / sw); // scene units per pixel
    halfH = (perPx * height) / 2;
    halfW = (perPx * width) / 2;
    baseZ = halfH / tanHalf;
    rigBase.set((sx + sw / 2 - width / 2) * perPx, -(sy + sh / 2 - height / 2) * perPx, 0);
    camera.updateProjectionMatrix();
    haloMaxW = Math.min(sw * perPx * 1.5, halfW * 2) * 0.92;
    haloMaxH = Math.min(sh * perPx * 1.6, halfH * 2) * 0.92;
    // Place the environment in screen terms for this aspect.
    const place = (f: Floater) => {
      const k = (baseZ - f.z) / baseZ; // farther layers need more room
      f.obj.position.set(f.nx * halfW * k, f.ny * halfH * k, f.z);
    };
    [...floaters, ...holos, ...bokeh].forEach(place);
    fog.density = 0.6 / Math.max(10, baseZ + 12);
  };

  /* --- Per frame ----------------------------------------------------- */

  let time = 0;
  let empty = false;
  let envVisible = true;
  let lastEnvAmount = -1;
  const apply = (dt: number) => {
    const animate = !reducedMotion;
    if (animate) {
      time += dt;
      pointer.x += (pointer.tx - pointer.x) * Math.min(1, dt * 3);
      pointer.y += (pointer.ty - pointer.y) * Math.min(1, dt * 3);
      exit.p += (exit.target - exit.p) * Math.min(1, dt * 7);
    }
    const float = animate ? Math.sin(time * 0.6) * 0.07 : 0;
    const drift = animate ? Math.sin(time * 0.23) * 0.1 : 0;
    const e = exit.p;
    const fade = 1 - smoothstep(0.35, 0.95, e);
    const energy = Math.sin(Math.PI * Math.min(1, e));
    const envOn = envState.on;
    const envAmount = envOn * intro.env * (1 - smoothstep(0.15, 0.85, e));

    /* Camera: entrance glide, restrained pointer parallax, and on scroll a
       move down and forward toward the About section (hero only). */
    camera.position.set(
      pointer.x * 0.45 * envOn,
      (intro.camY - pointer.y * 0.28 - e * 1.6) * envOn,
      baseZ * (1 + (intro.camZ - 1) * envOn - 0.14 * e * envOn),
    );
    rig.position.copy(rigBase);

    /* The X */
    rim.position.set(4.5 - 6 * e, -1.5 - 1.5 * e, -3 + 2 * e);
    rim.intensity = 60 + 70 * energy + 90 * pop.flash;
    key.intensity = (2.4 - 0.8 * e) * (0.55 + 0.45 * build.glow);
    sweepLight.position.set(sweep.x, 1.2, 3);
    sweepLight.intensity = 55 * sweep.i * fade;
    const scale = pop.s * build.scale * (1 - 0.45 * e);
    mark.scale.setScalar(Math.max(0.001, scale));
    mark.rotation.set(
      REST.rotX + pointer.y * 0.12 + e * 0.35,
      REST.rotY + drift + pointer.x * 0.22 - build.spin - pop.spin + e * 0.7,
      0,
    );
    mark.position.set(0.15 * scale, float - e * 0.9, 0);
    silver.position.x = build.silverX;
    blueTop.position.set(build.blueX, build.spread, 0);
    blueBottom.position.set(build.blueX, -build.spread, 0);
    const opacity = build.opacity * fade * pop.o;
    setTransparent(opacity < 0.999);
    for (const m of pieceMaterials) m.opacity = opacity;

    const flare = (1 + 0.3 * pop.flash) * (0.6 + 0.4 * Math.min(1.2, pop.s));
    halo.material.opacity = Math.min(1, 0.5 * build.glow * fade * pop.o * (1 + 1.4 * energy) + 0.75 * pop.flash);
    halo.scale.set(Math.min(haloMaxW, 10 * flare), Math.min(haloMaxH, 8 * flare), 1);
    halo.position.y = mark.position.y * 0.8;

    const ringAmount = build.ring * pop.ring;
    rings.scale.setScalar((0.72 + 0.28 * ringAmount) * (1 - 0.3 * e));
    rings.rotation.set(e * 0.3 + pointer.y * 0.05, pointer.x * 0.08, animate ? time * 0.02 : 0);
    segmented.rotation.z = animate ? -time * 0.05 : 0;
    rings.position.y = mark.position.y * 0.6;
    for (const r of ringMeshes) (r.material as MeshBasicMaterial).opacity = ringAmount * fade;
    for (const c of comets) {
      const a = c.phase + (animate ? time * c.speed : 0);
      c.sprite.position.set(Math.cos(a) * c.radius, Math.sin(a) * c.radius, 0);
      c.sprite.material.opacity = ringAmount * fade;
    }
    dust.rotation.y = animate ? time * 0.015 : 0;
    dustMaterial.opacity = 0.55 * build.glow * fade * pop.o;

    burst.visible = pop.burst > 0 && pop.burst < 1;
    if (burst.visible) {
      const b = pop.burst;
      for (let i = 0; i < burstPositions.length; i++) burstPositions[i] = burstDirs[i] * b;
      burstGeometry.getAttribute("position").needsUpdate = true;
      burstMaterial.opacity = 0.9 * Math.pow(1 - b, 1.3);
    }
    cursorLight.intensity = finePointer && animate ? 14 * fade : 0;
    cursorLight.position.set(pointer.x * 4, -pointer.y * 3, 4.5);

    /* Environment */
    envVisible = envAmount > 0.003;
    env.visible = envVisible;
    if (Math.abs(envAmount - lastEnvAmount) > 0.001) {
      for (const { material, base } of envFaders) material.opacity = base * envAmount;
      lastEnvAmount = envAmount;
    }
    ribbons.forEach((r, i) => {
      r.group.visible = envVisible;
      if (!envVisible) return;
      if (animate) r.texture.offset.x -= dt * (r.speed + e * 1.2);
      r.core.geometry.setDrawRange(0, Math.floor(r.count * intro.draw));
      r.glow.geometry.setDrawRange(0, Math.floor(r.glowCount * intro.draw));
      r.group.rotation.set(animate ? Math.sin(time * 0.17 + i) * 0.04 : 0, 0, animate ? Math.sin(time * 0.11 + i * 2) * 0.03 : 0);
      r.group.position.y = -e * 1.4;
    });
    shafts.forEach((s) => (s.visible = envVisible));
    if (envVisible) {
      for (const f of [...floaters, ...holos, ...bokeh]) {
        const bob = animate ? Math.sin(time * 0.35 + f.phase) * 0.12 : 0;
        const k = (baseZ - f.z) / baseZ;
        f.obj.position.y = f.ny * halfH * k + bob + e * (2 + f.z * -0.06);
        if (animate && f.spin) f.obj.rotation.y += f.spin * dt;
      }
      network.rotation.y = animate ? time * 0.012 : 0;
      stars.rotation.z = animate ? time * 0.003 : 0;
      for (const s of signals) {
        if (animate) s.t += dt * 0.35;
        if (s.t > 1) {
          s.t = 0;
          s.link = Math.floor(rand() * links.length);
        }
        const [a, b] = links[s.link];
        s.sprite.position.lerpVectors(nodes[a], nodes[b], s.t);
        s.sprite.material.opacity = 0.9 * envAmount * Math.sin(Math.PI * s.t);
      }
    }
    empty = opacity < 0.004 && pop.flash < 0.004 && !burst.visible && !envVisible;
  };

  let renderedEmpty = false;
  const render = () => {
    // Nothing on stage (between the hero exit and the pop-up): clear once,
    // then skip drawing.
    if (empty && renderedEmpty) return;
    renderedEmpty = empty;
    renderer.render(scene, camera);
  };

  /* Loop: only while visible, tab active and motion allowed. */
  let visible = false;
  let raf = 0;
  let last = 0;
  // Phones: 24fps (idle motion is slow; halves the GPU work of 60fps).
  const frameInterval = lowPower ? 1000 / 24 : 0;
  const loop = (now: number) => {
    raf = requestAnimationFrame(loop);
    if (frameInterval && now - last < frameInterval - 1) return;
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
    last = now;
    apply(dt);
    render();
  };
  const start = () => {
    if (reducedMotion || raf || !visible || document.hidden) return;
    last = 0;
    raf = requestAnimationFrame(loop);
    sweepTl.resume();
  };
  const stop = () => {
    cancelAnimationFrame(raf);
    raf = 0;
    sweepTl.pause();
  };
  const redraw = () => {
    resize();
    renderedEmpty = false;
    apply(0);
    render();
  };

  resize();
  const resizeObserver = new ResizeObserver(() => {
    resize();
    if (reducedMotion || !raf) redraw();
  });
  resizeObserver.observe(host);

  const visibility = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) start();
    else stop();
  });
  visibility.observe(host);

  const onVisibilityChange = () => (document.hidden ? stop() : start());
  document.addEventListener("visibilitychange", onVisibilityChange);

  const onPointer = (event: PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    pointer.tx = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.ty = (event.clientY / window.innerHeight) * 2 - 1;
  };
  if (finePointer && !reducedMotion) window.addEventListener("pointermove", onPointer, { passive: true });

  const onContextLost = (event: Event) => {
    event.preventDefault();
    stop();
    onFallback();
  };
  canvas.addEventListener("webglcontextlost", onContextLost);

  if (reducedMotion) redraw();
  else {
    entrance.play(0);
    sweepTl.play(0);
    redraw(); // first frame immediately, so the canvas never fades in empty
  }

  let envTween: gsap.core.Tween | null = null;

  return {
    setExit(value, immediate = false) {
      exit.target = Math.min(1, Math.max(0, value));
      if (immediate) exit.p = exit.target;
    },
    popIn() {
      popOutTween?.kill();
      popOutTween = null;
      exit.p = exit.target = 0;
      entrance.progress(1);
      popInTl.restart();
      renderedEmpty = false;
    },
    popOut(done) {
      popInTl.pause();
      popOutTween?.kill();
      popOutTween = gsap.to(pop, {
        s: 0.05,
        o: 0,
        ring: 0,
        flash: 0,
        burst: 0,
        duration: 0.32,
        ease: "power2.in",
        onComplete: () => {
          popOutTween = null;
          Object.assign(pop, POP_REST);
          done();
        },
      });
    },
    setEnvironment(on) {
      envTween?.kill();
      const target = on ? 1 : 0;
      if (reducedMotion) envState.on = target;
      else envTween = gsap.to(envState, { on: target, duration: on ? 0.8 : 0.3, ease: "power1.inOut" });
      if (on) intro.env = 1;
      renderedEmpty = false;
    },
    redraw,
    dispose() {
      stop();
      entrance.kill();
      sweepTl.kill();
      popInTl.kill();
      popOutTween?.kill();
      envTween?.kill();
      resizeObserver.disconnect();
      visibility.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("pointermove", onPointer);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      disposables.forEach((d) => d.dispose());
      environment.dispose();
      pmrem.dispose();
      renderer.dispose();
    },
  };
}
