"use client";

import { useEffect, useRef, useState } from "react";
import { Cockatiel, KidKerlos } from "@/components/characters";
import { vars } from "@/lib/utils";

const words = ["The", "Fast", "and", "the", "Flutterious"];

/**
 * Cartoon episode title card that irises open onto the page.
 * Pure CSS animation (see `.intro` in globals.css) so it plays before hydration;
 * this component only handles skipping and removing it from the DOM.
 */
export function Intro() {
  const ref = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || getComputedStyle(el).display === "none") return;

    const skip = () => {
      document.documentElement.style.setProperty("--intro-delay", "0s");
      el.setAttribute("data-skip", "");
    };
    const finish = (e: AnimationEvent) => {
      if (e.animationName === "intro-hide") setDone(true);
    };
    el.addEventListener("animationend", finish);
    window.addEventListener("keydown", skip, { once: true });
    return () => {
      el.removeEventListener("animationend", finish);
      window.removeEventListener("keydown", skip);
    };
  }, []);

  if (done) return null;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      onClick={() => {
        document.documentElement.style.setProperty("--intro-delay", "0s");
        ref.current?.setAttribute("data-skip", "");
      }}
      className="intro fixed inset-0 z-[100] grid cursor-pointer place-items-center overflow-hidden bg-orange"
    >
      <div className="sunburst ambient absolute left-1/2 top-1/2 size-[220vmax] -translate-x-1/2 -translate-y-1/2 animate-[spin_30s_linear_infinite] [--ray-a:rgba(255,210,63,0.9)] [-webkit-mask-image:none] [mask-image:none]" />
      <div className="relative flex flex-col items-center px-6 text-center">
        <p className="bubble enter-bubble mb-8 px-5 py-2 text-lg font-semibold [--intro-delay:0s] [--tail-x:45%]" style={vars({ "--d": "50ms" })}>
          Today&rsquo;s episode&hellip;
        </p>
        <p className="title-toon flex flex-wrap justify-center gap-x-[0.28em] text-[clamp(2.4rem,7.5vw,5.6rem)] [--fill:#fff]">
          {words.slice(0, -1).map((w, i) => (
            <span key={w + i} className="enter-pop [--intro-delay:0s]" style={vars({ "--d": `${200 + i * 110}ms` })}>
              {w}
            </span>
          ))}
        </p>
        <p className="title-toon mt-2 text-[clamp(3.3rem,12.5vw,9.5rem)] [--fill:var(--color-sun)]">
          <span className="enter-pop [--intro-delay:0s]" style={vars({ "--d": "680ms" })}>
            {words[words.length - 1]}
          </span>
        </p>
        <p className="enter-rise mt-5 font-display text-xl tracking-widest text-ink [--intro-delay:0s] sm:text-2xl" style={vars({ "--d": "900ms" })}>
          starring Kerlos &amp; his cockatiel
        </p>
      </div>
      <KidKerlos
        pose="wave"
        className="enter-up absolute bottom-0 left-[3%] h-[24vh] max-h-[290px] w-auto [--intro-delay:0s] sm:left-[7%] sm:h-[34vh]"
        style={vars({ "--d": "450ms" })}
      />
      <Cockatiel
        pose="chirp"
        perch="long-branch"
        className="enter-from-right absolute bottom-[7%] right-[5%] h-[20vh] max-h-[250px] w-auto [--intro-delay:0s] sm:right-[8%] sm:h-[28vh]"
        style={vars({ "--d": "500ms" })}
      />
      <p className="absolute top-6 text-sm font-semibold text-ink/70 sm:bottom-6 sm:top-auto">Click anywhere to skip</p>
    </div>
  );
}
