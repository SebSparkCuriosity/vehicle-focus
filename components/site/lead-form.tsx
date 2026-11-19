"use client";

import { useActionState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { createLead, type ActionResult } from "@/lib/actions";
import { cn } from "@/lib/utils";
import type { LeadSource } from "@/lib/types";

const ROLES = ["Owner", "Personal assistant", "Wealth manager", "Family office", "Other"] as const;

export function LeadForm({
  source,
  defaultRole,
  roles = ROLES,
  hidden,
  carsLabel = "Your cars",
  carsPlaceholder = "For example: Ferrari 296 GTB, Porsche 911 GT3",
  messageLabel = "How can we help?",
  messagePlaceholder = "Where the cars live, how you use them, and anything that's currently a headache.",
  submitLabel = "Request a call",
  successTitle = "Thank you",
  className,
  idPrefix = "lead",
}: {
  source: LeadSource;
  defaultRole?: (typeof ROLES)[number];
  roles?: readonly string[];
  hidden?: Record<string, string | number>;
  carsLabel?: string;
  carsPlaceholder?: string;
  messageLabel?: string;
  messagePlaceholder?: string;
  submitLabel?: string;
  successTitle?: string;
  className?: string;
  idPrefix?: string;
}) {
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(createLead, null);

  if (state?.ok) {
    return (
      <div className={cn("rounded-xl border border-success/30 bg-success-soft p-6", className)} role="status">
        <CheckCircle2 className="size-6 text-success" aria-hidden />
        <p className="mt-3 font-display text-lg font-semibold">{successTitle}</p>
        <p className="mt-1 text-sm text-muted">{state.message}</p>
      </div>
    );
  }

  const id = (name: string) => `${idPrefix}-${name}`;

  return (
    <form action={action} className={cn("grid gap-4", className)} noValidate>
      <input type="hidden" name="source" value={source} />
      {hidden
        ? Object.entries(hidden).map(([k, v]) => <input key={k} type="hidden" name={k} value={String(v)} />)
        : null}
      {/* Honeypot: hidden from people, tempting to bots */}
      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden>
        <label htmlFor={id("company_website")}>Company website</label>
        <input id={id("company_website")} name="company_website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" htmlFor={id("name")}>
          <Input id={id("name")} name="name" autoComplete="name" required />
        </Field>
        <Field label="Email" htmlFor={id("email")}>
          <Input id={id("email")} name="email" type="email" autoComplete="email" required />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Phone (optional)" htmlFor={id("phone")}>
          <Input id={id("phone")} name="phone" type="tel" autoComplete="tel" />
        </Field>
        <Field label="I am" htmlFor={id("role")}>
          <Select id={id("role")} name="role" defaultValue={defaultRole ?? roles[0]}>
            {roles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </Select>
        </Field>
      </div>
      <Field label={carsLabel} htmlFor={id("cars")}>
        <Input id={id("cars")} name="cars" placeholder={carsPlaceholder} />
      </Field>
      <Field label={messageLabel} htmlFor={id("message")}>
        <Textarea id={id("message")} name="message" placeholder={messagePlaceholder} rows={4} />
      </Field>

      {state && !state.ok ? (
        <p className="text-sm text-danger" role="alert">
          {state.error}
        </p>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-subtle">Private and confidential. We&apos;re happy to sign an NDA before you share details.</p>
        <Button type="submit" size="lg" disabled={pending} className="sm:min-w-44">
          {pending ? <Loader2 className="animate-spin" aria-hidden /> : null}
          {pending ? "Sending" : submitLabel}
        </Button>
      </div>
    </form>
  );
}
