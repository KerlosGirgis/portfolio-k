"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Icon } from "@/components/icons";
import type { MobileApp } from "@/lib/data";
import { cn, vars } from "@/lib/utils";
import { FlowerSketch } from "./flower-sketch";

export const screenSrc = (slug: string, n: number) => `/media/apps/${slug}/${String(n).padStart(2, "0")}.webp`;

const phone = "absolute h-[78%] w-auto transition-transform duration-500 ease-[var(--ease-boing)]";

function PhoneFan({ app }: { app: MobileApp }) {
  const [front, left, right] = app.cover;
  const img = (n: number, alt: string) => (
    <Image
      src={screenSrc(app.slug, n)}
      alt={alt}
      width={app.size.w}
      height={app.size.h}
      sizes="(min-width: 1280px) 190px, (min-width: 768px) 22vw, 45vw"
      className="h-full w-auto drop-shadow-[6px_8px_0_rgba(4,18,40,0.45)]"
    />
  );
  return (
    <>
      <div className={cn(phone, "-translate-x-[42%] -rotate-[9deg] scale-[0.84] group-hover:-translate-x-[72%] group-hover:-rotate-[15deg]")}>
        {img(left, "")}
      </div>
      <div className={cn(phone, "translate-x-[42%] rotate-[9deg] scale-[0.84] group-hover:translate-x-[72%] group-hover:rotate-[15deg]")}>
        {img(right, "")}
      </div>
      <motion.div
        className={cn(phone, "group-hover:-translate-y-2 group-hover:scale-[1.04]")}
        initial="hidden"
        whileInView="built"
        viewport={{ once: true, margin: "-80px" }}
      >
        {/* wireframe outline that the screenshot "builds" over */}
        <motion.div
          aria-hidden="true"
          className="absolute inset-[1%] rounded-[2.2rem] border-2 border-dashed border-white/80"
          variants={{ hidden: { opacity: 1 }, built: { opacity: 0, transition: { delay: 1.3, duration: 0.4 } } }}
        />
        <motion.div
          className="h-full"
          variants={{
            hidden: { clipPath: "inset(100% 0% 0% 0%)" },
            built: { clipPath: "inset(0% 0% 0% 0%)", transition: { duration: 1.1, ease: [0.7, 0, 0.3, 1], delay: 0.3 } },
          }}
        >
          {img(front, `${app.name} app screen`)}
        </motion.div>
        <motion.span
          aria-hidden="true"
          className="absolute inset-x-[-6%] h-1 rounded-full bg-white shadow-[0_0_14px_4px_rgba(255,255,255,0.8)]"
          variants={{
            hidden: { top: "100%", opacity: 1 },
            built: {
              top: "0%",
              opacity: 0,
              transition: { top: { duration: 1.1, ease: [0.7, 0, 0.3, 1], delay: 0.3 }, opacity: { delay: 1.3, duration: 0.3 } },
            },
          }}
        />
      </motion.div>
    </>
  );
}

export function AppCard({
  app,
  index,
  total,
  onOpen,
}: {
  app: MobileApp;
  index: number;
  total: number;
  onOpen: (start: number) => void;
}) {
  const screenCount = app.screens + (app.video ? 1 : 0);
  const stageLabel = app.blueprintOnly
    ? undefined
    : `Open ${app.name} gallery, ${app.screens} screens${app.video ? " and a demo video" : ""}`;

  const stage = (
    <>
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-80"
        style={{ background: `radial-gradient(circle at 50% 58%, ${app.accent}66 0%, transparent 62%)` }}
      />
      <div aria-hidden="true" className="absolute left-1/2 top-[54%] size-[72%] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dashed border-white/20" />
      <div className="absolute inset-0 flex items-center justify-center">
        {app.blueprintOnly ? <FlowerSketch /> : <PhoneFan app={app} />}
      </div>
      <span
        aria-hidden="true"
        className="absolute right-4 top-3 flex rotate-[7deg] items-center gap-1 font-hand text-[1.45rem] leading-none text-sun"
      >
        {app.note}
        <svg viewBox="0 0 40 30" className="mt-4 w-8" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M36 4C30 20 18 26 6 24M6 24l7-6M6 24l8 4" />
        </svg>
      </span>
      <span aria-hidden="true" className="absolute bottom-3 left-4 font-type text-[10px] tracking-[0.2em] text-white/55">
        SCALE 1:1 · FLUTTER
      </span>
      {app.blueprintOnly && (
        <span className="stamp absolute bottom-6 right-4 rotate-[-10deg] text-pink">Coming soon</span>
      )}
      {app.video && (
        <span className="absolute bottom-4 right-4 grid size-14 place-items-center rounded-full border-[3px] border-ink bg-orange text-ink shadow-toon-sm transition-transform duration-300 group-hover:scale-110">
          <Icon name="play" className="size-6 translate-x-0.5" />
        </span>
      )}
    </>
  );

  return (
    <motion.article
      className="group relative flex flex-col overflow-hidden rounded-[1.6rem] border-[3px] border-white/85 bg-[#16467f]/75 shadow-[8px_8px_0_0_rgba(4,18,40,0.55)]"
      initial={{ opacity: 0, y: 70, rotate: index % 2 ? 3 : -3 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ type: "spring", stiffness: 140, damping: 18, delay: (index % 3) * 0.08 }}
      style={vars({ "--accent": app.accent })}
    >
      <header className="flex items-center justify-between border-b-2 border-dashed border-white/35 px-4 py-2 font-type text-[10.5px] tracking-[0.22em] text-white/70">
        <span>DWG. NO. {String(index + 1).padStart(3, "0")}</span>
        <span>
          SHEET {index + 1} OF {total}
        </span>
      </header>

      {stageLabel ? (
        <button
          type="button"
          onClick={() => onOpen(0)}
          aria-label={stageLabel}
          className="relative block h-[390px] w-full cursor-zoom-in overflow-hidden sm:h-[420px]"
        >
          {stage}
        </button>
      ) : (
        <div className="relative h-[390px] w-full overflow-hidden sm:h-[420px]">{stage}</div>
      )}

      <div className="flex flex-1 flex-col gap-3 border-t-2 border-dashed border-white/35 p-5 sm:p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          <h3 className="font-display text-[2rem] leading-none tracking-wide text-white">{app.name}</h3>
          {screenCount > 0 && (
            <span className="shrink-0 font-type text-[10.5px] tracking-[0.2em] text-white/60">
              {app.screens} SCREENS{app.video ? " + VIDEO" : ""}
            </span>
          )}
        </div>
        <p className="-mt-1 font-hand text-2xl leading-none text-sun">a.k.a. {app.nickname}</p>
        <p className="text-[15.5px] leading-relaxed text-blueprint-ink/85">{app.description}</p>
        {app.badges && (
          <ul className="flex flex-wrap gap-2">
            {app.badges.map((b) => (
              <li key={b} className="rounded-full border-2 border-ink bg-sun px-3 py-0.5 text-sm font-bold text-ink shadow-toon-xs">
                {b}
              </li>
            ))}
          </ul>
        )}
        <ul className="flex flex-wrap gap-1.5" aria-label="Built with">
          {app.tags.map((t) => (
            <li key={t} className="tag text-white/80">
              {t}
            </li>
          ))}
        </ul>
        <div className="mt-auto flex flex-wrap gap-3 pt-3">
          {app.video && (
            <button type="button" onClick={() => onOpen(0)} className="btn-toon btn-toon--sm btn-toon--orange">
              <Icon name="play" className="size-4" /> Watch demo
            </button>
          )}
          {app.screens > 0 && (
            <button type="button" onClick={() => onOpen(app.video ? 1 : 0)} className="btn-toon btn-toon--sm btn-toon--sun">
              <Icon name="images" className="size-4" /> Screens
            </button>
          )}
          {app.links.map((l) => (
            <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="btn-toon btn-toon--sm">
              <Icon name={l.kind === "github" ? "github" : "android"} className="size-4" />
              {l.label}
              <Icon name="external" className="size-3.5 opacity-60" />
            </a>
          ))}
          {app.blueprintOnly && <span className="font-hand text-xl text-white/75">Screens are on their way — check back soon!</span>}
        </div>
      </div>
    </motion.article>
  );
}
