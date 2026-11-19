import Link from "next/link";
import { ClipboardCheck, MapPin } from "lucide-react";
import { CarArt } from "@/components/brand/car-art";
import { BatteryReading, VehicleStatusBadge } from "@/components/vehicle-status";
import { Plate } from "@/components/garage/bits";
import { relativeDays } from "@/lib/format";
import type { Vehicle } from "@/lib/types";

export function CarCard({ vehicle: v }: { vehicle: Vehicle }) {
  return (
    <Link
      href={`/garage/cars/${v.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-surface transition-colors hover:border-border-strong"
    >
      <div className="relative bg-gradient-to-b from-surface-2 to-surface px-6 pt-8 pb-2">
        <div className="absolute inset-0 spotlight opacity-70" aria-hidden />
        <div className="absolute top-3 left-3">
          <VehicleStatusBadge status={v.status} />
        </div>
        <CarArt
          bodyStyle={v.bodyStyle}
          paint={v.paintHex}
          title={`${v.make} ${v.model} in ${v.colour}`}
          className="relative mx-auto max-w-[300px] transition-transform duration-500 group-hover:-translate-y-0.5"
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4 pt-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs text-muted">
              {v.year} {v.make}
            </p>
            <h3 className="truncate font-display text-base font-semibold tracking-tight">
              {v.model}
              {v.variant ? <span className="font-normal text-muted"> {v.variant}</span> : null}
            </h3>
          </div>
          <Plate reg={v.registration} className="mt-1 shrink-0" />
        </div>

        {v.statusNote ? <p className="line-clamp-2 text-sm text-muted">{v.statusNote}</p> : null}

        <div className="mt-auto space-y-2 border-t border-border pt-3 text-xs text-muted">
          <p className="flex items-center gap-2">
            <MapPin className="size-3.5 shrink-0 text-subtle" aria-hidden />
            <span className="truncate">{v.location.name}</span>
          </p>
          <div className="flex items-center justify-between gap-2">
            <p className="flex items-center gap-2">
              <ClipboardCheck className="size-3.5 shrink-0 text-subtle" aria-hidden />
              Checked {relativeDays(v.lastCheckAt)}
            </p>
            <BatteryReading voltage={v.battery.voltage} />
          </div>
        </div>
      </div>
    </Link>
  );
}
