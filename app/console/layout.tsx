import type { Metadata } from "next";
import { LogOut } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { MobileNav, SidebarNav } from "@/components/console/nav";
import { Initials } from "@/components/console/ui";
import { signOut } from "@/lib/actions";
import { getBusinessStats, getTeamMember } from "@/lib/data/queries";
import { requireTeam } from "@/lib/session";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { default: "Console", template: "%s | Console | Vehicle Focus" },
  robots: { index: false, follow: false },
};

export default async function ConsoleLayout({ children }: { children: React.ReactNode }) {
  const { memberId } = await requireTeam();
  const [member, stats] = await Promise.all([getTeamMember(memberId), getBusinessStats()]);
  const badges = { requests: stats.newRequests, leads: stats.newLeads };

  const account = (
    <div className="flex items-center gap-3">
      <Initials initials={member?.initials ?? "VF"} className="size-8 text-xs" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{member?.name ?? "Vehicle Focus"}</p>
        <p className="truncate text-xs text-subtle">{member?.role ?? "Team"}</p>
      </div>
      <form action={signOut}>
        <button className="grid size-8 place-items-center rounded-md text-subtle hover:bg-surface-2 hover:text-text" aria-label="Sign out" title="Sign out">
          <LogOut className="size-4" />
        </button>
      </form>
    </div>
  );

  return (
    <div className="flex min-h-screen w-full">
      <aside className="no-print sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-border bg-surface/40 lg:flex">
        <div className="flex h-16 items-center px-5">
          <Logo href="/console" />
        </div>
        <div className="px-3">
          <p className="mb-2 px-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-subtle">Operations</p>
          <SidebarNav badges={badges} />
        </div>
        <div className="mt-auto border-t border-border p-4">{account}</div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <MobileNav badges={badges} footer={account} />
        <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
