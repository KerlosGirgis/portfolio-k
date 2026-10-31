"use client";

import { useState } from "react";
import { Cockatiel } from "@/components/characters";
import { SectionHeading } from "@/components/section-heading";
import { mobileApps } from "@/lib/data";
import type { MobileApp } from "@/lib/data";
import { AppCard, screenSrc } from "./app-card";
import { Gallery } from "./gallery";
import type { GalleryItem } from "./gallery";

function galleryItems(app: MobileApp): GalleryItem[] {
  const screens: GalleryItem[] = Array.from({ length: app.screens }, (_, i) => ({
    type: "image",
    src: screenSrc(app.slug, i + 1),
    alt: `${app.name} screen ${i + 1}`,
    width: app.size.w,
    height: app.size.h,
  }));
  return app.video
    ? [{ type: "video", src: app.video.src, poster: app.video.poster, alt: `${app.name} demo video` }, ...screens]
    : screens;
}

/** Big faint compass arcs and construction lines in the background. */
function Doodles() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1200 900"
      preserveAspectRatio="xMidYMid slice"
      className="pointer-events-none absolute inset-0 size-full text-white/[0.09]"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="80" cy="120" r="220" strokeDasharray="10 8" />
      <circle cx="80" cy="120" r="140" />
      <path d="M-40 120h400M80 -100v460" />
      <circle cx="1140" cy="780" r="260" strokeDasharray="10 8" />
      <path d="M860 780h420M1140 480v420M900 560l480 440" />
      <path d="M620 40l40 40-40 40-40-40z" />
    </svg>
  );
}

export function Apps() {
  const [open, setOpen] = useState<{ app: MobileApp; start: number } | null>(null);

  return (
    <section id="apps" aria-labelledby="apps-title" className="bg-blueprint relative overflow-x-clip py-24 text-blueprint-ink sm:py-32">
      <Doodles />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          id="apps-title"
          tone="light"
          kicker="Quick, hand me the Flutter SDK!"
          title="Pocket Inventions"
          fill="#fff"
        >
          Six mobile apps — sketched on blueprints, built with Flutter, shipped to real phones. Tap a blueprint to flip
          through its screens.
        </SectionHeading>
        <Cockatiel pose="perch" perch="pencil" className="absolute right-[3%] top-0 hidden h-40 w-auto -rotate-3 lg:block xl:right-[6%]" />

        <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {mobileApps.map((app, i) => (
            <AppCard
              key={app.slug}
              app={app}
              index={i}
              total={mobileApps.length}
              onOpen={(start) => setOpen({ app, start })}
            />
          ))}
        </div>
      </div>

      <Gallery
        open={open !== null}
        title={open?.app.name ?? ""}
        items={open ? galleryItems(open.app) : []}
        startIndex={open?.start ?? 0}
        onClose={() => setOpen(null)}
      />
    </section>
  );
}
