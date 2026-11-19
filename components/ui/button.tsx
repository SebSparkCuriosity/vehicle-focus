import * as React from "react";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-accent text-[#08090a] shadow-[0_8px_30px_-8px_rgba(255,205,9,0.45),inset_0_1px_0_rgba(255,255,255,0.45)] hover:bg-[var(--accent-bright)]",
        secondary:
          "text-text border border-white/15 bg-white/[0.07] backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] hover:bg-white/[0.12] hover:border-white/25",
        outline: "border border-white/20 text-text hover:border-white/40 hover:bg-white/[0.05]",
        ghost: "text-muted hover:text-text hover:bg-white/[0.06]",
        danger: "bg-danger-soft text-danger border border-danger/30 hover:bg-danger/20",
        link: "text-text underline decoration-white/30 underline-offset-4 hover:decoration-accent px-0 rounded-none",
      },
      size: {
        sm: "h-10 px-4 text-[0.85rem] md:h-8 md:px-3.5 md:text-[0.8rem]",
        md: "h-11 px-5 text-sm md:h-10",
        lg: "h-12 px-7 text-[0.95rem]",
        icon: "h-11 w-11 md:h-9 md:w-9",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>;

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

type ButtonLinkProps = React.ComponentProps<typeof Link> & VariantProps<typeof buttonVariants>;

export function ButtonLink({ className, variant, size, ...props }: ButtonLinkProps) {
  return <Link className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
