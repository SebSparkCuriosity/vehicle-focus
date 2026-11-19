import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, ChevronLeft, FileText, History, Inbox, Lock, MapPin, ShieldCheck } from "lucide-react";
import { CarMedia } from "@/components/brand/car-art";
import { ValueChart } from "@/components/charts";
import { BatteryReading, VehicleStatusBadge } from "@/components/vehicle-status";
import { Detail, Dot, EmptyState, Panel, PanelLink, TierBadge } from "@/components/console/ui";
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
      <Link href="/console/fleet" className="no-print mb-4 inline-flex items-center gap-1 text-[0.8rem] text-muted transition-colors hover:text-text">
        <ChevronLeft className="size-3.5" /> Fleet
      </Link>

      <section className="relative isolate mb-6 h-[300px] overflow-hidden rounded-[24px] ring-1 ring-white/10 sm:h-[340px]">
        <CarMedia vehicle={v} priority sizes="(min-width: 1280px) 1300px, 100vw" className="absolute inset-0 -z-10" />
        <div className="photo-scrim absolute inset-0 -z-10" aria-hidden />
        <div className="flex h-full flex-col justify-end gap-5 p-5 sm:p-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <p className="text-[0.8rem] text-white/70">
              {v.registration} · VIN ending {v.vinLast6}
            </p>
            <h1 className="mt-1.5 font-display text-[2.1rem] leading-[1.05] font-normal text-balance sm:text-5xl">{vehicleFullName(v)}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-[0.85rem] text-white/75">
              <VehicleStatusBadge status={v.status} />
              <span>
                {v.colour} · {v.powertrain[0].toUpperCase() + v.powertrain.slice(1)} · {v.checkFrequency} checks
              </span>
            </div>
          </div>
          <dl className="glass-dark flex shrink-0 divide-x divide-white/[0.08] rounded-2xl">
            <div className="px-5 py-3">
              <dt className="text-[0.72rem] text-white/60">Latest value</dt>
              <dd className="mt-0.5 font-display text-2xl tabular">
                {formatGBP(value)}
                <span className={cn("ml-2 font-sans text-[0.75rem] tabular", trend >= 0 ? "text-success" : "text-danger")}>
                  {trend >= 0 ? "+" : ""}
                  {(trend * 100).toFixed(1)}%
                </span>
              </dd>
            </div>
            <div className="px-5 py-3">
              <dt className="text-[0.72rem] text-white/60">Mileage</dt>
              <dd className="mt-0.5 font-display text-2xl tabular">{formatMiles(v.mileage)}</dd>
            </div>
          </dl>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-3 [&>*]:min-w-0">
        <div className="space-y-6 xl:col-span-2">
          <Panel title="Live state" description={v.statusNote ?? "Within spec at the last check."}>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-4">
              <Detail label="Battery">
                <BatteryReading voltage={v.battery.voltage} />
                <span className="mt-0.5 block text-[0.75rem] text-subtle">
                  {v.battery.healthPct}% health{v.battery.onConditioner ? ", on conditioner" : ""}
                </span>
              </Detail>
              <Detail label="Location" className="col-span-2 sm:col-span-1">
                <span className="inline-flex items-start gap-1">
                  <MapPin className="mt-0.5 size-3.5 shrink-0 text-subtle" />
                  {v.location.name}
                </span>
              </Detail>
              <Detail label="Last check">{relativeDays(v.lastCheckAt)}</Detail>
              <Detail label="Next check">
                <span className={cn(overdue && "font-medium text-danger")}>{overdue ? `Overdue, ${relativeDays(v.nextCheckAt)}` : relativeDays(v.nextCheckAt)}</span>
              </Detail>
            </dl>
            <div className="mt-5">
              <p className="text-[0.75rem] text-subtle">Tyres, current against target ({v.tyres.unit})</p>
              <div className="mt-2 grid grid-cols-4 gap-2">
                {tyreKeys.map((k) => {
                  const diff = v.tyres.current[k] - v.tyres.target[k];
                  return (
                    <div
                      key={k}
                      className={cn("glass-inset rounded-xl px-2 py-2 text-center", Math.abs(diff) >= 1 && "border-warning/40 bg-warning-soft")}
                    >
                      <p className="text-[0.68rem] text-subtle">{tyreLabel[k]}</p>
                      <p className="text-sm font-medium tabular">
                        {v.tyres.current[k]}
                        <span className="text-[0.75rem] text-subtle">/{v.tyres.target[k]}</span>
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
            {reasons.length ? (
              <div className="mt-5 flex flex-wrap gap-x-4 gap-y-1.5">
                {reasons.map((r) => (
                  <Dot key={r.label} tone={r.severity === "high" ? "danger" : "warning"} className="text-white/80">
                    {r.label}
                  </Dot>
                ))}
              </div>
            ) : null}
          </Panel>

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
              <PanelLink href={`/console/clients/${client.id}`}>Profile</PanelLink>
            }
          >
            <div className="flex items-center justify-between gap-2">
              <p className="font-medium">{client.name}</p>
              <TierBadge tier={client.tier} />
            </div>
            <p className="mt-1 text-[0.78rem] text-muted">
              {client.homeBase} · prefers {client.preferences.contactPreference}
            </p>
            {client.preferences.nda ? (
              <p className="mt-3 inline-flex items-center gap-1.5 text-[0.78rem] text-warning">
                <Lock className="size-3.5" /> NDA in place. Nothing about this car leaves the arrangement.
              </p>
            ) : null}
            <p className="mt-3 text-sm text-muted">{client.preferences.notes}</p>
            {v.specialistNotes ? (
              <div className="glass-inset mt-4 rounded-xl p-3.5">
                <p className="text-[0.75rem] text-subtle">Specialist notes</p>
                <p className="mt-1 text-sm">{v.specialistNotes}</p>
              </div>
            ) : null}
          </Panel>

          <Panel title="Due dates" bodyClassName="p-0">
            {due.length ? (
              <ul className="divide-y divide-white/[0.06]">
                {due.map((d) => {
                  const days = daysUntil(d.dueDate);
                  return (
                    <li key={d.id} className="flex items-start justify-between gap-3 px-5 py-3">
                      <div>
                        <p className="text-sm font-medium">{d.kind}</p>
                        {d.notes ? <p className="mt-0.5 text-[0.78rem] text-muted">{d.notes}</p> : null}
                      </div>
                      <div className="text-right">
                        <p className="text-sm tabular">{formatDate(d.dueDate)}</p>
                        <p className={cn("text-[0.75rem]", days < 0 ? "text-danger" : days <= 14 ? "text-warning" : "text-subtle")}>{relativeDays(d.dueDate)}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="p-5">
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
              <ul className="divide-y divide-white/[0.06]">
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
              <ul className="divide-y divide-white/[0.06]">
                {documents.map((d) => (
                  <li key={d.id} className="flex items-center gap-3 px-5 py-3">
                    <FileText className="size-4 shrink-0 text-subtle" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm">{d.title}</p>
                      <p className="text-[0.75rem] text-subtle">
                        {d.kind} · {formatDate(d.date)} · {sizeLabel(d.sizeKb)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-5">
                <EmptyState icon={FileText} title="No documents yet" />
              </div>
            )}
          </Panel>
        </div>
      </div>
    </>
  );
}
