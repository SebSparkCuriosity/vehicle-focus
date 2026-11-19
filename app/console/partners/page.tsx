import { Handshake, Mail, Phone } from "lucide-react";
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
        title="Partners"
        description="The specialists behind the service: transport, detailing, workshops, storage and inspection across the Islands, the UK and Europe."
      />

      {regions.length ? (
        <div className="space-y-8">
          {regions.map((g) => (
            <section key={g.region}>
              <div className="mb-3 flex items-baseline gap-3">
                <h2 className="font-display text-[1.4rem] font-normal">{g.region}</h2>
                <span className="text-[0.78rem] text-subtle">
                  {g.list.length} {g.list.length === 1 ? "partner" : "partners"}
                </span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {g.list.map((p) => (
                  <article key={p.id} className="glass flex flex-col rounded-2xl p-5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="font-medium">{p.name}</h3>
                        <p className="text-[0.78rem] text-muted">{p.contactName}</p>
                      </div>
                      <span className="shrink-0 rounded-full border border-white/10 px-2 py-[2px] text-xs text-muted">{p.kind}</span>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <Stars rating={p.rating} />
                      <span className="text-[0.82rem] text-subtle md:text-[0.75rem]">
                        {jobsFor(p.id)} {jobsFor(p.id) === 1 ? "request" : "requests"} on record
                      </span>
                    </div>
                    {p.notes ? <p className="mt-3 mb-4 text-sm text-muted">{p.notes}</p> : <div className="mb-4" />}
                    <div className="mt-auto flex flex-col border-t border-white/[0.06] pt-1.5 text-[0.88rem] md:flex-row md:flex-wrap md:gap-x-4 md:gap-y-1 md:pt-3.5 md:text-[0.78rem]">
                      <a href={`mailto:${p.email}`} className="inline-flex min-h-11 items-center gap-2 break-all text-muted hover:text-text md:min-h-0 md:gap-1.5">
                        <Mail className="size-3.5" /> {p.email}
                      </a>
                      <a href={`tel:${p.phone.replace(/\s/g, "")}`} className="inline-flex min-h-11 items-center gap-2 text-muted hover:text-text md:min-h-0 md:gap-1.5">
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
