import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Quiet status pills: a coloured dot and text on smoked glass, not a filled
// coloured lozenge. Colour carries meaning, so keep it to the dot and label.
export const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/30 px-2.5 py-[3px] text-[0.72rem] font-medium whitespace-nowrap backdrop-blur-md",
  {
    variants: {
      tone: {
        neutral: "text-muted",
        gold: "text-accent",
        success: "text-success",
        warning: "text-warning",
        danger: "text-danger",
        info: "text-info",
      },
    },
    defaultVariants: { tone: "neutral" },
  },
);

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants> & { dot?: boolean };

export function Badge({ className, tone, dot, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ tone }), className)} {...props}>
      {dot ? <span className="size-1.5 rounded-full bg-current shadow-[0_0_8px_currentColor]" aria-hidden /> : null}
      {children}
    </span>
  );
}
