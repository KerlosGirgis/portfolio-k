import {
  BackSide,
  CanvasTexture,
  CapsuleGeometry,
  CatmullRomCurve3,
  CircleGeometry,
  ConeGeometry,
  CylinderGeometry,
  DataTexture,
  ExtrudeGeometry,
  Group,
  LatheGeometry,
  LinearFilter,
  Mesh,
  MeshBasicMaterial,
  MeshToonMaterial,
  NearestFilter,
  Object3D,
  RedFormat,
  SRGBColorSpace,
  ShaderMaterial,
  Shape,
  SphereGeometry,
  TorusGeometry,
  TubeGeometry,
  Vector2,
  Vector3,
  type BufferGeometry,
  type Material,
} from "three";
import { mergeVertices } from "three/addons/utils/BufferGeometryUtils.js";

// The hero's 3D cast: Kerlos with his cockatiel on his left shoulder, built from primitives with
// cel shading and ink outlines so they match the 2D cast in components/characters.tsx (same
// palette). Units are roughly metres-ish: Kerlos stands on y = 0, facing +z, about 3 units tall.
// kerlos-3d-stage.ts animates the joints exposed here.

const INK = "#1b1534";
const SKIN = "#c98d64";
const HAIR = "#2a1a14";
const SHIRT = "#63cdf2";
const SHIRT_SHADE = "#38aedb";
const PANTS = "#2d3155";
const SNEAKER_STRIPE = "#ff7a1a";
const SOLE = "#e3e6ec";
const WATCH = "#d5dbe3";
const MOUTH = "#7a2233";
const PINK = "#ff8fa3";

const BIRD = "#9ea2aa";
const BIRD_LIGHT = "#c6c9cf";
const BIRD_DARK = "#6b6f78";
const BIRD_TAIL = "#575b64";
const FACE = "#e2d38c";
const CREST_GREY = "#b3b6bc";
const CHEEK = "#f2a165";
const TAIL_BAR = "#e9cf6c";
const BEAK = "#8e8a93";
const FEET = "#c9aaa5";

type V3 = [number, number, number];
const SIDES = [-1, 1] as const;
const TAU = Math.PI * 2;

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
/** Hermite ramp from 0 at `a` to 1 at `b` (either direction). */
const ramp = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

function put<T extends Object3D>(obj: T, pos: V3 = [0, 0, 0], rot: V3 = [0, 0, 0], scale: V3 | number = 1): T {
  obj.position.set(...pos);
  obj.rotation.set(...rot);
  if (typeof scale === "number") obj.scale.setScalar(scale);
  else obj.scale.set(...scale);
  return obj;
}

/* ------------------------------------------------------------------ */
/*  Materials: two-tone cel shading plus inverted-hull ink outlines    */
/* ------------------------------------------------------------------ */

// Pushes back faces out along their normals by a fixed number of screen pixels, so every part
// gets the same weight of ink line no matter how small it is or how far away.
const HULL_VERTEX = /* glsl */ `
  uniform vec2 uRes;
  uniform float uWidth;
  void main() {
    vec4 clip = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    vec2 dir = (projectionMatrix * vec4(normalize(normalMatrix * normal), 0.0)).xy * uRes;
    float len = length(dir);
    if (len > 0.0) clip.xy += dir / len * (2.0 * uWidth / uRes) * clip.w;
    gl_Position = clip;
  }
`;
// Written straight to the canvas, so the ink is the exact sRGB colour the rest of the site uses.
const INK_RGB = INK.slice(1).match(/../g)!.map((hex) => (parseInt(hex, 16) / 255).toFixed(4));
const HULL_FRAGMENT = /* glsl */ `
  void main() { gl_FragColor = vec4(${INK_RGB.join(", ")}, 1.0); }
`;

function createKit() {
  const owned = new Set<{ dispose(): void }>();
  const own = <T extends { dispose(): void }>(x: T) => (owned.add(x), x);

  // Light → shadow in a single hard step just past the terminator, like the 2D cast's one flat
  // shade per shape.
  const steps = Array.from({ length: 20 }, (_, i) => (i < 11 ? 70 : 255));
  const gradient = own(new DataTexture(new Uint8Array(steps), steps.length, 1, RedFormat));
  gradient.minFilter = gradient.magFilter = NearestFilter;
  gradient.generateMipmaps = false;
  gradient.needsUpdate = true;

  const toons = new Map<string, MeshToonMaterial>();
  function toon(color: string) {
    let m = toons.get(color);
    if (!m) toons.set(color, (m = own(new MeshToonMaterial({ color, gradientMap: gradient }))));
    return m;
  }
  function painted(map: CanvasTexture) {
    return own(new MeshToonMaterial({ map, gradientMap: gradient }));
  }
  function flat(color: string) {
    return own(new MeshBasicMaterial({ color }));
  }

  const outline = { uRes: { value: new Vector2(1, 1) }, widths: new Map<number, ShaderMaterial>() };
  function hull(weight: number) {
    let m = outline.widths.get(weight);
    if (!m) {
      m = own(
        new ShaderMaterial({
          uniforms: { uRes: outline.uRes, uWidth: { value: weight } },
          vertexShader: HULL_VERTEX,
          fragmentShader: HULL_FRAGMENT,
          side: BackSide,
        }),
      );
      outline.widths.set(weight, m);
    }
    return m;
  }

  /** A mesh plus its ink hull. `line` scales the outline (0 = none). */
  function mesh(geometry: BufferGeometry, material: Material, line = 1) {
    own(geometry);
    const m = new Mesh(geometry, material);
    if (line) m.add(new Mesh(geometry, hull(line)));
    return m;
  }

  const unitSphere = own(new SphereGeometry(1, 32, 24));
  /** Ellipsoid from the shared unit sphere. */
  function blob(material: Material, scale: V3 | number, pos: V3, rot: V3 = [0, 0, 0], line = 1) {
    return put(mesh(unitSphere, material, line), pos, rot, scale);
  }

  return {
    own,
    toon,
    painted,
    flat,
    mesh,
    blob,
    /** Outline width is in CSS px; call whenever the canvas is resized. */
    setOutline(width: number, height: number, px: number) {
      outline.uRes.value.set(width, height);
      for (const [weight, m] of outline.widths) m.uniforms.uWidth.value = weight * px;
    },
    dispose: () => owned.forEach((x) => x.dispose()),
  };
}

type Kit = ReturnType<typeof createKit>;

/* ------------------------------------------------------------------ */
/*  Geometry helpers                                                   */
/* ------------------------------------------------------------------ */

/** Welds duplicate vertices so normals (and the ink hull) stay smooth across seams and edges. */
function welded(source: BufferGeometry) {
  source.deleteAttribute("uv");
  source.deleteAttribute("normal");
  const geo = mergeVertices(source, 1e-4);
  source.dispose();
  geo.computeVertexNormals();
  return geo;
}

/** A unit sphere reshaped by `shape` (which edits a unit direction in place). */
function sculpt(shape: (v: Vector3) => void, widthSegments = 64, heightSegments = 48) {
  const geo = welded(new SphereGeometry(1, widthSegments, heightSegments));
  const pos = geo.attributes.position;
  const v = new Vector3();
  for (let i = 0; i < pos.count; i++) {
    shape(v.fromBufferAttribute(pos, i));
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  geo.computeVertexNormals();
  return geo;
}

/** Kerlos's head is an egg: the jaw narrows toward the chin. Works on unit-sphere points. */
function headShape(v: Vector3) {
  const jaw = ramp(0, -0.95, v.y) ** 1.4;
  v.x *= 1 - 0.15 * jaw;
  v.z *= 1 - 0.05 * jaw;
  return v;
}

/** How far down from the crown (radians) the hair reaches, by angle around the head (0 = front). */
const HAIRLINE: [number, number][] = [
  [0, 1.02],
  [0.45, 0.98],
  [0.78, 1.06], // temples
  [1.05, 1.32],
  [1.2, 1.47], // short sideburns
  [1.33, 1.45],
  [1.5, 1.24], // over the ears
  [1.8, 1.4],
  [2.1, 2.25],
  [Math.PI, 2.55], // nape
];

function hairlineAt(az: number) {
  for (let i = 1; i < HAIRLINE.length; i++) {
    const [a1, h1] = HAIRLINE[i];
    if (az <= a1) {
      const [a0, h0] = HAIRLINE[i - 1];
      return h0 + (h1 - h0) * ramp(a0, a1, az);
    }
  }
  return HAIRLINE[HAIRLINE.length - 1][1];
}

/**
 * Short at the sides, thick on top and pushed up into a quiff at the front. Below the hairline
 * the shell sinks into the skull, so the hairline is where the two meet.
 */
function hairShape(v: Vector3) {
  const theta = Math.acos(Math.min(1, Math.max(-1, v.y)));
  const az = Math.atan2(v.x, v.z);
  const front = ramp(0.95, 0.25, Math.abs(az));
  // The fringe sweeps a little lower on his right.
  const edge = hairlineAt(Math.abs(az)) + 0.07 * front * ramp(0.5, -0.5, az);
  const bare = ramp(edge - 0.05, edge + 0.06, theta);
  const top = Math.exp(-(((theta - 0.5) / 0.55) ** 2));
  const quiff = Math.exp(-(((az - 0.2) / 0.6) ** 2) - ((theta - 0.75) / 0.3) ** 2);
  const volume = 0.035 + 0.19 * top * (0.6 + 0.4 * front) + 0.08 * quiff;
  return headShape(v.multiplyScalar((1 + volume) * (1 - bare) + 0.9 * bare));
}

// [theta, az, length] of each lock of the quiff: where it starts at the fringe and how far (in
// radians) it runs back over the head.
const HAIR_LOCKS: [number, number, number][] = [
  [0.98, -0.62, 0.42],
  [0.93, -0.25, 0.5],
  [0.9, 0.12, 0.52],
  [0.93, 0.48, 0.46],
  [1.0, 0.8, 0.36],
];

/** Unit direction for `theta` (down from the crown) and `az` (round from the front). */
function onHead(theta: number, az: number) {
  return new Vector3(Math.sin(theta) * Math.sin(az), Math.cos(theta), Math.sin(theta) * Math.cos(az));
}

/**
 * A tube along `points` that tapers to a point (feathers) or has rounded ends (locks of hair);
 * `flat` squashes its cross-section (x, z).
 */
function quill(points: (V3 | Vector3)[], radius: number, flat: [number, number] = [1, 1], ends: "tip" | "round" = "tip") {
  const curve = new CatmullRomCurve3(points.map((p) => (p instanceof Vector3 ? p : new Vector3(...p))));
  const tubular = 18;
  const radial = 8;
  const geo = new TubeGeometry(curve, tubular, radius, radial, false);
  const pos = geo.attributes.position;
  const c = new Vector3();
  const p = new Vector3();
  for (let i = 0; i <= tubular; i++) {
    curve.getPointAt(i / tubular, c);
    const u = i / tubular;
    const taper =
      ends === "round"
        ? Math.sqrt(Math.min(1, u / 0.12) * Math.max(0, 1 - u ** 3))
        : Math.sqrt(1 - u) * (0.7 + 0.3 * Math.sin(u * Math.PI));
    for (let j = 0; j <= radial; j++) {
      const k = i * (radial + 1) + j;
      p.fromBufferAttribute(pos, k).sub(c).multiplyScalar(taper);
      pos.setXYZ(k, c.x + p.x * flat[0], c.y + p.y, c.z + p.z * flat[1]);
    }
  }
  return geo;
}

/* ------------------------------------------------------------------ */
/*  Kerlos's face, painted on a canvas and wrapped onto the head       */
/* ------------------------------------------------------------------ */

type Expression = "open" | "blink" | "joy";

// The face texture covers this patch of the head, in radians (yaw: + is his left, pitch: + is up).
const FACE_YAW = 0.95;
const FACE_TOP = 0.55;
const FACE_BOTTOM = -0.85;
const FACE_PX = 480; // texture pixels per radian
const EYE = { yaw: 0.33, pitch: 0.06, rx: 0.13, ry: 0.17 };
const PUPIL = 0.075;
/** How far the pupils can roam inside the whites. */
const GAZE = { x: 0.05, y: 0.07 };

function drawFace(ctx: CanvasRenderingContext2D, expression: Expression) {
  // Draw in radians: x = yaw, y = -pitch.
  ctx.setTransform(FACE_PX, 0, 0, FACE_PX, FACE_YAW * FACE_PX, FACE_TOP * FACE_PX);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = INK;

  ctx.fillStyle = "rgba(255, 143, 163, 0.42)";
  for (const s of SIDES) {
    ctx.beginPath();
    ctx.ellipse(s * 0.56, 0.24, 0.12, 0.065, 0, 0, TAU);
    ctx.fill();
  }

  for (const s of SIDES) {
    const x = s * EYE.yaw;
    const y = -EYE.pitch;
    ctx.beginPath();
    if (expression === "open") {
      ctx.ellipse(x, y, EYE.rx, EYE.ry, 0, 0, TAU);
      ctx.fillStyle = "#fff";
      ctx.fill();
      ctx.lineWidth = 0.032;
    } else if (expression === "blink") {
      ctx.moveTo(x - EYE.rx, y + 0.03);
      ctx.quadraticCurveTo(x, y + 0.1, x + EYE.rx, y + 0.03);
      ctx.lineWidth = 0.038;
    } else {
      ctx.moveTo(x - EYE.rx, y + 0.06);
      ctx.quadraticCurveTo(x, y - 0.13, x + EYE.rx, y + 0.06);
      ctx.lineWidth = 0.042;
    }
    ctx.stroke();
  }

  // Thick, slightly arched brows; they lift when he's happy.
  const lift = expression === "joy" ? 0.05 : 0;
  ctx.strokeStyle = HAIR;
  ctx.lineWidth = 0.065;
  for (const s of SIDES) {
    ctx.beginPath();
    ctx.moveTo(s * 0.17, -0.29 - lift);
    ctx.quadraticCurveTo(s * 0.33, -0.37 - lift, s * 0.47, -0.3 - lift);
    ctx.stroke();
  }

  // A big "D" smile like the 2D cast: teeth along the top, tongue at the bottom.
  const w = expression === "joy" ? 0.34 : 0.3;
  const top = 0.35;
  const bottom = expression === "joy" ? 0.7 : 0.6;
  const mouth = new Path2D();
  mouth.moveTo(-w, top - 0.02);
  mouth.quadraticCurveTo(0, top + 0.035, w, top - 0.02);
  mouth.bezierCurveTo(w * 0.85, bottom, -w * 0.85, bottom, -w, top - 0.02);
  mouth.closePath();
  ctx.fillStyle = MOUTH;
  ctx.fill(mouth);
  ctx.save();
  ctx.clip(mouth);
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.moveTo(-w, top - 0.02);
  ctx.quadraticCurveTo(0, top + 0.035, w, top - 0.02);
  ctx.lineTo(w, top + 0.06);
  ctx.quadraticCurveTo(0, top + 0.115, -w, top + 0.06);
  ctx.fill();
  ctx.fillStyle = PINK;
  ctx.beginPath();
  ctx.ellipse(0, bottom - 0.03, w * 0.5, 0.08, 0, 0, TAU);
  ctx.fill();
  ctx.restore();
  ctx.strokeStyle = INK;
  ctx.lineWidth = 0.032;
  ctx.stroke(mouth);
}

function canvasTexture(kit: Kit, width: number, height: number, draw: (ctx: CanvasRenderingContext2D) => void) {
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(width);
  canvas.height = Math.round(height);
  draw(canvas.getContext("2d")!);
  const tex = kit.own(new CanvasTexture(canvas));
  tex.colorSpace = SRGBColorSpace;
  return tex;
}

/** A patch of the unit sphere around the front (+z), shaped like the head, for painting on. */
function facePatch(yawSpan: number, top: number, bottom: number, radius: number, shape = headShape) {
  const geo = new SphereGeometry(1, 48, 36, Math.PI / 2 - yawSpan, yawSpan * 2, Math.PI / 2 - top, top - bottom);
  const pos = geo.attributes.position;
  const v = new Vector3();
  for (let i = 0; i < pos.count; i++) {
    shape(v.fromBufferAttribute(pos, i)).multiplyScalar(radius);
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  return geo;
}

function decal(map: CanvasTexture) {
  return new MeshBasicMaterial({
    map,
    transparent: true,
    depthWrite: false,
    polygonOffset: true,
    polygonOffsetFactor: -2,
    polygonOffsetUnits: -2,
  });
}

/* ------------------------------------------------------------------ */
/*  Kerlos                                                             */
/* ------------------------------------------------------------------ */

const HIPS_Y = 0.9;
const HEAD_R = 0.43;
// Shirt silhouette as [radius, height above the hips], spun into a lathe and squashed front to back.
const SHIRT_PROFILE: [number, number][] = [
  [0.001, -0.04],
  [0.33, -0.04],
  [0.365, -0.01],
  [0.36, 0.12],
  [0.37, 0.3],
  [0.395, 0.5],
  [0.41, 0.63],
  [0.4, 0.73],
  [0.365, 0.81],
  [0.29, 0.87],
  [0.17, 0.9],
  [0.001, 0.91],
];
const SHIRT_DEPTH = 0.68;

function shirtFront(y: number) {
  for (let i = 1; i < SHIRT_PROFILE.length; i++) {
    const [r1, y1] = SHIRT_PROFILE[i];
    if (y <= y1) {
      const [r0, y0] = SHIRT_PROFILE[i - 1];
      return (r0 + ((r1 - r0) * (y - y0)) / (y1 - y0)) * SHIRT_DEPTH;
    }
  }
  return 0;
}

function buildArm(kit: Kit, side: -1 | 1) {
  const shoulder = put(new Group(), [side * 0.47, 0.73, 0]);
  const sleeve = new CapsuleGeometry(0.12, 0.4, 6, 18).translate(0, -0.2, 0);
  shoulder.add(kit.mesh(sleeve, kit.toon(SHIRT)));
  shoulder.add(put(kit.mesh(new TorusGeometry(0.108, 0.032, 8, 24), kit.toon(SHIRT), 0.7), [0, -0.37, 0], [Math.PI / 2, 0, 0]));

  const elbow = put(new Group(), [0, -0.4, 0]);
  shoulder.add(elbow);
  elbow.add(kit.mesh(new CapsuleGeometry(0.085, 0.33, 6, 14).translate(0, -0.165, 0), kit.toon(SKIN)));

  const wrist = put(new Group(), [0, -0.36, 0]);
  elbow.add(wrist);
  // Mitten hands: palm facing the leg, thumb forward.
  wrist.add(kit.blob(kit.toon(SKIN), [0.065, 0.11, 0.09], [0, -0.09, 0]));
  wrist.add(kit.blob(kit.toon(SKIN), [0.032, 0.058, 0.032], [-side * 0.012, -0.055, 0.075], [-0.55, 0, 0], 0.8));
  if (side === 1) {
    wrist.add(put(kit.mesh(new CylinderGeometry(0.094, 0.094, 0.055, 20), kit.toon(WATCH), 0.7), [0, 0.03, 0]));
  }
  return { shoulder, elbow, wrist };
}

function buildKerlos(kit: Kit) {
  const body = new Group();
  const toon = kit.toon;

  // Legs, hips and sneakers.
  const legTop = HIPS_Y + 0.04;
  const legBottom = 0.16;
  for (const s of SIDES) {
    const leg = new CylinderGeometry(0.155, 0.135, legTop - legBottom, 20, 1, true);
    body.add(put(kit.mesh(leg, toon(PANTS)), [s * 0.165, (legTop + legBottom) / 2, 0]));
    const shoe = put(new Group(), [s * 0.17, 0, 0.05], [0, s * 0.12, 0]);
    shoe.add(kit.blob(toon(SOLE), [0.14, 0.042, 0.235], [0, 0.04, 0]));
    shoe.add(kit.blob(toon(SNEAKER_STRIPE), [0.134, 0.03, 0.226], [0, 0.072, 0], undefined, 0.7));
    shoe.add(kit.blob(toon("#ffffff"), [0.128, 0.1, 0.215], [0, 0.105, 0]));
    body.add(shoe);
  }
  body.add(kit.blob(toon(PANTS), [0.32, 0.13, 0.21], [0, HIPS_Y + 0.02, 0]));

  // Everything from the hips up sways and breathes together.
  const torso = put(new Group(), [0, HIPS_Y, 0]);
  body.add(torso);
  const shirt = kit.mesh(
    new LatheGeometry(
      SHIRT_PROFILE.map(([r, y]) => new Vector2(r, y)),
      44,
      Math.PI,
    ),
    toon(SHIRT),
  );
  shirt.scale.z = SHIRT_DEPTH;
  torso.add(shirt);

  // Button placket and buttons, following the curve of the shirt front.
  const placket: Vector3[] = [];
  for (let y = -0.01; y <= 0.8; y += 0.09) placket.push(new Vector3(0, y, shirtFront(y) + 0.004));
  torso.add(kit.mesh(new TubeGeometry(new CatmullRomCurve3(placket), 24, 0.007, 6), toon(SHIRT_SHADE), 0));
  for (const y of [0.17, 0.38, 0.59]) {
    torso.add(kit.blob(toon("#ffffff"), [0.028, 0.028, 0.012], [0, y, shirtFront(y) + 0.006], undefined, 0.55));
  }
  // White collar points, like the 2D Kerlos, lying back along the slope of the chest.
  for (const s of SIDES) {
    const point = new Shape();
    point.moveTo(s * 0.015, 0.035);
    point.lineTo(s * 0.155, 0.035);
    point.lineTo(s * 0.045, -0.1);
    point.closePath();
    const flap = new ExtrudeGeometry(point, { depth: 0.01, bevelThickness: 0.008, bevelSize: 0.014, bevelSegments: 2, curveSegments: 1 });
    torso.add(put(kit.mesh(welded(flap), toon("#ffffff"), 0.8), [0, 0.845, 0.195], [-0.7, 0, 0]));
  }

  const arms = [buildArm(kit, -1), buildArm(kit, 1)] as const;
  torso.add(arms[0].shoulder, arms[1].shoulder);

  // Neck → head. The head group is scaled so its children are modelled on a unit sphere.
  const neck = put(new Group(), [0, 0.86, -0.01]);
  torso.add(neck);
  neck.add(put(kit.mesh(new CylinderGeometry(0.115, 0.125, 0.32, 20, 1, true), toon(SKIN)), [0, 0.14, 0]));
  const head = put(new Group(), [0, 0.22, 0]);
  neck.add(head);
  const skull = put(new Group(), [0, 0.3, 0.02], [0, 0, 0], [HEAD_R, HEAD_R * 1.08, HEAD_R * 0.97]);
  head.add(skull);

  skull.add(kit.mesh(sculpt(headShape), toon(SKIN)));
  skull.add(kit.mesh(sculpt(hairShape, 160, 100), toon(HAIR)));
  // Chunky locks pushed up off the forehead, lying back over the scalp.
  for (const [theta, az, length] of HAIR_LOCKS) {
    const pts = [0, 0.5, 1].map((k) =>
      hairShape(onHead(theta - length * k, az + 0.12 * k)).multiplyScalar(0.99 + 0.04 * Math.sin(k * Math.PI)),
    );
    skull.add(kit.mesh(quill(pts, 0.105, [1, 1], "round"), toon(HAIR)));
  }
  for (const s of SIDES) {
    skull.add(kit.blob(toon(SKIN), [0.17, 0.28, 0.21], [s * 0.97, -0.1, -0.1], [0, s * 0.4, 0]));
  }
  skull.add(kit.blob(toon(SKIN), [0.11, 0.12, 0.12], [0, -0.168, 0.976], undefined, 0));

  const width = FACE_YAW * 2 * FACE_PX;
  const height = (FACE_TOP - FACE_BOTTOM) * FACE_PX;
  const faces = {
    open: canvasTexture(kit, width, height, (ctx) => drawFace(ctx, "open")),
    blink: canvasTexture(kit, width, height, (ctx) => drawFace(ctx, "blink")),
    joy: canvasTexture(kit, width, height, (ctx) => drawFace(ctx, "joy")),
  };
  const faceMaterial = kit.own(decal(faces.open));
  const face = kit.mesh(facePatch(FACE_YAW, FACE_TOP, FACE_BOTTOM, 1.006), faceMaterial, 0);
  face.renderOrder = 1;
  skull.add(face);

  // Pupils are separate little patches that slide over the painted whites.
  const pupilSpan = 0.09;
  const pupilMap = canvasTexture(kit, 128, 128, (ctx) => {
    ctx.setTransform(64 / pupilSpan, 0, 0, 64 / pupilSpan, 64, 64);
    ctx.fillStyle = HAIR;
    ctx.beginPath();
    ctx.arc(0, 0, PUPIL, 0, TAU);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(0.026, -0.03, 0.022, 0, TAU);
    ctx.fill();
  });
  const pupilGeometry = facePatch(pupilSpan, pupilSpan, -pupilSpan, 1.011, (v) => v);
  const pupilMaterial = kit.own(decal(pupilMap));
  const pupils = SIDES.map(() => {
    const pivot = new Object3D();
    pivot.rotation.order = "YXZ";
    const pupil = kit.mesh(pupilGeometry, pupilMaterial, 0);
    pupil.renderOrder = 2;
    pivot.add(pupil);
    skull.add(pivot);
    return pivot;
  });

  function setFace(expression: Expression) {
    faceMaterial.map = faces[expression];
    for (const p of pupils) p.visible = expression === "open";
  }

  /** Point the pupils; offsets are radians, clamped to stay inside the whites. */
  function lookEyes(x: number, y: number) {
    const gx = Math.max(-GAZE.x, Math.min(GAZE.x, x));
    const gy = Math.max(-GAZE.y, Math.min(GAZE.y, y));
    pupils.forEach((p, i) => p.rotation.set(-(EYE.pitch + gy), SIDES[i] * EYE.yaw + gx, 0));
  }
  lookEyes(0, 0);

  return { body, torso, neck, head, arms, setFace, lookEyes };
}

/* ------------------------------------------------------------------ */
/*  The cockatiel (female normal grey)                                 */
/* ------------------------------------------------------------------ */

function buildBird(kit: Kit) {
  const toon = kit.toon;
  // Feet at the origin, facing +z.
  const root = new Group();
  const body = new Group();
  root.add(body);

  const tilt: V3 = [0.25, 0, 0];
  body.add(kit.blob(toon(BIRD), [0.11, 0.18, 0.115], [0, 0.17, -0.01], tilt));
  body.add(kit.blob(toon(BIRD_LIGHT), [0.085, 0.13, 0.085], [0, 0.14, 0.035], tilt, 0));
  for (const s of SIDES) body.add(kit.blob(toon(FEET), [0.03, 0.017, 0.038], [s * 0.04, 0.01, 0.03], undefined, 0.6));

  // Long tail with the yellow barring of a hen.
  const bars = canvasTexture(kit, 64, 4, (ctx) => {
    ctx.fillStyle = BIRD_TAIL;
    ctx.fillRect(0, 0, 64, 4);
    ctx.fillStyle = TAIL_BAR;
    for (const u of [0.42, 0.58, 0.74]) ctx.fillRect(u * 64, 0, 0.07 * 64, 4);
  });
  bars.minFilter = bars.magFilter = LinearFilter;
  bars.generateMipmaps = false;
  const tailMaterial = kit.painted(bars);
  const tail = put(new Group(), [0, 0.05, -0.07]);
  body.add(tail);
  for (const [x, length] of [
    [-0.016, 0.34],
    [0.016, 0.34],
    [0, 0.4],
  ] as const) {
    const pts: V3[] = [
      [x, 0, 0],
      [x * 1.4, -length * 0.3, -0.06],
      [x * 2, -length * 0.65, -0.1],
      [x * 2.4, -length, -0.115],
    ];
    tail.add(kit.mesh(quill(pts, 0.034, [1, 0.45]), tailMaterial));
  }

  // Folded wings (dark grey with the white patch); they open from the shoulder.
  const wings = SIDES.map((s) => {
    const wing = put(new Group(), [s * 0.088, 0.26, -0.005]);
    wing.add(kit.blob(toon(BIRD_DARK), [0.038, 0.16, 0.085], [s * 0.012, -0.1, -0.035], [0.32, 0, 0]));
    wing.add(kit.blob(toon("#ffffff"), [0.01, 0.06, 0.02], [s * 0.042, -0.045, 0.024], [0.32, 0, 0], 0));
    body.add(wing);
    return wing;
  });

  const head = put(new Group(), [0, 0.3, 0.035]);
  root.add(head);
  head.add(kit.blob(toon(BIRD), 0.095, [0, 0.07, 0.01]));
  head.add(kit.blob(toon(FACE), 0.085, [0, 0.065, 0.04]));
  for (const s of SIDES) head.add(kit.blob(toon(CHEEK), [0.012, 0.03, 0.032], [s * 0.068, 0.045, 0.055], [0, -s * 0.85, 0], 0));

  const eyes = SIDES.map((s) => {
    const eye = put(new Group(), [s * 0.058, 0.09, 0.058]);
    eye.add(kit.blob(kit.flat(INK), [0.021, 0.025, 0.02], [0, 0, 0], undefined, 0));
    eye.add(kit.blob(kit.flat("#ffffff"), 0.007, [s * 0.008, 0.009, 0.012], undefined, 0));
    head.add(eye);
    return eye;
  });

  head.add(put(kit.mesh(new ConeGeometry(0.026, 0.06, 12), toon(BEAK), 0.6), [0, 0.042, 0.105], [Math.PI / 2 + 0.55, 0, 0]));
  const beak = put(new Group(), [0, 0.03, 0.09]);
  beak.add(put(kit.mesh(new ConeGeometry(0.017, 0.032, 10), toon(BEAK), 0.5), [0, -0.004, 0.012], [Math.PI / 2 + 0.9, 0, 0]));
  head.add(beak);

  // Crest: yellow in front, greyer toward the back.
  const crest = put(new Group(), [0, 0.15, 0.035]);
  head.add(crest);
  const feathers: [string, V3[]][] = [
    [BIRD, [[0, 0, -0.035], [0, 0.05, -0.05], [0, 0.1, -0.09], [0, 0.125, -0.14]]],
    [CREST_GREY, [[0, 0, -0.012], [0, 0.075, -0.022], [0, 0.15, -0.065], [0, 0.19, -0.125]]],
    [FACE, [[0, 0, 0.012], [0, 0.09, 0.008], [0, 0.18, -0.035], [0, 0.24, -0.105]]],
  ];
  for (const [color, pts] of feathers) crest.add(kit.mesh(quill(pts, 0.021, [0.55, 1]), toon(color), 0.8));

  return { root, body, head, crest, beak, wings, tail, eyes };
}

/* ------------------------------------------------------------------ */
/*  The whole cast                                                     */
/* ------------------------------------------------------------------ */

/** Where the bird stands, in Kerlos's torso space (on top of his left shoulder), and which way she faces. */
export const PERCH: V3 = [0.54, 0.81, 0.06];
export const PERCH_TURN = 0.35;
const BIRD_SIZE = 1.22;

export function buildCast() {
  const kit = createKit();
  const kerlos = buildKerlos(kit);
  const bird = buildBird(kit);
  put(bird.root, PERCH, [0, PERCH_TURN, 0], BIRD_SIZE);
  kerlos.torso.add(bird.root);

  // Spin this to turn the pair around.
  const root = new Group();
  root.add(kerlos.body);

  // A flat cartoon shadow, kept out of `root` so it doesn't spin.
  const shadowMaterial = new MeshBasicMaterial({ color: INK, transparent: true, opacity: 0.16, depthWrite: false });
  const shadow = put(
    kit.mesh(new CircleGeometry(1, 48), kit.own(shadowMaterial), 0),
    [0, 0.002, 0.04],
    [-Math.PI / 2, 0, 0],
    [0.7, 0.42, 1],
  );

  return { root, shadow, kerlos, bird, setOutline: kit.setOutline, dispose: kit.dispose };
}
