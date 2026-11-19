import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpLeft } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { signInAs } from "@/lib/actions";
import { getClients, getTeam, getVehicles } from "@/lib/data/queries";
import { TIERS } from "@/lib/domain";

export const metadata: Metadata = { title: "Sign in" };

function initials(name: string) {
  return name
    .replace(/^(Dr|Mr|Mrs|Ms)\s+/, "")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");
}

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  const [clients, team, vehicles] = await Promise.all([getClients(), getTeam(), getVehicles()]);
  const safeNext = (prefix: string) => (next?.startsWith(prefix) ? next : undefined);

  return (
    <main className="relative isolate flex min-h-svh flex-col overflow-hidden">
      <Image src="/images/showroom-green.jpg" alt="" fill preload sizes="100vw" className="-z-20 object-cover object-[60%_50%]" />
      <div className="photo-scrim absolute inset-0 -z-10" aria-hidden />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/70 via-black/30 to-transparent" aria-hidden />

      <header className="flex items-center justify-between px-5 py-6 sm:px-10">
        <Logo />
        <Link
          href="/"
          className="glass-dark inline-flex min-h-11 items-center gap-1.5 rounded-full px-4 py-2 text-[0.8rem] text-white/80 transition-colors hover:text-white"
        >
          <ArrowUpLeft className="size-3.5" /> <span className="hidden sm:inline">Back to the</span> website
        </Link>
      </header>

      <div className="mx-auto grid w-full max-w-6xl flex-1 items-center gap-12 px-5 pb-16 sm:px-10 lg:grid-cols-[1fr_440px] [&>*]:min-w-0">
        <div className="max-w-xl">
          <h1 className="font-display text-[2.75rem] leading-[1.02] font-normal text-balance sm:text-6xl lg:text-7xl">
            Your collection, <em className="text-white/70">exactly</em> as you left it.
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-white/70">
            The Garage is where Vehicle Focus clients see every car, every check and every document, and ask for anything with a tap.
          </p>
          <p className="mt-10 max-w-sm text-sm leading-relaxed text-white/45">
            Demo only. In production, clients sign in with a magic link and two-factor authentication.
          </p>
        </div>

        <div className="glass-dark rounded-[28px] p-2">
          <section className="p-4 pb-2">
            <h2 className="px-1 text-[0.8rem] font-medium text-muted">Sign in as a client</h2>
            <ul className="mt-3 space-y-1.5">
              {clients.map((c) => {
                const count = vehicles.filter((v) => v.clientId === c.id).length;
                return (
                  <li key={c.id}>
                    <form action={signInAs.bind(null, { kind: "client", clientId: c.id }, safeNext("/garage"))}>
                      <button className="group flex w-full items-center gap-3.5 rounded-2xl px-3 py-2.5 text-left transition-colors hover:bg-white/[0.06]">
                        <span className="grid size-10 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.06] text-[0.8rem] font-medium text-white/80">
                          {initials(c.name)}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[0.95rem] font-medium">{c.name}</span>
                          <span className="block truncate text-[0.8rem] text-muted">
                            {TIERS[c.tier].label} · {count} {count === 1 ? "car" : "cars"}
                          </span>
                        </span>
                        <ArrowRight className="size-4 shrink-0 text-white/25 transition-all group-hover:translate-x-0.5 group-hover:text-accent" />
                      </button>
                    </form>
                  </li>
                );
              })}
            </ul>
          </section>

          <div className="rule-lit mx-4 my-2" />

          <section className="p-4 pt-2">
            <h2 className="px-1 text-[0.8rem] font-medium text-muted">Or as the Vehicle Focus team</h2>
            <ul className="mt-3 space-y-1.5">
              {team.map((t) => (
                <li key={t.id}>
                  <form action={signInAs.bind(null, { kind: "team", memberId: t.id }, safeNext("/console"))}>
                    <button className="group flex w-full items-center gap-3.5 rounded-2xl px-3 py-2.5 text-left transition-colors hover:bg-white/[0.06]">
                      <span className="grid size-10 shrink-0 place-items-center rounded-full border border-accent/40 bg-accent/10 text-[0.8rem] font-semibold text-accent">
                        {t.initials}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[0.95rem] font-medium">{t.name}</span>
                        <span className="block truncate text-[0.8rem] text-muted">{t.role}</span>
                      </span>
                      <ArrowRight className="size-4 shrink-0 text-white/25 transition-all group-hover:translate-x-0.5 group-hover:text-accent" />
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
