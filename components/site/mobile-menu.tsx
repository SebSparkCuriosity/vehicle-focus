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
        className="grid size-10 place-items-center rounded-md text-text hover:bg-surface-2"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
      >
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>
      <div
        id="mobile-menu"
        className={cn(
          "fixed inset-x-0 top-16 bottom-0 z-40 overflow-y-auto border-t border-border bg-bg/98 backdrop-blur transition-opacity",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <nav className="flex flex-col gap-1 px-4 py-6" aria-label="Mobile">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "rounded-lg px-3 py-3 font-display text-lg tracking-tight",
                pathname === l.href ? "bg-surface-2 text-gold" : "text-text hover:bg-surface-2",
              )}
            >
              {l.label}
            </Link>
          ))}
          <div className="mt-6 grid gap-3 border-t border-border pt-6">
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
