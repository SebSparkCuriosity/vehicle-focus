import type { Metadata } from "next";
import Link from "next/link";
import { FileText, FolderLock, Lock, Upload } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { DOC_TONE, EmptyState, Plate } from "@/components/garage/bits";
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
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Document vault</p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">Every paper, in one place</h1>
          <p className="mt-2 max-w-xl text-muted">
            Registration, insurance, service records and condition reports for every car. Ready for a sale, an insurer or a valuer.
          </p>
        </div>
        <div className="flex flex-col items-start gap-1.5 sm:items-end">
          <button
            type="button"
            disabled
            aria-disabled
            className="inline-flex h-10 cursor-not-allowed items-center gap-2 rounded-md border border-dashed border-border-strong px-4 text-sm text-subtle"
          >
            <Upload className="size-4" aria-hidden />
            Upload
          </button>
          <p className="text-xs text-subtle">Uploads go live with secure storage. Coming soon.</p>
        </div>
      </div>

      <p className="flex items-center gap-2 text-sm text-muted">
        <span className="tabular font-medium text-text">{docs.length}</span> documents across{" "}
        <span className="tabular font-medium text-text">{groups.length}</span> {groups.length === 1 ? "car" : "cars"}
      </p>

      {groups.length ? (
        <div className="space-y-6">
          {groups.map(({ vehicle: v, docs: list }) => (
            <Card key={v.id} className="overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-surface-2/60 px-4 py-3 sm:px-5">
                <Link href={`/garage/cars/${v.id}`} className="flex min-w-0 items-center gap-3 hover:text-gold">
                  <span className="truncate font-display font-semibold">{vehicleName(v)}</span>
                  <Plate reg={v.registration} />
                </Link>
                <span className="text-xs text-subtle">
                  {list.length} {list.length === 1 ? "file" : "files"}
                </span>
              </div>
              <ul className="divide-y divide-border">
                {list.map((d) => (
                  <li key={d.id} className="flex items-center gap-3 px-4 py-3 sm:px-5">
                    <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-surface-2 text-muted">
                      <FileText className="size-4" aria-hidden />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{d.title}</p>
                      <p className="text-xs text-muted">
                        <span className="tabular">{formatDate(d.date)}</span> · {sizeLabel(d.sizeKb)}
                      </p>
                    </div>
                    <Badge tone={DOC_TONE[d.kind]} className="hidden sm:inline-flex">
                      {d.kind}
                    </Badge>
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

      <p className="flex items-start gap-2 text-xs leading-relaxed text-subtle">
        <Lock className="mt-0.5 size-3.5 shrink-0" aria-hidden />
        Only you, your authorised contacts and the Vehicle Focus team can see these files.
      </p>
    </div>
  );
}
