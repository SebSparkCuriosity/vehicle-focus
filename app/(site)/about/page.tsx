import type { Metadata } from "next";
import { Flag, Globe2, Ship, Wrench } from "lucide-react";
import { Container, PageHero, Section, SectionHeading } from "@/components/site/section";
import { CtaBand } from "@/components/site/blocks";

export const metadata: Metadata = {
  title: "About Vehicle Focus and Founder Lawrence Slatter-Buesnel",
  description:
    "Vehicle Focus was founded in Jersey by Lawrence Slatter-Buesnel, a lifelong motorsport competitor with a background in vehicle importation and logistics, to care for supercars and hypercars across the Channel Islands, UK and Europe.",
  alternates: { canonical: "/about" },
};

const JOURNEY = [
  {
    icon: Flag,
    title: "Motorsport",
    body: "Raced locally across several disciplines from a young age, gaining first-hand experience of high-performance vehicle dynamics, mechanics and the demands of precision engineering.",
  },
  {
    icon: Ship,
    title: "Importation and logistics",
    body: "Built a career in vehicle importation, logistics and relocation, delivering high-value cars with care, compliance and efficiency.",
  },
  {
    icon: Wrench,
    title: "A small circle of owners",
    body: "Began looking after supercars and hypercars for a handful of high-net-worth owners who trusted his discretion and technical judgement.",
  },
  {
    icon: Globe2,
    title: "Vehicle Focus",
    body: "Founded Vehicle Focus Automotive Concierge when it was clear how many owners had the same problem and nowhere reliable to take it.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="Built by someone who has always been around performance cars"
        lead="Vehicle Focus exists for owners who want their cars looked after properly, by people who understand them, without it taking up their time."
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="relative aspect-[4/5] w-full max-w-sm overflow-hidden rounded-2xl border border-border bg-surface">
              <div className="absolute inset-0 spotlight" aria-hidden />
              <div className="absolute inset-0 hairline-grid opacity-70" aria-hidden />
              <div className="relative flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
                <span className="grid size-24 place-items-center rounded-full border border-gold/40 bg-bg font-display text-3xl font-semibold text-gold">LS</span>
                <div>
                  <p className="font-display text-lg font-semibold">Lawrence Slatter-Buesnel</p>
                  <p className="text-sm text-muted">Founder, Vehicle Focus</p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <p className="eyebrow">Lawrence Slatter-Buesnel, founder</p>
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl">From the paddock to your garage</h2>
            <div className="mt-6 grid gap-5 text-base leading-relaxed text-muted">
              <p>
                From a young age, a passion for all things automotive has driven Lawrence, figuratively and literally. Growing up immersed in motorsport, he raced locally across multiple disciplines and learned what it takes to keep performance cars operating at their peak.
              </p>
              <p>
                His career then moved into vehicle importation, logistics and relocation, making sure high-value cars were transported and delivered with absolute care, compliance and efficiency. Along the way he found himself supporting a small, exclusive group of owners who trusted him with their supercars and hypercars because his discretion and technical judgement were beyond question.
              </p>
              <p>
                Recognising the need for bespoke, asset-focused vehicle management, he founded Vehicle Focus Automotive Concierge: a dedicated service for owners who want nothing but the best for their cars. From proactive maintenance and readiness to international logistics and track preparation, every collection is cared for with expertise, professionalism and absolute confidentiality.
              </p>
              <p className="font-display text-xl text-text">You deal with Lawrence directly.</p>
            </div>

            <ol className="mt-12 grid gap-4 sm:grid-cols-2">
              {JOURNEY.map((j) => {
                const Icon = j.icon;
                return (
                  <li key={j.title} className="rounded-xl border border-border bg-surface p-5">
                    <Icon className="size-5 text-gold" aria-hidden />
                    <h3 className="mt-4 font-display font-semibold">{j.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted">{j.body}</p>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </Section>

      <section className="border-y border-border bg-surface/40 py-20 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <SectionHeading
            eyebrow="The team"
            title="Specialists here, associates wherever the car goes"
            lead="We've assembled a team of highly skilled specialists to carry out whatever these cars need across the Channel Islands. Beyond the islands, trusted associates are positioned throughout the UK, Europe and further afield, so response times stay short wherever the car happens to be."
          />
          <ul className="grid gap-4">
            {[
              ["Channel Islands", "Home base and primary operating region. Our own technicians, storage and logistics."],
              ["United Kingdom", "Associates for transport, marque specialists, circuits and pre-purchase inspections."],
              ["Europe", "Associates for shipping, storage and meet-and-greet, including the French coast and Monaco."],
              ["Worldwide", "Shipping and compliance coordinated on request."],
            ].map(([t, b]) => (
              <li key={t} className="rounded-xl border border-border bg-bg p-5">
                <p className="font-display font-semibold">{t}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted">{b}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <Section>
        <SectionHeading
          align="center"
          eyebrow="Growing with our clients"
          title="Capability follows the collections"
          lead="The client base is growing consistently, and we grow with it: adding capability and coverage as our clients' cars travel further. If we can't do something properly, we'll say so and find who can."
        />
      </Section>

      <CtaBand title="Talk to Lawrence" lead="A private, no-obligation conversation about your cars and how you use them." />
    </>
  );
}
