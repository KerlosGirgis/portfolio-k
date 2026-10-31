"use client";

import { motion } from "motion/react";
import type { Variants } from "motion/react";

const draw: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  show: (i: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: { pathLength: { delay: 0.2 + i * 0.12, duration: 0.9, ease: "easeInOut" }, opacity: { delay: 0.2 + i * 0.12, duration: 0.01 } },
  }),
};

const petals = [0, 60, 120, 180, 240, 300];

/** A line-drawn phone + flower for the app whose screenshots aren't ready yet. */
export function FlowerSketch() {
  return (
    <motion.svg
      viewBox="0 0 200 380"
      className="h-[86%] w-auto"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      aria-hidden="true"
      fill="none"
      stroke="#e9f3ff"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <motion.rect x="10" y="10" width="180" height="360" rx="30" variants={draw} custom={0} strokeWidth="3.5" />
      <motion.path d="M80 26h40" variants={draw} custom={1} />
      <motion.path d="M30 56h70M30 72h40" variants={draw} custom={1} opacity=".7" />
      <motion.circle cx="160" cy="62" r="12" variants={draw} custom={2} />
      <g transform="translate(100 160)">
        {petals.map((a, i) => (
          <g key={a} transform={`rotate(${a})`}>
            <motion.ellipse cx="0" cy="-30" rx="16" ry="28" variants={draw} custom={2 + i * 0.4} stroke="#ff8fc4" />
          </g>
        ))}
        <motion.circle r="14" variants={draw} custom={5} stroke="#ffd23f" />
      </g>
      <motion.path d="M100 205c-2 30 2 50 0 70" variants={draw} custom={5.5} stroke="#7ccb45" />
      <motion.path d="M100 245c14-16 30-16 40-10-12 14-28 16-40 10zM100 230c-14-14-28-14-38-8 10 12 26 14 38 8z" variants={draw} custom={6} stroke="#7ccb45" />
      <motion.rect x="34" y="300" width="132" height="40" rx="20" variants={draw} custom={7} />
      <motion.path d="M78 320h44" variants={draw} custom={7.5} />
      {/* dimension line */}
      <motion.path d="M10 376v-2M190 376v-2M14 375h172" variants={draw} custom={8} strokeWidth="1.5" opacity=".6" />
    </motion.svg>
  );
}
