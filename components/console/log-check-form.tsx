"use client";

import { useActionState } from "react";
import { ClipboardCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/form";
import { logCheck, type ActionResult } from "@/lib/actions";
import type { TyrePressures } from "@/lib/types";

function Toggle({ name, label, defaultChecked = true }: { name: string; label: string; defaultChecked?: boolean }) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 rounded-md border border-border bg-surface-2 px-3 py-2 text-sm text-muted has-[:checked]:border-success/40 has-[:checked]:text-text">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="size-4 accent-[var(--gold)]" />
      {label}
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
    <form action={action} className="space-y-4">
      <input type="hidden" name="vehicleId" value={vehicleId} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Battery, resting volts" htmlFor="batteryVoltage" hint="Measured after the car has rested. 12.4V or above is healthy.">
          <Input id="batteryVoltage" name="batteryVoltage" type="number" step="0.1" min={9} max={15} inputMode="decimal" placeholder="12.6" required />
        </Field>
        <Field label="Mileage" htmlFor="mileage">
          <Input id="mileage" name="mileage" type="number" min={0} inputMode="numeric" defaultValue={mileage} />
        </Field>
      </div>

      <fieldset>
        <legend className="mb-1.5 text-xs font-medium tracking-wide text-muted">Tyre pressures ({unit}), prefilled with targets</legend>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {(["fl", "fr", "rl", "rr"] as const).map((k) => (
            <div key={k}>
              <label htmlFor={`tyre-${k}`} className="mb-1 block text-[0.7rem] uppercase tracking-wider text-subtle">
                {{ fl: "Front left", fr: "Front right", rl: "Rear left", rr: "Rear right" }[k]}
              </label>
              <Input id={`tyre-${k}`} name={k} type="number" step={step} min={10} max={60} inputMode="decimal" defaultValue={target[k]} required />
            </div>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-2 sm:grid-cols-3">
        <Toggle name="fluidsOk" label="Fluids OK" />
        <Toggle name="exteriorOk" label="Exterior OK" />
        <Toggle name="interiorOk" label="Interior OK" />
        <Toggle name="onConditioner" label="Left on conditioner" defaultChecked={onConditioner} />
        <label className="flex cursor-pointer items-center gap-2.5 rounded-md border border-border bg-surface-2 px-3 py-2 text-sm text-muted has-[:checked]:text-text sm:col-span-2">
          {/* Checkbox first: FormData.get returns the first value, so an unchecked box falls through to "off" */}
          <input type="checkbox" name="visibleToClient" value="on" defaultChecked className="size-4 accent-[var(--gold)]" />
          <input type="hidden" name="visibleToClient" value="off" />
          Show this check to the client in The Garage
        </label>
      </div>

      <Field label="Notes" htmlFor="notes" hint="Leave blank to record a standard summary.">
        <Textarea id="notes" name="notes" rows={3} placeholder="e.g. Tyres rotated a quarter turn. Humidity in bay 48%." />
      </Field>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={pending}>
          <ClipboardCheck /> {pending ? "Saving" : "Log check"}
        </Button>
        {state ? (
          <p role="status" className={state.ok ? "text-sm text-success" : "text-sm text-danger"}>
            {state.ok ? state.message : state.error}
          </p>
        ) : null}
      </div>
    </form>
  );
}
