import Link from "next/link";
import { notFound } from "next/navigation";
import { Car, FileText, Inbox, Lock, Mail, MessagesSquare, Phone } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { CarMedia } from "@/components/brand/car-art";
import { BatteryReading, VehicleStatusBadge } from "@/components/vehicle-status";
import { Detail, Dot, EmptyState, Kpi, KpiStrip, PageHeader, Panel, PanelLink, TierBadge } from "@/components/console/ui";
import { RequestCard } from "@/components/console/rows";
import { getLookups } from "@/components/console/lookups";
import { getClient, getCollectionSummary, getMessages, getRequests, getVehicles } from "@/lib/data/queries";
import { TIERS, latestValue, vehicleName } from "@/lib/domain";
import { formatDate, formatGBP, formatGBPCompact, relativeDays, timeAgo } from "@/lib/format";
import { cn } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const c = await getClient(id);
  return { title: c?.name ?? "Client" };
}

export default async function ClientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const client = await getClient(id);
  if (!client) notFound();

  const [vehicles, summary, requests, messages, lookups] = await Promise.all([
    getVehicles({ clientId: id }),
    getCollectionSummary(id),
    getRequests({ clientId: id }),
    getMessages(id),
    getLookups(),
  ]);
  const open = requests.filter((r) => r.status === "new" || r.status === "scheduled" || r.status === "in-progress");
  const recentDone = requests.filter((r) => r.status === "done").slice(0, 3);
  const change = summary.totalValue - summary.totalPaid;

  return (
    <>
      <PageHeader
        back={{ href: "/console/clients", label: "Clients" }}
        eyebrow={`${TIERS[client.tier].label} · client since ${formatDate(client.clientSince, { month: "long", year: "numeric" })}`}
        title={client.name}
        description={client.homeBase}
        actions={
          <>
            <ButtonLink href={`/console/messages?client=${client.id}`} variant="secondary" className="flex-1 sm:flex-none md:h-8 md:px-3.5 md:text-[0.8rem]">
              <MessagesSquare /> Message
            </ButtonLink>
            <ButtonLink href={`/console/reports/${client.id}`} className="flex-1 sm:flex-none md:h-8 md:px-3.5 md:text-[0.8rem]">
              <FileText /> Monthly report
            </ButtonLink>
          </>
        }
      />

      <KpiStrip columns="grid-cols-2 lg:grid-cols-4" className="mb-6">
        <Kpi label="Cars" value={summary.count} sub={`${summary.ready} ready to drive`} />
        <Kpi label="Collection value" value={formatGBPCompact(summary.totalValue)} sub={`${change >= 0 ? "+" : ""}${formatGBPCompact(change)} against purchase`} />
        <Kpi label="Open requests" value={open.length} />
        <Kpi label="Monthly fee" value={formatGBP(client.monthlyFee)} sub="Demo figure" />
      </KpiStrip>

      <div className="grid gap-6 xl:grid-cols-3 [&>*]:min-w-0">
        <div className="space-y-6 xl:col-span-2">
          <Panel title="Collection" description={TIERS[client.tier].blurb}>
            {vehicles.length ? (
              <ul className="grid gap-3 sm:grid-cols-2">
                {vehicles.map((v) => (
                  <li key={v.id}>
                    <Link
                      href={`/console/fleet/${v.id}`}
                      className="glass-inset group block overflow-hidden rounded-xl transition-colors hover:border-white/15 hover:bg-white/[0.07]"
                    >
                      <CarMedia vehicle={v} sizes="(min-width: 1280px) 420px, (min-width: 640px) 50vw, 100vw" className="aspect-[16/9] w-full" />
                      <div className="p-3.5">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium decoration-white/30 underline-offset-4 group-hover:underline">{vehicleName(v)}</p>
                            <p className="text-[0.82rem] text-subtle md:text-[0.75rem]">
                              {v.year} · {v.registration}
                            </p>
                          </div>
                          <VehicleStatusBadge status={v.status} />
                        </div>
                        <div className="mt-2.5 flex items-center justify-between text-[0.78rem] text-muted">
                          <BatteryReading voltage={v.battery.voltage} />
                          <span className="tabular">{formatGBPCompact(latestValue(v))}</span>
                        </div>
                        <p className="mt-1.5 truncate text-[0.75rem] text-subtle">
                          {v.location.name} · next check {relativeDays(v.nextCheckAt)}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState icon={Car} title="No cars on the account" />
            )}
          </Panel>

          <Panel title="Open requests" bodyClassName="grid gap-2.5 sm:grid-cols-2">
            {open.length ? (
              open.map((r) => (
                <RequestCard
                  key={r.id}
                  request={r}
                  vehicle={lookups.vehicle.get(r.vehicleId)}
                  client={client}
                  assignee={r.assigneeId ? lookups.member.get(r.assigneeId) : undefined}
                  partner={r.partnerId ? lookups.partner.get(r.partnerId) : undefined}
                />
              ))
            ) : (
              <div className="sm:col-span-2">
                <EmptyState icon={Inbox} title="Nothing open" />
              </div>
            )}
          </Panel>

          {recentDone.length ? (
            <Panel title="Recently completed" bodyClassName="grid gap-2.5 sm:grid-cols-3">
              {recentDone.map((r) => (
                <RequestCard key={r.id} request={r} compact vehicle={lookups.vehicle.get(r.vehicleId)} client={client} />
              ))}
            </Panel>
          ) : null}
        </div>

        <div className="space-y-6">
          <Panel title="Profile">
            <dl className="space-y-3">
              <Detail label="Email">
                <a href={`mailto:${client.email}`} className="-my-2.5 inline-flex min-h-11 items-center gap-1.5 break-all hover:text-text md:my-0 md:min-h-0">
                  <Mail className="size-3.5 text-subtle" /> {client.email}
                </a>
              </Detail>
              <Detail label="Phone">
                <a href={`tel:${client.phone.replace(/\s/g, "")}`} className="-my-2.5 inline-flex min-h-11 items-center gap-1.5 hover:text-text md:my-0 md:min-h-0">
                  <Phone className="size-3.5 text-subtle" /> {client.phone}
                </a>
              </Detail>
              <Detail label="Prefers">{client.preferences.contactPreference}</Detail>
              <Detail label="Tier">
                <TierBadge tier={client.tier} /> <span className="ml-1 text-[0.82rem] text-subtle md:text-[0.75rem]">{TIERS[client.tier].cadence}</span>
              </Detail>
              <Detail label="Discretion">
                {client.preferences.nda ? (
                  <span className="inline-flex items-center gap-1.5 text-warning">
                    <Lock className="size-3.5" /> NDA in place
                  </span>
                ) : (
                  "Standard"
                )}
              </Detail>
              <Detail label="Standing instructions">{client.preferences.notes}</Detail>
            </dl>
          </Panel>

          <Panel title="Delegates" description="People who act for the client" bodyClassName="p-0">
            {client.contacts.length ? (
              <ul className="divide-y divide-white/[0.06]">
                {client.contacts.map((c) => (
                  <li key={c.email} className="px-5 py-3.5">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium">{c.name}</p>
                      <Dot tone={c.canBook ? "success" : "neutral"}>{c.canBook ? "Can book" : "View only"}</Dot>
                    </div>
                    <p className="mt-0.5 text-[0.78rem] text-muted">{c.role}</p>
                    <p className="mt-0.5 text-[0.75rem] text-subtle">
                      {c.email}
                      {c.phone ? ` · ${c.phone}` : ""}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-5">
                <EmptyState title="Deals direct" description="No assistants or advisers on the account." />
              </div>
            )}
          </Panel>

          <Panel
            title="Messages"
            action={
              <PanelLink href={`/console/messages?client=${client.id}`}>Open thread</PanelLink>
            }
          >
            {messages.length ? (
              <ul className="space-y-3">
                {messages.slice(-3).map((m) => (
                  <li key={m.id} className={cn("rounded-xl p-3.5", m.from === "vf" ? "glass-inset" : "border border-white/[0.06] bg-black/20")}>
                    <p className="text-[0.75rem] text-subtle">
                      {m.author} · {timeAgo(m.at)}
                    </p>
                    <p className="mt-1 text-sm">{m.body}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState icon={MessagesSquare} title="No messages yet" />
            )}
          </Panel>
        </div>
      </div>
    </>
  );
}
