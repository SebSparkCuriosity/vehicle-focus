"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db, newId } from "@/lib/data/store";
import { FREQUENCY_DAYS, BATTERY_WARN_V, REQUEST_TYPE_META } from "@/lib/domain";
import { SESSION_COOKIE, encodePersona, getPersona } from "@/lib/session";
import type { LeadSource, LeadStage, RequestStatus, RequestType, Persona } from "@/lib/types";

// Write side of the platform. Every action returns a small result object so
// forms can show inline feedback with useActionState.

export type ActionResult = { ok: true; message?: string; id?: string } | { ok: false; error: string };

function str(fd: FormData, key: string): string {
  return String(fd.get(key) ?? "").trim();
}

function num(fd: FormData, key: string): number {
  return Number(fd.get(key));
}

// ---------- Demo sign-in ----------

export async function signInAs(persona: Persona, next?: string) {
  const store = await cookies();
  store.set(SESSION_COOKIE, encodePersona(persona), { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 7 });
  redirect(next ?? (persona.kind === "team" ? "/console" : "/garage"));
}

export async function signOut() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  redirect("/login");
}

// ---------- Client requests ----------

/** Raised from The Garage by a client or their delegate, or by the team on a client's behalf. */
export async function createRequest(_prev: ActionResult | null, fd: FormData): Promise<ActionResult> {
  const persona = await getPersona();
  if (!persona) return { ok: false, error: "Please sign in again." };

  const vehicleId = str(fd, "vehicleId");
  const vehicle = db.vehicles.find((v) => v.id === vehicleId);
  if (!vehicle) return { ok: false, error: "Choose a car." };
  if (persona.kind === "client" && vehicle.clientId !== persona.clientId) return { ok: false, error: "That car isn't on your account." };

  const type = (str(fd, "type") || "other") as RequestType;
  const date = str(fd, "date");
  const time = str(fd, "time") || "09:00";
  if (!date) return { ok: false, error: "When do you need it?" };
  const when = new Date(`${date}T${time}:00`).toISOString();

  const client = db.clients.find((c) => c.id === vehicle.clientId)!;
  const createdBy =
    persona.kind === "client" ? str(fd, "raisedBy") || client.name : `${db.team.find((t) => t.id === persona.memberId)?.name ?? "Vehicle Focus"} (team)`;

  const id = newId("rq");
  db.requests.unshift({
    id,
    clientId: vehicle.clientId,
    vehicleId,
    type,
    title: str(fd, "title") || `${REQUEST_TYPE_META[type].label}: ${vehicle.make} ${vehicle.model}`,
    when,
    location: str(fd, "location") || vehicle.location.name,
    notes: str(fd, "notes") || undefined,
    status: "new",
    createdAt: new Date().toISOString(),
    createdBy,
  });

  revalidatePath("/garage", "layout");
  revalidatePath("/console", "layout");
  return { ok: true, id, message: "Request sent. You'll get a confirmation shortly." };
}

export async function updateRequestStatus(requestId: string, status: RequestStatus) {
  const persona = await getPersona();
  const req = db.requests.find((r) => r.id === requestId);
  if (!req || !persona) return;
  // Clients may only cancel their own new requests
  if (persona.kind === "client" && (req.clientId !== persona.clientId || status !== "cancelled")) return;
  req.status = status;
  revalidatePath("/garage", "layout");
  revalidatePath("/console", "layout");
}

/** Team only: accept a request, assign it and put a job on the schedule. */
export async function scheduleRequest(_prev: ActionResult | null, fd: FormData): Promise<ActionResult> {
  const persona = await getPersona();
  if (persona?.kind !== "team") return { ok: false, error: "Team only." };
  const req = db.requests.find((r) => r.id === str(fd, "requestId"));
  if (!req) return { ok: false, error: "Request not found." };

  const assigneeId = str(fd, "assigneeId") || persona.memberId;
  const date = str(fd, "date") || req.when.slice(0, 10);
  const time = str(fd, "time") || "09:00";
  const start = new Date(`${date}T${time}:00`).toISOString();
  const partnerId = str(fd, "partnerId") || undefined;
  const quote = fd.get("quote") ? num(fd, "quote") : undefined;

  req.status = "scheduled";
  req.assigneeId = assigneeId;
  req.partnerId = partnerId;
  if (quote && !Number.isNaN(quote)) req.quote = quote;

  const kindMap: Record<RequestType, "handover" | "relocation" | "service" | "detailing" | "collection" | "check"> = {
    ready: "handover",
    relocation: "relocation",
    service: "service",
    detailing: "detailing",
    storage: "collection",
    valuation: "check",
    other: "check",
  };
  db.jobs.push({
    id: newId("jb"),
    vehicleId: req.vehicleId,
    requestId: req.id,
    kind: kindMap[req.type],
    title: req.title,
    start,
    durationMins: num(fd, "durationMins") || 60,
    assigneeId,
    status: "planned",
    location: req.location,
  });

  const member = db.team.find((t) => t.id === assigneeId);
  db.messages.push({
    id: newId("m"),
    clientId: req.clientId,
    from: "vf",
    author: member?.name ?? "Vehicle Focus",
    body: `Confirmed: "${req.title}". Booked for ${new Date(start).toLocaleString("en-GB", { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })}.${quote ? ` Quote: £${quote.toLocaleString("en-GB")}.` : ""}`,
    at: new Date().toISOString(),
  });

  revalidatePath("/garage", "layout");
  revalidatePath("/console", "layout");
  return { ok: true, message: "Scheduled and the client has been notified." };
}

// ---------- Checks ----------

/** Team only: log a readiness or storage check against a car. Updates its live state and history. */
export async function logCheck(_prev: ActionResult | null, fd: FormData): Promise<ActionResult> {
  const persona = await getPersona();
  if (persona?.kind !== "team") return { ok: false, error: "Team only." };
  const vehicle = db.vehicles.find((v) => v.id === str(fd, "vehicleId"));
  if (!vehicle) return { ok: false, error: "Car not found." };

  const batteryVoltage = num(fd, "batteryVoltage");
  const tyres = { fl: num(fd, "fl"), fr: num(fd, "fr"), rl: num(fd, "rl"), rr: num(fd, "rr") };
  const mileage = num(fd, "mileage") || vehicle.mileage;
  if (!batteryVoltage || batteryVoltage < 9 || batteryVoltage > 15) return { ok: false, error: "Battery voltage looks wrong. Enter resting volts, e.g. 12.6." };
  if (Object.values(tyres).some((p) => !p || p < 10 || p > 60)) return { ok: false, error: "Enter all four tyre pressures." };

  const fluidsOk = fd.get("fluidsOk") === "on";
  const exteriorOk = fd.get("exteriorOk") === "on";
  const interiorOk = fd.get("interiorOk") === "on";
  const notes = str(fd, "notes");
  const member = db.team.find((t) => t.id === persona.memberId);
  const now = new Date();

  vehicle.battery.voltage = batteryVoltage;
  vehicle.battery.onConditioner = fd.get("onConditioner") === "on";
  vehicle.tyres.current = tyres;
  vehicle.mileage = mileage;
  vehicle.lastCheckAt = now.toISOString();
  vehicle.nextCheckAt = new Date(now.getTime() + FREQUENCY_DAYS[vehicle.checkFrequency] * 86_400_000).toISOString();

  const issues: string[] = [];
  if (batteryVoltage < BATTERY_WARN_V) issues.push(`battery low at ${batteryVoltage.toFixed(1)}V`);
  if (!fluidsOk) issues.push("fluids need attention");
  if (!exteriorOk) issues.push("exterior issue noted");
  if (!interiorOk) issues.push("interior issue noted");
  if (issues.length) {
    vehicle.status = "attention";
    vehicle.statusNote = `Check found: ${issues.join(", ")}.`;
  } else if (vehicle.status === "attention") {
    vehicle.status = vehicle.location.kind === "vf-storage" ? "in-storage" : "ready";
    vehicle.statusNote = undefined;
  }

  db.history.push({
    id: newId("h"),
    vehicleId: vehicle.id,
    at: now.toISOString(),
    kind: "check",
    title: `${vehicle.checkFrequency[0].toUpperCase()}${vehicle.checkFrequency.slice(1)} check`,
    detail: notes || (issues.length ? `Found: ${issues.join(", ")}.` : "All readings within spec."),
    by: member?.name ?? "Vehicle Focus",
    readings: { batteryVoltage, tyres, mileage, fluidsOk, exteriorOk, interiorOk },
    visibleToClient: fd.get("visibleToClient") !== "off",
  });

  revalidatePath("/garage", "layout");
  revalidatePath("/console", "layout");
  return { ok: true, message: issues.length ? "Check logged. Car flagged for attention." : "Check logged. All good." };
}

// ---------- Messages ----------

export async function sendMessage(_prev: ActionResult | null, fd: FormData): Promise<ActionResult> {
  const persona = await getPersona();
  if (!persona) return { ok: false, error: "Please sign in again." };
  const body = str(fd, "body");
  if (!body) return { ok: false, error: "Write a message first." };

  const clientId = persona.kind === "client" ? persona.clientId : str(fd, "clientId");
  const client = db.clients.find((c) => c.id === clientId);
  if (!client) return { ok: false, error: "Client not found." };

  db.messages.push({
    id: newId("m"),
    clientId,
    from: persona.kind === "client" ? "client" : "vf",
    author: persona.kind === "client" ? str(fd, "author") || client.name : db.team.find((t) => t.id === persona.memberId)?.name ?? "Vehicle Focus",
    body,
    at: new Date().toISOString(),
  });
  revalidatePath("/garage", "layout");
  revalidatePath("/console", "layout");
  return { ok: true };
}

// ---------- Leads (public website) ----------

/** Contact form and readiness-check submissions land here and appear in the console pipeline. */
export async function createLead(_prev: ActionResult | null, fd: FormData): Promise<ActionResult> {
  const name = str(fd, "name");
  const email = str(fd, "email");
  if (!name) return { ok: false, error: "Please tell us your name." };
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { ok: false, error: "That email doesn't look right." };
  // Honeypot: bots fill every field
  if (str(fd, "company_website")) return { ok: true, message: "Thank you." };

  const score = fd.get("readinessScore") ? num(fd, "readinessScore") : undefined;
  db.leads.unshift({
    id: newId("ld"),
    name,
    email,
    phone: str(fd, "phone") || undefined,
    source: (str(fd, "source") || "Website") as LeadSource,
    role: (str(fd, "role") || undefined) as never,
    cars: str(fd, "cars") || undefined,
    message: str(fd, "message") || undefined,
    readinessScore: score !== undefined && !Number.isNaN(score) ? score : undefined,
    createdAt: new Date().toISOString(),
    stage: "new",
  });
  revalidatePath("/console", "layout");
  return { ok: true, message: "Thank you. Lawrence will be in touch personally, usually the same day." };
}

export async function updateLeadStage(leadId: string, stage: LeadStage) {
  const persona = await getPersona();
  if (persona?.kind !== "team") return;
  const lead = db.leads.find((l) => l.id === leadId);
  if (lead) lead.stage = stage;
  revalidatePath("/console", "layout");
}
