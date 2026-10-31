"use client";

import { useEffect, useRef } from "react";
import type { SVGProps } from "react";
import { vars } from "@/lib/utils";

const INK = "#1b1534";

// Rises from behind the fence, then hill, drop, loop-de-loop, exit. Box is 1000×560, ground at y=560.
const TRACK =
  "M-20 590C110 590 180 150 300 150S440 470 560 470C640 470 660 410 720 410C780.75 410 830 360.75 830 300S780.75 190 720 190S610 239.25 610 300S659.25 410 720 410C800 410 880 400 1020 390";

// [x, y-on-track] for the support posts (precomputed from the curve).
const POSTS: [number, number][] = [
  [90, 485], [150, 357], [200, 251], [250, 176], [300, 150], [350, 172], [400, 245], [450, 356],
  [500, 439], [560, 470], [640, 445], [700, 413], [760, 409], [820, 406], [900, 399], [980, 393],
];

// Slow climb, fast drop, loop, exit, then a short pause off-screen.
const KEY_POINTS = "0;0.2613;0.4616;0.5419;0.8611;1;1";
const KEY_TIMES = "0;0.4;0.5;0.55;0.75;0.86;1";

export function Coaster(props: SVGProps<SVGSVGElement>) {
  const motionRef = useRef<SVGAnimateMotionElement>(null);
  const cartRef = useRef<SVGGElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const introOff = document.documentElement.dataset.intro === "off";
    const delay = (introOff ? 0 : 1450) + 2300;
    const t = window.setTimeout(() => {
      motionRef.current?.beginElement();
      if (cartRef.current) cartRef.current.style.opacity = "1";
    }, delay);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <svg viewBox="0 0 1000 560" aria-hidden="true" overflow="visible" {...props}>
      <defs>
        <mask id="coaster-reveal" maskUnits="userSpaceOnUse" x="-60" y="0" width="1120" height="700">
          <path d={TRACK} fill="none" stroke="#fff" strokeWidth="70" pathLength={1} className="coaster-draw" />
        </mask>
      </defs>

      {/* supports */}
      <g strokeLinecap="round">
        <path d="M80 512H990" stroke={INK} strokeWidth="9" className="coaster-post" style={vars({ "--d": "0ms" })} />
        {POSTS.map(([x, y], i) => (
          <g key={x} className="coaster-post" style={vars({ "--d": `${i * 45}ms` })}>
            <path d={`M${x} ${y + 8}V560`} stroke={INK} strokeWidth="10" />
            <path d={`M${x} ${y + 8}V560`} stroke="#fff3df" strokeWidth="4.5" />
          </g>
        ))}
        <g className="coaster-post" style={vars({ "--d": "500ms" })} stroke={INK} strokeWidth="4" opacity=".55">
          <path d="M90 512l60-140M150 512l50-250M250 512l50-330M300 512l50-310M350 512l50-240M400 512l50-130" />
        </g>
      </g>

      {/* track */}
      <g mask="url(#coaster-reveal)" fill="none">
        <path d={TRACK} stroke={INK} strokeWidth="26" strokeDasharray="6 8" />
        <path d={TRACK} stroke="#e0a565" strokeWidth="20" strokeDasharray="3 11" strokeDashoffset="-1.5" />
        <path d={TRACK} stroke={INK} strokeWidth="12" />
        <path d={TRACK} stroke="#ff4d5e" strokeWidth="6" />
        <path d={TRACK} stroke="#fff" strokeWidth="1.6" opacity=".55" />
      </g>

      {/* cart: Kerlos with his cockatiel riding up front */}
      <g ref={cartRef} style={{ opacity: 0, transition: "opacity .4s" }}>
        <animateMotion
          ref={motionRef}
          begin="indefinite"
          dur="7.5s"
          repeatCount="indefinite"
          rotate="auto"
          calcMode="linear"
          keyPoints={KEY_POINTS}
          keyTimes={KEY_TIMES}
          path={TRACK}
        />
        <g transform="translate(0 -7)">
          <circle cx="-9" cy="-31" r="7.5" fill="#c98d64" stroke={INK} strokeWidth="2.4" />
          <path d="M-17 -31c-1-9 4-12 8-12s10 3 8 11c-3-4-10-5-16 1z" fill="#2a1a14" stroke={INK} strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M-12 -27q3 3 6 0" stroke={INK} strokeWidth="1.6" fill="none" strokeLinecap="round" />
          <ellipse cx="13" cy="-29" rx="5.4" ry="7.4" transform="rotate(18 13 -29)" fill="#9ea2aa" stroke={INK} strokeWidth="1.8" />
          <path d="M11.5 -34c-3 3-4 7-3.5 11 3-2 4.5-6 4.5-10z" fill="#6b6f78" />
          <path d="M15.6 -41.5c-1-4-3.6-7-7.2-8.6 3 2.6 4.6 5.6 5 9z" fill="#b3b6bc" stroke={INK} strokeWidth="1.3" strokeLinejoin="round" />
          <circle cx="16.6" cy="-37.6" r="4.9" fill="#9ea2aa" stroke={INK} strokeWidth="1.8" />
          <circle cx="18.6" cy="-37.6" r="2.4" fill="#e2d38c" />
          <circle cx="16.8" cy="-35.4" r="1.6" fill="#f2a165" />
          <circle cx="17.6" cy="-38.8" r="0.95" fill={INK} />
          <path d="M21.1 -39.2l3.2 1.6-3.1 1.5z" fill="#8e8a93" stroke={INK} strokeWidth="0.9" strokeLinejoin="round" />
          <path d="M-26 -4H24l5-19H-20q-6 0-6 6z" fill="#2cc3b5" stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
          <path d="M-20 -13H22" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
          <circle cx="-14" cy="-2" r="5" fill={INK} />
          <circle cx="14" cy="-2" r="5" fill={INK} />
        </g>
      </g>
    </svg>
  );
}
