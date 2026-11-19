import * as React from "react";
import { cn } from "@/lib/utils";

const field =
  "w-full rounded-xl border border-white/10 bg-black/25 px-3.5 text-sm text-text shadow-[inset_0_1px_2px_rgba(0,0,0,0.35)] placeholder:text-subtle transition-colors focus:border-white/30 focus:bg-black/35 focus:outline-none focus:ring-4 focus:ring-white/[0.06] disabled:opacity-50 [color-scheme:dark]";

export function Input({ className, ...props }: React.ComponentProps<"input">) {
  return <input className={cn(field, "h-11", className)} {...props} />;
}

export function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return <textarea className={cn(field, "min-h-24 py-2.5", className)} {...props} />;
}

export function Select({ className, children, ...props }: React.ComponentProps<"select">) {
  return (
    <select className={cn(field, "h-11 appearance-none pr-9", className)} {...props}>
      {children}
    </select>
  );
}

export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn("mb-1.5 block text-[0.78rem] font-medium text-muted", className)} {...props} />;
}

export function Field({
  label,
  htmlFor,
  hint,
  className,
  children,
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {hint ? <p className="mt-1 text-xs text-subtle">{hint}</p> : null}
    </div>
  );
}
