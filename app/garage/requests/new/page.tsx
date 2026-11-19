import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageTitle } from "@/components/garage/bits";
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
      <Link
        href="/garage/requests"
        className="glass-dark inline-flex h-11 items-center gap-1.5 rounded-full px-4 text-[0.9rem] text-white/75 transition-colors hover:text-white md:h-10 md:text-[0.85rem]"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Requests
      </Link>
      <PageTitle className="mt-6 md:mt-8" title="What do you need?" intro="What, which car, when and where. We confirm personally." />

      <div className="mt-6 md:mt-8">
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
