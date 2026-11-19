"use client";

import { useActionState } from "react";
import { CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/form";
import { scheduleRequest, type ActionResult } from "@/lib/actions";

export function ScheduleForm({
  requestId,
  team,
  partners,
  defaults,
  submitLabel = "Schedule and notify client",
}: {
  requestId: string;
  team: { id: string; name: string; role: string }[];
  partners: { id: string; name: string; kind: string; region: string }[];
  defaults: { date: string; time: string; assigneeId?: string; partnerId?: string; quote?: number };
  submitLabel?: string;
}) {
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(scheduleRequest, null);

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="requestId" value={requestId} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Date" htmlFor="date">
          <Input id="date" name="date" type="date" defaultValue={defaults.date} required />
        </Field>
        <Field label="Start time" htmlFor="time">
          <Input id="time" name="time" type="time" defaultValue={defaults.time} required />
        </Field>
        <Field label="Assign to" htmlFor="assigneeId">
          <Select id="assigneeId" name="assigneeId" defaultValue={defaults.assigneeId ?? team[0]?.id}>
            {team.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}, {t.role}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Duration" htmlFor="durationMins">
          <Select id="durationMins" name="durationMins" defaultValue="60">
            <option value="30">30 minutes</option>
            <option value="45">45 minutes</option>
            <option value="60">1 hour</option>
            <option value="90">1.5 hours</option>
            <option value="120">2 hours</option>
            <option value="240">Half day</option>
            <option value="480">Full day</option>
          </Select>
        </Field>
        <Field label="Partner (optional)" htmlFor="partnerId">
          <Select id="partnerId" name="partnerId" defaultValue={defaults.partnerId ?? ""}>
            <option value="">In house</option>
            {partners.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.kind}, {p.region})
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Quote, GBP (optional)" htmlFor="quote" hint="Included in the confirmation message.">
          <Input id="quote" name="quote" type="number" min={0} step={10} inputMode="numeric" placeholder="e.g. 450" defaultValue={defaults.quote} />
        </Field>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={pending} className="w-full sm:w-auto">
          <CalendarCheck /> {pending ? "Scheduling" : submitLabel}
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
