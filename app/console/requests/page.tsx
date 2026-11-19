import { Inbox } from "lucide-react";
import { EmptyState, Lane, PageHeader } from "@/components/console/ui";
import { RequestCard } from "@/components/console/rows";
import { getLookups } from "@/components/console/lookups";
import { getRequests } from "@/lib/data/queries";
import { REQUEST_STATUS_META } from "@/lib/domain";
import type { RequestStatus } from "@/lib/types";

export const metadata = { title: "Requests" };

const COLUMNS: { status: RequestStatus; hint: string }[] = [
  { status: "new", hint: "Review, quote and schedule" },
  { status: "scheduled", hint: "Booked, with a job on the schedule" },
  { status: "in-progress", hint: "Under way right now" },
  { status: "done", hint: "Completed and on the record" },
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
        title="Requests"
        description="Everything clients and their assistants have asked for. New requests need a time, a person and, where relevant, a quote."
      />

      <div className="-mx-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
        <div className="grid min-w-[880px] grid-cols-4 gap-4">
          {COLUMNS.map((col) => {
            const list = sortFor(col.status);
            return (
              <Lane
                key={col.status}
                title={REQUEST_STATUS_META[col.status].label}
                hint={col.hint}
                count={list.length}
                tone={REQUEST_STATUS_META[col.status].tone}
              >
                {list.length ? list.map((r) => card(r.id)) : <EmptyState icon={Inbox} title="Nothing here" />}
              </Lane>
            );
          })}
        </div>
      </div>

      <details className="glass mt-6 rounded-2xl">
        <summary className="cursor-pointer px-5 py-3.5 text-sm text-muted transition-colors hover:text-text">
          Cancelled <span className="text-subtle tabular">{cancelled.length}</span>
        </summary>
        <div className="grid gap-2.5 border-t border-white/[0.07] p-3 sm:grid-cols-2 lg:grid-cols-3">
          {cancelled.length ? cancelled.map((r) => card(r.id, true)) : <p className="text-sm text-subtle">None cancelled.</p>}
        </div>
      </details>
    </>
  );
}
