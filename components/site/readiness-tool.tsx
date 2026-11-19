"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Eye } from "lucide-react";
import { readinessRisk } from "@/lib/domain";
import { cn } from "@/lib/utils";
import { LeadForm } from "@/components/site/lead-form";

type Inputs = Parameters<typeof readinessRisk>[0];

const LEVEL_META = {
  ok: { label: "Fine", icon: CheckCircle2, text: "text-success" },
  watch: { label: "Watch", icon: Eye, text: "text-warning" },
  risk: { label: "At risk", icon: AlertTriangle, text: "text-danger" },
} as const;

function weeksLabel(w: number) {
  if (w === 0) return "This week";
  if (w >= 26) return "6 months or more";
  return w === 1 ? "1 week ago" : `${w} weeks ago`;
}

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
              "min-h-11 rounded-full border px-4 py-2 text-[0.95rem] leading-snug transition-colors sm:text-sm",
              active ? "border-white/45 bg-white/[0.12] text-white" : "border-white/10 bg-white/[0.03] text-white/60 hover:border-white/25 hover:text-white",
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
    <div className="border-t border-white/[0.08] py-6 first:border-t-0 first:pt-0 last:pb-0 sm:py-7">
      <p className="mb-4 flex items-baseline gap-3 text-[0.98rem] font-medium">
        <span className="text-xs text-white/35 tabular">{String(n).padStart(2, "0")}</span>
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
        <circle cx="70" cy="70" r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" strokeDasharray={`${arc} ${c}`} strokeLinecap="round" />
        <circle
          cx="70"
          cy="70"
          r={r}
          fill="none"
          stroke={stroke}
          strokeWidth="8"
          strokeDasharray={`${filled} ${c}`}
          strokeLinecap="round"
          style={{ transition: "stroke-dasharray 400ms ease, stroke 400ms ease" }}
        />
      </g>
      <text x="70" y="76" textAnchor="middle" fontSize="38" fontWeight="400" fill="var(--text)" style={{ fontFamily: "var(--font-display)" }}>
        {score}
      </text>
      <text x="70" y="97" textAnchor="middle" fontSize="11" fill="rgba(255,255,255,0.5)" letterSpacing="1.5">
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
    <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr] lg:gap-8 [&>*]:min-w-0">
      <div className="glass-dark rounded-[28px] p-6 sm:p-9">
        <Question n={1} label="When was the car last driven?">
          <p className="mb-1 font-display text-2xl text-white tabular" aria-hidden>
            {weeksLabel(inputs.weeksSinceDriven)}
          </p>
          {/* 44px tall hit area with a slim track and a large thumb, so it's easy to drag with a thumb */}
          <input
            type="range"
            min={0}
            max={26}
            step={1}
            value={inputs.weeksSinceDriven}
            onChange={(e) => set("weeksSinceDriven")(Number(e.target.value))}
            aria-label="Weeks since last driven"
            aria-valuetext={weeksLabel(inputs.weeksSinceDriven)}
            style={{ "--p": `${(inputs.weeksSinceDriven / 26) * 100}%` } as React.CSSProperties}
            className="h-11 w-full cursor-pointer touch-pan-y appearance-none bg-transparent focus-visible:outline-none [&::-moz-range-progress]:h-1.5 [&::-moz-range-progress]:rounded-full [&::-moz-range-progress]:bg-white [&::-moz-range-thumb]:size-7 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-white [&::-moz-range-track]:h-1.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-white/15 [&::-webkit-slider-runnable-track]:h-1.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-[linear-gradient(to_right,white_var(--p),rgba(255,255,255,0.15)_var(--p))] [&::-webkit-slider-thumb]:-mt-[11px] [&::-webkit-slider-thumb]:size-7 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-[0_2px_10px_rgba(0,0,0,0.5)] focus-visible:[&::-webkit-slider-thumb]:ring-4 focus-visible:[&::-webkit-slider-thumb]:ring-white/25"
          />
          <div className="flex justify-between text-xs text-white/40" aria-hidden>
            <span>This week</span>
            <span>6 months+</span>
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
        <div className="glass-dark rounded-[28px] p-6 sm:p-9" aria-live="polite">
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
            <Dial score={result.score} stroke={b.stroke} />
            <div>
              <p className="text-xs text-white/45">Your result</p>
              <p className={cn("mt-1.5 font-display text-3xl font-normal", b.text)}>{b.label}</p>
              <p className="mt-2 text-sm leading-relaxed text-white/60">{b.summary}</p>
            </div>
          </div>
          <ul className="mt-7 grid gap-2">
            {result.findings.map((f) => {
              const m = LEVEL_META[f.level];
              const Icon = m.icon;
              return (
                <li key={f.area} className="glass-inset rounded-2xl p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="flex items-center gap-2 text-sm font-medium">
                      <Icon className={cn("size-4", m.text)} aria-hidden />
                      {f.area}
                    </p>
                    <span className={cn("text-xs font-medium", m.text)}>{m.label}</span>
                  </div>
                  <p className="mt-1.5 text-[0.85rem] leading-relaxed text-white/60 sm:text-xs">{f.note}</p>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="glass-dark mt-6 rounded-[28px] p-6 sm:p-9">
          <p className="font-display text-3xl font-normal">Get a free vehicle audit</p>
          <p className="mt-2 mb-6 text-sm leading-relaxed text-white/60">
            Leave your details and Lawrence will call to arrange an inspection. Your score comes with the request.
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
