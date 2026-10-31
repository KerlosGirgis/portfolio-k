"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { missions } from "@/lib/data";
import type { Mission } from "@/lib/data";
import { cn } from "@/lib/utils";

const BRIEFING =
  "Good morning, Agent K. We've compiled your mission history. Every file below is a mission — accomplished, or still in progress. And try not to get caught in any -inators.";

function Monitor() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-120px" });
  const reduce = useReducedMotion();
  const [typed, setTyped] = useState(0);

  useEffect(() => {
    if (!inView) return;
    // With reduced motion the whole briefing appears on the first tick.
    const step = reduce ? BRIEFING.length : 1;
    const id = window.setInterval(() => {
      setTyped((n) => {
        if (n + step >= BRIEFING.length) window.clearInterval(id);
        return Math.min(n + step, BRIEFING.length);
      });
    }, 24);
    return () => window.clearInterval(id);
  }, [inView, reduce]);


  return (
    <Reveal className="mx-auto mt-14 max-w-3xl" y={60}>
      <div ref={ref} className="relative rounded-[2rem] border-4 border-ink bg-[#244b5a] p-3 shadow-[8px_8px_0_0_#000] sm:p-4">
        <div className="relative overflow-hidden rounded-[1.4rem] border-[3px] border-ink bg-[radial-gradient(ellipse_at_center,#13615b_0%,#0a3135_65%,#061c20_100%)] px-5 pb-7 pt-5 sm:px-9">
          <div
            aria-hidden="true"
            className="ambient pointer-events-none absolute inset-0 animate-[scan_0.5s_linear_infinite] bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.22)_0_2px,transparent_2px_4px)]"
          />
          <div className="relative flex items-center justify-between gap-4 font-type text-[11px] tracking-[0.25em] text-glow/80 sm:text-xs">
            <span className="flex items-center gap-2">
              <span className="ambient size-2.5 animate-[cursor-blink_1s_steps(1)_infinite] rounded-full bg-candace" />
              INCOMING TRANSMISSION
            </span>
            <span className="hidden sm:inline">CLASSIFIED</span>
          </div>
          <p className="sr-only">{BRIEFING}</p>
          <p
            aria-hidden="true"
            className="ambient relative mt-5 animate-[flicker_4s_ease-in-out_infinite] font-type text-[1.05rem] leading-relaxed text-glow [text-shadow:0_0_14px_rgba(127,247,228,0.55)] sm:text-xl"
          >
            {BRIEFING.slice(0, typed)}
            <span className="ambient ml-0.5 inline-block h-[1.1em] w-[0.55em] translate-y-[0.15em] animate-[cursor-blink_1s_steps(1)_infinite] bg-glow" />
            <span className="opacity-0">{BRIEFING.slice(typed)}</span>
          </p>
          <p className="relative mt-4 font-type text-[11px] tracking-[0.25em] text-glow/55 sm:text-xs">— HQ, ORGANIZATION WITHOUT A COOL ACRONYM</p>
        </div>
        <span aria-hidden="true" className="absolute bottom-2 left-1/2 size-2 -translate-x-1/2 rounded-full bg-glow/70" />
      </div>
      <div aria-hidden="true" className="mx-auto h-8 w-20 border-x-4 border-ink bg-[#244b5a]" />
      <div aria-hidden="true" className="mx-auto h-4 w-56 rounded-t-xl border-4 border-b-0 border-ink bg-[#244b5a]" />
    </Reveal>
  );
}

const stampStyle: Record<Mission["status"], { label: string; color: string }> = {
  active: { label: "On mission", color: "text-teal-deep" },
  accomplished: { label: "Accomplished", color: "text-candace" },
  graduated: { label: "Graduated", color: "text-doof" },
};

function Fedora({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 40" className={className} aria-hidden="true">
      <path d="M14 26c0-16 8-23 18-23s18 7 18 23z" fill="#8b5a2b" stroke="#1b1534" strokeWidth="3.5" strokeLinejoin="round" />
      <path d="M26 6c3 4 9 4 12 0" fill="none" stroke="#1b1534" strokeWidth="3" strokeLinecap="round" />
      <path d="M15 20c10 4 24 4 34 0v6c-10 4-24 4-34 0z" fill="#3b2412" />
      <ellipse cx="32" cy="28" rx="29" ry="8" fill="#9b6833" stroke="#1b1534" strokeWidth="3.5" />
    </svg>
  );
}

function MissionCard({ mission, index }: { mission: Mission; index: number }) {
  const left = index % 2 === 0;
  const stamp = stampStyle[mission.status];
  return (
    <li className="relative pl-14 lg:grid lg:grid-cols-2 lg:gap-24 lg:pl-0 lg:not-first:-mt-36">
      {/* porthole on the tube */}
      <span
        aria-hidden="true"
        className="absolute left-5 top-12 z-10 grid size-10 -translate-x-1/2 place-items-center rounded-full border-[3px] border-ink bg-teal font-display text-lg text-ink shadow-[0_0_0_4px_rgba(127,247,228,0.25)] lg:left-1/2"
      >
        {index + 1}
      </span>

      <motion.article
        className={cn("relative pt-7", left ? "lg:col-start-1" : "lg:col-start-2")}
        initial={{ opacity: 0, x: left ? -70 : 70, rotate: left ? -5 : 5 }}
        whileInView={{ opacity: 1, x: 0, rotate: left ? -0.8 : 0.8 }}
        viewport={{ once: true, margin: "-90px" }}
        transition={{ type: "spring", stiffness: 150, damping: 19 }}
      >
        <span className="absolute left-6 top-0 h-8 rounded-t-xl border-[3px] border-b-0 border-ink bg-manila px-4 pt-1.5 font-type text-[11px] tracking-[0.2em] text-ink">
          FILE #{String(index + 1).padStart(3, "0")}
        </span>
        <div className="relative rounded-2xl rounded-tl-md border-[3px] border-ink bg-manila p-3 shadow-[7px_7px_0_0_#000] sm:p-4">
          <svg
            viewBox="0 0 24 60"
            aria-hidden="true"
            className="absolute -top-5 right-10 z-10 h-14 w-6 rotate-[8deg]"
          >
            <path
              d="M8 40V12a6 6 0 0 1 12 0v34a8 8 0 0 1-16 0V16"
              fill="none"
              stroke="#8e98a6"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          </svg>
          <div
            className={cn(
              "relative rounded-lg border-2 border-ink/20 p-5 pb-14 text-ink shadow-[2px_3px_0_rgba(0,0,0,0.12)] sm:p-6 sm:pb-14",
              mission.kind === "education" ? "bg-[#f7ecd3]" : "bg-[#fffdf6]",
            )}
          >
            <p className="font-type text-[11px] tracking-[0.22em] text-ink/60">{mission.period.toUpperCase()}</p>
            <h3 className="mt-1.5 font-display text-[1.75rem] leading-tight tracking-wide">{mission.codename}</h3>
            <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 font-type text-[13px] leading-snug">
              <dt className="text-ink/50">ROLE</dt>
              <dd className="font-semibold">{mission.role}</dd>
              <dt className="text-ink/50">{mission.kind === "work" ? "ORG" : "AT"}</dt>
              <dd className="font-semibold">{mission.org}</dd>
            </dl>
            <p className="mt-4 text-[15.5px] leading-relaxed text-ink/85">
              <span className="mb-1 block font-type text-[11px] tracking-[0.22em] text-ink/50">BRIEFING</span>
              {mission.briefing}
            </p>
            {mission.results.length > 0 && (
              <ul className="mt-4 flex flex-wrap gap-2" aria-label="Results">
                {mission.results.map((r) => (
                  <li key={r} className="rounded-lg border-2 border-ink bg-glow px-2.5 py-1 font-display text-[15px] tracking-wide shadow-toon-xs">
                    {r}
                  </li>
                ))}
              </ul>
            )}
            <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Skills">
              {mission.tags.map((t) => (
                <li key={t} className="tag text-ink/65">
                  {t}
                </li>
              ))}
            </ul>
            <motion.span
              className={cn("stamp absolute bottom-3 right-4 bg-transparent text-[0.95rem]", stamp.color)}
              initial={{ opacity: 0, scale: 2.6, rotate: -28 }}
              whileInView={{ opacity: 0.92, scale: 1, rotate: -11 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ type: "spring", stiffness: 520, damping: 16, delay: 0.45 }}
            >
              {stamp.label}
            </motion.span>
          </div>
        </div>
      </motion.article>
    </li>
  );
}

function Timeline() {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 110, damping: 26 });
  const hatTop = useTransform(progress, (v) => `${v * 100}%`);

  return (
    <div className="relative mt-20">
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-5 w-6 -translate-x-1/2 rounded-full border-[3px] border-ink bg-white/10 shadow-[inset_3px_0_0_rgba(255,255,255,0.25)] lg:left-1/2"
      >
        <motion.div
          style={{ scaleY: progress }}
          className="absolute inset-[3px] origin-top rounded-full bg-glow shadow-[0_0_16px_rgba(127,247,228,0.85)]"
        />
        <motion.div style={{ top: hatTop }} className="absolute left-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
          <Fedora className="w-14 drop-shadow-[0_3px_0_#000]" />
        </motion.div>
      </div>
      <ol ref={ref} className="relative space-y-14 lg:space-y-0">
        {missions.map((m, i) => (
          <MissionCard key={m.id} mission={m} index={i} />
        ))}
      </ol>
    </div>
  );
}

export function Experience() {
  return (
    <section id="experience" aria-labelledby="experience-title" className="bg-lair relative overflow-x-clip pb-28 pt-24 text-paper sm:pb-36 sm:pt-28">
      <div aria-hidden="true" className="edge-zigzag absolute inset-x-0 top-0 -translate-y-[calc(100%-1px)] [--edge:var(--color-lair)]" />
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          id="experience-title"
          tone="light"
          kicker="Meanwhile, at secret agent HQ…"
          title="Mission Log"
          fill="var(--color-teal)"
          capBg="var(--color-glow)"
        >
          Every summer has its secret missions. Here are mine — internships, training and freelance work, filed and stamped.
        </SectionHeading>
        <Monitor />
        <Timeline />
      </div>
    </section>
  );
}
