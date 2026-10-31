"use client";

import { useEffect, useRef } from "react";
import { animate, motion, useInView } from "motion/react";
import type { Variants } from "motion/react";
import { Icon } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { quickFacts, stats, todaysPlan } from "@/lib/data";
import { cn } from "@/lib/utils";

function format(value: number, decimals: number) {
  return value.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

function CountUp({ value, decimals = 0, suffix }: { value: number; decimals?: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (!inView) {
      node.textContent = format(0, decimals) + suffix;
      return;
    }
    const controls = animate(0, value, {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        node.textContent = format(v, decimals) + suffix;
      },
    });
    return () => controls.stop();
  }, [inView, value, decimals, suffix]);

  return <span ref={ref}>{format(value, decimals) + suffix}</span>;
}

const planItem: Variants = {
  hidden: { opacity: 0, x: -14 },
  show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 22 } },
};
const checkMark: Variants = {
  hidden: { pathLength: 0 },
  show: { pathLength: 1, transition: { duration: 0.45, delay: 0.2, ease: "easeOut" } },
};

function Notebook() {
  return (
    <div className="toon relative rotate-[1.5deg] overflow-hidden bg-[#fffdf4] pb-8 pl-16 pr-6 pt-6 sm:pl-20 sm:pr-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 top-[3.45rem] bg-[linear-gradient(transparent_calc(2.4rem-2px),#a9d6ff_calc(2.4rem-2px))] bg-[length:100%_2.4rem]"
      />
      <div aria-hidden="true" className="absolute inset-y-0 left-11 w-0.5 bg-candace/60 sm:left-14" />
      <div aria-hidden="true" className="absolute inset-y-6 left-3 flex flex-col justify-between sm:left-4">
        {Array.from({ length: 7 }, (_, i) => (
          <span key={i} className="size-4 rounded-full border-2 border-ink/40 bg-paper-deep shadow-[inset_1px_1px_2px_rgba(0,0,0,0.25)]" />
        ))}
      </div>
      <span aria-hidden="true" className="tape absolute -right-6 top-3 rotate-[28deg] px-10 text-sm">
        &nbsp;
      </span>

      <h3 className="relative font-hand text-[2.1rem] font-bold leading-[2.4rem] text-orange-deep">Today&rsquo;s plan:</h3>
      <motion.ul
        className="relative"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        transition={{ staggerChildren: 0.2, delayChildren: 0.2 }}
      >
        {todaysPlan.map((item) => (
          <motion.li key={item.text} variants={planItem} className="flex items-start gap-3 font-hand text-[1.55rem] leading-[2.4rem] sm:text-[1.7rem]">
            <svg viewBox="0 0 28 28" className="mt-1.5 size-7 shrink-0" aria-hidden="true">
              <rect x="3" y="3" width="22" height="22" rx="5" fill="#fff" stroke="#1b1534" strokeWidth="2.5" />
              {item.done && (
                <motion.path
                  d="M7 14.5l5 5L23 6"
                  fill="none"
                  stroke="#e35d00"
                  strokeWidth="3.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  variants={checkMark}
                />
              )}
            </svg>
            <span>
              <span className="sr-only">{item.done ? "Done: " : "Not done yet: "}</span>
              <span className={cn(item.done && "line-through decoration-orange/60 decoration-[3px]")}>{item.text}</span>
              {item.note && <span className="ml-2 inline-block -rotate-2 text-xl text-candace">({item.note})</span>}
            </span>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
}

const statColors = ["bg-sun", "bg-sky", "bg-teal", "bg-pink"];
const statTilt = ["-rotate-2", "rotate-1", "-rotate-1", "rotate-2"];

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="bg-dots relative overflow-x-clip bg-paper pb-24 pt-14 sm:pb-32 sm:pt-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading id="about-title" kicker="The big question" title="Whatcha doin'?" fill="var(--color-pink)" />

        <div className="mt-14 grid items-start gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div>
            <Reveal rotate={-3}>
              <p className="bubble px-6 py-5 text-xl font-semibold leading-snug sm:text-2xl">
                Oh, just building apps &amp; websites that people actually enjoy using.
              </p>
            </Reveal>
            <Reveal delay={0.08} className="mt-12 space-y-5 text-lg leading-relaxed text-ink/85 sm:text-[1.15rem]">
              <p>
                I&rsquo;m <strong className="text-ink">Kerlos Amir Girgis</strong>, a Flutter developer from Cairo with a degree in
                Computer Science and a soft spot for clean, scalable code. I build production-ready mobile apps with{" "}
                <strong className="text-ink">Clean Architecture</strong> and <strong className="text-ink">BLoC</strong> — and polished
                websites for businesses across Saudi Arabia and Egypt.
              </p>
              <p>
                My open-source <strong className="text-ink">Todo</strong> app — offline, AES-256 encrypted and locked behind
                biometrics — has passed <strong className="text-ink">7,000 downloads</strong>. These days I&rsquo;m architecting
                e-commerce apps as a Flutter developer intern at <strong className="text-ink">Elevate Tech</strong>, and freelancing on
                the side.
              </p>
            </Reveal>
            <Reveal delay={0.16}>
              <ul className="mt-8 flex flex-wrap gap-3">
                {quickFacts.map((f) => (
                  <li
                    key={f.text}
                    className="flex items-center gap-2 rounded-full border-[2.5px] border-ink bg-white px-4 py-2 font-semibold shadow-toon-xs"
                  >
                    <Icon name={f.icon} className="size-5 text-orange-deep" />
                    {f.text}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <Reveal rotate={4} y={50}>
            <Notebook />
          </Reveal>
        </div>

        <ul className="mt-20 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal as="li" key={s.label} delay={i * 0.08} rotate={i % 2 ? 6 : -6} className="h-full">
              <div
                className={cn(
                  "toon flex h-full flex-col justify-between gap-2 p-5 transition-transform duration-300 ease-[var(--ease-boing)] hover:-translate-y-1.5 hover:rotate-0 sm:p-6",
                  statColors[i],
                  statTilt[i],
                )}
              >
                <span className="title-toon text-[clamp(2.3rem,5vw,3.4rem)] [--fill:#fff] [--stroke:0.14em]">
                  <CountUp value={s.value} decimals={s.decimals} suffix={s.suffix} />
                </span>
                <span className="text-[15px] font-semibold leading-snug sm:text-base">{s.label}</span>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
