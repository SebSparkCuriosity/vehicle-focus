import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarClock,
  CircleCheck,
  CircleX,
  ClipboardCheck,
  FileText,
  Gauge,
  KeyRound,
  MapPin,
  Route,
  Sparkles,
  Truck,
  Wrench,
  Zap,
} from "lucide-react";
import { CarArt } from "@/components/brand/car-art";
import { ValueChart } from "@/components/charts";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BatteryReading, VehicleStatusBadge } from "@/components/vehicle-status";
import { DOC_TONE, EmptyState, Plate, REQUEST_ICON, SectionHeader, ValueDelta } from "@/components/garage/bits";
import { HistoryTimeline } from "@/components/garage/history-timeline";
import { TyreDiagram } from "@/components/garage/tyre-diagram";
import { getDocuments, getDueItems, getHistory, getJobs, getRequests, getVehicle } from "@/lib/data/queries";
import { REQUEST_STATUS_META, latestValue } from "@/lib/domain";
import {
  daysUntil,
  formatDate,
  formatDateTime,
  formatDayDate,
  formatGBP,
  formatMiles,
  relativeDays,
  sizeLabel,
} from "@/lib/format";
import { requireClient } from "@/lib/session";
import { cn } from "@/lib/utils";
import type { RequestType } from "@/lib/types";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const v = await getVehicle(id);
  return { title: v ? `${v.make} ${v.model}` : "Car" };
}

const ACTIONS: { type: RequestType; label: string }[] = [
  { type: "ready", label: "Have it ready" },
  { type: "relocation", label: "Move it" },
  { type: "service", label: "Book a service" },
  { type: "detailing", label: "Detailing" },
];

const POWERTRAIN_LABEL = { petrol: "Petrol", hybrid: "Hybrid", electric: "Electric" } as const;

export default async function CarPage({ params }: Props) {
  const { id } = await params;
  const { clientId } = await requireClient();
  const v = await getVehicle(id);
  if (!v || v.clientId !== clientId) notFound();

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const [history, due, docs, openRequests, jobs] = await Promise.all([
    getHistory(v.id, { clientView: true }),
    getDueItems({ vehicleId: v.id }),
    getDocuments({ vehicleId: v.id }),
    getRequests({ vehicleId: v.id, status: ["new", "scheduled", "in-progress"] }),
    getJobs({ vehicleId: v.id, from: startOfToday.toISOString() }),
  ]);

  const latestCheck = history.find((h) => h.kind === "check" && h.readings);
  const current = latestValue(v);
  const lastValuation = v.valuations.at(-1);
  const checkDays = daysUntil(v.nextCheckAt);

  return (
    <div className="space-y-10">
      <Link href="/garage" className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-text">
        <ArrowLeft className="size-4" aria-hidden />
        Collection
      </Link>

      {/* Hero */}
      <section className="grid items-center gap-8 lg:grid-cols-5">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-b from-surface-2 to-bg px-6 pt-12 pb-6 lg:col-span-3">
          <div className="absolute inset-0 spotlight" aria-hidden />
          <div className="absolute inset-0 hairline-grid opacity-60" aria-hidden />
          <CarArt
            bodyStyle={v.bodyStyle}
            paint={v.paintHex}
            title={`${v.make} ${v.model} in ${v.colour}`}
            className="relative mx-auto max-w-[560px]"
          />
        </div>

        <div className="lg:col-span-2">
          <p className="eyebrow">
            {v.year} {v.make}
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">{v.model}</h1>
          <p className="mt-1 text-muted">
            {v.variant ? `${v.variant} · ` : ""}
            {v.colour}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <VehicleStatusBadge status={v.status} />
            <Plate reg={v.registration} />
          </div>
          {v.statusNote ? <p className="mt-4 text-sm leading-relaxed text-text/90">{v.statusNote}</p> : null}

          <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-border pt-5 text-sm">
            <div className="col-span-2">
              <dt className="flex items-center gap-1.5 text-xs text-subtle">
                <MapPin className="size-3.5" aria-hidden /> Location
              </dt>
              <dd className="mt-0.5">{v.location.name}</dd>
            </div>
            <div>
              <dt className="flex items-center gap-1.5 text-xs text-subtle">
                <Gauge className="size-3.5" aria-hidden /> Mileage
              </dt>
              <dd className="mt-0.5 tabular">{formatMiles(v.mileage)}</dd>
            </div>
            <div>
              <dt className="flex items-center gap-1.5 text-xs text-subtle">
                <Zap className="size-3.5" aria-hidden /> Powertrain
              </dt>
              <dd className="mt-0.5">{POWERTRAIN_LABEL[v.powertrain]}</dd>
            </div>
          </dl>
        </div>
      </section>

      {/* Request actions */}
      <section aria-label="Request something for this car" className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {ACTIONS.map((a) => {
          const Icon = a.type === "ready" ? KeyRound : a.type === "relocation" ? Truck : a.type === "service" ? Wrench : Sparkles;
          return (
            <Link
              key={a.type}
              href={`/garage/requests/new?type=${a.type}&vehicle=${v.id}`}
              className="flex items-center gap-3 rounded-lg border border-border bg-surface-2 px-3 py-3 text-sm font-medium transition-colors hover:border-gold/50"
            >
              <span className="grid size-8 shrink-0 place-items-center rounded-md bg-gold-soft text-gold">
                <Icon className="size-4" aria-hidden />
              </span>
              {a.label}
            </Link>
          );
        })}
      </section>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main column */}
        <div className="space-y-8 lg:col-span-2">
          <Card>
            <CardHeader>
              <div>
                <p className="eyebrow mb-1.5">Latest readiness check</p>
                <CardTitle className="text-lg">
                  {latestCheck ? latestCheck.title : "Awaiting first check"}
                </CardTitle>
                {latestCheck ? (
                  <p className="mt-1 text-xs text-muted">
                    {formatDateTime(latestCheck.at)} · {latestCheck.by}
                  </p>
                ) : null}
              </div>
              <ClipboardCheck className="size-5 text-gold" aria-hidden />
            </CardHeader>
            <CardContent>
              {latestCheck?.readings ? (
                <div className="grid gap-8 md:grid-cols-[1fr_auto]">
                  <TyreDiagram current={latestCheck.readings.tyres} target={v.tyres.target} unit={v.tyres.unit} />
                  <ul className="space-y-3 text-sm md:min-w-44 md:border-l md:border-border md:pl-6">
                    <li className="flex items-center justify-between gap-4">
                      <span className="text-muted">Battery</span>
                      <BatteryReading voltage={latestCheck.readings.batteryVoltage} />
                    </li>
                    <li className="flex items-center justify-between gap-4">
                      <span className="text-muted">Odometer</span>
                      <span className="tabular">{formatMiles(latestCheck.readings.mileage)}</span>
                    </li>
                    {(
                      [
                        ["Fluids", latestCheck.readings.fluidsOk],
                        ["Exterior", latestCheck.readings.exteriorOk],
                        ["Interior", latestCheck.readings.interiorOk],
                      ] as const
                    ).map(([label, ok]) => (
                      <li key={label} className="flex items-center justify-between gap-4">
                        <span className="text-muted">{label}</span>
                        <span className={cn("inline-flex items-center gap-1.5", ok ? "text-success" : "text-warning")}>
                          {ok ? <CircleCheck className="size-4" aria-hidden /> : <CircleX className="size-4" aria-hidden />}
                          {ok ? "OK" : "Needs attention"}
                        </span>
                      </li>
                    ))}
                    <li className="flex items-center justify-between gap-4">
                      <span className="text-muted">Conditioner</span>
                      <span>{v.battery.onConditioner ? "Connected" : "Not connected"}</span>
                    </li>
                  </ul>
                </div>
              ) : (
                <p className="text-sm text-muted">Readings appear here after our first visit.</p>
              )}
              {latestCheck?.detail ? (
                <p className="mt-6 rounded-lg border border-border bg-surface-2 p-3 text-sm text-muted">{latestCheck.detail}</p>
              ) : null}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div>
                <p className="eyebrow mb-1.5">Valuation</p>
                <CardTitle className="text-lg tabular">{formatGBP(current)}</CardTitle>
                <p className="mt-1 text-xs text-muted">
                  <ValueDelta from={v.purchasePrice} to={current} className="text-xs" /> since purchase in{" "}
                  {formatDate(v.purchaseDate, { month: "long", year: "numeric" })}
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <ValueChart points={v.valuations} purchasePrice={v.purchasePrice} />
              <p className="mt-3 text-xs leading-relaxed text-subtle">
                Guidance only, not a formal valuation.
                {lastValuation ? ` Last reviewed ${formatDate(lastValuation.date)} (${lastValuation.source}).` : ""} Ask us for a formal
                report for insurance or sale.
              </p>
            </CardContent>
          </Card>

          <section>
            <SectionHeader eyebrow="Provenance record" title="Service history" />
            {history.length ? (
              <Card className="p-5">
                <HistoryTimeline events={history} />
              </Card>
            ) : (
              <EmptyState icon={Route} title="No history recorded yet" body="Every check, service and movement we carry out will be logged here." />
            )}
          </section>
        </div>

        {/* Side column */}
        <aside className="space-y-6">
          <Card className="p-5">
            <p className="eyebrow mb-1.5">Next check</p>
            <p className="font-display text-lg font-semibold">{formatDayDate(v.nextCheckAt)}</p>
            <p className={cn("mt-1 text-sm", checkDays < 0 ? "text-warning" : "text-muted")}>
              {checkDays < 0 ? `Overdue by ${Math.abs(checkDays)} days, we're arranging it` : `${relativeDays(v.nextCheckAt)}`} · checked{" "}
              {v.checkFrequency}
            </p>
            {jobs.length ? (
              <ul className="mt-4 space-y-2 border-t border-border pt-4">
                {jobs.slice(0, 3).map((j) => (
                  <li key={j.id} className="flex items-start gap-2 text-sm">
                    <CalendarClock className="mt-0.5 size-4 shrink-0 text-subtle" aria-hidden />
                    <span>
                      {j.title}
                      <span className="block text-xs text-muted">{formatDateTime(j.start)}</span>
                    </span>
                  </li>
                ))}
              </ul>
            ) : null}
          </Card>

          <Card className="p-5">
            <p className="eyebrow mb-3">Deadlines</p>
            {due.length ? (
              <ul className="space-y-3">
                {due.map((d) => {
                  const days = daysUntil(d.dueDate);
                  return (
                    <li key={d.id} className="flex items-start justify-between gap-3 text-sm">
                      <span>
                        <span className="font-medium">{d.kind}</span>
                        {d.notes ? <span className="block text-xs text-muted">{d.notes}</span> : null}
                      </span>
                      <Badge tone={days < 0 ? "warning" : days <= 30 ? "gold" : "neutral"}>
                        {days < 0 ? "Overdue" : formatDate(d.dueDate, { day: "numeric", month: "short" })}
                      </Badge>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-sm text-muted">No deadlines on file.</p>
            )}
          </Card>

          {openRequests.length ? (
            <Card className="p-5">
              <p className="eyebrow mb-3">Open requests</p>
              <ul className="space-y-3">
                {openRequests.map((r) => {
                  const Icon = REQUEST_ICON[r.type];
                  const status = REQUEST_STATUS_META[r.status];
                  return (
                    <li key={r.id} className="flex items-start gap-2.5 text-sm">
                      <Icon className="mt-0.5 size-4 shrink-0 text-subtle" aria-hidden />
                      <span className="min-w-0 flex-1">
                        {r.title}
                        <span className="block text-xs text-muted">{formatDateTime(r.when)}</span>
                      </span>
                      <Badge tone={status.tone}>{status.label}</Badge>
                    </li>
                  );
                })}
              </ul>
            </Card>
          ) : null}

          <Card className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <p className="eyebrow">Documents</p>
              <Link href="/garage/documents" className="text-xs text-muted hover:text-gold">
                Vault
              </Link>
            </div>
            {docs.length ? (
              <ul className="space-y-3">
                {docs.map((d) => (
                  <li key={d.id} className="flex items-start gap-2.5 text-sm">
                    <FileText className="mt-0.5 size-4 shrink-0 text-subtle" aria-hidden />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate">{d.title}</span>
                      <span className="block text-xs text-muted">
                        {formatDate(d.date)} · {sizeLabel(d.sizeKb)}
                      </span>
                    </span>
                    <Badge tone={DOC_TONE[d.kind]} className="hidden sm:inline-flex lg:hidden xl:inline-flex">
                      {d.kind}
                    </Badge>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted">No documents yet.</p>
            )}
          </Card>

          {v.specialistNotes ? (
            <Card className="border-gold/25 p-5">
              <p className="eyebrow mb-2">Specialist notes</p>
              <p className="text-sm leading-relaxed text-muted">{v.specialistNotes}</p>
            </Card>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
