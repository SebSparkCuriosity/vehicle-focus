import Link from "next/link";
import { CalendarDays, ChevronLeft, ChevronRight, CircleCheck, TriangleAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState, Initials, JobKindBadge, JOB_BAR, PageHeader } from "@/components/console/ui";
import { durationLabel, isSameDay, startOfDay } from "@/components/console/dates";
import { getLookups } from "@/components/console/lookups";
import { getJobs } from "@/lib/data/queries";
import { FREQUENCY_DAYS, isCheckOverdue, vehicleName } from "@/lib/domain";
import { formatDate, formatTime, relativeDays } from "@/lib/format";
import { cn } from "@/lib/utils";

export const metadata = { title: "Schedule" };

export default async function SchedulePage({ searchParams }: { searchParams: Promise<{ week?: string }> }) {
  const { week: weekParam } = await searchParams;
  const week = Math.max(-8, Math.min(12, Number.parseInt(weekParam ?? "0", 10) || 0));
  const start = startOfDay(week * 7);
  const end = startOfDay(week * 7 + 7);
  const days = Array.from({ length: 7 }, (_, i) => startOfDay(week * 7 + i));

  const [jobs, lookups] = await Promise.all([getJobs({ from: start.toISOString(), to: end.toISOString() }), getLookups()]);

  // Scheduled checks implied by each car's care cycle that don't already have a check job this week.
  const checkJobsByVehicle = new Set(jobs.filter((j) => j.kind === "check").map((j) => j.vehicleId));
  const impliedChecks = lookups.vehicles.filter(
    (v) => v.nextCheckAt >= start.toISOString() && v.nextCheckAt < end.toISOString() && !checkJobsByVehicle.has(v.id),
  );
  const overdueChecks = week === 0 ? lookups.vehicles.filter((v) => isCheckOverdue(v) && !checkJobsByVehicle.has(v.id)) : [];

  const hoursBooked = jobs.reduce((s, j) => s + j.durationMins, 0) / 60;
  const label =
    week === 0
      ? "Next seven days"
      : `${formatDate(start.toISOString(), { day: "numeric", month: "short" })} to ${formatDate(startOfDay(week * 7 + 6).toISOString(), { day: "numeric", month: "short" })}`;

  return (
    <>
      <PageHeader
        eyebrow="Schedule"
        title={label}
        description={`${jobs.length} jobs booked (${hoursBooked.toFixed(1)} hours) and ${impliedChecks.length} care-cycle checks to fit in.`}
        actions={
          <div className="flex items-center gap-1">
            <Link href={`/console/schedule?week=${week - 1}`} className={buttonVariants({ variant: "secondary", size: "icon" })} aria-label="Previous week">
              <ChevronLeft />
            </Link>
            {week !== 0 ? (
              <Link href="/console/schedule" className={buttonVariants({ variant: "secondary", size: "sm" })}>
                This week
              </Link>
            ) : null}
            <Link href={`/console/schedule?week=${week + 1}`} className={buttonVariants({ variant: "secondary", size: "icon" })} aria-label="Next week">
              <ChevronRight />
            </Link>
          </div>
        }
      />

      <div className="mb-6 grid grid-cols-7 gap-1.5 rounded-xl border border-border bg-surface p-2" aria-label="Week at a glance">
        {days.map((d) => {
          const count = jobs.filter((j) => isSameDay(j.start, d)).length + impliedChecks.filter((v) => isSameDay(v.nextCheckAt, d)).length;
          const isToday = isSameDay(d, new Date());
          return (
            <a key={d.toISOString()} href={`#day-${d.getDate()}`} className={cn("rounded-lg px-1 py-2 text-center transition-colors hover:bg-surface-2", isToday && "bg-gold-soft")}>
              <p className={cn("text-[0.65rem] uppercase tracking-wider", isToday ? "text-gold" : "text-subtle")}>
                {formatDate(d.toISOString(), { weekday: "short" })}
              </p>
              <p className="font-display text-lg font-semibold tabular">{d.getDate()}</p>
              <div className="mt-1 flex justify-center gap-0.5" aria-label={`${count} items`}>
                {Array.from({ length: Math.min(count, 5) }, (_, i) => (
                  <span key={i} className="size-1 rounded-full bg-gold" />
                ))}
                {count === 0 ? <span className="size-1 rounded-full bg-surface-3" /> : null}
              </div>
            </a>
          );
        })}
      </div>

      {overdueChecks.length ? (
        <section className="mb-6 rounded-xl border border-danger/30 bg-danger-soft p-4">
          <div className="flex items-center gap-2 text-danger">
            <TriangleAlert className="size-4" />
            <h2 className="font-display text-sm font-semibold">Overdue checks, fit these in first</h2>
          </div>
          <ul className="mt-3 flex flex-wrap gap-2">
            {overdueChecks.map((v) => (
              <li key={v.id}>
                <Link href={`/console/fleet/${v.id}`} className="inline-flex items-center gap-2 rounded-md border border-danger/30 bg-bg/40 px-3 py-1.5 text-sm hover:border-danger">
                  {vehicleName(v)} <span className="text-xs text-danger">due {relativeDays(v.nextCheckAt)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="space-y-4">
        {days.map((d) => {
          const dayJobs = jobs.filter((j) => isSameDay(j.start, d));
          const dayChecks = impliedChecks.filter((v) => isSameDay(v.nextCheckAt, d));
          const isToday = isSameDay(d, new Date());
          return (
            <section key={d.toISOString()} id={`day-${d.getDate()}`} className="scroll-mt-20 rounded-xl border border-border bg-surface">
              <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-2.5">
                <h2 className="font-display text-sm font-semibold">
                  {formatDate(d.toISOString(), { weekday: "long", day: "numeric", month: "long" })}
                  {isToday ? (
                    <Badge tone="gold" className="ml-2">
                      Today
                    </Badge>
                  ) : null}
                </h2>
                <span className="text-xs text-subtle tabular">
                  {dayJobs.length} {dayJobs.length === 1 ? "job" : "jobs"}
                  {dayChecks.length ? `, ${dayChecks.length} cycle ${dayChecks.length === 1 ? "check" : "checks"}` : ""}
                </span>
              </header>
              {dayJobs.length || dayChecks.length ? (
                <ul className="divide-y divide-border">
                  {dayJobs.map((j) => {
                    const v = lookups.vehicle.get(j.vehicleId);
                    const c = v ? lookups.client.get(v.clientId) : undefined;
                    const m = lookups.member.get(j.assigneeId);
                    return (
                      <li key={j.id} className="flex items-stretch gap-3 px-4 py-3">
                        <span className={cn("w-1 shrink-0 rounded-full", JOB_BAR[j.kind])} aria-hidden />
                        <div className="w-24 shrink-0">
                          <p className="text-sm font-medium tabular">{formatTime(j.start)}</p>
                          <p className="text-xs text-subtle tabular">{durationLabel(j.durationMins)}</p>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <Link href={j.requestId ? `/console/requests/${j.requestId}` : `/console/fleet/${j.vehicleId}`} className="text-sm font-medium hover:text-gold">
                              {j.title}
                            </Link>
                            <JobKindBadge kind={j.kind} />
                          </div>
                          <p className="mt-0.5 truncate text-xs text-muted">
                            {c?.name} · {v ? `${vehicleName(v)}, ${v.registration}` : ""} · {j.location}
                          </p>
                        </div>
                        {m ? (
                          <span className="hidden items-center gap-2 sm:flex">
                            <Initials initials={m.initials} />
                            <span className="text-xs text-muted">{m.name.split(" ")[0]}</span>
                          </span>
                        ) : null}
                      </li>
                    );
                  })}
                  {dayChecks.map((v) => {
                    const c = lookups.client.get(v.clientId);
                    return (
                      <li key={`check-${v.id}`} className="flex items-stretch gap-3 px-4 py-3">
                        <span className="w-1 shrink-0 rounded-full border border-dashed border-info" aria-hidden />
                        <div className="w-24 shrink-0">
                          <p className="text-sm text-muted tabular">{formatTime(v.nextCheckAt)}</p>
                          <p className="text-xs text-subtle">Not booked</p>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <Link href={`/console/fleet/${v.id}`} className="text-sm font-medium hover:text-gold">
                              {v.checkFrequency[0].toUpperCase() + v.checkFrequency.slice(1)} check, {vehicleName(v)}
                            </Link>
                            <Badge tone="info">Care cycle</Badge>
                          </div>
                          <p className="mt-0.5 truncate text-xs text-muted">
                            {c?.name} · {v.location.name} · every {FREQUENCY_DAYS[v.checkFrequency]} days
                          </p>
                        </div>
                        <CircleCheck className="hidden size-4 self-center text-subtle sm:block" aria-hidden />
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div className="p-4">
                  <EmptyState icon={CalendarDays} title="Nothing booked" />
                </div>
              )}
            </section>
          );
        })}
      </div>
    </>
  );
}
