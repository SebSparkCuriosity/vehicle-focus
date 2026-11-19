import Link from "next/link";
import { Lock, Users } from "lucide-react";
import { EmptyState, PageHeader, TableWrap, TierBadge, td, th } from "@/components/console/ui";
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
        eyebrow="Clients"
        title="Client book"
        description={`${rows.length} clients, ${lookups.vehicles.length} cars, ${formatGBP(mrr)} a month in demo fees.`}
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        {byTier.map((t) => (
          <div key={t.tier} className="rounded-xl border border-border bg-surface p-4">
            <div className="flex items-center justify-between">
              <TierBadge tier={t.tier} />
              <span className="text-xs text-subtle">{TIERS[t.tier].cadence}</span>
            </div>
            <p className="mt-3 font-display text-2xl font-semibold tabular">{t.count}</p>
            <p className="text-xs text-muted">
              {t.count === 1 ? "client" : "clients"} · {formatGBP(t.fees)} a month
            </p>
          </div>
        ))}
      </div>

      {rows.length ? (
        <TableWrap>
          <table className="w-full min-w-[960px]">
            <thead className="border-b border-border">
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
            <tbody className="divide-y divide-border">
              {rows.map(({ client: c, cars, value, open }) => (
                <tr key={c.id} className="transition-colors hover:bg-surface-2/60">
                  <td className={td}>
                    <Link href={`/console/clients/${c.id}`} className="group block">
                      <span className="flex items-center gap-1.5 font-medium group-hover:text-gold">
                        {c.name}
                        {c.preferences.nda ? <Lock className="size-3 text-warning" aria-label="NDA in place" /> : null}
                      </span>
                      <span className="block text-xs text-subtle">Client since {formatDate(c.clientSince, { month: "short", year: "numeric" })}</span>
                    </Link>
                  </td>
                  <td className={td}>
                    <TierBadge tier={c.tier} />
                  </td>
                  <td className={cn(td, "text-muted")}>{c.homeBase}</td>
                  <td className={cn(td, "text-right tabular")}>{cars.length}</td>
                  <td className={cn(td, "text-right tabular")}>{formatGBPCompact(value)}</td>
                  <td className={cn(td, "text-right tabular")}>{formatGBP(c.monthlyFee)}</td>
                  <td className={cn(td, "text-right tabular", open ? "text-gold" : "text-subtle")}>{open}</td>
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
