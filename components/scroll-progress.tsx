"use client";

import { motion, useScroll, useSpring, useTransform } from "motion/react";

/** A tiny rollercoaster cart riding a track along the top of the page. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.4 });
  const left = useTransform(progress, (v) => `calc(${v * 100}% - ${v * 30}px)`);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[7px] bg-ink/15">
      <motion.div style={{ scaleX: progress }} className="absolute inset-0 origin-left bg-orange" />
      <motion.svg
        viewBox="0 0 30 18"
        style={{ left }}
        className="absolute top-0.5 w-[30px] drop-shadow-[0_1px_0_rgba(0,0,0,0.25)]"
      >
        <path d="M2 4h24l-3 9H5z" fill="#ff4d5e" stroke="#1b1534" strokeWidth="2" strokeLinejoin="round" />
        <circle cx="8" cy="14.5" r="2.6" fill="#1b1534" />
        <circle cx="20" cy="14.5" r="2.6" fill="#1b1534" />
      </motion.svg>
    </div>
  );
}
