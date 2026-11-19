import Link from "next/link";
import { ArrowRight, CalendarDays, CircleCheck, Inbox, TrendingUp, TriangleAlert } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Dot, EmptyState, Kpi, KpiStrip, PageHeader, Panel, PanelLink, SourceBadge } from "@/components/console/ui";
import { HistoryItem, JobRow } from "@/components/console/rows";
import { getLookups } from "@/components/console/lookups";
import { startOfDay, isSameDay } from "@/components/console/dates";
import { getAttention, getBusinessStats, getJobs, getLeads, getRecentActivity, getRequests, getTeamMember } from "@/lib/data/queries";
import { REQUEST_TYPE_META, vehicleName } from "@/lib/domain";
import { formatDate, formatDateTime, formatGBP, formatGBPCompact, timeAgo } from "@/lib/format";
import { requireTeam } from "@/lib/session";
import { cn } from "@/lib/utils";

export const metadata = { title: "Today" };

export default async function ConsoleToday() {
  const { memberId } = await requireTeam();
  const today = startOfDay(0);
  const [member, stats, jobs, attention, newRequests, leads, activity, lookups] = await Promise.all([
    getTeamMember(memberId),
    getBusinessStats(),
    getJobs({ from: today.toISOString(), to: startOfDay(2).toISOString() }),
    getAttention(),
    getRequests({ status: ["new"] }),
    getLeads(),
    getRecentActivity({ limit: 8 }),
    getLookups(),
  ]);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const todayJobs = jobs.filter((j) => isSameDay(j.start, today));
  const tomorrowJobs = jobs.filter((j) => !isSameDay(j.start, today));
  const newLeads = leads.filter((l) => l.stage === "new");
  const highCount = attention.filter((a) => a.severity === "high").length;

  return (
    <>
      <PageHeader
        eyebrow={formatDate(today.toISOString(), { weekday: "long", day: "numeric", month: "long" })}
        title={`${greeting}, ${member?.name.split(" ")[0] ?? "team"}`}
        description={
          <>
            {todayJobs.length} {todayJobs.length === 1 ? "job" : "jobs"} today, {stats.newRequests} new{" "}
            {stats.newRequests === 1 ? "request" : "requests"} and {highCount} urgent {highCount === 1 ? "item" : "items"} across the fleet.
          </>
        }
        actions={
          <>
            <ButtonLink href="/console/schedule" variant="secondary" size="sm">
              <CalendarDays /> Week ahead
            </ButtonLink>
            <ButtonLink href="/console/requests" size="sm">
              <Inbox /> Requests
            </ButtonLink>
          </>
        }
      />

      <KpiStrip>
        <Kpi label="Clients" value={stats.clients} href="/console/clients" />
        <Kpi label="Cars under care" value={stats.vehicles} href="/console/fleet" />
        <Kpi label="Value under care" value={formatGBPCompact(stats.valueUnderCare)} sub="Latest valuations" />
        <Kpi label="Open requests" value={stats.openRequests} sub={`${stats.newRequests} awaiting review`} href="/console/requests" />
        <Kpi label="Checks due in 7 days" value={stats.checksDueThisWeek} href="/console/schedule" />
        <Kpi label="Monthly recurring" value={formatGBPCompact(stats.mrr)} sub={`${formatGBPCompact(stats.arr)} a year, demo fees`} />
      </KpiStrip>

      <div className="mt-6 grid gap-6 xl:grid-cols-3 [&>*]:min-w-0">
        <div className="space-y-6 xl:col-span-2">
          <Panel
            title="Jobs"
            description="Today and tomorrow, in time order"
            action={
              <PanelLink href="/console/schedule">Full schedule</PanelLink>
            }
          >
            <div className="grid gap-6 md:grid-cols-2">
              {[
                { label: "Today", list: todayJobs },
                { label: "Tomorrow", list: tomorrowJobs },
              ].map((group) => (
                <div key={group.label}>
                  <p className="mb-1 text-[0.8rem] font-medium text-muted">
                    {group.label} <span className="text-subtle tabular">{group.list.length}</span>
                  </p>
                  {group.list.length ? (
                    <ul className="divide-y divide-white/[0.06]">
                      {group.list.map((j) => {
                        const v = lookups.vehicle.get(j.vehicleId);
                        return <JobRow key={j.id} job={j} vehicle={v} client={v ? lookups.client.get(v.clientId) : undefined} member={lookups.member.get(j.assigneeId)} />;
                      })}
                    </ul>
                  ) : (
                    <EmptyState icon={CalendarDays} title="Nothing booked" description="A clear day. Good time for storage checks." />
                  )}
                </div>
              ))}
            </div>
          </Panel>

          <Panel
            title="Needs attention"
            description="Batteries, overdue checks, tyres off target and deadlines within 14 days"
            action={
              <PanelLink href="/console/compliance">Compliance</PanelLink>
            }
            bodyClassName="p-0"
          >
            {attention.length ? (
              <ul className="divide-y divide-white/[0.06]">
                {attention.map((a, i) => {
                  const client = lookups.client.get(a.vehicle.clientId);
                  return (
                    <li key={`${a.vehicleId}-${a.label}-${i}`}>
                      <Link href={`/console/fleet/${a.vehicleId}`} className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-white/[0.03]">
                        <span
                          className={cn(
                            "grid size-7 shrink-0 place-items-center rounded-full",
                            a.severity === "high" ? "bg-danger-soft text-danger" : "bg-warning-soft text-warning",
                          )}
                        >
                          <TriangleAlert className="size-3.5" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium">
                            {vehicleName(a.vehicle)} <span className="text-subtle">· {a.vehicle.registration}</span>
                          </span>
                          <span className="block truncate text-xs text-muted">{client?.name}</span>
                        </span>
                        <Dot tone={a.severity === "high" ? "danger" : "warning"} className="text-white/80">
                          {a.label}
                        </Dot>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="p-5">
                <EmptyState icon={CircleCheck} title="Nothing needs attention" description="Every car is within spec and nothing is due in the next fortnight." />
              </div>
            )}
          </Panel>

          <Panel title="Recent activity" description="Across the whole fleet, newest first">
            {activity.length ? (
              <ul>
                {activity.map((e) => (
                  <HistoryItem key={e.id} event={e} vehicle={lookups.vehicle.get(e.vehicleId)} showVehicle />
                ))}
              </ul>
            ) : (
              <EmptyState title="No activity yet" />
            )}
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel
            title="New requests"
            description="From The Garage, waiting for you to schedule"
            action={
              <PanelLink href="/console/requests">All requests</PanelLink>
            }
            bodyClassName="p-0"
          >
            {newRequests.length ? (
              <ul className="divide-y divide-white/[0.06]">
                {newRequests.map((r) => {
                  const v = lookups.vehicle.get(r.vehicleId);
                  const c = lookups.client.get(r.clientId);
                  return (
                    <li key={r.id} className="px-5 py-3.5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-medium leading-snug">{r.title}</p>
                          <p className="mt-0.5 text-[0.78rem] text-muted">
                            {c?.name} · {v ? vehicleName(v) : ""}
                          </p>
                          <p className="mt-1 text-xs text-subtle">
                            {REQUEST_TYPE_META[r.type].label} · needed {formatDateTime(r.when)}
                          </p>
                        </div>
                        <ButtonLink href={`/console/requests/${r.id}`} size="sm" variant="outline" className="shrink-0">
                          Review
                        </ButtonLink>
                      </div>
                      <p className="mt-2 text-xs text-subtle">
                        Raised by {r.createdBy}, {timeAgo(r.createdAt)}
                      </p>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="p-5">
                <EmptyState icon={Inbox} title="Inbox zero" description="No new requests. Clients raise them from The Garage." />
              </div>
            )}
          </Panel>

          <Panel
            title="New leads"
            description="Website, readiness checks and referrals"
            action={
              <PanelLink href="/console/leads">Pipeline</PanelLink>
            }
            bodyClassName="p-0"
          >
            {newLeads.length ? (
              <ul className="divide-y divide-white/[0.06]">
                {newLeads.map((l) => (
                  <li key={l.id} className="px-5 py-3.5">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium">{l.name}</p>
                      <span className="text-xs text-subtle">{timeAgo(l.createdAt)}</span>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <SourceBadge source={l.source} />
                      {l.readinessScore !== undefined ? (
                        <Dot tone={l.readinessScore >= 60 ? "danger" : l.readinessScore >= 30 ? "warning" : "success"}>Risk {l.readinessScore}</Dot>
                      ) : null}
                    </div>
                    {l.cars ? <p className="mt-1.5 text-xs text-muted">{l.cars}</p> : null}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-5">
                <EmptyState icon={TrendingUp} title="No new leads" description="Enquiries from the website land here automatically." />
              </div>
            )}
          </Panel>

          <Panel title="Revenue snapshot" description="Demo fees, per client per month">
            <ul className="space-y-2.5">
              {[...lookups.clients]
                .sort((a, b) => b.monthlyFee - a.monthlyFee)
                .map((c) => (
                  <li key={c.id} className="flex items-center gap-3">
                    <Link href={`/console/clients/${c.id}`} className="min-w-0 flex-1 truncate text-sm underline-offset-4 hover:underline">
                      {c.name}
                    </Link>
                    <span className="relative h-1 w-24 overflow-hidden rounded-full bg-white/[0.08]" aria-hidden>
                      <span className="absolute inset-y-0 left-0 rounded-full bg-white/70" style={{ width: `${(c.monthlyFee / stats.mrr) * 100}%` }} />
                    </span>
                    <span className="w-16 text-right text-sm tabular text-muted">{formatGBP(c.monthlyFee)}</span>
                  </li>
                ))}
            </ul>
            <Link href="/console/clients" className="mt-5 inline-flex items-center gap-1 text-[0.78rem] text-muted transition-colors hover:text-text">
              Client book <ArrowRight className="size-3" />
            </Link>
          </Panel>
        </div>
      </div>
    </>
  );
}
