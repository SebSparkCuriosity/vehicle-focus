import Link from "next/link";
import { Lock, MessagesSquare } from "lucide-react";
import { EmptyState, PageHeader, TierBadge } from "@/components/console/ui";
import { ReplyComposer } from "@/components/console/reply-composer";
import { getConversations, getMessages, getClient } from "@/lib/data/queries";
import { formatDate, formatTime, timeAgo } from "@/lib/format";
import { cn } from "@/lib/utils";

export const metadata = { title: "Messages" };

export default async function MessagesPage({ searchParams }: { searchParams: Promise<{ client?: string }> }) {
  const { client: requested } = await searchParams;
  const conversations = await getConversations();
  const selectedId = requested ?? conversations[0]?.client.id;
  const [client, thread] = selectedId ? await Promise.all([getClient(selectedId), getMessages(selectedId)]) : [undefined, []];

  return (
    <>
      <PageHeader
        eyebrow="Messages"
        title="Client conversations"
        description="One thread per client, shared with their assistants. Everything said about a car stays with the car's record."
      />

      <div className="grid overflow-hidden rounded-xl border border-border bg-surface lg:grid-cols-[320px_1fr]">
        <aside className="border-b border-border lg:border-b-0 lg:border-r">
          {conversations.length ? (
            <ul className="max-h-72 divide-y divide-border overflow-y-auto lg:max-h-[70vh]">
              {conversations.map(({ client: c, last, count }) => (
                <li key={c.id}>
                  <Link
                    href={`/console/messages?client=${c.id}`}
                    aria-current={c.id === selectedId ? "page" : undefined}
                    className={cn("block px-4 py-3 transition-colors hover:bg-surface-2", c.id === selectedId && "bg-surface-2")}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-medium">{c.name}</p>
                      <span className="shrink-0 text-[0.7rem] text-subtle">{last ? timeAgo(last.at) : ""}</span>
                    </div>
                    <p className="mt-0.5 line-clamp-2 text-xs text-muted">
                      {last?.from === "vf" ? "You: " : ""}
                      {last?.body}
                    </p>
                    <p className="mt-1 text-[0.7rem] text-subtle">{count} messages</p>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4">
              <EmptyState icon={MessagesSquare} title="No conversations yet" />
            </div>
          )}
        </aside>

        <section className="flex min-h-[60vh] flex-col">
          {client ? (
            <>
              <header className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3">
                <div>
                  <Link href={`/console/clients/${client.id}`} className="font-medium hover:text-gold">
                    {client.name}
                  </Link>
                  <p className="text-xs text-subtle">
                    Prefers {client.preferences.contactPreference}
                    {client.contacts.length ? ` · ${client.contacts.map((c) => c.name).join(", ")} also on this thread` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {client.preferences.nda ? (
                    <span className="inline-flex items-center gap-1 text-xs text-warning">
                      <Lock className="size-3" /> NDA
                    </span>
                  ) : null}
                  <TierBadge tier={client.tier} />
                </div>
              </header>
              <ol className="flex-1 space-y-3 overflow-y-auto p-4 lg:max-h-[56vh]">
                {thread.length ? (
                  thread.map((m, i) => {
                    const showDay = i === 0 || formatDate(thread[i - 1].at) !== formatDate(m.at);
                    return (
                      <li key={m.id}>
                        {showDay ? (
                          <p className="my-3 text-center text-[0.7rem] uppercase tracking-wider text-subtle">
                            {formatDate(m.at, { weekday: "long", day: "numeric", month: "long" })}
                          </p>
                        ) : null}
                        <div className={cn("flex", m.from === "vf" ? "justify-end" : "justify-start")}>
                          <div
                            className={cn(
                              "max-w-[85%] rounded-2xl px-3.5 py-2.5 sm:max-w-[70%]",
                              m.from === "vf" ? "rounded-br-sm bg-gold-soft ring-1 ring-gold/20" : "rounded-bl-sm bg-surface-2 ring-1 ring-border",
                            )}
                          >
                            <p className="text-[0.7rem] text-subtle">
                              {m.author} · {formatTime(m.at)}
                            </p>
                            <p className="mt-0.5 whitespace-pre-line text-sm">{m.body}</p>
                          </div>
                        </div>
                      </li>
                    );
                  })
                ) : (
                  <EmptyState icon={MessagesSquare} title="No messages yet" description="Start the conversation below." />
                )}
              </ol>
              <ReplyComposer key={client.id} clientId={client.id} clientName={client.firstName} />
            </>
          ) : (
            <div className="grid flex-1 place-items-center p-6">
              <EmptyState icon={MessagesSquare} title="Choose a conversation" />
            </div>
          )}
        </section>
      </div>
    </>
  );
}
