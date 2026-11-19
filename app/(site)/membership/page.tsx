import type { Metadata } from "next";
import { Check, Minus } from "lucide-react";
import { BackdropLayer, Container, PhotoHero, SectionHeading } from "@/components/site/section";
import { CtaBand, TierCards, Timeline } from "@/components/site/blocks";
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
  if (value === true) return <Check className="mx-auto size-4 text-white/80" aria-label="Included" />;
  if (value === false) return <Minus className="mx-auto size-4 text-white/20" aria-label="Not included" />;
  return <span className="text-sm text-white/85">{value}</span>;
}

const FAQ = [
  {
    q: "Why don't you publish prices?",
    a: "Because the job varies enormously. One weekend car at home and five hypercars across two islands and Monaco aren't comparable. After the audit you get one monthly figure for the whole collection, and anything outside it is quoted first.",
  },
  {
    q: "Can I mix tiers across cars?",
    a: "Yes. A daily car might sit on Gold while a stored classic sits on Black Label. The schedule follows the cars, not the label.",
  },
  {
    q: "What does the vehicle audit involve?",
    a: "We inspect each car, check battery, tyres and fluids, review the history and paperwork, and flag anything that needs attention now. You keep the findings either way.",
  },
  {
    q: "Do I have to store the car with you?",
    a: "No. Most clients keep their cars at home and we come to them. Secure short-term storage is there when you travel or lay a car up for winter.",
  },
  {
    q: "Who can I give access to?",
    a: "Platinum and Black Label include delegate access, so a PA, partner, family office or driver can book and track requests in The Garage with their own login.",
  },
];

export default function MembershipPage() {
  return (
    <>
      <PhotoHero
        image="/images/cars/cullinan-mayfair.jpg"
        position="50% 65%"
        title={
          <>
            Three levels of care. <em className="text-white/70">One</em> standard.
          </>
        }
        lead="From quarterly health checks to weekly readiness. Every member gets The Garage, and every package is tailored to the collection."
      >
        <ButtonLink href="/contact" size="lg">
          Book a free vehicle audit
        </ButtonLink>
      </PhotoHero>

      <section className="relative isolate overflow-hidden py-24 sm:py-32">
        <BackdropLayer />
        <Container>
          <TierCards detailed className="lg:mt-4" />
          <p className="mx-auto mt-10 max-w-xl text-center text-sm leading-relaxed text-white/50">
            Priced per collection after a free vehicle audit. One monthly figure, and nothing outside it happens without a quote.
          </p>

          <div className="mt-28">
            <SectionHeading title="Side by side" />
            <div className="glass-dark mt-10 overflow-x-auto rounded-[28px]">
              <table className="w-full min-w-[640px] border-collapse text-left">
                <caption className="sr-only">Membership comparison</caption>
                <thead>
                  <tr className="border-b border-white/[0.08]">
                    <th scope="col" className="px-6 py-5 text-[0.8rem] font-medium text-white/45">
                      What&apos;s included
                    </th>
                    {["Gold", "Platinum", "Black Label"].map((t) => (
                      <th key={t} scope="col" className={cn("px-6 py-5 text-center font-display text-xl font-normal", t === "Platinum" && "bg-white/[0.04]")}>
                        {t}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON.map((row) => (
                    <tr key={row.feature} className="border-b border-white/[0.06] last:border-b-0">
                      <th scope="row" className="px-6 py-4 text-sm font-normal text-white/65">
                        {row.feature}
                      </th>
                      <td className="px-6 py-4 text-center">
                        <Cell value={row.gold} />
                      </td>
                      <td className="bg-white/[0.04] px-6 py-4 text-center">
                        <Cell value={row.platinum} />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Cell value={row.blackLabel} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-24 sm:py-32">
        <Container>
          <SectionHeading title="From first call to first report" lead="The audit is where membership starts. It tells us what the cars need, and tells you what we'd do about it." />
          <Timeline steps={STEPS} className="mt-16" />
        </Container>
      </section>

      <section className="pb-24 sm:pb-32">
        <Container className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 [&>*]:min-w-0">
          <SectionHeading title="Questions people ask" />
          <div className="divide-y divide-white/[0.08] border-y border-white/[0.08]">
            {FAQ.map((f) => (
              <details key={f.q} className="group py-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-[1.05rem] font-medium [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span className="text-xl leading-none font-light text-white/40 transition-transform group-open:rotate-45" aria-hidden>
                    +
                  </span>
                </summary>
                <p className="mt-3 max-w-xl leading-relaxed text-white/60">{f.a}</p>
              </details>
            ))}
          </div>
        </Container>
      </section>

      <CtaBand title="Book your free vehicle audit" primaryLabel="Book the audit" image="/images/cars/huracan.jpg" position="50% 55%" />
    </>
  );
}
