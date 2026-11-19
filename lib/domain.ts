// Business rules shared by the client portal and the operator console.
// Pure functions: no data access, safe to import from client components.

import { daysUntil } from "@/lib/format";
import type {
  CheckFrequency,
  DueItem,
  JobKind,
  LeadStage,
  RequestStatus,
  RequestType,
  Tier,
  Vehicle,
  VehicleStatus,
} from "@/lib/types";

export const BATTERY_WARN_V = 12.4; // below this a lead-acid/AGM battery is under-charged
export const BATTERY_CRITICAL_V = 12.2;

export const TIERS: Record<Tier, { label: string; cadence: string; blurb: string }> = {
  gold: {
    label: "Gold",
    cadence: "Quarterly health checks",
    blurb: "Essential upkeep: battery care, tyres, fluids and an adviser on call for servicing and repairs.",
  },
  platinum: {
    label: "Platinum",
    cadence: "Monthly inspections",
    blurb: "Full concierge: servicing, detailing, logistics and short-term secure storage, with a dedicated account manager.",
  },
  "black-label": {
    label: "Black Label",
    cadence: "Weekly readiness checks",
    blurb: "All-inclusive for significant collections: worldwide transport, trackside support, asset protection and 24/7 access.",
  },
};

export const STATUS_META: Record<VehicleStatus, { label: string; tone: "success" | "gold" | "info" | "warning" | "danger" | "neutral"; description: string }> = {
  ready: { label: "Ready", tone: "success", description: "Checked, charged and legal. Ready to drive." },
  "in-storage": { label: "In storage", tone: "neutral", description: "Laid up on a care cycle." },
  charging: { label: "Charging", tone: "info", description: "On a maintenance charge." },
  "at-service": { label: "At service", tone: "gold", description: "With a specialist." },
  "in-transit": { label: "In transit", tone: "info", description: "Being moved." },
  attention: { label: "Needs attention", tone: "warning", description: "Something needs a decision." },
};

export const REQUEST_TYPE_META: Record<RequestType, { label: string; verb: string; description: string }> = {
  ready: { label: "Have it ready", verb: "Ready", description: "Charged, fuelled, clean and waiting where you want it." },
  relocation: { label: "Move a car", verb: "Move", description: "Home, airport, harbour, circuit or abroad." },
  service: { label: "Service or repair", verb: "Service", description: "We book, deliver, supervise and collect." },
  detailing: { label: "Detailing & protection", verb: "Detail", description: "Wash, correction, ceramic or PPF." },
  storage: { label: "Storage", verb: "Store", description: "Short or long term, with checks included." },
  valuation: { label: "Valuation", verb: "Value", description: "For insurance, sale or your own records." },
  other: { label: "Something else", verb: "Request", description: "If it involves the car, ask." },
};

export const REQUEST_STATUS_META: Record<RequestStatus, { label: string; tone: "gold" | "info" | "warning" | "success" | "neutral" }> = {
  new: { label: "New", tone: "gold" },
  scheduled: { label: "Scheduled", tone: "info" },
  "in-progress": { label: "In progress", tone: "warning" },
  done: { label: "Done", tone: "success" },
  cancelled: { label: "Cancelled", tone: "neutral" },
};

export const LEAD_STAGES: { id: LeadStage; label: string }[] = [
  { id: "new", label: "New" },
  { id: "contacted", label: "Contacted" },
  { id: "audit-booked", label: "Audit booked" },
  { id: "proposal", label: "Proposal sent" },
  { id: "won", label: "Won" },
  { id: "lost", label: "Lost" },
];

export const JOB_KIND_LABEL: Record<JobKind, string> = {
  check: "Check",
  relocation: "Relocation",
  service: "Service",
  detailing: "Detailing",
  handover: "Handover",
  collection: "Collection",
  photography: "Photography",
};

export const FREQUENCY_DAYS: Record<CheckFrequency, number> = {
  weekly: 7,
  fortnightly: 14,
  monthly: 30,
  quarterly: 91,
};

export function vehicleName(v: Pick<Vehicle, "make" | "model">): string {
  return `${v.make} ${v.model}`;
}

export function vehicleFullName(v: Pick<Vehicle, "year" | "make" | "model" | "variant">): string {
  return `${v.year} ${v.make} ${v.model}${v.variant ? ` ${v.variant}` : ""}`;
}

export function latestValue(v: Vehicle): number {
  return v.valuations.at(-1)?.value ?? v.purchasePrice;
}

/** Change over the last two valuation points, as a fraction (0.02 = +2%). */
export function valueTrend(v: Vehicle): number {
  const pts = v.valuations;
  if (pts.length < 2) return 0;
  const prev = pts[pts.length - 2].value;
  return (pts[pts.length - 1].value - prev) / prev;
}

export function batteryTone(voltage: number): "success" | "warning" | "danger" {
  if (voltage < BATTERY_CRITICAL_V) return "danger";
  if (voltage < BATTERY_WARN_V) return "warning";
  return "success";
}

export function tyreDeviation(v: Vehicle): number {
  const { current, target } = v.tyres;
  return Math.max(
    Math.abs(current.fl - target.fl),
    Math.abs(current.fr - target.fr),
    Math.abs(current.rl - target.rl),
    Math.abs(current.rr - target.rr),
  );
}

export function isCheckOverdue(v: Vehicle, now: number = Date.now()): boolean {
  return new Date(v.nextCheckAt).getTime() < now;
}

export type AttentionReason = { vehicleId: string; severity: "high" | "medium"; label: string };

/** Everything about a car that a human should look at, most severe first. */
export function attentionReasons(v: Vehicle, due: DueItem[], now: number = Date.now()): AttentionReason[] {
  const out: AttentionReason[] = [];
  if (v.battery.voltage < BATTERY_CRITICAL_V) out.push({ vehicleId: v.id, severity: "high", label: `Battery ${v.battery.voltage.toFixed(1)}V` });
  else if (v.battery.voltage < BATTERY_WARN_V) out.push({ vehicleId: v.id, severity: "medium", label: `Battery ${v.battery.voltage.toFixed(1)}V` });
  if (isCheckOverdue(v, now)) out.push({ vehicleId: v.id, severity: "high", label: "Check overdue" });
  if (tyreDeviation(v) >= 1) out.push({ vehicleId: v.id, severity: "medium", label: "Tyres off target" });
  for (const d of due) {
    if (d.vehicleId !== v.id) continue;
    const days = daysUntil(d.dueDate, now);
    if (days < 0) out.push({ vehicleId: v.id, severity: "high", label: `${d.kind} overdue` });
    else if (days <= 14) out.push({ vehicleId: v.id, severity: "medium", label: `${d.kind} due in ${days}d` });
  }
  return out.sort((a, b) => (a.severity === b.severity ? 0 : a.severity === "high" ? -1 : 1));
}

/**
 * Readiness score for the public "How ready is your car?" tool.
 * Returns 0-100 where higher means more at risk, plus the findings that drove it.
 */
export function readinessRisk(input: {
  weeksSinceDriven: number;
  powertrain: "petrol" | "hybrid" | "electric";
  onConditioner: boolean;
  storage: "heated" | "garage" | "outdoor";
  monthsSinceService: number;
  recordsComplete: "yes" | "partly" | "no";
}): { score: number; findings: { area: string; level: "ok" | "watch" | "risk"; note: string }[] } {
  const findings: { area: string; level: "ok" | "watch" | "risk"; note: string }[] = [];
  let score = 0;

  // Battery
  const batteryRiskWeeks = input.onConditioner ? 12 : input.powertrain === "petrol" ? 3 : 2;
  if (input.weeksSinceDriven > batteryRiskWeeks * 2) {
    score += 28;
    findings.push({ area: "Battery", level: "risk", note: "Long enough unused for a deep discharge. Modern supercars can need full system resets after a flat battery." });
  } else if (input.weeksSinceDriven > batteryRiskWeeks) {
    score += 14;
    findings.push({ area: "Battery", level: "watch", note: "Getting close to the point where charge drops below a safe resting voltage." });
  } else {
    findings.push({ area: "Battery", level: "ok", note: "Recently used or on a conditioner. Keep it that way." });
  }

  // Tyres
  if (input.weeksSinceDriven >= 6) {
    score += input.storage === "outdoor" ? 22 : 16;
    findings.push({ area: "Tyres", level: "risk", note: "Stationary for six weeks or more: flat spots and pressure loss are likely. Performance tyres are expensive to replace." });
  } else if (input.weeksSinceDriven >= 3) {
    score += 8;
    findings.push({ area: "Tyres", level: "watch", note: "Pressures will be drifting. Check before the next drive." });
  } else {
    findings.push({ area: "Tyres", level: "ok", note: "Used recently enough to avoid flat spots." });
  }

  // Fluids & servicing
  if (input.monthsSinceService > 14) {
    score += 22;
    findings.push({ area: "Fluids & servicing", level: "risk", note: "Oil, coolant and brake fluid degrade with time, not just miles. Overdue servicing also dents resale value." });
  } else if (input.monthsSinceService > 10) {
    score += 10;
    findings.push({ area: "Fluids & servicing", level: "watch", note: "A service is coming due. Booking ahead avoids losing a summer weekend to it." });
  } else {
    findings.push({ area: "Fluids & servicing", level: "ok", note: "Within its service window." });
  }

  // Storage
  if (input.storage === "outdoor") {
    score += 12;
    findings.push({ area: "Storage", level: "risk", note: "Sea air and damp are hard on paint, rubber and electrics. Island cars feel this more than most." });
  } else if (input.storage === "garage") {
    score += 4;
    findings.push({ area: "Storage", level: "watch", note: "A dry garage is good. Humidity control and a breathable cover are better for long layups." });
  } else {
    findings.push({ area: "Storage", level: "ok", note: "Heated, dry storage is the right place for a long layup." });
  }

  // Records
  if (input.recordsComplete === "no") {
    score += 16;
    findings.push({ area: "Records & provenance", level: "risk", note: "Gaps in the history cost real money at sale and can complicate agreed-value insurance." });
  } else if (input.recordsComplete === "partly") {
    score += 7;
    findings.push({ area: "Records & provenance", level: "watch", note: "Worth bringing into one place before you need them." });
  } else {
    findings.push({ area: "Records & provenance", level: "ok", note: "Complete records protect value. Keep adding to them." });
  }

  return { score: Math.min(100, score), findings };
}
