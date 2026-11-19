import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LogOut, Plus } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { ButtonLink } from "@/components/ui/button";
import { GarageNav, GarageTabBar } from "@/components/garage/nav";
import { signOut } from "@/lib/actions";
import { getClient } from "@/lib/data/queries";
import { TIERS } from "@/lib/domain";
import { requireClient } from "@/lib/session";

export const metadata: Metadata = {
  title: { default: "The Garage", template: "%s | The Garage" },
  robots: { index: false, follow: false },
};

export default async function GarageLayout({ children }: { children: React.ReactNode }) {
  const { clientId } = await requireClient();
  const client = await getClient(clientId);
  if (!client) redirect("/login?next=/garage");

  return (
    <div className="relative isolate flex min-h-svh flex-col">
      <div className="app-backdrop" aria-hidden />

      <header className="sticky top-0 z-30 px-3 pt-3 sm:px-5">
        <div className="glass-dark mx-auto flex h-14 w-full max-w-6xl items-center gap-3 rounded-full bg-[rgba(10,11,13,0.78)] pr-2 pl-4 backdrop-blur-xl backdrop-saturate-100 sm:pl-5">
          <Logo href="/garage" compact className="sm:hidden" />
          <Logo href="/garage" className="hidden sm:inline-flex" />
          <span className="ml-1 font-display text-[0.95rem] italic text-white/60 sm:hidden">The Garage</span>
          <GarageNav className="ml-3 hidden md:flex" />

          <div className="ml-auto flex items-center gap-1.5 sm:gap-3">
            <div className="hidden text-right leading-tight lg:block">
              <p className="text-[0.85rem] font-medium">{client.name}</p>
              <p className="text-xs text-white/50">{TIERS[client.tier].label} member</p>
            </div>
            <ButtonLink
              href="/garage/requests/new"
              size="sm"
              aria-label="New request"
              className="h-11 max-sm:w-11 max-sm:px-0 md:h-9 [&_svg]:size-5 sm:[&_svg]:size-4"
            >
              <Plus aria-hidden />
              <span className="hidden sm:inline">New request</span>
            </ButtonLink>
            <form action={signOut}>
              <button
                type="submit"
                className="grid size-11 place-items-center rounded-full text-white/55 transition-colors hover:bg-white/[0.08] hover:text-white md:size-10"
                aria-label="Sign out"
                title="Sign out"
              >
                <LogOut className="size-4" aria-hidden />
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pt-7 pb-[calc(7.5rem+env(safe-area-inset-bottom))] sm:px-6 md:pt-14 md:pb-20">
        {children}
      </main>

      <GarageTabBar className="md:hidden" />
    </div>
  );
}
