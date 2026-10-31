"use client";

import Image from "next/image";
import { motion } from "motion/react";
import type { Variants } from "motion/react";
import { SectionHeading } from "@/components/section-heading";
import { toolbox } from "@/lib/data";

const drop: Variants = {
  hidden: { opacity: 0, y: -46, rotate: -14 },
  show: { opacity: 1, y: 0, rotate: 0, transition: { type: "spring", stiffness: 380, damping: 11 } },
};

const swatches = ["bg-orange", "bg-teal", "bg-pink", "bg-sun", "bg-sky"];

function initials(name: string) {
  const words = name.replace(/[^A-Za-z0-9 ]/g, " ").split(/\s+/).filter(Boolean);
  return (words.length > 1 ? words.map((w) => w[0]).join("") : name.slice(0, 2)).slice(0, 2).toUpperCase();
}

export function Toolbox() {
  return (
    <section id="toolbox" aria-labelledby="toolbox-title" className="bg-pegboard relative overflow-x-clip py-24 sm:py-32">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-5 border-b-[3px] border-ink bg-wood-deep bg-[image:repeating-linear-gradient(90deg,transparent_0_140px,rgba(27,21,52,0.35)_140px_143px)]" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-5 border-t-[3px] border-ink bg-wood-deep bg-[image:repeating-linear-gradient(90deg,transparent_0_140px,rgba(27,21,52,0.35)_140px_143px)]" />

      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading id="toolbox-title" kicker="My cockatiel supervises every build…" title="The Toolbox" fill="var(--color-grass)" capBg="#fff">
          <span className="rounded-md bg-[#f6e2bf]/90 px-2 py-0.5 [box-decoration-break:clone] [-webkit-box-decoration-break:clone]">
            …and these are the tools she hasn&rsquo;t chewed yet. The ones I reach for whenever it&rsquo;s time to build something.
          </span>
        </SectionHeading>

        <div className="mt-16 space-y-12">
          {toolbox.map((group) => (
            <div key={group.label}>
              <h3 className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="tape -rotate-2 text-[1.7rem]">{group.label}</span>
                <span className="font-hand text-xl text-ink/70">— {group.note}</span>
              </h3>
              <motion.ul
                className="mt-5 flex flex-wrap gap-x-4 gap-y-6"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-60px" }}
                transition={{ staggerChildren: 0.045 }}
              >
                {group.tools.map((tool, i) => (
                  <motion.li key={tool.name} variants={drop} className="group relative pt-6">
                    <span aria-hidden="true" className="absolute left-1/2 top-0 size-3.5 -translate-x-1/2 rounded-full border-2 border-ink bg-[#6b5139]" />
                    <span
                      className="relative flex origin-[50%_-1.2rem] items-center gap-2.5 rounded-xl border-[3px] border-ink bg-white py-2 pl-2.5 pr-3.5 font-semibold shadow-toon-sm transition-shadow group-hover:animate-[swing_0.9s_ease-in-out] group-hover:shadow-toon"
                    >
                      <span aria-hidden="true" className="absolute -top-[1.35rem] left-1/2 h-5 w-0.5 -translate-x-1/2 bg-ink/70" />
                      {tool.icon ? (
                        <Image src={`/icons/tech/${tool.icon}.svg`} alt="" width={26} height={26} unoptimized className="size-[26px]" />
                      ) : (
                        <span
                          aria-hidden="true"
                          className={`grid size-[26px] place-items-center rounded-md border-2 border-ink text-[10px] font-bold ${swatches[i % swatches.length]}`}
                        >
                          {initials(tool.name)}
                        </span>
                      )}
                      {tool.name}
                    </span>
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
