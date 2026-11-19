import Link from "next/link";
import { CarMedia } from "@/components/brand/car-art";
import { BatteryReading, VehicleStatusBadge } from "@/components/vehicle-status";
import { PaintLabel, Plate } from "@/components/garage/bits";
import { relativeDays } from "@/lib/format";
import type { Vehicle } from "@/lib/types";

/** Photo-led card: the car fills it, a smoked-glass strip carries the facts. */
export function CarCard({ vehicle: v }: { vehicle: Vehicle }) {
  return (
    <Link
      href={`/garage/cars/${v.id}`}
      className="group relative block aspect-[4/5] overflow-hidden rounded-[26px] border border-white/10 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.85)] focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:outline-none lg:aspect-[4/3]"
    >
      <CarMedia
        vehicle={v}
        sizes="(min-width: 1152px) 560px, (min-width: 768px) 50vw, 100vw"
        className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.03]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/30" aria-hidden />
      <PaintLabel vehicle={v} className="top-[28%]" />

      <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
        <VehicleStatusBadge status={v.status} />
        <Plate reg={v.registration} />
      </div>

      <div className="glass-dark absolute inset-x-2.5 bottom-2.5 rounded-[20px] p-3.5 sm:p-4">
        <p className="text-[0.75rem] text-white/55">
          {v.year} {v.make}
        </p>
        <h3 className="mt-0.5 truncate font-display text-[1.5rem] leading-tight font-normal sm:text-[1.6rem]">
          {v.model}
          {v.variant ? <span className="text-white/50"> {v.variant}</span> : null}
        </h3>
        {v.statusNote ? <p className="mt-1 line-clamp-2 text-[0.85rem] leading-snug text-white/65">{v.statusNote}</p> : null}
        <div className="mt-2.5 flex items-center justify-between gap-3 border-t border-white/[0.08] pt-2.5 text-[0.78rem] text-white/55 sm:mt-3 sm:pt-3">
          <span className="min-w-0 truncate">
            {v.location.name} · checked {relativeDays(v.lastCheckAt)}
          </span>
          <BatteryReading voltage={v.battery.voltage} className="shrink-0" />
        </div>
      </div>
    </Link>
  );
}
