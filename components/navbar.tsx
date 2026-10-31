"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { Icon } from "@/components/icons";
import { navLinks, profile } from "@/lib/data";
import { cn } from "@/lib/utils";

function Logo() {
  return (
    <a href="#top" className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2" aria-label="Kerlos — back to top">
      <svg viewBox="0 0 40 40" className="size-9 shrink-0" aria-hidden="true">
        <path d="M5 5 36 20 5 35z" fill="#ff7a1a" stroke="#1b1534" strokeWidth="3.5" strokeLinejoin="round" />
        <path d="M13 13v14M13 20l6-6M14.5 19l5 7" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" fill="none" />
      </svg>
      <span className="font-display text-xl tracking-wide">Kerlos</span>
    </a>
  );
}

export function Navbar() {
  const [active, setActive] = useState("");
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > prev && y > 480);
  });

  useEffect(() => {
    const ids = ["top", ...navLinks.map((l) => l.id)];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id === "top" ? "" : entry.target.id);
        }
      },
      { rootMargin: "-48% 0px -48% 0px" },
    );
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <motion.header
        initial={false}
        animate={{ y: hidden && !open ? -120 : 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 30 }}
        className="fixed inset-x-0 top-3 z-50 flex justify-center px-3 sm:top-4"
      >
        <nav
          aria-label="Main"
          className="flex w-full max-w-5xl items-center justify-between gap-2 rounded-full border-[3px] border-ink bg-paper/95 px-2 py-1.5 shadow-toon backdrop-blur-md"
        >
          <Logo />

          <ul className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <li key={link.id} className="relative">
                {active === link.id && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full border-2 border-ink bg-sun"
                    transition={{ type: "spring", stiffness: 420, damping: 32 }}
                  />
                )}
                <a
                  href={`#${link.id}`}
                  aria-current={active === link.id ? "true" : undefined}
                  className="relative block rounded-full px-3.5 py-2 text-[15px] font-semibold transition-colors hover:text-orange-deep"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <a
              href={profile.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-toon btn-toon--orange btn-toon--sm hidden sm:inline-flex"
            >
              Resume
              <Icon name="download" className="size-4" />
            </a>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="btn-toon btn-toon--icon btn-toon--sm bg-sun lg:hidden"
              aria-label="Open menu"
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              <Icon name="menu" className="size-5" />
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="bg-blueprint fixed inset-0 z-[70] flex flex-col overflow-y-auto px-6 pb-10 pt-6 text-blueprint-ink"
            initial={{ clipPath: "circle(0% at 92% 4%)" }}
            animate={{ clipPath: "circle(150% at 92% 4%)" }}
            exit={{ clipPath: "circle(0% at 92% 4%)" }}
            transition={{ duration: 0.55, ease: [0.7, 0, 0.3, 1] }}
          >
            <div className="flex items-center justify-between">
              <span className="font-type text-xs tracking-[0.3em] text-blueprint-ink/70">DWG. NO. 104 — SITE MAP</span>
              <button
                type="button"
                autoFocus
                onClick={() => setOpen(false)}
                className="btn-toon btn-toon--icon btn-toon--sm"
                aria-label="Close menu"
              >
                <Icon name="close" className="size-5" />
              </button>
            </div>
            <ul className="mt-10 flex flex-col gap-2">
              {navLinks.map((link, i) => (
                <motion.li
                  key={link.id}
                  initial={{ opacity: 0, x: 60, rotate: 6 }}
                  animate={{ opacity: 1, x: 0, rotate: 0 }}
                  transition={{ delay: 0.15 + i * 0.06, type: "spring", stiffness: 300, damping: 22 }}
                >
                  <a
                    href={`#${link.id}`}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "title-toon block py-1 text-[clamp(2.6rem,12vw,4rem)] [--fill:#fff]",
                      active === link.id && "[--fill:var(--color-sun)]",
                    )}
                  >
                    {link.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <div className="mt-auto flex flex-wrap gap-3 pt-10">
              <a href={profile.resume} target="_blank" rel="noopener noreferrer" className="btn-toon btn-toon--orange">
                Resume <Icon name="download" className="size-5" />
              </a>
              <a href={`mailto:${profile.email}`} className="btn-toon">
                Say hi <Icon name="mail" className="size-5" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
