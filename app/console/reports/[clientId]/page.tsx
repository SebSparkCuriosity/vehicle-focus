import { notFound } from "next/navigation";
import { CarMedia } from "@/components/brand/car-art";
import { Logo } from "@/components/brand/logo";
import { BatteryReading, VehicleStatusBadge } from "@/components/vehicle-status";
import { PageHeader, TierBadge } from "@/components/console/ui";
import { PrintButton } from "@/components/console/print-button";
import { getClient, getDueItems, getHistory, getRequests, getVehicles } from "@/lib/data/queries";
import { REQUEST_STATUS_META, REQUEST_TYPE_META, TIERS, latestValue, tyreDeviation, valueTrend, vehicleFullName, vehicleName } from "@/lib/domain";
import { formatDate, formatGBP, formatGBPCompact, formatMiles, relativeDays } from "@/lib/format";
import { cn } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await params;
  const c = await getClient(clientId);
  return { title: c ? `Report, ${c.name}` : "Report" };
}

const PERIOD_DAYS = 30;

export default async function ClientReportPage({ params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await params;
  const client = await getClient(clientId);
  if (!client) notFound();

  const now = new Date();
  const periodStart = new Date(now.getTime() - PERIOD_DAYS * 86_400_000).toISOString();
  const [vehicles, due, requests] = await Promise.all([getVehicles({ clientId }), getDueItems({ clientId, withinDays: 90 }), getRequests({ clientId })]);
  const histories = await Promise.all(vehicles.map((v) => getHistory(v.id, { clientView: true })));

  const cars = vehicles.map((v, i) => {
    const inPeriod = histories[i].filter((h) => h.at >= periodStart);
    const lastCheck = histories[i].find((h) => h.kind === "check" && h.readings);
    return {
      v,
      checks: inPeriod.filter((h) => h.kind === "check"),
      work: inPeriod.filter((h) => h.kind !== "check"),
      cost: inPeriod.reduce((s, h) => s + (h.cost ?? 0), 0),
      lastCheck,
    };
  });

  const totalValue = vehicles.reduce((s, v) => s + latestValue(v), 0);
  const totalPaid = vehicles.reduce((s, v) => s + v.purchasePrice, 0);
  const totalChecks = cars.reduce((s, c) => s + c.checks.length, 0);
  const totalCost = cars.reduce((s, c) => s + c.cost, 0);
  const handled = requests.filter((r) => r.createdAt >= periodStart || (r.when >= periodStart && r.when <= now.toISOString()));
  const month = formatDate(now.toISOString(), { month: "long", year: "numeric" });

  return (
    <>
      <div className="no-print">
        <PageHeader
          back={{ href: "/console/reports", label: "Reports" }}
          title={`${client.name}, ${formatDate(new Date().toISOString(), { month: "long" })}`}
          description="Exactly what the client receives. Internal notes are left out."
          actions={<PrintButton />}
        />
      </div>

      <article className="glass mx-auto max-w-4xl space-y-10 rounded-[24px] p-6 sm:p-12 print:max-w-none print:rounded-none print:border-0 print:p-0">
        <header className="border-b border-border pb-8">
          <div className="flex items-start justify-between gap-4">
            <Logo href="/console" />
            <p className="text-right text-[0.75rem] text-subtle">
              Private and confidential
              {client.preferences.nda ? <span className="block">Covered by NDA</span> : null}
            </p>
          </div>
          <p className="eyebrow mt-10">Collection report · {month}</p>
          <h2 className="mt-3 font-display text-4xl font-normal sm:text-5xl">{client.name}</h2>
          <p className="mt-2 text-sm text-muted">
            {formatDate(periodStart)} to {formatDate(now.toISOString())} · <TierBadge tier={client.tier} /> {TIERS[client.tier].cadence.toLowerCase()}
          </p>
        </header>

        <section>
          <h3 className="font-display text-[1.45rem] font-normal">Summary</h3>
          <p className="mt-2 text-sm text-muted">
            {vehicles.length === 0
              ? "No cars are currently on the account."
              : `${vehicles.length} ${vehicles.length === 1 ? "car" : "cars"} under care. ${totalChecks} ${totalChecks === 1 ? "check" : "checks"} carried out this period and ${
                  cars.filter((c) => c.v.status === "ready").length
                } ready to drive today. ${cars.some((c) => c.v.status === "attention") ? "One or more cars need a decision from you, detailed below." : "Nothing needs a decision from you."}`}
          </p>
          <dl className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: "Collection value", value: formatGBPCompact(totalValue) },
              { label: "Against purchase", value: `${totalValue - totalPaid >= 0 ? "+" : ""}${formatGBPCompact(totalValue - totalPaid)}` },
              { label: "Checks this period", value: String(totalChecks) },
              { label: "Recorded spend", value: formatGBP(totalCost) },
            ].map((k) => (
              <div key={k.label} className="rounded-xl border border-border bg-surface-2 p-4">
                <dt className="text-[0.75rem] text-subtle">{k.label}</dt>
                <dd className="mt-1.5 font-display text-2xl tabular">{k.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section>
          <h3 className="font-display text-[1.45rem] font-normal">Car by car</h3>
          <div className="mt-4 space-y-4">
            {cars.map(({ v, checks, work, cost, lastCheck }) => {
              const trend = valueTrend(v);
              return (
                <div key={v.id} className="break-inside-avoid rounded-xl border border-border p-4">
                  <div className="flex flex-col gap-4 sm:flex-row">
                    <CarMedia vehicle={v} sizes="(min-width: 640px) 176px, 100vw" className="aspect-[16/10] w-full shrink-0 rounded-lg sm:w-44" />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <p className="font-medium">{vehicleFullName(v)}</p>
                          <p className="text-[0.75rem] text-subtle">
                            {v.registration} · {v.colour} · {formatMiles(v.mileage)}
                          </p>
                        </div>
                        <VehicleStatusBadge status={v.status} />
                      </div>
                      {v.statusNote ? <p className="mt-2 text-sm text-muted">{v.statusNote}</p> : null}
                      <dl className="mt-3 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                        <div>
                          <dt className="text-[0.75rem] text-subtle">Battery</dt>
                          <dd>
                            <BatteryReading voltage={v.battery.voltage} />
                          </dd>
                        </div>
                        <div>
                          <dt className="text-[0.75rem] text-subtle">Tyres</dt>
                          <dd className={tyreDeviation(v) >= 1 ? "text-warning" : undefined}>{tyreDeviation(v) >= 1 ? "Adjust" : "On target"}</dd>
                        </div>
                        <div>
                          <dt className="text-[0.75rem] text-subtle">Checks</dt>
                          <dd className="tabular">
                            {checks.length} this period
                            {lastCheck ? <span className="block text-[0.75rem] text-subtle">last {relativeDays(lastCheck.at)}</span> : null}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-[0.75rem] text-subtle">Value</dt>
                          <dd className="tabular">
                            {formatGBPCompact(latestValue(v))}
                            <span className={cn("ml-1 text-xs", trend >= 0 ? "text-success" : "text-danger")}>
                              {trend >= 0 ? "+" : ""}
                              {(trend * 100).toFixed(1)}%
                            </span>
                          </dd>
                        </div>
                      </dl>
                      <div className="mt-3 border-t border-border pt-3">
                        <p className="text-[0.75rem] text-subtle">Work completed{cost ? `, ${formatGBP(cost)}` : ""}</p>
                        {work.length ? (
                          <ul className="mt-1 space-y-1">
                            {work.map((w) => (
                              <li key={w.id} className="text-sm">
                                <span className="text-subtle tabular">{formatDate(w.at, { day: "numeric", month: "short" })}</span> {w.title}
                                {w.cost ? <span className="text-subtle"> · {formatGBP(w.cost)}</span> : null}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="mt-1 text-sm text-muted">Routine care only.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            {cars.length === 0 ? <p className="text-sm text-muted">No cars to report on.</p> : null}
          </div>
        </section>

        <section className="grid gap-8 sm:grid-cols-2">
          <div className="break-inside-avoid">
            <h3 className="font-display text-[1.45rem] font-normal">Coming up</h3>
            <p className="text-[0.75rem] text-subtle">Next 90 days. We handle these, nothing for you to do unless we ask.</p>
            {due.length ? (
              <ul className="mt-3 divide-y divide-border">
                {due.map((d) => {
                  const v = vehicles.find((x) => x.id === d.vehicleId);
                  return (
                    <li key={d.id} className="flex items-start justify-between gap-3 py-2">
                      <div>
                        <p className="text-sm">
                          {d.kind}, {v ? vehicleName(v) : ""}
                        </p>
                        {d.notes ? <p className="text-[0.75rem] text-subtle">{d.notes}</p> : null}
                      </div>
                      <p className="shrink-0 text-sm tabular text-muted">{formatDate(d.dueDate, { day: "numeric", month: "short" })}</p>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-muted">Nothing due in the next 90 days.</p>
            )}
          </div>
          <div className="break-inside-avoid">
            <h3 className="font-display text-[1.45rem] font-normal">Requests handled</h3>
            <p className="text-[0.75rem] text-subtle">Raised by you or your team this period.</p>
            {handled.length ? (
              <ul className="mt-3 divide-y divide-border">
                {handled.map((r) => {
                  const v = vehicles.find((x) => x.id === r.vehicleId);
                  return (
                    <li key={r.id} className="flex items-start justify-between gap-3 py-2">
                      <div>
                        <p className="text-sm">{r.title}</p>
                        <p className="text-[0.75rem] text-subtle">
                          {REQUEST_TYPE_META[r.type].label} · {v ? vehicleName(v) : ""} · {r.createdBy}
                        </p>
                      </div>
                      <p className="shrink-0 text-xs text-muted">{REQUEST_STATUS_META[r.status].label}</p>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-muted">No requests this period.</p>
            )}
          </div>
        </section>

        <footer className="border-t border-border pt-6 text-[0.75rem] text-subtle">
          Prepared by Vehicle Focus Automotive Concierge. Questions about anything in this report: reply in The Garage or call +44 7797 738888.
        </footer>
      </article>
    </>
  );
}
