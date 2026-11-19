import type { Metadata } from "next";
import { BarChart3, FileSignature, Handshake, KeyRound, Landmark, ScrollText, UserCheck } from "lucide-react";
import { Container, PageHero, Section, SectionHeading } from "@/components/site/section";
import { LeadForm } from "@/components/site/lead-form";
import { ButtonLink } from "@/components/ui/button";
import { CONTACT } from "@/components/site/content";

export const metadata: Metadata = {
  title: "For Wealth Managers, Family Offices & PAs",
  description:
    "Vehicle Focus works alongside wealth managers, family offices and personal assistants in Jersey and the Channel Islands to care for clients' supercars and collections, with delegate access, NDAs and reporting for insurance and succession.",
  alternates: { canonical: "/advisers" },
};

const AUDIENCES = [
  {
    icon: Landmark,
    title: "Wealth managers",
    body: "Your clients' cars are often among their most visible and least managed assets. We give you a trusted name to refer to and condition and valuation reporting you can rely on.",
  },
  {
    icon: ScrollText,
    title: "Family offices",
    body: "One accountable provider across the family's vehicles, with a single schedule, consolidated records and reports formatted for the people who need them.",
  },
  {
    icon: UserCheck,
    title: "Personal assistants",
    body: "Stop chasing garages, transporters and insurers. Raise a request in The Garage or call one number, and get a confirmation back in writing.",
  },
];

const HOW = [
  {
    icon: KeyRound,
    title: "Delegate access with limits",
    body: "Each adviser or assistant gets their own sign-in to The Garage. Assistants can book and track. Family offices can see reports and valuations without seeing private messages. The owner sees everything and can remove access at any time.",
  },
  {
    icon: FileSignature,
    title: "Discretion in writing",
    body: "NDAs are offered as standard, for the owner and for the advisers around them. Cars are moved without fanfare and nothing about a collection is discussed outside the arrangement.",
  },
  {
    icon: BarChart3,
    title: "Reporting that stands up",
    body: "Condition reports, recorded check readings, service records and valuation history, ordered by car. Useful for agreed-value insurance, for audits and for succession planning when cars pass between generations.",
  },
  {
    icon: Handshake,
    title: "A simple referral arrangement",
    body: "Introduce a client and Lawrence handles the conversation personally. You're kept informed to the degree your client wants, and never left wondering what happened.",
  },
];

export default function AdvisersPage() {
  return (
    <>
      <PageHero
        eyebrow="For advisers"
        title="For the people who look after the people with the cars"
        lead="A collection of supercars or classics needs the same care as any other significant asset: a schedule, records and someone accountable. We work alongside wealth managers, family offices and personal assistants to provide exactly that, with discretion as standard."
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="#refer" size="lg">
            Make an introduction
          </ButtonLink>
          <ButtonLink href="/the-garage" size="lg" variant="outline">
            See delegate access
          </ButtonLink>
        </div>
      </PageHero>

      <Section>
        <div className="grid gap-5 md:grid-cols-3">
          {AUDIENCES.map((a) => {
            const Icon = a.icon;
            return (
              <div key={a.title} className="rounded-xl border border-border bg-surface p-6 sm:p-7">
                <Icon className="size-6 text-gold" aria-hidden />
                <h2 className="mt-5 font-display text-xl font-semibold tracking-tight">{a.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">{a.body}</p>
              </div>
            );
          })}
        </div>
      </Section>

      <section className="border-y border-border bg-surface/40 py-20 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="How we work with you"
            title="Built for arrangements with more than one person in them"
            lead="Owners of significant collections rarely manage them alone. The service and The Garage are designed around that."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {HOW.map((h) => {
              const Icon = h.icon;
              return (
                <div key={h.title} className="flex gap-5 rounded-xl border border-border bg-bg p-6">
                  <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-gold-soft">
                    <Icon className="size-5 text-gold" aria-hidden />
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-semibold tracking-tight">{h.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{h.body}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      <Section id="refer" className="scroll-mt-20">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Make an introduction"
              title="Start a confidential conversation"
              lead="Tell us a little about who you represent and what they need. There's no need to name your client at this stage. Lawrence will come back to you personally."
            />
            <div className="mt-8 rounded-xl border border-border bg-surface p-5 text-sm">
              <p className="text-muted">Prefer to talk first?</p>
              <a href={CONTACT.phoneHref} className="mt-1 block font-display text-lg font-semibold text-text hover:text-gold">
                {CONTACT.phone}
              </a>
              <a href={CONTACT.emailHref} className="mt-1 block text-gold hover:text-gold-bright">
                {CONTACT.email}
              </a>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-5 sm:p-8">
            <LeadForm
              source="Adviser"
              idPrefix="adviser"
              defaultRole="Wealth manager"
              roles={["Wealth manager", "Family office", "Personal assistant", "Other"]}
              carsLabel="Organisation (optional)"
              carsPlaceholder="Firm or office name"
              messageLabel="What does your client need?"
              messagePlaceholder="Number of cars, where they're kept, and what currently falls through the gaps."
              submitLabel="Send introduction"
            />
          </div>
        </div>
      </Section>
    </>
  );
}
