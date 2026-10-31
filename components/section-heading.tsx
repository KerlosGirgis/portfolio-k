"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";
import type { Variants } from "motion/react";
import { cn, vars } from "@/lib/utils";

const letter: Variants = {
  hidden: { opacity: 0, y: "0.55em", scale: 0.4, rotate: -12 },
  show: { opacity: 1, y: "0em", scale: 1, rotate: 0, transition: { type: "spring", stiffness: 420, damping: 18 } },
};

export function SectionHeading({
  id,
  kicker,
  title,
  children,
  align = "center",
  tone = "dark",
  fill = "var(--color-sun)",
  capBg,
  className,
}: {
  id?: string;
  kicker?: string;
  title: string;
  children?: ReactNode;
  align?: "center" | "left";
  tone?: "dark" | "light";
  fill?: string;
  capBg?: string;
  className?: string;
}) {
  const words = title.split(" ");
  return (
    <div
      className={cn(
        "flex flex-col gap-5",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className,
      )}
    >
      {kicker && (
        <motion.p
          className="caption text-sm sm:text-base"
          style={capBg ? vars({ "--cap-bg": capBg }) : undefined}
          initial={{ opacity: 0, x: -36, scale: 0.8 }}
          whileInView={{ opacity: 1, x: 0, scale: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ type: "spring", stiffness: 300, damping: 18 }}
        >
          {kicker}
        </motion.p>
      )}
      <h2 id={id} className="title-toon text-[clamp(2.9rem,8vw,5.6rem)]" style={vars({ "--fill": fill })}>
        <span className="sr-only">{title}</span>
        <motion.span
          aria-hidden="true"
          className="inline"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          transition={{ staggerChildren: 0.035, delayChildren: 0.1 }}
        >
          {words.map((word, w) => (
            <span key={w} className="inline-block whitespace-nowrap">
              {Array.from(word).map((ch, i) => (
                <motion.span key={i} variants={letter} className="inline-block">
                  {ch}
                </motion.span>
              ))}
              {w < words.length - 1 && <span className="inline-block w-[0.28em]" />}
            </span>
          ))}
        </motion.span>
      </h2>
      {children && (
        <motion.div
          className={cn(
            "max-w-2xl text-lg leading-relaxed font-medium sm:text-xl",
            tone === "light" ? "text-paper/85" : "text-ink/80",
          )}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.25, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      )}
    </div>
  );
}
