import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function Container({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mx-auto w-full max-w-6xl px-5 sm:px-8", className)} {...props} />;
}

export function Section({ className, children, id, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <section id={id} className={cn("py-24 sm:py-32", className)} {...props}>
      <Container>{children}</Container>
    </section>
  );
}

/** Section headline in Newsreader. No eyebrow: the headline does the work. */
export function SectionHeading({
  title,
  lead,
  align = "left",
  className,
  as: Tag = "h2",
}: {
  title: React.ReactNode;
  lead?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
  as?: "h1" | "h2";
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      <Tag className="font-display text-[2.4rem] leading-[1.04] font-normal text-balance sm:text-5xl">{title}</Tag>
      {lead ? <p className="mt-5 text-[1.05rem] leading-relaxed text-white/65 sm:text-lg">{lead}</p> : null}
    </div>
  );
}

/**
 * Blurred showroom photograph behind a section, so glass panes have something to frost.
 * Parent needs `relative isolate overflow-hidden`.
 */
export function BackdropLayer({ className }: { className?: string }) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 -z-10", className)} aria-hidden>
      <Image src="/images/backdrop.jpg" alt="" fill sizes="100vw" className="object-cover opacity-90" />
      <div className="absolute inset-0 bg-gradient-to-b from-bg via-bg/40 to-bg" />
    </div>
  );
}

/** Full-bleed photograph with a scrim. Children sit on top. */
export function PhotoBand({
  image,
  position = "50% 50%",
  priority = false,
  className,
  scrim = "bottom",
  children,
}: {
  image: string;
  position?: string;
  priority?: boolean;
  className?: string;
  /** bottom: darkest at the foot; left: darkest on the left for text; full: evenly dark */
  scrim?: "bottom" | "left" | "right" | "full";
  children: React.ReactNode;
}) {
  return (
    <section className={cn("relative isolate overflow-hidden", className)}>
      <Image src={image} alt="" fill priority={priority} sizes="100vw" className="-z-20 object-cover" style={{ objectPosition: position }} />
      <div className="photo-scrim absolute inset-0 -z-10" aria-hidden />
      {scrim === "left" ? <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/80 via-black/45 to-black/5" aria-hidden /> : null}
      {scrim === "right" ? <div className="absolute inset-0 -z-10 bg-gradient-to-l from-black/80 via-black/45 to-black/5" aria-hidden /> : null}
      {scrim === "full" ? <div className="absolute inset-0 -z-10 bg-black/55" aria-hidden /> : null}
      {children}
    </section>
  );
}

/** Opening band for inner pages: photo, Newsreader headline, short lead. Leaves room for the floating header. */
export function PhotoHero({
  image,
  position,
  title,
  lead,
  children,
  aside,
}: {
  image: string;
  position?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  children?: React.ReactNode;
  aside?: React.ReactNode;
}) {
  return (
    <PhotoBand image={image} position={position} priority scrim="left" className="min-h-[34rem] sm:min-h-[38rem]">
      <Container className="flex min-h-[34rem] flex-col justify-end pt-36 pb-14 sm:min-h-[38rem] sm:pb-20">
        <div className={cn(aside && "grid items-end gap-12 lg:grid-cols-[1.2fr_1fr] [&>*]:min-w-0")}>
          <div className="max-w-3xl">
            <h1 className="font-display text-[2.75rem] leading-[1.02] font-normal text-balance sm:text-6xl lg:text-7xl">{title}</h1>
            {lead ? <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/72">{lead}</p> : null}
            {children ? <div className="mt-9">{children}</div> : null}
          </div>
          {aside ? <div>{aside}</div> : null}
        </div>
      </Container>
    </PhotoBand>
  );
}
