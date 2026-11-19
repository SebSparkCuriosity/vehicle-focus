import type { Metadata } from "next";
import { BackdropLayer, Container, PhotoHero, SectionHeading } from "@/components/site/section";
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
    title: "Wealth managers",
    body: "A client's cars are often their most visible and least managed assets. You get a trusted name to refer to, and condition and valuation reporting you can rely on.",
  },
  {
    title: "Family offices",
    body: "One accountable provider across the family's vehicles. A single schedule, consolidated records, and reports for the people who need them.",
  },
  {
    title: "Personal assistants",
    body: "Stop chasing garages, transporters and insurers. Raise a request in The Garage or call one number, and get the confirmation in writing.",
  },
];

const HOW = [
  {
    title: "Delegate access with limits",
    body: "Each adviser or assistant has their own sign-in. Assistants can book and track. Family offices see reports and valuations, not private messages. The owner sees everything.",
  },
  {
    title: "Discretion in writing",
    body: "NDAs as standard, for the owner and the advisers around them. Nothing about a collection is discussed outside the arrangement.",
  },
  {
    title: "Reporting that stands up",
    body: "Condition reports, recorded readings, service records and valuation history by car. Useful for agreed-value insurance, audits and succession.",
  },
  {
    title: "A simple referral arrangement",
    body: "Introduce a client and Lawrence handles the conversation personally. You're kept informed as far as your client wants.",
  },
];

export default function AdvisersPage() {
  return (
    <>
      <PhotoHero
        image="/images/cars/vantage-rear.jpg"
        position="50% 60%"
        title={
          <>
            For the people who look after the people with the <em className="text-white/70">cars</em>.
          </>
        }
        lead="A collection needs what any significant asset needs: a schedule, records and someone accountable. We work alongside wealth managers, family offices and assistants to provide it."
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="#refer" size="lg">
            Make an introduction
          </ButtonLink>
          <ButtonLink href="/the-garage" size="lg" variant="secondary">
            See delegate access
          </ButtonLink>
        </div>
      </PhotoHero>

      <section className="py-14 sm:py-20 md:py-32">
        <Container className="grid gap-6 sm:gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 [&>*]:min-w-0">
          <SectionHeading title="Who we work alongside" />
          <ol className="divide-y divide-white/[0.08] border-y border-white/[0.08]">
            {AUDIENCES.map((a, i) => (
              <li key={a.title} className="grid grid-cols-[2rem_1fr] gap-3 py-6 sm:grid-cols-[2.5rem_1fr] sm:gap-4 sm:py-8">
                <span className="pt-1 text-sm text-white/55 tabular">0{i + 1}</span>
                <div>
                  <h3 className="font-display text-[1.7rem] leading-tight font-normal sm:text-3xl">{a.title}</h3>
                  <p className="mt-2 max-w-lg leading-relaxed text-white/62 sm:mt-3">{a.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="relative isolate overflow-hidden py-14 sm:py-20 md:py-32">
        <BackdropLayer />
        <Container>
          <SectionHeading
            title="Built for arrangements with more than one person in them"
            lead="Owners of significant collections rarely manage them alone. The service and The Garage are designed around that."
          />
          <div className="glass-dark mt-8 grid rounded-[28px] sm:mt-14 sm:grid-cols-2">
            {HOW.map((h, i) => (
              <div
                key={h.title}
                className={[
                  "p-6 sm:p-9",
                  i % 2 === 0 ? "sm:border-r sm:border-white/[0.08]" : "",
                  i < 2 ? "border-b border-white/[0.08]" : i === 2 ? "border-b border-white/[0.08] sm:border-b-0" : "",
                ].join(" ")}
              >
                <h3 className="text-lg font-semibold tracking-tight">{h.title}</h3>
                <p className="mt-2.5 leading-relaxed text-white/60">{h.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section id="refer" className="relative isolate scroll-mt-24 overflow-hidden py-14 sm:py-20 md:py-32">
        <BackdropLayer />
        <Container className="grid gap-8 sm:gap-12 lg:grid-cols-[0.9fr_1.2fr] lg:gap-16 [&>*]:min-w-0">
          <div>
            <SectionHeading
              title="Start a confidential conversation"
              lead="Tell us who you represent and what they need. There's no need to name your client yet. Lawrence will come back to you personally."
            />
            <div className="mt-6 text-sm sm:mt-10">
              <p className="text-white/45">Prefer to talk first?</p>
              <a href={CONTACT.phoneHref} className="mt-1 flex min-h-12 items-center font-display text-3xl text-white hover:text-white/80">
                {CONTACT.phone}
              </a>
              <a href={CONTACT.emailHref} className="inline-flex min-h-11 items-center text-white/70 underline decoration-white/25 underline-offset-4 hover:text-white">
                {CONTACT.email}
              </a>
            </div>
          </div>
          <div className="glass-dark rounded-[28px] p-6 sm:p-9">
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
        </Container>
      </section>
    </>
  );
}
