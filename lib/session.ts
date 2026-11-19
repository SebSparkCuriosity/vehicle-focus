import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Persona } from "@/lib/types";

// Demo session: a single cookie naming the persona. Replace with Supabase Auth
// (magic link + MFA for clients, SSO for the team) when going live.

export const SESSION_COOKIE = "vf_persona";

export function encodePersona(p: Persona): string {
  return p.kind === "team" ? `team:${p.memberId}` : `client:${p.clientId}`;
}

export function decodePersona(raw: string | undefined): Persona | null {
  if (!raw) return null;
  const [kind, id] = raw.split(":");
  if (kind === "team" && id) return { kind: "team", memberId: id };
  if (kind === "client" && id) return { kind: "client", clientId: id };
  return null;
}

export async function getPersona(): Promise<Persona | null> {
  const store = await cookies();
  return decodePersona(store.get(SESSION_COOKIE)?.value);
}

/** For pages under /garage. Redirects to the demo sign-in if not a client. */
export async function requireClient(): Promise<{ clientId: string }> {
  const p = await getPersona();
  if (!p || p.kind !== "client") redirect("/login?next=/garage");
  return { clientId: p.clientId };
}

/** For pages under /console. Redirects to the demo sign-in if not team. */
export async function requireTeam(): Promise<{ memberId: string }> {
  const p = await getPersona();
  if (!p || p.kind !== "team") redirect("/login?next=/console");
  return { memberId: p.memberId };
}
