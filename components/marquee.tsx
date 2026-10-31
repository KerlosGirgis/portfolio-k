import { Icon } from "@/components/icons";
import { catchphrases, marqueeWords } from "@/lib/data";
import { cn } from "@/lib/utils";

function Band({
  items,
  className,
  reverse = false,
  duration,
}: {
  items: string[];
  className?: string;
  reverse?: boolean;
  duration: number;
}) {
  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {items.map((item) => (
        <li key={item} className="flex items-center gap-6 px-6 font-display text-[clamp(1.25rem,2.6vw,2rem)] tracking-wide whitespace-nowrap">
          {item}
          <Icon name="sparkle" className="size-6 shrink-0" />
        </li>
      ))}
    </ul>
  );
  return (
    <div className={cn("flex overflow-hidden border-y-[3px] border-ink py-3", className)}>
      <div
        className="ambient flex w-max"
        style={{ animation: `marquee ${duration}s linear infinite${reverse ? " reverse" : ""}` }}
      >
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}

export function Marquee() {
  return (
    <div className="relative z-10 -mt-6 overflow-x-clip py-8">
      <Band
        items={marqueeWords}
        duration={38}
        className="-rotate-[2.2deg] scale-[1.04] bg-orange text-ink shadow-[0_6px_0_0_var(--color-ink)]"
      />
      <Band
        items={catchphrases}
        duration={46}
        reverse
        className="-mt-3 rotate-[1.6deg] scale-[1.04] bg-teal text-ink shadow-[0_6px_0_0_var(--color-ink)]"
      />
    </div>
  );
}
