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
import type { DocumentKind, HistoryKind, RequestType } from "@/lib/types";

// Small presentational pieces shared across The Garage. Server-safe.

export function SectionHeader({
  eyebrow,
  title,
  action,
  className,
}: {
  eyebrow?: string;
  title: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-4 flex items-end justify-between gap-4", className)}>
      <div>
        {eyebrow ? <p className="eyebrow mb-1.5">{eyebrow}</p> : null}
        <h2 className="font-display text-lg font-semibold tracking-tight">{title}</h2>
      </div>
      {action}
    </div>
  );
}

export function SectionLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="shrink-0 text-sm text-muted transition-colors hover:text-gold">
      {children}
    </Link>
  );
}

/** Registration plate chip. Jersey plates carry a J prefix. */
export function Plate({ reg, className }: { reg: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[4px] border border-[#d9c76a]/40 bg-[#f2e7a6] px-1.5 py-px font-display text-[0.7rem] font-semibold tracking-[0.12em] text-[#151515] uppercase tabular",
        className,
      )}
    >
      {reg}
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
  icon: LucideIcon;
  title: string;
  body?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center rounded-xl border border-dashed border-border px-6 py-10 text-center", className)}>
      <span className="grid size-10 place-items-center rounded-full bg-surface-2 text-subtle">
        <Icon className="size-5" aria-hidden />
      </span>
      <p className="mt-3 text-sm font-medium">{title}</p>
      {body ? <p className="mt-1 max-w-sm text-sm text-muted">{body}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
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

export const DOC_TONE: Record<DocumentKind, "neutral" | "gold" | "success" | "info"> = {
  Registration: "neutral",
  Insurance: "info",
  "Service record": "success",
  Invoice: "neutral",
  "Condition report": "gold",
  Purchase: "gold",
  Shipping: "info",
  Warranty: "neutral",
};

/** "+£12,000" / "-£8,500" with percentage, for value movements. */
export function ValueDelta({ from, to, className }: { from: number; to: number; className?: string }) {
  const diff = to - from;
  const pct = from ? (diff / from) * 100 : 0;
  const up = diff >= 0;
  const abs = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(Math.abs(diff));
  return (
    <span className={cn("tabular text-sm font-medium", up ? "text-success" : "text-warning", className)}>
      {up ? "+" : "-"}
      {abs} ({up ? "+" : "-"}
      {Math.abs(pct).toFixed(1)}%)
    </span>
  );
}
