import Image from "next/image";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="relative isolate flex min-h-screen flex-col overflow-hidden">
      <Image src="/images/showroom-blue.jpg" alt="" fill priority sizes="100vw" className="-z-20 object-cover object-[25%_50%]" />
      <div className="photo-scrim absolute inset-0 -z-10" aria-hidden />
      <div className="absolute inset-0 -z-10 bg-gradient-to-l from-black/80 via-black/40 to-transparent" aria-hidden />

      <header className="px-5 py-6 sm:px-10">
        <Logo />
      </header>

      <div className="mx-auto flex w-full max-w-6xl flex-1 items-center justify-end px-5 pb-16 sm:px-10">
        <div className="glass-dark w-full max-w-md rounded-[28px] p-8 sm:p-10">
          <p className="text-sm text-white/45">Error 404</p>
          <h1 className="mt-3 font-display text-5xl leading-[1.02] font-normal">This bay is empty.</h1>
          <p className="mt-5 leading-relaxed text-white/65">The page you wanted has moved or never existed. Your cars, we promise, are exactly where we left them.</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/" size="lg">
              Back to home
            </ButtonLink>
            <ButtonLink href="/contact" size="lg" variant="secondary">
              Request a call
            </ButtonLink>
          </div>
          <Link href="/login" className="mt-6 inline-block text-sm text-white/50 underline decoration-white/20 underline-offset-4 hover:text-white">
            Client sign in
          </Link>
        </div>
      </div>
    </main>
  );
}
