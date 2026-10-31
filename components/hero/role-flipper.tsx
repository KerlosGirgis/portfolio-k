"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";

export function RoleFlipper({
  roles,
  className,
  style,
}: {
  roles: readonly string[];
  className?: string;
  style?: CSSProperties;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setIndex((i) => (i + 1) % roles.length), 2600);
    return () => window.clearInterval(id);
  }, [roles.length]);

  return (
    <p className={cn("mt-5", className)} style={style}>
      <span className="sr-only">{roles.join(", ")}</span>
      <span
        aria-hidden="true"
        className="relative inline-grid -rotate-2 overflow-hidden rounded-2xl border-[3px] border-ink bg-ink px-5 pb-1.5 pt-2.5 font-display text-[clamp(1.35rem,3.4vw,2.05rem)] leading-none tracking-wide text-sun shadow-[4px_4px_0_0_var(--color-orange)] [perspective:400px]"
      >
        {roles.map((role) => (
          <span key={role} className="invisible col-start-1 row-start-1">
            {role}
          </span>
        ))}
        <AnimatePresence initial={false}>
          <motion.span
            key={roles[index]}
            className="col-start-1 row-start-1 text-center"
            initial={{ y: "115%", rotateX: -70, opacity: 0 }}
            animate={{ y: "0%", rotateX: 0, opacity: 1 }}
            exit={{ y: "-115%", rotateX: 70, opacity: 0 }}
            transition={{ type: "spring", stiffness: 340, damping: 24 }}
          >
            {roles[index]}
          </motion.span>
        </AnimatePresence>
      </span>
    </p>
  );
}
