import type { Metadata } from "next";
import { Lock, MessageCircle, Phone } from "lucide-react";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/garage/bits";
import { MessageComposer } from "@/components/garage/message-composer";
import { getClient, getMessages, getTeam } from "@/lib/data/queries";
import { formatDayDate, formatTime } from "@/lib/format";
import { requireClient } from "@/lib/session";
import { cn } from "@/lib/utils";
import type { Message } from "@/lib/types";

export const metadata: Metadata = { title: "Messages" };

function dayKey(iso: string) {
  return new Date(iso).toDateString();
}

export default async function MessagesPage() {
  const { clientId } = await requireClient();
  const [client, messages, team] = await Promise.all([getClient(clientId), getMessages(clientId), getTeam()]);

  const senders = [client?.name ?? "Me", ...(client?.contacts.map((c) => `${c.name} (${c.role === "Personal assistant" ? "PA" : c.role})`) ?? [])];

  // Group by day for date separators. Rendered newest-last inside a column-reverse
  // scroller so the thread opens at the latest message without client JS.
  const groups: { day: string; label: string; items: Message[] }[] = [];
  for (const m of messages) {
    const key = dayKey(m.at);
    const last = groups.at(-1);
    if (last && last.day === key) last.items.push(m);
    else groups.push({ day: key, label: formatDayDate(m.at), items: [m] });
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow">Messages</p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">Talk to the team</h1>
        <p className="mt-2 max-w-xl text-muted">One thread, the people who look after your cars. Everything here is kept on record.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="flex flex-col overflow-hidden lg:col-span-2">
          <div className="flex max-h-[min(62vh,640px)] min-h-72 flex-col-reverse overflow-y-auto p-4 sm:p-5">
            {messages.length ? (
              <div className="space-y-6">
                {groups.map((g) => (
                  <div key={g.day} className="space-y-3">
                    <p className="text-center text-[0.68rem] tracking-[0.18em] text-subtle uppercase">{g.label}</p>
                    {g.items.map((m) => {
                      const mine = m.from === "client";
                      return (
                        <div key={m.id} className={cn("flex", mine ? "justify-end" : "justify-start")}>
                          <div className={cn("max-w-[85%] sm:max-w-[75%]", mine ? "items-end text-right" : "items-start")}>
                            <p className="mb-1 px-1 text-[0.7rem] text-subtle">
                              {m.author} · {formatTime(m.at)}
                            </p>
                            <div
                              className={cn(
                                "rounded-2xl px-4 py-2.5 text-left text-sm leading-relaxed",
                                mine ? "rounded-br-md bg-gold-soft text-text ring-1 ring-gold/25" : "rounded-bl-md bg-surface-2 text-text",
                              )}
                            >
                              {m.body}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState icon={MessageCircle} title="No messages yet" body="Say hello. A real person reads every message." className="my-auto border-none" />
            )}
          </div>
          <MessageComposer senders={senders} />
        </Card>

        <aside className="space-y-4">
          <Card className="p-5">
            <p className="eyebrow mb-3">Your team</p>
            <ul className="space-y-3">
              {team.map((t) => (
                <li key={t.id} className="flex items-center gap-3">
                  <span className="grid size-9 place-items-center rounded-full bg-gold-soft font-display text-xs font-semibold text-gold">
                    {t.initials}
                  </span>
                  <span>
                    <span className="block text-sm font-medium">{t.name}</span>
                    <span className="block text-xs text-muted">{t.role}</span>
                  </span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-5 text-sm">
            <p className="eyebrow mb-3">Urgent?</p>
            <a href="tel:+447797738888" className="flex items-center gap-2 font-medium hover:text-gold">
              <Phone className="size-4 text-gold" aria-hidden />
              +44 7797 738888
            </a>
            <p className="mt-2 text-muted">Answered day and night.</p>
            {client ? (
              <p className="mt-3 border-t border-border pt-3 text-xs text-subtle">
                We&apos;ll reply here and by {client.preferences.contactPreference}, as you asked.
              </p>
            ) : null}
          </Card>

          <p className="flex items-start gap-2 px-1 text-xs leading-relaxed text-subtle">
            <Lock className="mt-0.5 size-3.5 shrink-0" aria-hidden />
            {client?.preferences.nda
              ? "Covered by your NDA. Nothing here is shared outside Vehicle Focus."
              : "Private to you, your authorised contacts and the Vehicle Focus team."}
          </p>
        </aside>
      </div>
    </div>
  );
}
