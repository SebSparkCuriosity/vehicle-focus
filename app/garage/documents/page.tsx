import type { Metadata } from "next";
import Link from "next/link";
import { FileText, FolderLock, Lock, Upload } from "lucide-react";
import { CarMedia } from "@/components/brand/car-art";
import { Card } from "@/components/ui/card";
import { EmptyState, PageTitle, Plate } from "@/components/garage/bits";
import { getDocuments, getVehicles } from "@/lib/data/queries";
import { vehicleName } from "@/lib/domain";
import { formatDate, sizeLabel } from "@/lib/format";
import { requireClient } from "@/lib/session";

export const metadata: Metadata = { title: "Documents" };

export default async function DocumentsPage() {
  const { clientId } = await requireClient();
  const [docs, vehicles] = await Promise.all([getDocuments({ clientId }), getVehicles({ clientId })]);
  const groups = vehicles.map((v) => ({ vehicle: v, docs: docs.filter((d) => d.vehicleId === v.id) })).filter((g) => g.docs.length);

  return (
    <div className="space-y-10">
      <PageTitle
        title="Documents"
        intro={
          <>
            Registration, insurance, service records and condition reports, ready for a sale, an insurer or a valuer.{" "}
            <span className="text-white/45">
              {docs.length} {docs.length === 1 ? "file" : "files"} across {groups.length} {groups.length === 1 ? "car" : "cars"}.
            </span>
          </>
        }
        action={
          <div className="flex flex-col items-start gap-1.5 sm:items-end">
            <button
              type="button"
              disabled
              aria-disabled
              className="inline-flex h-11 cursor-not-allowed items-center gap-2 rounded-full border border-dashed border-white/20 px-5 text-sm text-white/45"
            >
              <Upload className="size-4" aria-hidden />
              Upload
            </button>
            <p className="text-[0.75rem] text-white/40">Coming soon, with secure storage.</p>
          </div>
        }
      />

      {groups.length ? (
        <div className="space-y-5">
          {groups.map(({ vehicle: v, docs: list }) => (
            <Card key={v.id} className="overflow-hidden rounded-[24px]">
              <Link
                href={`/garage/cars/${v.id}`}
                className="flex items-center gap-4 border-b border-white/[0.07] p-4 transition-colors hover:bg-white/[0.03] sm:px-5"
              >
                <span className="relative size-14 shrink-0 overflow-hidden rounded-2xl border border-white/10">
                  <CarMedia vehicle={v} sizes="56px" className="absolute inset-0" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-display text-xl leading-tight font-normal">{vehicleName(v)}</span>
                  <span className="mt-1 flex items-center gap-2 text-[0.78rem] text-white/45">
                    <Plate reg={v.registration} />
                    {list.length} {list.length === 1 ? "file" : "files"}
                  </span>
                </span>
              </Link>
              <ul>
                {list.map((d, i) => (
                  <li key={d.id} className={i > 0 ? "border-t border-white/[0.05]" : undefined}>
                    <div className="flex items-center gap-3 px-4 py-3.5 sm:px-5">
                      <FileText className="size-4 shrink-0 text-white/35" aria-hidden />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[0.92rem]">{d.title}</p>
                        <p className="text-[0.78rem] text-white/45">
                          {d.kind} · <span className="tabular">{formatDate(d.date)}</span> · {sizeLabel(d.sizeKb)}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={FolderLock}
          title="The vault is empty"
          body="We'll digitise your registration, insurance and service records during the vehicle audit."
        />
      )}

      <p className="flex items-start gap-2 px-1 text-[0.78rem] leading-relaxed text-white/45">
        <Lock className="mt-0.5 size-3.5 shrink-0" aria-hidden />
        Only you, your authorised contacts and the Vehicle Focus team can see these files.
      </p>
    </div>
  );
}
