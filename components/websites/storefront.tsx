"use client";

import Image from "next/image";
import { Icon } from "@/components/icons";
import type { Website } from "@/lib/data";
import { cn, vars } from "@/lib/utils";

const WINDOW_RATIO = 10 / 16;

export const siteImg = (slug: string, kind: "desktop" | "full" | "mobile") => `/media/sites/${slug}/${kind}.webp`;

export function Storefront({ site, onOpen, className }: { site: Website; onOpen: () => void; className?: string }) {
  // How far (as % of its own height) the full-page screenshot slides to reach the footer.
  const shift = (1 - (900 * WINDOW_RATIO) / site.fullHeight) * 100;
  const duration = Math.min(9, Math.max(4, (site.fullHeight / 900) * 1.4));

  return (
    <article
      data-shop
      className={cn("storefront group relative shrink-0", className)}
      style={vars({ "--facade": site.facade, "--awning": site.awning, "--shift": `-${shift.toFixed(2)}%`, "--dur": `${duration}s` })}
    >
      {/* rooftop sign */}
      <div className="relative z-10 mx-auto -mb-[3px] w-[80%] rounded-t-2xl border-[3px] border-ink bg-[var(--awning)] px-4 pb-1.5 pt-2.5 text-center">
        <h3 className="title-toon truncate text-[1.7rem] [--drop:0.04em] [--fill:#fff] [--stroke:0.17em]">{site.name}</h3>
      </div>

      <div className="relative rounded-[1.3rem] border-[3px] border-ink bg-[var(--facade)] bg-[image:repeating-linear-gradient(0deg,transparent_0_22px,rgba(27,21,52,0.07)_22px_24px)] px-4 pb-4 pt-0 shadow-toon-lg">
        {/* striped awning */}
        <div className="-mx-[3px] mb-5 drop-shadow-[0_3px_0_var(--color-ink)]">
          <div className="awning h-10 border-x-[3px] border-t-0 border-ink" />
        </div>

        {/* badge */}
        <span
          className={cn(
            "absolute -left-4 top-6 z-20 flex -rotate-[8deg] items-center gap-1.5 rounded-lg border-[3px] border-ink px-2.5 py-1 font-display text-xs tracking-wider shadow-toon-xs",
            site.kind === "built"
              ? "bg-white"
              : "bg-[repeating-linear-gradient(-45deg,var(--color-sun)_0_10px,#fff2b0_10px_20px)]",
          )}
        >
          <Icon name={site.kind === "built" ? "hammer" : "cone"} className="size-4" />
          {site.kind === "built" ? "Built from scratch" : "Renovation · edits"}
        </span>

        {/* shop window = browser */}
        <button
          type="button"
          onClick={onOpen}
          aria-label={`Preview ${site.name} website`}
          className="relative block w-full cursor-zoom-in overflow-hidden rounded-xl border-[3px] border-ink bg-white text-left shadow-[inset_0_0_0_3px_rgba(255,255,255,0.6)]"
        >
          <span className="flex items-center gap-1.5 border-b-[3px] border-ink bg-paper px-2.5 py-1.5">
            <span className="size-2.5 rounded-full border-2 border-ink bg-candace" />
            <span className="size-2.5 rounded-full border-2 border-ink bg-sun" />
            <span className="size-2.5 rounded-full border-2 border-ink bg-grass" />
            <span className="ml-1.5 flex-1 truncate rounded-full border-2 border-ink/20 bg-white px-2 py-0.5 font-type text-[11px] text-ink/70">
              {site.domain}
            </span>
          </span>
          <span className="relative block aspect-[16/10] overflow-hidden bg-sky-light">
            <Image
              src={siteImg(site.slug, "full")}
              alt={`${site.name} website, full page`}
              width={900}
              height={site.fullHeight}
              sizes="(min-width: 1024px) 28vw, 80vw"
              className="site-shot block h-auto w-full"
            />
          </span>
          <span className="pointer-events-none absolute bottom-2 left-2 rounded-full border-2 border-ink bg-white/95 px-2.5 py-0.5 text-[11px] font-bold opacity-0 shadow-toon-xs transition-opacity group-hover:opacity-100">
            Touring the whole page…
          </span>
        </button>

        {/* phone peeking in the corner */}
        <div className="pointer-events-none absolute -right-4 bottom-[4.8rem] w-[23%] rotate-[7deg] overflow-hidden rounded-[0.9rem] border-[3px] border-ink bg-ink shadow-toon-sm transition-transform duration-500 ease-[var(--ease-boing)] group-hover:-translate-y-3 group-hover:rotate-[2deg]">
          <Image
            src={siteImg(site.slug, "mobile")}
            alt=""
            width={600}
            height={1298}
            sizes="110px"
            className="block h-auto w-full rounded-[0.6rem]"
          />
        </div>

        {/* plaque + door */}
        <div className="mt-4 flex items-end justify-between gap-3">
          <p className="rounded-lg border-2 border-ink/80 bg-white/85 px-3 py-1.5 text-[14px] font-semibold leading-snug">
            {site.description}
            <span className="block text-[12px] font-medium text-ink/60">
              <Icon name="pin" className="mr-1 inline size-3" />
              {site.location}
            </span>
          </p>
          <a
            href={site.url}
            target="_blank"
            rel="noopener noreferrer"
            className="relative flex shrink-0 -mb-4 h-20 w-[4.6rem] flex-col items-center justify-center rounded-t-[1.6rem] border-[3px] border-b-0 border-ink bg-wood font-display text-sm tracking-wider text-ink transition-transform hover:-translate-y-1"
            aria-label={`Visit ${site.name} (opens in a new tab)`}
          >
            <span aria-hidden="true" className="absolute right-2 top-1/2 size-2 rounded-full bg-ink" />
            Visit
            <Icon name="external" className="size-4" />
          </a>
        </div>
      </div>
    </article>
  );
}

export function StreetLamp({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 300" aria-hidden="true" className={className}>
      <path d="M30 300V60" stroke="#1b1534" strokeWidth="10" strokeLinecap="round" />
      <path d="M30 300V60" stroke="#5b5478" strokeWidth="4" strokeLinecap="round" />
      <path d="M14 300h32" stroke="#1b1534" strokeWidth="10" strokeLinecap="round" />
      <path d="M16 44h28l-6 22H22z" fill="#ffd23f" stroke="#1b1534" strokeWidth="4" strokeLinejoin="round" />
      <path d="M12 44c0-14 8-22 18-22s18 8 18 22z" fill="#5b5478" stroke="#1b1534" strokeWidth="4" strokeLinejoin="round" />
      <circle cx="30" cy="18" r="5" fill="#1b1534" />
    </svg>
  );
}
