import type { Metadata } from "next";
import { Lock, MessageCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { PageTitle, PaneTitle } from "@/components/garage/bits";
import { MessageComposer } from "@/components/garage/message-composer";
import { ScrollToLatest } from "@/components/garage/scroll-to-latest";
import { getClient, getMessages, getTeam } from "@/lib/data/queries";
import { formatDayDate, formatTime } from "@/lib/format";
import { requireClient } from "@/lib/session";
import { cn } from "@/lib/utils";
import type { Message } from "@/lib/types";

export const metadata: Metadata = { title: "Messages" };

function dayKey(iso: string) {
  return new Date(iso).toDateString();
}

function initialsOf(name: string) {
  return name
    .replace(/\(.*\)/, "")
    .replace(/^(Dr|Mr|Mrs|Ms)\s+/, "")
    .trim()
    .split(/\s+/)
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default async function MessagesPage() {
  const { clientId } = await requireClient();
  const [client, messages, team] = await Promise.all([getClient(clientId), getMessages(clientId), getTeam()]);

  const senders = [client?.name ?? "Me", ...(client?.contacts.map((c) => `${c.name} (${c.role === "Personal assistant" ? "PA" : c.role})`) ?? [])];
  const teamInitials = (author: string) => team.find((t) => t.name === author)?.initials ?? initialsOf(author);

  // Group by day for date separators. On larger screens the thread sits in a
  // column-reverse scroller so it opens at the latest message without client JS.
  // On phones the page itself scrolls (like a chat app) and ScrollToLatest jumps
  // to the end, with the composer pinned above the tab bar.
  const groups: { day: string; label: string; items: Message[] }[] = [];
  for (const m of messages) {
    const key = dayKey(m.at);
    const last = groups.at(-1);
    if (last && last.day === key) last.items.push(m);
    else groups.push({ day: key, label: formatDayDate(m.at), items: [m] });
  }

  return (
    <div className="space-y-8 md:space-y-10">
      <PageTitle title="Messages" intro="One thread with the people who look after your cars. Everything here stays on record." />
      <ScrollToLatest targetId="thread-end" />

      <div className="grid gap-6 lg:grid-cols-3 [&>*]:min-w-0">
        <Card className="flex flex-col rounded-[28px] md:overflow-hidden lg:col-span-2">
          <div className="flex min-h-64 flex-col-reverse p-4 sm:p-6 md:max-h-[min(64vh,660px)] md:min-h-80 md:overflow-y-auto">
            {messages.length ? (
              <div className="space-y-7">
                {groups.map((g) => (
                  <div key={g.day} className="space-y-4">
                    <p className="text-center text-xs text-white/55">{g.label}</p>
                    {g.items.map((m) => {
                      const mine = m.from === "client";
                      return (
                        <div key={m.id} className={cn("flex items-end gap-2.5", mine ? "justify-end" : "justify-start")}>
                          {!mine ? (
                            <span
                              className="mb-5 grid size-8 shrink-0 place-items-center rounded-full border border-white/10 bg-black/40 text-xs font-semibold text-white/75"
                              title={m.author}
                            >
                              {teamInitials(m.author)}
                            </span>
                          ) : null}
                          <div className={cn("flex max-w-[84%] min-w-0 flex-col sm:max-w-[72%]", mine ? "items-end" : "items-start")}>
                            <div
                              className={cn(
                                "rounded-[20px] px-4 py-2.5 text-left text-[0.95rem] leading-relaxed [overflow-wrap:anywhere] whitespace-pre-line md:text-[0.92rem]",
                                mine
                                  ? "rounded-br-md border border-white/15 bg-white/[0.12] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]"
                                  : "rounded-bl-md border border-white/[0.07] bg-black/40 text-white/90",
                              )}
                            >
                              {m.body}
                            </div>
                            <p className="mt-1 px-1 text-xs text-white/55">
                              {m.author}, {formatTime(m.at)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
                <div id="thread-end" className="scroll-mb-[calc(15rem+env(safe-area-inset-bottom))] md:scroll-mb-0" aria-hidden />
              </div>
            ) : (
              <div className="my-auto flex flex-col items-center py-10 text-center">
                <MessageCircle className="size-5 text-white/55" aria-hidden />
                <p className="mt-3 font-display text-xl font-normal">No messages yet</p>
                <p className="mt-1.5 text-sm text-white/55">Say hello. A real person reads every message.</p>
              </div>
            )}
          </div>
          <MessageComposer senders={senders} />
        </Card>

        <aside className="space-y-4">
          <Card className="rounded-[22px] p-5">
            <PaneTitle>Your team</PaneTitle>
            <ul className="mt-4 space-y-3.5">
              {team.map((t) => (
                <li key={t.id} className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-full border border-white/10 bg-black/40 text-xs font-semibold text-white/80">
                    {t.initials}
                  </span>
                  <span>
                    <span className="block text-[0.95rem] font-medium md:text-sm">{t.name}</span>
                    <span className="block text-[0.78rem] text-white/50">{t.role}</span>
                  </span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="rounded-[22px] p-5 text-sm">
            <PaneTitle>Urgent?</PaneTitle>
            <a
              href="tel:+447797738888"
              className="mt-3 inline-flex min-h-11 items-center font-display text-2xl font-normal tabular underline decoration-white/20 underline-offset-[6px] hover:decoration-white/60"
            >
              +44 7797 738888
            </a>
            <p className="mt-1 text-white/55">Answered day and night.</p>
            {client ? (
              <p className="mt-3 border-t border-white/[0.08] pt-3 text-[0.78rem] text-white/45">
                We&apos;ll reply here and by {client.preferences.contactPreference}, as you asked.
              </p>
            ) : null}
          </Card>

          <p className="flex items-start gap-2 px-1 text-[0.78rem] leading-relaxed text-white/45">
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
