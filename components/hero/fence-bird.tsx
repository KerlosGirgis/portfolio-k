"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Cockatiel, CockatielFlying } from "@/components/characters";
import { cn } from "@/lib/utils";

type Phase = "idle" | "chirp" | "away" | "back" | "landed";

const lines: Partial<Record<Phase, string>> = {
  chirp: "*chirp chirp!*",
  away: "Hey, where'd she go?",
  landed: "Oh, there you are!",
};

/** Easter egg: the cockatiel on the fence chirps, flies off toward the sun and swoops back. */
export function FenceBird({ className }: { className?: string }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  function startShow() {
    if (phase !== "idle") return;
    setPhase("chirp");
    timers.current = [
      window.setTimeout(() => setPhase("away"), 1100),
      window.setTimeout(() => setPhase("back"), 3500),
      window.setTimeout(() => setPhase("landed"), 4700),
      window.setTimeout(() => setPhase("idle"), 7000),
    ];
  }

  const line = lines[phase];
  const flying = phase === "away" || phase === "back";

  return (
    <div className={cn("absolute", className)}>
      <AnimatePresence>
        {line && (
          <motion.p
            key={line}
            role="status"
            className="bubble absolute bottom-[calc(100%+10px)] left-1/2 w-max max-w-[230px] px-4 py-2 text-sm font-semibold [--tail-x:42%]"
            initial={{ opacity: 0, scale: 0.4, x: "-50%", y: 10 }}
            animate={{ opacity: 1, scale: 1, x: "-50%", y: 0 }}
            exit={{ opacity: 0, scale: 0.4, x: "-50%" }}
            transition={{ type: "spring", stiffness: 420, damping: 22 }}
          >
            {line}
          </motion.p>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={startShow}
        aria-label="Cockatiel on the fence (easter egg)"
        title="Psst… click me"
        className={cn("block w-full cursor-pointer rounded-full", flying && "invisible")}
      >
        <Cockatiel
          pose={phase === "chirp" ? "alert" : phase === "landed" ? "chirp" : "perch"}
          className="w-full drop-shadow-[0_2px_0_rgba(27,21,52,0.25)]"
        />
      </button>

      {flying && (
        <motion.div
          key={phase}
          aria-hidden="true"
          className="pointer-events-none absolute -left-[12%] top-[18%] w-[124%]"
          initial={phase === "away" ? { x: 0, y: 0, rotate: 0 } : { x: "-62vw", y: "-46vh", rotate: 14 }}
          animate={phase === "away" ? { x: "62vw", y: "-82vh", rotate: -12 } : { x: 0, y: 0, rotate: 0 }}
          transition={phase === "away" ? { duration: 1.15, ease: "easeIn" } : { duration: 1.2, ease: "easeOut" }}
        >
          <CockatielFlying className="w-full" />
        </motion.div>
      )}
    </div>
  );
}
