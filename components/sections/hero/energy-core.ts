import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Color,
  Group,
  NormalBlending,
  Points,
  PointsMaterial,
  Quaternion,
  ShaderMaterial,
  Sprite,
  SpriteMaterial,
  Vector3,
} from "three";

/*
 * The energy core (Home services screen): an original particle shell, drawn
 * in the page's one canvas by mark-scene when the active slot asks for it
 * (data-x-subject="core").
 *
 * A Fibonacci sphere of points whose radius is deformed in the vertex
 * shader by slow layered waves (so it breathes organically rather than
 * spinning like a globe), with an energy band that travels from pole to
 * pole, brightening and lifting the points it passes. Points facing the
 * viewer are larger and bluer; those behind fade to silver. The cursor
 * draws a soft bulge on the side nearest it, and the shell turns gently
 * towards it. A tilted orbit of fine points and a faint glow complete it.
 * Light theme: normal blending on white (slate, electric blue and a
 * whisper of lavender in the wave); dark theme: additive light.
 */

const VERTEX = /* glsl */ `
  uniform float uTime;
  uniform float uScale;
  uniform float uSize;
  uniform vec3 uPointer;
  uniform float uPull;
  uniform float uSwell;
  attribute float aSeed;
  varying float vFront;
  varying float vWave;

  void main() {
    vec3 p = position;
    float t = uTime;
    // Organic deformation: layered slow waves over the shell.
    float n = sin(p.x * 3.1 + t * 0.7) * sin(p.y * 2.7 - t * 0.5) * sin(p.z * 3.3 + t * 0.6);
    n += 0.45 * sin(p.x * 5.6 - t * 1.05 + p.z * 3.8);
    // Energy band travelling along a tilted axis.
    float band = dot(p, normalize(vec3(0.35, 1.0, 0.2)));
    float wave = smoothstep(0.2, 0.0, abs(band - sin(t * 0.42) * 1.05));
    // Soft bulge towards the cursor.
    float pull = pow(max(dot(p, uPointer), 0.0), 5.0) * uPull;
    float r = 1.0 + 0.085 * n + 0.1 * wave + 0.12 * pull + uSwell;
    vec4 mv = modelViewMatrix * vec4(p * r, 1.0);
    gl_Position = projectionMatrix * mv;
    vec3 facing = normalize(normalMatrix * p);
    vFront = 0.5 + 0.5 * facing.z;
    vWave = clamp(wave + pull, 0.0, 1.0);
    gl_PointSize = uScale * uSize * (0.55 + 0.9 * aSeed) * (0.6 + 0.6 * vFront) * (1.0 + 1.1 * vWave) / -mv.z;
  }
`;

const FRAGMENT = /* glsl */ `
  uniform vec3 uBack;
  uniform vec3 uFront;
  uniform vec3 uWaveColour;
  uniform float uOpacity;
  varying float vFront;
  varying float vWave;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.12, d);
    vec3 colour = mix(uBack, uFront, smoothstep(0.55, 0.95, vFront));
    colour = mix(colour, uWaveColour, vWave * 0.8);
    float alpha = a * uOpacity * (0.1 + 0.62 * vFront) * (0.75 + 1.1 * vWave);
    gl_FragColor = vec4(colour, min(alpha, 1.0));
  }
`;

const dotTexture = (inner: string) => {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 64;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, inner);
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  return new CanvasTexture(canvas);
};

export type EnergyCore = {
  group: Group;
  /** Shell radius (scene units) and pixels per scene unit at distance 1. */
  layout: (radius: number, pixelScale: number) => void;
  /** Per frame. pointer: -1..1 across the window; scale/opacity/spin from
   *  the scene's pop-up state. */
  update: (state: {
    time: number;
    dt: number;
    animate: boolean;
    pointer: { x: number; y: number };
    scale: number;
    opacity: number;
    spin: number;
    /** 0..1: a services panel is in focus (turn towards it, brighten). */
    focus: number;
  }) => void;
  dispose: () => void;
};

export function createEnergyCore({ light, lowPower }: { light: boolean; lowPower: boolean }): EnergyCore {
  const group = new Group();
  const shell = new Group();
  group.add(shell);

  /* Shell: Fibonacci sphere. */
  const count = lowPower ? 1500 : 3400;
  const positions = new Float32Array(count * 3);
  const seeds = new Float32Array(count);
  const golden = Math.PI * (3 - Math.sqrt(5));
  let s = 7;
  const rand = () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
  for (let i = 0; i < count; i++) {
    const y = 1 - ((i + 0.5) / count) * 2;
    const ring = Math.sqrt(1 - y * y);
    const t = golden * i;
    // A slight jitter, so the shell reads as organic, not as a grid.
    const j = () => (rand() - 0.5) * 0.035;
    const v = [Math.cos(t) * ring + j(), y + j(), Math.sin(t) * ring + j()];
    const len = Math.hypot(v[0], v[1], v[2]);
    positions.set([v[0] / len, v[1] / len, v[2] / len], i * 3);
    seeds[i] = rand();
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(positions, 3));
  geometry.setAttribute("aSeed", new BufferAttribute(seeds, 1));

  const material = new ShaderMaterial({
    vertexShader: VERTEX,
    fragmentShader: FRAGMENT,
    transparent: true,
    depthWrite: false,
    blending: light ? NormalBlending : AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uScale: { value: 1 },
      uSize: { value: 0.022 },
      uPointer: { value: new Vector3(0, 0, 1) },
      uPull: { value: 0 },
      uSwell: { value: 0 },
      uOpacity: { value: 1 },
      uBack: { value: new Color(light ? "#aab3c0" : "#7d8aa3") },
      uFront: { value: new Color(light ? "#3478f6" : "#8fb4ff") },
      uWaveColour: { value: new Color(light ? "#4f7cf6" : "#ffffff") },
    },
  });
  const points = new Points(geometry, material);
  shell.add(points);

  /* Orbit: a tilted ring of fine points. */
  const orbitCount = lowPower ? 140 : 260;
  const orbitPositions = new Float32Array(orbitCount * 3);
  for (let i = 0; i < orbitCount; i++) {
    const a = (i / orbitCount) * Math.PI * 2;
    const r = 1.38 + (rand() - 0.5) * 0.05;
    orbitPositions.set([Math.cos(a) * r, (rand() - 0.5) * 0.03, Math.sin(a) * r], i * 3);
  }
  const orbitGeometry = new BufferGeometry();
  orbitGeometry.setAttribute("position", new BufferAttribute(orbitPositions, 3));
  const dot = dotTexture("rgba(255,255,255,1)");
  const orbitMaterial = new PointsMaterial({
    map: dot,
    color: light ? "#3478f6" : "#8fb4ff",
    size: 0.065,
    transparent: true,
    depthWrite: false,
    blending: light ? NormalBlending : AdditiveBlending,
    opacity: 0.55,
  });
  const orbit = new Points(orbitGeometry, orbitMaterial);
  orbit.rotation.set(1.22, 0, 0.32);
  group.add(orbit);

  /* Glow behind the shell. */
  const glowMap = dotTexture(light ? "rgba(110,150,250,0.6)" : "rgba(90,139,255,0.8)");
  const glow = new Sprite(new SpriteMaterial({ map: glowMap, transparent: true, depthWrite: false, blending: light ? NormalBlending : AdditiveBlending, opacity: 0.6 }));
  glow.position.z = -0.4;
  group.add(glow);

  const tilt = new Quaternion();
  const inverse = new Quaternion();
  const toward = new Vector3();
  let spinY = 0;
  let orbitSpin = 0;

  return {
    group,
    layout(radius, pixelScale) {
      group.scale.setScalar(radius);
      material.uniforms.uScale.value = pixelScale * radius;
    },
    update({ time, dt, animate, pointer, scale, opacity, spin, focus }) {
      if (animate) spinY += dt * 0.12;
      const u = material.uniforms;
      u.uTime.value = animate ? time : 0;
      u.uOpacity.value = opacity;
      u.uSwell.value = (1 - Math.min(1, scale)) * -0.3 + 0.04 * focus;
      // Turn gently towards the cursor; slow rotation of its own.
      shell.rotation.set(0.32 + pointer.y * 0.18, spinY + pointer.x * 0.35 - spin, 0);
      shell.scale.setScalar(Math.max(0.001, scale));
      // Cursor direction in the shell's own frame.
      toward.set(pointer.x, -pointer.y, 0.9).normalize();
      tilt.setFromEuler(shell.rotation);
      inverse.copy(tilt).invert();
      u.uPointer.value.copy(toward).applyQuaternion(inverse);
      const near = Math.min(1, Math.hypot(pointer.x, pointer.y));
      u.uPull.value += ((animate ? 0.35 + 0.55 * Math.max(near, focus) : 0) - u.uPull.value) * Math.min(1, dt * 2);
      if (animate) orbitSpin += dt * (0.08 + 0.12 * focus);
      orbit.rotation.y = orbitSpin;
      orbit.scale.setScalar(Math.max(0.001, scale));
      orbitMaterial.opacity = 0.75 * opacity;
      glow.scale.setScalar(3.4 * Math.max(0.001, scale));
      glow.material.opacity = Math.min(1, (light ? 0.75 : 0.7) * opacity * (1 + 0.5 * focus));
    },
    dispose() {
      geometry.dispose();
      material.dispose();
      orbitGeometry.dispose();
      orbitMaterial.dispose();
      dot.dispose();
      glowMap.dispose();
      glow.material.dispose();
    },
  };
}
