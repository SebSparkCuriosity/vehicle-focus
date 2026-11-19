import Link from "next/link";
import { cn } from "@/lib/utils";
import { VF_MARK, VF_WORDMARK } from "@/components/brand/logo-paths";

/** The real Vehicle Focus mark, traced from the logo on vehicle-focus.com. */
export function VFMark({ className, color = "var(--accent)" }: { className?: string; color?: string }) {
  return (
    <svg viewBox={`0 0 ${VF_MARK.w} ${VF_MARK.h}`} className={cn("h-6 w-auto shrink-0", className)} aria-hidden>
      <path fill={color} fillRule="evenodd" d={VF_MARK.d} />
    </svg>
  );
}

export function VFWordmark({ className, color = "currentColor" }: { className?: string; color?: string }) {
  return (
    <svg viewBox={`0 0 ${VF_WORDMARK.w} ${VF_WORDMARK.h}`} className={cn("h-3 w-auto shrink-0", className)} aria-hidden>
      <path fill={color} fillRule="evenodd" d={VF_WORDMARK.d} />
    </svg>
  );
}

/** Mark plus wordmark lock-up. The wordmark stays ivory so the yellow is reserved for the mark. */
export function Logo({ className, href = "/", compact = false }: { className?: string; href?: string; compact?: boolean }) {
  return (
    <Link href={href} className={cn("group inline-flex items-center gap-3 text-text", className)} aria-label="Vehicle Focus home">
      <VFMark className="h-[22px]" />
      {compact ? null : <VFWordmark className="h-[11px] opacity-90 transition-opacity group-hover:opacity-100" />}
    </Link>
  );
}
