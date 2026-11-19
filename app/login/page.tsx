import type { Metadata } from "next";
import { ArrowRight, ShieldCheck, Wrench } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { signInAs } from "@/lib/actions";
import { getClients, getTeam, getVehicles } from "@/lib/data/queries";
import { TIERS } from "@/lib/domain";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  const [clients, team, vehicles] = await Promise.all([getClients(), getTeam(), getVehicles()]);
  const safeNext = (prefix: string) => (next?.startsWith(prefix) ? next : undefined);

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center px-4 py-16 hairline-grid">
      <div className="absolute inset-0 spotlight pointer-events-none" aria-hidden />
      <div className="relative w-full max-w-3xl">
        <div className="mb-10 flex flex-col items-center text-center">
          <Logo />
          <h1 className="mt-8 font-display text-3xl font-semibold tracking-tight sm:text-4xl">Sign in to The Garage</h1>
          <p className="mt-3 max-w-lg text-muted">
            This is a demo. In production clients sign in with a magic link and two-factor authentication. Pick a persona to look around.
          </p>
        </div>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-surface p-5">
            <div className="mb-4 flex items-center gap-2">
              <ShieldCheck className="size-4 text-gold" />
              <h2 className="font-display text-sm font-semibold tracking-wide uppercase">Client portal</h2>
            </div>
            <ul className="space-y-2">
              {clients.map((c) => {
                const count = vehicles.filter((v) => v.clientId === c.id).length;
                return (
                  <li key={c.id}>
                    <form action={signInAs.bind(null, { kind: "client", clientId: c.id }, safeNext("/garage"))}>
                      <button className="group flex w-full items-center justify-between rounded-lg border border-border bg-surface-2 px-4 py-3 text-left transition-colors hover:border-gold/60">
                        <span>
                          <span className="block text-sm font-medium">{c.name}</span>
                          <span className="block text-xs text-muted">
                            {TIERS[c.tier].label} · {count} {count === 1 ? "car" : "cars"} · {c.homeBase}
                          </span>
                        </span>
                        <ArrowRight className="size-4 text-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-gold" />
                      </button>
                    </form>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="rounded-xl border border-border bg-surface p-5">
            <div className="mb-4 flex items-center gap-2">
              <Wrench className="size-4 text-gold" />
              <h2 className="font-display text-sm font-semibold tracking-wide uppercase">Vehicle Focus team</h2>
            </div>
            <ul className="space-y-2">
              {team.map((t) => (
                <li key={t.id}>
                  <form action={signInAs.bind(null, { kind: "team", memberId: t.id }, safeNext("/console"))}>
                    <button className="group flex w-full items-center justify-between rounded-lg border border-border bg-surface-2 px-4 py-3 text-left transition-colors hover:border-gold/60">
                      <span className="flex items-center gap-3">
                        <span className="grid size-8 place-items-center rounded-full bg-gold-soft font-display text-xs font-semibold text-gold">{t.initials}</span>
                        <span>
                          <span className="block text-sm font-medium">{t.name}</span>
                          <span className="block text-xs text-muted">{t.role}</span>
                        </span>
                      </span>
                      <ArrowRight className="size-4 text-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-gold" />
                    </button>
                  </form>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs leading-relaxed text-subtle">
              The console is Lawrence&apos;s central management system: every car, client, request, check and lead in one place.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
