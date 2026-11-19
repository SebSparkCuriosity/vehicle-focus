import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/site/section";
import { MobileMenu } from "@/components/site/mobile-menu";
import { NAV } from "@/components/site/content";

/**
 * Floating smoked-glass pill over each page's photograph.
 * Zero-height sticky wrapper so the hero image runs underneath it.
 * The glass is a sibling layer, not an ancestor, so the mobile sheet's
 * position: fixed isn't trapped by backdrop-filter.
 */
export function SiteHeader() {
  return (
    <div className="sticky top-0 z-50 h-0">
      <Container className="pt-3 sm:pt-4">
        <header className="relative">
          <div className="glass-dark absolute inset-0 rounded-full bg-[rgba(10,11,13,0.78)] backdrop-blur-xl backdrop-saturate-100 md:bg-[rgba(10,11,13,0.6)]" aria-hidden />
          <div className="relative flex h-14 items-center justify-between gap-4 pr-2 pl-5 sm:pl-6">
            <Logo />
            <nav className="hidden items-center lg:flex" aria-label="Main">
              {NAV.map((l) => (
                <Link key={l.href} href={l.href} className="rounded-full px-3.5 py-2 text-[0.85rem] text-white/70 transition-colors hover:text-white">
                  {l.label}
                </Link>
              ))}
            </nav>
            <div className="hidden items-center gap-1 lg:flex">
              <Link href="/login" className="rounded-full px-3.5 py-2 text-[0.85rem] text-white/70 transition-colors hover:text-white">
                Client sign in
              </Link>
              <ButtonLink href="/contact" size="sm" className="h-10 px-5">
                Request a call
              </ButtonLink>
            </div>
            <MobileMenu links={NAV} />
          </div>
        </header>
      </Container>
    </div>
  );
}
