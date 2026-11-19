import { HISTORY_ICON, HISTORY_LABEL } from "@/components/garage/bits";
import { formatDate, formatGBP, formatTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { HistoryEvent } from "@/lib/types";

/** The car's provenance record: every check, service and movement, newest first. */
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
    <ol className={cn("relative space-y-5", className)}>
      <span className="absolute top-2 bottom-2 left-[15px] w-px bg-border" aria-hidden />
      {events.map((e) => {
        const Icon = HISTORY_ICON[e.kind];
        const car = carLabel?.(e.vehicleId);
        return (
          <li key={e.id} className="relative flex gap-4">
            <span
              className={cn(
                "relative z-10 grid size-8 shrink-0 place-items-center rounded-full border bg-surface",
                e.kind === "check" ? "border-gold/40 text-gold" : "border-border text-muted",
              )}
            >
              <Icon className="size-3.5" aria-hidden />
            </span>
            <div className="min-w-0 flex-1 pt-0.5">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                <p className="text-sm font-medium">{e.title}</p>
                <time dateTime={e.at} className="tabular text-xs text-subtle">
                  {formatDate(e.at)} · {formatTime(e.at)}
                </time>
              </div>
              {e.detail ? <p className="mt-1 text-sm leading-relaxed text-muted">{e.detail}</p> : null}
              <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-subtle">
                <span>{HISTORY_LABEL[e.kind]}</span>
                {car ? (
                  <>
                    <span aria-hidden>·</span>
                    <span className="text-muted">{car}</span>
                  </>
                ) : null}
                <span aria-hidden>·</span>
                <span>{e.by}</span>
                {e.cost ? (
                  <>
                    <span aria-hidden>·</span>
                    <span className="tabular text-muted">{formatGBP(e.cost)}</span>
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
