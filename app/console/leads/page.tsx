import { ChevronDown, Mail, Phone, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EmptyState, PageHeader, SourceBadge } from "@/components/console/ui";
import { getLeads } from "@/lib/data/queries";
import { updateLeadStage } from "@/lib/actions";
import { LEAD_STAGES } from "@/lib/domain";
import { timeAgo } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Lead, LeadSource, LeadStage } from "@/lib/types";

export const metadata = { title: "Leads" };

const STAGE_ACCENT: Record<LeadStage, string> = {
  new: "bg-gold",
  contacted: "bg-info",
  "audit-booked": "bg-info",
  proposal: "bg-warning",
  won: "bg-success",
  lost: "bg-subtle",
};

const NEXT_STAGE: Partial<Record<LeadStage, LeadStage>> = {
  new: "contacted",
  contacted: "audit-booked",
  "audit-booked": "proposal",
  proposal: "won",
};

function riskTone(score: number) {
  return score >= 60 ? "danger" : score >= 30 ? "warning" : "success";
}

function LeadCard({ lead }: { lead: Lead }) {
  const next = NEXT_STAGE[lead.stage];
  const nextLabel = next ? LEAD_STAGES.find((s) => s.id === next)?.label : undefined;
  return (
    <article className="rounded-lg border border-border bg-surface-2 p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{lead.name}</p>
          <p className="text-xs text-subtle">
            {lead.role ?? "Unknown role"} · {timeAgo(lead.createdAt)}
          </p>
        </div>
        {lead.readinessScore !== undefined ? <Badge tone={riskTone(lead.readinessScore)}>Risk {lead.readinessScore}</Badge> : null}
      </div>
      <div className="mt-2">
        <SourceBadge source={lead.source} />
      </div>
      {lead.cars ? <p className="mt-2 text-xs text-text/85">{lead.cars}</p> : null}
      {lead.message ? <p className="mt-1.5 line-clamp-3 text-xs text-muted">{lead.message}</p> : null}
      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs">
        <a href={`mailto:${lead.email}`} className="inline-flex items-center gap-1 text-muted hover:text-gold">
          <Mail className="size-3" /> Email
        </a>
        {lead.phone ? (
          <a href={`tel:${lead.phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-1 text-muted hover:text-gold">
            <Phone className="size-3" /> Call
          </a>
        ) : null}
      </div>
      <div className="mt-3 flex items-center gap-2 border-t border-border pt-2.5">
        {next ? (
          <form action={updateLeadStage.bind(null, lead.id, next)} className="flex-1">
            <button className="w-full rounded-md border border-border-strong px-2 py-1 text-xs text-text transition-colors hover:border-gold hover:text-gold">
              Move to {nextLabel}
            </button>
          </form>
        ) : (
          <span className="flex-1 text-xs text-subtle">{lead.stage === "won" ? "Converted" : "Closed"}</span>
        )}
        <details className="relative">
          <summary className="flex cursor-pointer list-none items-center gap-0.5 rounded-md px-2 py-1 text-xs text-muted hover:bg-surface-3 hover:text-text [&::-webkit-details-marker]:hidden">
            Stage <ChevronDown className="size-3" />
          </summary>
          <div className="absolute right-0 z-10 mt-1 w-40 rounded-lg border border-border bg-surface-3 p-1 shadow-xl">
            {LEAD_STAGES.filter((s) => s.id !== lead.stage).map((s) => (
              <form key={s.id} action={updateLeadStage.bind(null, lead.id, s.id)}>
                <button className="w-full rounded px-2 py-1.5 text-left text-xs text-muted hover:bg-surface-2 hover:text-text">{s.label}</button>
              </form>
            ))}
          </div>
        </details>
      </div>
    </article>
  );
}

export default async function LeadsPage() {
  const leads = await getLeads();
  const won = leads.filter((l) => l.stage === "won").length;
  const lost = leads.filter((l) => l.stage === "lost").length;
  const open = leads.length - won - lost;
  const winRate = won + lost ? Math.round((won / (won + lost)) * 100) : 0;
  const sources = Array.from(
    leads.reduce((m, l) => m.set(l.source, (m.get(l.source) ?? 0) + 1), new Map<LeadSource, number>()),
  ).sort((a, b) => b[1] - a[1]);

  return (
    <>
      <PageHeader
        eyebrow="Leads"
        title="New business pipeline"
        description="Website enquiries, readiness-check results, adviser referrals and event contacts. Readiness scores show how at-risk the prospect's car is, higher is more urgent."
      />

      <section className="mb-6 grid gap-3 md:grid-cols-4">
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="text-xs text-muted">Open pipeline</p>
          <p className="mt-1 font-display text-2xl font-semibold tabular">{open}</p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="text-xs text-muted">Won</p>
          <p className="mt-1 font-display text-2xl font-semibold tabular text-success">{won}</p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="text-xs text-muted">Win rate (closed leads)</p>
          <p className="mt-1 font-display text-2xl font-semibold tabular">{winRate}%</p>
          <p className="text-xs text-subtle">
            {won} won, {lost} lost
          </p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="text-xs text-muted">By source</p>
          <ul className="mt-2 space-y-1">
            {sources.map(([s, n]) => (
              <li key={s} className="flex items-center justify-between text-xs">
                <span className="text-muted">{s}</span>
                <span className="tabular">{n}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="-mx-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
        <div className="grid min-w-[1200px] grid-cols-6 gap-3">
          {LEAD_STAGES.map((stage) => {
            const list = leads.filter((l) => l.stage === stage.id);
            return (
              <section key={stage.id} className="flex flex-col rounded-xl border border-border bg-surface/60">
                <header className="flex items-center gap-2 border-b border-border px-3 py-3">
                  <span className={cn("size-2 rounded-full", STAGE_ACCENT[stage.id])} aria-hidden />
                  <h2 className="font-display text-sm font-semibold">{stage.label}</h2>
                  <span className="ml-auto rounded-full bg-surface-3 px-2 text-xs text-muted tabular">{list.length}</span>
                </header>
                <div className="flex flex-1 flex-col gap-2.5 p-2.5">
                  {list.length ? list.map((l) => <LeadCard key={l.id} lead={l} />) : <EmptyState icon={TrendingUp} title="None" />}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </>
  );
}
