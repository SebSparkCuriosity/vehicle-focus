import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { JOB_KIND_LABEL, TIERS } from "@/lib/domain";
import { cn } from "@/lib/utils";
import type { JobKind, LeadSource, Tier } from "@/lib/types";

// Server-safe presentational pieces shared across console pages.
// Console look: calm, dense smoked glass over the fixed photo backdrop.
// Panes use .glass; anything inside a pane uses .glass-inset or hairlines (never blur inside blur).

/** Back link above a page title: 44px tall on phones, compact on desktop. */
export const backLink =
  "no-print -ml-1 mb-2 inline-flex min-h-11 items-center gap-1 rounded-full pr-3 pl-1 text-[0.85rem] text-muted transition-colors hover:text-text md:mb-4 md:min-h-0 md:text-[0.8rem]";

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  back,
}: {
  /** Optional metadata line above the title (e.g. registration). Plain muted text, not a tracked label. */
  eyebrow?: string;
  title: string;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  back?: { href: string; label: string };
}) {
  return (
    <header className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {back ? (
          <Link href={back.href} className={backLink}>
            <ChevronLeft className="size-3.5" />
            {back.label}
          </Link>
        ) : null}
        {eyebrow ? <p className="mb-1.5 text-[0.8rem] text-muted">{eyebrow}</p> : null}
        <h1 className="font-display text-[2rem] leading-[1.08] font-normal text-balance sm:text-[2.4rem]">{title}</h1>
        {description ? <div className="mt-2 max-w-2xl text-[0.9rem] leading-relaxed text-muted">{description}</div> : null}
      </div>
      {actions ? <div className="no-print flex flex-wrap items-center gap-2">{actions}</div> : null}
    </header>
  );
}

/** One glass pane holding a row of figures, split by hairlines. Wraps cleanly on small screens. */
export function KpiStrip({
  children,
  className,
  columns = "grid-cols-2 md:grid-cols-3 xl:grid-cols-6",
  label = "Key figures",
}: {
  children: React.ReactNode;
  className?: string;
  /** Grid column classes, e.g. "grid-cols-2 md:grid-cols-4" */
  columns?: string;
  label?: string;
}) {
  return (
    <section aria-label={label} className={cn("glass overflow-hidden rounded-2xl", className)}>
      <div className={cn("-mt-px -ml-px grid [&>*]:border-t [&>*]:border-l [&>*]:border-white/[0.07]", columns)}>
        {children}
      </div>
    </section>
  );
}

/** A single figure. Designed to sit inside KpiStrip. */
export function Kpi({
  label,
  value,
  sub,
  href,
  highlight = false,
}: {
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
  /** Kept for call-site compatibility; icons are no longer shown on figures. */
  icon?: LucideIcon;
  href?: string;
  highlight?: boolean;
}) {
  const body = (
    <div className="h-full px-5 py-4 transition-colors group-hover:bg-white/[0.035]">
      <p className="text-[0.78rem] text-muted">{label}</p>
      <p className={cn("mt-1.5 font-display text-[1.9rem] leading-none font-normal tabular", highlight && "text-accent")}>{value}</p>
      {sub ? <p className="mt-1.5 text-xs text-subtle">{sub}</p> : null}
    </div>
  );
  return href ? (
    <Link href={href} className="group block">
      {body}
    </Link>
  ) : (
    body
  );
}

export function Panel({
  title,
  description,
  action,
  children,
  className,
  bodyClassName,
  id,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  /** Anchor target; scroll margin clears the sticky mobile top bar. */
  id?: string;
}) {
  return (
    <section id={id} className={cn("glass scroll-mt-24 rounded-2xl", className)}>
      <div className="flex items-start justify-between gap-3 px-5 pt-4 pb-3">
        <div className="min-w-0">
          <h2 className="text-[0.92rem] font-semibold tracking-tight">{title}</h2>
          {description ? <p className="mt-0.5 text-[0.78rem] text-muted">{description}</p> : null}
        </div>
        {action ? <div className="no-print shrink-0 pt-0.5">{action}</div> : null}
      </div>
      <div className="mx-5 h-px bg-white/[0.07]" aria-hidden />
      <div className={cn("p-5", bodyClassName)}>{children}</div>
    </section>
  );
}

/** Quiet text link used in panel headers and footers. */
export function PanelLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="-my-3 inline-flex min-h-11 items-center px-1 text-[0.82rem] text-muted underline-offset-4 transition-colors hover:text-text hover:underline md:my-0 md:min-h-0 md:px-0 md:text-[0.78rem]"
    >
      {children}
    </Link>
  );
}

export function EmptyState({ icon: Icon, title, description }: { icon?: LucideIcon; title: string; description?: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/10 px-4 py-8 text-center">
      {Icon ? <Icon className="mb-2 size-4.5 text-subtle" aria-hidden /> : null}
      <p className="text-sm font-medium text-text">{title}</p>
      {description ? <p className="mt-1 max-w-xs text-[0.78rem] text-muted">{description}</p> : null}
    </div>
  );
}

export function Initials({ initials, title, className }: { initials: string; title?: string; className?: string }) {
  return (
    <span
      title={title}
      className={cn(
        "grid size-7 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.07] text-xs font-semibold text-white/80",
        className,
      )}
    >
      {initials}
    </span>
  );
}

/** Small coloured dot plus label. The console's default way of showing a state. */
export function Dot({
  tone = "neutral",
  children,
  className,
}: {
  tone?: "neutral" | "gold" | "success" | "warning" | "danger" | "info";
  children: React.ReactNode;
  className?: string;
}) {
  const color = {
    neutral: "bg-white/40",
    gold: "bg-accent",
    success: "bg-success",
    warning: "bg-warning",
    danger: "bg-danger",
    info: "bg-info",
  }[tone];
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-[0.78rem] whitespace-nowrap text-muted", className)}>
      <span className={cn("size-1.5 shrink-0 rounded-full", color)} aria-hidden />
      {children}
    </span>
  );
}

export function TierBadge({ tier }: { tier: Tier }) {
  const tone = tier === "black-label" ? "text-text" : tier === "platinum" ? "text-white/70" : "text-accent";
  return (
    <span className={cn("inline-flex items-center rounded-full border border-white/10 px-2 py-[2px] text-xs font-medium whitespace-nowrap", tone)}>
      {TIERS[tier].label}
    </span>
  );
}

const JOB_TONE: Record<JobKind, "info" | "gold" | "warning" | "success" | "neutral"> = {
  check: "info",
  relocation: "neutral",
  service: "warning",
  detailing: "success",
  handover: "gold",
  collection: "neutral",
  photography: "neutral",
};

export function JobKindBadge({ kind }: { kind: JobKind }) {
  return <Dot tone={JOB_TONE[kind]}>{JOB_KIND_LABEL[kind]}</Dot>;
}

export const JOB_BAR: Record<JobKind, string> = {
  check: "bg-info",
  relocation: "bg-white/50",
  service: "bg-warning",
  detailing: "bg-success",
  handover: "bg-accent",
  collection: "bg-white/50",
  photography: "bg-white/30",
};

export function SourceBadge({ source }: { source: LeadSource }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 px-2 py-[2px] text-xs whitespace-nowrap text-muted">{source}</span>
  );
}

export function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${rating} out of 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={cn("text-xs", i < rating ? "text-white/85" : "text-white/15")} aria-hidden>
          ★
        </span>
      ))}
    </span>
  );
}

/** A translucent board column (requests, leads). Cards inside should use .glass-inset. */
export function Lane({
  title,
  hint,
  count,
  tone = "neutral",
  children,
  className,
  id,
}: {
  title: string;
  hint?: string;
  count: number;
  tone?: "neutral" | "gold" | "success" | "warning" | "danger" | "info";
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={cn("glass flex flex-col rounded-2xl", className)}>
      <header className="px-4 pt-4 pb-3">
        <div className="flex items-center gap-2">
          <Dot tone={tone} className="text-[0.88rem] font-medium text-text">
            {title}
          </Dot>
          <span className={cn("ml-auto text-[0.78rem] tabular", tone === "gold" && count > 0 ? "text-accent" : "text-subtle")}>{count}</span>
        </div>
        {hint ? <p className="mt-1 text-xs text-subtle">{hint}</p> : null}
      </header>
      <div className="flex flex-1 flex-col gap-2.5 px-2.5 pb-2.5">{children}</div>
    </section>
  );
}

/** Label / value pair for definition-style detail blocks. */
export function Detail({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <dt className="text-[0.75rem] text-subtle">{label}</dt>
      <dd className="mt-0.5 text-sm text-text">{children}</dd>
    </div>
  );
}

/** Glass pane for wide tables: scrolls horizontally inside itself, never the page. */
export function TableWrap({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("glass overflow-x-auto rounded-2xl", className)}>{children}</div>;
}

// ---------- Phone layouts ----------

/** Phone-only list that replaces a wide table below md. Pair with <TableWrap className="hidden md:block">. */
export function MobileList({ children, label, className }: { children: React.ReactNode; label: string; className?: string }) {
  return (
    <ul aria-label={label} className={cn("glass divide-y divide-white/[0.06] overflow-hidden rounded-2xl md:hidden", className)}>
      {children}
    </ul>
  );
}

/** One tappable row in a MobileList: at least 64px tall, whole row is the link. */
export function MobileRow({
  href,
  media,
  title,
  meta,
  footer,
  aside,
}: {
  href: string;
  media?: React.ReactNode;
  title: React.ReactNode;
  meta?: React.ReactNode;
  footer?: React.ReactNode;
  aside?: React.ReactNode;
}) {
  return (
    <li>
      <Link href={href} className="flex min-h-16 items-center gap-3 px-4 py-3 transition-colors active:bg-white/[0.06]">
        {media}
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[0.95rem] font-medium">{title}</span>
          {meta ? <span className="mt-0.5 block truncate text-[0.82rem] text-muted">{meta}</span> : null}
          {footer ? <span className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.82rem]">{footer}</span> : null}
        </span>
        {aside ? <span className="shrink-0 text-right">{aside}</span> : null}
        <ChevronRight className="size-4 shrink-0 text-white/25" aria-hidden />
      </Link>
    </li>
  );
}

/**
 * Horizontal board (requests, leads). On phones the lanes become a swipeable
 * scroll-snap row with a peek of the next lane; from md up it is a grid.
 */
export function Board({ children, grid, jump }: { children: React.ReactNode; grid: string; jump?: { id: string; label: string; count: number }[] }) {
  return (
    <>
      {jump ? (
        <nav aria-label="Jump to column" className="-mx-4 mb-3 flex gap-2 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:px-6 md:hidden">
          {jump.map((j) => (
            <a
              key={j.id}
              href={`#${j.id}`}
              className="glass-inset inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full px-4 text-[0.85rem] text-white/85"
            >
              {j.label} <span className="text-subtle tabular">{j.count}</span>
            </a>
          ))}
        </nav>
      ) : null}
      <div className="-mx-4 snap-x snap-mandatory scroll-px-4 overflow-x-auto px-4 pb-3 sm:-mx-6 sm:scroll-px-6 sm:px-6 md:mx-0 md:snap-none md:px-0 md:pb-2">
        <div className={cn("flex items-start gap-3 md:grid md:items-stretch", grid)}>{children}</div>
      </div>
    </>
  );
}

/** Width and snap classes for a Lane inside a Board. */
export const boardLane = "w-[85vw] max-w-[22rem] shrink-0 snap-start scroll-mt-24 md:w-auto md:max-w-none";

export const th = "px-4 py-3 text-left text-[0.75rem] font-medium text-subtle whitespace-nowrap";
export const td = "px-4 py-3 align-middle text-sm whitespace-nowrap";
/** Table row: hairline separators and a soft hover. Apply to <tr> in tbody. */
export const tr = "border-t border-white/[0.06] transition-colors hover:bg-white/[0.03]";
