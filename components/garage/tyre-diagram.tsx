import { cn } from "@/lib/utils";
import type { TyrePressures } from "@/lib/types";

const CORNERS: { key: keyof TyrePressures; label: string }[] = [
  { key: "fl", label: "Front left" },
  { key: "fr", label: "Front right" },
  { key: "rl", label: "Rear left" },
  { key: "rr", label: "Rear right" },
];

function deviation(value: number, target: number) {
  const off = Math.abs(value - target);
  return off >= 2 ? "danger" : off >= 1 ? "warning" : "ok";
}

function Corner({ label, value, target, unit, align }: { label: string; value: number; target: number; unit: string; align: "left" | "right" }) {
  const dev = deviation(value, target);
  return (
    <div className={cn("flex flex-col justify-center", align === "right" ? "items-start text-left" : "items-end text-right")}>
      <span className="text-[0.72rem] text-white/45">{label}</span>
      <span
        className={cn(
          "tabular font-display text-[1.7rem] leading-none font-normal",
          dev === "danger" ? "text-danger" : dev === "warning" ? "text-warning" : "text-white",
        )}
      >
        {value}
        <span className="ml-1 font-sans text-xs text-white/45">{unit}</span>
      </span>
      <span className="mt-1 tabular text-[0.7rem] text-white/40">target {target}</span>
    </div>
  );
}

/** Top-down car with the four measured tyre pressures against target. */
export function TyreDiagram({ current, target, unit }: { current: TyrePressures; target: TyrePressures; unit: string }) {
  const [fl, fr, rl, rr] = CORNERS;
  const tyreFill = (k: keyof TyrePressures) => {
    const dev = deviation(current[k], target[k]);
    return dev === "danger" ? "var(--danger)" : dev === "warning" ? "var(--warning)" : "rgba(255,255,255,0.55)";
  };
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-stretch gap-x-4 gap-y-7 sm:gap-x-6">
      <Corner label={fl.label} value={current.fl} target={target.fl} unit={unit} align="left" />
      <div className="row-span-2 flex items-center">
        <svg viewBox="0 0 64 128" className="h-40 w-auto" aria-hidden>
          <defs>
            <linearGradient id="tyre-body" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="rgba(255,255,255,0.16)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.04)" />
            </linearGradient>
          </defs>
          <rect x="10" y="4" width="44" height="120" rx="18" fill="url(#tyre-body)" stroke="rgba(255,255,255,0.18)" />
          <rect x="16" y="34" width="32" height="22" rx="6" fill="rgba(0,0,0,0.45)" />
          <rect x="16" y="80" width="32" height="14" rx="5" fill="rgba(0,0,0,0.35)" />
          {(
            [
              ["fl", 4, 18],
              ["fr", 52, 18],
              ["rl", 4, 88],
              ["rr", 52, 88],
            ] as const
          ).map(([k, x, y]) => (
            <rect key={k} x={x} y={y} width="8" height="22" rx="3" fill={tyreFill(k)} />
          ))}
          <path d="M32 9 L28.5 14 L35.5 14 Z" fill="rgba(255,255,255,0.45)" />
        </svg>
      </div>
      <Corner label={fr.label} value={current.fr} target={target.fr} unit={unit} align="right" />
      <Corner label={rl.label} value={current.rl} target={target.rl} unit={unit} align="left" />
      <Corner label={rr.label} value={current.rr} target={target.rr} unit={unit} align="right" />
    </div>
  );
}
