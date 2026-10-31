import type { SVGProps } from "react";

const INK = "#1b1534";

export function Cloud(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 220 110" aria-hidden="true" {...props}>
      <path
        d="M40 92C14 92 10 62 34 58c-4-28 28-36 42-18 8-26 52-30 62-2 12-16 48-10 46 18 24 0 30 36 4 36z"
        fill="#fff"
        stroke={INK}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path d="M45 89c-12 0-15-9-8-12 34 8 112 8 148 0 9 5 7 12-1 12z" fill="#d7f3ff" />
    </svg>
  );
}

/** A teal platypus, peeking. `agent` gives him the fedora and the serious look. */
export function Platypus({ agent = false, ...props }: { agent?: boolean } & SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 160 150" aria-hidden="true" {...props}>
      <path d="M18 150C14 92 36 46 80 46s66 46 62 104z" fill="#2cc3b5" stroke={INK} strokeWidth="5" />
      <path d="M32 132c4-30 16-58 40-70" fill="none" stroke="#7fe6d9" strokeWidth="5" strokeLinecap="round" opacity=".7" />
      {/* eyes */}
      <g stroke={INK} strokeWidth="4">
        <ellipse cx="62" cy="66" rx="17" ry="19" fill="#fff" />
        <ellipse cx="98" cy="66" rx="17" ry="19" fill="#fff" />
      </g>
      {agent ? (
        <>
          <circle cx="64" cy="70" r="6" fill={INK} />
          <circle cx="96" cy="70" r="6" fill={INK} />
          <path d="M44 62c10-10 26-10 36-2v-12H44zM80 60c10-8 26-8 36 2V48H80z" fill="#2cc3b5" />
          <path d="M45 61c10-8 25-8 35 1M80 62c10-9 25-9 35-1" fill="none" stroke={INK} strokeWidth="4" strokeLinecap="round" />
        </>
      ) : (
        <g className="ambient" style={{ animation: "blink 5s infinite", transformOrigin: "80px 66px" }}>
          <circle cx="56" cy="72" r="6" fill={INK} />
          <circle cx="104" cy="62" r="6" fill={INK} />
        </g>
      )}
      {/* bill */}
      <ellipse cx="80" cy="110" rx="47" ry="19" fill="#ffa83a" stroke={INK} strokeWidth="5" />
      <path d="M48 106c18 6 46 6 64 0" fill="none" stroke="#e07d10" strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="71" cy="101" rx="3.4" ry="2.2" fill={INK} />
      <ellipse cx="89" cy="101" rx="3.4" ry="2.2" fill={INK} />
      {/* paws on the fence */}
      <g fill="#2cc3b5" stroke={INK} strokeWidth="4">
        <ellipse cx="30" cy="141" rx="15" ry="9" />
        <ellipse cx="130" cy="141" rx="15" ry="9" />
      </g>
      {agent && (
        <g stroke={INK} strokeWidth="4" strokeLinejoin="round">
          <path d="M46 50c0-26 14-38 34-38s34 12 34 38z" fill="#8b5a2b" />
          <path d="M68 16c6 6 18 6 24 0" fill="none" strokeLinecap="round" />
          <path d="M47 40c18 6 48 6 66 0v10c-18 6-48 6-66 0z" fill="#3b2412" strokeWidth="3" />
          <ellipse cx="80" cy="51" rx="58" ry="10" fill="#9b6833" />
        </g>
      )}
    </svg>
  );
}

export function Hills(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 1440 200" preserveAspectRatio="none" aria-hidden="true" {...props}>
      <path
        d="M0 112C240 30 470 40 720 108s470 10 720-14v106H0z"
        fill="#a8e27f"
        stroke={INK}
        strokeWidth="3"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M0 158c300-60 600-12 820-30 280-24 480 16 620 10v62H0z"
        fill="#8bd062"
        stroke={INK}
        strokeWidth="3"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/** Wavy grass edge at the bottom of a scene. */
export function GrassEdge(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden="true" {...props}>
      <path
        d="M0 18c40-14 80 10 120 0s80-16 120-2 80 12 120 0 80-14 120-2 80 14 120 2 80-16 120-2 80 12 120 0 80-14 120-2 80 14 120 2 80-16 120-2 80 12 120 0v42H0z"
        fill="#7ccb45"
        stroke={INK}
        strokeWidth="3"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
