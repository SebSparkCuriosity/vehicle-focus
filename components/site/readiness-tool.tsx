"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Eye } from "lucide-react";
import { readinessRisk } from "@/lib/domain";
import { cn } from "@/lib/utils";
import { LeadForm } from "@/components/site/lead-form";

type Inputs = Parameters<typeof readinessRisk>[0];

const LEVEL_META = {
  ok: { label: "Fine", icon: CheckCircle2, text: "text-success", ring: "border-success/30 bg-success-soft" },
  watch: { label: "Watch", icon: Eye, text: "text-warning", ring: "border-warning/30 bg-warning-soft" },
  risk: { label: "At risk", icon: AlertTriangle, text: "text-danger", ring: "border-danger/30 bg-danger-soft" },
} as const;

function band(score: number) {
  if (score >= 60) return { label: "High risk", text: "text-danger", stroke: "var(--danger)", summary: "Your car is quietly losing condition and value. A vehicle audit would catch the expensive problems before they happen." };
  if (score >= 30) return { label: "Worth a look", text: "text-warning", stroke: "var(--warning)", summary: "Nothing dramatic yet, but a few things are drifting. A short audit would put them right and set a schedule." };
  return { label: "In good shape", text: "text-success", stroke: "var(--success)", summary: "You're on top of the basics. The next step is keeping it that way without it taking up your time." };
}

function Choice<T extends string | number | boolean>({
  name,
  value,
  options,
  onChange,
}: {
  name: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div role="radiogroup" aria-label={name} className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={String(o.value)}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.value)}
            className={cn(
              "rounded-md border px-3 py-2 text-sm transition-colors",
              active ? "border-gold bg-gold-soft text-gold" : "border-border bg-surface-2 text-muted hover:border-border-strong hover:text-text",
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function Question({ n, label, children }: { n: number; label: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-border py-6 first:border-t-0 first:pt-0">
      <p className="mb-3 flex items-baseline gap-3 text-sm font-medium">
        <span className="font-display text-xs text-gold tabular">{String(n).padStart(2, "0")}</span>
        {label}
      </p>
      {children}
    </div>
  );
}

function Dial({ score, stroke }: { score: number; stroke: string }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  const arc = c * 0.75; // 270 degree gauge
  const filled = arc * (score / 100);
  return (
    <svg viewBox="0 0 140 140" className="size-40" aria-hidden>
      <g transform="rotate(135 70 70)">
        <circle cx="70" cy="70" r={r} fill="none" stroke="var(--surface-3)" strokeWidth="10" strokeDasharray={`${arc} ${c}`} strokeLinecap="round" />
        <circle
          cx="70"
          cy="70"
          r={r}
          fill="none"
          stroke={stroke}
          strokeWidth="10"
          strokeDasharray={`${filled} ${c}`}
          strokeLinecap="round"
          style={{ transition: "stroke-dasharray 400ms ease, stroke 400ms ease" }}
        />
      </g>
      <text x="70" y="74" textAnchor="middle" fontSize="34" fontWeight="600" fill="var(--text)" style={{ fontFamily: "var(--font-display)" }}>
        {score}
      </text>
      <text x="70" y="94" textAnchor="middle" fontSize="10" fill="var(--subtle)" letterSpacing="2">
        RISK / 100
      </text>
    </svg>
  );
}

export function ReadinessTool() {
  const [inputs, setInputs] = useState<Inputs>({
    weeksSinceDriven: 4,
    powertrain: "petrol",
    onConditioner: false,
    storage: "garage",
    monthsSinceService: 9,
    recordsComplete: "partly",
  });
  const set = <K extends keyof Inputs>(k: K) => (v: Inputs[K]) => setInputs((s) => ({ ...s, [k]: v }));
  const result = useMemo(() => readinessRisk(inputs), [inputs]);
  const b = band(result.score);

  return (
    <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-12">
      <div className="rounded-2xl border border-border bg-surface p-5 sm:p-8">
        <Question n={1} label="When was the car last driven?">
          <div className="flex items-center gap-4">
            <input
              type="range"
              min={0}
              max={26}
              step={1}
              value={inputs.weeksSinceDriven}
              onChange={(e) => set("weeksSinceDriven")(Number(e.target.value))}
              className="w-full accent-[var(--gold)]"
              aria-label="Weeks since last driven"
            />
            <span className="w-24 shrink-0 text-right text-sm tabular text-text">
              {inputs.weeksSinceDriven === 0 ? "This week" : inputs.weeksSinceDriven >= 26 ? "6 months+" : `${inputs.weeksSinceDriven} weeks ago`}
            </span>
          </div>
        </Question>
        <Question n={2} label="What powers it?">
          <Choice
            name="Powertrain"
            value={inputs.powertrain}
            onChange={set("powertrain")}
            options={[
              { value: "petrol", label: "Petrol" },
              { value: "hybrid", label: "Hybrid" },
              { value: "electric", label: "Electric" },
            ]}
          />
        </Question>
        <Question n={3} label="Is it kept on a battery conditioner?">
          <Choice
            name="Battery conditioner"
            value={inputs.onConditioner}
            onChange={set("onConditioner")}
            options={[
              { value: true, label: "Yes" },
              { value: false, label: "No or not sure" },
            ]}
          />
        </Question>
        <Question n={4} label="Where does it live?">
          <Choice
            name="Storage"
            value={inputs.storage}
            onChange={set("storage")}
            options={[
              { value: "heated", label: "Heated, dry storage" },
              { value: "garage", label: "Home garage" },
              { value: "outdoor", label: "Outside or carport" },
            ]}
          />
        </Question>
        <Question n={5} label="When was it last serviced?">
          <Choice
            name="Months since service"
            value={inputs.monthsSinceService}
            onChange={set("monthsSinceService")}
            options={[
              { value: 4, label: "Under 6 months" },
              { value: 9, label: "6 to 12 months" },
              { value: 13, label: "12 to 14 months" },
              { value: 18, label: "Over 14 months" },
            ]}
          />
        </Question>
        <Question n={6} label="Are the records complete and in one place?">
          <Choice
            name="Records"
            value={inputs.recordsComplete}
            onChange={set("recordsComplete")}
            options={[
              { value: "yes", label: "Yes, all of them" },
              { value: "partly", label: "Partly" },
              { value: "no", label: "Not really" },
            ]}
          />
        </Question>
      </div>

      <div className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-2xl border border-border bg-surface p-5 sm:p-8" aria-live="polite">
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
            <Dial score={result.score} stroke={b.stroke} />
            <div>
              <p className="eyebrow">Your result</p>
              <p className={cn("mt-2 font-display text-2xl font-semibold tracking-tight", b.text)}>{b.label}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">{b.summary}</p>
            </div>
          </div>
          <ul className="mt-6 grid gap-2.5">
            {result.findings.map((f) => {
              const m = LEVEL_META[f.level];
              const Icon = m.icon;
              return (
                <li key={f.area} className="rounded-lg border border-border bg-surface-2 p-3.5">
                  <div className="flex items-center justify-between gap-3">
                    <p className="flex items-center gap-2 text-sm font-medium">
                      <Icon className={cn("size-4", m.text)} aria-hidden />
                      {f.area}
                    </p>
                    <span className={cn("rounded-full border px-2 py-0.5 text-[0.7rem] font-medium", m.ring, m.text)}>{m.label}</span>
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted">{f.note}</p>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="mt-6 rounded-2xl border border-gold/30 bg-surface p-5 sm:p-8">
          <p className="font-display text-lg font-semibold tracking-tight">Get a free vehicle audit</p>
          <p className="mt-1 mb-5 text-sm text-muted">
            Leave your details and Lawrence will call to arrange an inspection. Your score comes with the request, so the first conversation starts in the right place.
          </p>
          <LeadForm
            source="Readiness check"
            idPrefix="readiness"
            hidden={{
              readinessScore: result.score,
              answers: `Readiness answers: last driven ${inputs.weeksSinceDriven} weeks ago, ${inputs.powertrain}, ${inputs.onConditioner ? "on a conditioner" : "no conditioner"}, ${inputs.storage} storage, serviced ${inputs.monthsSinceService} months ago, records ${inputs.recordsComplete}.`,
            }}
            carsLabel="Which car is this about?"
            messageLabel="Anything else we should know? (optional)"
            messagePlaceholder="When you next want to use it, where it's kept, any warning lights."
            submitLabel="Book my audit"
          />
        </div>
      </div>
    </div>
  );
}
