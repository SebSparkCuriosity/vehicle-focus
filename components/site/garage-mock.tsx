import { CalendarClock, ChevronRight, FileText, MessageSquare, Plus } from "lucide-react";
import { CarMedia } from "@/components/brand/car-art";
import { BatteryReading, VehicleStatusBadge } from "@/components/vehicle-status";
import { cn } from "@/lib/utils";
import type { VehicleStatus } from "@/lib/types";

// Illustrative portal screens for marketing pages. Example cars, photographed by
// Vehicle Focus; no real client data. Standalone mocks are smoked glass, so place
// them over a photograph or a BackdropLayer, never inside another glass pane.

export type MockCar = {
  make: string;
  model: string;
  detail: string;
  colour: string;
  paintHex: string;
  image?: string;
  imagePosition?: string;
  status: VehicleStatus;
  voltage: number;
  location: string;
  lastCheck: string;
  plate: string;
};

export const MOCK_CARS: MockCar[] = [
  {
    make: "Ferrari",
    model: "F8 Tributo",
    detail: "2022",
    colour: "Rosso Corsa",
    paintHex: "#b3121b",
    image: "/images/cars/f8-bond-street.jpg",
    imagePosition: "35% 60%",
    status: "ready",
    voltage: 12.8,
    location: "Home, left bay",
    lastCheck: "Checked 2 days ago",
    plate: "J 90",
  },
  {
    make: "Rolls-Royce",
    model: "Cullinan",
    detail: "2023 · Black Badge",
    colour: "Black Diamond",
    paintHex: "#1b1c20",
    image: "/images/cars/cullinan-mayfair.jpg",
    imagePosition: "50% 70%",
    status: "ready",
    voltage: 12.6,
    location: "Home",
    lastCheck: "Checked 9 days ago",
    plate: "J 6363",
  },
  {
    make: "Porsche",
    model: "911 Carrera RS",
    detail: "1992 · 964 Lightweight",
    colour: "Rubystone Red",
    paintHex: "#b8235f",
    status: "attention",
    voltage: 12.1,
    location: "Vehicle Focus storage",
    lastCheck: "Checked 4 days ago",
    plate: "J 1992",
  },
];

function MockCarRow({ car }: { car: MockCar }) {
  return (
    <div className="glass-inset flex min-w-0 items-center gap-3.5 rounded-2xl p-2.5 pr-3.5">
      <CarMedia vehicle={car} className="h-14 w-20 shrink-0 rounded-xl sm:h-16 sm:w-24" sizes="96px" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">
          {car.make} {car.model}
        </p>
        <p className="mt-0.5 truncate text-xs text-white/50">
          {car.location} · {car.lastCheck}
        </p>
        <div className="mt-1.5 flex items-center gap-3">
          <VehicleStatusBadge status={car.status} />
          <BatteryReading voltage={car.voltage} className="hidden sm:inline-flex" />
        </div>
      </div>
      <ChevronRight className="size-4 shrink-0 text-white/30" aria-hidden />
    </div>
  );
}

/** The Garage dashboard as a floating pane. */
export function GarageMock({ className, cars = MOCK_CARS }: { className?: string; cars?: MockCar[] }) {
  return (
    <div className={cn("glass-dark rounded-[28px] p-4 sm:p-5", className)} aria-label="Illustration of The Garage client portal" role="img">
      <div className="flex items-end justify-between gap-4 px-1">
        <div>
          <p className="text-xs text-white/50">Good morning</p>
          <p className="font-display text-2xl">Your collection</p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-xs font-medium text-black">
          <Plus className="size-3.5" aria-hidden />
          Have it ready
        </span>
      </div>
      <div className="mt-4 grid gap-2 [&>*]:min-w-0">
        {cars.map((c) => (
          <MockCarRow key={c.model} car={c} />
        ))}
      </div>
      <div className="mt-3 grid gap-2 px-1 pt-1 sm:grid-cols-2">
        <p className="flex items-center gap-2 text-xs text-white/55">
          <CalendarClock className="size-3.5 text-white/40" aria-hidden />
          <span>
            <span className="text-white">Insurance renewal</span> in 9 days
          </span>
        </p>
        <p className="flex min-w-0 items-center gap-2 text-xs text-white/55">
          <MessageSquare className="size-3.5 shrink-0 text-white/40" aria-hidden />
          <span className="truncate">
            <span className="text-white">Lawrence:</span> F8 is back in the left bay
          </span>
        </p>
      </div>
    </div>
  );
}

/** A phone showing one car in The Garage. */
export function PhoneMock({ className, car = MOCK_CARS[0] }: { className?: string; car?: MockCar }) {
  const tyres = [
    ["FL", 36],
    ["FR", 36],
    ["RL", 37],
    ["RR", 37],
  ] as const;
  return (
    <div
      className={cn("glass-dark mx-auto w-full max-w-[19rem] rounded-[44px] p-2.5", className)}
      role="img"
      aria-label={`Illustration of The Garage on a phone, showing a ${car.make} ${car.model}`}
    >
      <div className="overflow-hidden rounded-[36px] bg-black/50">
        <div className="relative aspect-[4/3.4]">
          <CarMedia vehicle={car} className="absolute inset-0" sizes="300px" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/30" aria-hidden />
          <div className="absolute inset-x-0 top-0 flex justify-center pt-2.5">
            <span className="h-5 w-24 rounded-full bg-black" aria-hidden />
          </div>
          <div className="absolute inset-x-0 bottom-0 p-4">
            <VehicleStatusBadge status={car.status} />
            <p className="mt-2 font-display text-[1.6rem] leading-none">
              {car.make} {car.model}
            </p>
            <p className="mt-1.5 text-xs text-white/60">
              {car.plate} · {car.location}
            </p>
          </div>
        </div>
        <div className="grid gap-2 p-3">
          <div className="glass-inset flex items-center justify-between rounded-2xl px-3.5 py-3">
            <span className="text-xs text-white/50">Battery</span>
            <BatteryReading voltage={car.voltage} />
          </div>
          <div className="glass-inset rounded-2xl px-3.5 py-3">
            <p className="text-xs text-white/50">Tyres, psi</p>
            <div className="mt-2 grid grid-cols-4 gap-1.5 text-center">
              {tyres.map(([pos, p]) => (
                <span key={pos}>
                  <span className="block text-[0.6rem] text-white/40">{pos}</span>
                  <span className="text-sm text-success tabular">{p}</span>
                </span>
              ))}
            </div>
          </div>
          <span className="mt-1 rounded-full bg-accent py-2.5 text-center text-xs font-medium text-black">Have it ready</span>
          <p className="pb-1 text-center text-[0.65rem] text-white/40">{car.lastCheck} by your technician</p>
        </div>
      </div>
    </div>
  );
}

/** A single readiness-check record. */
export function CheckMock({ className }: { className?: string }) {
  const tyres = [
    ["FL", 36, 36],
    ["FR", 36, 36],
    ["RL", 37, 37],
    ["RR", 37, 37],
  ] as const;
  return (
    <div className={cn("glass-dark rounded-[28px] p-6", className)} role="img" aria-label="Illustration of a readiness check record">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium">Weekly readiness check</p>
          <p className="mt-0.5 text-xs text-white/50">Vehicle technician · 2 days ago</p>
        </div>
        <VehicleStatusBadge status="ready" />
      </div>
      <dl className="mt-5 grid grid-cols-2 gap-2 text-sm">
        <div className="glass-inset rounded-2xl p-3.5">
          <dt className="text-xs text-white/45">Battery</dt>
          <dd className="mt-1.5">
            <BatteryReading voltage={12.8} />
          </dd>
        </div>
        <div className="glass-inset rounded-2xl p-3.5">
          <dt className="text-xs text-white/45">Mileage</dt>
          <dd className="mt-1.5 font-medium tabular">4,812 mi</dd>
        </div>
        <div className="glass-inset col-span-2 rounded-2xl p-3.5">
          <dt className="text-xs text-white/45">Tyre pressures against target, psi</dt>
          <dd className="mt-2.5 grid grid-cols-4 gap-2 text-center">
            {tyres.map(([pos, cur, target]) => (
              <span key={pos}>
                <span className="block text-[0.65rem] text-white/40">{pos}</span>
                <span className="text-sm font-medium text-success tabular">{cur}</span>
                <span className="text-[0.65rem] text-white/35">/{target}</span>
              </span>
            ))}
          </dd>
        </div>
      </dl>
      <p className="mt-4 text-xs leading-relaxed text-white/55">All readings within spec. Detailed and fuelled to full.</p>
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
    <div className={cn("glass-dark rounded-[28px] p-6", className)} role="img" aria-label="Illustration of the documents vault">
      <p className="text-sm font-medium">Documents</p>
      <ul className="mt-3 divide-y divide-white/[0.07]">
        {docs.map(([title, kind, size]) => (
          <li key={title} className="flex items-center gap-3 py-3">
            <FileText className="size-4 shrink-0 text-white/40" aria-hidden />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm">{title}</span>
              <span className="block text-xs text-white/45">{kind}</span>
            </span>
            <span className="text-xs text-white/40 tabular">{size}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** A request being raised, as a PA would see it. */
export function RequestMock({ className }: { className?: string }) {
  return (
    <div className={cn("glass-dark rounded-[28px] p-6", className)} role="img" aria-label="Illustration of raising a request">
      <p className="text-sm font-medium">New request</p>
      <div className="mt-4 grid gap-2 text-sm">
        <div className="rounded-2xl border border-white/25 bg-white/[0.08] px-3.5 py-3">
          <p className="text-xs font-medium">Have it ready</p>
          <p className="mt-0.5 text-xs text-white/55">Charged, fuelled, clean and waiting where you want it.</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="glass-inset rounded-2xl px-3.5 py-2.5">
            <p className="text-[0.65rem] text-white/45">Car</p>
            <p className="truncate">Rolls-Royce Cullinan</p>
          </div>
          <div className="glass-inset rounded-2xl px-3.5 py-2.5">
            <p className="text-[0.65rem] text-white/45">When</p>
            <p>Sat, 09:00</p>
          </div>
        </div>
        <div className="glass-inset rounded-2xl px-3.5 py-2.5">
          <p className="text-[0.65rem] text-white/45">Where</p>
          <p>Jersey Airport, private aviation</p>
        </div>
        <div className="mt-1 rounded-full bg-accent py-2.5 text-center text-xs font-medium text-black">Send request</div>
        <p className="text-center text-[0.7rem] text-white/40">Raised by your PA · confirmed by Vehicle Focus</p>
      </div>
    </div>
  );
}
