import { Handshake, Mail, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EmptyState, PageHeader, Stars } from "@/components/console/ui";
import { getPartners, getRequests } from "@/lib/data/queries";
import type { Partner } from "@/lib/types";

export const metadata = { title: "Partners" };

const REGIONS: Partner["region"][] = ["Jersey", "Guernsey", "UK", "Europe", "Worldwide"];

export default async function PartnersPage() {
  const [partners, requests] = await Promise.all([getPartners(), getRequests()]);
  const jobsFor = (id: string) => requests.filter((r) => r.partnerId === id).length;
  const regions = REGIONS.map((r) => ({ region: r, list: partners.filter((p) => p.region === r) })).filter((g) => g.list.length);

  return (
    <>
      <PageHeader
        eyebrow="Partners"
        title="Associates and specialists"
        description="The trusted network behind the service: transporters, detailers, workshops, storage and inspectors across the Islands, the UK and Europe. If we can't do it properly, we find who can."
      />

      {regions.length ? (
        <div className="space-y-8">
          {regions.map((g) => (
            <section key={g.region}>
              <div className="mb-3 flex items-baseline gap-2">
                <h2 className="font-display text-base font-semibold">{g.region}</h2>
                <span className="text-xs text-subtle">
                  {g.list.length} {g.list.length === 1 ? "partner" : "partners"}
                </span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {g.list.map((p) => (
                  <article key={p.id} className="flex flex-col rounded-xl border border-border bg-surface p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="font-medium">{p.name}</h3>
                        <p className="text-xs text-muted">{p.contactName}</p>
                      </div>
                      <Badge tone="neutral">{p.kind}</Badge>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <Stars rating={p.rating} />
                      <span className="text-xs text-subtle">
                        {jobsFor(p.id)} {jobsFor(p.id) === 1 ? "request" : "requests"} on record
                      </span>
                    </div>
                    {p.notes ? <p className="mt-3 text-sm text-muted">{p.notes}</p> : null}
                    <div className="mt-auto flex flex-wrap gap-x-4 gap-y-1 pt-4 text-xs">
                      <a href={`mailto:${p.email}`} className="inline-flex items-center gap-1.5 text-muted hover:text-gold">
                        <Mail className="size-3.5" /> {p.email}
                      </a>
                      <a href={`tel:${p.phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-1.5 text-muted hover:text-gold">
                        <Phone className="size-3.5" /> {p.phone}
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <EmptyState icon={Handshake} title="No partners yet" description="Add the transporters, detailers and workshops you trust." />
      )}
    </>
  );
}
