import { FileText } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState, PageHeader, TierBadge } from "@/components/console/ui";
import { getLookups } from "@/components/console/lookups";
import { latestValue } from "@/lib/domain";
import { formatDate, formatGBPCompact } from "@/lib/format";

export const metadata = { title: "Reports" };

export default async function ReportsPage() {
  const lookups = await getLookups();
  const month = formatDate(new Date().toISOString(), { month: "long", year: "numeric" });

  return (
    <>
      <PageHeader
        eyebrow="Reports"
        title="Monthly collection reports"
        description={`One report per client for ${month}: condition of every car, work completed, costs and what's coming up. Print or save as PDF and send, or let clients read it in The Garage.`}
      />

      {lookups.clients.length ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {lookups.clients.map((c) => {
            const cars = lookups.vehicles.filter((v) => v.clientId === c.id);
            const value = cars.reduce((s, v) => s + latestValue(v), 0);
            return (
              <article key={c.id} className="flex flex-col rounded-xl border border-border bg-surface p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="font-medium">{c.name}</h2>
                    <p className="text-xs text-muted">{c.homeBase}</p>
                  </div>
                  <TierBadge tier={c.tier} />
                </div>
                <p className="mt-3 text-sm text-muted">
                  {cars.length} {cars.length === 1 ? "car" : "cars"} · {formatGBPCompact(value)}
                </p>
                <div className="mt-4">
                  <ButtonLink href={`/console/reports/${c.id}`} variant="outline" size="sm">
                    <FileText /> Open {month} report
                  </ButtonLink>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <EmptyState icon={FileText} title="No clients to report on" />
      )}
    </>
  );
}
