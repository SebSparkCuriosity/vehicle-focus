import type { Metadata } from "next";
import Link from "next/link";
import { ClipboardList, Plus } from "lucide-react";
import { CarMedia } from "@/components/brand/car-art";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState, PageTitle, Plate, SectionHeader, StatusText } from "@/components/garage/bits";
import { updateRequestStatus } from "@/lib/actions";
import { getRequests, getVehicles } from "@/lib/data/queries";
import { REQUEST_STATUS_META, REQUEST_TYPE_META, vehicleName } from "@/lib/domain";
import { formatDateTime, formatGBP, timeAgo } from "@/lib/format";
import { requireClient } from "@/lib/session";
import type { ServiceRequest, Vehicle } from "@/lib/types";

export const metadata: Metadata = { title: "Requests" };

function RequestRow({ r, vehicle }: { r: ServiceRequest; vehicle?: Vehicle }) {
  const status = REQUEST_STATUS_META[r.status];
  return (
    <li>
      <Card className="rounded-[24px] p-4 sm:p-5">
        <div className="flex items-start gap-4">
          {vehicle ? (
            <Link
              href={`/garage/cars/${vehicle.id}`}
              className="relative hidden size-16 shrink-0 overflow-hidden rounded-2xl border border-white/10 sm:block"
              aria-label={vehicleName(vehicle)}
            >
              <CarMedia vehicle={vehicle} sizes="64px" className="absolute inset-0" />
            </Link>
          ) : null}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
              <div className="min-w-0">
                <p className="text-[0.75rem] text-white/45">{REQUEST_TYPE_META[r.type].label}</p>
                <h3 className="mt-0.5 text-[1rem] font-medium">{r.title}</h3>
              </div>
              <StatusText tone={status.tone} className="mt-1">
                {status.label}
              </StatusText>
            </div>

            <div className="mt-3 grid gap-x-6 gap-y-1.5 text-[0.85rem] text-white/60 sm:grid-cols-2 [&>*]:min-w-0">
              {vehicle ? (
                <Link href={`/garage/cars/${vehicle.id}`} className="flex items-center gap-2 hover:text-white">
                  <Plate reg={vehicle.registration} />
                  <span className="truncate">{vehicleName(vehicle)}</span>
                </Link>
              ) : null}
              <p className="tabular">{formatDateTime(r.when)}</p>
              <p className="truncate">{r.location}</p>
              <p className="truncate text-white/45">
                Raised by {r.createdBy}, {timeAgo(r.createdAt)}
              </p>
            </div>

            {r.notes ? <p className="glass-inset mt-3 rounded-2xl px-3.5 py-2.5 text-sm text-white/70">{r.notes}</p> : null}

            {r.quote || r.status === "new" ? (
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.08] pt-3">
                {r.quote ? (
                  <p className="text-sm">
                    <span className="text-white/50">Quote </span>
                    <span className="tabular font-medium">{formatGBP(r.quote)}</span>
                  </p>
                ) : (
                  <p className="text-[0.78rem] text-white/45">Waiting for the team to confirm.</p>
                )}
                {r.status === "new" ? (
                  <form action={updateRequestStatus.bind(null, r.id, "cancelled")}>
                    <button
                      type="submit"
                      className="min-h-10 text-sm text-white/60 underline decoration-white/25 underline-offset-4 transition-colors hover:text-danger hover:decoration-danger/60"
                    >
                      Cancel request
                    </button>
                  </form>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </Card>
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
    <div className="space-y-12">
      <PageTitle
        title="Requests"
        intro="You, or anyone you've authorised, can ask. We confirm each one personally."
        action={
          <ButtonLink href="/garage/requests/new" className="h-11">
            <Plus aria-hidden />
            New request
          </ButtonLink>
        }
      />

      <section>
        <SectionHeader title={open.length ? `In hand (${open.length})` : "In hand"} />
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
            body="Need a car ready for the weekend, at the airport or in for a service? Ask here."
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
          <SectionHeader title="Completed and cancelled" />
          <ul className="space-y-3 opacity-75">
            {past.map((r) => (
              <RequestRow key={r.id} r={r} vehicle={findVehicle(r.vehicleId)} />
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
