import type { Metadata } from "next";
import { BackdropLayer, Container, PhotoHero } from "@/components/site/section";
import { LeadForm } from "@/components/site/lead-form";
import { CONTACT } from "@/components/site/content";

export const metadata: Metadata = {
  title: "Contact: Request a Call",
  description:
    "Request a call with Vehicle Focus, automotive concierge for supercars and classic cars in Jersey, the Channel Islands, UK and Europe. Phone answered 24/7. NDAs offered as standard.",
  alternates: { canonical: "/contact" },
};

const CHANNELS = [
  { label: "Phone, answered 24/7", value: CONTACT.phone, href: CONTACT.phoneHref },
  { label: "WhatsApp", value: "Message the same number", href: CONTACT.whatsappHref },
  { label: "Email", value: CONTACT.email, href: CONTACT.emailHref },
];

export default function ContactPage() {
  return (
    <>
      <PhotoHero
        image="/images/showroom-green.jpg"
        position="62% 50%"
        title="Request a call"
        lead="Whether you own the cars, look after someone who does, or manage their wealth, it starts with a private conversation. Lawrence will call you, usually the same day."
      />
      <section className="relative isolate overflow-hidden py-10 sm:py-16 md:py-24">
        <BackdropLayer />
        <Container className="grid gap-6 lg:grid-cols-[1.35fr_1fr] lg:gap-8 [&>*]:min-w-0">
          <div className="glass-dark rounded-[28px] p-6 sm:p-10">
            <h2 className="font-display text-[1.9rem] leading-tight font-normal sm:text-3xl">Tell us about the cars</h2>
            <p className="mt-2 mb-6 text-sm text-white/50 sm:mb-8">Only your name and email are required.</p>
            <LeadForm source="Website" idPrefix="contact" />
          </div>

          <aside className="glass-dark self-start rounded-[28px] p-6 sm:p-9">
            <h2 className="text-sm font-medium text-white/50">Talk to us directly</h2>
            <ul className="mt-4 divide-y divide-white/[0.08]">
              {CHANNELS.map((c) => (
                <li key={c.label}>
                  <a href={c.href} className="group block min-h-14 py-3.5">
                    <span className="block text-xs text-white/45">{c.label}</span>
                    <span className="mt-1 block truncate text-lg text-white group-hover:text-white/80">{c.value}</span>
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-6 border-t border-white/[0.08] pt-6">
              <h3 className="font-semibold">Where we work</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60">
                Run from Jersey, covering the Channel Islands, with associates across the UK and Europe. Worldwide shipping on request.
              </p>
            </div>
            <div className="mt-6 border-t border-white/[0.08] pt-6">
              <h3 className="font-semibold">Prefer to read first?</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60">
                Our brochure covers every service and how onboarding works. Ask for a copy in the form or on WhatsApp.
              </p>
            </div>
            <p className="mt-8 text-xs leading-relaxed text-white/55">
              NDAs are offered as standard and every arrangement is private. Your details are only used to respond to you.
            </p>
          </aside>
        </Container>
      </section>
    </>
  );
}
