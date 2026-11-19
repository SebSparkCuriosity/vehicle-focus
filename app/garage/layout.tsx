import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LogOut, Plus } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Badge } from "@/components/ui/badge";
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
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 border-b border-border bg-bg/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-4 px-4 sm:px-6">
          <Logo href="/garage" compact className="sm:hidden" />
          <Logo href="/garage" className="hidden sm:inline-flex" />
          <span className="hidden border-l border-border pl-4 font-display text-[0.68rem] font-semibold tracking-[0.22em] text-subtle uppercase lg:inline">
            The Garage
          </span>
          <GarageNav className="ml-2 hidden md:flex" />

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <ButtonLink href="/garage/requests/new" size="sm" aria-label="New request">
              <Plus aria-hidden />
              <span className="hidden sm:inline">New request</span>
            </ButtonLink>
            <div className="hidden text-right leading-tight lg:block">
              <p className="text-sm font-medium">{client.name}</p>
              <p className="text-[0.7rem] text-gold">{TIERS[client.tier].label} member</p>
            </div>
            <Badge tone="gold" className="lg:hidden max-sm:hidden">
              {TIERS[client.tier].label}
            </Badge>
            <form action={signOut}>
              <button
                type="submit"
                className="grid size-9 place-items-center rounded-md text-muted transition-colors hover:bg-surface-2 hover:text-text"
                aria-label="Sign out"
                title="Sign out"
              >
                <LogOut className="size-4" aria-hidden />
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pt-6 pb-28 sm:px-6 md:pt-10 md:pb-16">{children}</main>

      <GarageTabBar className="md:hidden" />
    </div>
  );
}
