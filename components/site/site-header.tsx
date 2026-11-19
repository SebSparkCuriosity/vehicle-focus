import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/site/section";
import { MobileMenu } from "@/components/site/mobile-menu";
import { NAV } from "@/components/site/content";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-bg/85 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between gap-6">
        <Logo />
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {NAV.map((l) => (
            <Link key={l.href} href={l.href} className="rounded-md px-3 py-2 text-sm text-muted transition-colors hover:text-text">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 lg:flex">
          <Link href="/login" className="px-3 py-2 text-sm text-muted transition-colors hover:text-gold">
            Client sign in
          </Link>
          <ButtonLink href="/contact" size="sm">
            Request a call
          </ButtonLink>
        </div>
        <MobileMenu links={NAV} />
      </Container>
    </header>
  );
}
