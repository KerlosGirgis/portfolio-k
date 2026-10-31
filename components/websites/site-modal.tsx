"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Icon } from "@/components/icons";
import { Portal, useModal } from "@/components/modal";
import type { Website } from "@/lib/data";
import { cn, vars } from "@/lib/utils";
import { siteImg } from "./storefront";

export function SiteModal({ site, onClose }: { site: Website | null; onClose: () => void }) {
  return (
    <Portal>
      <AnimatePresence>{site && <SiteDialog key={site.slug} site={site} onClose={onClose} />}</AnimatePresence>
    </Portal>
  );
}

function SiteDialog({ site, onClose }: { site: Website; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<"desktop" | "mobile">("desktop");
  useModal(true, onClose, ref);

  return (
    <motion.div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-label={`${site.name} website preview`}
      className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/75 p-3 backdrop-blur-sm sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        className="flex max-h-full w-full max-w-5xl flex-col overflow-hidden rounded-[1.4rem] border-[3px] border-ink bg-paper shadow-toon-lg"
        initial={{ y: 60, scale: 0.92, rotate: -2 }}
        animate={{ y: 0, scale: 1, rotate: 0 }}
        exit={{ y: 40, scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
      >
        <div className="flex flex-wrap items-center gap-3 border-b-[3px] border-ink bg-[var(--awning)] px-4 py-3" style={vars({ "--awning": site.awning })}>
          <div className="mr-auto min-w-0">
            <h2 className="title-toon truncate text-2xl [--drop:0.04em] [--fill:#fff] [--stroke:0.16em] sm:text-3xl">{site.name}</h2>
            <p className="truncate text-sm font-semibold text-white/90">
              {site.description} · {site.location}
            </p>
          </div>
          <div className="flex rounded-full border-[3px] border-ink bg-white p-0.5" role="group" aria-label="Preview size">
            {(["desktop", "mobile"] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setView(v)}
                aria-pressed={view === v}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-bold capitalize transition-colors",
                  view === v ? "bg-sun" : "hover:bg-paper-deep",
                )}
              >
                <Icon name={v === "desktop" ? "monitor" : "phone"} className="size-4" />
                {v}
              </button>
            ))}
          </div>
          <a href={site.url} target="_blank" rel="noopener noreferrer" className="btn-toon btn-toon--sm btn-toon--orange">
            Visit live site <Icon name="external" className="size-4" />
          </a>
          <button type="button" data-autofocus onClick={onClose} className="btn-toon btn-toon--icon btn-toon--sm" aria-label="Close preview">
            <Icon name="close" className="size-5" />
          </button>
        </div>

        <div className="bg-dots min-h-0 flex-1 overflow-y-auto overscroll-contain bg-paper-deep p-3 sm:p-6" tabIndex={0} aria-label="Scrollable page preview">
          {view === "desktop" ? (
            <div className="mx-auto max-w-4xl overflow-hidden rounded-xl border-[3px] border-ink bg-white shadow-toon">
              <div className="flex items-center gap-1.5 border-b-[3px] border-ink bg-paper px-3 py-2">
                <span className="size-3 rounded-full border-2 border-ink bg-candace" />
                <span className="size-3 rounded-full border-2 border-ink bg-sun" />
                <span className="size-3 rounded-full border-2 border-ink bg-grass" />
                <span className="ml-2 flex-1 truncate rounded-full border-2 border-ink/20 bg-white px-3 py-0.5 font-type text-xs text-ink/70">
                  https://{site.domain}
                </span>
              </div>
              <Image
                src={siteImg(site.slug, "full")}
                alt={`${site.name} website, full page screenshot`}
                width={900}
                height={site.fullHeight}
                sizes="(min-width: 1024px) 896px, 92vw"
                className="block h-auto w-full"
              />
            </div>
          ) : (
            <div className="mx-auto w-[min(78vw,320px)] overflow-hidden rounded-[2.2rem] border-[9px] border-[#1d1d20] bg-black shadow-[0_0_0_3px_var(--color-ink),8px_8px_0_3px_var(--color-ink)]">
              <Image
                src={siteImg(site.slug, "mobile")}
                alt={`${site.name} website on a phone`}
                width={600}
                height={1298}
                sizes="320px"
                className="block h-auto w-full"
              />
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
