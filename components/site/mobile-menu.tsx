"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function MobileMenu({ links }: { links: readonly { href: string; label: string }[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [lastPath, setLastPath] = useState(pathname);

  // Close when the route changes
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="relative z-[51] grid size-10 place-items-center rounded-full text-white hover:bg-white/10"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
      >
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>
      <div
        id="mobile-menu"
        className={cn(
          "glass-dark fixed inset-x-3 top-[4.75rem] z-40 max-h-[calc(100svh-6rem)] overflow-y-auto rounded-[28px] transition-all duration-200",
          open ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0",
        )}
      >
        <nav className="flex flex-col p-3" aria-label="Mobile">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "rounded-2xl px-4 py-3.5 font-display text-2xl",
                pathname === l.href ? "bg-white/[0.07] text-white" : "text-white/80 hover:bg-white/[0.05]",
              )}
            >
              {l.label}
            </Link>
          ))}
          <div className="mt-3 grid gap-2.5 border-t border-white/[0.08] p-2 pt-5">
            <ButtonLink href="/contact" size="lg">
              Request a call
            </ButtonLink>
            <ButtonLink href="/login" variant="secondary" size="lg">
              Client sign in
            </ButtonLink>
          </div>
        </nav>
      </div>
    </div>
  );
}
