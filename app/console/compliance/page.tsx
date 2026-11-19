import Link from "next/link";
import { CircleCheck, ShieldCheck } from "lucide-react";
import { Dot, EmptyState, KpiStrip, PageHeader, TableWrap, td, th, tr } from "@/components/console/ui";
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
        title="Compliance"
        description="MOT, insurance, registration, servicing and warranties for every car, handled before they become urgent."
      />

      <KpiStrip columns="grid-cols-2 md:grid-cols-4" label="Deadline figures" className="mb-6">
        {[
          { label: "Overdue", value: overdue.length, tone: overdue.length ? "text-danger" : "" },
          { label: "Due in 30 days", value: soon.length, tone: soon.length ? "text-warning" : "" },
          { label: "Later", value: later.length, tone: "" },
          { label: "Overdue checks", value: overdueChecks.length, tone: overdueChecks.length ? "text-danger" : "" },
        ].map((k) => (
          <div key={k.label} className="px-5 py-4">
            <p className="text-[0.78rem] text-muted">{k.label}</p>
            <p className={cn("mt-1.5 font-display text-[1.9rem] leading-none tabular", k.tone)}>{k.value}</p>
          </div>
        ))}
      </KpiStrip>

      {overdueChecks.length ? (
        <section className="glass mb-6 rounded-2xl border-danger/25">
          <header className="px-5 pt-4 pb-3">
            <Dot tone="danger" className="text-[0.92rem] font-semibold text-text">
              Care-cycle checks overdue
            </Dot>
          </header>
          <ul className="divide-y divide-white/[0.06] border-t border-white/[0.07]">
            {overdueChecks.map((v) => (
              <li key={v.id} className="flex flex-wrap items-center justify-between gap-2 px-5 py-3">
                <Link href={`/console/fleet/${v.id}`} className="text-sm font-medium decoration-white/30 underline-offset-4 hover:underline">
                  {vehicleName(v)} <span className="text-subtle">· {v.registration}</span>
                </Link>
                <span className="text-[0.78rem] text-muted">
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
            <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h2 className="font-display text-[1.4rem] font-normal">{g.title}</h2>
              <span className="text-[0.78rem] text-subtle">{g.hint}</span>
            </div>
            {g.items.length ? (
              <TableWrap>
                <table className="w-full min-w-[760px]">
                  <thead>
                    <tr>
                      <th className={th}>Due</th>
                      <th className={th}>What</th>
                      <th className={th}>Car</th>
                      <th className={th}>Client</th>
                      <th className={th}>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {g.items.map((d) => {
                      const v = lookups.vehicle.get(d.vehicleId);
                      const c = v ? lookups.client.get(v.clientId) : undefined;
                      return (
                        <tr key={d.id} className={tr}>
                          <td className={td}>
                            <span className="block tabular">{formatDate(d.dueDate)}</span>
                            <span className={cn("text-[0.75rem]", g.tone === "danger" ? "text-danger" : g.tone === "warning" ? "text-warning" : "text-subtle")}>
                              {relativeDays(d.dueDate)}
                            </span>
                          </td>
                          <td className={td}>
                            <Dot tone={g.tone} className="text-text">
                              {d.kind}
                            </Dot>
                          </td>
                          <td className={td}>
                            {v ? (
                              <Link href={`/console/fleet/${v.id}`} className="decoration-white/30 underline-offset-4 hover:underline">
                                {vehicleName(v)} <span className="text-[0.75rem] text-subtle">{v.registration}</span>
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
