import "server-only";
import { getClients, getPartners, getTeam, getVehicles } from "@/lib/data/queries";
import type { Client, Partner, TeamMember, Vehicle } from "@/lib/types";

/** One fetch of the reference data most console pages need, as id maps. */
export async function getLookups() {
  const [vehicles, clients, team, partners] = await Promise.all([getVehicles(), getClients(), getTeam(), getPartners()]);
  return {
    vehicles,
    clients,
    team,
    partners,
    vehicle: new Map<string, Vehicle>(vehicles.map((v) => [v.id, v])),
    client: new Map<string, Client>(clients.map((c) => [c.id, c])),
    member: new Map<string, TeamMember>(team.map((t) => [t.id, t])),
    partner: new Map<string, Partner>(partners.map((p) => [p.id, p])),
  };
}

export type Lookups = Awaited<ReturnType<typeof getLookups>>;
