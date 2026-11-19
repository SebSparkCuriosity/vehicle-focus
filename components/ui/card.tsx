import * as React from "react";
import { cn } from "@/lib/utils";

/** Frosted glass pane. Use `tone="dark"` over busy photography, `tone="inset"` inside another pane. */
export function Card({
  className,
  tone = "glass",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { tone?: "glass" | "dark" | "inset" }) {
  const toneClass = tone === "dark" ? "glass-dark" : tone === "inset" ? "glass-inset" : "glass";
  return <div className={cn("rounded-2xl", toneClass, className)} {...props} />;
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex items-start justify-between gap-4 p-6 pb-3", className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("text-[0.95rem] font-semibold tracking-tight text-text", className)} {...props} />;
}

export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-muted", className)} {...props} />;
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6 pt-0", className)} {...props} />;
}

export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex items-center gap-3 border-t border-white/[0.07] px-6 py-4", className)} {...props} />;
}
