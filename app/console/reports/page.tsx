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
        title="Reports"
        description={`One report per client for ${month}: the condition of every car, work done, costs and what's next. Print or save as PDF.`}
      />

      {lookups.clients.length ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {lookups.clients.map((c) => {
            const cars = lookups.vehicles.filter((v) => v.clientId === c.id);
            const value = cars.reduce((s, v) => s + latestValue(v), 0);
            return (
              <article key={c.id} className="glass flex flex-col rounded-2xl p-5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="font-medium">{c.name}</h2>
                    <p className="text-[0.78rem] text-muted">{c.homeBase}</p>
                  </div>
                  <TierBadge tier={c.tier} />
                </div>
                <p className="mt-3 text-sm text-muted">
                  {cars.length} {cars.length === 1 ? "car" : "cars"} · {formatGBPCompact(value)}
                </p>
                <div className="mt-auto pt-5">
                  <ButtonLink href={`/console/reports/${c.id}`} variant="secondary" size="sm">
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
