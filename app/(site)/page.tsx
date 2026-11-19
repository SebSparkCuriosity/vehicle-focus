import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { BackdropLayer, Container, PhotoBand, SectionHeading } from "@/components/site/section";
import { GarageMock, PhoneMock } from "@/components/site/garage-mock";
import { CtaBand, TextLink, TierCards, Timeline } from "@/components/site/blocks";
import { PRINCIPLES, SERVICE_GROUPS, STEPS } from "@/components/site/content";

export const metadata: Metadata = {
  title: { absolute: "Vehicle Focus | Supercar Care, Storage & Concierge in Jersey" },
  description:
    "Automotive concierge for supercar, hypercar and classic car owners in Jersey and the Channel Islands. Scheduled checks, battery care, secure storage, logistics and complete records, all visible in your own client portal.",
  alternates: { canonical: "/" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AutomotiveBusiness",
  name: "Vehicle Focus Automotive Concierge",
  url: "https://www.vehicle-focus.com",
  telephone: "+44 7797 738888",
  email: "247@vehicle-focus.com",
  description:
    "Specialist care, movement and record-keeping for supercars, hypercars and private collections across the Channel Islands, UK and Europe.",
  slogan: "Effortless ownership, perfectly managed",
  address: { "@type": "PostalAddress", addressRegion: "Jersey", addressCountry: "JE" },
  areaServed: ["Jersey", "Guernsey", "United Kingdom", "Europe"],
  founder: { "@type": "Person", name: "Lawrence Slatter-Buesnel" },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    opens: "00:00",
    closes: "23:59",
  },
  knowsAbout: [
    "Supercar storage",
    "Hypercar maintenance",
    "Battery conditioning",
    "Vehicle logistics",
    "Classic car provenance",
    "Paint protection film",
  ],
};

const PROBLEMS = [
  { title: "There's never enough time.", body: "Schedules and travel leave little room for the finer details of ownership." },
  { title: "Small jobs become pressure.", body: "Flat batteries, service windows and paperwork deadlines turn pleasure into admin." },
  { title: "Neglect costs real money.", body: "Missed maintenance and patchy records quietly erode performance and value." },
];

const GARAGE_POINTS = [
  "Live status and location for every car",
  "Real readings from every check: battery, tyres, fluids, mileage",
  "One-tap requests, confirmed in writing",
  "Access for your PA or family office",
];

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <PhotoBand image="/images/showroom-green.jpg" position="62% 50%" preload scrim="left" className="min-h-[100svh]">
        <Container className="grid min-h-[100svh] items-end gap-12 pt-28 pb-10 sm:pt-32 sm:pb-16 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:pb-24 [&>*]:min-w-0">
          <div>
            <h1 className="font-display text-[2.55rem] leading-[1.02] font-normal text-balance sm:text-7xl sm:leading-[1] lg:text-[5.4rem]">
              Your cars, cared for, ready and <em className="text-white/70">recorded</em>.
            </h1>
            <p className="mt-5 max-w-md text-[1.05rem] leading-relaxed text-white/72 sm:mt-7 sm:text-lg">
              Specialist care, movement and record-keeping for supercars, hypercars and private collections. Run from Jersey.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row">
              <ButtonLink href="/contact" size="lg">
                Request a call
                <ArrowRight aria-hidden />
              </ButtonLink>
              <ButtonLink href="/the-garage" size="lg" variant="secondary">
                See The Garage
              </ButtonLink>
            </div>
            <p className="mt-6 text-sm text-white/45 sm:mt-8">No chasing garages. No storage worries. No last-minute surprises.</p>
          </div>
          <GarageMock className="hidden sm:block lg:ml-auto lg:max-w-[30rem]" />
        </Container>
      </PhotoBand>

      {/* Why it matters */}
      <PhotoBand image="/images/showroom-blue.jpg" position="30% 50%" scrim="right">
        <Container className="grid py-16 sm:py-28 md:py-40 lg:grid-cols-2">
          <div className="lg:col-start-2">
            <h2 className="font-display text-[2.3rem] leading-[1.04] font-normal text-balance sm:text-6xl sm:leading-[1.02]">
              Great cars don&apos;t fail loudly. They <em className="text-white/70">fade</em> quietly.
            </h2>
            <p className="mt-5 max-w-md text-[1.05rem] leading-relaxed text-white/65 sm:mt-6 sm:text-lg">
              The damage builds in the weeks a car sits unused and unwatched. A battery drifts flat, tyres flat-spot, fluids age, paperwork slips.
            </p>
            <ol className="mt-8 grid gap-5 border-t border-white/10 pt-6 sm:mt-12 sm:gap-6 sm:pt-8">
              {PROBLEMS.map((p, i) => (
                <li key={p.title} className="grid grid-cols-[2rem_1fr] gap-4">
                  <span className="pt-0.5 text-sm text-white/55 tabular">0{i + 1}</span>
                  <p className="text-[0.98rem] leading-relaxed text-white/60">
                    <span className="text-white">{p.title}</span> {p.body}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </PhotoBand>

      {/* Principles */}
      <section className="py-14 sm:py-20 md:py-32">
        <Container className="grid items-center gap-10 sm:gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 [&>*]:min-w-0">
          <div className="relative mx-auto aspect-[4/3] w-full max-w-md overflow-hidden rounded-[28px] sm:aspect-[4/5] lg:mx-0">
            <Image
              src="/images/cars/porsche-interior.jpg"
              alt="A Porsche steering wheel seen through the driver's window"
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover object-[50%_55%]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" aria-hidden />
            <p className="glass-dark absolute right-4 bottom-4 left-4 rounded-2xl px-4 py-3 text-sm text-white/80">
              NDAs are offered as standard. Every arrangement is private.
            </p>
          </div>
          <div>
            <SectionHeading title="Three things we don't compromise on" />
            <ol className="mt-8 grid gap-7 sm:mt-12 sm:gap-10">
              {PRINCIPLES.map((p, i) => (
                <li key={p.title} className="grid grid-cols-[3.5rem_1fr] gap-4">
                  <span className="font-display text-4xl leading-none text-white/30">{i + 1}</span>
                  <div>
                    <h3 className="text-lg font-semibold tracking-tight">{p.title}</h3>
                    <p className="mt-2 max-w-md leading-relaxed text-white/60">{p.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </section>

      {/* Services index */}
      <section className="pb-14 sm:pb-20 md:pb-32">
        <Container>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-6">
            <SectionHeading
              title="Everything the car needs, from one team"
              lead="Twelve services in three groups. Most clients use a few on a schedule and call on the rest when they need them."
            />
            <TextLink href="/services" className="shrink-0">
              All twelve services
            </TextLink>
          </div>
          {/* Phones: three tap-to-open groups */}
          <div className="mt-8 divide-y divide-white/[0.08] border-y border-white/[0.08] md:hidden">
            {SERVICE_GROUPS.map((g) => (
              <details key={g.id} className="group">
                <summary className="flex min-h-16 cursor-pointer list-none items-center gap-4 py-5 [&::-webkit-details-marker]:hidden">
                  <span className="flex-1">
                    <span className="block font-display text-[1.7rem] leading-tight font-normal">{g.title}</span>
                    <span className="mt-1 block text-sm leading-relaxed text-white/55">{g.summary}</span>
                  </span>
                  <ChevronDown className="size-5 shrink-0 text-white/55 transition-transform group-open:rotate-180" aria-hidden />
                </summary>
                <ul className="pb-5">
                  {g.services.map((s) => (
                    <li key={s.number}>
                      <Link
                        href={`/services#${g.id}`}
                        className="flex min-h-12 items-center justify-between gap-4 border-t border-white/[0.06] text-[1rem] text-white/80"
                      >
                        {s.title}
                        <ArrowRight className="size-3.5 shrink-0 text-white/25" aria-hidden />
                      </Link>
                    </li>
                  ))}
                </ul>
              </details>
            ))}
          </div>
          {/* Tablet and up: the full index */}
          <div className="mt-14 hidden divide-y divide-white/[0.08] border-y border-white/[0.08] md:block">
            {SERVICE_GROUPS.map((g) => (
              <div key={g.id} className="grid gap-6 py-10 md:grid-cols-[1fr_1.6fr] md:gap-12">
                <div>
                  <h3 className="font-display text-3xl font-normal">{g.title}</h3>
                  <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/55">{g.summary}</p>
                </div>
                <ul className="grid gap-x-10 sm:grid-cols-2">
                  {g.services.map((s) => (
                    <li key={s.number}>
                      <Link
                        href={`/services#${g.id}`}
                        className="group flex items-center justify-between gap-4 border-b border-white/[0.06] py-3.5 text-[0.98rem] text-white/80 transition-colors hover:text-white"
                      >
                        {s.title}
                        <ArrowRight className="size-3.5 shrink-0 text-white/25 transition-all group-hover:translate-x-0.5 group-hover:text-white/70" aria-hidden />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* The Garage */}
      <PhotoBand image="/images/cars/vantage-rear.jpg" position="50% 60%" scrim="left">
        <Container className="grid items-center gap-10 py-16 sm:gap-14 sm:py-24 md:py-32 lg:grid-cols-[1.1fr_1fr] [&>*]:min-w-0">
          <div>
            <h2 className="font-display text-[2.3rem] leading-[1.04] font-normal text-balance sm:text-6xl sm:leading-[1.02]">
              Every car, every check, every document. On your phone.
            </h2>
            <p className="mt-5 max-w-md text-[1.05rem] leading-relaxed text-white/70 sm:mt-6 sm:text-lg">
              Most concierge services ask you to take their word for it. The Garage, our client portal, shows you the work the moment it&apos;s done.
            </p>
            <ul className="mt-8 max-w-md divide-y divide-white/10 border-y border-white/10 sm:mt-10">
              {GARAGE_POINTS.map((p) => (
                <li key={p} className="py-3.5 text-[0.98rem] text-white/80">
                  {p}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row">
              <ButtonLink href="/the-garage" size="lg">
                Tour The Garage
              </ButtonLink>
              <ButtonLink href="/login" size="lg" variant="secondary">
                Try the demo
              </ButtonLink>
            </div>
          </div>
          <PhoneMock className="lg:mr-0 lg:ml-auto" />
        </Container>
      </PhotoBand>

      {/* How it works */}
      <section className="py-14 sm:py-20 md:py-32">
        <Container>
          <SectionHeading
            title="Four steps, then you stop thinking about it"
            lead="Most of onboarding happens once. After that it runs quietly, and you hear from us when there's something worth telling you."
          />
          <Timeline steps={STEPS} className="mt-10 sm:mt-16" />
        </Container>
      </section>

      {/* Membership */}
      <PhotoBand image="/images/cars/huracan.jpg" position="50% 55%" scrim="full">
        <Container className="py-14 sm:py-24 md:py-32">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-6">
            <SectionHeading
              title="Three levels of care"
              lead="Priced per collection after a free vehicle audit. A single weekend car and a garage of hypercars are very different jobs."
            />
            <TextLink href="/membership" className="shrink-0">
              Compare memberships
            </TextLink>
          </div>
          <TierCards className="mt-8 sm:mt-16" />
        </Container>
      </PhotoBand>

      {/* Founder */}
      <section className="relative isolate overflow-hidden py-14 sm:py-20 md:py-32">
        <BackdropLayer />
        <Container className="grid items-center gap-10 sm:gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 [&>*]:min-w-0">
          <div className="relative mx-auto aspect-[4/3] w-full max-w-md overflow-hidden rounded-[28px] lg:mx-0 lg:aspect-[3/4] lg:max-w-sm">
            <Image
              src="/images/lawrence.jpg"
              alt="Lawrence Slatter-Buesnel, founder of Vehicle Focus"
              fill
              sizes="(min-width: 1024px) 30vw, 90vw"
              className="object-cover object-[50%_18%] lg:object-top"
            />
          </div>
          <div>
            <h2 className="font-display text-[2.15rem] leading-[1.06] font-normal text-balance sm:text-5xl sm:leading-[1.04]">You deal with Lawrence directly.</h2>
            <blockquote className="mt-6 border-l border-white/20 pl-5 font-display text-[1.2rem] leading-relaxed text-white/85 italic sm:mt-8 sm:pl-6 sm:text-2xl">
              &ldquo;From proactive maintenance and vehicle readiness to international logistics and track preparation, my team and I make sure each collection is cared for with expertise and absolute confidentiality.&rdquo;
            </blockquote>
            <p className="mt-6 max-w-lg leading-relaxed text-white/60 sm:mt-8">
              A lifetime in motorsport, then a career in vehicle importation and logistics. Vehicle Focus began by looking after cars for a small circle of owners who trusted him with them.
            </p>
            <p className="mt-6 max-w-lg leading-relaxed text-white/60">
              We work with owners, the assistants who keep their lives running, and the wealth managers and family offices who look after the bigger picture.
            </p>
            <div className="mt-6 flex flex-wrap gap-x-8 sm:mt-8">
              <TextLink href="/about">Lawrence&apos;s story</TextLink>
              <TextLink href="/advisers">For advisers and PAs</TextLink>
            </div>
          </div>
        </Container>
      </section>

      <CtaBand
        aside={
          <Link href="/readiness" className="glass-dark group flex flex-col justify-between rounded-[28px] p-6 transition-colors hover:bg-white/[0.04] sm:p-10">
            <div>
              <h2 className="font-display text-3xl leading-tight font-normal">How ready is your car right now?</h2>
              <p className="mt-4 text-sm leading-relaxed text-white/60">Six questions, two minutes. A risk score for battery, tyres, fluids, storage and records.</p>
            </div>
            <span className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-white sm:mt-10">
              Take the readiness check
              <ArrowRight className="size-4 text-white/50 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </span>
          </Link>
        }
      />
    </>
  );
}
