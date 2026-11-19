import { useId } from "react";
import { formatGBPCompact, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

/** Tiny trend line for cards and tables. */
export function Sparkline({
  values,
  className,
  tone = "gold",
}: {
  values: number[];
  className?: string;
  tone?: "gold" | "success" | "danger" | "muted";
}) {
  if (values.length < 2) return null;
  const w = 100;
  const h = 28;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const pts = values.map((v, i) => [(i / (values.length - 1)) * w, h - 2 - ((v - min) / span) * (h - 4)]);
  const d = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const stroke = { gold: "var(--gold)", success: "var(--success)", danger: "var(--danger)", muted: "var(--muted)" }[tone];
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className={cn("h-7 w-24", className)} aria-hidden>
      <path d={d} fill="none" stroke={stroke} strokeWidth="1.6" vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Valuation history as an area chart with purchase price reference line.
 * Server-rendered SVG, no client JS.
 */
export function ValueChart({
  points,
  purchasePrice,
  className,
}: {
  points: { date: string; value: number }[];
  purchasePrice?: number;
  className?: string;
}) {
  const id = useId().replace(/:/g, "");
  if (points.length < 2) return <p className="text-sm text-muted">Not enough valuations yet to draw a trend.</p>;

  // Lines and fill are drawn in a stretchable 0-100 SVG space; labels and dots
  // are real HTML positioned by percentage, so text stays a readable 12px on a
  // phone instead of shrinking with the graphic.
  const values = points.map((p) => p.value).concat(purchasePrice ? [purchasePrice] : []);
  const rawMin = Math.min(...values);
  const rawMax = Math.max(...values);
  const headroom = (rawMax - rawMin || rawMax * 0.1) * 0.15;
  const min = rawMin - headroom;
  const max = rawMax + headroom;
  const t0 = new Date(points[0].date).getTime();
  const t1 = new Date(points[points.length - 1].date).getTime();
  const x = (d: string) => ((new Date(d).getTime() - t0) / (t1 - t0 || 1)) * 100;
  const y = (v: number) => (1 - (v - min) / (max - min)) * 100;

  const line = points.map((p, i) => `${i === 0 ? "M" : "L"}${x(p.date).toFixed(2)},${y(p.value).toFixed(2)}`).join(" ");
  const area = `${line} L100,100 L0,100 Z`;
  const ticks = [min + (max - min) * 0.15, min + (max - min) * 0.5, min + (max - min) * 0.85];
  const last = points[points.length - 1];
  const up = last.value >= points[0].value;
  const colour = up ? "var(--success)" : "var(--accent)";

  return (
    <div className={cn("w-full", className)} role="img" aria-label="Valuation history chart">
      <div className="relative ml-14 h-44 sm:h-56">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden>
          <defs>
            <linearGradient id={`area-${id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={colour} stopOpacity="0.22" />
              <stop offset="100%" stopColor={colour} stopOpacity="0" />
            </linearGradient>
          </defs>
          {ticks.map((t) => (
            <line key={t} x1="0" x2="100" y1={y(t)} y2={y(t)} stroke="var(--border)" strokeDasharray="2 4" vectorEffect="non-scaling-stroke" />
          ))}
          {purchasePrice ? (
            <line
              x1="0"
              x2="100"
              y1={y(purchasePrice)}
              y2={y(purchasePrice)}
              stroke="var(--muted)"
              strokeOpacity="0.6"
              strokeDasharray="6 4"
              vectorEffect="non-scaling-stroke"
            />
          ) : null}
          <path d={area} fill={`url(#area-${id})`} />
          <path d={line} fill="none" stroke={colour} strokeWidth="2" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        </svg>

        {ticks.map((t) => (
          <span
            key={t}
            className="tabular absolute right-[calc(100%+8px)] -translate-y-1/2 text-xs whitespace-nowrap text-subtle"
            style={{ top: `${y(t)}%` }}
          >
            {formatGBPCompact(t)}
          </span>
        ))}
        {purchasePrice ? (
          <span
            className="absolute right-0 -translate-y-[calc(100%+4px)] text-xs whitespace-nowrap text-muted"
            style={{ top: `${y(purchasePrice)}%` }}
          >
            Purchase {formatGBPCompact(purchasePrice)}
          </span>
        ) : null}
        {points.map((p) => (
          <span
            key={p.date}
            className="absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 bg-bg"
            style={{ left: `${x(p.date)}%`, top: `${y(p.value)}%`, borderColor: colour }}
            aria-hidden
          />
        ))}
      </div>
      <div className="mt-2 ml-14 flex justify-between text-xs text-subtle">
        <span>{formatDate(points[0].date, { month: "short", year: "numeric" })}</span>
        <span>{formatDate(last.date, { month: "short", year: "numeric" })}</span>
      </div>
    </div>
  );
}
