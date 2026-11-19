import * as React from "react";
import { cn } from "@/lib/utils";

export function Container({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8", className)} {...props} />;
}

export function Section({ className, children, id, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <section id={id} className={cn("py-20 sm:py-28", className)} {...props}>
      <Container>{children}</Container>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl">{title}</h2>
      {lead ? <p className="mt-5 text-base leading-relaxed text-muted sm:text-lg">{lead}</p> : null}
    </div>
  );
}

/** Hero block for inner pages. */
export function PageHero({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-border hairline-grid">
      <div className="pointer-events-none absolute inset-0 spotlight" aria-hidden />
      <Container className="relative py-20 sm:py-28">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-5 max-w-3xl font-display text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">{title}</h1>
        {lead ? <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">{lead}</p> : null}
        {children ? <div className="mt-9">{children}</div> : null}
      </Container>
    </section>
  );
}
