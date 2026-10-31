"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Platypus } from "@/components/art";
import { cn } from "@/lib/utils";

type Phase = "idle" | "agent" | "gone" | "back";

const lines: Partial<Record<Phase, string>> = {
  agent: "*chatters*",
  gone: "Hey, where's Perry?",
  back: "Oh, there you are, Perry!",
};

/** Easter egg: the platypus peeking over the fence goes on a secret mission when clicked. */
export function PerryPeek({ className }: { className?: string }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  function startMission() {
    if (phase !== "idle") return;
    setPhase("agent");
    timers.current = [
      window.setTimeout(() => setPhase("gone"), 1300),
      window.setTimeout(() => setPhase("back"), 3600),
      window.setTimeout(() => setPhase("idle"), 6200),
    ];
  }

  const line = lines[phase];

  return (
    <div className={cn("absolute", className)}>
      <AnimatePresence>
        {line && (
          <motion.p
            key={line}
            role="status"
            className="bubble absolute bottom-[calc(100%+14px)] left-1/2 w-max max-w-[220px] px-4 py-2 text-sm font-semibold [--tail-x:42%]"
            initial={{ opacity: 0, scale: 0.4, x: "-50%", y: 10 }}
            animate={{ opacity: 1, scale: 1, x: "-50%", y: 0 }}
            exit={{ opacity: 0, scale: 0.4, x: "-50%" }}
            transition={{ type: "spring", stiffness: 420, damping: 22 }}
          >
            {line}
          </motion.p>
        )}
      </AnimatePresence>
      <motion.button
        type="button"
        onClick={startMission}
        aria-label="Where's Perry? (easter egg)"
        title="Psst… click me"
        className="block w-full cursor-pointer rounded-full"
        animate={{ y: phase === "gone" ? "88%" : "0%" }}
        transition={phase === "gone" ? { duration: 0.35, ease: "easeIn" } : { type: "spring", stiffness: 260, damping: 14 }}
      >
        <span className="ambient block animate-[bob_3.2s_ease-in-out_infinite]">
          <Platypus agent={phase === "agent"} className="w-full drop-shadow-[0_2px_0_rgba(27,21,52,0.25)]" />
        </span>
      </motion.button>
    </div>
  );
}
