import { CalendarClock, ChevronRight, FileText, MessageSquare, Plus } from "lucide-react";
import { CarArt } from "@/components/brand/car-art";
import { BatteryReading, VehicleStatusBadge } from "@/components/vehicle-status";
import { Sparkline } from "@/components/charts";
import { cn } from "@/lib/utils";
import type { BodyStyle, VehicleStatus } from "@/lib/types";

// Illustrative portal screens for marketing pages. Example cars only, no real client data.

export type MockCar = {
  name: string;
  detail: string;
  bodyStyle: BodyStyle;
  paint: string;
  status: VehicleStatus;
  voltage: number;
  location: string;
  lastCheck: string;
  note?: string;
  values?: number[];
};

export const MOCK_CARS: MockCar[] = [
  {
    name: "Ferrari SF90 Stradale",
    detail: "2023 · Assetto Fiorano",
    bodyStyle: "coupe",
    paint: "#b3121b",
    status: "ready",
    voltage: 12.8,
    location: "Home, left bay",
    lastCheck: "Checked 2 days ago",
    note: "Charged, fuelled and detailed. Facing out.",
    values: [455, 438, 425, 418, 421],
  },
  {
    name: "Porsche 911 Carrera RS",
    detail: "1992 · 964 Lightweight",
    bodyStyle: "coupe",
    paint: "#e9e6dc",
    status: "attention",
    voltage: 12.1,
    location: "Vehicle Focus storage",
    lastCheck: "Checked 4 days ago",
    note: "Battery tired. Replacement recommended before spring.",
    values: [198, 236, 262, 279, 286],
  },
  {
    name: "McLaren Artura Spider",
    detail: "2024",
    bodyStyle: "roadster",
    paint: "#e5621b",
    status: "charging",
    voltage: 12.5,
    location: "Home",
    lastCheck: "Checked 6 days ago",
    note: "On maintenance charge ahead of Saturday.",
    values: [221, 198, 186, 181],
  },
];

function MockCarRow({ car }: { car: MockCar }) {
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-lg border border-border bg-surface-2 p-3 sm:gap-4">
      <div className="w-24 shrink-0 sm:w-32">
        <CarArt bodyStyle={car.bodyStyle} paint={car.paint} title={car.name} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate text-sm font-medium">{car.name}</p>
          <VehicleStatusBadge status={car.status} />
        </div>
        <p className="mt-0.5 truncate text-xs text-muted">
          {car.location} · {car.lastCheck}
        </p>
        <div className="mt-2 hidden items-center gap-4 sm:flex">
          <BatteryReading voltage={car.voltage} />
          {car.values ? <Sparkline values={car.values} tone={car.values.at(-1)! >= car.values[0] ? "success" : "gold"} className="h-5 w-16" /> : null}
        </div>
      </div>
      <ChevronRight className="size-4 shrink-0 text-subtle" aria-hidden />
    </div>
  );
}

/** A framed, non-interactive mock of The Garage dashboard. */
export function GarageMock({ className, cars = MOCK_CARS }: { className?: string; cars?: MockCar[] }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border-strong bg-surface shadow-[0_40px_120px_-40px_rgba(206,170,0,0.25)]",
        className,
      )}
      aria-label="Illustration of The Garage client portal"
      role="img"
    >
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-surface-3" />
          <span className="size-2.5 rounded-full bg-surface-3" />
          <span className="size-2.5 rounded-full bg-surface-3" />
        </div>
        <p className="font-display text-[0.65rem] font-semibold tracking-[0.24em] text-subtle uppercase">The Garage</p>
        <span className="w-10" />
      </div>
      <div className="p-4 sm:p-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs text-muted">Good morning</p>
            <p className="font-display text-lg font-semibold tracking-tight">Your collection</p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-md bg-gold px-2.5 py-1.5 text-xs font-medium text-[#0b0b0c]">
            <Plus className="size-3.5" aria-hidden />
            Have it ready
          </span>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          {[
            ["3", "Cars"],
            ["2", "Ready"],
            ["9 days", "Next due"],
          ].map(([v, l]) => (
            <div key={l} className="rounded-lg border border-border bg-surface-2 px-2 py-2.5">
              <p className="font-display text-base font-semibold tabular">{v}</p>
              <p className="text-[0.68rem] text-subtle">{l}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 grid gap-2.5 [&>*]:min-w-0">
          {cars.map((c) => (
            <MockCarRow key={c.name} car={c} />
          ))}
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <div className="flex items-center gap-2.5 rounded-lg border border-border bg-surface-2 px-3 py-2.5">
            <CalendarClock className="size-4 text-gold" aria-hidden />
            <p className="text-xs text-muted">
              <span className="text-text">Insurance renewal</span> in 9 days
            </p>
          </div>
          <div className="flex items-center gap-2.5 rounded-lg border border-border bg-surface-2 px-3 py-2.5">
            <MessageSquare className="size-4 text-gold" aria-hidden />
            <p className="truncate text-xs text-muted">
              <span className="text-text">Lawrence:</span> SF90 is back in the left bay
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/** A single readiness-check card as it appears on a car page. */
export function CheckMock({ className }: { className?: string }) {
  const tyres = [
    ["FL", 36, 36],
    ["FR", 36, 36],
    ["RL", 37, 37],
    ["RR", 37, 37],
  ] as const;
  return (
    <div className={cn("rounded-xl border border-border bg-surface p-5", className)} role="img" aria-label="Illustration of a readiness check record">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium">Weekly readiness check</p>
          <p className="text-xs text-muted">Vehicle technician · 2 days ago</p>
        </div>
        <VehicleStatusBadge status="ready" />
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-lg bg-surface-2 p-3">
          <dt className="text-xs text-subtle">Battery</dt>
          <dd className="mt-1">
            <BatteryReading voltage={12.8} />
          </dd>
        </div>
        <div className="rounded-lg bg-surface-2 p-3">
          <dt className="text-xs text-subtle">Mileage</dt>
          <dd className="mt-1 tabular font-medium">4,812 mi</dd>
        </div>
        <div className="col-span-2 rounded-lg bg-surface-2 p-3">
          <dt className="text-xs text-subtle">Tyre pressures (psi, target)</dt>
          <dd className="mt-2 grid grid-cols-4 gap-2 text-center">
            {tyres.map(([pos, cur, target]) => (
              <span key={pos} className="rounded-md border border-border px-1 py-1.5">
                <span className="block text-[0.65rem] text-subtle">{pos}</span>
                <span className="tabular text-sm font-medium text-success">{cur}</span>
                <span className="block text-[0.65rem] text-subtle">/{target}</span>
              </span>
            ))}
          </dd>
        </div>
      </dl>
      <p className="mt-4 text-xs leading-relaxed text-muted">All readings within spec. High-voltage battery at 62%. Detailed and fuelled to full.</p>
    </div>
  );
}

/** Documents vault snippet. */
export function VaultMock({ className }: { className?: string }) {
  const docs = [
    ["Service book, digitised", "Service record", "4.1 MB"],
    ["Certificate of Authenticity", "Purchase", "2.3 MB"],
    ["Agreed-value valuation report", "Condition report", "6.0 MB"],
    ["Insurance schedule", "Insurance", "380 KB"],
  ];
  return (
    <div className={cn("rounded-xl border border-border bg-surface p-5", className)} role="img" aria-label="Illustration of the documents vault">
      <p className="text-sm font-medium">Documents</p>
      <ul className="mt-3 divide-y divide-border">
        {docs.map(([title, kind, size]) => (
          <li key={title} className="flex items-center gap-3 py-2.5">
            <span className="grid size-8 shrink-0 place-items-center rounded-md bg-gold-soft">
              <FileText className="size-4 text-gold" aria-hidden />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm">{title}</span>
              <span className="block text-xs text-subtle">{kind}</span>
            </span>
            <span className="text-xs text-subtle tabular">{size}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** A request being raised, as a PA would see it. */
export function RequestMock({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-xl border border-border bg-surface p-5", className)} role="img" aria-label="Illustration of raising a request">
      <p className="text-sm font-medium">New request</p>
      <div className="mt-4 grid gap-3 text-sm">
        <div className="rounded-lg border border-gold/50 bg-gold-soft px-3 py-2.5">
          <p className="text-xs text-gold">Have it ready</p>
          <p className="mt-0.5 text-xs text-muted">Charged, fuelled, clean and waiting where you want it.</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-md border border-border bg-surface-2 px-3 py-2">
            <p className="text-[0.65rem] text-subtle">Car</p>
            <p className="truncate">Rolls-Royce Spectre</p>
          </div>
          <div className="rounded-md border border-border bg-surface-2 px-3 py-2">
            <p className="text-[0.65rem] text-subtle">When</p>
            <p>Sat, 09:00</p>
          </div>
        </div>
        <div className="rounded-md border border-border bg-surface-2 px-3 py-2">
          <p className="text-[0.65rem] text-subtle">Where</p>
          <p>Jersey Airport, private aviation</p>
        </div>
        <div className="rounded-md bg-gold px-3 py-2 text-center text-xs font-medium text-[#0b0b0c]">Send request</div>
        <p className="text-center text-[0.7rem] text-subtle">Raised by your PA · confirmed by Vehicle Focus</p>
      </div>
    </div>
  );
}
