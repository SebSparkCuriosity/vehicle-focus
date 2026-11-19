import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { BackdropLayer, Container, PhotoBand, PhotoHero } from "@/components/site/section";
import { CheckMock, PhoneMock, RequestMock, VaultMock } from "@/components/site/garage-mock";
import { CtaBand } from "@/components/site/blocks";
import { ValueChart } from "@/components/charts";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "The Garage: Client Portal for Your Car Collection",
  description:
    "The Garage is the Vehicle Focus client portal. See every car's status, readiness checks, documents, service history and valuation trend, and book anything with one tap. Delegate access for PAs and family offices.",
  alternates: { canonical: "/the-garage" },
};

function monthsAgo(m: number) {
  const d = new Date();
  d.setMonth(d.getMonth() - m);
  return d.toISOString().slice(0, 10);
}

const VALUE_POINTS = [
  { date: monthsAgo(60), value: 198000 },
  { date: monthsAgo(36), value: 236000 },
  { date: monthsAgo(24), value: 262000 },
  { date: monthsAgo(12), value: 279000 },
  { date: monthsAgo(1), value: 286000 },
];

const HISTORY = [
  ["Fortnightly storage check", "2 weeks ago"],
  ["Returned from specialist", "2 months ago"],
  ["Annual service", "4 months ago"],
  ["Agreed-value review for insurer", "4 months ago"],
];

function FeatureRow({
  n,
  title,
  body,
  points,
  visual,
  flip = false,
}: {
  n: string;
  title: string;
  body: string;
  points?: string[];
  visual: React.ReactNode;
  flip?: boolean;
}) {
  return (
    <div className="grid items-center gap-8 sm:gap-10 lg:grid-cols-2 lg:gap-20 [&>*]:min-w-0">
      <div className={cn(flip && "lg:order-2")}>
        <span className="text-sm text-white/55 tabular">{n}</span>
        <h2 className="mt-3 font-display text-[1.9rem] leading-[1.1] font-normal text-balance sm:mt-4 sm:text-[2.6rem] sm:leading-[1.08]">{title}</h2>
        <p className="mt-4 max-w-md leading-relaxed text-white/62 sm:mt-5">{body}</p>
        {points ? (
          <ul className="mt-6 max-w-md divide-y divide-white/[0.08] border-y border-white/[0.08] text-[0.95rem] text-white/75 sm:mt-7">
            {points.map((p) => (
              <li key={p} className="py-3">
                {p}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
      <div className={cn(flip && "lg:order-1")}>{visual}</div>
    </div>
  );
}

export default function TheGaragePage() {
  return (
    <>
      <PhotoHero
        image="/images/showroom-blue.jpg"
        position="25% 50%"
        title={
          <>
            Your collection, visible the moment we <em className="text-white/70">touch</em> it.
          </>
        }
        lead="The Garage is the client portal every member gets: live status, the readings from every check, the paperwork, the history and the value. On your phone."
        aside={<PhoneMock className="hidden lg:block" />}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/login" size="lg">
            Try the demo
            <ArrowRight aria-hidden />
          </ButtonLink>
          <ButtonLink href="/contact" size="lg" variant="secondary">
            Talk to Lawrence
          </ButtonLink>
        </div>
        <p className="mt-5 text-xs text-white/55">The demo uses example cars and owners. None of it is client data.</p>
      </PhotoHero>

      <section className="relative isolate overflow-hidden py-14 sm:py-20 md:py-32">
        <BackdropLayer />
        <Container className="grid gap-16 sm:gap-20 md:gap-28">
          <FeatureRow
            n="01"
            title="Know which car is ready before you pick up the keys"
            body="Every car shows where it is, what state it's in and when it was last checked. Each visit records real readings, so a tiring battery shows up weeks before it matters."
            points={["Ready, charging, in storage, at service or in transit", "Battery, tyres against target, fluids and mileage", "A flag and a recommendation when something needs a decision"]}
            visual={<CheckMock className="mx-auto max-w-md" />}
          />
          <FeatureRow
            flip
            n="02"
            title="Ready for Saturday at nine, at the airport"
            body="Pick the car, the time and the place. The request lands with the team and comes back confirmed in the same thread, with a quote if there is one."
            points={["Raised by you or anyone you've given access to", "Every request becomes part of the car's record"]}
            visual={<RequestMock className="mx-auto max-w-md" />}
          />
          <FeatureRow
            n="03"
            title="The paperwork, finally in one place"
            body="Registration, insurance, service books, invoices and certificates, filed against the right car and ready when a broker, buyer or customs officer asks."
            points={["MOT, insurance, registration and service dates tracked for you", "Shipping and import papers kept with the car"]}
            visual={<VaultMock className="mx-auto max-w-md" />}
          />
          <FeatureRow
            flip
            n="04"
            title="A history that protects what the car is worth"
            body="Every check, service, movement and valuation, written down by the person who did it and kept in order. When it's time to sell, insure or pass a car on, the story is already told."
            visual={
              <div className="glass-dark mx-auto max-w-md rounded-[28px] p-6" role="img" aria-label="Illustration of a car's history and valuation">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-sm font-medium">Porsche 911 Carrera RS, 1992</p>
                  <p className="text-xs text-success">+44% since purchase</p>
                </div>
                <ValueChart points={VALUE_POINTS} purchasePrice={198000} className="mt-4" />
                <ul className="mt-4 divide-y divide-white/[0.07] border-t border-white/[0.07]">
                  {HISTORY.map(([t, when]) => (
                    <li key={t} className="flex items-baseline justify-between gap-4 py-2.5 text-sm">
                      <span className="truncate text-white/80">{t}</span>
                      <span className="shrink-0 text-xs text-white/55">{when}</span>
                    </li>
                  ))}
                </ul>
              </div>
            }
          />
          <FeatureRow
            n="05"
            title="Let the people who help you help themselves"
            body="A PA, family office or driver gets their own sign-in with only the access they need. One private thread connects everyone with the people who actually do the work."
            visual={
              <div className="glass-dark mx-auto grid max-w-md gap-3 rounded-[28px] p-6" role="img" aria-label="Illustration of the message thread">
                <p className="text-sm font-medium">Vehicle Focus</p>
                <div className="glass-inset max-w-[85%] rounded-2xl rounded-tl-md px-4 py-3 text-sm">
                  <p className="text-xs text-white/45">Technician</p>
                  <p className="mt-1 text-white/85">The 964&apos;s battery is resting at 12.1V even on the conditioner. I&apos;d replace it before spring.</p>
                </div>
                <div className="ml-auto max-w-[85%] rounded-2xl rounded-tr-md bg-white px-4 py-3 text-sm text-black">
                  <p className="text-xs text-black/50">Your PA</p>
                  <p className="mt-1">Go ahead, and keep the old one with the car&apos;s records.</p>
                </div>
                <div className="glass-inset max-w-[85%] rounded-2xl rounded-tl-md px-4 py-3 text-sm">
                  <p className="text-xs text-white/45">Lawrence</p>
                  <p className="mt-1 text-white/85">Booked for Thursday. The invoice will be in the vault.</p>
                </div>
              </div>
            }
          />
        </Container>
      </section>

      <PhotoBand image="/images/cars/cullinan-mayfair.jpg" position="50% 65%" scrim="full">
        <Container className="py-14 sm:py-24 md:py-32">
          <h2 className="max-w-2xl font-display text-[2.15rem] leading-[1.06] font-normal text-balance sm:text-5xl sm:leading-[1.04]">
            Built for owners who don&apos;t want to be found.
          </h2>
          <div className="glass-dark mt-8 grid divide-y divide-white/[0.08] rounded-[28px] sm:mt-12 md:grid-cols-3 md:divide-x md:divide-y-0">
            {[
              ["Two-factor sign-in", "Every account has a second factor. Delegates sign in as themselves, never with your details."],
              ["Access you control", "Choose what each delegate can see and do, and remove it in one click."],
              ["Locations, not addresses", "The portal says where a car is in words. Street addresses and garage codes stay with the team."],
            ].map(([t, b]) => (
              <div key={t} className="p-6 sm:p-8">
                <h3 className="font-semibold">{t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">{b}</p>
              </div>
            ))}
          </div>
        </Container>
      </PhotoBand>

      <CtaBand
        title="See it with your own cars in it"
        lead="Every member gets The Garage from day one. Your audit findings become the first entries in your record."
      />
    </>
  );
}
