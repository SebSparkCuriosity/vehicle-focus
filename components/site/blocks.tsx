import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, Phone } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container, PhotoBand } from "@/components/site/section";
import { CONTACT, TIER_DETAILS, type ServiceGroup } from "@/components/site/content";
import { TIERS } from "@/lib/domain";
import { cn } from "@/lib/utils";
import type { Tier } from "@/lib/types";

const TIER_ORDER: Tier[] = ["gold", "platinum", "black-label"];

/** Three membership panes. Sits over a photograph or a BackdropLayer. */
export function TierCards({ detailed = false, className }: { detailed?: boolean; className?: string }) {
  return (
    <div className={cn("grid gap-4 lg:grid-cols-3 [&>*]:min-w-0", className)}>
      {TIER_ORDER.map((t) => {
        const tier = TIERS[t];
        const detail = TIER_DETAILS[t];
        const featured = t === "platinum";
        return (
          <article key={t} className={cn("glass-dark flex flex-col rounded-[28px] p-7 sm:p-8", featured && "lg:-translate-y-4")}>
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="font-display text-[2rem] leading-none font-normal">{tier.label}</h3>
              {featured ? <span className="text-[0.72rem] text-white/50">Full concierge</span> : null}
            </div>
            <p className="mt-3 text-sm text-white/55">{tier.cadence}</p>
            <p className="mt-5 text-[0.95rem] leading-relaxed text-white/75">{detailed ? detail.forWhom : tier.blurb}</p>
            {detailed ? (
              <ul className="mt-7 grid gap-3 border-t border-white/[0.08] pt-7 text-sm">
                {detail.includes.map((item) => (
                  <li key={item} className="flex gap-3">
                    <Check className="mt-0.5 size-4 shrink-0 text-white/40" aria-hidden />
                    <span className="text-white/80">{item}</span>
                  </li>
                ))}
              </ul>
            ) : null}
            <div className="mt-auto pt-8">
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

/** Editorial list of a service group: number, title and the detail. No icon tiles. */
export function ServiceList({ group, detailed = false }: { group: ServiceGroup; detailed?: boolean }) {
  return (
    <ol className="divide-y divide-white/[0.08] border-y border-white/[0.08]">
      {group.services.map((s) => (
        <li key={s.number} className={cn("grid gap-x-8 gap-y-3 py-6", detailed ? "sm:grid-cols-[3rem_1fr]" : "grid-cols-[2.5rem_1fr]")}>
          <span className="pt-0.5 text-sm text-white/35 tabular">{s.number}</span>
          <div>
            <h3 className="text-[1.05rem] font-semibold tracking-tight">{s.title}</h3>
            {detailed ? (
              <ul className="mt-3 grid gap-x-8 gap-y-2 text-[0.92rem] leading-relaxed text-white/65 md:grid-cols-2">
                {s.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-1 text-sm leading-relaxed text-white/55">{s.points[0]}</p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}

/** Horizontal numbered timeline on desktop, vertical on mobile. */
export function Timeline({ steps, className }: { steps: readonly { title: string; body: string }[]; className?: string }) {
  return (
    <ol className={cn("relative grid gap-10 md:grid-cols-4 md:gap-6", className)}>
      <span className="absolute top-[1.15rem] right-0 left-0 hidden h-px bg-gradient-to-r from-white/5 via-white/20 to-white/5 md:block" aria-hidden />
      <span className="absolute top-0 bottom-0 left-[1.15rem] w-px bg-gradient-to-b from-white/20 to-white/5 md:hidden" aria-hidden />
      {steps.map((s, i) => (
        <li key={s.title} className="relative grid grid-cols-[2.3rem_1fr] gap-5 md:grid-cols-1 md:gap-6">
          <span className="relative grid size-[2.3rem] place-items-center rounded-full border border-white/20 bg-bg text-sm text-white/80 tabular">{i + 1}</span>
          <div>
            <h3 className="font-display text-2xl font-normal">{s.title}</h3>
            <p className="mt-2 text-[0.95rem] leading-relaxed text-white/60">{s.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

/** Closing call to action: a smoked-glass pane over a photograph. */
export function CtaBand({
  title = "Start with a private conversation",
  lead = "Tell us about the cars and what's getting in the way. If we can help, we'll suggest a vehicle audit. If we can't, we'll say so.",
  primaryHref = "/contact",
  primaryLabel = "Request a call",
  image = "/images/cars/f8-concours.jpg",
  position = "50% 40%",
  aside,
}: {
  title?: string;
  lead?: string;
  primaryHref?: string;
  primaryLabel?: string;
  image?: string;
  position?: string;
  aside?: React.ReactNode;
}) {
  return (
    <PhotoBand image={image} position={position} scrim="full">
      <Container className="py-24 sm:py-36">
        <div className={cn("grid gap-4", aside && "lg:grid-cols-[1.5fr_1fr] [&>*]:min-w-0")}>
          <div className="glass-dark rounded-[28px] p-8 sm:p-12">
            <h2 className="max-w-xl font-display text-[2.4rem] leading-[1.04] font-normal text-balance sm:text-5xl">{title}</h2>
            <p className="mt-5 max-w-lg leading-relaxed text-white/65">{lead}</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <ButtonLink href={primaryHref} size="lg">
                {primaryLabel}
                <ArrowRight aria-hidden />
              </ButtonLink>
              <ButtonLink href={CONTACT.phoneHref} size="lg" variant="secondary">
                <Phone aria-hidden />
                {CONTACT.phone}
              </ButtonLink>
            </div>
            <p className="mt-5 text-xs text-white/40">Answered 24/7. NDAs offered as standard.</p>
          </div>
          {aside}
        </div>
      </Container>
    </PhotoBand>
  );
}

/** Quiet text link: white with an underline, never yellow. */
export function TextLink({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  const external = href.startsWith("http");
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-1.5 text-sm font-medium text-white underline decoration-white/25 underline-offset-[6px] transition-colors hover:decoration-white/70",
        className,
      )}
    >
      {children}
      {external ? (
        <ArrowUpRight className="size-3.5 text-white/50" aria-hidden />
      ) : (
        <ArrowRight className="size-3.5 text-white/50 transition-transform group-hover:translate-x-0.5" aria-hidden />
      )}
    </Link>
  );
}
