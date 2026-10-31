"use client";

import { useRef } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useTransform } from "motion/react";
import type { MotionValue } from "motion/react";
import { CockatielFlying, KidKerlos } from "@/components/characters";

/**
 * Kerlos strolling down Main Street with his cockatiel flying ahead. Steps and wingbeats are
 * driven by how far the street has scrolled (see `.walker` in globals.css), so they pause when you do.
 */
export function StrollingDuo({ x, progress }: { x: MotionValue<number>; progress: MotionValue<number> }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  // Once the street runs out, they wander off to the right.
  const exit = useTransform(progress, [0.92, 1], ["0vw", "34vw"]);

  useMotionValueEvent(x, "change", (v) => {
    const el = ref.current;
    if (!el || reduce) return;
    const travelled = -v;
    el.style.setProperty("--walk", `${(travelled / 14).toFixed(3)}rad`);
  });

  return (
    <motion.div
      ref={ref}
      aria-hidden="true"
      style={{ x: exit }}
      className="walker pointer-events-none absolute bottom-[3.4rem] right-[5vw] z-20 flex items-end gap-1"
    >
      <KidKerlos pose="walk" className="h-[clamp(112px,17vh,152px)] w-auto drop-shadow-[0_4px_0_rgba(27,21,52,0.18)]" />
      <CockatielFlying
        flap="scroll"
        className="mb-[clamp(96px,15vh,136px)] ml-2 h-[clamp(52px,8vh,72px)] w-auto drop-shadow-[0_4px_0_rgba(27,21,52,0.18)]"
      />
    </motion.div>
  );
}
