import Link from "next/link";
import {
  ClipboardCheck,
  FileText,
  KeyRound,
  MessageSquare,
  Sparkles,
  StickyNote,
  TrendingUp,
  Truck,
  Warehouse,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { HistoryKind, RequestType, Vehicle } from "@/lib/types";

// Small presentational pieces shared across The Garage. Server-safe.

/** Page heading: one editorial serif line and a quiet intro. No eyebrow. */
export function PageTitle({
  title,
  intro,
  action,
  className,
}: {
  title: React.ReactNode;
  intro?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-end justify-between gap-x-6 gap-y-4", className)}>
      <div className="min-w-0 max-w-2xl">
        <h1 className="font-display text-[2.4rem] leading-[1.04] font-normal text-balance sm:text-5xl">{title}</h1>
        {intro ? <p className="mt-3 text-base leading-relaxed text-white/65 md:text-[1.02rem]">{intro}</p> : null}
      </div>
      {action}
    </div>
  );
}

/** Section heading in the serif, with an optional quiet link on the right. */
export function SectionHeader({ title, action, className }: { title: string; action?: React.ReactNode; className?: string }) {
  return (
    <div className={cn("mb-3 flex min-h-11 items-end justify-between gap-4 px-1 md:mb-4", className)}>
      <h2 className="font-display text-2xl leading-tight font-normal">{title}</h2>
      {action}
    </div>
  );
}

/** Small sans heading for use inside a pane. */
export function PaneTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h2 className={cn("text-[0.82rem] font-semibold tracking-tight text-white/85", className)}>{children}</h2>;
}

/** Text link: white with an underline, never yellow. */
export function SectionLink({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <Link
      href={href}
      className={cn(
        // min-h-11 / min-w-11: a 44px tap area without changing how the link looks
        "inline-flex min-h-11 min-w-11 shrink-0 items-center justify-end text-sm text-white/70 underline decoration-white/25 underline-offset-4 transition-colors hover:text-white hover:decoration-white/60",
        className,
      )}
    >
      {children}
    </Link>
  );
}

/** Registration plate chip, styled like a front plate. Jersey plates carry a J prefix. */
export function Plate({ reg, className }: { reg: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[5px] bg-[#f4f3ef] px-1.5 py-px text-xs font-bold tracking-[0.14em] whitespace-nowrap text-[#111] uppercase tabular shadow-[inset_0_0_0_1px_rgba(0,0,0,0.14),0_2px_8px_rgba(0,0,0,0.35)]",
        className,
      )}
    >
      {reg}
    </span>
  );
}

const TONE_TEXT = {
  neutral: "text-white/60",
  gold: "text-accent",
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
  info: "text-info",
} as const;

export type Tone = keyof typeof TONE_TEXT;

/** Status as a dot and a word. Lighter than a badge, for lists. */
export function StatusText({ tone, children, className }: { tone: Tone; children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-[0.78rem] font-medium whitespace-nowrap", TONE_TEXT[tone], className)}>
      <span className="size-1.5 rounded-full bg-current" aria-hidden />
      {children}
    </span>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  body,
  action,
  className,
}: {
  icon?: LucideIcon;
  title: string;
  body?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("glass flex flex-col items-center rounded-[24px] px-6 py-12 text-center", className)}>
      {Icon ? <Icon className="size-5 text-white/55" aria-hidden /> : null}
      <p className="mt-3 font-display text-xl font-normal">{title}</p>
      {body ? <p className="mt-1.5 max-w-sm text-[0.95rem] leading-relaxed text-white/60 md:text-sm">{body}</p> : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

function luminance(hex: string): number {
  const h = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * The colour name set over a paint finish, like a paint sample card.
 * Renders nothing when the car has a photo.
 */
export function PaintLabel({
  vehicle,
  className,
}: {
  vehicle: Pick<Vehicle, "image" | "colour" | "paintHex">;
  className?: string;
}) {
  if (vehicle.image) return null;
  const light = luminance(vehicle.paintHex) > 0.6;
  return (
    <span
      className={cn(
        "pointer-events-none absolute inset-x-0 text-center font-display text-2xl font-normal italic",
        light ? "text-black/55" : "text-white/75",
        className,
      )}
      aria-hidden
    >
      {vehicle.colour}
    </span>
  );
}

export const HISTORY_ICON: Record<HistoryKind, LucideIcon> = {
  check: ClipboardCheck,
  service: Wrench,
  movement: Truck,
  detailing: Sparkles,
  document: FileText,
  valuation: TrendingUp,
  note: StickyNote,
  handover: KeyRound,
};

export const HISTORY_LABEL: Record<HistoryKind, string> = {
  check: "Check",
  service: "Service",
  movement: "Movement",
  detailing: "Detailing",
  document: "Document",
  valuation: "Valuation",
  note: "Note",
  handover: "Handover",
};

export const REQUEST_ICON: Record<RequestType, LucideIcon> = {
  ready: KeyRound,
  relocation: Truck,
  service: Wrench,
  detailing: Sparkles,
  storage: Warehouse,
  valuation: TrendingUp,
  other: MessageSquare,
};

/** "+£12,000" / "-£8,500" with percentage, for value movements. */
export function ValueDelta({ from, to, className }: { from: number; to: number; className?: string }) {
  const diff = to - from;
  const pct = from ? (diff / from) * 100 : 0;
  const up = diff >= 0;
  const abs = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(Math.abs(diff));
  return (
    <span className={cn("tabular text-sm font-medium", up ? "text-success" : "text-white/60", className)}>
      {up ? "+" : "-"}
      {abs} ({up ? "+" : "-"}
      {Math.abs(pct).toFixed(1)}%)
    </span>
  );
}
