import {
  AmbientLight,
  Color,
  DirectionalLight,
  MathUtils,
  PerspectiveCamera,
  Raycaster,
  Scene,
  Vector2,
  Vector3,
  WebGLRenderer,
  type Object3D,
} from "three";
import { buildCast, PERCH, PERCH_TURN } from "./kerlos-3d-cast";

export type StageOptions = {
  reducedMotion: boolean;
  /** Seconds to wait before the entrance, so it lands after the intro title card. */
  delay: number;
  /** Someone poked the bird; x/y is just above her crest, in px from the host's top-left corner. */
  onChirp: (x: number, y: number) => void;
};

const TAU = Math.PI * 2;
const { clamp, damp, lerp } = MathUtils;
const clamp01 = (x: number) => clamp(x, 0, 1);
const smooth = (x: number) => x * x * (3 - 2 * x);
const easeOutBack = (x: number) => 1 + 2.70158 * (x - 1) ** 3 + 1.70158 * (x - 1) ** 2;
/** 0 → 1 → 0 over `length` seconds, with `fade`-second ramps at each end. */
const envelope = (t: number, length: number, fade: number) =>
  smooth(clamp01(t / fade)) * smooth(clamp01((length - t) / fade));
const rand = (min: number, max: number) => min + Math.random() * (max - min);
const SIDES = [-1, 1] as const;

// What the camera keeps in view, in world units (with room for the waving arm above his head).
const FRAME = { y: 1.53, halfHeight: 1.72, halfWidth: 1.02 };
const OUTLINE_PX = 2.6;
const SPIN_PER_PX = 0.012;
const WAVE_SECONDS = 2.3;
// The bird's fly-in, relative to her perch: from off to the upper right, swooping down onto the shoulder.
const FLIGHT = { from: new Vector3(2.7, 1.9, 0.9), via: new Vector3(1.2, 1.5, 1.1), seconds: 1.15 };

function isPartOf(object: Object3D | null, ancestor: Object3D) {
  for (; object; object = object.parent) if (object === ancestor) return true;
  return false;
}

/** Mounts the 3D scene in `host` and runs it until `dispose()`. Throws if WebGL is unavailable. */
export function createStage(host: HTMLElement, { reducedMotion, delay, onChirp }: StageOptions) {
  const renderer = new WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  const canvas = renderer.domElement;
  canvas.style.cssText = "display:block;width:100%;height:100%;cursor:grab;touch-action:pan-y";
  host.prepend(canvas);

  const scene = new Scene();
  const camera = new PerspectiveCamera(24, 1, 0.1, 60);
  // Ambient + sun add up to exactly 1, so lit surfaces show their palette colour as-is and the
  // shadow tone comes out a little cooler, like the 2D cast's shade colours.
  scene.add(new AmbientLight(new Color(0.46, 0.48, 0.62), Math.PI));
  const sun = new DirectionalLight(new Color(0.54, 0.52, 0.38), Math.PI);
  sun.position.set(2.5, 4, 7); // from the front and upper right, where the hero's sun is
  scene.add(sun);

  const cast = buildCast();
  const { kerlos, bird } = cast;
  scene.add(cast.root, cast.shadow);
  kerlos.head.rotation.order = "YXZ";
  bird.root.rotation.order = "YXZ";
  bird.head.rotation.order = "YXZ";
  const torsoY = kerlos.torso.position.y;
  const birdHeadY = bird.head.position.y;
  const shadowScale = cast.shadow.scale.clone();

  // --- Timeline (seconds on the stage clock, which only runs while he's on screen) ---
  let clock = 0;
  // Long enough ago that every one-off animation has finished. (Not -Infinity: sin(∞) is NaN.)
  const never = -100;
  const enterAt = reducedMotion ? never : delay;
  const flyAt = reducedMotion ? never : delay + 0.75;
  let waveAt = reducedMotion ? never : delay + 0.45;
  let chirpAt = reducedMotion ? never : flyAt + FLIGHT.seconds;
  let flapAt = never;
  let glanceUntil = never;
  let nextChirp = chirpAt + rand(7, 11);
  let nextBirdLook = 0;
  let blinkAt = delay + rand(2, 4);
  let birdBlinkAt = delay + rand(1, 3);

  const look = { yaw: 0, pitch: 0, eyeYaw: 0, eyePitch: 0 };
  const pointer = { yaw: 0, pitch: 0, at: never };
  const birdLook = { yaw: 0, pitch: 0, roll: 0, toYaw: -PERCH_TURN, toPitch: 0, toRoll: 0 };
  let spin = 0;
  let spinVelocity = 0;
  let drag: { id: number; x: number; y: number; at: number; travel: number } | null = null;

  function chirp() {
    chirpAt = clock;
    // He looks over at her, unless he's busy following the pointer.
    if (clock - pointer.at > 2.5) glanceUntil = clock + 1.5;
  }

  function update(dt: number) {
    clock += dt;
    const t = clock;

    if (!reducedMotion) {
      if (t > nextChirp) {
        chirp();
        nextChirp = t + rand(7, 13);
      }
      // Birds look around in quick snaps: at you, at him, or anywhere.
      if (t > nextBirdLook) {
        const r = Math.random();
        if (r < 0.3) Object.assign(birdLook, { toYaw: -PERCH_TURN, toPitch: 0, toRoll: rand(-0.25, 0.25) });
        else if (r < 0.45) Object.assign(birdLook, { toYaw: -1, toPitch: 0.1, toRoll: 0.2 });
        else Object.assign(birdLook, { toYaw: rand(-0.6, 1.1), toPitch: rand(-0.35, 0.25), toRoll: rand(-0.4, 0.4) });
        nextBirdLook = t + rand(0.7, 2.6);
      }
      if (t > blinkAt + 0.14) blinkAt = t + (Math.random() < 0.2 ? 0.12 : rand(2.2, 5.5));
      if (t > birdBlinkAt + 0.1) birdBlinkAt = t + rand(1.5, 4.5);
    }

    // Pop up out of the ground with a bounce.
    const pop = easeOutBack(clamp01((t - enterAt) / 0.7));
    kerlos.body.visible = cast.shadow.visible = t >= enterAt;
    kerlos.body.scale.setScalar(Math.max(pop, 1e-3));
    cast.shadow.scale.set(shadowScale.x * pop, shadowScale.y * pop, 1);

    // Follow the drag; once let go, spring back round to facing front.
    if (!drag && !reducedMotion) {
      const front = Math.round(spin / TAU) * TAU;
      spinVelocity += (-(spin - front) * 16 - spinVelocity * 5.5) * dt;
      spin += spinVelocity * dt;
    }
    cast.root.rotation.y = spin;

    // Breathing and a lazy sway.
    kerlos.torso.position.y = torsoY + Math.sin(t * 2.1) * 0.006;
    kerlos.torso.rotation.z = Math.sin(t * 0.8) * 0.02;

    // Look at the pointer while it's moving, else at you (or over at the bird when she chirps).
    const following = t - pointer.at < 2.5;
    const glancing = !following && t < glanceUntil;
    const yaw = following ? pointer.yaw : glancing ? 0.7 : 0;
    const pitch = following ? pointer.pitch : glancing ? 0.1 : 0;
    look.eyeYaw = damp(look.eyeYaw, yaw, 16, dt);
    look.eyePitch = damp(look.eyePitch, pitch, 16, dt);
    look.yaw = damp(look.yaw, yaw, 4.5, dt);
    look.pitch = damp(look.pitch, pitch, 4.5, dt);
    kerlos.torso.rotation.y = look.yaw * 0.18;
    kerlos.neck.rotation.set(look.pitch * 0.3, look.yaw * 0.3, 0);
    kerlos.head.rotation.set(look.pitch * 0.7, look.yaw * 0.52, -look.yaw * 0.08);
    // The eyes get there first, then the head catches up.
    kerlos.lookEyes(
      (look.eyeYaw - look.yaw) * 0.9 + look.eyeYaw * 0.07,
      -((look.eyePitch - look.pitch) * 0.9 + look.eyePitch * 0.1),
    );

    // Arms hang loose; the right one waves on arrival and whenever he's poked.
    const sinceWave = t - waveAt;
    const wave = envelope(sinceWave, WAVE_SECONDS, 0.4);
    const [right, left] = kerlos.arms;
    right.shoulder.rotation.set(lerp(-0.08, 0.22, wave), 0, lerp(-0.16 + Math.sin(t * 0.8) * 0.02, -2.55, wave));
    right.elbow.rotation.set(lerp(-0.25, 0, wave), 0, lerp(0, -0.5, wave) + Math.sin(sinceWave * 12) * 0.45 * wave);
    right.wrist.rotation.set(0, lerp(0, -1.3, wave), 0);
    left.shoulder.rotation.set(-0.08, 0, 0.16 - Math.sin(t * 0.8) * 0.02);
    left.elbow.rotation.set(-0.3, 0, 0);

    const blinking = t > blinkAt && t < blinkAt + 0.13;
    kerlos.setFace(blinking ? "blink" : sinceWave > 0.15 && sinceWave < 1.7 ? "joy" : "open");

    // The bird swoops in after he pops up and lands on his shoulder.
    const flight = clamp01((t - flyAt) / FLIGHT.seconds);
    const glide = 1 - (1 - flight) ** 2;
    // Quadratic Bézier from FLIGHT.from, bending through FLIGHT.via, to the perch.
    const fromWeight = (1 - glide) ** 2;
    const viaWeight = 2 * (1 - glide) * glide;
    const flying = 1 - smooth(clamp01((flight - 0.72) / 0.28));
    bird.root.visible = t >= flyAt;
    bird.root.position.set(
      PERCH[0] + FLIGHT.from.x * fromWeight + FLIGHT.via.x * viaWeight,
      PERCH[1] + FLIGHT.from.y * fromWeight + FLIGHT.via.y * viaWeight,
      PERCH[2] + FLIGHT.from.z * fromWeight + FLIGHT.via.z * viaWeight,
    );
    bird.root.rotation.set(0.9 * flying, lerp(PERCH_TURN, -1.9, flying), 0);

    const flap = Math.max(flight < 1 ? flying : 0, envelope(t - flapAt, 1.1, 0.12));
    const beat = 0.5 + 0.5 * Math.sin(t * 34);
    bird.wings.forEach((wing, i) => wing.rotation.set(-0.15 * flap, 0, SIDES[i] * flap * (0.35 + 1.15 * beat)));

    birdLook.yaw = damp(birdLook.yaw, birdLook.toYaw, 14, dt);
    birdLook.pitch = damp(birdLook.pitch, birdLook.toPitch, 14, dt);
    birdLook.roll = damp(birdLook.roll, birdLook.toRoll, 14, dt);
    const chirping = envelope(t - chirpAt, 1, 0.1);
    const bob = Math.abs(Math.sin((t - chirpAt) * 15)) * chirping;
    bird.head.position.y = birdHeadY + bob * 0.015;
    bird.head.rotation.set(birdLook.pitch - bob * 0.25, birdLook.yaw * (1 - flying), birdLook.roll * (1 - flying));
    bird.beak.rotation.x = bob * 0.5;
    bird.crest.rotation.x = -0.12 + Math.sin(t * 1.6) * 0.05 + chirping * 0.45 + flap * 0.3;
    bird.tail.rotation.set(Math.sin(t * 1.2) * 0.05 - flap * 0.25, 0, Math.sin(t * 0.9) * 0.05);
    const breath = 1 + Math.sin(t * 5.5) * 0.012;
    bird.body.scale.set(breath, 1, breath);
    const birdBlinking = t > birdBlinkAt && t < birdBlinkAt + 0.1;
    for (const eye of bird.eyes) eye.scale.y = birdBlinking ? 0.12 : 1;
  }

  // --- Rendering ---
  let width = 1;
  let height = 1;
  let raf = 0;
  let last = 0;
  let onScreen = true;
  const headOnScreen = new Vector3();

  function draw(dt: number) {
    update(dt);
    renderer.render(scene, camera);
    kerlos.head.getWorldPosition(headOnScreen).project(camera);
  }

  function frame(now: number) {
    raf = 0;
    draw(reducedMotion || !last ? 0 : Math.min((now - last) / 1000, 0.05));
    last = now;
    if (!reducedMotion && onScreen) raf = requestAnimationFrame(frame);
  }

  function wake() {
    if (!raf) raf = requestAnimationFrame(frame);
  }

  function resize() {
    width = Math.max(1, host.clientWidth);
    height = Math.max(1, host.clientHeight);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    const tan = Math.tan(MathUtils.degToRad(camera.fov / 2));
    const distance = Math.max(FRAME.halfHeight / tan, FRAME.halfWidth / (tan * camera.aspect));
    camera.position.set(0, FRAME.y + 0.3, distance);
    camera.lookAt(0, FRAME.y, 0);
    camera.updateProjectionMatrix();
    cast.setOutline(width, height, OUTLINE_PX * clamp(height / 640, 0.75, 1.15));
    // Resizing clears the canvas, so redraw now rather than flash blank until the next frame.
    draw(0);
  }
  resize();

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(host);
  const visibility = new IntersectionObserver((entries) => {
    onScreen = entries[entries.length - 1].isIntersecting;
    if (onScreen) wake();
    else {
      cancelAnimationFrame(raf);
      raf = 0;
      last = 0;
    }
  });
  visibility.observe(host);

  // --- Input: look at the pointer, drag to spin, poke to say hi ---
  const raycaster = new Raycaster();
  const ndc = new Vector2();
  const crestTip = new Vector3();

  function poke(clientX: number, clientY: number) {
    const rect = canvas.getBoundingClientRect();
    ndc.set(((clientX - rect.left) / rect.width) * 2 - 1, -((clientY - rect.top) / rect.height) * 2 + 1);
    raycaster.setFromCamera(ndc, camera);
    const hit = raycaster.intersectObject(cast.root, true)[0];
    if (!hit) return;
    if (isPartOf(hit.object, bird.root)) {
      chirp();
      flapAt = clock;
      // Anchor the speech bubble just above the tip of her (raised) crest.
      bird.head.getWorldPosition(crestTip);
      crestTip.y += 0.42;
      crestTip.project(camera);
      onChirp(((crestTip.x + 1) / 2) * width, ((1 - crestTip.y) / 2) * height);
    } else if (clock - waveAt > WAVE_SECONDS) {
      waveAt = clock;
    }
  }

  function onPointerMove(e: PointerEvent) {
    const rect = canvas.getBoundingClientRect();
    const headX = rect.left + ((headOnScreen.x + 1) / 2) * rect.width;
    const headY = rect.top + ((1 - headOnScreen.y) / 2) * rect.height;
    pointer.yaw = clamp((e.clientX - headX) / 420, -1, 1) * 0.75;
    pointer.pitch = clamp((e.clientY - headY) / 380, -1, 1) * 0.42;
    pointer.at = clock;
    if (drag?.id !== e.pointerId) return;
    const dx = e.clientX - drag.x;
    spin += dx * SPIN_PER_PX;
    spinVelocity = (dx * SPIN_PER_PX) / Math.max(0.008, (e.timeStamp - drag.at) / 1000);
    drag.travel += Math.hypot(dx, e.clientY - drag.y);
    Object.assign(drag, { x: e.clientX, y: e.clientY, at: e.timeStamp });
    wake();
  }

  function onPointerDown(e: PointerEvent) {
    if (e.button !== 0) return;
    drag = { id: e.pointerId, x: e.clientX, y: e.clientY, at: e.timeStamp, travel: 0 };
    canvas.setPointerCapture(e.pointerId);
    canvas.style.cursor = "grabbing";
  }

  function onPointerUp(e: PointerEvent) {
    if (drag?.id !== e.pointerId) return;
    if (e.type === "pointerup" && drag.travel < 6) poke(e.clientX, e.clientY);
    // Held still before letting go: no fling.
    if (e.timeStamp - drag.at > 80) spinVelocity = 0;
    drag = null;
    canvas.style.cursor = "";
    wake();
  }

  window.addEventListener("pointermove", onPointerMove, { passive: true });
  canvas.addEventListener("pointerdown", onPointerDown);
  canvas.addEventListener("pointerup", onPointerUp);
  canvas.addEventListener("pointercancel", onPointerUp);

  return {
    dispose() {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      visibility.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      cast.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      canvas.remove();
    },
  };
}
