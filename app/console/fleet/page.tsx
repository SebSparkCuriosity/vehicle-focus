import Link from "next/link";
import { Car, ChevronDown, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/form";
import { CarMedia } from "@/components/brand/car-art";
import { BatteryReading, VehicleStatusBadge } from "@/components/vehicle-status";
import { Dot, EmptyState, MobileList, MobileRow, PageHeader, TableWrap, td, th, tr } from "@/components/console/ui";
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
        title="Fleet"
        description={`${rows.length} of ${lookups.vehicles.length} cars shown, worth about ${formatGBPCompact(totalValue)} on latest valuations.`}
      />

      <div className="-mx-4 mb-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:px-6 md:mx-0 md:flex-wrap md:overflow-visible md:px-0 md:pb-0" aria-label="Quick status filters">
        <Link
          href="/console/fleet"
          className={cn(
            "inline-flex min-h-11 shrink-0 items-center rounded-full border px-4 text-[0.85rem] transition-colors md:min-h-0 md:px-3.5 md:py-1.5 md:text-[0.78rem]",
            !filtered ? "border-white/25 bg-white/[0.1] text-text" : "border-white/10 text-muted hover:border-white/20 hover:text-text",
          )}
        >
          All <span className="ml-0.5 text-subtle tabular">{lookups.vehicles.length}</span>
        </Link>
        {(Object.keys(STATUS_META) as VehicleStatus[]).map((s) => (
          <Link
            key={s}
            href={`/console/fleet?status=${s}`}
            className={cn(
              "inline-flex min-h-11 shrink-0 items-center rounded-full border px-4 text-[0.85rem] transition-colors md:min-h-0 md:px-3.5 md:py-1.5 md:text-[0.78rem]",
              status === s ? "border-white/25 bg-white/[0.1] text-text" : "border-white/10 text-muted hover:border-white/20 hover:text-text",
            )}
          >
            {STATUS_META[s].label} <span className="ml-0.5 text-subtle tabular">{counts[s]}</span>
          </Link>
        ))}
      </div>

      <details className="glass group/filters mb-5 rounded-2xl md:hidden" open={filtered}>
        <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-2 px-4 text-[0.9rem] text-muted [&::-webkit-details-marker]:hidden">
          <span className="inline-flex items-center gap-2">
            <Filter className="size-4" /> {filtered ? "Filters applied" : "Filter by client or location"}
          </span>
          <ChevronDown className="size-4 transition-transform group-open/filters:rotate-180" />
        </summary>
        <FleetFilters status={status} clientId={clientId} loc={loc} clients={lookups.clients} filtered={filtered} idPrefix="m-" />
      </details>
      <div className="glass mb-5 hidden rounded-2xl md:block">
        <FleetFilters status={status} clientId={clientId} loc={loc} clients={lookups.clients} filtered={filtered} idPrefix="" />
      </div>

      {rows.length ? (
        <>
        <MobileList label="Fleet">
          {rows.map((v) => {
            const overdue = isCheckOverdue(v);
            return (
              <MobileRow
                key={v.id}
                href={`/console/fleet/${v.id}`}
                media={<CarMedia vehicle={v} sizes="64px" className="h-12 w-16 shrink-0 rounded-lg ring-1 ring-white/10" />}
                title={vehicleName(v)}
                meta={`${v.registration} · ${lookups.client.get(v.clientId)?.name ?? ""}`}
                footer={
                  <>
                    <Dot tone={STATUS_META[v.status].tone} className="text-[0.82rem] text-white/80">
                      {STATUS_META[v.status].label}
                    </Dot>
                    <BatteryReading voltage={v.battery.voltage} />
                    <span className={overdue ? "font-medium text-danger" : "text-subtle"}>
                      {overdue ? `Check overdue` : `Check ${relativeDays(v.nextCheckAt)}`}
                    </span>
                  </>
                }
              />
            );
          })}
        </MobileList>
        <TableWrap className="hidden md:block">
          <table className="w-full min-w-[1040px]">
            <thead>
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
            <tbody>
              {rows.map((v) => {
                const client = lookups.client.get(v.clientId);
                const overdue = isCheckOverdue(v);
                const off = tyreDeviation(v);
                return (
                  <tr key={v.id} className={tr}>
                    <td className={td}>
                      <Link href={`/console/fleet/${v.id}`} className="group flex items-center gap-3">
                        <CarMedia vehicle={v} sizes="56px" className="h-10 w-14 shrink-0 rounded-lg ring-1 ring-white/10" />
                        <span>
                          <span className="block font-medium decoration-white/30 underline-offset-4 group-hover:underline">{vehicleName(v)}</span>
                          <span className="block text-[0.75rem] text-subtle">
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
                      {off >= 1 ? <span className="text-warning">{off} psi off</span> : <span className="text-muted">On target</span>}
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
        </>
      ) : (
        <EmptyState icon={Car} title="No cars match those filters" description="Clear the filters to see the whole fleet." />
      )}
    </>
  );
}

function FleetFilters({
  status,
  clientId,
  loc,
  clients,
  filtered,
  idPrefix,
}: {
  status?: VehicleStatus;
  clientId?: string;
  loc?: LocationKind;
  clients: { id: string; name: string }[];
  filtered: boolean;
  idPrefix: string;
}) {
  return (
    <form method="get" className="grid gap-3 p-4 sm:grid-cols-2 md:flex md:flex-wrap md:items-end">
      <div className="md:min-w-40">
        <label htmlFor={`${idPrefix}status`} className="mb-1.5 block text-[0.8rem] text-subtle md:text-[0.75rem]">
          Status
        </label>
        <Select id={`${idPrefix}status`} name="status" defaultValue={status ?? ""}>
          <option value="">Any status</option>
          {(Object.keys(STATUS_META) as VehicleStatus[]).map((s) => (
            <option key={s} value={s}>
              {STATUS_META[s].label}
            </option>
          ))}
        </Select>
      </div>
      <div className="md:min-w-40">
        <label htmlFor={`${idPrefix}client`} className="mb-1.5 block text-[0.8rem] text-subtle md:text-[0.75rem]">
          Client
        </label>
        <Select id={`${idPrefix}client`} name="client" defaultValue={clientId ?? ""}>
          <option value="">All clients</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>
      </div>
      <div className="md:min-w-40">
        <label htmlFor={`${idPrefix}loc`} className="mb-1.5 block text-[0.8rem] text-subtle md:text-[0.75rem]">
          Location
        </label>
        <Select id={`${idPrefix}loc`} name="loc" defaultValue={loc ?? ""}>
          <option value="">Anywhere</option>
          {(Object.keys(LOCATION_LABEL) as LocationKind[]).map((k) => (
            <option key={k} value={k}>
              {LOCATION_LABEL[k]}
            </option>
          ))}
        </Select>
      </div>
      <div className="flex items-center gap-2 sm:col-span-2 md:col-span-1">
        <Button type="submit" variant="secondary" className="flex-1 backdrop-blur-none md:flex-none">
          <Filter /> Apply
        </Button>
        {filtered ? (
          <Link
            href="/console/fleet"
            className="inline-flex min-h-11 items-center px-3 text-[0.85rem] text-muted underline-offset-4 hover:text-text hover:underline md:min-h-0 md:text-[0.8rem]"
          >
            Clear
          </Link>
        ) : null}
      </div>
    </form>
  );
}
