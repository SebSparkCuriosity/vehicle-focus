"use client";

import { useState } from "react";
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

function NavLinks({ badges, onNavigate }: { badges: Badges; onNavigate?: () => void }) {
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
              "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors",
              active ? "bg-surface-2 text-text" : "text-muted hover:bg-surface-2/60 hover:text-text",
            )}
          >
            <Icon className={cn("size-4", active ? "text-gold" : "text-subtle")} aria-hidden />
            <span className="flex-1">{item.label}</span>
            {count > 0 ? (
              <span className="grid min-w-5 place-items-center rounded-full bg-gold px-1.5 text-[0.65rem] font-semibold text-[#0b0b0c] tabular">
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
  return (
    <div className="no-print sticky top-0 z-30 border-b border-border bg-bg/95 backdrop-blur lg:hidden">
      <div className="flex h-14 items-center justify-between px-4">
        <Logo href="/console" />
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="grid size-9 place-items-center rounded-md text-muted hover:bg-surface-2 hover:text-text"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>
      {open ? (
        <div className="border-t border-border px-3 pb-4 pt-2">
          <NavLinks badges={badges} onNavigate={() => setOpen(false)} />
          <div className="mt-3 border-t border-border pt-3">{footer}</div>
        </div>
      ) : null}
    </div>
  );
}
