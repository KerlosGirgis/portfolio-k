"use client";

import { useEffect, useRef, useState } from "react";
import type { FocusEvent } from "react";
import { motion, useMotionValue, useScroll, useTransform } from "motion/react";
import { Cloud } from "@/components/art";
import { Icon } from "@/components/icons";
import { SectionHeading } from "@/components/section-heading";
import { websites } from "@/lib/data";
import type { Website } from "@/lib/data";
import { useMediaQuery } from "@/lib/use-media-query";
import { cn } from "@/lib/utils";
import { SiteModal } from "./site-modal";
import { Storefront, StreetLamp } from "./storefront";
import { StrollingDuo } from "./strolling-duo";

function Skyline({ className }: { className?: string }) {
  // A row of simple rooftops; repeated so it can slide sideways.
  const block = "M0 220V120h60V80h50v40h40V40h70v80h30V100h60v120M310 220V60h20V30h40v30h20v160M390 220V110h80v-30h50v140M520 220V90h40V50h60v40h30v130";
  return (
    <svg viewBox="0 0 650 220" preserveAspectRatio="none" aria-hidden="true" className={className}>
      <path d={`${block}V220H0z`} fill="#c9c3f0" stroke="#1b1534" strokeWidth="3" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      <g fill="#fff8e7" opacity=".9">
        <rect x="235" y="60" width="10" height="14" />
        <rect x="255" y="60" width="10" height="14" />
        <rect x="235" y="90" width="10" height="14" />
        <rect x="340" y="80" width="10" height="14" />
        <rect x="560" y="70" width="10" height="14" />
        <rect x="590" y="70" width="10" height="14" />
        <rect x="560" y="100" width="10" height="14" />
        <rect x="80" y="100" width="10" height="14" />
      </g>
    </svg>
  );
}

function Legend() {
  return (
    <ul className="flex flex-wrap gap-3 text-sm font-bold">
      <li className="flex items-center gap-1.5 rounded-lg border-[3px] border-ink bg-white px-2.5 py-1 shadow-toon-xs">
        <Icon name="hammer" className="size-4" /> Built from scratch
      </li>
      <li className="flex items-center gap-1.5 rounded-lg border-[3px] border-ink bg-[repeating-linear-gradient(-45deg,var(--color-sun)_0_10px,#fff2b0_10px_20px)] px-2.5 py-1 shadow-toon-xs">
        <Icon name="cone" className="size-4" /> Renovation · edits
      </li>
    </ul>
  );
}

const heading = (
  <SectionHeading
    id="websites-title"
    align="left"
    kicker="Meanwhile, on Main Street…"
    title="The Web Block"
    fill="var(--color-orange)"
  >
    Eight websites for real businesses across Saudi Arabia and Egypt. Hover a shop window to tour the whole page, or
    step inside for a closer look.
  </SectionHeading>
);

export function Websites() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [distance, setDistance] = useState(0);
  const distanceMV = useMotionValue(0);
  const [openSite, setOpenSite] = useState<Website | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!isDesktop || !track) return;
    const measure = () => {
      const d = Math.max(0, track.scrollWidth - window.innerWidth);
      distanceMV.set(d);
      setDistance(d);
    };
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [isDesktop, distanceMV]);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const x = useTransform(() => (isDesktop ? -scrollYProgress.get() * distanceMV.get() : 0));
  const skylineX = useTransform(() => (isDesktop ? -scrollYProgress.get() * distanceMV.get() * 0.18 : 0));
  const pavement = useTransform(x, (v) => `${v}px 0`);
  const roadLine = useTransform(x, (v) => `${v}px 50%`);

  // Keep keyboard focus visible: scroll the page so the focused shop is centred.
  function onFocus(e: FocusEvent<HTMLDivElement>) {
    const section = sectionRef.current;
    const shop = (e.target as HTMLElement).closest<HTMLElement>("[data-shop]");
    if (!isDesktop || !section || !shop || distance === 0) return;
    const centre = shop.offsetLeft + shop.offsetWidth / 2 - window.innerWidth / 2;
    const progress = Math.min(1, Math.max(0, centre / distance));
    const sectionTop = section.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: sectionTop + progress * distance, behavior: "instant" });
  }

  return (
    <section
      ref={sectionRef}
      id="websites"
      aria-labelledby="websites-title"
      className="relative bg-[linear-gradient(180deg,#79d0f5_0%,#bfe8f7_50%,#ffe4b8_100%)]"
      style={isDesktop ? { height: `calc(100vh + ${distance}px)` } : undefined}
    >
      <div className={cn("relative overflow-clip", isDesktop ? "sticky top-0 h-screen" : "pt-24 sm:pt-28")}>
        {/* sky */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute left-[8%] top-[12%] size-24 rounded-full border-[4px] border-ink bg-sun shadow-[inset_-8px_-10px_0_0_var(--color-sun-deep)] sm:size-28" />
          <Cloud className="ambient absolute left-[30%] top-[9%] hidden w-40 animate-[bob_7s_ease-in-out_infinite] lg:block" />
          <Cloud className="ambient absolute right-[12%] top-[18%] hidden w-32 animate-[bob_9s_ease-in-out_-3s_infinite] lg:block" />
          <motion.div style={{ x: skylineX }} className="absolute bottom-[calc(var(--ground)-6px)] left-0 flex w-[400vw] opacity-60 [--ground:6.5rem]">
            {Array.from({ length: 6 }, (_, i) => (
              <Skyline key={i} className="h-[24vh] max-h-[190px] w-[650px] shrink-0 lg:w-[54vw]" />
            ))}
          </motion.div>
        </div>

        {!isDesktop && <div className="relative px-5 sm:px-8">{heading}<div className="mt-6"><Legend /></div></div>}

        <motion.div
          ref={trackRef}
          onFocus={onFocus}
          style={{ x }}
          className={cn(
            "z-10 flex items-end",
            isDesktop
              ? "absolute bottom-[calc(6.5rem-1rem)] left-0 w-max gap-12 pl-[6vw] pr-[10vw]"
              : "no-scrollbar relative mt-10 snap-x snap-mandatory gap-6 overflow-x-auto px-6 pb-[calc(6.5rem-1rem)] pt-6 sm:px-8",
          )}
        >
          {isDesktop && (
            <div className="mb-24 flex w-[min(40vw,560px)] shrink-0 flex-col gap-6 self-center">
              {heading}
              <Legend />
              <p className="flex items-center gap-2 font-hand text-2xl text-ink/80 [text-shadow:0_0_8px_#e6f5fb,0_0_3px_#e6f5fb]">
                Keep scrolling to stroll down the street
                <Icon name="arrowRight" className="ambient size-6 animate-[bob_1.6s_ease-in-out_infinite]" />
              </p>
            </div>
          )}

          {websites.map((site, i) => (
            <div key={site.slug} className="relative flex shrink-0 snap-center items-end gap-6 lg:gap-12">
              <Storefront site={site} onOpen={() => setOpenSite(site)} className="w-[min(82vw,420px)] lg:w-[clamp(420px,29vw,540px)]" />
              {i < websites.length - 1 && <StreetLamp className="hidden h-[300px] w-12 shrink-0 sm:block" />}
            </div>
          ))}

          <div className="flex w-[min(80vw,360px)] shrink-0 snap-center flex-col items-start gap-4 self-center rounded-[1.4rem] border-[3px] border-dashed border-ink/60 bg-white/60 p-6 backdrop-blur-sm">
            <span className="caption text-sm">Vacant lot!</span>
            <p className="font-display text-3xl leading-tight tracking-wide">Your shop could be next on the block.</p>
            <a href="#contact" className="btn-toon btn-toon--orange">
              Let&rsquo;s build it <Icon name="arrowRight" className="size-5" />
            </a>
          </div>
        </motion.div>

        {isDesktop && <StrollingDuo x={x} progress={scrollYProgress} />}

        {/* sidewalk + road */}
        <div aria-hidden="true" className={cn("inset-x-0 bottom-0 h-[6.5rem]", isDesktop ? "absolute" : "relative -mt-[6.5rem]")}>
          <motion.div
            style={{ backgroundPosition: pavement }}
            className="h-[3.6rem] border-t-[3px] border-ink bg-[#e6e0ee] bg-[image:linear-gradient(90deg,rgba(27,21,52,0.18)_2px,transparent_2px)] bg-[length:90px_100%]"
          />
          <motion.div
            style={{ backgroundPosition: roadLine }}
            className="h-[2.9rem] border-t-[3px] border-ink bg-[#4a4463] bg-[image:linear-gradient(90deg,var(--color-sun)_0_40px,transparent_40px)] bg-[length:90px_4px] bg-repeat-x"
          />
        </div>
      </div>

      <SiteModal site={openSite} onClose={() => setOpenSite(null)} />
    </section>
  );
}

