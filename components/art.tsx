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
