import Link from "next/link";
import { ArrowRight, Check, Phone } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/site/section";
import { CONTACT, TIER_DETAILS, type ServiceGroup } from "@/components/site/content";
import { TIERS } from "@/lib/domain";
import { cn } from "@/lib/utils";
import type { Tier } from "@/lib/types";

const TIER_ORDER: Tier[] = ["gold", "platinum", "black-label"];

const TIER_ACCENT: Record<Tier, string> = {
  gold: "from-[#ceaa00]/25",
  platinum: "from-[#d9dde3]/20",
  "black-label": "from-[#ffffff]/10",
};

export function TierCards({ detailed = false, className }: { detailed?: boolean; className?: string }) {
  return (
    <div className={cn("grid gap-5 lg:grid-cols-3", className)}>
      {TIER_ORDER.map((t) => {
        const tier = TIERS[t];
        const detail = TIER_DETAILS[t];
        const featured = t === "platinum";
        return (
          <article
            key={t}
            className={cn(
              "relative flex flex-col overflow-hidden rounded-2xl border bg-surface p-6 sm:p-7",
              featured ? "border-gold/50" : "border-border",
            )}
          >
            <div className={cn("pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b to-transparent", TIER_ACCENT[t])} aria-hidden />
            <div className="relative">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-display text-2xl font-semibold tracking-tight">{tier.label}</h3>
                {featured ? <span className="rounded-full border border-gold/40 bg-gold-soft px-2.5 py-0.5 text-xs text-gold">Full concierge</span> : null}
              </div>
              <p className="mt-1 text-sm text-gold">{tier.cadence}</p>
              <p className="mt-4 text-sm leading-relaxed text-muted">{detailed ? detail.forWhom : tier.blurb}</p>
            </div>
            {detailed ? (
              <ul className="relative mt-6 grid gap-3 border-t border-border pt-6 text-sm">
                {detail.includes.map((item) => (
                  <li key={item} className="flex gap-3">
                    <Check className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden />
                    <span className="text-text/90">{item}</span>
                  </li>
                ))}
              </ul>
            ) : null}
            <div className="relative mt-auto pt-7">
              <ButtonLink href="/contact" variant={featured ? "primary" : "secondary"} className="w-full">
                Discuss {tier.label}
              </ButtonLink>
            </div>
          </article>
        );
      })}
    </div>
  );
}

export function ServiceGroupGrid({ group, compact = false }: { group: ServiceGroup; compact?: boolean }) {
  return (
    <div className={cn("grid gap-4", compact ? "sm:grid-cols-2" : "md:grid-cols-2")}>
      {group.services.map((s) => {
        const Icon = s.icon;
        return (
          <article key={s.number} className="rounded-xl border border-border bg-surface p-6 transition-colors hover:border-border-strong">
            <div className="flex items-start justify-between gap-4">
              <span className="grid size-10 place-items-center rounded-lg bg-gold-soft">
                <Icon className="size-5 text-gold" aria-hidden />
              </span>
              <span className="font-display text-xs text-subtle tabular">{s.number}</span>
            </div>
            <h3 className="mt-5 font-display text-lg font-semibold tracking-tight">{s.title}</h3>
            <ul className={cn("mt-3 grid gap-2 text-sm text-muted", compact && "hidden sm:grid")}>
              {(compact ? s.points.slice(0, 2) : s.points).map((p) => (
                <li key={p} className="flex gap-2.5">
                  <span className="mt-2 size-1 shrink-0 rounded-full bg-gold" aria-hidden />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </article>
        );
      })}
    </div>
  );
}

export function CtaBand({
  title = "Start with a private conversation",
  lead = "Tell us about the cars, how you use them and what's currently getting in the way. If we can help, we'll suggest a vehicle audit. If we can't, we'll say so.",
  primaryHref = "/contact",
  primaryLabel = "Request a call",
}: {
  title?: string;
  lead?: string;
  primaryHref?: string;
  primaryLabel?: string;
}) {
  return (
    <section className="py-20 sm:py-24">
      <Container>
        <div className="relative overflow-hidden rounded-3xl border border-gold/30 bg-surface px-6 py-14 sm:px-12 sm:py-16">
          <div className="pointer-events-none absolute inset-0 spotlight" aria-hidden />
          <div className="relative grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-center">
            <div>
              <p className="eyebrow">Next step</p>
              <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl">{title}</h2>
              <p className="mt-5 max-w-xl leading-relaxed text-muted">{lead}</p>
            </div>
            <div className="grid gap-3">
              <ButtonLink href={primaryHref} size="lg">
                {primaryLabel}
                <ArrowRight aria-hidden />
              </ButtonLink>
              <a
                href={CONTACT.phoneHref}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-border-strong px-6 text-base text-text transition-colors hover:border-gold hover:text-gold"
              >
                <Phone className="size-4" aria-hidden />
                {CONTACT.phone}
              </a>
              <p className="text-center text-xs text-subtle">Answered 24/7. NDAs offered as standard.</p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export function TextLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="group inline-flex items-center gap-1.5 text-sm font-medium text-gold hover:text-gold-bright">
      {children}
      <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
    </Link>
  );
}
