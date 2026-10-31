"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Variants } from "motion/react";
import { Icon } from "@/components/icons";
import { Portal, useModal } from "@/components/modal";
import { cn } from "@/lib/utils";

export type GalleryItem =
  | { type: "image"; src: string; alt: string; width: number; height: number }
  | { type: "video"; src: string; poster: string; alt: string };

const slide: Variants = {
  enter: (dir: number) => ({ x: dir >= 0 ? "55%" : "-55%", opacity: 0, rotate: dir * 5, scale: 0.92 }),
  center: { x: "0%", opacity: 1, rotate: 0, scale: 1 },
  exit: (dir: number) => ({ x: dir >= 0 ? "-55%" : "55%", opacity: 0, rotate: dir * -5, scale: 0.92 }),
};

export function Gallery({
  open,
  title,
  items,
  startIndex,
  onClose,
}: {
  open: boolean;
  title: string;
  items: GalleryItem[];
  startIndex: number;
  onClose: () => void;
}) {
  return (
    <Portal>
      <AnimatePresence>
        {open && <GalleryDialog key="gallery" title={title} items={items} startIndex={startIndex} onClose={onClose} />}
      </AnimatePresence>
    </Portal>
  );
}

function GalleryDialog({
  title,
  items,
  startIndex,
  onClose,
}: {
  title: string;
  items: GalleryItem[];
  startIndex: number;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLUListElement>(null);
  const [[index, dir], setState] = useState<[number, number]>([startIndex, 0]);
  useModal(true, onClose, dialogRef);

  const go = useCallback(
    (step: number) => setState(([i]) => [(i + step + items.length) % items.length, step]),
    [items.length],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  useEffect(() => {
    const strip = stripRef.current;
    const thumb = strip?.children[index] as HTMLElement | undefined;
    if (!strip || !thumb) return;
    strip.scrollTo({ left: thumb.offsetLeft - strip.clientWidth / 2 + thumb.clientWidth / 2, behavior: "smooth" });
  }, [index]);

  const item = items[index];

  return (
    <motion.div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${title} gallery`}
      className="bg-blueprint fixed inset-0 z-[80] flex flex-col text-blueprint-ink"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div className="flex items-center justify-between gap-4 px-4 pb-2 pt-4 sm:px-8 sm:pt-6">
        <div>
          <p className="font-type text-[11px] tracking-[0.3em] text-blueprint-ink/70">BLUEPRINT VIEWER</p>
          <h2 className="font-display text-2xl tracking-wide text-white sm:text-3xl">{title}</h2>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-type text-sm tracking-widest" aria-live="polite">
            {index + 1} / {items.length}
          </span>
          <button type="button" data-autofocus onClick={onClose} className="btn-toon btn-toon--icon" aria-label="Close gallery">
            <Icon name="close" className="size-5" />
          </button>
        </div>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden">
        <AnimatePresence initial={false} custom={dir} mode="popLayout">
          <motion.div
            key={index}
            custom={dir}
            variants={slide}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            drag={items.length > 1 ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.6}
            onDragEnd={(_, info) => {
              if (info.offset.x < -70 || info.velocity.x < -450) go(1);
              else if (info.offset.x > 70 || info.velocity.x > 450) go(-1);
            }}
            className="flex h-full max-h-full cursor-grab items-center justify-center px-4 py-3 active:cursor-grabbing"
          >
            {item.type === "image" ? (
              <Image
                src={item.src}
                alt={item.alt}
                width={item.width}
                height={item.height}
                sizes="(max-width: 640px) 80vw, 40vh"
                draggable={false}
                className="pointer-events-none h-full max-h-[min(78vh,880px)] w-auto select-none object-contain drop-shadow-[10px_12px_0_rgba(0,0,0,0.35)]"
              />
            ) : (
              <div className="h-full max-h-[min(78vh,880px)] overflow-hidden rounded-[2.4rem] border-[10px] border-[#1d1d20] bg-black shadow-[0_0_0_3px_#4a4a50,10px_12px_0_3px_rgba(0,0,0,0.35)]">
                <video
                  src={item.src}
                  poster={item.poster}
                  aria-label={item.alt}
                  controls
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className="h-full w-auto"
                />
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {items.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              className="btn-toon btn-toon--icon btn-toon--sun absolute left-3 top-1/2 z-10 -translate-y-1/2 sm:left-8"
              aria-label="Previous screen"
            >
              <Icon name="chevronLeft" className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              className="btn-toon btn-toon--icon btn-toon--sun absolute right-3 top-1/2 z-10 -translate-y-1/2 sm:right-8"
              aria-label="Next screen"
            >
              <Icon name="chevronRight" className="size-5" />
            </button>
          </>
        )}
      </div>

      <ul ref={stripRef} className="no-scrollbar flex gap-3 overflow-x-auto px-4 pb-5 pt-3 sm:justify-center sm:px-8">
        {items.map((it, i) => (
          <li key={it.src} className="shrink-0">
            <button
              type="button"
              onClick={() => setState([i, i > index ? 1 : -1])}
              aria-label={`Show ${it.alt}`}
              aria-current={i === index ? "true" : undefined}
              className={cn(
                "relative block h-20 w-10 overflow-hidden rounded-lg border-[3px] transition-all sm:h-24 sm:w-12",
                i === index ? "-translate-y-1 border-sun shadow-[3px_3px_0_0_var(--color-ink)]" : "border-white/30 opacity-60 hover:opacity-100",
              )}
            >
              <Image
                src={it.type === "image" ? it.src : it.poster}
                alt=""
                fill
                sizes="48px"
                className="object-cover"
              />
              {it.type === "video" && (
                <span className="absolute inset-0 grid place-items-center bg-black/35 text-white">
                  <Icon name="play" className="size-5" />
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
