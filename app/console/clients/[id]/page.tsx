import Link from "next/link";
import { notFound } from "next/navigation";
import { Car, FileText, Inbox, Lock, Mail, MessagesSquare, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { CarArt } from "@/components/brand/car-art";
import { BatteryReading, VehicleStatusBadge } from "@/components/vehicle-status";
import { Detail, EmptyState, Kpi, PageHeader, Panel, TierBadge } from "@/components/console/ui";
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
        back={{ href: "/console/clients", label: "Client book" }}
        eyebrow={`${TIERS[client.tier].label} · client since ${formatDate(client.clientSince, { month: "long", year: "numeric" })}`}
        title={client.name}
        description={client.homeBase}
        actions={
          <>
            <ButtonLink href={`/console/messages?client=${client.id}`} variant="secondary" size="sm">
              <MessagesSquare /> Message
            </ButtonLink>
            <ButtonLink href={`/console/reports/${client.id}`} size="sm">
              <FileText /> Monthly report
            </ButtonLink>
          </>
        }
      />

      <section className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Kpi label="Cars" value={summary.count} sub={`${summary.ready} ready to drive`} />
        <Kpi label="Collection value" value={formatGBPCompact(summary.totalValue)} sub={`${change >= 0 ? "+" : ""}${formatGBPCompact(change)} against purchase`} />
        <Kpi label="Open requests" value={open.length} />
        <Kpi label="Monthly fee" value={formatGBP(client.monthlyFee)} sub="Demo figure" />
      </section>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <Panel title="Collection" description={TIERS[client.tier].blurb} bodyClassName="p-0">
            {vehicles.length ? (
              <ul className="grid divide-y divide-border sm:grid-cols-2 sm:divide-y-0">
                {vehicles.map((v) => (
                  <li key={v.id} className="border-border sm:border-b sm:odd:border-r">
                    <Link href={`/console/fleet/${v.id}`} className="group block p-4 transition-colors hover:bg-surface-2/60">
                      <CarArt bodyStyle={v.bodyStyle} paint={v.paintHex} title={vehicleName(v)} className="mx-auto max-w-[220px]" />
                      <div className="mt-2 flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium group-hover:text-gold">{vehicleName(v)}</p>
                          <p className="text-xs text-subtle">
                            {v.year} · {v.registration}
                          </p>
                        </div>
                        <VehicleStatusBadge status={v.status} />
                      </div>
                      <div className="mt-2 flex items-center justify-between text-xs text-muted">
                        <BatteryReading voltage={v.battery.voltage} />
                        <span className="tabular">{formatGBPCompact(latestValue(v))}</span>
                      </div>
                      <p className="mt-1.5 truncate text-xs text-subtle">
                        {v.location.name} · next check {relativeDays(v.nextCheckAt)}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-4">
                <EmptyState icon={Car} title="No cars on the account" />
              </div>
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
                <a href={`mailto:${client.email}`} className="inline-flex items-center gap-1.5 hover:text-gold">
                  <Mail className="size-3.5 text-subtle" /> {client.email}
                </a>
              </Detail>
              <Detail label="Phone">
                <a href={`tel:${client.phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-1.5 hover:text-gold">
                  <Phone className="size-3.5 text-subtle" /> {client.phone}
                </a>
              </Detail>
              <Detail label="Prefers">{client.preferences.contactPreference}</Detail>
              <Detail label="Tier">
                <TierBadge tier={client.tier} /> <span className="ml-1 text-xs text-subtle">{TIERS[client.tier].cadence}</span>
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
              <ul className="divide-y divide-border">
                {client.contacts.map((c) => (
                  <li key={c.email} className="px-4 py-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium">{c.name}</p>
                      <Badge tone={c.canBook ? "success" : "neutral"}>{c.canBook ? "Can book" : "View only"}</Badge>
                    </div>
                    <p className="mt-0.5 text-xs text-muted">{c.role}</p>
                    <p className="mt-0.5 text-xs text-subtle">
                      {c.email}
                      {c.phone ? ` · ${c.phone}` : ""}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-4">
                <EmptyState title="Deals direct" description="No assistants or advisers on the account." />
              </div>
            )}
          </Panel>

          <Panel
            title="Messages"
            action={
              <Link href={`/console/messages?client=${client.id}`} className="text-xs text-muted hover:text-gold">
                Open thread
              </Link>
            }
          >
            {messages.length ? (
              <ul className="space-y-3">
                {messages.slice(-3).map((m) => (
                  <li key={m.id} className={cn("rounded-lg border p-3", m.from === "vf" ? "border-gold/20 bg-gold-soft" : "border-border bg-surface-2")}>
                    <p className="text-xs text-subtle">
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
