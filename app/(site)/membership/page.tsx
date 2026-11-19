import type { Metadata } from "next";
import { Check, Minus } from "lucide-react";
import { Container, PageHero, Section, SectionHeading } from "@/components/site/section";
import { CtaBand, TierCards } from "@/components/site/blocks";
import { COMPARISON, STEPS } from "@/components/site/content";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Membership: Gold, Platinum & Black Label Concierge",
  description:
    "Three levels of automotive concierge for supercar and hypercar owners in the Channel Islands. Quarterly, monthly or weekly care, priced per collection after a free vehicle audit.",
  alternates: { canonical: "/membership" },
};

function Cell({ value }: { value: string | boolean }) {
  if (value === true) return <Check className="mx-auto size-4 text-gold" aria-label="Included" />;
  if (value === false) return <Minus className="mx-auto size-4 text-subtle" aria-label="Not included" />;
  return <span className="text-sm text-text">{value}</span>;
}

const FAQ = [
  {
    q: "Why don't you publish prices?",
    a: "Because the job varies enormously. One weekend car at home and five hypercars across two islands and Monaco aren't comparable. After the audit you get a fixed monthly figure for the whole collection, with anything outside it quoted before we do it.",
  },
  {
    q: "Can I mix tiers across cars?",
    a: "Yes. A daily-use car might sit on Gold while a stored classic and a hybrid hypercar sit on Platinum or Black Label. The schedule is built around the cars, not the label.",
  },
  {
    q: "What does the vehicle audit involve?",
    a: "We inspect each car, check battery health, tyres and fluids, review the history and paperwork, and flag anything that needs attention now. You get the findings whether or not you go ahead.",
  },
  {
    q: "Do I have to store the car with you?",
    a: "No. Most clients keep their cars at home and we come to them. Secure short-term storage is there when you travel, refurbish the garage or lay a car up for winter.",
  },
  {
    q: "Who can I give access to?",
    a: "Platinum and Black Label include delegate access, so a PA, partner, family office or driver can book and track requests in The Garage with their own login.",
  },
];

export default function MembershipPage() {
  return (
    <>
      <PageHero
        eyebrow="Membership"
        title="Three levels of care. One standard."
        lead="Each package gives your cars a different rhythm of attention, from quarterly health checks to weekly readiness. Every member gets The Garage, and every package can be tailored to the collection."
      >
        <ButtonLink href="/contact" size="lg">
          Book a free vehicle audit
        </ButtonLink>
      </PageHero>

      <Section>
        <TierCards detailed />
        <p className="mt-8 text-center text-sm text-muted">
          Priced per collection after a free vehicle audit. You get one fixed monthly figure, and nothing outside it happens without a quote.
        </p>
      </Section>

      <section className="border-y border-border bg-surface/40 py-20 sm:py-24">
        <Container>
          <SectionHeading eyebrow="Side by side" title="Compare memberships" />
          <div className="mt-10 overflow-x-auto rounded-2xl border border-border bg-bg">
            <table className="w-full min-w-[640px] border-collapse text-left">
              <caption className="sr-only">Membership comparison</caption>
              <thead>
                <tr className="border-b border-border">
                  <th scope="col" className="px-5 py-4 text-xs font-medium tracking-wide text-subtle uppercase">
                    What&apos;s included
                  </th>
                  {["Gold", "Platinum", "Black Label"].map((t) => (
                    <th key={t} scope="col" className={cn("px-5 py-4 text-center font-display text-sm font-semibold", t === "Platinum" && "text-gold")}>
                      {t}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row) => (
                  <tr key={row.feature} className="border-b border-border last:border-b-0">
                    <th scope="row" className="px-5 py-3.5 text-sm font-normal text-muted">
                      {row.feature}
                    </th>
                    <td className="px-5 py-3.5 text-center">
                      <Cell value={row.gold} />
                    </td>
                    <td className="bg-gold-soft/40 px-5 py-3.5 text-center">
                      <Cell value={row.platinum} />
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <Cell value={row.blackLabel} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
          <SectionHeading
            eyebrow="Getting started"
            title="From first call to first report"
            lead="The audit is where membership starts. It tells us what the cars need and tells you what we'd do about it."
          />
          <ol className="grid gap-4">
            {STEPS.map((s, i) => (
              <li key={s.title} className="flex gap-5 rounded-xl border border-border bg-surface p-5">
                <span className="grid size-8 shrink-0 place-items-center rounded-full border border-gold/40 font-display text-sm font-semibold text-gold tabular">{i + 1}</span>
                <div>
                  <h3 className="font-display font-semibold">{s.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      <section className="border-t border-border py-20 sm:py-24">
        <Container className="max-w-3xl">
          <SectionHeading eyebrow="Questions" title="Common questions about membership" />
          <div className="mt-10 divide-y divide-border rounded-2xl border border-border bg-surface">
            {FAQ.map((f) => (
              <details key={f.q} className="group p-5 sm:p-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span className="text-gold transition-transform group-open:rotate-45" aria-hidden>
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </Container>
      </section>

      <CtaBand title="Book your free vehicle audit" primaryLabel="Book the audit" />
    </>
  );
}
