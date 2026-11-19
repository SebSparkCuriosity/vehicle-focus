import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CircleCheck, CircleX, FileText, Route } from "lucide-react";
import { CarMedia } from "@/components/brand/car-art";
import { ValueChart } from "@/components/charts";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BatteryReading, VehicleStatusBadge } from "@/components/vehicle-status";
import { EmptyState, PaintLabel, PaneTitle, Plate, SectionHeader, SectionLink, StatusText, ValueDelta } from "@/components/garage/bits";
import { HistoryTimeline } from "@/components/garage/history-timeline";
import { TyreDiagram } from "@/components/garage/tyre-diagram";
import { getDocuments, getDueItems, getHistory, getJobs, getRequests, getVehicle } from "@/lib/data/queries";
import { REQUEST_STATUS_META, latestValue } from "@/lib/domain";
import { daysUntil, formatDate, formatDateTime, formatDayDate, formatGBP, formatMiles, relativeDays, sizeLabel } from "@/lib/format";
import { requireClient } from "@/lib/session";
import { cn } from "@/lib/utils";
import type { RequestType } from "@/lib/types";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const { clientId } = await requireClient();
  const v = await getVehicle(id);
  // Never reveal another client's car, even in the tab title
  return { title: v && v.clientId === clientId ? `${v.make} ${v.model}` : "Car" };
}

const ACTIONS: { type: RequestType; label: string }[] = [
  { type: "ready", label: "Have it ready" },
  { type: "relocation", label: "Move it" },
  { type: "service", label: "Book a service" },
  { type: "detailing", label: "Detailing" },
];

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
      <Link
        href="/garage"
        className="glass-dark inline-flex h-11 items-center gap-1.5 rounded-full px-4 text-[0.9rem] text-white/75 transition-colors hover:text-white md:h-10 md:text-[0.85rem]"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Collection
      </Link>

      {/* Hero: the car, full width, with the facts in a glass strip overlapping its lower edge */}
      <section>
        <div className="relative h-[58svh] max-h-[640px] min-h-[380px] overflow-hidden rounded-[28px] border border-white/10 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.9)] md:h-[68vh] md:min-h-[440px]">
          <CarMedia vehicle={v} priority sizes="(min-width: 1152px) 1152px, 100vw" className="absolute inset-0" />
          <div className="photo-scrim absolute inset-0" aria-hidden />
          <PaintLabel vehicle={v} className="top-[22%] text-3xl sm:text-4xl" />

          <div className="absolute inset-x-4 top-4 flex items-start justify-between gap-2 sm:inset-x-6 sm:top-6">
            <VehicleStatusBadge status={v.status} />
            <Plate reg={v.registration} className="text-[0.75rem]" />
          </div>

          <div className="absolute inset-x-0 bottom-0 px-5 pb-24 sm:px-8 sm:pb-24">
            <p className="text-[0.9rem] text-white/65">
              {v.year} {v.make}
            </p>
            <h1 className="mt-1 font-display text-[2.75rem] leading-[0.98] font-normal text-balance drop-shadow-[0_2px_16px_rgba(0,0,0,0.5)] sm:text-7xl">{v.model}</h1>
            <p className="mt-2 text-white/65">
              {v.variant ? `${v.variant} · ` : ""}
              {v.colour}
            </p>
          </div>
        </div>

        <Card tone="dark" className="relative z-10 mx-3 -mt-16 rounded-[24px] p-5 sm:mx-6 sm:p-6">
          {v.statusNote ? <p className="text-base leading-relaxed text-white/85 md:text-[0.95rem]">{v.statusNote}</p> : null}
          <dl
            className={cn(
              "grid grid-cols-2 gap-x-6 gap-y-4 text-[0.95rem] sm:grid-cols-4 md:text-sm [&>*]:min-w-0",
              v.statusNote && "mt-4 border-t border-white/[0.08] pt-4",
            )}
          >
            <div className="col-span-2 sm:col-span-1">
              <dt className="text-[0.75rem] text-white/45">Location</dt>
              <dd className="mt-0.5 truncate">{v.location.name}</dd>
            </div>
            <div>
              <dt className="text-[0.75rem] text-white/45">Mileage</dt>
              <dd className="mt-0.5 tabular">{formatMiles(v.mileage)}</dd>
            </div>
            <div>
              <dt className="text-[0.75rem] text-white/45">Battery</dt>
              <dd className="mt-0.5">
                <BatteryReading voltage={v.battery.voltage} />
              </dd>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <dt className="text-[0.75rem] text-white/45">Next check</dt>
              <dd className={cn("mt-0.5", checkDays < 0 && "text-warning")}>
                {checkDays < 0 ? `Overdue, being arranged` : `${formatDayDate(v.nextCheckAt)}, ${relativeDays(v.nextCheckAt)}`}
              </dd>
            </div>
          </dl>
        </Card>

        <div className="mt-5 grid grid-cols-2 gap-2 px-3 sm:flex sm:flex-wrap sm:px-6" aria-label="Ask for something for this car">
          {ACTIONS.map((a) => (
            <ButtonLink
              key={a.type}
              href={`/garage/requests/new?type=${a.type}&vehicle=${v.id}`}
              variant="secondary"
              className="h-12 w-full backdrop-blur-none sm:h-11 sm:w-auto"
            >
              {a.label}
            </ButtonLink>
          ))}
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-3 [&>*]:min-w-0">
        {/* Main column */}
        <div className="space-y-8 lg:col-span-2">
          <section>
            <SectionHeader title="Latest check" />
            <Card className="rounded-[24px] p-5 sm:p-7">
              {latestCheck?.readings ? (
                <>
                  <p className="text-[0.82rem] text-white/50">
                    {latestCheck.title} · {formatDateTime(latestCheck.at)} · {latestCheck.by}
                  </p>
                  <div className="mt-6 grid gap-8 md:grid-cols-[1fr_auto] [&>*]:min-w-0">
                    <TyreDiagram current={latestCheck.readings.tyres} target={v.tyres.target} unit={v.tyres.unit} />
                    <ul className="space-y-3.5 text-[0.95rem] md:min-w-48 md:border-l md:border-white/[0.08] md:pl-7 md:text-sm">
                      <li className="flex items-center justify-between gap-4">
                        <span className="text-white/55">Battery</span>
                        <BatteryReading voltage={latestCheck.readings.batteryVoltage} />
                      </li>
                      <li className="flex items-center justify-between gap-4">
                        <span className="text-white/55">Odometer</span>
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
                          <span className="text-white/55">{label}</span>
                          <span className={cn("inline-flex items-center gap-1.5", ok ? "text-white" : "text-warning")}>
                            {ok ? <CircleCheck className="size-4 text-success" aria-hidden /> : <CircleX className="size-4" aria-hidden />}
                            {ok ? "OK" : "Needs attention"}
                          </span>
                        </li>
                      ))}
                      <li className="flex items-center justify-between gap-4">
                        <span className="text-white/55">Conditioner</span>
                        <span>{v.battery.onConditioner ? "Connected" : "Not connected"}</span>
                      </li>
                    </ul>
                  </div>
                  {latestCheck.detail ? (
                    <p className="glass-inset mt-7 rounded-2xl px-4 py-3 text-[0.95rem] leading-relaxed text-white/70 md:text-sm">{latestCheck.detail}</p>
                  ) : null}
                </>
              ) : (
                <p className="text-sm text-white/60">Readings appear here after our first visit.</p>
              )}
            </Card>
          </section>

          <section>
            <SectionHeader title="Value" />
            <Card className="rounded-[24px] p-5 sm:p-7">
              <p className="font-display text-4xl leading-none font-normal tabular">{formatGBP(current)}</p>
              <p className="mt-2 text-[0.82rem] text-white/50">
                <ValueDelta from={v.purchasePrice} to={current} className="text-[0.82rem]" /> since purchase in{" "}
                {formatDate(v.purchaseDate, { month: "long", year: "numeric" })}
              </p>
              <div className="mt-6">
                <ValueChart points={v.valuations} purchasePrice={v.purchasePrice} />
              </div>
              <p className="mt-4 text-[0.78rem] leading-relaxed text-white/40">
                Guidance only, not a formal valuation.
                {lastValuation ? ` Last reviewed ${formatDate(lastValuation.date)} (${lastValuation.source}).` : ""} Ask us for a formal report for
                insurance or sale.
              </p>
            </Card>
          </section>

          <section>
            <SectionHeader title="History" />
            {history.length ? (
              <Card className="rounded-[24px] p-5 sm:p-7">
                <HistoryTimeline events={history} />
              </Card>
            ) : (
              <EmptyState icon={Route} title="No history recorded yet" body="Every check, service and movement we carry out will be logged here." />
            )}
            <p className="mt-3 px-1 text-[0.8rem] text-white/40">The complete record is part of the car&apos;s value. It comes with you if you sell.</p>
          </section>
        </div>

        {/* Side column */}
        <aside className="space-y-4 lg:pt-12">
          <Card className="rounded-[22px] p-5">
            <PaneTitle>Next visit</PaneTitle>
            <p className="mt-2 font-display text-2xl leading-tight font-normal">{formatDayDate(v.nextCheckAt)}</p>
            <p className={cn("mt-1 text-[0.82rem]", checkDays < 0 ? "text-warning" : "text-white/50")}>
              {checkDays < 0 ? `Overdue by ${Math.abs(checkDays)} days, we're arranging it` : relativeDays(v.nextCheckAt)} · checked{" "}
              {v.checkFrequency}
            </p>
            {jobs.length ? (
              <ul className="mt-4 space-y-2.5 border-t border-white/[0.08] pt-4">
                {jobs.slice(0, 3).map((j) => (
                  <li key={j.id} className="text-sm">
                    {j.title}
                    <span className="block text-[0.78rem] text-white/45">{formatDateTime(j.start)}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </Card>

          <Card className="rounded-[22px] p-5">
            <PaneTitle>Deadlines</PaneTitle>
            {due.length ? (
              <ul className="mt-3 space-y-3">
                {due.map((d) => {
                  const days = daysUntil(d.dueDate);
                  return (
                    <li key={d.id} className="flex items-start justify-between gap-3 text-sm">
                      <span className="min-w-0">
                        <span className="font-medium">{d.kind}</span>
                        {d.notes ? <span className="block text-[0.78rem] text-white/45">{d.notes}</span> : null}
                      </span>
                      <span className={cn("shrink-0 tabular text-[0.82rem]", days < 0 ? "text-warning" : "text-white/70")}>
                        {days < 0 ? "Overdue" : formatDate(d.dueDate, { day: "numeric", month: "short" })}
                      </span>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-white/50">No deadlines on file.</p>
            )}
          </Card>

          {openRequests.length ? (
            <Card className="rounded-[22px] p-5">
              <PaneTitle>Open requests</PaneTitle>
              <ul className="mt-3 space-y-3">
                {openRequests.map((r) => {
                  const status = REQUEST_STATUS_META[r.status];
                  return (
                    <li key={r.id} className="flex items-start justify-between gap-3 text-sm">
                      <span className="min-w-0">
                        {r.title}
                        <span className="block text-[0.78rem] text-white/45">{formatDateTime(r.when)}</span>
                      </span>
                      <StatusText tone={status.tone} className="mt-0.5">
                        {status.label}
                      </StatusText>
                    </li>
                  );
                })}
              </ul>
            </Card>
          ) : null}

          <Card className="rounded-[22px] p-5">
            <div className="flex items-center justify-between gap-3">
              <PaneTitle>Documents</PaneTitle>
              <SectionLink href="/garage/documents" className="text-[0.82rem]">
                All documents
              </SectionLink>
            </div>
            {docs.length ? (
              <ul className="mt-3 space-y-3">
                {docs.map((d) => (
                  <li key={d.id} className="flex items-start gap-2.5 text-[0.95rem] md:text-sm">
                    <FileText className="mt-0.5 size-4 shrink-0 text-white/35" aria-hidden />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate">{d.title}</span>
                      <span className="block text-[0.78rem] text-white/45">
                        {d.kind} · {formatDate(d.date)} · {sizeLabel(d.sizeKb)}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-white/50">No documents yet.</p>
            )}
          </Card>

          {v.specialistNotes ? (
            <Card className="rounded-[22px] p-5">
              <PaneTitle>From the specialist</PaneTitle>
              <p className="mt-3 font-display text-lg leading-snug font-normal text-white/85 italic">{v.specialistNotes}</p>
            </Card>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
