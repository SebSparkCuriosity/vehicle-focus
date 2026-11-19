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

  const W = 640;
  const H = 220;
  const pad = { l: 56, r: 16, t: 16, b: 28 };
  const values = points.map((p) => p.value).concat(purchasePrice ? [purchasePrice] : []);
  const rawMin = Math.min(...values);
  const rawMax = Math.max(...values);
  const headroom = (rawMax - rawMin || rawMax * 0.1) * 0.15;
  const min = rawMin - headroom;
  const max = rawMax + headroom;
  const t0 = new Date(points[0].date).getTime();
  const t1 = new Date(points[points.length - 1].date).getTime();
  const x = (d: string) => pad.l + ((new Date(d).getTime() - t0) / (t1 - t0 || 1)) * (W - pad.l - pad.r);
  const y = (v: number) => pad.t + (1 - (v - min) / (max - min)) * (H - pad.t - pad.b);

  const line = points.map((p, i) => `${i === 0 ? "M" : "L"}${x(p.date).toFixed(1)},${y(p.value).toFixed(1)}`).join(" ");
  const area = `${line} L${x(points[points.length - 1].date).toFixed(1)},${H - pad.b} L${pad.l},${H - pad.b} Z`;
  const ticks = [min + (max - min) * 0.15, min + (max - min) * 0.5, min + (max - min) * 0.85];
  const last = points[points.length - 1];
  const up = last.value >= points[0].value;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={cn("w-full h-auto", className)} role="img" aria-label="Valuation history chart">
      <defs>
        <linearGradient id={`area-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={up ? "var(--success)" : "var(--gold)"} stopOpacity="0.22" />
          <stop offset="100%" stopColor={up ? "var(--success)" : "var(--gold)"} stopOpacity="0" />
        </linearGradient>
      </defs>
      {ticks.map((t) => (
        <g key={t}>
          <line x1={pad.l} x2={W - pad.r} y1={y(t)} y2={y(t)} stroke="var(--border)" strokeDasharray="2 4" />
          <text x={pad.l - 8} y={y(t) + 4} textAnchor="end" fontSize="11" fill="var(--subtle)" className="tabular">
            {formatGBPCompact(t)}
          </text>
        </g>
      ))}
      {purchasePrice ? (
        <g>
          <line x1={pad.l} x2={W - pad.r} y1={y(purchasePrice)} y2={y(purchasePrice)} stroke="var(--muted)" strokeOpacity="0.6" strokeDasharray="6 4" />
          <text x={W - pad.r} y={y(purchasePrice) - 6} textAnchor="end" fontSize="11" fill="var(--muted)">
            Purchase {formatGBPCompact(purchasePrice)}
          </text>
        </g>
      ) : null}
      <path d={area} fill={`url(#area-${id})`} />
      <path d={line} fill="none" stroke={up ? "var(--success)" : "var(--gold)"} strokeWidth="2" strokeLinejoin="round" />
      {points.map((p) => (
        <circle key={p.date} cx={x(p.date)} cy={y(p.value)} r="3.5" fill="var(--bg)" stroke={up ? "var(--success)" : "var(--gold)"} strokeWidth="2" />
      ))}
      <text x={pad.l} y={H - 8} fontSize="11" fill="var(--subtle)">
        {formatDate(points[0].date, { month: "short", year: "numeric" })}
      </text>
      <text x={W - pad.r} y={H - 8} fontSize="11" fill="var(--subtle)" textAnchor="end">
        {formatDate(last.date, { month: "short", year: "numeric" })}
      </text>
    </svg>
  );
}
