import Link from "next/link";
import { notFound } from "next/navigation";
import { Ban, Check, Lock, MapPin, Play, RotateCcw, CalendarDays } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CarArt } from "@/components/brand/car-art";
import { BatteryReading, VehicleStatusBadge } from "@/components/vehicle-status";
import { Detail, EmptyState, PageHeader, Panel, TierBadge } from "@/components/console/ui";
import { JobRow } from "@/components/console/rows";
import { ScheduleForm } from "@/components/console/schedule-form";
import { toDateInput, toTimeInput } from "@/components/console/dates";
import { getLookups } from "@/components/console/lookups";
import { getDueItems, getJobs, getRequest } from "@/lib/data/queries";
import { updateRequestStatus } from "@/lib/actions";
import { REQUEST_STATUS_META, REQUEST_TYPE_META, attentionReasons, tyreDeviation, vehicleFullName } from "@/lib/domain";
import { formatDateTime, formatGBP, formatMiles, relativeDays, timeAgo } from "@/lib/format";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const r = await getRequest(id);
  return { title: r?.title ?? "Request" };
}

export default async function RequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const request = await getRequest(id);
  if (!request) notFound();

  const [lookups, jobs, due] = await Promise.all([getLookups(), getJobs({ vehicleId: request.vehicleId }), getDueItems({ vehicleId: request.vehicleId })]);
  const vehicle = lookups.vehicle.get(request.vehicleId);
  const client = lookups.client.get(request.clientId);
  if (!vehicle || !client) notFound();

  const requestJobs = jobs.filter((j) => j.requestId === request.id);
  const status = REQUEST_STATUS_META[request.status];
  const assignee = request.assigneeId ? lookups.member.get(request.assigneeId) : undefined;
  const partner = request.partnerId ? lookups.partner.get(request.partnerId) : undefined;
  const reasons = attentionReasons(vehicle, due);

  const statusButton = (label: string, next: typeof request.status, Icon: typeof Play, variant: "primary" | "secondary" | "danger" = "secondary") => (
    <form action={updateRequestStatus.bind(null, request.id, next)}>
      <Button size="sm" variant={variant}>
        <Icon /> {label}
      </Button>
    </form>
  );

  return (
    <>
      <PageHeader
        back={{ href: "/console/requests", label: "Request board" }}
        eyebrow={REQUEST_TYPE_META[request.type].label}
        title={request.title}
        description={
          <span className="flex flex-wrap items-center gap-2">
            <Badge tone={status.tone} dot>
              {status.label}
            </Badge>
            <span>
              Raised by {request.createdBy} {timeAgo(request.createdAt)}
            </span>
          </span>
        }
        actions={
          <>
            {request.status === "new" || request.status === "scheduled" ? statusButton("Start", "in-progress", Play) : null}
            {request.status !== "done" && request.status !== "cancelled" ? statusButton("Mark done", "done", Check, "primary") : null}
            {request.status !== "cancelled" && request.status !== "done" ? statusButton("Cancel", "cancelled", Ban, "danger") : null}
            {request.status === "done" || request.status === "cancelled" ? statusButton("Reopen", "new", RotateCcw) : null}
          </>
        }
      />

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <Panel title={"What's needed"}>
            <dl className="grid gap-4 sm:grid-cols-2">
              <Detail label="Needed">
                <span className="tabular">{formatDateTime(request.when)}</span>{" "}
                <span className="text-xs text-subtle">({relativeDays(request.when)})</span>
              </Detail>
              <Detail label="Where">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="size-3.5 text-subtle" />
                  {request.location}
                </span>
              </Detail>
              <Detail label="Assigned to">{assignee ? `${assignee.name}, ${assignee.role}` : <span className="text-subtle">Not assigned</span>}</Detail>
              <Detail label="Partner">{partner ? `${partner.name} (${partner.kind})` : <span className="text-subtle">In house</span>}</Detail>
              <Detail label="Quote">{request.quote ? <span className="tabular">{formatGBP(request.quote)}</span> : <span className="text-subtle">None given</span>}</Detail>
              <Detail label="Request type">{REQUEST_TYPE_META[request.type].description}</Detail>
            </dl>
            {request.notes ? (
              <div className="mt-4 rounded-lg border border-border bg-surface-2 p-3">
                <p className="text-xs text-subtle">Notes from {request.createdBy}</p>
                <p className="mt-1 text-sm">{request.notes}</p>
              </div>
            ) : null}
          </Panel>

          <Panel
            title={request.status === "new" ? "Schedule this request" : "Add another job"}
            description={
              request.status === "new"
                ? "Creates a job on the schedule, assigns it and sends the client a confirmation in The Garage."
                : "Already scheduled. Use this for a follow-up visit, such as a collection after a service."
            }
          >
            <ScheduleForm
              requestId={request.id}
              team={lookups.team.map((t) => ({ id: t.id, name: t.name, role: t.role }))}
              partners={lookups.partners.map((p) => ({ id: p.id, name: p.name, kind: p.kind, region: p.region }))}
              defaults={{
                date: toDateInput(request.when),
                time: toTimeInput(request.when),
                assigneeId: request.assigneeId,
                partnerId: request.partnerId,
                quote: request.quote,
              }}
              submitLabel={request.status === "new" ? "Schedule and notify client" : "Add job and notify client"}
            />
          </Panel>

          <Panel title="Jobs for this request" bodyClassName="py-1">
            {requestJobs.length ? (
              <ul className="divide-y divide-border">
                {requestJobs.map((j) => (
                  <JobRow key={j.id} job={j} vehicle={vehicle} client={client} member={lookups.member.get(j.assigneeId)} />
                ))}
              </ul>
            ) : (
              <div className="py-3">
                <EmptyState icon={CalendarDays} title="Not on the schedule yet" description="Schedule it above to create a job." />
              </div>
            )}
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel
            title="Client"
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
            <dl className="mt-4 space-y-3">
              <Detail label="Contact by">{client.preferences.contactPreference}</Detail>
              <Detail label="Discretion">
                {client.preferences.nda ? (
                  <span className="inline-flex items-center gap-1.5 text-warning">
                    <Lock className="size-3.5" /> NDA in place
                  </span>
                ) : (
                  "Standard"
                )}
              </Detail>
              <Detail label="Standing instructions">{client.preferences.notes}</Detail>
              {client.contacts.length ? (
                <Detail label="Delegates">
                  <ul className="space-y-1">
                    {client.contacts.map((c) => (
                      <li key={c.email} className="text-sm">
                        {c.name} <span className="text-xs text-subtle">· {c.role}{c.canBook ? ", can book" : ""}</span>
                      </li>
                    ))}
                  </ul>
                </Detail>
              ) : null}
            </dl>
          </Panel>

          <Panel
            title="The car right now"
            action={
              <Link href={`/console/fleet/${vehicle.id}`} className="text-xs text-muted hover:text-gold">
                Full record
              </Link>
            }
          >
            <CarArt bodyStyle={vehicle.bodyStyle} paint={vehicle.paintHex} title={vehicleFullName(vehicle)} className="mx-auto max-w-xs" />
            <p className="mt-2 text-sm font-medium">{vehicleFullName(vehicle)}</p>
            <p className="text-xs text-muted">
              {vehicle.registration} · {vehicle.colour}
            </p>
            <dl className="mt-4 grid grid-cols-2 gap-3">
              <Detail label="Status">
                <VehicleStatusBadge status={vehicle.status} />
              </Detail>
              <Detail label="Battery">
                <BatteryReading voltage={vehicle.battery.voltage} />
              </Detail>
              <Detail label="Tyres">{tyreDeviation(vehicle) >= 1 ? <span className="text-warning">Off target</span> : <span className="text-success">On target</span>}</Detail>
              <Detail label="Mileage">
                <span className="tabular">{formatMiles(vehicle.mileage)}</span>
              </Detail>
              <Detail label="Location" className="col-span-2">
                {vehicle.location.name}
              </Detail>
            </dl>
            {vehicle.statusNote ? <p className="mt-3 text-xs text-muted">{vehicle.statusNote}</p> : null}
            {reasons.length ? (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {reasons.map((r) => (
                  <Badge key={r.label} tone={r.severity === "high" ? "danger" : "warning"}>
                    {r.label}
                  </Badge>
                ))}
              </div>
            ) : null}
          </Panel>
        </div>
      </div>
    </>
  );
}
