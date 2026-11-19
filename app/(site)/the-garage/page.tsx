import type { Metadata } from "next";
import { ArrowRight, Fingerprint, KeyRound, MessageSquare, ShieldCheck, Truck, Wrench, ClipboardCheck, LineChart, Sparkles } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container, Section, SectionHeading } from "@/components/site/section";
import { CheckMock, GarageMock, RequestMock, VaultMock } from "@/components/site/garage-mock";
import { CtaBand } from "@/components/site/blocks";
import { ValueChart } from "@/components/charts";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "The Garage: Client Portal for Your Car Collection",
  description:
    "The Garage is the Vehicle Focus client portal. See every car's status, readiness checks, documents, service history and valuation trend, and book anything with one tap. Delegate access for PAs and family offices.",
  alternates: { canonical: "/the-garage" },
};

function monthsAgo(m: number) {
  const d = new Date();
  d.setMonth(d.getMonth() - m);
  return d.toISOString().slice(0, 10);
}

const VALUE_POINTS = [
  { date: monthsAgo(60), value: 198000 },
  { date: monthsAgo(36), value: 236000 },
  { date: monthsAgo(24), value: 262000 },
  { date: monthsAgo(12), value: 279000 },
  { date: monthsAgo(1), value: 286000 },
];

const TIMELINE = [
  { icon: ClipboardCheck, title: "Fortnightly storage check", meta: "Battery 12.3V · tyres rotated", when: "2 weeks ago" },
  { icon: Truck, title: "Returned from specialist", meta: "Enclosed transport, condition photos on arrival", when: "2 months ago" },
  { icon: Wrench, title: "Annual service", meta: "Marque specialist · invoice in vault", when: "4 months ago" },
  { icon: LineChart, title: "Agreed-value review for insurer", meta: "Valuation report supplied to broker", when: "4 months ago" },
  { icon: Sparkles, title: "Paint correction and ceramic coating", meta: "Before and after photos attached", when: "7 months ago" },
];

const DELEGATES = [
  { initials: "PA", name: "Personal assistant", rights: "Book and track requests", tone: "gold" as const },
  { initials: "FO", name: "Family office", rights: "Reports and valuations only", tone: "info" as const },
  { initials: "DR", name: "Driver", rights: "Handover details for assigned cars", tone: "neutral" as const },
];

function FeatureRow({
  eyebrow,
  title,
  body,
  points,
  visual,
  flip = false,
}: {
  eyebrow: string;
  title: string;
  body: string;
  points?: string[];
  visual: React.ReactNode;
  flip?: boolean;
}) {
  return (
    <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
      <div className={cn(flip && "lg:order-2")}>
        <p className="eyebrow">{eyebrow}</p>
        <h3 className="mt-4 font-display text-2xl font-semibold tracking-tight text-balance sm:text-3xl">{title}</h3>
        <p className="mt-4 leading-relaxed text-muted">{body}</p>
        {points ? (
          <ul className="mt-6 grid gap-2.5 text-sm">
            {points.map((p) => (
              <li key={p} className="flex gap-3">
                <span className="mt-2 size-1 shrink-0 rounded-full bg-gold" aria-hidden />
                <span className="text-text/90">{p}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
      <div className={cn(flip && "lg:order-1")}>{visual}</div>
    </div>
  );
}

export default function TheGaragePage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-border hairline-grid">
        <div className="pointer-events-none absolute inset-0 spotlight" aria-hidden />
        <Container className="relative grid gap-14 py-16 sm:py-24 lg:grid-cols-[1fr_1.05fr] lg:items-center">
          <div>
            <p className="eyebrow">The Garage, client portal</p>
            <h1 className="mt-5 font-display text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
              Your collection, visible the moment we touch it.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
              Most concierge services ask you to take their word for it. The Garage shows you: live status, the readings from every check, the paperwork, the history and what the cars are worth. On your phone, whenever you want to look.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/login" size="lg">
                Try the demo
                <ArrowRight aria-hidden />
              </ButtonLink>
              <ButtonLink href="/contact" size="lg" variant="outline">
                Talk to Lawrence
              </ButtonLink>
            </div>
            <p className="mt-4 text-xs text-subtle">The demo uses example cars and owners. Nothing in it is real client data.</p>
          </div>
          <GarageMock />
        </Container>
      </section>

      <Section>
        <SectionHeading
          align="center"
          eyebrow="Why it exists"
          title="Trust is easier when you can see the work"
          lead="When your cars are looked after while you're away, the question is always the same: are they actually alright? The Garage answers it without you having to ask."
        />
        <div className="mt-20 grid gap-24">
          <FeatureRow
            eyebrow="Status & readiness"
            title="Know which car is ready before you pick up the keys"
            body="Every car shows where it is, what state it's in and when it was last checked. Each visit records real readings, so you can see a battery tiring or a tyre losing pressure weeks before it matters."
            points={["Ready, charging, in storage, at service or in transit", "Battery voltage, tyre pressures against target, fluids and mileage", "Flags when something needs a decision, with a recommendation"]}
            visual={<CheckMock className="mx-auto max-w-md" />}
          />
          <FeatureRow
            flip
            eyebrow="One-tap requests"
            title="Ready for Saturday at nine, at the airport"
            body="Ask for a car to be ready, moved, serviced, detailed, stored or valued. Pick the car, the time and the place. The request lands with the team, is scheduled, and comes back confirmed in the same thread."
            points={["Requests from you or anyone you've given access to", "Confirmation, quote and assigned technician in writing", "Every request becomes part of the car's record"]}
            visual={<RequestMock className="mx-auto max-w-md" />}
          />
          <FeatureRow
            eyebrow="Documents vault"
            title="The paperwork, finally in one place"
            body="Registration, insurance schedules, service books, invoices, certificates of authenticity and condition reports. Digitised, filed against the right car and ready when a broker, buyer or customs officer asks."
            points={["Due dates for MOT, insurance, registration and servicing tracked for you", "Shipping and import documents kept with the car", "Nothing lost when a car changes hands or homes"]}
            visual={<VaultMock className="mx-auto max-w-md" />}
          />
          <FeatureRow
            flip
            eyebrow="Provenance"
            title="A history that protects what the car is worth"
            body="Every check, service, movement and valuation is written down by the person who did it and kept in order. When it's time to sell, insure or pass a car on, the story is already told."
            visual={
              <div className="mx-auto max-w-md rounded-xl border border-border bg-surface p-5" role="img" aria-label="Illustration of a service history timeline">
                <p className="text-sm font-medium">History</p>
                <ol className="mt-4 grid gap-0">
                  {TIMELINE.map((t, i) => {
                    const Icon = t.icon;
                    return (
                      <li key={t.title} className="relative flex gap-3 pb-5 last:pb-0">
                        {i < TIMELINE.length - 1 ? <span className="absolute left-4 top-8 bottom-0 w-px bg-border" aria-hidden /> : null}
                        <span className="relative grid size-8 shrink-0 place-items-center rounded-full border border-border bg-surface-2">
                          <Icon className="size-3.5 text-gold" aria-hidden />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-baseline justify-between gap-3">
                            <p className="truncate text-sm">{t.title}</p>
                            <p className="shrink-0 text-xs text-subtle">{t.when}</p>
                          </div>
                          <p className="mt-0.5 text-xs text-muted">{t.meta}</p>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>
            }
          />
          <FeatureRow
            eyebrow="Valuation"
            title="What the collection is worth, and which way it's moving"
            body="Each car carries a valuation history from market reviews, auction comparables and formal reports, plotted against what you paid. Collection totals sit on the dashboard for owners who think of their cars as a portfolio."
            visual={
              <div className="mx-auto max-w-md rounded-xl border border-border bg-surface p-5" role="img" aria-label="Illustration of a valuation chart">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium">Porsche 911 Carrera RS, 1992</p>
                    <p className="mt-0.5 text-xs text-muted">Example car · auction comparables</p>
                  </div>
                  <Badge tone="success">+44% since purchase</Badge>
                </div>
                <ValueChart points={VALUE_POINTS} purchasePrice={198000} className="mt-4" />
              </div>
            }
          />
          <FeatureRow
            flip
            eyebrow="Delegate access"
            title="Let the people who help you help themselves"
            body="Give a PA, partner, family office or driver their own sign-in, with only the access they need. They can book and track without you being copied into every message, and you can see everything they've done."
            visual={
              <div className="mx-auto max-w-md rounded-xl border border-border bg-surface p-5" role="img" aria-label="Illustration of delegate access settings">
                <p className="text-sm font-medium">People with access</p>
                <ul className="mt-4 divide-y divide-border">
                  {DELEGATES.map((d) => (
                    <li key={d.name} className="flex items-center gap-3 py-3">
                      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-surface-3 font-display text-xs font-semibold">{d.initials}</span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm">{d.name}</span>
                        <span className="block text-xs text-muted">{d.rights}</span>
                      </span>
                      <Badge tone={d.tone}>Active</Badge>
                    </li>
                  ))}
                </ul>
              </div>
            }
          />
          <FeatureRow
            eyebrow="Messaging"
            title="One thread, with the people who actually do the work"
            body="Talk to Lawrence and the team in one private conversation per collection. Updates arrive when there's something worth telling you, not because a system needed to send something."
            visual={
              <div className="mx-auto grid max-w-md gap-3 rounded-xl border border-border bg-surface p-5" role="img" aria-label="Illustration of the message thread">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <MessageSquare className="size-4 text-gold" aria-hidden />
                  Vehicle Focus
                </div>
                <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-surface-2 px-4 py-3 text-sm">
                  <p className="text-xs text-gold">Technician</p>
                  <p className="mt-1 text-text/90">The 964&apos;s battery is resting at 12.1V even on the conditioner. I&apos;d replace it before spring rather than risk the electrics.</p>
                </div>
                <div className="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-gold px-4 py-3 text-sm text-[#0b0b0c]">
                  Go ahead, and keep the old one with the car&apos;s records.
                </div>
                <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-surface-2 px-4 py-3 text-sm">
                  <p className="text-xs text-gold">Lawrence</p>
                  <p className="mt-1 text-text/90">Booked for next Thursday. I&apos;ll add the invoice to the vault.</p>
                </div>
              </div>
            }
          />
        </div>
      </Section>

      <section className="border-y border-border bg-surface/40 py-20 sm:py-24">
        <Container>
          <SectionHeading eyebrow="Private by design" title="Built for owners who don't want to be found" />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              { icon: Fingerprint, title: "Two-factor sign-in", body: "Every account is protected by a second factor. Delegates sign in as themselves, never with your details." },
              { icon: KeyRound, title: "Access you control", body: "Choose what each delegate can see and do. Remove access in one click when circumstances change." },
              { icon: ShieldCheck, title: "Discretion as standard", body: "Your collection is never shared, published or sold. NDAs are offered as standard and cover the portal too." },
            ].map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="rounded-xl border border-border bg-bg p-6">
                  <Icon className="size-5 text-gold" aria-hidden />
                  <h3 className="mt-4 font-display text-lg font-semibold tracking-tight">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{f.body}</p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      <CtaBand
        title="See it with your own cars in it"
        lead="Every member gets The Garage from the first day of their care schedule. Start with a conversation and a free vehicle audit, and your audit findings become the first entries in your record."
      />
    </>
  );
}
