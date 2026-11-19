"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { Check } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { createRequest, type ActionResult } from "@/lib/actions";
import { REQUEST_TYPE_META } from "@/lib/domain";
import { cn } from "@/lib/utils";
import type { RequestType } from "@/lib/types";

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
      <Card className="rounded-[28px] px-6 py-12 text-center sm:px-10">
        <span className="mx-auto grid size-12 place-items-center rounded-full border border-success/40 text-success">
          <Check className="size-5" aria-hidden />
        </span>
        <h2 className="mt-5 font-display text-4xl font-normal">Request received.</h2>
        <p className="mx-auto mt-3 max-w-md text-white/65">{state.message ?? "We'll confirm shortly."}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/garage/requests">View requests</ButtonLink>
          <ButtonLink href="/garage" variant="secondary">
            Back to collection
          </ButtonLink>
        </div>
      </Card>
    );
  }

  if (!vehicles.length) {
    return (
      <Card className="rounded-[24px] p-8 text-center text-sm text-white/65">
        There are no cars on your account yet.{" "}
        <Link href="/garage/messages" className="text-white underline decoration-white/30 underline-offset-4 hover:decoration-white/70">
          Message the team
        </Link>{" "}
        and we&apos;ll help.
      </Card>
    );
  }

  return (
    <Card className="rounded-[28px] p-5 sm:p-8">
    <form action={formAction} className="space-y-9">
      <fieldset>
        <legend className="mb-3 text-[0.82rem] font-semibold text-white/85">Type of request</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {(Object.keys(REQUEST_TYPE_META) as RequestType[]).map((t) => {
            const meta = REQUEST_TYPE_META[t];
            const active = type === t;
            return (
              <label
                key={t}
                className={cn(
                  "relative flex min-h-[68px] cursor-pointer flex-col justify-center rounded-2xl border px-4 py-3.5 transition-all",
                  active
                    ? "border-accent/60 bg-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] ring-1 ring-accent/40"
                    : "border-white/10 bg-white/[0.035] hover:border-white/20 hover:bg-white/[0.06]",
                  "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-white/40",
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
                <span className={cn("block pr-6 text-[0.95rem] font-medium", active ? "text-white" : "text-white/85")}>{meta.label}</span>
                <span className="mt-0.5 block text-[0.78rem] leading-snug text-white/50">{meta.description}</span>
                {active ? <Check className="absolute top-3.5 right-3.5 size-4 text-accent" aria-hidden /> : null}
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
        <p role="alert" className="rounded-2xl border border-danger/30 bg-danger-soft px-4 py-2.5 text-sm text-danger">
          {state.error}
        </p>
      ) : null}

      <div className="flex flex-col-reverse gap-4 border-t border-white/[0.08] pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[0.78rem] text-white/45">Only the Vehicle Focus team sees your requests.</p>
        <Button type="submit" size="lg" disabled={pending}>
          {pending ? "Sending..." : "Send request"}
        </Button>
      </div>
    </form>
    </Card>
  );
}
