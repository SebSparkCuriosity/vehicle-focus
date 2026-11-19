import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/button";
import { BackdropLayer, Container, PhotoBand, PhotoHero, SectionHeading } from "@/components/site/section";
import { CtaBand, ServiceList } from "@/components/site/blocks";
import { SERVICE_GROUPS } from "@/components/site/content";

export const metadata: Metadata = {
  title: "Services: Supercar Maintenance, Storage & Logistics",
  description:
    "Scheduled maintenance checks, battery care, detailing, secure storage, relocation, compliance tracking, valuation reporting and pre-purchase inspections for supercars and classic cars in Jersey, the UK and Europe.",
  alternates: { canonical: "/services" },
};

const BATTERY_POINTS = [
  ["Trickle charging and health monitoring", "Regular conditioning keeps batteries at a safe resting voltage and extends their life."],
  ["Charger testing", "Portable appliance testing on chargers, so a conditioner never becomes a fire risk in your garage."],
  ["The right regime for each chemistry", "Lead-acid, AGM, lithium-ion and hybrid high-voltage systems all need different handling between drives."],
  ["Readings at every visit", "Recorded voltages mean a tired battery is caught weeks before it strands you."],
];

export default function ServicesPage() {
  return (
    <>
      <PhotoHero
        image="/images/cars/f8-bond-street.jpg"
        position="40% 60%"
        title="Specialist care, movement and record-keeping"
        lead="Twelve services in three groups. Our own team in the Channel Islands, trusted associates across the UK and Europe, and every job logged in The Garage."
      >
        <nav aria-label="Service groups" className="flex flex-wrap gap-2">
          {SERVICE_GROUPS.map((g) => (
            <a
              key={g.id}
              href={`#${g.id}`}
              className="rounded-full border border-white/15 bg-black/30 px-4 py-2 text-sm text-white/80 backdrop-blur-md transition-colors hover:border-white/35 hover:text-white"
            >
              {g.title}
            </a>
          ))}
          <a
            href="#battery"
            className="rounded-full border border-white/15 bg-black/30 px-4 py-2 text-sm text-white/80 backdrop-blur-md transition-colors hover:border-white/35 hover:text-white"
          >
            Battery care
          </a>
        </nav>
      </PhotoHero>

      {SERVICE_GROUPS.map((g, i) => (
        <div key={g.id}>
          <section id={g.id} className="scroll-mt-24 py-20 sm:py-28">
            <Container className="grid gap-10 lg:grid-cols-[0.8fr_1.6fr] lg:gap-20 [&>*]:min-w-0">
              <div className="lg:sticky lg:top-28 lg:self-start">
                <span className="text-sm text-white/35 tabular">Part {i + 1}</span>
                <h2 className="mt-3 font-display text-[2.4rem] leading-[1.04] font-normal sm:text-5xl">{g.title}</h2>
                <p className="mt-4 max-w-xs leading-relaxed text-white/60">{g.summary}</p>
              </div>
              <ServiceList group={g} detailed />
            </Container>
          </section>
          {i === 0 ? (
            <PhotoBand image="/images/cars/vantage-rear.jpg" position="50% 60%" scrim="full">
              <Container className="py-28 sm:py-36">
                <p className="max-w-2xl font-display text-[2rem] leading-[1.15] font-normal text-balance sm:text-[2.8rem]">
                  Every check, service and movement goes into the car&apos;s record. The history builds itself.
                </p>
              </Container>
            </PhotoBand>
          ) : null}
        </div>
      ))}

      <section id="battery" className="relative isolate scroll-mt-24 overflow-hidden py-24 sm:py-32">
        <BackdropLayer />
        <Container className="grid items-start gap-12 lg:grid-cols-2 lg:gap-20 [&>*]:min-w-0">
          <div>
            <SectionHeading
              title="Batteries are the first thing to fail in a car that sits"
              lead="Many supercars use lithium-ion batteries that degrade without use and cost a lot to replace. A flat one can mean full system resets, ECU errors and lost performance data."
            />
            <p className="mt-6 max-w-md leading-relaxed text-white/60">
              Hybrids add a high-voltage system with its own state of charge to manage between drives. We treat batteries as the most common point of failure, because they are.
            </p>
            <div className="mt-9">
              <ButtonLink href="/readiness" variant="secondary">
                Check your car&apos;s battery risk
              </ButtonLink>
            </div>
          </div>
          <ol className="glass-dark divide-y divide-white/[0.08] rounded-[28px] px-7 sm:px-8">
            {BATTERY_POINTS.map(([t, b], i) => (
              <li key={t} className="grid grid-cols-[2rem_1fr] gap-4 py-6">
                <span className="pt-0.5 text-sm text-white/35 tabular">0{i + 1}</span>
                <div>
                  <h3 className="font-semibold">{t}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-white/60">{b}</p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <CtaBand
        title="Not sure which services you need?"
        lead="Most clients start with a vehicle audit. We inspect each car, review its history and recommend a care schedule. It commits you to nothing."
        primaryLabel="Book a vehicle audit"
        image="/images/showroom-green.jpg"
        position="60% 50%"
      />
    </>
  );
}
