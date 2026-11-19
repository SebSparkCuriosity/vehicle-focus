import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { Container } from "@/components/site/section";
import { CONTACT, NAV } from "@/components/site/content";

export function SiteFooter() {
  return (
    <footer className="relative bg-bg">
      <div className="rule-lit" />
      <Container className="grid gap-12 py-16 md:grid-cols-[1.3fr_1fr_1fr] md:gap-8">
        <div>
          <Logo />
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-white/50">
            Care, movement and record-keeping for supercars, hypercars and private collections. Run from Jersey.
          </p>
        </div>

        <nav aria-label="Footer">
          <ul className="grid grid-cols-2 gap-x-6 gap-y-2.5 text-sm">
            {NAV.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-white/60 transition-colors hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/readiness" className="text-white/60 transition-colors hover:text-white">
                Readiness check
              </Link>
            </li>
            <li>
              <Link href="/login" className="text-white/60 transition-colors hover:text-white">
                Client sign in
              </Link>
            </li>
          </ul>
        </nav>

        <div className="text-sm">
          <a href={CONTACT.phoneHref} className="block text-white transition-colors hover:text-white/80">
            {CONTACT.phone}
          </a>
          <p className="mt-1 text-xs text-white/40">Answered 24/7</p>
          <a href={CONTACT.emailHref} className="mt-4 block text-white/70 transition-colors hover:text-white">
            {CONTACT.email}
          </a>
          <p className="mt-6 text-xs text-white/40">{CONTACT.coverage.join(", ")}</p>
        </div>
      </Container>
      <Container className="flex flex-col gap-2 border-t border-white/[0.06] py-6 text-xs text-white/35 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Vehicle Focus Automotive Concierge</p>
        <p>NDAs offered as standard. Every arrangement is private.</p>
      </Container>
    </footer>
  );
}
