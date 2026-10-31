"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Icon } from "@/components/icons";
import type { IconName } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { profile } from "@/lib/data";
import { cn } from "@/lib/utils";

const links: { href: string; label: string; detail: string; icon: IconName; className: string }[] = [
  { href: profile.linkedin, label: "LinkedIn", detail: "Let's connect", icon: "linkedin", className: "bg-[#5aa9ff]" },
  { href: profile.github, label: "GitHub", detail: "@KerlosGirgis", icon: "github", className: "bg-[#d9d2ff]" },
  { href: profile.resume, label: "Resume", detail: "The full blueprint", icon: "download", className: "bg-sun" },
];

/** End-of-episode silhouettes: hill, the big tree, and two kids with their pet under it. */
function Sunset() {
  return (
    <svg viewBox="0 0 1440 320" preserveAspectRatio="xMidYMax slice" aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[min(42vw,320px)] w-full">
      <path d="M0 210c180-40 380-30 560 6s420 22 600-10 220-24 280-18v132H0z" fill="#6a3a9e" />
      <path d="M0 262c240-34 460-20 700 0s520 8 740-22v80H0z" fill="#2b1a5c" />
      <g fill="#2b1a5c">
        {/* the big tree */}
        <path d="M1088 300c10-30 14-70 12-130h40c-2 60 2 100 14 130z" />
        <circle cx="1060" cy="140" r="62" />
        <circle cx="1120" cy="96" r="76" />
        <circle cx="1186" cy="138" r="60" />
        <circle cx="1146" cy="176" r="52" />
        <circle cx="1080" cy="186" r="46" />
        <g transform="translate(900 192) scale(1.7)">
          {/* kid with a triangle head, looking at the sunset */}
          <path d="M24 0-12 19l36 13z" />
          <path d="M18 1l3-8 3 6 4-7 2 8z" />
          <rect x="6" y="28" width="24" height="28" rx="10" />
          {/* tall kid with a tuft of hair */}
          <rect x="42" y="2" width="16" height="30" rx="3" />
          <path d="M40 4l4-9 4 6 4-8 3 7 4-3v7z" />
          <rect x="38" y="29" width="26" height="27" rx="10" />
          {/* their pet platypus */}
          <path d="M70 56c0-13 10-19 20-19s18 7 18 16l13 2c3 4-1 8-13 6z" />
        </g>
      </g>
    </svg>
  );
}

const [emailUser, emailDomain] = profile.email.split("@");

export function Contact() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const sunY = useTransform(scrollYProgress, [0, 1], ["-25%", "40%"]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(false), 2400);
    return () => window.clearTimeout(t);
  }, [copied]);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  }

  return (
    <section
      ref={ref}
      id="contact"
      aria-labelledby="contact-title"
      className="relative isolate overflow-hidden bg-[linear-gradient(180deg,#ffb86b_0%,#ff8f7a_40%,#d7629f_72%,#8a46b0_100%)] pb-[min(46vw,340px)] pt-24 sm:pt-32"
    >
      <motion.div
        aria-hidden="true"
        style={{ y: sunY }}
        className="absolute left-1/2 top-[38%] -z-10 size-[min(80vw,600px)] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,#fff6c4_0%,#ffd23f_48%,#ff9f43_100%)] shadow-[0_0_120px_40px_rgba(255,214,120,0.55)]"
      />
      <div aria-hidden="true" className="sunburst ambient absolute left-1/2 top-[20%] -z-20 size-[160vmax] -translate-x-1/2 animate-[spin_90s_linear_infinite] opacity-40 [--ray-a:rgba(255,240,200,0.5)]" />

      <div className="relative mx-auto max-w-5xl px-5 sm:px-8">
        <SectionHeading
          id="contact-title"
          tone="light"
          kicker="As the sun sets on another summer day…"
          title="Let's build something!"
          fill="var(--color-sun)"
          capBg="#fff"
        >
          <span className="text-white [text-shadow:0_2px_0_rgba(27,21,52,0.35)]">
            Got an app idea, a website that needs building, or a rollercoaster that needs engineering? My inbox is
            open — no need to call Mom.
          </span>
        </SectionHeading>

        <div className="mt-14 grid gap-6 lg:grid-cols-[1.35fr_1fr]">
          <Reveal rotate={-2}>
            <div className="toon h-full bg-white p-6 sm:p-8">
              <p className="font-type text-xs tracking-[0.25em] text-ink/60">SEND A MESSAGE TO</p>
              <a
                href={`mailto:${profile.email}`}
                className="mt-2 block text-[clamp(1.35rem,3.4vw,2.1rem)] font-bold leading-tight [overflow-wrap:anywhere] transition-colors hover:text-orange-deep"
              >
                {emailUser}
                <wbr />@{emailDomain}
              </a>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href={`mailto:${profile.email}`} className="btn-toon btn-toon--orange">
                  <Icon name="mail" className="size-5" /> Write an email
                </a>
                <button type="button" onClick={copyEmail} className="btn-toon" aria-live="polite">
                  <Icon name={copied ? "check" : "copy"} className="size-5" />
                  {copied ? "Copied! Don't tell Mom." : "Copy address"}
                </button>
              </div>
            </div>
          </Reveal>

          <Reveal rotate={2} delay={0.08}>
            <a
              href={profile.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="toon group flex h-full flex-col justify-between gap-6 bg-[#57d987] p-6 transition-transform duration-300 ease-[var(--ease-boing)] hover:-translate-y-1.5 hover:-rotate-1 sm:p-8"
            >
              <span className="grid size-14 place-items-center rounded-2xl border-[3px] border-ink bg-white shadow-toon-sm transition-transform group-hover:rotate-[-8deg]">
                <Icon name="whatsapp" className="size-8 text-[#1f9d55]" />
              </span>
              <span>
                <span className="block font-display text-3xl tracking-wide">Chat on WhatsApp</span>
                <span className="mt-1 flex items-center gap-2 font-semibold text-ink/80">
                  {profile.phone}
                  <Icon name="arrowRight" className="size-5 transition-transform group-hover:translate-x-1" />
                </span>
              </span>
            </a>
          </Reveal>
        </div>

        <ul className="mt-6 grid gap-4 sm:grid-cols-3">
          {links.map((l, i) => (
            <Reveal as="li" key={l.label} delay={0.12 + i * 0.06} y={30}>
              <a
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "toon group flex items-center gap-4 p-4 transition-transform duration-300 ease-[var(--ease-boing)] hover:-translate-y-1.5 hover:rotate-1",
                  l.className,
                )}
              >
                <span className="grid size-12 shrink-0 place-items-center rounded-xl border-[3px] border-ink bg-white shadow-toon-xs transition-transform group-hover:-rotate-6">
                  <Icon name={l.icon} className="size-6" />
                </span>
                <span className="min-w-0">
                  <span className="block font-display text-xl tracking-wide">{l.label}</span>
                  <span className="block truncate text-sm font-semibold text-ink/75">{l.detail}</span>
                </span>
                <Icon name="external" className="ml-auto size-5 shrink-0 opacity-60" />
              </a>
            </Reveal>
          ))}
        </ul>
      </div>

      <Sunset />
    </section>
  );
}
