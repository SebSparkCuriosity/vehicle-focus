import { ChevronDown, Mail, Phone, TrendingUp } from "lucide-react";
import { Dot, EmptyState, Kpi, KpiStrip, Lane, PageHeader, SourceBadge } from "@/components/console/ui";
import { getLeads } from "@/lib/data/queries";
import { updateLeadStage } from "@/lib/actions";
import { LEAD_STAGES } from "@/lib/domain";
import { timeAgo } from "@/lib/format";
import type { Lead, LeadSource, LeadStage } from "@/lib/types";

export const metadata = { title: "Leads" };

const STAGE_TONE: Record<LeadStage, "gold" | "info" | "warning" | "success" | "neutral"> = {
  new: "gold",
  contacted: "info",
  "audit-booked": "info",
  proposal: "warning",
  won: "success",
  lost: "neutral",
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
    <article className="glass-inset rounded-xl p-3.5">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{lead.name}</p>
          <p className="text-[0.75rem] text-subtle">
            {lead.role ?? "Unknown role"} · {timeAgo(lead.createdAt)}
          </p>
        </div>
        {lead.readinessScore !== undefined ? <Dot tone={riskTone(lead.readinessScore)}>Risk {lead.readinessScore}</Dot> : null}
      </div>
      <div className="mt-2">
        <SourceBadge source={lead.source} />
      </div>
      {lead.cars ? <p className="mt-2 text-[0.8rem] text-white/85">{lead.cars}</p> : null}
      {lead.message ? <p className="mt-1.5 line-clamp-4 whitespace-pre-line text-[0.78rem] text-muted">{lead.message}</p> : null}
      <div className="mt-2.5 flex flex-wrap gap-x-3 gap-y-1 text-[0.78rem]">
        <a href={`mailto:${lead.email}`} className="inline-flex items-center gap-1 text-muted hover:text-text">
          <Mail className="size-3" /> Email
        </a>
        {lead.phone ? (
          <a href={`tel:${lead.phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-1 text-muted hover:text-text">
            <Phone className="size-3" /> Call
          </a>
        ) : null}
      </div>
      <div className="mt-3 flex items-center gap-2 border-t border-white/[0.06] pt-3">
        {next ? (
          <form action={updateLeadStage.bind(null, lead.id, next)} className="flex-1">
            <button className="w-full rounded-full border border-white/15 px-2.5 py-1 text-[0.75rem] text-text transition-colors hover:border-white/30 hover:bg-white/[0.06]">
              Move to {nextLabel}
            </button>
          </form>
        ) : (
          <span className="flex-1 text-[0.75rem] text-subtle">{lead.stage === "won" ? "Converted" : "Closed"}</span>
        )}
        <details className="relative">
          <summary className="flex cursor-pointer list-none items-center gap-0.5 rounded-full px-2.5 py-1 text-[0.75rem] text-muted hover:bg-white/[0.06] hover:text-text [&::-webkit-details-marker]:hidden">
            Stage <ChevronDown className="size-3" />
          </summary>
          <div className="glass-dark absolute right-0 z-10 mt-1 w-40 rounded-xl p-1">
            {LEAD_STAGES.filter((s) => s.id !== lead.stage).map((s) => (
              <form key={s.id} action={updateLeadStage.bind(null, lead.id, s.id)}>
                <button className="w-full rounded-lg px-2.5 py-1.5 text-left text-[0.78rem] text-muted hover:bg-white/[0.07] hover:text-text">{s.label}</button>
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
        title="Leads"
        description="Enquiries from the website, readiness checks, adviser referrals and events. A higher readiness score means a more at-risk car."
      />

      <KpiStrip columns="grid-cols-2 md:grid-cols-4" label="Pipeline figures" className="mb-6">
        <Kpi label="Open pipeline" value={open} />
        <Kpi label="Won" value={won} />
        <Kpi label="Win rate, closed leads" value={`${winRate}%`} sub={`${won} won, ${lost} lost`} />
        <div className="px-5 py-4">
          <p className="text-[0.78rem] text-muted">By source</p>
          <ul className="mt-2 space-y-1">
            {sources.map(([s, n]) => (
              <li key={s} className="flex items-center justify-between text-[0.78rem]">
                <span className="text-muted">{s}</span>
                <span className="tabular">{n}</span>
              </li>
            ))}
          </ul>
        </div>
      </KpiStrip>

      <div className="-mx-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
        <div className="grid min-w-[1200px] grid-cols-6 gap-3">
          {LEAD_STAGES.map((stage) => {
            const list = leads.filter((l) => l.stage === stage.id);
            return (
              <Lane key={stage.id} title={stage.label} count={list.length} tone={STAGE_TONE[stage.id]}>
                {list.length ? list.map((l) => <LeadCard key={l.id} lead={l} />) : <EmptyState icon={TrendingUp} title="None" />}
              </Lane>
            );
          })}
        </div>
      </div>
    </>
  );
}
