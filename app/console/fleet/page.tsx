import Link from "next/link";
import { Car, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/form";
import { CarArt } from "@/components/brand/car-art";
import { BatteryReading, VehicleStatusBadge } from "@/components/vehicle-status";
import { EmptyState, PageHeader, TableWrap, td, th } from "@/components/console/ui";
import { getLookups } from "@/components/console/lookups";
import { STATUS_META, isCheckOverdue, latestValue, tyreDeviation, vehicleName } from "@/lib/domain";
import { formatGBPCompact, relativeDays } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { LocationKind, VehicleStatus } from "@/lib/types";

export const metadata = { title: "Fleet" };

const LOCATION_LABEL: Record<LocationKind, string> = {
  "client-home": "Client residence",
  "vf-storage": "Vehicle Focus storage",
  specialist: "With a specialist",
  "in-transit": "In transit",
  airport: "Airport",
};

export default async function FleetPage({ searchParams }: { searchParams: Promise<{ status?: string; client?: string; loc?: string }> }) {
  const sp = await searchParams;
  const lookups = await getLookups();

  const status = sp.status && sp.status in STATUS_META ? (sp.status as VehicleStatus) : undefined;
  const loc = sp.loc && sp.loc in LOCATION_LABEL ? (sp.loc as LocationKind) : undefined;
  const clientId = sp.client && lookups.client.has(sp.client) ? sp.client : undefined;

  const rows = lookups.vehicles
    .filter((v) => (!status || v.status === status) && (!loc || v.location.kind === loc) && (!clientId || v.clientId === clientId))
    .sort((a, b) => {
      // Attention first, then soonest next check
      const rank = (s: VehicleStatus) => (s === "attention" ? 0 : 1);
      return rank(a.status) - rank(b.status) || a.nextCheckAt.localeCompare(b.nextCheckAt);
    });

  const totalValue = rows.reduce((s, v) => s + latestValue(v), 0);
  const counts = Object.fromEntries(
    (Object.keys(STATUS_META) as VehicleStatus[]).map((s) => [s, lookups.vehicles.filter((v) => v.status === s).length]),
  ) as Record<VehicleStatus, number>;
  const filtered = Boolean(status || loc || clientId);

  return (
    <>
      <PageHeader
        eyebrow="Fleet"
        title="Every car under care"
        description={`${rows.length} of ${lookups.vehicles.length} cars shown, worth about ${formatGBPCompact(totalValue)} on latest valuations.`}
      />

      <div className="mb-4 flex flex-wrap gap-2" aria-label="Quick status filters">
        <Link
          href="/console/fleet"
          className={cn("rounded-full border px-3 py-1 text-xs transition-colors", !filtered ? "border-gold/50 bg-gold-soft text-gold" : "border-border text-muted hover:text-text")}
        >
          All <span className="tabular">{lookups.vehicles.length}</span>
        </Link>
        {(Object.keys(STATUS_META) as VehicleStatus[]).map((s) => (
          <Link
            key={s}
            href={`/console/fleet?status=${s}`}
            className={cn(
              "rounded-full border px-3 py-1 text-xs transition-colors",
              status === s ? "border-gold/50 bg-gold-soft text-gold" : "border-border text-muted hover:text-text",
            )}
          >
            {STATUS_META[s].label} <span className="tabular">{counts[s]}</span>
          </Link>
        ))}
      </div>

      <form method="get" className="mb-4 flex flex-wrap items-end gap-2 rounded-xl border border-border bg-surface p-3">
        <div className="min-w-40 flex-1 sm:flex-none">
          <label htmlFor="status" className="mb-1 block text-xs text-subtle">
            Status
          </label>
          <Select id="status" name="status" defaultValue={status ?? ""}>
            <option value="">Any status</option>
            {(Object.keys(STATUS_META) as VehicleStatus[]).map((s) => (
              <option key={s} value={s}>
                {STATUS_META[s].label}
              </option>
            ))}
          </Select>
        </div>
        <div className="min-w-40 flex-1 sm:flex-none">
          <label htmlFor="client" className="mb-1 block text-xs text-subtle">
            Client
          </label>
          <Select id="client" name="client" defaultValue={clientId ?? ""}>
            <option value="">All clients</option>
            {lookups.clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </div>
        <div className="min-w-40 flex-1 sm:flex-none">
          <label htmlFor="loc" className="mb-1 block text-xs text-subtle">
            Location
          </label>
          <Select id="loc" name="loc" defaultValue={loc ?? ""}>
            <option value="">Anywhere</option>
            {(Object.keys(LOCATION_LABEL) as LocationKind[]).map((k) => (
              <option key={k} value={k}>
                {LOCATION_LABEL[k]}
              </option>
            ))}
          </Select>
        </div>
        <Button type="submit" variant="secondary">
          <Filter /> Apply
        </Button>
        {filtered ? (
          <Link href="/console/fleet" className="px-2 py-2 text-xs text-muted hover:text-text">
            Clear
          </Link>
        ) : null}
      </form>

      {rows.length ? (
        <TableWrap>
          <table className="w-full min-w-[1040px]">
            <thead className="border-b border-border">
              <tr>
                <th className={th}>Car</th>
                <th className={th}>Client</th>
                <th className={th}>Status</th>
                <th className={th}>Location</th>
                <th className={th}>Battery</th>
                <th className={th}>Tyres</th>
                <th className={th}>Last check</th>
                <th className={th}>Next check</th>
                <th className={cn(th, "text-right")}>Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((v) => {
                const client = lookups.client.get(v.clientId);
                const overdue = isCheckOverdue(v);
                const off = tyreDeviation(v);
                return (
                  <tr key={v.id} className="transition-colors hover:bg-surface-2/60">
                    <td className={td}>
                      <Link href={`/console/fleet/${v.id}`} className="group flex items-center gap-3">
                        <span className="w-16 shrink-0">
                          <CarArt bodyStyle={v.bodyStyle} paint={v.paintHex} title={vehicleName(v)} />
                        </span>
                        <span>
                          <span className="block font-medium group-hover:text-gold">{vehicleName(v)}</span>
                          <span className="block text-xs text-subtle">
                            {v.year} · {v.registration}
                          </span>
                        </span>
                      </Link>
                    </td>
                    <td className={td}>
                      <Link href={`/console/clients/${v.clientId}`} className="text-muted hover:text-text">
                        {client?.name}
                      </Link>
                    </td>
                    <td className={td}>
                      <VehicleStatusBadge status={v.status} />
                    </td>
                    <td className={cn(td, "max-w-56 truncate text-muted")} title={v.location.name}>
                      {v.location.name}
                    </td>
                    <td className={td}>
                      <BatteryReading voltage={v.battery.voltage} />
                    </td>
                    <td className={td}>
                      {off >= 1 ? <span className="text-warning">{off} psi off</span> : <span className="text-success">On target</span>}
                    </td>
                    <td className={cn(td, "text-muted")}>{relativeDays(v.lastCheckAt)}</td>
                    <td className={cn(td, overdue ? "font-medium text-danger" : "text-muted")}>
                      {overdue ? `Overdue, ${relativeDays(v.nextCheckAt)}` : relativeDays(v.nextCheckAt)}
                    </td>
                    <td className={cn(td, "text-right tabular")}>{formatGBPCompact(latestValue(v))}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </TableWrap>
      ) : (
        <EmptyState icon={Car} title="No cars match those filters" description="Clear the filters to see the whole fleet." />
      )}
    </>
  );
}
