import { Cockatiel } from "@/components/characters";
import { Icon } from "@/components/icons";
import { navLinks, profile } from "@/lib/data";
import { seeded } from "@/lib/utils";

const rand = seeded(104);
const stars = Array.from({ length: 46 }, () => ({
  left: `${(rand() * 100).toFixed(2)}%`,
  top: `${(rand() * 70).toFixed(2)}%`,
  size: 2 + Math.round(rand() * 3),
  delay: `${(rand() * 4).toFixed(2)}s`,
  duration: `${(2.5 + rand() * 3).toFixed(2)}s`,
}));

const socials = [
  { href: profile.github, label: "GitHub", icon: "github" },
  { href: profile.linkedin, label: "LinkedIn", icon: "linkedin" },
  { href: `mailto:${profile.email}`, label: "Email", icon: "mail" },
  { href: profile.whatsapp, label: "WhatsApp", icon: "whatsapp" },
] as const;

export function Footer() {
  return (
    <footer className="relative isolate overflow-hidden bg-[linear-gradient(180deg,#2b1a5c_0%,#150d33_100%)] pb-10 pt-16 text-paper">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        {stars.map((s, i) => (
          <span
            key={i}
            className="ambient absolute rounded-full bg-[#fff6c4]"
            style={{
              left: s.left,
              top: s.top,
              width: s.size,
              height: s.size,
              animation: `twinkle ${s.duration} ease-in-out ${s.delay} infinite`,
            }}
          />
        ))}
        <div className="absolute right-[9%] top-10 size-20 rounded-full bg-[#fff6c4] shadow-[0_0_60px_10px_rgba(255,246,196,0.35)] sm:size-24">
          <span className="absolute -right-1 -top-1 size-[85%] rounded-full bg-[#2b1a5c]" />
        </div>
      </div>

      <div className="mx-auto flex max-w-6xl flex-col items-center px-5 text-center sm:px-8">
        <div className="relative">
          <p className="bubble mb-4 px-5 py-2.5 text-lg font-semibold text-ink [--tail-x:46%]">Shh&hellip; she&rsquo;s asleep.</p>
          <Cockatiel pose="sleep" perch="branch" marksColor="#fff6c4" className="mx-auto w-32 drop-shadow-[0_6px_0_rgba(0,0,0,0.35)] sm:w-36" />
        </div>

        <nav aria-label="Footer" className="mt-10">
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 font-semibold">
            {navLinks.map((l) => (
              <li key={l.id}>
                <a href={`#${l.id}`} className="text-paper/80 transition-colors hover:text-sun">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <ul className="mt-7 flex gap-3">
          {socials.map((s) => (
            <li key={s.label}>
              <a
                href={s.href}
                target={s.href.startsWith("mailto") ? undefined : "_blank"}
                rel="noopener noreferrer"
                aria-label={s.label}
                className="btn-toon btn-toon--icon btn-toon--sm"
              >
                <Icon name={s.icon} className="size-5" />
              </a>
            </li>
          ))}
        </ul>

        <a href="#top" className="btn-toon btn-toon--sun mt-9">
          Back to the backyard <Icon name="arrowUp" className="size-5" />
        </a>

        <div className="mt-12 w-full border-t-2 border-dashed border-paper/20 pt-6 text-sm text-paper/60">
          <p>
            © 2026 {profile.name} · Built with Next.js and a whole summer&rsquo;s worth of imagination.
          </p>
          <p className="mt-2 text-xs text-paper/45">
            An unofficial fan tribute inspired by <em>Phineas and Ferb</em>. Not affiliated with or endorsed by Disney.
          </p>
        </div>
      </div>
    </footer>
  );
}
