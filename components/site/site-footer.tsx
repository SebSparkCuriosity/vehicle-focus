import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { Container } from "@/components/site/section";
import { CONTACT, NAV } from "@/components/site/content";

export function SiteFooter() {
  return (
    <footer className="relative bg-bg pb-24 lg:pb-0">
      <div className="rule-lit" />
      <Container className="grid gap-10 py-12 sm:py-16 md:grid-cols-[1.3fr_1fr_1fr] md:gap-8">
        <div>
          <Logo />
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-white/50">
            Care, movement and record-keeping for supercars, hypercars and private collections. Run from Jersey.
          </p>
        </div>

        <nav aria-label="Footer">
          <ul className="grid grid-cols-2 gap-x-6 text-[0.95rem] sm:text-sm md:gap-y-1">
            {NAV.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="inline-flex min-h-11 items-center text-white/60 transition-colors hover:text-white md:min-h-9">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/readiness" className="inline-flex min-h-11 items-center text-white/60 transition-colors hover:text-white md:min-h-9">
                Readiness check
              </Link>
            </li>
            <li>
              <Link href="/login" className="inline-flex min-h-11 items-center text-white/60 transition-colors hover:text-white md:min-h-9">
                Client sign in
              </Link>
            </li>
          </ul>
        </nav>

        <div className="text-sm">
          <a href={CONTACT.phoneHref} className="flex min-h-11 items-center text-base text-white transition-colors hover:text-white/80 md:text-sm">
            {CONTACT.phone}
          </a>
          <p className="text-xs text-white/40">Answered 24/7</p>
          <a href={CONTACT.emailHref} className="mt-2 flex min-h-11 items-center text-white/70 transition-colors hover:text-white">
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
