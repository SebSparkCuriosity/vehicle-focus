import type { Metadata } from "next";
import { BatteryWarning, Flame, PlugZap, Zap } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container, PageHero, Section, SectionHeading } from "@/components/site/section";
import { CtaBand, ServiceGroupGrid } from "@/components/site/blocks";
import { SERVICE_GROUPS } from "@/components/site/content";

export const metadata: Metadata = {
  title: "Services: Supercar Maintenance, Storage & Logistics",
  description:
    "Scheduled maintenance checks, battery care, detailing, secure storage, relocation, compliance tracking, valuation reporting and pre-purchase inspections for supercars and classic cars in Jersey, the UK and Europe.",
  alternates: { canonical: "/services" },
};

const BATTERY_POINTS = [
  { icon: PlugZap, title: "Trickle charging and health monitoring", body: "Regular conditioning keeps batteries at a safe resting voltage and extends their life." },
  { icon: Flame, title: "Charger testing", body: "Portable appliance testing on chargers to prevent overheating or electrical fire risk in your garage." },
  { icon: Zap, title: "Optimised storage charging", body: "The right charging regime for each car's chemistry, so there are no sudden failures when you want to drive." },
  { icon: BatteryWarning, title: "Voltage checks and diagnostics", body: "Recorded readings at every visit, so a tired battery is caught weeks before it strands you." },
];

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Specialist care, movement and record-keeping"
        lead="Twelve services in three groups, delivered by our own team across the Channel Islands and by trusted associates throughout the UK and Europe. Every job is logged in The Garage, your client portal."
      >
        <nav aria-label="Service groups" className="flex flex-wrap gap-2">
          {SERVICE_GROUPS.map((g) => (
            <a
              key={g.id}
              href={`#${g.id}`}
              className="rounded-full border border-border bg-surface px-4 py-2 text-sm text-muted transition-colors hover:border-gold hover:text-gold"
            >
              {g.title}
            </a>
          ))}
          <a href="#battery" className="rounded-full border border-border bg-surface px-4 py-2 text-sm text-muted transition-colors hover:border-gold hover:text-gold">
            Battery care
          </a>
        </nav>
      </PageHero>

      {SERVICE_GROUPS.map((g, i) => (
        <section key={g.id} id={g.id} className={i % 2 === 1 ? "scroll-mt-20 border-y border-border bg-surface/40 py-20 sm:py-24" : "scroll-mt-20 py-20 sm:py-24"}>
          <Container className="grid gap-10 lg:grid-cols-[0.75fr_1.5fr] lg:gap-16">
            <div className="lg:sticky lg:top-24 lg:self-start">
              <p className="eyebrow">Part {i + 1} of 3</p>
              <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl">{g.title}</h2>
              <p className="mt-4 leading-relaxed text-muted">{g.summary}</p>
            </div>
            <ServiceGroupGrid group={g} />
          </Container>
        </section>
      ))}

      <Section id="battery" className="scroll-mt-20 border-t border-border">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Battery care in depth"
              title="Preventing failure and fire risk"
              lead="Unlike everyday cars, many supercars use high-performance lithium-ion batteries that degrade without use and are costly to replace. A flat battery isn't just an inconvenience: it can mean full system resets, ECU errors and lost performance data."
            />
            <p className="mt-6 leading-relaxed text-muted">
              Hybrids such as the SF90, Artura and Revuelto add a high-voltage system that needs its own state of charge managed between drives. We treat batteries as the single most common point of failure for cars that sit, because that is what they are.
            </p>
            <div className="mt-8">
              <ButtonLink href="/readiness" variant="outline">
                Check your car&apos;s battery risk
              </ButtonLink>
            </div>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2">
            {BATTERY_POINTS.map((p) => {
              const Icon = p.icon;
              return (
                <li key={p.title} className="rounded-xl border border-border bg-surface p-6">
                  <Icon className="size-5 text-gold" aria-hidden />
                  <h3 className="mt-4 font-display text-base font-semibold tracking-tight">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{p.body}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </Section>

      <CtaBand
        title="Not sure which services you need?"
        lead="Most clients start with a vehicle audit. We inspect each car, review its history and paperwork, and recommend a care schedule. It costs nothing and commits you to nothing."
        primaryLabel="Book a vehicle audit"
      />
    </>
  );
}
