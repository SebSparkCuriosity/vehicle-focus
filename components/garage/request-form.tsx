"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import {
  CircleCheck,
  KeyRound,
  MessageSquare,
  Sparkles,
  TrendingUp,
  Truck,
  Warehouse,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { createRequest, type ActionResult } from "@/lib/actions";
import { REQUEST_TYPE_META } from "@/lib/domain";
import { cn } from "@/lib/utils";
import type { RequestType } from "@/lib/types";

const ICONS: Record<RequestType, LucideIcon> = {
  ready: KeyRound,
  relocation: Truck,
  service: Wrench,
  detailing: Sparkles,
  storage: Warehouse,
  valuation: TrendingUp,
  other: MessageSquare,
};

const LOCATION_HINT: Record<RequestType, string> = {
  ready: "Where should it be waiting?",
  relocation: "From where, to where?",
  service: "Where should we collect it from?",
  detailing: "Where is the car?",
  storage: "Where should we collect it from?",
  valuation: "Where is the car?",
  other: "Where is the car?",
};

type VehicleOption = { id: string; name: string; registration: string; location: string };

export function RequestForm({
  vehicles,
  raisedBy,
  defaultType,
  defaultVehicleId,
  defaultDate,
  minDate,
}: {
  vehicles: VehicleOption[];
  raisedBy: string[];
  defaultType: RequestType;
  defaultVehicleId?: string;
  defaultDate: string;
  minDate: string;
}) {
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(createRequest, null);
  const [type, setType] = useState<RequestType>(defaultType);
  const [vehicleId, setVehicleId] = useState<string | undefined>(defaultVehicleId);
  const selected = vehicles.find((v) => v.id === vehicleId);

  if (state?.ok) {
    return (
      <div className="rounded-2xl border border-success/30 bg-success-soft p-8 text-center">
        <CircleCheck className="mx-auto size-10 text-success" aria-hidden />
        <h2 className="mt-4 font-display text-2xl font-semibold">Request received</h2>
        <p className="mx-auto mt-2 max-w-md text-muted">{state.message ?? "We'll confirm shortly."}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/garage/requests">View requests</ButtonLink>
          <ButtonLink href="/garage" variant="secondary">
            Back to collection
          </ButtonLink>
        </div>
      </div>
    );
  }

  if (!vehicles.length) {
    return (
      <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted">
        There are no cars on your account yet.{" "}
        <Link href="/garage/messages" className="text-gold hover:underline">
          Message the team
        </Link>{" "}
        and we&apos;ll help.
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-8">
      <fieldset>
        <legend className="mb-3 text-xs font-medium tracking-wide text-muted">Type of request</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {(Object.keys(REQUEST_TYPE_META) as RequestType[]).map((t) => {
            const Icon = ICONS[t];
            const meta = REQUEST_TYPE_META[t];
            const active = type === t;
            return (
              <label
                key={t}
                className={cn(
                  "flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors",
                  active ? "border-gold/70 bg-gold-soft" : "border-border bg-surface hover:border-border-strong",
                  "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-gold/40",
                )}
              >
                <input
                  type="radio"
                  name="type"
                  value={t}
                  checked={active}
                  onChange={() => setType(t)}
                  className="sr-only"
                />
                <span
                  className={cn(
                    "grid size-9 shrink-0 place-items-center rounded-lg",
                    active ? "bg-gold text-[#0b0b0c]" : "bg-surface-2 text-muted",
                  )}
                >
                  <Icon className="size-4" aria-hidden />
                </span>
                <span>
                  <span className="block text-sm font-medium">{meta.label}</span>
                  <span className="block text-xs text-muted">{meta.description}</span>
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Car" htmlFor="vehicleId" className="sm:col-span-2">
          <Select id="vehicleId" name="vehicleId" value={vehicleId} onChange={(e) => setVehicleId(e.target.value)} required>
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name} ({v.registration})
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Date needed" htmlFor="date">
          <Input id="date" name="date" type="date" defaultValue={defaultDate} min={minDate} required />
        </Field>
        <Field label="Time" htmlFor="time">
          <Input id="time" name="time" type="time" defaultValue="09:00" step={900} />
        </Field>

        <Field label="Location" htmlFor="location" hint={LOCATION_HINT[type]} className="sm:col-span-2">
          <Input key={vehicleId} id="location" name="location" defaultValue={selected?.location} placeholder="e.g. Jersey Airport, private aviation" />
        </Field>

        <Field label="Short description (optional)" htmlFor="title" className="sm:col-span-2">
          <Input id="title" name="title" placeholder={`e.g. ${REQUEST_TYPE_META[type].label} for Saturday morning`} maxLength={120} />
        </Field>

        <Field label="Notes for the team (optional)" htmlFor="notes" className="sm:col-span-2">
          <Textarea id="notes" name="notes" placeholder="Anything we should know: fuel, roof, who's collecting, flight number." maxLength={1000} />
        </Field>

        <Field label="Raised by" htmlFor="raisedBy" hint="Anyone you've authorised can book on your behalf." className="sm:col-span-2">
          <Select id="raisedBy" name="raisedBy" defaultValue={raisedBy[0]}>
            {raisedBy.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      {state && !state.ok ? (
        <p role="alert" className="rounded-lg border border-danger/30 bg-danger-soft px-3 py-2 text-sm text-danger">
          {state.error}
        </p>
      ) : null}

      <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-subtle">Discreet by default. Only the Vehicle Focus team sees your requests.</p>
        <Button type="submit" size="lg" disabled={pending}>
          {pending ? "Sending..." : "Send request"}
        </Button>
      </div>
    </form>
  );
}
