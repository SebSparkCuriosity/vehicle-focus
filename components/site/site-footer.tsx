import Link from "next/link";
import { Lock, Mail, Phone } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Container } from "@/components/site/section";
import { CONTACT, NAV } from "@/components/site/content";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface/40">
      <Container className="grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted">
            Specialist care, movement and record-keeping for supercars, hypercars and private collections. Run from the Channel Islands, with trusted associates across the UK and Europe.
          </p>
          <p className="mt-5 inline-flex items-center gap-2 text-xs text-subtle">
            <Lock className="size-3.5 text-gold" aria-hidden />
            NDAs offered as standard. Every arrangement is private.
          </p>
        </div>

        <div>
          <p className="eyebrow">Explore</p>
          <ul className="mt-5 grid gap-2.5 text-sm">
            {NAV.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-muted transition-colors hover:text-text">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/readiness" className="text-muted transition-colors hover:text-text">
                Readiness check
              </Link>
            </li>
            <li>
              <Link href="/login" className="text-gold transition-colors hover:text-gold-bright">
                Client sign in
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="eyebrow">Contact</p>
          <ul className="mt-5 grid gap-3 text-sm">
            <li>
              <a href={CONTACT.phoneHref} className="inline-flex items-center gap-2 text-text hover:text-gold">
                <Phone className="size-4 text-subtle" aria-hidden />
                {CONTACT.phone}
              </a>
              <p className="mt-1 pl-6 text-xs text-subtle">Answered 24/7</p>
            </li>
            <li>
              <a href={CONTACT.emailHref} className="inline-flex items-center gap-2 text-text hover:text-gold">
                <Mail className="size-4 text-subtle" aria-hidden />
                {CONTACT.email}
              </a>
            </li>
          </ul>
          <p className="mt-6 text-xs uppercase tracking-[0.18em] text-subtle">{CONTACT.coverage.join("  ·  ")}</p>
        </div>
      </Container>
      <div className="border-t border-border">
        <Container className="flex flex-col gap-2 py-6 text-xs text-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Vehicle Focus Automotive Concierge. All rights reserved.</p>
          <p>Jersey, Channel Islands</p>
        </Container>
      </div>
    </footer>
  );
}
