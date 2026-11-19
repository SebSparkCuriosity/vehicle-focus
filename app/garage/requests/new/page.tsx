import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { RequestForm } from "@/components/garage/request-form";
import { getClient, getVehicles } from "@/lib/data/queries";
import { REQUEST_TYPE_META, vehicleName } from "@/lib/domain";
import { requireClient } from "@/lib/session";
import type { RequestType } from "@/lib/types";

export const metadata: Metadata = { title: "New request" };

const ROLE_SHORT: Record<string, string> = {
  "Personal assistant": "PA",
  "Family office": "Family office",
  "Wealth manager": "Wealth manager",
  Partner: "Partner",
  Driver: "Driver",
};

function isRequestType(t: string | undefined): t is RequestType {
  return !!t && t in REQUEST_TYPE_META;
}

export default async function NewRequestPage({ searchParams }: { searchParams: Promise<{ type?: string; vehicle?: string }> }) {
  const { clientId } = await requireClient();
  const { type, vehicle } = await searchParams;
  const [client, vehicles] = await Promise.all([getClient(clientId), getVehicles({ clientId })]);

  const raisedBy = [
    client?.name ?? "Me",
    ...(client?.contacts.filter((c) => c.canBook).map((c) => `${c.name} (${ROLE_SHORT[c.role] ?? c.role})`) ?? []),
  ];

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const ymd = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/garage/requests" className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-text">
        <ArrowLeft className="size-4" aria-hidden />
        Requests
      </Link>
      <p className="eyebrow mt-6">New request</p>
      <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">What do you need?</h1>
      <p className="mt-2 text-muted">Tell us what, which car, when and where. We&apos;ll confirm personally, usually within the hour.</p>

      <div className="mt-8">
        <RequestForm
          vehicles={vehicles.map((v) => ({
            id: v.id,
            name: vehicleName(v),
            registration: v.registration,
            location: v.location.name,
          }))}
          raisedBy={raisedBy}
          defaultType={isRequestType(type) ? type : "ready"}
          defaultVehicleId={vehicles.some((v) => v.id === vehicle) ? vehicle : vehicles[0]?.id}
          defaultDate={ymd(tomorrow)}
          minDate={ymd(today)}
        />
      </div>
    </div>
  );
}
