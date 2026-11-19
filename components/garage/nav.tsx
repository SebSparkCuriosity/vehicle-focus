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

/** Desktop navigation inside the floating top bar. */
export function GarageNav({ className }: { className?: string }) {
  const pathname = usePathname();
  return (
    <nav aria-label="The Garage" className={cn("items-center gap-0.5", className)}>
      {ITEMS.map((item) => {
        const active = item.match(pathname);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-[0.85rem] transition-colors",
              active ? "bg-white/[0.1] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]" : "text-white/60 hover:text-white",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

/** Mobile tab bar: a floating smoked-glass dock. The portal is mostly used on a phone. */
export function GarageTabBar({ className }: { className?: string }) {
  const pathname = usePathname();
  return (
    <nav
      aria-label="The Garage"
      className={cn("fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-30", className)}
    >
      <ul className="glass-dark grid grid-cols-4 gap-1 rounded-[24px] p-1.5">
        {ITEMS.map((item) => {
          const active = item.match(pathname);
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-[52px] flex-col items-center justify-center gap-1 rounded-[18px] text-xs font-medium transition-colors",
                  active ? "bg-white/[0.1] text-white" : "text-white/50 hover:text-white",
                )}
              >
                <Icon className="size-5" strokeWidth={active ? 2 : 1.6} aria-hidden />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
