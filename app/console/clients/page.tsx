import Link from "next/link";
import { Lock, Users } from "lucide-react";
import { EmptyState, KpiStrip, PageHeader, TableWrap, TierBadge, td, th, tr } from "@/components/console/ui";
import { getLookups } from "@/components/console/lookups";
import { getRequests } from "@/lib/data/queries";
import { TIERS, latestValue } from "@/lib/domain";
import { formatDate, formatGBP, formatGBPCompact } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Tier } from "@/lib/types";

export const metadata = { title: "Clients" };

const TIER_ORDER: Tier[] = ["black-label", "platinum", "gold"];

export default async function ClientsPage() {
  const [lookups, requests] = await Promise.all([getLookups(), getRequests({ status: ["new", "scheduled", "in-progress"] })]);

  const rows = lookups.clients
    .map((c) => {
      const cars = lookups.vehicles.filter((v) => v.clientId === c.id);
      return {
        client: c,
        cars,
        value: cars.reduce((s, v) => s + latestValue(v), 0),
        open: requests.filter((r) => r.clientId === c.id).length,
      };
    })
    .sort((a, b) => TIER_ORDER.indexOf(a.client.tier) - TIER_ORDER.indexOf(b.client.tier) || b.value - a.value);

  const mrr = rows.reduce((s, r) => s + r.client.monthlyFee, 0);
  const byTier = TIER_ORDER.map((t) => ({ tier: t, count: rows.filter((r) => r.client.tier === t).length, fees: rows.filter((r) => r.client.tier === t).reduce((s, r) => s + r.client.monthlyFee, 0) }));

  return (
    <>
      <PageHeader
        title="Clients"
        description={`${rows.length} clients, ${lookups.vehicles.length} cars, ${formatGBP(mrr)} a month in demo fees.`}
      />

      <KpiStrip columns="grid-cols-1 sm:grid-cols-3" label="Clients by tier" className="mb-6">
        {byTier.map((t) => (
          <div key={t.tier} className="px-5 py-4">
            <div className="flex items-center justify-between gap-2">
              <TierBadge tier={t.tier} />
              <span className="text-xs text-subtle">{TIERS[t.tier].cadence}</span>
            </div>
            <p className="mt-3 font-display text-[1.9rem] leading-none tabular">{t.count}</p>
            <p className="mt-1.5 text-[0.75rem] text-muted">
              {t.count === 1 ? "client" : "clients"} · {formatGBP(t.fees)} a month
            </p>
          </div>
        ))}
      </KpiStrip>

      {rows.length ? (
        <TableWrap>
          <table className="w-full min-w-[960px]">
            <thead>
              <tr>
                <th className={th}>Client</th>
                <th className={th}>Tier</th>
                <th className={th}>Home base</th>
                <th className={cn(th, "text-right")}>Cars</th>
                <th className={cn(th, "text-right")}>Collection value</th>
                <th className={cn(th, "text-right")}>Monthly fee</th>
                <th className={cn(th, "text-right")}>Open requests</th>
                <th className={th}>Delegates</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ client: c, cars, value, open }) => (
                <tr key={c.id} className={tr}>
                  <td className={td}>
                    <Link href={`/console/clients/${c.id}`} className="group block">
                      <span className="flex items-center gap-1.5 font-medium decoration-white/30 underline-offset-4 group-hover:underline">
                        {c.name}
                        {c.preferences.nda ? <Lock className="size-3 text-warning" aria-label="NDA in place" /> : null}
                      </span>
                      <span className="block text-[0.75rem] text-subtle">Client since {formatDate(c.clientSince, { month: "short", year: "numeric" })}</span>
                    </Link>
                  </td>
                  <td className={td}>
                    <TierBadge tier={c.tier} />
                  </td>
                  <td className={cn(td, "text-muted")}>{c.homeBase}</td>
                  <td className={cn(td, "text-right tabular")}>{cars.length}</td>
                  <td className={cn(td, "text-right tabular")}>{formatGBPCompact(value)}</td>
                  <td className={cn(td, "text-right tabular")}>{formatGBP(c.monthlyFee)}</td>
                  <td className={cn(td, "text-right tabular", open ? "text-text" : "text-subtle")}>{open}</td>
                  <td className={cn(td, "text-muted")}>
                    {c.contacts.length ? c.contacts.map((ct) => `${ct.name} (${ct.role})`).join(", ") : <span className="text-subtle">Deals direct</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrap>
      ) : (
        <EmptyState icon={Users} title="No clients yet" description="Won leads become clients here." />
      )}
    </>
  );
}
