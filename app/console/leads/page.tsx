import { ChevronDown, Mail, Phone, TrendingUp } from "lucide-react";
import { Board, Dot, EmptyState, Kpi, KpiStrip, Lane, PageHeader, SourceBadge, boardLane } from "@/components/console/ui";
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

const contactPill =
  "inline-flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-full border border-white/12 bg-white/[0.04] text-[0.88rem] text-white/85 transition-colors hover:border-white/25 hover:text-text md:min-h-0 md:flex-none md:border-0 md:bg-transparent md:px-0 md:text-[0.78rem] md:text-muted";

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
          <p className="text-[0.82rem] text-subtle md:text-[0.75rem]">
            {lead.role ?? "Unknown role"} · {timeAgo(lead.createdAt)}
          </p>
        </div>
        {lead.readinessScore !== undefined ? <Dot tone={riskTone(lead.readinessScore)}>Risk {lead.readinessScore}</Dot> : null}
      </div>
      <div className="mt-2">
        <SourceBadge source={lead.source} />
      </div>
      {lead.cars ? <p className="mt-2 text-[0.88rem] text-white/85 md:text-[0.8rem]">{lead.cars}</p> : null}
      {lead.message ? <p className="mt-1.5 line-clamp-4 whitespace-pre-line text-[0.85rem] text-muted md:text-[0.78rem]">{lead.message}</p> : null}
      <div className="mt-3 flex gap-2">
        <a href={`mailto:${lead.email}`} className={contactPill}>
          <Mail className="size-4 md:size-3" /> Email
        </a>
        {lead.phone ? (
          <a href={`tel:${lead.phone.replace(/\s/g, "")}`} className={contactPill}>
            <Phone className="size-4 md:size-3" /> Call
          </a>
        ) : null}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-white/[0.06] pt-3 md:flex-nowrap">
        {next ? (
          <form action={updateLeadStage.bind(null, lead.id, next)} className="flex-1">
            <button className="min-h-11 w-full rounded-full border border-white/15 px-3 text-[0.85rem] text-text transition-colors hover:border-white/30 hover:bg-white/[0.06] md:min-h-0 md:px-2.5 md:py-1 md:text-[0.75rem]">
              Move to {nextLabel}
            </button>
          </form>
        ) : (
          <span className="flex-1 text-[0.82rem] text-subtle md:text-[0.75rem]">{lead.stage === "won" ? "Converted" : "Closed"}</span>
        )}
        <details className="relative max-md:open:w-full">
          <summary className="flex min-h-11 cursor-pointer list-none items-center gap-0.5 rounded-full px-3 text-[0.85rem] text-muted hover:bg-white/[0.06] hover:text-text md:min-h-0 md:px-2.5 md:py-1 md:text-[0.75rem] [&::-webkit-details-marker]:hidden">
            Stage <ChevronDown className="size-3" />
          </summary>
          <div className="mt-2 grid grid-cols-2 gap-1 rounded-xl border border-white/10 bg-black/30 p-1 md:absolute md:top-full md:right-0 md:z-20 md:mt-1 md:block md:w-40 md:bg-[#141518]/95 md:shadow-2xl">
            {LEAD_STAGES.filter((s) => s.id !== lead.stage).map((s) => (
              <form key={s.id} action={updateLeadStage.bind(null, lead.id, s.id)}>
                <button className="min-h-11 w-full rounded-lg px-3 text-left text-[0.9rem] text-muted hover:bg-white/[0.07] hover:text-text md:min-h-0 md:px-2.5 md:py-1.5 md:text-[0.78rem]">{s.label}</button>
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
              <li key={s} className="flex items-center justify-between text-[0.85rem] md:text-[0.78rem]">
                <span className="text-muted">{s}</span>
                <span className="tabular">{n}</span>
              </li>
            ))}
          </ul>
        </div>
      </KpiStrip>

      <Board
        grid="md:min-w-[1200px] md:grid-cols-6"
        jump={LEAD_STAGES.map((stage) => ({ id: `lane-${stage.id}`, label: stage.label, count: leads.filter((l) => l.stage === stage.id).length }))}
      >
        {LEAD_STAGES.map((stage) => {
          const list = leads.filter((l) => l.stage === stage.id);
          return (
            <Lane key={stage.id} id={`lane-${stage.id}`} className={boardLane} title={stage.label} count={list.length} tone={STAGE_TONE[stage.id]}>
              {list.length ? list.map((l) => <LeadCard key={l.id} lead={l} />) : <EmptyState icon={TrendingUp} title="None" />}
            </Lane>
          );
        })}
      </Board>
    </>
  );
}
