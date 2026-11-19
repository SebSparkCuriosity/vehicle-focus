import "server-only";
import * as seed from "@/lib/data/seed";
import type {
  Client,
  DueItem,
  HistoryEvent,
  Job,
  Lead,
  Message,
  Partner,
  ServiceRequest,
  TeamMember,
  Vehicle,
  VehicleDocument,
} from "@/lib/types";

/**
 * In-memory demo store.
 *
 * Lives on globalThis so it survives hot reloads in dev and persists for the
 * life of a `next start` process. Swap this module for Supabase queries in
 * production: every table here maps 1:1 to supabase/migrations/0001_init.sql.
 */
export interface Store {
  team: TeamMember[];
  clients: Client[];
  vehicles: Vehicle[];
  dueItems: DueItem[];
  history: HistoryEvent[];
  documents: VehicleDocument[];
  requests: ServiceRequest[];
  jobs: Job[];
  messages: Message[];
  leads: Lead[];
  partners: Partner[];
}

function createStore(): Store {
  // structuredClone so mutations never touch the seed module's arrays
  return structuredClone({
    team: seed.team,
    clients: seed.clients,
    vehicles: seed.vehicles,
    dueItems: seed.dueItems,
    history: seed.history,
    documents: seed.documents,
    requests: seed.requests,
    jobs: seed.jobs,
    messages: seed.messages,
    leads: seed.leads,
    partners: seed.partners,
  });
}

const globalForStore = globalThis as unknown as { __vfStore?: Store };

export const db: Store = globalForStore.__vfStore ?? (globalForStore.__vfStore = createStore());

export function newId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}
