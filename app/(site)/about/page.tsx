import type { Metadata } from "next";
import Image from "next/image";
import { BackdropLayer, Container, PhotoHero, SectionHeading } from "@/components/site/section";
import { CtaBand, Timeline } from "@/components/site/blocks";

export const metadata: Metadata = {
  title: "About Vehicle Focus and Founder Lawrence Slatter-Buesnel",
  description:
    "Vehicle Focus was founded in Jersey by Lawrence Slatter-Buesnel, a lifelong motorsport competitor with a background in vehicle importation and logistics, to care for supercars and hypercars across the Channel Islands, UK and Europe.",
  alternates: { canonical: "/about" },
};

const JOURNEY = [
  { title: "Motorsport", body: "Raced locally across several disciplines from a young age, learning vehicle dynamics and mechanics first-hand." },
  { title: "Logistics", body: "A career in vehicle importation and relocation, moving high-value cars with care and full compliance." },
  { title: "A few owners", body: "Began looking after supercars for a handful of owners who trusted his discretion and judgement." },
  { title: "Vehicle Focus", body: "Founded when it was clear how many owners had the same problem and nowhere reliable to take it." },
];

const COVERAGE = [
  ["Channel Islands", "Home base. Our own technicians, storage and logistics."],
  ["United Kingdom", "Associates for transport, marque specialists, circuits and pre-purchase inspections."],
  ["Europe", "Associates for shipping, storage and meet-and-greet, including the French coast and Monaco."],
  ["Worldwide", "Shipping and compliance coordinated on request."],
];

export default function AboutPage() {
  return (
    <>
      <PhotoHero
        image="/images/cars/f8-concours.jpg"
        position="50% 35%"
        title="Built by someone who has always been around performance cars"
        lead="For owners who want their cars looked after properly, by people who understand them, without it taking up their time."
      />

      <section className="py-24 sm:py-32">
        <Container className="grid items-start gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20 [&>*]:min-w-0">
          <div className="lg:sticky lg:top-28">
            <div className="relative mx-auto aspect-[3/4] w-full max-w-sm overflow-hidden rounded-[28px] lg:mx-0">
              <Image
                src="/images/lawrence.jpg"
                alt="Lawrence Slatter-Buesnel, founder of Vehicle Focus"
                fill
                sizes="(min-width: 1024px) 35vw, 90vw"
                className="object-cover object-top"
              />
            </div>
            <p className="mt-4 text-sm text-white/50">Lawrence Slatter-Buesnel, founder</p>
          </div>
          <div>
            <h2 className="font-display text-[2.4rem] leading-[1.04] font-normal text-balance sm:text-5xl">From the paddock to your garage</h2>
            <div className="mt-8 grid max-w-xl gap-5 text-[1.05rem] leading-relaxed text-white/65">
              <p>
                Lawrence grew up in motorsport, racing locally across several disciplines and learning what it takes to keep performance cars at their best.
              </p>
              <p>
                His career moved into vehicle importation, logistics and relocation. Along the way, a small group of owners began trusting him with their supercars and hypercars, because his discretion and technical judgement were beyond question.
              </p>
              <p>
                Vehicle Focus is the result: proactive maintenance and readiness, international logistics and track preparation, with every collection cared for in absolute confidence.
              </p>
            </div>
            <p className="mt-10 font-display text-3xl text-white">You deal with Lawrence directly.</p>
          </div>
        </Container>
      </section>

      <section className="pb-24 sm:pb-32">
        <Container>
          <Timeline steps={JOURNEY} />
        </Container>
      </section>

      <section className="relative isolate overflow-hidden py-24 sm:py-32">
        <BackdropLayer />
        <Container className="grid gap-12 lg:grid-cols-2 lg:gap-20 [&>*]:min-w-0">
          <SectionHeading
            title="Specialists here, associates wherever the car goes"
            lead="Our own team covers the Channel Islands. Trusted associates across the UK, Europe and beyond keep response times short wherever the car happens to be. If we can't do something properly, we'll say so and find who can."
          />
          <ul className="glass-dark divide-y divide-white/[0.08] rounded-[28px] px-7 sm:px-9">
            {COVERAGE.map(([t, b]) => (
              <li key={t} className="py-6">
                <p className="font-semibold">{t}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-white/60">{b}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <CtaBand title="Talk to Lawrence" lead="A private, no-obligation conversation about your cars and how you use them." image="/images/cars/f8-bond-street.jpg" position="40% 60%" />
    </>
  );
}
