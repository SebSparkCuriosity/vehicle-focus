import Link from "next/link";
import { CircleCheck, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EmptyState, PageHeader, TableWrap, td, th } from "@/components/console/ui";
import { getLookups } from "@/components/console/lookups";
import { getDueItems } from "@/lib/data/queries";
import { isCheckOverdue, vehicleName } from "@/lib/domain";
import { daysUntil, formatDate, relativeDays } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { DueItem } from "@/lib/types";

export const metadata = { title: "Compliance" };

export default async function CompliancePage() {
  const [due, lookups] = await Promise.all([getDueItems(), getLookups()]);
  const overdue = due.filter((d) => daysUntil(d.dueDate) < 0);
  const soon = due.filter((d) => daysUntil(d.dueDate) >= 0 && daysUntil(d.dueDate) <= 30);
  const later = due.filter((d) => daysUntil(d.dueDate) > 30);
  const overdueChecks = lookups.vehicles.filter((v) => isCheckOverdue(v));

  const groups: { title: string; hint: string; items: DueItem[]; tone: "danger" | "warning" | "neutral" }[] = [
    { title: "Overdue", hint: "Past the deadline. Sort these today.", items: overdue, tone: "danger" },
    { title: "Next 30 days", hint: "Book slots and chase brokers now so nothing becomes urgent.", items: soon, tone: "warning" },
    { title: "Later", hint: "On the radar.", items: later, tone: "neutral" },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Compliance"
        title="Deadlines across the fleet"
        description="MOT, insurance, registration, servicing and warranties for every car, so paperwork is handled before it becomes urgent."
      />

      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { label: "Overdue", value: overdue.length, tone: overdue.length ? "text-danger" : "text-text" },
          { label: "Due in 30 days", value: soon.length, tone: soon.length ? "text-warning" : "text-text" },
          { label: "Later", value: later.length, tone: "text-text" },
          { label: "Overdue checks", value: overdueChecks.length, tone: overdueChecks.length ? "text-danger" : "text-text" },
        ].map((k) => (
          <div key={k.label} className="rounded-xl border border-border bg-surface p-4">
            <p className="text-xs text-muted">{k.label}</p>
            <p className={cn("mt-1 font-display text-2xl font-semibold tabular", k.tone)}>{k.value}</p>
          </div>
        ))}
      </div>

      {overdueChecks.length ? (
        <section className="mb-6 rounded-xl border border-danger/30 bg-danger-soft/40">
          <header className="border-b border-danger/20 px-4 py-3">
            <h2 className="font-display text-sm font-semibold text-danger">Care-cycle checks overdue</h2>
          </header>
          <ul className="divide-y divide-danger/15">
            {overdueChecks.map((v) => (
              <li key={v.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
                <Link href={`/console/fleet/${v.id}`} className="text-sm font-medium hover:text-gold">
                  {vehicleName(v)} <span className="text-subtle">· {v.registration}</span>
                </Link>
                <span className="text-xs text-muted">
                  {lookups.client.get(v.clientId)?.name} · {v.checkFrequency} check due {relativeDays(v.nextCheckAt)}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="space-y-6">
        {groups.map((g) => (
          <section key={g.title}>
            <div className="mb-2 flex items-baseline gap-2">
              <h2 className="font-display text-base font-semibold">{g.title}</h2>
              <span className="text-xs text-subtle">{g.hint}</span>
            </div>
            {g.items.length ? (
              <TableWrap>
                <table className="w-full min-w-[760px]">
                  <thead className="border-b border-border">
                    <tr>
                      <th className={th}>Due</th>
                      <th className={th}>What</th>
                      <th className={th}>Car</th>
                      <th className={th}>Client</th>
                      <th className={th}>Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {g.items.map((d) => {
                      const v = lookups.vehicle.get(d.vehicleId);
                      const c = v ? lookups.client.get(v.clientId) : undefined;
                      return (
                        <tr key={d.id} className="transition-colors hover:bg-surface-2/60">
                          <td className={td}>
                            <span className="block tabular">{formatDate(d.dueDate)}</span>
                            <span className={cn("text-xs", g.tone === "danger" ? "text-danger" : g.tone === "warning" ? "text-warning" : "text-subtle")}>
                              {relativeDays(d.dueDate)}
                            </span>
                          </td>
                          <td className={td}>
                            <Badge tone={g.tone}>{d.kind}</Badge>
                          </td>
                          <td className={td}>
                            {v ? (
                              <Link href={`/console/fleet/${v.id}`} className="hover:text-gold">
                                {vehicleName(v)} <span className="text-xs text-subtle">{v.registration}</span>
                              </Link>
                            ) : null}
                          </td>
                          <td className={cn(td, "text-muted")}>
                            {c ? (
                              <Link href={`/console/clients/${c.id}`} className="hover:text-text">
                                {c.name}
                              </Link>
                            ) : null}
                          </td>
                          <td className={cn(td, "max-w-80 truncate text-muted")} title={d.notes}>
                            {d.notes ?? <span className="text-subtle">None</span>}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </TableWrap>
            ) : (
              <EmptyState icon={g.tone === "danger" ? CircleCheck : ShieldCheck} title={g.tone === "danger" ? "Nothing overdue" : "Nothing in this window"} />
            )}
          </section>
        ))}
      </div>
    </>
  );
}
