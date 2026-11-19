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
      <Initials initials={member?.initials ?? "VF"} className="size-9 text-xs" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{member?.name ?? "Vehicle Focus"}</p>
        <p className="truncate text-[0.75rem] text-subtle">{member?.role ?? "Team"}</p>
      </div>
      <form action={signOut}>
        <button
          className="grid size-8 place-items-center rounded-full text-subtle transition-colors hover:bg-white/[0.07] hover:text-text"
          aria-label="Sign out"
          title="Sign out"
        >
          <LogOut className="size-4" />
        </button>
      </form>
    </div>
  );

  return (
    <div className="relative flex min-h-screen w-full">
      <div className="app-backdrop" aria-hidden />

      <aside className="no-print sticky top-0 hidden h-screen w-[17rem] shrink-0 p-3 lg:block">
        <div className="glass-dark flex h-full flex-col rounded-[24px]">
          <div className="flex h-[4.5rem] items-center px-6">
            <Logo href="/console" />
          </div>
          <div className="flex-1 overflow-y-auto px-3">
            <SidebarNav badges={badges} />
          </div>
          <div className="mx-4 h-px bg-white/[0.07]" aria-hidden />
          <div className="p-4">{account}</div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <MobileNav badges={badges} footer={account} />
        <main className="mx-auto w-full max-w-[1360px] flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-10">{children}</main>
      </div>
    </div>
  );
}
