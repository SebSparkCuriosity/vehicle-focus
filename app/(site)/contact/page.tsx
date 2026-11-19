import type { Metadata } from "next";
import { FileDown, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Container, PageHero } from "@/components/site/section";
import { LeadForm } from "@/components/site/lead-form";
import { CONTACT } from "@/components/site/content";

export const metadata: Metadata = {
  title: "Contact: Request a Call",
  description:
    "Request a call with Vehicle Focus, automotive concierge for supercars and classic cars in Jersey, the Channel Islands, UK and Europe. Phone answered 24/7. NDAs offered as standard.",
  alternates: { canonical: "/contact" },
};

const CHANNELS = [
  { icon: Phone, label: "Phone, 24/7", value: CONTACT.phone, href: CONTACT.phoneHref },
  { icon: MessageCircle, label: "WhatsApp", value: "Message the same number", href: CONTACT.whatsappHref },
  { icon: Mail, label: "Email", value: CONTACT.email, href: CONTACT.emailHref },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Request a call"
        lead="Whether you own the cars, look after someone who does, or manage their wealth, every arrangement starts with a private conversation. Tell us a little and Lawrence will call you, usually the same day."
      />
      <section className="py-14 sm:py-20">
        <Container className="grid gap-10 lg:grid-cols-[1.35fr_1fr] lg:gap-14">
          <div className="rounded-2xl border border-border bg-surface p-5 sm:p-8">
            <h2 className="font-display text-xl font-semibold tracking-tight">Tell us about the cars</h2>
            <p className="mt-1 mb-6 text-sm text-muted">Only your name and email are required.</p>
            <LeadForm source="Website" idPrefix="contact" />
          </div>

          <aside className="grid content-start gap-5">
            <div className="rounded-2xl border border-border bg-surface p-6">
              <p className="eyebrow">Talk to us directly</p>
              <ul className="mt-5 grid gap-4">
                {CHANNELS.map((c) => {
                  const Icon = c.icon;
                  return (
                    <li key={c.label}>
                      <a href={c.href} className="group flex items-center gap-4">
                        <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-gold-soft">
                          <Icon className="size-4 text-gold" aria-hidden />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-xs text-subtle">{c.label}</span>
                          <span className="block truncate text-sm font-medium text-text group-hover:text-gold">{c.value}</span>
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-6">
              <div className="flex items-center gap-2">
                <MapPin className="size-4 text-gold" aria-hidden />
                <p className="font-display font-semibold">Where we work</p>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Run from Jersey, covering the Channel Islands, with trusted associates throughout the UK and Europe. Shipping and logistics coordinated worldwide on request.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-6">
              <div className="flex items-center gap-2">
                <FileDown className="size-4 text-gold" aria-hidden />
                <p className="font-display font-semibold">Prefer to read first?</p>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Our brochure covers every service, how onboarding works and who you&apos;ll be dealing with. Ask for a copy in the form and we&apos;ll send it over, or request one on WhatsApp.
              </p>
            </div>

            <p className="px-1 text-xs leading-relaxed text-subtle">
              Discretion is not an add-on. NDAs are offered as standard and every arrangement is private. Your details are used only to respond to your enquiry.
            </p>
          </aside>
        </Container>
      </section>
    </>
  );
}
