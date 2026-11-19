import { Inbox } from "lucide-react";
import { EmptyState, PageHeader } from "@/components/console/ui";
import { RequestCard } from "@/components/console/rows";
import { getLookups } from "@/components/console/lookups";
import { getRequests } from "@/lib/data/queries";
import { REQUEST_STATUS_META } from "@/lib/domain";
import { cn } from "@/lib/utils";
import type { RequestStatus } from "@/lib/types";

export const metadata = { title: "Requests" };

const COLUMNS: { status: RequestStatus; hint: string; accent: string }[] = [
  { status: "new", hint: "Review, quote and schedule", accent: "bg-gold" },
  { status: "scheduled", hint: "Booked, with a job on the schedule", accent: "bg-info" },
  { status: "in-progress", hint: "Under way right now", accent: "bg-warning" },
  { status: "done", hint: "Completed and on the record", accent: "bg-success" },
];

export default async function RequestsPage() {
  const [requests, lookups] = await Promise.all([getRequests(), getLookups()]);
  const cancelled = requests.filter((r) => r.status === "cancelled");
  const sortFor = (status: RequestStatus) =>
    requests
      .filter((r) => r.status === status)
      .sort((a, b) => (status === "done" ? b.when.localeCompare(a.when) : a.when.localeCompare(b.when)));

  const card = (id: string, compact = false) => {
    const r = requests.find((x) => x.id === id)!;
    return (
      <RequestCard
        key={r.id}
        request={r}
        compact={compact}
        vehicle={lookups.vehicle.get(r.vehicleId)}
        client={lookups.client.get(r.clientId)}
        assignee={r.assigneeId ? lookups.member.get(r.assigneeId) : undefined}
        partner={r.partnerId ? lookups.partner.get(r.partnerId) : undefined}
      />
    );
  };

  return (
    <>
      <PageHeader
        eyebrow="Requests"
        title="Request board"
        description="Everything clients, their assistants and advisers have asked for through The Garage. New requests need a time, a person and, where relevant, a quote."
      />

      <div className="-mx-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
        <div className="grid min-w-[880px] grid-cols-4 gap-4">
          {COLUMNS.map((col) => {
            const list = sortFor(col.status);
            return (
              <section key={col.status} className="flex flex-col rounded-xl border border-border bg-surface/60">
                <header className="border-b border-border px-3 py-3">
                  <div className="flex items-center gap-2">
                    <span className={cn("size-2 rounded-full", col.accent)} aria-hidden />
                    <h2 className="font-display text-sm font-semibold">{REQUEST_STATUS_META[col.status].label}</h2>
                    <span className="ml-auto rounded-full bg-surface-3 px-2 text-xs text-muted tabular">{list.length}</span>
                  </div>
                  <p className="mt-1 text-[0.7rem] text-subtle">{col.hint}</p>
                </header>
                <div className="flex flex-1 flex-col gap-2.5 p-2.5">
                  {list.length ? list.map((r) => card(r.id)) : <EmptyState icon={Inbox} title="Empty" />}
                </div>
              </section>
            );
          })}
        </div>
      </div>

      <details className="mt-6 rounded-xl border border-border bg-surface">
        <summary className="cursor-pointer px-4 py-3 text-sm text-muted hover:text-text">
          Cancelled requests <span className="tabular">({cancelled.length})</span>
        </summary>
        <div className="grid gap-2.5 border-t border-border p-3 sm:grid-cols-2 lg:grid-cols-3">
          {cancelled.length ? cancelled.map((r) => card(r.id, true)) : <p className="text-sm text-subtle">None cancelled.</p>}
        </div>
      </details>
    </>
  );
}
