import type { CSSProperties, SVGProps } from "react";
import { cn } from "@/lib/utils";

// The site's cast: Kerlos (cartoon you) and his normal grey cockatiel. Limbs, wings and the
// crest are separate groups so CSS can pose and animate them; see the `rig-*` keyframes and
// `.walker` rules in globals.css.

const INK = "#1b1534";
const SKIN = "#c98d64";
const SKIN_SHADE = "#a3683f";
const HAIR = "#2a1a14";
const SHIRT = "#63cdf2";
const SHIRT_SHADE = "#38aedb";
const PANTS = "#2d3155";
const SNEAKER_STRIPE = "#ff7a1a";

/** Rotate/scale a group around a point given in viewBox units. */
function pivot(x: number, y: number, extra?: CSSProperties): CSSProperties {
  return { transformBox: "view-box", transformOrigin: `${x}px ${y}px`, ...extra };
}

type Rig = { className?: string; style?: CSSProperties };

export type KidPose = "idle" | "wave" | "point" | "walk";

export function KidKerlos({ pose = "idle", className, ...props }: { pose?: KidPose } & SVGProps<SVGSVGElement>) {
  const walk = pose === "walk";
  const armL: Rig =
    pose === "point"
      ? { style: pivot(42, 128, { transform: "rotate(118deg)" }) }
      : walk
        ? { className: "rig-arm-l", style: pivot(42, 128) }
        : { className: "ambient animate-[rig-sway_3.2s_ease-in-out_infinite]", style: pivot(42, 128) };
  const armR: Rig =
    pose === "wave"
      ? { className: "ambient animate-[rig-wave_0.9s_ease-in-out_infinite]", style: pivot(98, 128, { transform: "rotate(-140deg)" }) }
      : walk
        ? { className: "rig-arm-r", style: pivot(98, 128) }
        : { className: "ambient animate-[rig-sway_3.2s_ease-in-out_-1.6s_infinite]", style: pivot(98, 128) };

  return (
    <svg viewBox="0 0 140 236" aria-hidden="true" overflow="visible" className={className} {...props}>
      <g className={walk ? "rig-step" : "ambient animate-[rig-bob_2.6s_ease-in-out_infinite]"} style={pivot(70, 230)}>
        {/* legs */}
        <g className={walk ? "rig-leg-l" : undefined} style={pivot(57, 172)}>
          <path d="M47 168h20v46a4 4 0 0 1-4 4H51a4 4 0 0 1-4-4z" fill={PANTS} stroke={INK} strokeWidth="4" strokeLinejoin="round" />
          <path d="M38 231c0-9 5-14 13-14h13c5 0 8 4 8 9v5z" fill="#fff" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
          <path d="M45 224h20" stroke={SNEAKER_STRIPE} strokeWidth="3" strokeLinecap="round" />
        </g>
        <g className={walk ? "rig-leg-r" : undefined} style={pivot(83, 172)}>
          <path d="M73 168h20v46a4 4 0 0 1-4 4H77a4 4 0 0 1-4-4z" fill={PANTS} stroke={INK} strokeWidth="4" strokeLinejoin="round" />
          <path d="M102 231c0-9-5-14-13-14H76c-5 0-8 4-8 9v5z" fill="#fff" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
          <path d="M95 224H75" stroke={SNEAKER_STRIPE} strokeWidth="3" strokeLinecap="round" />
        </g>

        {/* shirt */}
        <path d="M36 126c6-13 62-13 68 0l-4 53c-14 9-46 9-60 0z" fill={SHIRT} stroke={INK} strokeWidth="4" strokeLinejoin="round" />
        <path d="M93 121c5 1 8 3 10 6l-4 51c-2 2-5 3-8 4z" fill={SHIRT_SHADE} opacity=".55" />
        <path d="M70 128v52" stroke={SHIRT_SHADE} strokeWidth="2.5" />
        {[141, 155, 169].map((y) => (
          <circle key={y} cx="70" cy={y} r="2.3" fill="#fff" stroke={INK} strokeWidth="1.4" />
        ))}
        <path d="M62 98h16v24H62z" fill={SKIN_SHADE} stroke={INK} strokeWidth="4" />
        <path d="M57 113l12 16 2-12zM83 113l-12 16-2-12z" fill="#fff" stroke={INK} strokeWidth="3" strokeLinejoin="round" />

        {/* arms */}
        <g className={armL.className} style={armL.style}>
          <path d="M35 157l-3 21" stroke={INK} strokeWidth="15" strokeLinecap="round" />
          <path d="M35 157l-3 21" stroke={SKIN} strokeWidth="8.5" strokeLinecap="round" />
          <circle cx="31" cy="185" r="8" fill={SKIN} stroke={INK} strokeWidth="3.5" />
          <path d="M42 128l-7 28" stroke={INK} strokeWidth="21" strokeLinecap="round" />
          <path d="M42 128l-7 28" stroke={SHIRT} strokeWidth="14" strokeLinecap="round" />
          <path d="M27 157l16 3" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
        </g>
        <g className={armR.className} style={armR.style}>
          <path d="M105 157l3 21" stroke={INK} strokeWidth="15" strokeLinecap="round" />
          <path d="M105 157l3 21" stroke={SKIN} strokeWidth="8.5" strokeLinecap="round" />
          <rect x="102" y="167" width="12" height="6.5" rx="2" fill="#d5dbe3" stroke={INK} strokeWidth="2" />
          <circle cx="109" cy="185" r="8" fill={SKIN} stroke={INK} strokeWidth="3.5" />
          <path d="M98 128l7 28" stroke={INK} strokeWidth="21" strokeLinecap="round" />
          <path d="M98 128l7 28" stroke={SHIRT} strokeWidth="14" strokeLinecap="round" />
          <path d="M113 157l-16 3" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
        </g>

        {/* head */}
        <ellipse cx="31" cy="66" rx="7" ry="10" fill={SKIN} stroke={INK} strokeWidth="4" />
        <ellipse cx="109" cy="66" rx="7" ry="10" fill={SKIN} stroke={INK} strokeWidth="4" />
        <path d="M32 60c0-30 18-42 38-42s38 12 38 42c0 28-16 44-38 44S32 88 32 60z" fill={SKIN} stroke={INK} strokeWidth="4" />
        <path
          d="M29 64C24 34 42 10 70 10s47 22 41 54c-4-12-9-20-15-24-10 6-30 8-48 3-6 3-12 10-14 17-2 1-3 2-5 4z"
          fill={HAIR}
          stroke={INK}
          strokeWidth="4"
          strokeLinejoin="round"
        />
        <path d="M46 41c4-18 26-28 48-14-12-2-22 2-28 10-6-2-14 0-20 4z" fill={HAIR} stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
        <path d="M58 22c8-6 20-7 30-2" stroke="#5a3d30" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M48 51q7-5 15-1M77 50q8-4 15 1" stroke={HAIR} strokeWidth="4.5" fill="none" strokeLinecap="round" />
        <g className="ambient animate-[rig-blink_4.6s_infinite]" style={pivot(70, 62)}>
          <ellipse cx="55" cy="62" rx="7.5" ry="9" fill="#fff" stroke={INK} strokeWidth="3" />
          <ellipse cx="85" cy="62" rx="7.5" ry="9" fill="#fff" stroke={INK} strokeWidth="3" />
          <circle cx="57" cy="64" r="4.3" fill={HAIR} />
          <circle cx="87" cy="64" r="4.3" fill={HAIR} />
          <circle cx="58.6" cy="62" r="1.4" fill="#fff" />
          <circle cx="88.6" cy="62" r="1.4" fill="#fff" />
        </g>
        <path d="M71 67c-5 8-4 11 1 11" stroke={SKIN_SHADE} strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M54 82c4 15 28 15 32 0z" fill="#7a2233" stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
        <path d="M57 83h26c-1 4-25 4-26 0z" fill="#fff" />
        <path d="M62 91c4-4 12-4 16 0-4 3-12 3-16 0z" fill="#ff8fa3" />
        <ellipse cx="45" cy="77" rx="6" ry="4" fill="#ff8fa3" opacity=".45" />
        <ellipse cx="95" cy="77" rx="6" ry="4" fill="#ff8fa3" opacity=".45" />
      </g>
    </svg>
  );
}

// Female normal grey cockatiel: grey head with a soft yellow face wash, muted orange cheeks,
// a mostly grey crest, white wing patches and the yellow-barred tail of a hen.
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

export type BirdPose = "perch" | "chirp" | "alert" | "sleep";

// How far the crest tilts from its resting angle (positive = more upright).
const crestTilt: Record<BirdPose, number> = { perch: 0, chirp: 6, alert: 20, sleep: -26 };

const settle = "transform .35s cubic-bezier(.34,1.56,.64,1)";

/** Little sound arcs by the beak while she chirps. */
function ChirpLines({ color }: { color: string }) {
  return (
    <g stroke={color} strokeWidth="2.6" fill="none" strokeLinecap="round">
      <path d="M133 49q5 6.5 0 13" className="ambient animate-[chirp-pulse_1.2s_ease-out_infinite]" />
      <path d="M139.5 44q8.5 11 0 22" className="ambient animate-[chirp-pulse_1.2s_ease-out_0.15s_infinite]" />
    </g>
  );
}

/** Zs drifting up while she sleeps. */
function SleepZs({ color }: { color: string }) {
  return (
    <>
      {([[118, 24, "0s"], [130, 10, "-1.3s"]] as const).map(([x, y, delay]) => (
        <g key={x} className="ambient animate-[note-rise_2.4s_ease-out_infinite]" style={{ animationDelay: delay }}>
          <path
            transform={`translate(${x} ${y})`}
            d="M0 0h7l-7 8h7"
            stroke={color}
            strokeWidth="2.4"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      ))}
    </>
  );
}

/** A tail feather with yellow barring; the outline is redrawn on top so the bars sit inside it. */
function TailFeather({ d, fill, bars, outline }: { d: string; fill: string; bars: string; outline: number }) {
  return (
    <>
      <path d={d} fill={fill} />
      <path d={bars} stroke={TAIL_BAR} strokeWidth="2.6" strokeLinecap="round" />
      <path d={d} fill="none" stroke={INK} strokeWidth={outline} strokeLinejoin="round" />
    </>
  );
}

type PerchKind = "branch" | "long-branch" | "pencil";

function Perch({ kind }: { kind: PerchKind }) {
  if (kind === "pencil") {
    return (
      <g stroke={INK} strokeLinejoin="round">
        <path d="M12 137H6a4 4 0 0 0-4 4v3a4 4 0 0 0 4 4h6z" fill="#ff8fc4" strokeWidth="3.5" />
        <rect x="12" y="137" width="9" height="11" fill="#b9c1cc" strokeWidth="3" />
        <rect x="21" y="137" width="99" height="11" fill="#ffd23f" strokeWidth="3.5" />
        <path d="M21 142.5h99" stroke="#e0a400" strokeWidth="2" opacity=".7" />
        <path d="M120 137l18 5.5-18 5.5z" fill="#f2c79b" strokeWidth="3.5" />
        <path d="M132 140.2l6 1.8-6 1.8z" fill={INK} strokeWidth="1" />
      </g>
    );
  }
  // "long-branch" runs far past the right edge of the box, for growing in from the side of the screen.
  const end = kind === "long-branch" ? 320 : 138;
  return (
    <g stroke={INK} strokeLinejoin="round">
      <path d={`M8 137h${end - 8}a5 5 0 0 1 0 10H8a5 5 0 0 1 0-10z`} fill="#a76a33" strokeWidth="4" />
      <path d="M22 142h28M66 143h22M104 142h16" stroke="#7d4a1f" strokeWidth="2" strokeLinecap="round" />
      <path d="M120 137c2-9 9-14 17-15-1 7-7 12-17 15z" fill="#7ccb45" strokeWidth="3" />
    </g>
  );
}

/** A perched female normal grey cockatiel, facing right. */
export function Cockatiel({
  pose = "perch",
  perch,
  marksColor = INK,
  className,
  ...props
}: { pose?: BirdPose; perch?: PerchKind; marksColor?: string } & SVGProps<SVGSVGElement>) {
  const sleep = pose === "sleep";
  return (
    <svg viewBox="0 0 150 172" aria-hidden="true" overflow="visible" className={className} {...props}>
      {/* tail hangs behind the perch */}
      <TailFeather d="M60 110c-2 22-10 42-24 60 15-9 30-28 40-50z" fill={BIRD_TAIL} bars="M50.8 145.3l7.8 4.6M47.1 153.7l7.8 4.6M43.5 161l7 4" outline={3.5} />
      <TailFeather d="M68 114c-2 20-8 38-18 54 12-9 24-26 32-46z" fill={BIRD_DARK} bars="M62 144.9l6.2 3.2M58.4 152.6l4.8 2.4M54.7 160.1l2.6 1.4" outline={3} />
      {perch && <Perch kind={perch} />}

      {/* body and folded wing */}
      <ellipse cx="80" cy="98" rx="26" ry="37" transform="rotate(18 80 98)" fill={BIRD} stroke={INK} strokeWidth="4" />
      <ellipse cx="90" cy="106" rx="13" ry="23" transform="rotate(18 90 106)" fill={BIRD_LIGHT} />
      <path
        d="M88 70C70 74 58 92 56 112c-1 14-2 28-4 40 10-12 24-28 32-44 6-12 8-28 4-38z"
        fill={BIRD_DARK}
        stroke={INK}
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      <path d="M87 76c1 14-5 28-15 40-2-8 2-24 15-40z" fill="#fff" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      <path d="M62 130l-6 14M68 126l-8 18" stroke={INK} strokeWidth="2" strokeLinecap="round" opacity=".45" />

      {/* feet gripping the perch */}
      {[71, 86].map((x) => (
        <path key={x} d={`M${x - 4} 141c0-5 3-8 7-8s7 3 7 8`} fill={FEET} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      ))}

      {/* head */}
      <g style={pivot(92, 74, { transform: sleep ? "rotate(10deg)" : "none", transition: settle })}>
        <g
          className={cn(
            "ambient",
            pose === "chirp" && "animate-[rig-headbob_0.6s_ease-in-out_infinite]",
            pose === "perch" && "animate-[rig-tilt_3.6s_ease-in-out_infinite]",
          )}
          style={pivot(92, 74)}
        >
          {/* crest: drawn first so the head covers its base */}
          <g style={pivot(96, 34, { transform: `rotate(${crestTilt[pose]}deg)`, transition: settle })}>
            <g className={cn("ambient", !sleep && "animate-[rig-crest_2.8s_ease-in-out_infinite]")} style={pivot(96, 34)}>
              <path d="M88 38c-6-8-12-14-21-17 9 1 18 6 25 13z" fill={BIRD} stroke={INK} strokeWidth="2.6" strokeLinejoin="round" />
              <path d="M92 36c-4-12-10-21-18-28 10 4 18 13 23 25z" fill={CREST_GREY} stroke={INK} strokeWidth="2.6" strokeLinejoin="round" />
              <path d="M96 35c-2-15-4-27-11-39 8 6 15 20 18 36z" fill={FACE} stroke={INK} strokeWidth="2.6" strokeLinejoin="round" />
              <path d="M87.5-1.5c3 3 5 7 6.5 11-3-2-5-6-6.5-11z" fill={CREST_GREY} />
            </g>
          </g>

          <circle cx="98" cy="52" r="24" fill={BIRD} stroke={INK} strokeWidth="4" />
          <path d="M110 31.2A24 24 0 0 1 95.9 75.9C88 66 88 42 110 31.2z" fill={FACE} />
          <circle cx="98" cy="52" r="24" fill="none" stroke={INK} strokeWidth="4" />
          <circle cx="101" cy="60" r="7" fill={CHEEK} />

          {sleep ? (
            <path d="M95 47q5.5 4.5 11 0" stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />
          ) : (
            <g className="ambient animate-[rig-blink_4.2s_infinite]" style={pivot(101, 47)}>
              <ellipse cx="101" cy="47" rx={pose === "alert" ? 5.6 : 4.6} ry={pose === "alert" ? 6.4 : 5.4} fill={INK} />
              <circle cx="102.8" cy="44.6" r="1.7" fill="#fff" />
            </g>
          )}

          {/* beak */}
          <g
            className={cn("ambient", pose === "chirp" && "animate-[rig-chirp_0.6s_ease-in-out_infinite]")}
            style={pivot(117, 57, { transform: pose === "alert" ? "rotate(14deg)" : undefined })}
          >
            <path d="M116 56c3 0 6 2 7 5-3 2-6 2-8 0z" fill={BEAK} stroke={INK} strokeWidth="2.4" strokeLinejoin="round" />
          </g>
          <path d="M115 47c8-1 13 5 12 14-3-3-7-5-12-4z" fill={BEAK} stroke={INK} strokeWidth="2.6" strokeLinejoin="round" />
        </g>
      </g>

      {pose === "chirp" && <ChirpLines color={marksColor} />}
      {sleep && <SleepZs color={marksColor} />}
    </svg>
  );
}

// Long, pointed wing drawn raised from the shoulder at (93, 62); feathered trailing edge on the left.
const WING = "M104 62C106 40 98 14 80-6Q74 0 77 8Q70 14 75 22Q69 29 75 36Q70 43 77 50Q73 58 82 64Z";

/**
 * The same cockatiel in flight, facing right. `flap="loop"` flaps on its own;
 * `flap="scroll"` follows the `--walk` variable of a `.walker` ancestor.
 */
export function CockatielFlying({
  flap = "loop",
  className,
  ...props
}: { flap?: "loop" | "scroll" } & SVGProps<SVGSVGElement>) {
  const loop = flap === "loop";
  return (
    <svg viewBox="0 0 180 124" aria-hidden="true" overflow="visible" className={className} {...props}>
      <g className={loop ? "ambient animate-[rig-glide_0.36s_ease-in-out_infinite]" : "rig-glide"}>
        <g className={loop ? "ambient animate-[rig-flap_0.36s_ease-in-out_-0.05s_infinite]" : "rig-wing-far"} style={pivot(87, 59)}>
          <path d={WING} transform="translate(-6 -3)" fill={BIRD_DARK} stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
        </g>

        <TailFeather d="M70 62C50 66 28 76 4 90c24-2 46-8 68-18z" fill={BIRD_TAIL} bars="M53.4 67.6l3.2 9.4M38.5 73.3l3 8.7M23.9 79.6l2.2 6.4" outline={3.5} />
        <TailFeather d="M72 68C54 76 36 86 18 100c20-6 38-14 56-24z" fill={BIRD_DARK} bars="M48.3 80.1l3.4 6.8M34.8 88.2l2.4 4.8" outline={3} />

        <ellipse cx="98" cy="66" rx="34" ry="19" transform="rotate(-10 98 66)" fill={BIRD} stroke={INK} strokeWidth="4" />
        <ellipse cx="106" cy="74" rx="22" ry="9" transform="rotate(-10 106 74)" fill={BIRD_LIGHT} />
        <ellipse cx="102" cy="85" rx="6" ry="3.4" fill={FEET} stroke={INK} strokeWidth="2.5" />

        {/* crest swept back in the wind */}
        <path d="M126 40c-10-6-20-9-32-8 12 4 20 9 27 14z" fill={BIRD} stroke={INK} strokeWidth="2.6" strokeLinejoin="round" />
        <path d="M130 36c-10-10-22-15-36-16 13 5 23 12 31 20z" fill={FACE} stroke={INK} strokeWidth="2.6" strokeLinejoin="round" />
        <circle cx="130" cy="50" r="19" fill={BIRD} stroke={INK} strokeWidth="4" />
        <path d="M139.5 33.6A19 19 0 0 1 128.3 68.9C122 61 122 42 139.5 33.6z" fill={FACE} />
        <circle cx="130" cy="50" r="19" fill="none" stroke={INK} strokeWidth="4" />
        <circle cx="132" cy="57" r="5.8" fill={CHEEK} />
        <ellipse cx="134" cy="45" rx="3.9" ry="4.5" fill={INK} />
        <circle cx="135.5" cy="43.2" r="1.4" fill="#fff" />
        <path d="M146.5 53.5c2.5 0 5 1.5 6 4-2.5 1.5-5 1.5-6.5 0z" fill={BEAK} stroke={INK} strokeWidth="2.2" strokeLinejoin="round" />
        <path d="M145.5 45c7-1 11 4 10 11.5-2.5-2.5-6-4-10-3.5z" fill={BEAK} stroke={INK} strokeWidth="2.4" strokeLinejoin="round" />

        <g className={loop ? "ambient animate-[rig-flap_0.36s_ease-in-out_infinite]" : "rig-wing"} style={pivot(93, 62)}>
          <path d={WING} fill={BIRD} stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
          <path d="M103 60c2-16-1-32-9-46-2 14 0 30 2 46z" fill="#fff" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
          <path d="M88 18l-8 6M90 32l-10 5M92 46l-10 4" stroke={INK} strokeWidth="2" strokeLinecap="round" opacity=".35" />
        </g>
      </g>
    </svg>
  );
}
