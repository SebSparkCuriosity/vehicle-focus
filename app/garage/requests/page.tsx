import type { Metadata } from "next";
import Link from "next/link";
import { ClipboardList, MapPin, Plus, UserRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState, Plate, REQUEST_ICON, SectionHeader } from "@/components/garage/bits";
import { updateRequestStatus } from "@/lib/actions";
import { getRequests, getVehicles } from "@/lib/data/queries";
import { REQUEST_STATUS_META, REQUEST_TYPE_META, vehicleName } from "@/lib/domain";
import { formatDateTime, formatGBP, timeAgo } from "@/lib/format";
import { requireClient } from "@/lib/session";
import type { ServiceRequest, Vehicle } from "@/lib/types";

export const metadata: Metadata = { title: "Requests" };

function RequestRow({ r, vehicle }: { r: ServiceRequest; vehicle?: Vehicle }) {
  const Icon = REQUEST_ICON[r.type];
  const status = REQUEST_STATUS_META[r.status];
  return (
    <li className="rounded-xl border border-border bg-surface p-4 sm:p-5">
      <div className="flex items-start gap-4">
        <span className="hidden size-10 shrink-0 place-items-center rounded-lg bg-surface-2 text-muted sm:grid">
          <Icon className="size-5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-xs text-subtle">{REQUEST_TYPE_META[r.type].label}</p>
              <h3 className="font-medium">{r.title}</h3>
            </div>
            <Badge tone={status.tone} dot>
              {status.label}
            </Badge>
          </div>

          <div className="mt-3 grid gap-x-6 gap-y-2 text-sm text-muted sm:grid-cols-2">
            {vehicle ? (
              <Link href={`/garage/cars/${vehicle.id}`} className="flex items-center gap-2 hover:text-text">
                <Plate reg={vehicle.registration} />
                <span className="truncate">{vehicleName(vehicle)}</span>
              </Link>
            ) : null}
            <p className="tabular">{formatDateTime(r.when)}</p>
            <p className="flex items-center gap-2">
              <MapPin className="size-3.5 shrink-0 text-subtle" aria-hidden />
              <span className="truncate">{r.location}</span>
            </p>
            <p className="flex items-center gap-2">
              <UserRound className="size-3.5 shrink-0 text-subtle" aria-hidden />
              <span className="truncate">
                {r.createdBy} · {timeAgo(r.createdAt)}
              </span>
            </p>
          </div>

          {r.notes ? <p className="mt-3 rounded-lg bg-surface-2 px-3 py-2 text-sm text-muted">{r.notes}</p> : null}

          {r.quote || r.status === "new" ? (
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3">
              {r.quote ? (
                <p className="text-sm">
                  <span className="text-muted">Quote </span>
                  <span className="tabular font-medium">{formatGBP(r.quote)}</span>
                </p>
              ) : (
                <p className="text-xs text-subtle">Waiting for the team to confirm.</p>
              )}
              {r.status === "new" ? (
                <form action={updateRequestStatus.bind(null, r.id, "cancelled")}>
                  <button type="submit" className="text-sm text-muted underline-offset-4 transition-colors hover:text-danger hover:underline">
                    Cancel request
                  </button>
                </form>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </li>
  );
}

export default async function RequestsPage() {
  const { clientId } = await requireClient();
  const [requests, vehicles] = await Promise.all([getRequests({ clientId }), getVehicles({ clientId })]);
  const open = requests.filter((r) => r.status === "new" || r.status === "scheduled" || r.status === "in-progress");
  const past = requests.filter((r) => r.status === "done" || r.status === "cancelled");
  const findVehicle = (id: string) => vehicles.find((v) => v.id === id);

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Requests</p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">Everything you&apos;ve asked for</h1>
          <p className="mt-2 max-w-xl text-muted">You, or anyone you&apos;ve authorised, can raise a request. We confirm each one personally.</p>
        </div>
        <ButtonLink href="/garage/requests/new">
          <Plus aria-hidden />
          New request
        </ButtonLink>
      </div>

      <section>
        <SectionHeader eyebrow="In hand" title={`Open (${open.length})`} />
        {open.length ? (
          <ul className="space-y-3">
            {open.map((r) => (
              <RequestRow key={r.id} r={r} vehicle={findVehicle(r.vehicleId)} />
            ))}
          </ul>
        ) : (
          <EmptyState
            icon={ClipboardList}
            title="Nothing open right now"
            body="Need a car ready for the weekend, moved to the airport or booked in for a service? Ask here."
            action={
              <ButtonLink href="/garage/requests/new" size="sm">
                New request
              </ButtonLink>
            }
          />
        )}
      </section>

      {past.length ? (
        <section>
          <SectionHeader eyebrow="Archive" title="Completed and cancelled" />
          <ul className="space-y-3 opacity-80">
            {past.map((r) => (
              <RequestRow key={r.id} r={r} vehicle={findVehicle(r.vehicleId)} />
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
