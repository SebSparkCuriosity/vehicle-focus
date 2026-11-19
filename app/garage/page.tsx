import Link from "next/link";
import {
  CalendarClock,
  Car,
  ChevronRight,
  ClipboardList,
  KeyRound,
  MessageCircle,
  Route,
  Truck,
  Wrench,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CarCard } from "@/components/garage/car-card";
import { EmptyState, REQUEST_ICON, SectionHeader, SectionLink, ValueDelta } from "@/components/garage/bits";
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
  { href: "/garage/requests/new?type=ready", label: "Have it ready", icon: KeyRound },
  { href: "/garage/requests/new?type=relocation", label: "Move a car", icon: Truck },
  { href: "/garage/requests/new?type=service", label: "Book a service", icon: Wrench },
  { href: "/garage/messages", label: "Message us", icon: MessageCircle },
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
    .slice(0, 7);

  const nextDueCar = summary.nextDue ? carName(summary.nextDue.vehicleId) : undefined;

  return (
    <div className="space-y-12">
      {/* Greeting + summary */}
      <section>
        <p className="eyebrow">{client ? `${TIERS[client.tier].label} member` : "The Garage"}</p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          {greeting()}, {client?.firstName}.
        </h1>
        <p className="mt-2 max-w-xl text-muted">
          {summary.ready === summary.count
            ? `All ${summary.count} cars are ready to drive.`
            : `${summary.ready} of ${summary.count} cars ready to drive. Here's where everything stands.`}
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Card className="p-4">
            <p className="text-xs text-muted">In the collection</p>
            <p className="mt-1 font-display text-2xl font-semibold tabular">{summary.count}</p>
            <p className="mt-1 text-xs text-subtle">{summary.ready} ready now</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-muted">Estimated value</p>
            <p className="mt-1 font-display text-2xl font-semibold tabular">{formatGBPCompact(summary.totalValue)}</p>
            <ValueDelta from={summary.totalPaid} to={summary.totalValue} className="mt-1 block text-xs" />
          </Card>
          <Card className="col-span-2 p-4">
            <p className="text-xs text-muted">Next deadline</p>
            {summary.nextDue ? (
              <>
                <p className="mt-1 font-display text-lg font-semibold">
                  {summary.nextDue.kind}
                  <span className="font-normal text-muted"> · {nextDueCar}</span>
                </p>
                <p className={cn("mt-1 text-xs", daysUntil(summary.nextDue.dueDate) < 0 ? "text-warning" : "text-subtle")}>
                  Due {relativeDays(summary.nextDue.dueDate)}, {formatDayDate(summary.nextDue.dueDate)}. We&apos;re on it.
                </p>
              </>
            ) : (
              <p className="mt-1 text-sm text-muted">Nothing due. Every deadline is covered.</p>
            )}
          </Card>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {QUICK_ACTIONS.map(({ href, label, icon: Icon }) => (
            <Link
              key={label}
              href={href}
              className="group flex items-center gap-3 rounded-lg border border-border bg-surface-2 px-3 py-3 text-sm transition-colors hover:border-gold/50"
            >
              <span className="grid size-8 shrink-0 place-items-center rounded-md bg-gold-soft text-gold">
                <Icon className="size-4" aria-hidden />
              </span>
              <span className="font-medium">{label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Cars */}
      <section>
        <SectionHeader eyebrow="Your collection" title="Where every car is right now" />
        {vehicles.length ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {vehicles.map((v) => (
              <CarCard key={v.id} vehicle={v} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Car}
            title="No cars on your account yet"
            body="Once we've completed your vehicle audit, each car appears here with its live status."
            action={<ButtonLink href="/garage/messages" variant="secondary" size="sm">Message the team</ButtonLink>}
          />
        )}
      </section>

      <div className="grid gap-10 lg:grid-cols-5 [&>*]:min-w-0">
        {/* Coming up */}
        <section className="lg:col-span-3">
          <SectionHeader eyebrow="Diary" title="Coming up" />
          {comingUp.length ? (
            <Card>
              <ul className="divide-y divide-border">
                {comingUp.map((item) => (
                  <li key={item.id} className="flex items-start gap-4 px-4 py-3.5">
                    <div className="w-12 shrink-0 text-center">
                      <p className="text-[0.68rem] tracking-wide text-subtle uppercase">
                        {new Date(item.at).toLocaleDateString("en-GB", { month: "short" })}
                      </p>
                      <p className="font-display text-xl font-semibold tabular">{new Date(item.at).getDate()}</p>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{item.title}</p>
                      <p className="mt-0.5 truncate text-xs text-muted">{item.detail}</p>
                    </div>
                    {item.kind === "due" ? (
                      <Badge tone={item.overdue ? "warning" : "neutral"}>{item.overdue ? "Overdue" : "Deadline"}</Badge>
                    ) : (
                      <Badge tone="info">{relativeDays(item.at)}</Badge>
                    )}
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
          <SectionHeader eyebrow="Requests" title="In hand" action={<SectionLink href="/garage/requests">All requests</SectionLink>} />
          {openRequests.length ? (
            <ul className="space-y-2">
              {openRequests.slice(0, 4).map((r) => {
                const Icon = REQUEST_ICON[r.type];
                const status = REQUEST_STATUS_META[r.status];
                return (
                  <li key={r.id}>
                    <Link
                      href="/garage/requests"
                      className="flex items-start gap-3 rounded-lg border border-border bg-surface p-3 transition-colors hover:border-border-strong"
                    >
                      <span className="grid size-8 shrink-0 place-items-center rounded-md bg-surface-2 text-muted">
                        <Icon className="size-4" aria-hidden />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium">{r.title}</span>
                        <span className="block truncate text-xs text-muted">
                          {REQUEST_TYPE_META[r.type].label} · {formatDateTime(r.when)}
                        </span>
                      </span>
                      <Badge tone={status.tone}>{status.label}</Badge>
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <EmptyState
              icon={ClipboardList}
              title="Nothing open"
              body="Need a car ready, moved or serviced? Raise it here and we'll confirm."
              action={<ButtonLink href="/garage/requests/new" size="sm">New request</ButtonLink>}
            />
          )}
        </section>
      </div>

      {/* Activity */}
      <section>
        <SectionHeader
          eyebrow="Recorded"
          title="Recent activity"
          action={vehicles[0] ? <SectionLink href={`/garage/cars/${vehicles[0].id}`}>Full history per car</SectionLink> : null}
        />
        {activity.length ? (
          <Card className="p-5">
            <HistoryTimeline events={activity} carLabel={carName} />
          </Card>
        ) : (
          <EmptyState icon={Route} title="No activity yet" body="Every check, service and movement will be recorded here." />
        )}
        <p className="mt-3 flex items-center gap-1.5 text-xs text-subtle">
          <ChevronRight className="size-3" aria-hidden />
          Every job we do is written down, so the history protects the value.
        </p>
      </section>
    </div>
  );
}
