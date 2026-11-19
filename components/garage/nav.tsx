"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Car, ClipboardList, FolderLock, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/garage", label: "Collection", icon: Car, match: (p: string) => p === "/garage" || p.startsWith("/garage/cars") },
  { href: "/garage/requests", label: "Requests", icon: ClipboardList, match: (p: string) => p.startsWith("/garage/requests") },
  { href: "/garage/messages", label: "Messages", icon: MessageCircle, match: (p: string) => p.startsWith("/garage/messages") },
  { href: "/garage/documents", label: "Documents", icon: FolderLock, match: (p: string) => p.startsWith("/garage/documents") },
] as const;

/** Desktop navigation in the top bar. */
export function GarageNav({ className }: { className?: string }) {
  const pathname = usePathname();
  return (
    <nav aria-label="The Garage" className={cn("items-center gap-1", className)}>
      {ITEMS.map((item) => {
        const active = item.match(pathname);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "rounded-md px-3 py-2 text-sm transition-colors",
              active ? "bg-surface-2 text-text" : "text-muted hover:text-text",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

/** Mobile bottom tab bar. The portal is mostly used on a phone. */
export function GarageTabBar({ className }: { className?: string }) {
  const pathname = usePathname();
  return (
    <nav
      aria-label="The Garage"
      className={cn(
        "fixed inset-x-0 bottom-0 z-30 border-t border-border bg-bg/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-md",
        className,
      )}
    >
      <ul className="grid grid-cols-4">
        {ITEMS.map((item) => {
          const active = item.match(pathname);
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex flex-col items-center gap-1 py-2.5 text-[0.68rem] font-medium tracking-wide transition-colors",
                  active ? "text-gold" : "text-subtle hover:text-text",
                )}
              >
                <Icon className="size-5" aria-hidden />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
