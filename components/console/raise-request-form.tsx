"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { createRequest, type ActionResult } from "@/lib/actions";
import { REQUEST_TYPE_META } from "@/lib/domain";
import type { RequestType } from "@/lib/types";

/** Team raises a request on a client's behalf, e.g. after a phone call. Lands in the board as New. */
export function RaiseRequestForm({ vehicleId, defaultLocation, defaultDate }: { vehicleId: string; defaultLocation: string; defaultDate: string }) {
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(createRequest, null);

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="vehicleId" value={vehicleId} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Type" htmlFor="rr-type">
          <Select id="rr-type" name="type" defaultValue="ready">
            {(Object.keys(REQUEST_TYPE_META) as RequestType[]).map((t) => (
              <option key={t} value={t}>
                {REQUEST_TYPE_META[t].label}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Title (optional)" htmlFor="rr-title">
          <Input id="rr-title" name="title" placeholder="e.g. Ready for Sunday lunch at Longueville" />
        </Field>
        <Field label="Needed on" htmlFor="rr-date">
          <Input id="rr-date" name="date" type="date" defaultValue={defaultDate} required />
        </Field>
        <Field label="Time" htmlFor="rr-time">
          <Input id="rr-time" name="time" type="time" defaultValue="09:00" />
        </Field>
        <Field label="Location" htmlFor="rr-location" className="sm:col-span-2">
          <Input id="rr-location" name="location" defaultValue={defaultLocation} />
        </Field>
      </div>
      <Field label="Notes" htmlFor="rr-notes">
        <Textarea id="rr-notes" name="notes" rows={2} placeholder="What the client asked for, in their words." />
      </Field>
      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" variant="secondary" disabled={pending}>
          <Send /> {pending ? "Raising" : "Raise request"}
        </Button>
        {state ? (
          state.ok ? (
            <p role="status" className="text-sm text-success">
              Request raised.{" "}
              {state.id ? (
                <Link href={`/console/requests/${state.id}`} className="underline underline-offset-4 hover:text-text">
                  Schedule it now
                </Link>
              ) : null}
            </p>
          ) : (
            <p role="status" className="text-sm text-danger">
              {state.error}
            </p>
          )
        ) : null}
      </div>
    </form>
  );
}
