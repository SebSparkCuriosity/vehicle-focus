import Link from "next/link";
import { cn } from "@/lib/utils";

/** Wordmark. A focus reticle plus tracked caps, after the brochure. Replace with the real logo file when supplied. */
export function Logo({ className, href = "/", compact = false }: { className?: string; href?: string; compact?: boolean }) {
  return (
    <Link href={href} className={cn("group inline-flex items-center gap-2.5 text-text", className)} aria-label="Vehicle Focus home">
      <svg viewBox="0 0 32 32" className="size-7 shrink-0" aria-hidden>
        <circle cx="16" cy="16" r="13" fill="none" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1.5" />
        <path d="M16 3v6M16 23v6M3 16h6M23 16h6" stroke="var(--gold)" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="16" cy="16" r="3" fill="var(--gold)" />
      </svg>
      {compact ? null : (
        <span className="font-display text-[0.8rem] font-semibold tracking-[0.28em] uppercase leading-none">
          Vehicle <span className="text-gold">Focus</span>
        </span>
      )}
    </Link>
  );
}
