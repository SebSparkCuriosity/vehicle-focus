import Link from "next/link";
import { Activity, Camera, FileText, Handshake, PoundSterling, Route, Sparkles, StickyNote, Wrench, CircleCheck, Lock } from "lucide-react";
import { Dot, JobKindBadge, Initials } from "@/components/console/ui";
import { durationLabel } from "@/components/console/dates";
import { REQUEST_STATUS_META, REQUEST_TYPE_META, vehicleName } from "@/lib/domain";
import { formatDateTime, formatGBP, formatTime, timeAgo, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Client, HistoryEvent, HistoryKind, Job, Partner, ServiceRequest, TeamMember, Vehicle } from "@/lib/types";

// Reusable row/card renderers used on several console pages.

export function JobRow({ job, vehicle, client, member }: { job: Job; vehicle?: Vehicle; client?: Client; member?: TeamMember }) {
  return (
    <li className="flex items-center gap-4 py-3">
      <div className="w-12 shrink-0">
        <p className="text-sm font-medium tabular">{formatTime(job.start)}</p>
        <p className="text-[0.7rem] text-subtle tabular">{durationLabel(job.durationMins)}</p>
      </div>
      <div className="min-w-0 flex-1">
        <Link
          href={vehicle ? `/console/fleet/${vehicle.id}` : "#"}
          className="block truncate text-sm font-medium decoration-white/30 underline-offset-4 hover:underline"
        >
          {job.title}
        </Link>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
          <JobKindBadge kind={job.kind} />
          {job.status === "in-progress" ? <Dot tone="warning">Under way</Dot> : null}
        </div>
        <p className="mt-1 truncate text-[0.75rem] text-subtle">
          {client?.name ?? "Unknown client"} · {vehicle?.registration} · {job.location}
        </p>
      </div>
      {member ? <Initials initials={member.initials} title={member.name} /> : null}
    </li>
  );
}

export function RequestCard({
  request,
  vehicle,
  client,
  assignee,
  partner,
  compact = false,
}: {
  request: ServiceRequest;
  vehicle?: Vehicle;
  client?: Client;
  assignee?: TeamMember;
  partner?: Partner;
  compact?: boolean;
}) {
  const status = REQUEST_STATUS_META[request.status];
  return (
    <Link
      href={`/console/requests/${request.id}`}
      className="glass-inset block rounded-xl p-3.5 transition-colors hover:border-white/15 hover:bg-white/[0.07]"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium leading-snug">{request.title}</p>
        {compact ? <Dot tone={status.tone}>{status.label}</Dot> : null}
      </div>
      <p className="mt-1 text-[0.78rem] text-muted">
        {vehicle ? vehicleName(vehicle) : "Unknown car"} · {client?.name}
      </p>
      <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.75rem] text-subtle">
        <span className="text-white/75">{REQUEST_TYPE_META[request.type].label}</span>
        <span className="tabular">{formatDateTime(request.when)}</span>
      </div>
      {!compact ? (
        <>
          <p className="mt-1 truncate text-[0.75rem] text-subtle">{request.location}</p>
          <div className="mt-3 flex items-center justify-between gap-2 border-t border-white/[0.06] pt-2.5">
            <span className="truncate text-[0.7rem] text-subtle">
              {request.createdBy} · {timeAgo(request.createdAt)}
            </span>
            <span className="flex items-center gap-1.5">
              {request.quote ? <span className="text-[0.7rem] text-muted tabular">{formatGBP(request.quote)}</span> : null}
              {partner ? (
                <span title={partner.name} className="grid size-6 place-items-center rounded-full border border-white/10 bg-white/[0.06] text-subtle">
                  <Handshake className="size-3" />
                </span>
              ) : null}
              {assignee ? <Initials initials={assignee.initials} title={assignee.name} /> : null}
            </span>
          </div>
        </>
      ) : null}
    </Link>
  );
}

const HISTORY_ICON: Record<HistoryKind, typeof Activity> = {
  check: CircleCheck,
  service: Wrench,
  movement: Route,
  detailing: Sparkles,
  document: FileText,
  valuation: PoundSterling,
  note: StickyNote,
  handover: Camera,
};

export function HistoryItem({ event, vehicle, showVehicle = false }: { event: HistoryEvent; vehicle?: Vehicle; showVehicle?: boolean }) {
  const Icon = HISTORY_ICON[event.kind];
  return (
    <li className="group relative flex gap-3 pb-5 last:pb-0">
      <span className="absolute left-[13px] top-8 bottom-1 w-px bg-white/[0.08] group-last:hidden" aria-hidden />
      <span
        className={cn(
          "relative grid size-7 shrink-0 place-items-center rounded-full border",
          event.visibleToClient ? "border-white/10 bg-white/[0.05] text-white/60" : "border-warning/30 bg-warning-soft text-warning",
        )}
      >
        <Icon className="size-3.5" aria-hidden />
      </span>
      <div className="min-w-0 flex-1 pt-0.5">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-medium">{event.title}</p>
          {!event.visibleToClient ? (
            <span className="inline-flex items-center gap-1 text-[0.72rem] font-medium text-warning">
              <Lock className="size-3" /> Internal
            </span>
          ) : null}
          {event.cost ? <span className="text-[0.78rem] text-muted tabular">{formatGBP(event.cost)}</span> : null}
        </div>
        <p className="mt-0.5 text-[0.75rem] text-subtle">
          {showVehicle && vehicle ? (
            <>
              <Link href={`/console/fleet/${vehicle.id}`} className="text-muted underline-offset-4 hover:text-text hover:underline">
                {vehicleName(vehicle)}
              </Link>{" "}
              ·{" "}
            </>
          ) : null}
          {formatDate(event.at, { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })} · {event.by}
        </p>
        {event.detail ? <p className="mt-1.5 text-sm text-muted">{event.detail}</p> : null}
        {event.readings ? (
          <dl className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[0.75rem] text-subtle">
            <div>
              <dt className="inline">Battery </dt>
              <dd className="inline tabular text-muted">{event.readings.batteryVoltage.toFixed(1)}V</dd>
            </div>
            <div>
              <dt className="inline">Tyres </dt>
              <dd className="inline tabular text-muted">
                {event.readings.tyres.fl}/{event.readings.tyres.fr}/{event.readings.tyres.rl}/{event.readings.tyres.rr}
              </dd>
            </div>
            <div>
              <dt className="inline">Mileage </dt>
              <dd className="inline tabular text-muted">{event.readings.mileage.toLocaleString("en-GB")}</dd>
            </div>
            <div>
              <dt className="inline">Fluids </dt>
              <dd className={cn("inline", event.readings.fluidsOk ? "text-success" : "text-danger")}>{event.readings.fluidsOk ? "OK" : "Attention"}</dd>
            </div>
          </dl>
        ) : null}
      </div>
    </li>
  );
}
