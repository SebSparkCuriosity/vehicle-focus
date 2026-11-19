import { Badge } from "@/components/ui/badge";
import { STATUS_META, batteryTone } from "@/lib/domain";
import { cn } from "@/lib/utils";
import type { VehicleStatus } from "@/lib/types";

export function VehicleStatusBadge({ status, className }: { status: VehicleStatus; className?: string }) {
  const meta = STATUS_META[status];
  return (
    <Badge tone={meta.tone} dot className={className}>
      {meta.label}
    </Badge>
  );
}

const toneText = { success: "text-success", warning: "text-warning", danger: "text-danger" } as const;
const toneBg = { success: "bg-success", warning: "bg-warning", danger: "bg-danger" } as const;

/** Resting voltage with a small gauge. 11.8V reads empty, 13.0V reads full. */
export function BatteryReading({ voltage, className }: { voltage: number; className?: string }) {
  const tone = batteryTone(voltage);
  const pct = Math.max(0, Math.min(1, (voltage - 11.8) / 1.2));
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span className="relative h-2 w-10 overflow-hidden rounded-full bg-surface-3" aria-hidden>
        <span className={cn("absolute inset-y-0 left-0 rounded-full", toneBg[tone])} style={{ width: `${pct * 100}%` }} />
      </span>
      <span className={cn("tabular text-sm font-medium", toneText[tone])}>{voltage.toFixed(1)}V</span>
    </span>
  );
}
