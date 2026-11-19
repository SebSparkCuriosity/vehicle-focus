import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { JOB_KIND_LABEL, TIERS } from "@/lib/domain";
import { cn } from "@/lib/utils";
import type { JobKind, LeadSource, Tier } from "@/lib/types";

// Server-safe presentational pieces shared across console pages.

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  back,
}: {
  eyebrow?: string;
  title: string;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  back?: { href: string; label: string };
}) {
  return (
    <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {back ? (
          <Link href={back.href} className="no-print mb-3 inline-flex items-center gap-1 text-xs text-muted hover:text-text">
            <ChevronRight className="size-3 rotate-180" />
            {back.label}
          </Link>
        ) : null}
        {eyebrow ? <p className="eyebrow mb-2">{eyebrow}</p> : null}
        <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-[1.7rem]">{title}</h1>
        {description ? <div className="mt-1.5 max-w-2xl text-sm text-muted">{description}</div> : null}
      </div>
      {actions ? <div className="no-print flex flex-wrap items-center gap-2">{actions}</div> : null}
    </header>
  );
}

export function Kpi({
  label,
  value,
  sub,
  icon: Icon,
  href,
}: {
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
  icon?: LucideIcon;
  href?: string;
}) {
  const body = (
    <div className="h-full rounded-xl border border-border bg-surface p-4 transition-colors group-hover:border-border-strong">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium text-muted">{label}</p>
        {Icon ? <Icon className="size-4 text-subtle" aria-hidden /> : null}
      </div>
      <p className="mt-2 font-display text-2xl font-semibold tracking-tight tabular">{value}</p>
      {sub ? <p className="mt-1 text-xs text-subtle">{sub}</p> : null}
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
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section className={cn("rounded-xl border border-border bg-surface", className)}>
      <div className="flex items-start justify-between gap-3 border-b border-border px-4 py-3">
        <div className="min-w-0">
          <h2 className="font-display text-sm font-semibold tracking-tight">{title}</h2>
          {description ? <p className="mt-0.5 text-xs text-muted">{description}</p> : null}
        </div>
        {action ? <div className="no-print shrink-0">{action}</div> : null}
      </div>
      <div className={cn("p-4", bodyClassName)}>{children}</div>
    </section>
  );
}

export function EmptyState({ icon: Icon, title, description }: { icon?: LucideIcon; title: string; description?: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border px-4 py-8 text-center">
      {Icon ? <Icon className="mb-2 size-5 text-subtle" aria-hidden /> : null}
      <p className="text-sm font-medium text-text">{title}</p>
      {description ? <p className="mt-1 max-w-xs text-xs text-muted">{description}</p> : null}
    </div>
  );
}

export function Initials({ initials, title, className }: { initials: string; title?: string; className?: string }) {
  return (
    <span
      title={title}
      className={cn("grid size-6 shrink-0 place-items-center rounded-full bg-gold-soft font-display text-[0.62rem] font-semibold text-gold", className)}
    >
      {initials}
    </span>
  );
}

export function TierBadge({ tier }: { tier: Tier }) {
  const tone = tier === "black-label" ? "neutral" : tier === "platinum" ? "info" : "gold";
  return (
    <Badge tone={tone} className={tier === "black-label" ? "border-text/30 text-text" : undefined}>
      {TIERS[tier].label}
    </Badge>
  );
}

const JOB_TONE: Record<JobKind, "info" | "gold" | "warning" | "success" | "neutral"> = {
  check: "info",
  relocation: "gold",
  service: "warning",
  detailing: "success",
  handover: "gold",
  collection: "info",
  photography: "neutral",
};

export function JobKindBadge({ kind }: { kind: JobKind }) {
  return <Badge tone={JOB_TONE[kind]}>{JOB_KIND_LABEL[kind]}</Badge>;
}

export const JOB_BAR: Record<JobKind, string> = {
  check: "bg-info",
  relocation: "bg-gold",
  service: "bg-warning",
  detailing: "bg-success",
  handover: "bg-gold",
  collection: "bg-info",
  photography: "bg-muted",
};

const SOURCE_TONE: Record<LeadSource, "gold" | "info" | "success" | "neutral" | "warning"> = {
  Website: "neutral",
  "Readiness check": "gold",
  Referral: "success",
  Adviser: "info",
  Event: "warning",
};

export function SourceBadge({ source }: { source: LeadSource }) {
  return <Badge tone={SOURCE_TONE[source]}>{source}</Badge>;
}

export function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${rating} out of 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={cn("text-xs", i < rating ? "text-gold" : "text-surface-3")} aria-hidden>
          ★
        </span>
      ))}
    </span>
  );
}

/** Label / value pair for definition-style detail blocks. */
export function Detail({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <dt className="text-xs text-subtle">{label}</dt>
      <dd className="mt-0.5 text-sm text-text">{children}</dd>
    </div>
  );
}

/** Wraps wide tables so they scroll inside their own box on small screens. */
export function TableWrap({ children }: { children: React.ReactNode }) {
  return <div className="overflow-x-auto rounded-xl border border-border bg-surface">{children}</div>;
}

export const th = "px-4 py-2.5 text-left text-[0.7rem] font-medium uppercase tracking-wider text-subtle whitespace-nowrap";
export const td = "px-4 py-3 align-middle text-sm whitespace-nowrap";
