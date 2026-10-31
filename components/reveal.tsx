"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";

/** Springs its children into view the first time they scroll on screen. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 36,
  rotate = 0,
  scale = 1,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  rotate?: number;
  scale?: number;
  as?: "div" | "li" | "article";
}) {
  const Component = motion[as];
  return (
    <Component
      className={className}
      initial={{ opacity: 0, y, rotate, scale }}
      whileInView={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ type: "spring", stiffness: 220, damping: 22, delay }}
    >
      {children}
    </Component>
  );
}
