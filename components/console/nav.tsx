"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  Car,
  FileText,
  Gauge,
  Handshake,
  Inbox,
  Menu,
  MessagesSquare,
  ShieldCheck,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { cn } from "@/lib/utils";

type Badges = { requests: number; leads: number };

const NAV = [
  { href: "/console", label: "Today", icon: Gauge, exact: true },
  { href: "/console/requests", label: "Requests", icon: Inbox, badge: "requests" as const },
  { href: "/console/fleet", label: "Fleet", icon: Car },
  { href: "/console/schedule", label: "Schedule", icon: CalendarDays },
  { href: "/console/clients", label: "Clients", icon: Users },
  { href: "/console/compliance", label: "Compliance", icon: ShieldCheck },
  { href: "/console/messages", label: "Messages", icon: MessagesSquare },
  { href: "/console/leads", label: "Leads", icon: TrendingUp, badge: "leads" as const },
  { href: "/console/partners", label: "Partners", icon: Handshake },
  { href: "/console/reports", label: "Reports", icon: FileText },
];

function NavLinks({ badges, onNavigate, large = false }: { badges: Badges; onNavigate?: () => void; large?: boolean }) {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-0.5" aria-label="Console">
      {NAV.map((item) => {
        const active = item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`);
        const count = item.badge ? badges[item.badge] : 0;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 transition-colors",
              large ? "min-h-12 text-[0.95rem]" : "py-2 text-[0.88rem]",
              active ? "glass-inset text-text" : "border border-transparent text-muted hover:bg-white/[0.04] hover:text-text",
            )}
          >
            <Icon className={cn(large ? "size-[18px]" : "size-4", active ? "text-white/85" : "text-white/55")} aria-hidden />
            <span className="flex-1">{item.label}</span>
            {count > 0 ? (
              <span
                className={cn("text-[0.75rem] font-medium tabular", item.badge === "requests" ? "text-accent" : "text-muted")}
                aria-label={`${count} new`}
              >
                {count}
              </span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}

export function SidebarNav({ badges }: { badges: Badges }) {
  return <NavLinks badges={badges} />;
}

export function MobileNav({ badges, footer }: { badges: Badges; footer: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [lastPath, setLastPath] = useState(pathname);

  // Close whenever the route changes (covers back/forward as well as taps)
  if (pathname !== lastPath) {
    setLastPath(pathname);
    if (open) setOpen(false);
  }

  // While open: Escape closes, and the page behind does not scroll
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="no-print sticky top-0 z-30 p-2 lg:hidden">
      <div className="glass-dark rounded-2xl">
        <div className="flex h-14 items-center justify-between pr-2 pl-4">
          <Logo href="/console" />
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="grid size-11 place-items-center rounded-full text-muted transition-colors hover:bg-white/[0.07] hover:text-text"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
        {open ? (
          <div className="max-h-[calc(100svh-6rem)] overflow-y-auto overscroll-contain px-2 pt-1 pb-3">
            <NavLinks badges={badges} onNavigate={() => setOpen(false)} large />
            <div className="mx-2 mt-3 h-px bg-white/[0.07]" aria-hidden />
            <div className="px-2 pt-3">{footer}</div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
