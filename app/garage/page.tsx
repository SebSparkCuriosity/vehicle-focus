import Link from "next/link";
import { CalendarClock, Car, ClipboardList, Route } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CarCard } from "@/components/garage/car-card";
import { EmptyState, SectionHeader, SectionLink, StatusText, ValueDelta } from "@/components/garage/bits";
import { HistoryTimeline } from "@/components/garage/history-timeline";
import {
  getClient,
  getCollectionSummary,
  getDueItems,
  getJobs,
  getRecentActivity,
  getRequests,
  getVehicles,
} from "@/lib/data/queries";
import { JOB_KIND_LABEL, REQUEST_STATUS_META, REQUEST_TYPE_META, TIERS, vehicleName } from "@/lib/domain";
import { daysUntil, formatDateTime, formatDayDate, formatGBPCompact, relativeDays } from "@/lib/format";
import { requireClient } from "@/lib/session";
import { cn } from "@/lib/utils";

function greeting(): string {
  const hour = Number(new Intl.DateTimeFormat("en-GB", { hour: "numeric", hour12: false, timeZone: "Europe/London" }).format(new Date()));
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

const QUICK_ACTIONS = [
  { href: "/garage/requests/new?type=ready", label: "Have it ready" },
  { href: "/garage/requests/new?type=relocation", label: "Move a car" },
  { href: "/garage/requests/new?type=service", label: "Book a service" },
  { href: "/garage/messages", label: "Message us" },
];

type ComingUp = { id: string; at: string; title: string; detail: string; kind: "job" | "due"; overdue?: boolean };

export default async function GarageDashboard() {
  const { clientId } = await requireClient();
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const [client, vehicles, summary, jobs, due, openRequests, activity] = await Promise.all([
    getClient(clientId),
    getVehicles({ clientId }),
    getCollectionSummary(clientId),
    getJobs({ clientId, from: startOfToday.toISOString() }),
    getDueItems({ clientId, withinDays: 60 }),
    getRequests({ clientId, status: ["new", "scheduled", "in-progress"] }),
    getRecentActivity({ clientId, clientView: true, limit: 6 }),
  ]);

  const carName = (id: string) => {
    const v = vehicles.find((x) => x.id === id);
    return v ? vehicleName(v) : undefined;
  };

  const comingUp: ComingUp[] = [
    ...jobs.map((j) => ({
      id: j.id,
      at: j.start,
      title: j.title,
      detail: `${JOB_KIND_LABEL[j.kind]} · ${j.location}`,
      kind: "job" as const,
    })),
    ...due.map((d) => ({
      id: d.id,
      at: d.dueDate,
      title: `${d.kind} due: ${carName(d.vehicleId) ?? "Car"}`,
      detail: d.notes ?? "We'll handle it before the deadline.",
      kind: "due" as const,
      overdue: daysUntil(d.dueDate) < 0,
    })),
  ]
    .sort((a, b) => a.at.localeCompare(b.at))
    .slice(0, 6);

  const nextDueCar = summary.nextDue ? carName(summary.nextDue.vehicleId) : undefined;
  const allReady = summary.count > 0 && summary.ready === summary.count;

  return (
    <div className="space-y-12 md:space-y-14">
      {/* Greeting */}
      <section>
        {client ? <p className="eyebrow">{TIERS[client.tier].label} member</p> : null}
        <h1 className="mt-3 font-display text-[2.6rem] leading-[1.02] font-normal text-balance sm:text-6xl">
          {greeting()}, {client?.firstName}.
        </h1>
        <p className="mt-3 text-[1.05rem] text-white/65 sm:text-lg">
          {summary.count === 0
            ? "Your collection will appear here after the vehicle audit."
            : allReady
              ? `All ${summary.count} cars are ready to drive.`
              : `${summary.ready} of ${summary.count} cars ready to drive.`}
        </p>

        {/* Collection summary: one pane, three figures */}
        <Card className="mt-8 grid grid-cols-2 rounded-[26px] md:grid-cols-[1fr_1fr_1.4fr] [&>*]:min-w-0">
          <div className="p-5 sm:p-6">
            <p className="text-[0.78rem] text-white/50">In the collection</p>
            <p className="mt-1.5 font-display text-4xl leading-none font-normal tabular">{summary.count}</p>
            <p className="mt-2 text-[0.78rem] text-white/45">{summary.ready} ready now</p>
          </div>
          <div className="border-l border-white/[0.08] p-5 sm:p-6">
            <p className="text-[0.78rem] text-white/50">Estimated value</p>
            <p className="mt-1.5 font-display text-4xl leading-none font-normal tabular">{formatGBPCompact(summary.totalValue)}</p>
            <ValueDelta from={summary.totalPaid} to={summary.totalValue} className="mt-2 block text-[0.78rem]" />
          </div>
          <div className="col-span-2 border-t border-white/[0.08] p-5 sm:p-6 md:col-span-1 md:border-t-0 md:border-l">
            <p className="text-[0.78rem] text-white/50">Next deadline</p>
            {summary.nextDue ? (
              <>
                <p className="mt-1.5 truncate font-display text-2xl leading-tight font-normal">
                  {summary.nextDue.kind}
                  <span className="text-white/50"> · {nextDueCar}</span>
                </p>
                <p className={cn("mt-2 text-[0.78rem]", daysUntil(summary.nextDue.dueDate) < 0 ? "text-warning" : "text-white/45")}>
                  Due {relativeDays(summary.nextDue.dueDate)}, {formatDayDate(summary.nextDue.dueDate)}. We&apos;re on it.
                </p>
              </>
            ) : (
              <p className="mt-2 text-sm text-white/60">Nothing due. Every deadline is covered.</p>
            )}
          </div>
        </Card>

        <div className="mt-4 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
          {QUICK_ACTIONS.map(({ href, label }) => (
            <ButtonLink key={label} href={href} variant="secondary" className="h-12 w-full backdrop-blur-none sm:h-11 sm:w-auto">
              {label}
            </ButtonLink>
          ))}
        </div>
      </section>

      {/* Cars */}
      <section>
        <SectionHeader title="Your collection" />
        {vehicles.length ? (
          <div className="grid gap-4 md:grid-cols-2 [&>*]:min-w-0">
            {vehicles.map((v) => (
              <CarCard key={v.id} vehicle={v} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Car}
            title="No cars on your account yet"
            body="Once we've completed your vehicle audit, each car appears here with its live status."
            action={
              <ButtonLink href="/garage/messages" variant="secondary" size="sm">
                Message the team
              </ButtonLink>
            }
          />
        )}
      </section>

      <div className="grid gap-10 lg:grid-cols-5 [&>*]:min-w-0">
        {/* Coming up */}
        <section className="lg:col-span-3">
          <SectionHeader title="Coming up" />
          {comingUp.length ? (
            <Card className="rounded-[24px] p-2">
              <ul>
                {comingUp.map((item, i) => (
                  <li
                    key={item.id}
                    className={cn("flex items-center gap-4 rounded-[18px] px-3 py-3", i > 0 && "border-t border-white/[0.06]")}
                  >
                    <div className="w-11 shrink-0 text-center">
                      <p className="text-xs tracking-[0.12em] text-white/45 uppercase">
                        {new Date(item.at).toLocaleDateString("en-GB", { month: "short" })}
                      </p>
                      <p className="font-display text-2xl leading-none font-normal tabular">{new Date(item.at).getDate()}</p>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[0.95rem] font-medium md:text-[0.92rem]">{item.title}</p>
                      <p className="mt-0.5 truncate text-[0.78rem] text-white/50">{item.detail}</p>
                    </div>
                    <p
                      className={cn(
                        "shrink-0 text-right text-[0.75rem]",
                        item.overdue ? "text-warning" : item.kind === "due" ? "text-white/45" : "text-white/70",
                      )}
                    >
                      {item.overdue ? "Overdue" : item.kind === "due" ? "Deadline" : relativeDays(item.at)}
                    </p>
                  </li>
                ))}
              </ul>
            </Card>
          ) : (
            <EmptyState icon={CalendarClock} title="A quiet diary" body="No visits or deadlines in the next two months." />
          )}
        </section>

        {/* Open requests */}
        <section className="lg:col-span-2">
          <SectionHeader title="In hand" action={<SectionLink href="/garage/requests">All requests</SectionLink>} />
          {openRequests.length ? (
            <Card className="rounded-[24px] p-2">
              <ul>
                {openRequests.slice(0, 4).map((r, i) => {
                  const status = REQUEST_STATUS_META[r.status];
                  return (
                    <li key={r.id} className={cn(i > 0 && "border-t border-white/[0.06]")}>
                      <Link
                        href="/garage/requests"
                        className="flex items-start gap-3 rounded-[18px] px-3 py-3 transition-colors hover:bg-white/[0.04]"
                      >
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[0.95rem] font-medium md:text-[0.92rem]">{r.title}</span>
                          <span className="mt-0.5 block truncate text-[0.78rem] text-white/50">
                            {REQUEST_TYPE_META[r.type].label} · {formatDateTime(r.when)}
                          </span>
                        </span>
                        <StatusText tone={status.tone} className="mt-0.5">
                          {status.label}
                        </StatusText>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </Card>
          ) : (
            <EmptyState
              icon={ClipboardList}
              title="Nothing open"
              body="Need a car ready, moved or serviced? Ask here and we'll confirm."
              action={
                <ButtonLink href="/garage/requests/new" size="sm">
                  New request
                </ButtonLink>
              }
            />
          )}
        </section>
      </div>

      {/* Activity */}
      <section>
        <SectionHeader
          title="Recently recorded"
          action={vehicles[0] ? <SectionLink href={`/garage/cars/${vehicles[0].id}`}>Full history per car</SectionLink> : null}
        />
        {activity.length ? (
          <Card className="rounded-[24px] p-5 sm:p-7">
            <HistoryTimeline events={activity} carLabel={carName} />
          </Card>
        ) : (
          <EmptyState icon={Route} title="No activity yet" body="Every check, service and movement will be recorded here." />
        )}
        <p className="mt-4 px-1 text-[0.8rem] text-white/40">Every job we do is written down, so the history protects the value.</p>
      </section>
    </div>
  );
}
