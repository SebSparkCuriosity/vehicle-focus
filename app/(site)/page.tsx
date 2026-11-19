import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BatteryCharging,
  Briefcase,
  CalendarCheck,
  FileText,
  Gauge,
  LineChart,
  Lock,
  MessageSquare,
  UserRound,
  Users,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container, Section, SectionHeading } from "@/components/site/section";
import { CheckMock, GarageMock, RequestMock } from "@/components/site/garage-mock";
import { CtaBand, TextLink, TierCards } from "@/components/site/blocks";
import { CONTACT, PRINCIPLES, SERVICE_GROUPS, STEPS } from "@/components/site/content";

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
  {
    title: "There is never enough time",
    body: "Demanding schedules and constant travel mean even the most passionate enthusiasts rarely have time to manage the finer details of ownership.",
  },
  {
    title: "Small jobs become pressure",
    body: "Flat batteries, tight service windows, relocations and paperwork deadlines turn what should be pleasure into another item on the list.",
  },
  {
    title: "Neglect costs real money",
    body: "Missed maintenance, incomplete records and poor storage don't just inconvenience you. They quietly erode performance, provenance and long-term value.",
  },
];

const GARAGE_FEATURES = [
  { icon: Gauge, title: "Live status for every car", body: "Ready, charging, in storage, at service or on its way. Where it is and when it was last checked." },
  { icon: BatteryCharging, title: "Readings, not reassurances", body: "Battery voltage, tyre pressures, fluids and mileage from every check, recorded by the technician who did it." },
  { icon: CalendarCheck, title: "One-tap requests", body: "Have it ready for Saturday at nine, at the airport. Your request lands with the team and comes back confirmed." },
  { icon: FileText, title: "A documents vault", body: "Registration, insurance, service books and certificates, held in one place and ready when you need them." },
  { icon: LineChart, title: "History that protects value", body: "Every service, movement and valuation in one ordered record. Provenance you can hand to a buyer or insurer." },
  { icon: Users, title: "Access for the people who help you", body: "Give your PA or family office their own login so they can book and track without you in the loop." },
];

const AUDIENCES = [
  {
    icon: UserRound,
    title: "Owners",
    body: "From a single hypercar kept ready between trips to a garage of them run as a portfolio, on one schedule.",
    href: "/contact",
    cta: "Request a call",
  },
  {
    icon: Briefcase,
    title: "Personal assistants",
    body: "One number, one portal, one person accountable. Book, track and confirm without chasing garages.",
    href: "/advisers",
    cta: "How delegate access works",
  },
  {
    icon: Lock,
    title: "Wealth managers & family offices",
    body: "Condition and valuation reporting for insurance, succession and the balance sheet, handled with total discretion.",
    href: "/advisers",
    cta: "Working with advisers",
  },
];

const COVERAGE = [
  { title: "Channel Islands", body: "Home base and primary operating region." },
  { title: "UK & Europe", body: "Associates positioned for fast local response." },
  { title: "Worldwide", body: "Shipping and logistics coordinated on request." },
];

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border hairline-grid">
        <div className="pointer-events-none absolute inset-0 spotlight" aria-hidden />
        <Container className="relative grid gap-14 py-16 sm:py-24 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-12 lg:py-28">
          <div>
            <p className="eyebrow">Automotive concierge · Channel Islands</p>
            <h1 className="mt-6 font-display text-[2.6rem] leading-[1.05] font-semibold tracking-tight text-balance sm:text-6xl lg:text-[4.2rem]">
              Your cars, cared for, ready and recorded.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
              Effortless ownership, perfectly managed. We look after supercars, hypercars and private collections so they start, drive and hold their value on the day you want them.
            </p>
            <p className="mt-3 max-w-xl text-base text-subtle">No chasing garages. No storage worries. No last-minute surprises.</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/contact" size="lg">
                Request a call
                <ArrowRight aria-hidden />
              </ButtonLink>
              <ButtonLink href="/the-garage" size="lg" variant="outline">
                See The Garage
              </ButtonLink>
            </div>
            <dl className="mt-12 grid max-w-xl grid-cols-3 gap-4 border-t border-border pt-6">
              {[
                ["Cared for", "Checked, charged and serviced on a schedule"],
                ["Ready", "Fuelled, clean and legal when you want it"],
                ["Recorded", "Every job documented to protect value"],
              ].map(([t, d]) => (
                <div key={t}>
                  <dt className="font-display text-sm font-semibold text-gold">{t}</dt>
                  <dd className="mt-1 text-xs leading-relaxed text-muted sm:text-sm">{d}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="relative">
            <GarageMock />
            <p className="mt-3 text-center text-xs text-subtle">The Garage: every client&apos;s private view of their collection.</p>
          </div>
        </Container>
      </section>

      {/* Problem */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          <SectionHeading
            eyebrow="Why it matters"
            title="Great cars don't fail loudly. They fade quietly."
            lead="Supercars and hypercars are built for precision, not neglect. The damage rarely announces itself. It builds up in the weeks a car sits unused and unwatched."
          />
          <ol className="grid gap-4">
            {PROBLEMS.map((p, i) => (
              <li key={p.title} className="flex gap-5 rounded-xl border border-border bg-surface p-6">
                <span className="font-display text-sm font-semibold text-gold tabular">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="font-display text-lg font-semibold tracking-tight">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{p.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <p className="mx-auto mt-16 max-w-3xl text-center font-display text-xl leading-relaxed tracking-tight text-text/90 sm:text-2xl">
          That gap, between how these cars deserve to be kept and how much time you actually have, is the whole reason Vehicle Focus exists.
        </p>
      </Section>

      {/* Principles */}
      <section className="border-y border-border bg-surface/40 py-20 sm:py-24">
        <Container>
          <SectionHeading eyebrow="Our approach" title="Three principles we don't compromise on" />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {PRINCIPLES.map((p) => (
              <div key={p.title} className="rounded-xl border border-border bg-bg p-6 sm:p-7">
                <span className="block h-px w-10 bg-gold" aria-hidden />
                <h3 className="mt-6 font-display text-xl font-semibold tracking-tight">{p.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{p.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Services */}
      <Section id="services">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Services"
            title="Everything the car needs, handled by one team"
            lead="Twelve services in three groups. Most clients use a handful of them on a schedule and call on the rest when life demands it."
          />
          <TextLink href="/services">All services in detail</TextLink>
        </div>
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {SERVICE_GROUPS.map((g) => (
            <div key={g.id} className="flex flex-col rounded-2xl border border-border bg-surface p-6 sm:p-7">
              <h3 className="font-display text-xl font-semibold tracking-tight">{g.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{g.summary}</p>
              <ul className="mt-6 grid gap-1 border-t border-border pt-5">
                {g.services.map((s) => {
                  const Icon = s.icon;
                  return (
                    <li key={s.number}>
                      <Link
                        href={`/services#${g.id}`}
                        className="group flex items-center gap-3 rounded-lg px-2 py-2.5 text-sm transition-colors hover:bg-surface-2"
                      >
                        <Icon className="size-4 shrink-0 text-gold" aria-hidden />
                        <span className="flex-1">{s.title}</span>
                        <ArrowRight className="size-3.5 text-subtle opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* The Garage */}
      <section className="relative overflow-hidden border-y border-border py-20 sm:py-28">
        <div className="pointer-events-none absolute inset-0 hairline-grid opacity-60" aria-hidden />
        <Container className="relative">
          <div className="grid gap-14 lg:grid-cols-[1fr_1.05fr] lg:items-start">
            <div>
              <p className="eyebrow">The Garage, our client portal</p>
              <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-balance sm:text-5xl">
                Every car, every check, every document. On your phone.
              </h2>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
                Most concierge services ask you to take their word for it. We show you. Every client gets The Garage, a private portal where the work we do is visible the moment it&apos;s done.
              </p>
              <ul className="mt-10 grid gap-6 sm:grid-cols-2">
                {GARAGE_FEATURES.map((f) => {
                  const Icon = f.icon;
                  return (
                    <li key={f.title}>
                      <Icon className="size-5 text-gold" aria-hidden />
                      <h3 className="mt-3 text-sm font-semibold">{f.title}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted">{f.body}</p>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/the-garage" size="lg">
                  Tour The Garage
                </ButtonLink>
                <ButtonLink href="/login" size="lg" variant="secondary">
                  Try the demo
                </ButtonLink>
              </div>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <CheckMock />
              <RequestMock />
            </div>
          </div>
        </Container>
      </section>

      {/* How it works */}
      <Section>
        <SectionHeading
          eyebrow="How it works"
          title="Four steps, then you stop thinking about it"
          lead="Onboarding is deliberately simple. Most of it happens once. After that the arrangement runs quietly in the background, and you only hear from us when there's something worth telling you."
        />
        <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <li key={s.title} className="relative rounded-xl border border-border bg-surface p-6">
              <span className="grid size-9 place-items-center rounded-full border border-gold/40 font-display text-sm font-semibold text-gold tabular">{i + 1}</span>
              <h3 className="mt-5 font-display text-lg font-semibold tracking-tight">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{s.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* Membership */}
      <section className="border-y border-border bg-surface/40 py-20 sm:py-28">
        <Container>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <SectionHeading
              eyebrow="Membership"
              title="Three levels of care, each tailored to the collection"
              lead="Membership is priced per collection after a free vehicle audit, because a single weekend car and a garage of hypercars are very different jobs."
            />
            <TextLink href="/membership">Compare memberships</TextLink>
          </div>
          <TierCards className="mt-12" />
        </Container>
      </section>

      {/* Audiences */}
      <Section>
        <SectionHeading
          eyebrow="Who we work with"
          title="Owners who would rather drive than administrate, and the people who look after them"
        />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {AUDIENCES.map((a) => {
            const Icon = a.icon;
            return (
              <div key={a.title} className="flex flex-col rounded-xl border border-border bg-surface p-6 sm:p-7">
                <Icon className="size-6 text-gold" aria-hidden />
                <h3 className="mt-5 font-display text-xl font-semibold tracking-tight">{a.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{a.body}</p>
                <div className="mt-6">
                  <TextLink href={a.href}>{a.cta}</TextLink>
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* Founder */}
      <section className="border-y border-border py-20 sm:py-28">
        <Container className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-20">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-2xl border border-border bg-surface">
            <div className="absolute inset-0 spotlight" aria-hidden />
            <div className="absolute inset-0 hairline-grid opacity-70" aria-hidden />
            <div className="relative flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
              <span className="grid size-24 place-items-center rounded-full border border-gold/40 bg-bg font-display text-3xl font-semibold text-gold">LS</span>
              <div>
                <p className="font-display text-lg font-semibold">Lawrence Slatter-Buesnel</p>
                <p className="text-sm text-muted">Founder</p>
              </div>
            </div>
          </div>
          <div>
            <p className="eyebrow">Who you&apos;ll be dealing with</p>
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl">You deal with Lawrence directly.</h2>
            <div className="mt-6 grid gap-4 text-base leading-relaxed text-muted">
              <p>
                Lawrence has spent his working life around performance cars: racing locally across several disciplines, working hands-on with performance mechanics, and building a professional background in vehicle importation and international logistics.
              </p>
              <p>
                Vehicle Focus began informally, looking after cars for a small circle of owners who trusted him with them. It became a business when it was clear how many owners had the same problem and nowhere reliable to take it.
              </p>
            </div>
            <div className="mt-8">
              <TextLink href="/about">Read Lawrence&apos;s story</TextLink>
            </div>
          </div>
        </Container>
      </section>

      {/* Readiness teaser + coverage */}
      <Section>
        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div className="relative overflow-hidden rounded-2xl border border-border bg-surface p-7 sm:p-10">
            <div className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-gold/10 blur-3xl" aria-hidden />
            <p className="eyebrow">Two-minute check</p>
            <h2 className="mt-4 font-display text-2xl font-semibold tracking-tight sm:text-3xl">How ready is your car right now?</h2>
            <p className="mt-4 max-w-lg leading-relaxed text-muted">
              Six questions about how the car is used and kept. You&apos;ll get a risk score across battery, tyres, fluids, storage and records, with a plain-English note on each.
            </p>
            <div className="mt-8">
              <ButtonLink href="/readiness" size="lg">
                Take the readiness check
                <ArrowRight aria-hidden />
              </ButtonLink>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-7 sm:p-10">
            <p className="eyebrow">Where we work</p>
            <ul className="mt-6 grid gap-5">
              {COVERAGE.map((c) => (
                <li key={c.title} className="flex gap-4">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-gold" aria-hidden />
                  <div>
                    <p className="font-display font-semibold">{c.title}</p>
                    <p className="text-sm text-muted">{c.body}</p>
                  </div>
                </li>
              ))}
            </ul>
            <a href={CONTACT.whatsappHref} className="mt-8 inline-flex items-center gap-2 text-sm text-gold hover:text-gold-bright">
              <MessageSquare className="size-4" aria-hidden />
              Message us on WhatsApp
            </a>
          </div>
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
