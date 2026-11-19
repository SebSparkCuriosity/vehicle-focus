"use client";

import { useActionState, useRef } from "react";
import { ClipboardCheck, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Textarea } from "@/components/ui/form";
import { logCheck, type ActionResult } from "@/lib/actions";
import { cn } from "@/lib/utils";
import type { TyrePressures } from "@/lib/types";

// Built to be used one-handed on a phone in a garage: big numeric fields with
// the right keyboard, tyres laid out like the car's corners, whole-row toggles
// and a submit button that stays in reach while the form is on screen.

const bigInput =
  "h-12 w-full min-w-0 rounded-xl border border-white/10 bg-black/30 text-center text-lg font-medium text-text tabular shadow-[inset_0_1px_2px_rgba(0,0,0,0.35)] transition-colors focus:border-white/30 focus:bg-black/40 focus:outline-none focus:ring-4 focus:ring-white/[0.06] [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none";

const TYRE_LABEL = { fl: "Front left", fr: "Front right", rl: "Rear left", rr: "Rear right" } as const;

function TyreInput({ corner, target, step }: { corner: keyof typeof TYRE_LABEL; target: number; step: number }) {
  const ref = useRef<HTMLInputElement>(null);
  const label = TYRE_LABEL[corner];
  const bump = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    if (dir > 0) el.stepUp();
    else el.stepDown();
  };
  // Phones: reading full width on top, minus and plus as two wide buttons below.
  // From md: minus, reading, plus in one row.
  const stepBtn =
    "grid h-12 w-full shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.05] text-white/80 transition-colors hover:bg-white/[0.09] active:bg-white/[0.14] md:size-12";
  return (
    <div className="glass-inset rounded-2xl p-2.5">
      <div className="flex flex-col px-1 md:flex-row md:items-baseline md:justify-between md:gap-x-2">
        <label htmlFor={`tyre-${corner}`} className="text-[0.85rem] font-medium text-white/85 md:text-[0.8rem]">
          {label}
        </label>
        <span className="text-[0.78rem] text-subtle tabular">target {target}</span>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-1.5 md:flex md:items-center">
        <button type="button" onClick={() => bump(-1)} className={stepBtn} aria-label={`Lower ${label}`}>
          <Minus className="size-4" />
        </button>
        <input
          ref={ref}
          id={`tyre-${corner}`}
          name={corner}
          type="number"
          step={step}
          min={10}
          max={60}
          inputMode="decimal"
          enterKeyHint="next"
          defaultValue={target}
          required
          className={`${bigInput} order-first col-span-2 w-full min-w-0 md:order-none md:flex-1`}
        />
        <button type="button" onClick={() => bump(1)} className={stepBtn} aria-label={`Raise ${label}`}>
          <Plus className="size-4" />
        </button>
      </div>
    </div>
  );
}

/** A whole-row switch: the full row is the tap target, not a 16px box. */
function Toggle({
  name,
  label,
  hint,
  defaultChecked = true,
  withOffFallback = false,
}: {
  name: string;
  label: string;
  hint?: string;
  defaultChecked?: boolean;
  /** Adds a hidden "off" after the checkbox, for fields the action reads as on/off. */
  withOffFallback?: boolean;
}) {
  return (
    <label className="flex min-h-14 cursor-pointer items-center justify-between gap-4 px-4 py-3 transition-colors active:bg-white/[0.04]">
      <span className="min-w-0">
        <span className="block text-[0.95rem] text-text md:text-sm">{label}</span>
        {hint ? <span className="mt-0.5 block text-[0.8rem] text-subtle">{hint}</span> : null}
      </span>
      {/* Checkbox first: FormData.get returns the first value, so an unchecked box falls through to the hidden "off" */}
      <input type="checkbox" name={name} value="on" defaultChecked={defaultChecked} className="peer sr-only" />
      {withOffFallback ? <input type="hidden" name={name} value="off" /> : null}
      <span
        aria-hidden
        className={cn(
          "relative h-7 w-12 shrink-0 rounded-full bg-white/[0.14] transition-colors peer-checked:bg-accent",
          "peer-focus-visible:ring-2 peer-focus-visible:ring-white/50 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-bg",
          "after:absolute after:top-0.5 after:left-0.5 after:size-6 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:after:translate-x-5",
        )}
      />
    </label>
  );
}

export function LogCheckForm({
  vehicleId,
  target,
  unit,
  mileage,
  onConditioner,
}: {
  vehicleId: string;
  target: TyrePressures;
  unit: "psi" | "bar";
  mileage: number;
  onConditioner: boolean;
}) {
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(logCheck, null);
  const step = unit === "bar" ? 0.1 : 0.5;

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="vehicleId" value={vehicleId} />

      <div className="grid grid-cols-2 gap-3">
        <Field label="Battery, resting volts" htmlFor="batteryVoltage" hint="12.4V or above is healthy." className="col-span-2 sm:col-span-1">
          <div className="relative">
            <input
              id="batteryVoltage"
              name="batteryVoltage"
              type="number"
              step="0.01"
              min={9}
              max={15}
              inputMode="decimal"
              enterKeyHint="next"
              placeholder="12.6"
              required
              className={cn(bigInput, "h-14 pr-10 text-2xl")}
            />
            <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-lg text-subtle">V</span>
          </div>
        </Field>
        <Field label="Mileage" htmlFor="mileage" className="col-span-2 sm:col-span-1">
          <div className="relative">
            <input
              id="mileage"
              name="mileage"
              type="number"
              min={0}
              inputMode="numeric"
              enterKeyHint="next"
              defaultValue={mileage}
              className={cn(bigInput, "h-14 pr-12 text-2xl")}
            />
            <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-lg text-subtle">mi</span>
          </div>
        </Field>
      </div>

      <fieldset>
        <legend className="mb-2 text-[0.85rem] font-medium text-muted md:text-[0.78rem]">Tyre pressures ({unit}), prefilled with targets</legend>
        <p className="mb-2 text-center text-[0.75rem] tracking-wide text-subtle uppercase">Front</p>
        <div className="grid grid-cols-2 gap-2.5">
          {(["fl", "fr", "rl", "rr"] as const).map((k) => (
            <TyreInput key={k} corner={k} target={target[k]} step={step} />
          ))}
        </div>
        <p className="mt-2 text-center text-[0.75rem] tracking-wide text-subtle uppercase">Rear</p>
      </fieldset>

      <div className="glass-inset divide-y divide-white/[0.06] overflow-hidden rounded-2xl">
        <Toggle name="fluidsOk" label="Fluids OK" hint="Oil, coolant, brake fluid" />
        <Toggle name="exteriorOk" label="Exterior OK" hint="Paint, wheels, glass" />
        <Toggle name="interiorOk" label="Interior OK" />
        <Toggle name="onConditioner" label="Left on conditioner" defaultChecked={onConditioner} />
        <Toggle name="visibleToClient" label="Show to the client" hint="Appears in The Garage" withOffFallback />
      </div>

      <Field label="Notes" htmlFor="notes" hint="Leave blank to record a standard summary.">
        <Textarea id="notes" name="notes" rows={3} placeholder="e.g. Tyres rotated a quarter turn. Humidity in bay 48%." />
      </Field>

      {/* Stays at the bottom of the screen while the form is in view on phones */}
      <div className="sticky bottom-0 z-10 -mx-5 -mb-5 rounded-b-2xl border-t border-white/[0.08] bg-[#0d0e10]/95 px-5 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:static md:m-0 md:flex md:flex-wrap md:items-center md:gap-3 md:rounded-none md:border-0 md:bg-transparent md:p-0">
        {state ? (
          <p role="status" className={cn("mb-2 text-sm md:order-2 md:mb-0", state.ok ? "text-success" : "text-danger")}>
            {state.ok ? state.message : state.error}
          </p>
        ) : null}
        <Button type="submit" size="lg" disabled={pending} className="w-full md:h-10 md:w-auto md:px-5 md:text-sm">
          <ClipboardCheck /> {pending ? "Saving" : "Log check"}
        </Button>
      </div>
    </form>
  );
}
