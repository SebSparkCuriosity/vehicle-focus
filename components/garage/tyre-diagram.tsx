import { cn } from "@/lib/utils";
import type { TyrePressures } from "@/lib/types";

const CORNERS: { key: keyof TyrePressures; label: string }[] = [
  { key: "fl", label: "Front left" },
  { key: "fr", label: "Front right" },
  { key: "rl", label: "Rear left" },
  { key: "rr", label: "Rear right" },
];

function Corner({ label, value, target, unit, align }: { label: string; value: number; target: number; unit: string; align: "left" | "right" }) {
  const off = Math.abs(value - target);
  const tone = off >= 2 ? "text-danger" : off >= 1 ? "text-warning" : "text-text";
  return (
    <div className={cn("flex flex-col justify-center", align === "right" ? "items-start text-left" : "items-end text-right")}>
      <span className="text-[0.68rem] tracking-wide text-subtle uppercase">{label}</span>
      <span className={cn("tabular font-display text-lg font-semibold", tone)}>
        {value}
        <span className="ml-0.5 text-xs font-normal text-muted">{unit}</span>
      </span>
      <span className="tabular text-[0.7rem] text-subtle">
        target {target}
      </span>
    </div>
  );
}

/** Top-down car with the four measured tyre pressures against target. */
export function TyreDiagram({ current, target, unit }: { current: TyrePressures; target: TyrePressures; unit: string }) {
  const [fl, fr, rl, rr] = CORNERS;
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-stretch gap-x-3 gap-y-6 sm:gap-x-5">
      <Corner label={fl.label} value={current.fl} target={target.fl} unit={unit} align="left" />
      <div className="row-span-2 flex items-center">
        <svg viewBox="0 0 64 128" className="h-36 w-auto" aria-hidden>
          <rect x="10" y="4" width="44" height="120" rx="18" fill="var(--surface-3)" stroke="var(--border-strong)" />
          <rect x="16" y="34" width="32" height="22" rx="5" fill="var(--bg)" opacity="0.8" />
          <rect x="16" y="80" width="32" height="14" rx="4" fill="var(--bg)" opacity="0.6" />
          {[
            [4, 18],
            [52, 18],
            [4, 88],
            [52, 88],
          ].map(([x, y]) => (
            <rect key={`${x}-${y}`} x={x} y={y} width="8" height="22" rx="2.5" fill="var(--gold)" opacity="0.85" />
          ))}
          <path d="M32 8 L28 14 L36 14 Z" fill="var(--muted)" />
        </svg>
      </div>
      <Corner label={fr.label} value={current.fr} target={target.fr} unit={unit} align="right" />
      <Corner label={rl.label} value={current.rl} target={target.rl} unit={unit} align="left" />
      <Corner label={rr.label} value={current.rr} target={target.rr} unit={unit} align="right" />
    </div>
  );
}
