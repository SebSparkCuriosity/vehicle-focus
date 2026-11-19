import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, FileText, History, Inbox, Lock, MapPin, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CarArt } from "@/components/brand/car-art";
import { ValueChart } from "@/components/charts";
import { BatteryReading, VehicleStatusBadge } from "@/components/vehicle-status";
import { Detail, EmptyState, PageHeader, Panel, TierBadge } from "@/components/console/ui";
import { HistoryItem, JobRow, RequestCard } from "@/components/console/rows";
import { LogCheckForm } from "@/components/console/log-check-form";
import { RaiseRequestForm } from "@/components/console/raise-request-form";
import { toDateInput, startOfDay } from "@/components/console/dates";
import { getLookups } from "@/components/console/lookups";
import { getDocuments, getDueItems, getHistory, getJobs, getRequests, getVehicleWithClient } from "@/lib/data/queries";
import { attentionReasons, isCheckOverdue, latestValue, valueTrend, vehicleFullName } from "@/lib/domain";
import { daysUntil, formatDate, formatGBP, formatMiles, relativeDays, sizeLabel } from "@/lib/format";
import { cn } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const found = await getVehicleWithClient(id);
  return { title: found ? `${found.vehicle.make} ${found.vehicle.model}` : "Car" };
}

export default async function FleetVehiclePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const found = await getVehicleWithClient(id);
  if (!found) notFound();
  const { vehicle: v, client } = found;

  const [history, due, documents, requests, jobs, lookups] = await Promise.all([
    getHistory(v.id),
    getDueItems({ vehicleId: v.id }),
    getDocuments({ vehicleId: v.id }),
    getRequests({ vehicleId: v.id }),
    getJobs({ vehicleId: v.id, from: startOfDay(0).toISOString() }),
    getLookups(),
  ]);

  const openRequests = requests.filter((r) => r.status !== "done" && r.status !== "cancelled");
  const reasons = attentionReasons(v, due);
  const value = latestValue(v);
  const trend = valueTrend(v);
  const spend = history.reduce((s, h) => s + (h.cost ?? 0), 0);
  const overdue = isCheckOverdue(v);
  const tyreKeys = ["fl", "fr", "rl", "rr"] as const;
  const tyreLabel = { fl: "FL", fr: "FR", rl: "RL", rr: "RR" };
  const internalCount = history.filter((h) => !h.visibleToClient).length;

  return (
    <>
      <PageHeader
        back={{ href: "/console/fleet", label: "Fleet" }}
        eyebrow={`${v.registration} · VIN ending ${v.vinLast6}`}
        title={vehicleFullName(v)}
        description={
          <span className="flex flex-wrap items-center gap-2">
            <VehicleStatusBadge status={v.status} />
            <span>
              {v.colour} · {v.powertrain[0].toUpperCase() + v.powertrain.slice(1)} · {v.checkFrequency} checks
            </span>
          </span>
        }
      />

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <section className="overflow-hidden rounded-xl border border-border bg-surface">
            <div className="grid gap-0 md:grid-cols-5">
              <div className="relative flex items-center justify-center bg-surface-2/60 p-6 md:col-span-2 spotlight">
                <CarArt bodyStyle={v.bodyStyle} paint={v.paintHex} title={vehicleFullName(v)} className="max-w-sm" />
              </div>
              <div className="p-5 md:col-span-3">
                <p className="eyebrow">Live state</p>
                {v.statusNote ? <p className="mt-2 text-sm">{v.statusNote}</p> : null}
                <dl className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
                  <Detail label="Battery">
                    <BatteryReading voltage={v.battery.voltage} />
                    <span className="mt-0.5 block text-xs text-subtle">
                      {v.battery.healthPct}% health{v.battery.onConditioner ? ", on conditioner" : ""}
                    </span>
                  </Detail>
                  <Detail label="Mileage">
                    <span className="tabular">{formatMiles(v.mileage)}</span>
                  </Detail>
                  <Detail label="Location">
                    <span className="inline-flex items-start gap-1">
                      <MapPin className="mt-0.5 size-3.5 shrink-0 text-subtle" />
                      {v.location.name}
                    </span>
                  </Detail>
                  <Detail label="Last check">{relativeDays(v.lastCheckAt)}</Detail>
                  <Detail label="Next check">
                    <span className={cn(overdue && "font-medium text-danger")}>{overdue ? `Overdue, ${relativeDays(v.nextCheckAt)}` : relativeDays(v.nextCheckAt)}</span>
                  </Detail>
                  <Detail label="Value">
                    <span className="tabular">{formatGBP(value)}</span>
                    <span className={cn("ml-1.5 text-xs tabular", trend >= 0 ? "text-success" : "text-danger")}>
                      {trend >= 0 ? "+" : ""}
                      {(trend * 100).toFixed(1)}%
                    </span>
                  </Detail>
                </dl>
                <div className="mt-4">
                  <p className="text-xs text-subtle">Tyres, current against target ({v.tyres.unit})</p>
                  <div className="mt-1.5 grid grid-cols-4 gap-2">
                    {tyreKeys.map((k) => {
                      const diff = v.tyres.current[k] - v.tyres.target[k];
                      return (
                        <div key={k} className={cn("rounded-md border px-2 py-1.5 text-center", Math.abs(diff) >= 1 ? "border-warning/40 bg-warning-soft" : "border-border bg-surface-2")}>
                          <p className="text-[0.65rem] text-subtle">{tyreLabel[k]}</p>
                          <p className="text-sm font-medium tabular">
                            {v.tyres.current[k]}
                            <span className="text-xs text-subtle">/{v.tyres.target[k]}</span>
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
                {reasons.length ? (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {reasons.map((r) => (
                      <Badge key={r.label} tone={r.severity === "high" ? "danger" : "warning"}>
                        {r.label}
                      </Badge>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </section>

          <Panel title="Log a check" description="Updates the car's live state, flags anything out of spec and adds an entry to the history.">
            <LogCheckForm vehicleId={v.id} target={v.tyres.target} unit={v.tyres.unit} mileage={v.mileage} onConditioner={v.battery.onConditioner} />
          </Panel>

          <Panel
            title="History"
            description={`${history.length} entries${internalCount ? `, ${internalCount} internal and hidden from the client` : ""}. Total recorded spend ${formatGBP(spend)}.`}
          >
            {history.length ? (
              <ul>
                {history.map((h) => (
                  <HistoryItem key={h.id} event={h} />
                ))}
              </ul>
            ) : (
              <EmptyState icon={History} title="No history yet" description="Log the first check to start the record." />
            )}
          </Panel>

          <Panel title="Valuation" description={`Purchased for ${formatGBP(v.purchasePrice)} on ${formatDate(v.purchaseDate)}. Latest source: ${v.valuations.at(-1)?.source ?? "none"}.`}>
            <ValueChart points={v.valuations} purchasePrice={v.purchasePrice} />
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel
            title="Owner"
            action={
              <Link href={`/console/clients/${client.id}`} className="text-xs text-muted hover:text-gold">
                Profile
              </Link>
            }
          >
            <div className="flex items-center justify-between gap-2">
              <p className="font-medium">{client.name}</p>
              <TierBadge tier={client.tier} />
            </div>
            <p className="mt-1 text-xs text-muted">
              {client.homeBase} · prefers {client.preferences.contactPreference}
            </p>
            {client.preferences.nda ? (
              <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-warning">
                <Lock className="size-3.5" /> NDA in place. Nothing about this car leaves the arrangement.
              </p>
            ) : null}
            <p className="mt-3 text-sm text-muted">{client.preferences.notes}</p>
            {v.specialistNotes ? (
              <div className="mt-4 rounded-lg border border-border bg-surface-2 p-3">
                <p className="text-xs text-subtle">Specialist notes</p>
                <p className="mt-1 text-sm">{v.specialistNotes}</p>
              </div>
            ) : null}
          </Panel>

          <Panel title="Due dates" bodyClassName="p-0">
            {due.length ? (
              <ul className="divide-y divide-border">
                {due.map((d) => {
                  const days = daysUntil(d.dueDate);
                  return (
                    <li key={d.id} className="flex items-start justify-between gap-3 px-4 py-3">
                      <div>
                        <p className="text-sm font-medium">{d.kind}</p>
                        {d.notes ? <p className="mt-0.5 text-xs text-muted">{d.notes}</p> : null}
                      </div>
                      <div className="text-right">
                        <p className="text-sm tabular">{formatDate(d.dueDate)}</p>
                        <p className={cn("text-xs", days < 0 ? "text-danger" : days <= 14 ? "text-warning" : "text-subtle")}>{relativeDays(d.dueDate)}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="p-4">
                <EmptyState icon={ShieldCheck} title="No deadlines recorded" description="Add MOT, insurance and registration dates to track them." />
              </div>
            )}
          </Panel>

          <Panel title="Open requests" bodyClassName="space-y-2.5">
            {openRequests.length ? (
              openRequests.map((r) => (
                <RequestCard
                  key={r.id}
                  request={r}
                  compact
                  vehicle={v}
                  client={client}
                  assignee={r.assigneeId ? lookups.member.get(r.assigneeId) : undefined}
                />
              ))
            ) : (
              <EmptyState icon={Inbox} title="No open requests" />
            )}
          </Panel>

          <Panel title="Upcoming jobs" bodyClassName="py-1">
            {jobs.length ? (
              <ul className="divide-y divide-border">
                {jobs.map((j) => (
                  <JobRow key={j.id} job={j} vehicle={v} client={client} member={lookups.member.get(j.assigneeId)} />
                ))}
              </ul>
            ) : (
              <div className="py-3">
                <EmptyState icon={CalendarDays} title="Nothing scheduled" />
              </div>
            )}
          </Panel>

          <Panel title="Raise a request on the client's behalf" description="For requests that come in by phone or WhatsApp, so everything stays on record.">
            <RaiseRequestForm vehicleId={v.id} defaultLocation={v.location.name} defaultDate={toDateInput(startOfDay(1).toISOString())} />
          </Panel>

          <Panel title="Documents" description={`${documents.length} in the vault`} bodyClassName="p-0">
            {documents.length ? (
              <ul className="divide-y divide-border">
                {documents.map((d) => (
                  <li key={d.id} className="flex items-center gap-3 px-4 py-2.5">
                    <FileText className="size-4 shrink-0 text-subtle" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm">{d.title}</p>
                      <p className="text-xs text-subtle">
                        {d.kind} · {formatDate(d.date)} · {sizeLabel(d.sizeKb)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-4">
                <EmptyState icon={FileText} title="No documents yet" />
              </div>
            )}
          </Panel>
        </div>
      </div>
    </>
  );
}
