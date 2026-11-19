import "server-only";
import { db } from "@/lib/data/store";
import { attentionReasons, latestValue, type AttentionReason } from "@/lib/domain";
import { daysUntil } from "@/lib/format";
import type { Job, RequestStatus, ServiceRequest, Vehicle } from "@/lib/types";

// Read side of the platform. Async on purpose: the signatures match what a
// Supabase-backed implementation will look like, so pages don't change.

const byDateDesc = <T>(key: (t: T) => string) => (a: T, b: T) => key(b).localeCompare(key(a));
const byDateAsc = <T>(key: (t: T) => string) => (a: T, b: T) => key(a).localeCompare(key(b));

// ---------- Team & clients ----------

export async function getTeam() {
  return db.team;
}

export async function getTeamMember(id: string | undefined) {
  return db.team.find((t) => t.id === id);
}

export async function getClients() {
  return [...db.clients].sort((a, b) => a.name.localeCompare(b.name));
}

export async function getClient(id: string) {
  return db.clients.find((c) => c.id === id);
}

// ---------- Vehicles ----------

export async function getVehicles(opts: { clientId?: string } = {}) {
  return db.vehicles.filter((v) => !opts.clientId || v.clientId === opts.clientId);
}

export async function getVehicle(id: string) {
  return db.vehicles.find((v) => v.id === id);
}

export async function getVehicleWithClient(id: string) {
  const vehicle = db.vehicles.find((v) => v.id === id);
  if (!vehicle) return undefined;
  const client = db.clients.find((c) => c.id === vehicle.clientId)!;
  return { vehicle, client };
}

// ---------- History, documents, due dates ----------

export async function getHistory(vehicleId: string, opts: { clientView?: boolean } = {}) {
  return db.history
    .filter((h) => h.vehicleId === vehicleId && (!opts.clientView || h.visibleToClient))
    .sort(byDateDesc((h) => h.at));
}

export async function getRecentActivity(opts: { clientId?: string; limit?: number; clientView?: boolean } = {}) {
  const vehicleIds = new Set(db.vehicles.filter((v) => !opts.clientId || v.clientId === opts.clientId).map((v) => v.id));
  return db.history
    .filter((h) => vehicleIds.has(h.vehicleId) && (!opts.clientView || h.visibleToClient))
    .sort(byDateDesc((h) => h.at))
    .slice(0, opts.limit ?? 10);
}

export async function getDocuments(opts: { vehicleId?: string; clientId?: string } = {}) {
  const vehicleIds = opts.clientId ? new Set(db.vehicles.filter((v) => v.clientId === opts.clientId).map((v) => v.id)) : undefined;
  return db.documents
    .filter((d) => (!opts.vehicleId || d.vehicleId === opts.vehicleId) && (!vehicleIds || vehicleIds.has(d.vehicleId)))
    .sort(byDateDesc((d) => d.date));
}

export async function getDueItems(opts: { vehicleId?: string; clientId?: string; withinDays?: number } = {}) {
  const vehicleIds = opts.clientId ? new Set(db.vehicles.filter((v) => v.clientId === opts.clientId).map((v) => v.id)) : undefined;
  return db.dueItems
    .filter((d) => (!opts.vehicleId || d.vehicleId === opts.vehicleId) && (!vehicleIds || vehicleIds.has(d.vehicleId)))
    .filter((d) => opts.withinDays === undefined || daysUntil(d.dueDate) <= opts.withinDays)
    .sort(byDateAsc((d) => d.dueDate));
}

// ---------- Requests, jobs, messages ----------

export async function getRequests(opts: { clientId?: string; vehicleId?: string; status?: RequestStatus[] } = {}) {
  return db.requests
    .filter(
      (r) =>
        (!opts.clientId || r.clientId === opts.clientId) &&
        (!opts.vehicleId || r.vehicleId === opts.vehicleId) &&
        (!opts.status || opts.status.includes(r.status)),
    )
    .sort(byDateDesc((r) => r.createdAt));
}

export async function getRequest(id: string): Promise<ServiceRequest | undefined> {
  return db.requests.find((r) => r.id === id);
}

export async function getJobs(opts: { from?: string; to?: string; vehicleId?: string; clientId?: string } = {}): Promise<Job[]> {
  const vehicleIds = opts.clientId ? new Set(db.vehicles.filter((v) => v.clientId === opts.clientId).map((v) => v.id)) : undefined;
  return db.jobs
    .filter(
      (j) =>
        (!opts.from || j.start >= opts.from) &&
        (!opts.to || j.start < opts.to) &&
        (!opts.vehicleId || j.vehicleId === opts.vehicleId) &&
        (!vehicleIds || vehicleIds.has(j.vehicleId)),
    )
    .sort(byDateAsc((j) => j.start));
}

export async function getMessages(clientId: string) {
  return db.messages.filter((m) => m.clientId === clientId).sort(byDateAsc((m) => m.at));
}

/** Latest message per client, newest conversation first. For the console inbox. */
export async function getConversations() {
  return db.clients
    .map((client) => {
      const thread = db.messages.filter((m) => m.clientId === client.id).sort(byDateAsc((m) => m.at));
      return { client, last: thread.at(-1), count: thread.length };
    })
    .filter((c) => c.last)
    .sort((a, b) => b.last!.at.localeCompare(a.last!.at));
}

// ---------- Leads & partners ----------

export async function getLeads() {
  return [...db.leads].sort(byDateDesc((l) => l.createdAt));
}

export async function getPartners() {
  return [...db.partners].sort((a, b) => a.kind.localeCompare(b.kind) || a.name.localeCompare(b.name));
}

export async function getPartner(id: string | undefined) {
  return db.partners.find((p) => p.id === id);
}

// ---------- Aggregates ----------

export async function getAttention(opts: { clientId?: string } = {}): Promise<(AttentionReason & { vehicle: Vehicle })[]> {
  const vs = db.vehicles.filter((v) => !opts.clientId || v.clientId === opts.clientId);
  return vs
    .flatMap((v) => attentionReasons(v, db.dueItems).map((r) => ({ ...r, vehicle: v })))
    .sort((a, b) => (a.severity === b.severity ? 0 : a.severity === "high" ? -1 : 1));
}

export async function getCollectionSummary(clientId: string) {
  const vs = db.vehicles.filter((v) => v.clientId === clientId);
  const totalValue = vs.reduce((s, v) => s + latestValue(v), 0);
  const totalPaid = vs.reduce((s, v) => s + v.purchasePrice, 0);
  const ready = vs.filter((v) => v.status === "ready").length;
  const due = await getDueItems({ clientId });
  const nextDue = due.find((d) => daysUntil(d.dueDate) >= -30);
  return { count: vs.length, ready, totalValue, totalPaid, nextDue };
}

export async function getBusinessStats() {
  const now = Date.now();
  const weekAhead = new Date(now + 7 * 86_400_000).toISOString();
  const mrr = db.clients.reduce((s, c) => s + c.monthlyFee, 0);
  const valueUnderCare = db.vehicles.reduce((s, v) => s + latestValue(v), 0);
  const openRequests = db.requests.filter((r) => r.status === "new" || r.status === "scheduled" || r.status === "in-progress");
  const checksDueThisWeek = db.vehicles.filter((v) => v.nextCheckAt <= weekAhead).length;
  const newLeads = db.leads.filter((l) => l.stage === "new").length;
  return {
    clients: db.clients.length,
    vehicles: db.vehicles.length,
    mrr,
    arr: mrr * 12,
    valueUnderCare,
    openRequests: openRequests.length,
    newRequests: openRequests.filter((r) => r.status === "new").length,
    checksDueThisWeek,
    newLeads,
  };
}
