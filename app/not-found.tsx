import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { CarArt } from "@/components/brand/car-art";
import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-16 text-center hairline-grid">
      <div className="pointer-events-none absolute inset-0 spotlight" aria-hidden />
      <div className="relative flex w-full max-w-lg flex-col items-center">
        <Logo />
        <div className="mt-12 w-full max-w-sm opacity-80">
          <CarArt bodyStyle="coupe" paint="#2a2a2f" title="An empty bay" />
        </div>
        <p className="eyebrow mt-10">Error 404</p>
        <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl">This bay is empty</h1>
        <p className="mt-4 text-muted">The page you were looking for has moved or never existed. Your cars, we promise, are exactly where we left them.</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/" size="lg">
            Back to home
          </ButtonLink>
          <ButtonLink href="/contact" size="lg" variant="outline">
            Request a call
          </ButtonLink>
        </div>
        <Link href="/login" className="mt-6 text-sm text-subtle hover:text-gold">
          Client sign in
        </Link>
      </div>
    </main>
  );
}
