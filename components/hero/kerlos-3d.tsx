"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Cockatiel, KidKerlos } from "@/components/characters";
import { cn } from "@/lib/utils";
import { createStage } from "./kerlos-3d-stage";

type Chirp = { id: number; x: number; y: number };

function supportsWebGL2() {
  try {
    const gl = document.createElement("canvas").getContext("webgl2");
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
    return Boolean(gl);
  } catch {
    return false;
  }
}

/**
 * Kerlos in 3D with his cockatiel on his shoulder, filling the nearest positioned parent.
 * Drag to spin him round; poke either of them.
 */
export function Kerlos3D({ className }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [webgl] = useState(supportsWebGL2);
  const [chirp, setChirp] = useState<Chirp | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const introOff = document.documentElement.dataset.intro === "off";
    const stage = createStage(host, {
      reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      // Pop in with the rest of the hero, once the intro title card has opened.
      delay: Math.max(0, (introOff ? 0 : 1.45) + 0.3 - performance.now() / 1000),
      onChirp: (x, y) => setChirp({ id: performance.now(), x, y }),
    });
    return stage.dispose;
  }, []);

  useEffect(() => {
    if (!chirp) return;
    const t = window.setTimeout(() => setChirp(null), 1500);
    return () => window.clearTimeout(t);
  }, [chirp]);

  if (!webgl) {
    return (
      <div aria-hidden="true" className={cn("absolute inset-0 flex items-end justify-center pb-[4%]", className)}>
        <div className="relative h-[80%]">
          <KidKerlos className="h-full w-auto" />
          <Cockatiel className="absolute left-[60%] top-[19%] w-[46%]" />
        </div>
      </div>
    );
  }

  return (
    <div
      ref={hostRef}
      role="img"
      aria-label="A 3D cartoon of Kerlos with his grey cockatiel perched on his shoulder"
      title="Drag to spin us around!"
      className={cn("absolute inset-0", className)}
    >
      <AnimatePresence>
        {chirp && (
          <motion.p
            key={chirp.id}
            aria-hidden="true"
            className="bubble pointer-events-none absolute w-max px-4 py-2 text-sm font-semibold [--tail-x:18%]"
            style={{ left: chirp.x, top: chirp.y }}
            initial={{ opacity: 0, scale: 0.4, x: "-18%", y: "-90%" }}
            animate={{ opacity: 1, scale: 1, x: "-18%", y: "-100%" }}
            exit={{ opacity: 0, scale: 0.4 }}
            transition={{ type: "spring", stiffness: 420, damping: 22 }}
          >
            *chirp chirp!*
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
