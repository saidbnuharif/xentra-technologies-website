/*
 * Hero 3D scene: the Xentra X mark extruded in metal and blue, inside two
 * orbit rings with travelling light, a soft halo and a little depth dust.
 *
 * Loaded on demand by <HeroMarkScene> (dynamic import), so three.js never
 * blocks the first paint or the headline. Everything is plain WebGL via
 * three.js; GSAP (the site's motion engine) drives the entrance.
 *
 * Behaviour
 *  - Entrance: the silver chevron slides in from the left and the blue
 *    blades from the right while the mark turns into place and the rings
 *    open. Replays when the hero comes back into view after leaving it;
 *    never restarts while visible.
 *  - Idle: slow float and drift; desktop fine pointer adds cursor parallax
 *    and a light that follows the cursor.
 *  - Scroll: the mark tilts and rises a little as the hero scrolls away.
 *  - Reduced motion: a single static frame (re-rendered only on resize).
 *  - Rendering pauses while the hero is off screen or the tab is hidden;
 *    smaller screens render at 30fps with a lower pixel ratio.
 */
import {
  ACESFilmicToneMapping,
  AdditiveBlending,
  AmbientLight,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Color,
  DirectionalLight,
  ExtrudeGeometry,
  Group,
  type Material,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  PerspectiveCamera,
  PMREMGenerator,
  PointLight,
  Points,
  PointsMaterial,
  Scene,
  Shape,
  Sprite,
  SpriteMaterial,
  SRGBColorSpace,
  type Texture,
  TorusGeometry,
  WebGLRenderer,
} from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { gsap, ScrollTrigger } from "@/components/motion/gsap";
import { BLUE_BOTTOM, BLUE_TOP, MARK_CENTRE, MARK_COLOURS, SILVER, type Point } from "./mark-geometry";

export type MarkSceneOptions = {
  reducedMotion: boolean;
  finePointer: boolean;
  lowPower: boolean;
  /** Called if WebGL fails or the context is lost (show the SVG poster). */
  onFallback: () => void;
};

export type MarkScene = { dispose: () => void };

const UNIT = 1 / 100; // logo pixels → scene units (mark ≈ 5.1 × 3.4)
const DEPTH = 0.5;
const REST = { rotX: 0.06, rotY: -0.34 };

/* --- Geometry helpers ------------------------------------------------- */

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

/** Soft radial sprite texture (halo, comet heads, dust). */
function glowTexture(inner: string, outer = "rgba(0,0,0,0)") {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, inner);
  g.addColorStop(0.35, inner.replace(/[\d.]+\)$/, "0.35)"));
  g.addColorStop(1, outer);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}

/** Orbit ring whose brightness fades around its circumference. */
function ring(radius: number, tube: number, brightness: number, lowPower: boolean) {
  const geometry = new TorusGeometry(radius, tube, 6, lowPower ? 160 : 260);
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
  });
  return new Mesh(geometry, material);
}

/* --- Scene ------------------------------------------------------------ */

export function createMarkScene(
  canvas: HTMLCanvasElement,
  host: HTMLElement,
  options: MarkSceneOptions,
): MarkScene | null {
  const { reducedMotion, finePointer, lowPower, onFallback } = options;

  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  } catch {
    return null;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, lowPower ? 1.5 : 2));
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.setClearColor(0x000000, 0);

  const scene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  const environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = environment;
  scene.environmentIntensity = 1.1;

  const camera = new PerspectiveCamera(30, 1, 0.1, 100);
  camera.position.set(0, 0, 17);

  /* Lights: white key from the upper left, electric-blue rim from behind
     right, and a cool light that follows the cursor on desktop. */
  scene.add(new AmbientLight(0x1a2a55, 0.7));
  const key = new DirectionalLight(0xffffff, 2.4);
  key.position.set(-4, 5, 6);
  scene.add(key);
  const fill = new DirectionalLight(0xdfe7ff, 1.3);
  fill.position.set(-1, 0.5, 9);
  scene.add(fill);
  const rim = new PointLight(0x2f6bff, 60, 0, 2);
  rim.position.set(4.5, -1.5, -3);
  scene.add(rim);
  const cursorLight = new PointLight(0x8fb4ff, 0, 0, 2);
  cursorLight.position.set(0, 0, 4.5);
  scene.add(cursorLight);

  /* The mark */
  const mark = new Group();
  scene.add(mark);

  const top = (MARK_CENTRE.y - 302) * UNIT;
  const silverGeometry = extrude(SILVER);
  paintGradient(silverGeometry, MARK_COLOURS.silver, top, -top);
  // Not fully metallic: a pure mirror facing the camera reflects the dark
  // stage and reads black. Partial metalness keeps the logo's light-to-grey
  // gradient visible, with chrome highlights from the clearcoat.
  const silverMaterial = new MeshPhysicalMaterial({
    vertexColors: true,
    metalness: 0.8,
    roughness: 0.24,
    clearcoat: 1,
    clearcoatRoughness: 0.12,
    envMapIntensity: 1.4,
  });
  const silver = new Mesh(silverGeometry, silverMaterial);

  const blueTopGeometry = extrude(BLUE_TOP);
  paintGradient(blueTopGeometry, MARK_COLOURS.blueTop, top, (MARK_CENTRE.y - 465) * UNIT);
  const blueBottomGeometry = extrude(BLUE_BOTTOM);
  paintGradient(blueBottomGeometry, MARK_COLOURS.blueBottom, -(483 - MARK_CENTRE.y) * UNIT, -top);
  const blueMaterial = (emissive: number) =>
    new MeshPhysicalMaterial({
      vertexColors: true,
      metalness: 0.25,
      roughness: 0.32,
      envMapIntensity: 0.45,
      clearcoat: 0.6,
      clearcoatRoughness: 0.06,
      emissive: new Color("#0b4cff"),
      emissiveIntensity: emissive,
    });
  const blueTopMaterial = blueMaterial(0.32);
  const blueBottomMaterial = blueMaterial(0.12);
  const blueTop = new Mesh(blueTopGeometry, blueTopMaterial);
  const blueBottom = new Mesh(blueBottomGeometry, blueBottomMaterial);
  mark.add(silver, blueTop, blueBottom);
  const pieceMaterials = [silverMaterial, blueTopMaterial, blueBottomMaterial];

  /* Halo behind the mark */
  const haloTexture = glowTexture("rgba(47,107,255,0.9)");
  const haloMaterial = new SpriteMaterial({
    map: haloTexture,
    color: 0x2f6bff,
    transparent: true,
    blending: AdditiveBlending,
    depthWrite: false,
    opacity: 0.5,
  });
  const halo = new Sprite(haloMaterial);
  halo.scale.set(10, 8, 1);
  halo.position.set(0.4, 0, -1.6);
  scene.add(halo);

  /* Orbit rings + travelling light */
  const rings = new Group();
  scene.add(rings);
  const ringA = ring(3.6, 0.012, 1.1, lowPower);
  ringA.rotation.set(Math.PI * 0.43, 0.22, -0.32);
  const ringB = ring(4.3, 0.007, 0.55, lowPower);
  ringB.rotation.set(Math.PI * 0.4, -0.1, -0.16);
  rings.add(ringA, ringB);

  const cometTexture = glowTexture("rgba(170,205,255,1)");
  const comets = [
    { ring: ringA, radius: 3.6, speed: 0.22, phase: 0.6, size: 0.55 },
    { ring: ringB, radius: 4.3, speed: -0.14, phase: 2.6, size: 0.4 },
  ].map((c) => {
    const sprite = new Sprite(
      new SpriteMaterial({ map: cometTexture, transparent: true, blending: AdditiveBlending, depthWrite: false }),
    );
    sprite.scale.setScalar(c.size);
    c.ring.add(sprite);
    return { ...c, sprite };
  });

  /* Depth dust */
  const dustCount = lowPower ? 50 : 90;
  const dustPositions = new Float32Array(dustCount * 3);
  for (let i = 0; i < dustCount; i++) {
    const r = 2.6 + Math.random() * 3.6;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    dustPositions.set(
      [r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi) * 0.7, r * Math.sin(phi) * Math.sin(theta)],
      i * 3,
    );
  }
  const dustGeometry = new BufferGeometry();
  dustGeometry.setAttribute("position", new BufferAttribute(dustPositions, 3));
  const dustTexture = glowTexture("rgba(200,220,255,1)");
  const dustMaterial = new PointsMaterial({
    map: dustTexture,
    size: 0.09,
    sizeAttenuation: true,
    color: 0x9fbfff,
    transparent: true,
    opacity: 0.55,
    blending: AdditiveBlending,
    depthWrite: false,
  });
  const dust = new Points(dustGeometry, dustMaterial);
  scene.add(dust);

  /* --- State driven by GSAP, pointer and scroll ---------------------- */

  const build = { silverX: 0, blueX: 0, spread: 0, spin: 0, ring: 1, glow: 1, opacity: 1 };
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  const scroll = { p: 0, target: 0 };

  const setTransparent = (on: boolean) => {
    for (const m of pieceMaterials) {
      m.transparent = on;
      m.needsUpdate = true;
    }
  };

  const entrance = gsap
    .timeline({ paused: true, onStart: () => setTransparent(true), onComplete: () => setTransparent(false) })
    .fromTo(build, { glow: 0 }, { glow: 1, duration: 1.6, ease: "power1.out" }, 0)
    .fromTo(build, { opacity: 0 }, { opacity: 1, duration: 0.7, ease: "power1.out" }, 0.1)
    .fromTo(build, { spin: 0.95 }, { spin: 0, duration: 1.9, ease: "power3.out" }, 0)
    .fromTo(build, { silverX: -2.4 }, { silverX: 0, duration: 1.35, ease: "power3.out" }, 0.08)
    .fromTo(build, { blueX: 2.4, spread: 0.9 }, { blueX: 0, spread: 0, duration: 1.45, ease: "power3.out" }, 0.22)
    .fromTo(build, { ring: 0 }, { ring: 1, duration: 1.5, ease: "power2.out" }, 0.45);
  // fromTo renders its start values immediately; reduced motion starts (and
  // stays) at the finished composition instead.
  if (reducedMotion) entrance.progress(1);

  /* --- Rendering ------------------------------------------------------ */

  let width = 0;
  let height = 0;
  const resize = () => {
    const rect = host.getBoundingClientRect();
    width = Math.max(1, Math.round(rect.width));
    height = Math.max(1, Math.round(rect.height));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    // Keep the whole mark and inner ring in frame on narrow/short stages.
    // Phones: closer camera so the mark fills its shorter stage.
    const distance = width < 600 ? 13 : 17;
    camera.position.z = camera.aspect < 1 ? distance / camera.aspect : distance;
    camera.updateProjectionMatrix();
  };

  let time = 0;
  const apply = (dt: number) => {
    const animate = !reducedMotion;
    if (animate) {
      time += dt;
      pointer.x += (pointer.tx - pointer.x) * Math.min(1, dt * 4);
      pointer.y += (pointer.ty - pointer.y) * Math.min(1, dt * 4);
      scroll.p += (scroll.target - scroll.p) * Math.min(1, dt * 6);
    }
    const float = animate ? Math.sin(time * 0.6) * 0.07 : 0;
    const drift = animate ? Math.sin(time * 0.23) * 0.1 : 0;

    mark.rotation.set(
      REST.rotX + pointer.y * 0.16 + scroll.p * 0.42,
      REST.rotY + drift + pointer.x * 0.28 - build.spin,
      0,
    );
    mark.position.set(0.15, float + scroll.p * 1.1, 0);
    silver.position.x = build.silverX;
    blueTop.position.set(build.blueX, build.spread, 0);
    blueBottom.position.set(build.blueX, -build.spread, 0);
    for (const m of pieceMaterials) m.opacity = build.opacity;

    halo.material.opacity = 0.5 * build.glow;
    rings.scale.setScalar(0.72 + 0.28 * build.ring);
    rings.rotation.set(scroll.p * 0.25 + pointer.y * 0.06, pointer.x * 0.1, animate ? time * 0.02 : 0);
    rings.position.y = mark.position.y * 0.6;
    for (const r of [ringA, ringB]) (r.material as MeshBasicMaterial).opacity = build.ring;
    for (const c of comets) {
      const a = c.phase + (animate ? time * c.speed : 0);
      c.sprite.position.set(Math.cos(a) * c.radius, Math.sin(a) * c.radius, 0);
      c.sprite.material.opacity = build.ring;
    }
    dust.rotation.y = animate ? time * 0.015 : 0;
    dustMaterial.opacity = 0.55 * build.glow;

    cursorLight.intensity = finePointer && animate ? 14 : 0;
    cursorLight.position.set(pointer.x * 4, pointer.y * 3, 4.5);
  };

  const render = () => renderer.render(scene, camera);

  /* Loop: only while visible, tab active and motion allowed. */
  let visible = false;
  let hiddenSinceEntrance = false;
  let raf = 0;
  let last = 0;
  const frameInterval = lowPower ? 1000 / 30 : 0;
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
  };
  const stop = () => {
    cancelAnimationFrame(raf);
    raf = 0;
  };

  resize();
  const resizeObserver = new ResizeObserver(() => {
    resize();
    if (reducedMotion || !raf) {
      apply(0);
      render();
    }
  });
  resizeObserver.observe(host);

  const visibility = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) {
      if (hiddenSinceEntrance && !reducedMotion) entrance.restart();
      hiddenSinceEntrance = false;
      start();
    } else {
      stop();
      if (!reducedMotion) {
        hiddenSinceEntrance = true;
        entrance.pause(0); // ready to replay on return
      }
    }
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

  const section = host.closest("section") ?? host;
  const scrollTrigger = reducedMotion
    ? null
    : ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom top",
        onUpdate: (self) => {
          scroll.target = self.progress;
        },
      });

  const onContextLost = (event: Event) => {
    event.preventDefault();
    stop();
    onFallback();
  };
  canvas.addEventListener("webglcontextlost", onContextLost);

  if (reducedMotion) {
    apply(0);
    render();
  } else {
    entrance.play(0);
    apply(0);
    render(); // first frame immediately, so the canvas never fades in empty
  }

  return {
    dispose() {
      stop();
      entrance.kill();
      scrollTrigger?.kill();
      resizeObserver.disconnect();
      visibility.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("pointermove", onPointer);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      const materials = new Set<Material>();
      const textures = new Set<Texture>([haloTexture, cometTexture, dustTexture, environment]);
      scene.traverse((object) => {
        const item = object as Partial<Mesh>;
        item.geometry?.dispose();
        const m = item.material;
        if (m) (Array.isArray(m) ? m : [m]).forEach((x) => materials.add(x));
      });
      materials.forEach((m) => m.dispose());
      textures.forEach((t) => t.dispose());
      pmrem.dispose();
      renderer.dispose();
    },
  };
}
