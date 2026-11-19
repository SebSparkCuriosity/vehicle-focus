import { HISTORY_ICON, HISTORY_LABEL } from "@/components/garage/bits";
import { formatDate, formatGBP, formatTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { HistoryEvent } from "@/lib/types";

/** The car's provenance record: every check, service and movement, newest first. Sits inside a glass pane. */
export function HistoryTimeline({
  events,
  carLabel,
  className,
}: {
  events: HistoryEvent[];
  /** Optional per-event car name, used on the collection-wide activity feed. */
  carLabel?: (vehicleId: string) => string | undefined;
  className?: string;
}) {
  return (
    <ol className={cn("relative space-y-6", className)}>
      <span className="absolute top-3 bottom-3 left-[15px] w-px bg-gradient-to-b from-white/15 via-white/10 to-transparent" aria-hidden />
      {events.map((e) => {
        const Icon = HISTORY_ICON[e.kind];
        const car = carLabel?.(e.vehicleId);
        return (
          <li key={e.id} className="relative flex gap-4">
            <span
              className={cn(
                "relative z-10 grid size-8 shrink-0 place-items-center rounded-full border border-white/10 bg-[#141518] shadow-[inset_0_1px_0_rgba(255,255,255,0.07)]",
                e.kind === "check" ? "text-white" : "text-white/45",
              )}
            >
              <Icon className="size-3.5" aria-hidden />
            </span>
            <div className="min-w-0 flex-1 pt-1">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                <p className="text-[0.92rem] font-medium">{e.title}</p>
                <time dateTime={e.at} className="tabular text-[0.75rem] text-white/45">
                  {formatDate(e.at)}, {formatTime(e.at)}
                </time>
              </div>
              {e.detail ? <p className="mt-1 text-sm leading-relaxed text-white/60">{e.detail}</p> : null}
              <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.75rem] text-white/40">
                <span>{HISTORY_LABEL[e.kind]}</span>
                {car ? (
                  <>
                    <span aria-hidden>·</span>
                    <span className="text-white/65">{car}</span>
                  </>
                ) : null}
                <span aria-hidden>·</span>
                <span>{e.by}</span>
                {e.cost ? (
                  <>
                    <span aria-hidden>·</span>
                    <span className="tabular text-white/65">{formatGBP(e.cost)}</span>
                  </>
                ) : null}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
