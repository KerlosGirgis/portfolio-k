"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Cloud, GrassEdge, Hills } from "@/components/art";
import { KidKerlos } from "@/components/characters";
import { Icon } from "@/components/icons";
import { profile } from "@/lib/data";
import { vars } from "@/lib/utils";
import { FenceBird } from "./fence-bird";
import { RoleFlipper } from "./role-flipper";

// three.js is big, so the 3D model loads in its own chunk after the page is up.
const Kerlos3D = dynamic(() => import("./kerlos-3d").then((m) => m.Kerlos3D), { ssr: false });

const clouds = [
  { top: "9%", width: 210, duration: 78, delay: -12 },
  { top: "22%", width: 130, duration: 96, delay: -60 },
  { top: "5%", width: 150, duration: 110, delay: -88 },
  { top: "34%", width: 180, duration: 86, delay: -40 },
];

const socials = [
  { href: profile.github, label: "GitHub", icon: "github" },
  { href: profile.linkedin, label: "LinkedIn", icon: "linkedin" },
  { href: `mailto:${profile.email}`, label: "Email", icon: "mail" },
  { href: profile.whatsapp, label: "WhatsApp", icon: "whatsapp" },
] as const;

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const cloudsY = useTransform(scrollYProgress, [0, 1], ["0%", "55%"]);
  const sceneY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <section
      ref={ref}
      id="top"
      aria-label="Introduction"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-[linear-gradient(180deg,#36b9f1_0%,#6bd0f7_48%,#c4f0ff_100%)]"
    >
      {/* sun in the corner */}
      <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 -z-10 size-64 sm:size-80">
        <div className="sunburst ambient absolute -inset-1/4 animate-[spin_60s_linear_infinite] [--ray-a:rgba(255,236,150,0.75)]" />
        <div className="absolute inset-[22%] rounded-full border-[4px] border-ink bg-sun shadow-[inset_-10px_-12px_0_0_var(--color-sun-deep)]" />
      </div>

      {/* drifting clouds */}
      <motion.div aria-hidden="true" style={{ y: cloudsY }} className="pointer-events-none absolute inset-0 -z-10">
        {clouds.map((c) => (
          <div
            key={c.top}
            className="ambient absolute left-0"
            style={{
              top: c.top,
              width: c.width,
              animation: `drift ${c.duration}s linear ${c.delay}s infinite`,
            }}
          >
            <Cloud className="w-full" />
          </div>
        ))}
      </motion.div>

      {/* backyard scene */}
      <motion.div aria-hidden="true" style={{ y: sceneY }} className="pointer-events-none absolute inset-0 -z-10">
        <Hills className="absolute inset-x-0 bottom-[calc(var(--fence-h)-24px)] h-[22vh] w-full [--fence-h:clamp(96px,14vh,140px)]" />
      </motion.div>

      {/* content */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 mx-auto grid w-full max-w-7xl flex-1 items-center gap-4 px-5 pb-[calc(clamp(96px,14vh,140px)+2.5rem)] pt-24 sm:px-8 lg:grid-cols-[1.06fr_0.94fr] lg:gap-4 lg:pb-[calc(clamp(96px,14vh,140px)+3rem)] lg:pt-28"
      >
        <div className="order-2 flex flex-col items-center text-center lg:order-1 lg:items-start lg:text-left">
          <p
            className="bubble enter-bubble mb-6 inline-block px-5 py-3 text-base font-semibold sm:text-lg"
            style={vars({ "--d": "0ms" })}
          >
            Hey! I know what we&rsquo;re gonna build today!
          </p>

          <h1 className="flex flex-col items-center lg:items-start">
            <span className="title-toon enter-rise text-[clamp(1.9rem,4.4vw,3rem)] [--fill:#fff]" style={vars({ "--d": "120ms" })}>
              Hi, I&rsquo;m
            </span>
            <span className="sr-only">Kerlos</span>
            <span aria-hidden="true" className="title-toon mt-3 text-[clamp(4.4rem,15vw,8.75rem)] [--drop:0.05em] [--stroke:0.13em]">
              {Array.from("KERLOS").map((letter, i) => (
                <span key={i} className="enter-pop" style={vars({ "--d": `${220 + i * 75}ms` })}>
                  {letter}
                </span>
              ))}
            </span>
          </h1>

          <RoleFlipper roles={profile.roles} className="enter-rise" style={vars({ "--d": "760ms" })} />

          <p
            className="enter-rise mt-5 max-w-xl text-lg leading-relaxed font-medium text-ink/85 sm:text-xl lg:text-[1.15rem]"
            style={vars({ "--d": "880ms" })}
          >
            {profile.intro}
          </p>

          <div
            className="enter-rise mt-7 flex flex-wrap justify-center gap-4 lg:justify-start"
            style={vars({ "--d": "1000ms" })}
          >
            <a href="#apps" className="btn-toon btn-toon--orange text-lg">
              See my inventions
              <Icon name="arrowDown" className="size-5" />
            </a>
            <a href={profile.resume} target="_blank" rel="noopener noreferrer" className="btn-toon text-lg">
              Get the blueprint
              <Icon name="download" className="size-5" />
            </a>
          </div>

          <ul className="enter-rise mt-6 flex gap-3" style={vars({ "--d": "1120ms" })}>
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target={s.href.startsWith("mailto") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="btn-toon btn-toon--icon btn-toon--sm bg-white"
                >
                  <Icon name={s.icon} className="size-5" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Kerlos in 3D, with his cockatiel on his shoulder */}
        <div className="order-1 flex justify-center lg:order-2">
          <div className="relative h-[min(58svh,30rem)] w-full max-w-xl lg:h-[clamp(28rem,calc(100svh-16rem),46rem)]">
            <div aria-hidden="true" className="enter-fade pointer-events-none absolute inset-0" style={vars({ "--d": "200ms" })}>
              <div className="sunburst ambient absolute left-1/2 top-[40%] aspect-square w-[130%] -translate-x-1/2 -translate-y-1/2 animate-[spin_50s_linear_infinite] [--ray-a:rgba(255,255,255,0.6)]" />
            </div>
            <Kerlos3D />
            <div className="enter-rise pointer-events-none absolute inset-0" style={vars({ "--d": "900ms" })}>
              <span className="ambient absolute left-0 top-[16%] flex animate-[bob_4s_ease-in-out_infinite] items-center gap-1.5 rounded-xl border-[3px] border-ink bg-sun px-3 py-1.5 font-display text-sm tracking-wide shadow-toon-sm sm:text-base">
                <Icon name="pin" className="size-4" /> {profile.location}
              </span>
              <span className="ambient absolute bottom-[2%] right-0 flex animate-[bob_4.6s_ease-in-out_-1.5s_infinite] items-center gap-1.5 rounded-xl border-[3px] border-ink bg-teal px-3 py-1.5 font-display text-sm tracking-wide shadow-toon-sm sm:bottom-[9%] sm:text-base">
                <Icon name="download" className="size-4" /> 7K+ downloads
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* fence, grass, the cast, and a scroll sign */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[clamp(96px,14vh,140px)]">
        <FenceBird className="pointer-events-auto bottom-[calc(100%-20px)] left-[70%] w-[4.6rem] -translate-x-1/2 sm:left-[58%] sm:w-[5.6rem]" />
        <div className="fence absolute inset-0" />
        <a
          href="#about"
          className="pointer-events-auto absolute left-[38%] top-[30%] flex -translate-x-1/2 -rotate-3 items-center gap-2 whitespace-nowrap rounded-md border-[3px] border-ink bg-[#f6d39c] px-3 py-1.5 font-display text-sm tracking-wider shadow-toon-sm transition-transform hover:rotate-2 sm:left-1/2 sm:px-4 sm:text-lg"
        >
          Scroll down!
          <Icon name="arrowDown" className="ambient size-5 animate-[bob_1.4s_ease-in-out_infinite]" />
        </a>
        <GrassEdge className="absolute inset-x-0 bottom-0 h-10 w-full sm:h-12" />
        <div className="absolute bottom-1 right-[3%] hidden items-end sm:flex lg:right-[4%]">
          <KidKerlos pose="point" className="enter-up h-[clamp(104px,17vh,156px)] w-auto" style={vars({ "--d": "1150ms" })} />
        </div>
      </div>
    </section>
  );
}
