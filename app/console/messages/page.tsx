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
        title="Messages"
        description="One thread per client, shared with their assistants."
      />

      <div className="glass grid overflow-hidden rounded-2xl lg:grid-cols-[320px_1fr] [&>*]:min-w-0">
        <aside className="border-b border-white/[0.07] lg:border-r lg:border-b-0">
          {conversations.length ? (
            <ul className="max-h-72 space-y-0.5 overflow-y-auto p-2 lg:max-h-[70vh]">
              {conversations.map(({ client: c, last, count }) => (
                <li key={c.id}>
                  <Link
                    href={`/console/messages?client=${c.id}`}
                    aria-current={c.id === selectedId ? "page" : undefined}
                    className={cn(
                      "block rounded-xl border border-transparent px-3.5 py-3 transition-colors hover:bg-white/[0.04]",
                      c.id === selectedId && "glass-inset",
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-medium">{c.name}</p>
                      <span className="shrink-0 text-[0.7rem] text-subtle">{last ? timeAgo(last.at) : ""}</span>
                    </div>
                    <p className="mt-0.5 line-clamp-2 text-[0.78rem] text-muted">
                      {last?.from === "vf" ? "You: " : ""}
                      {last?.body}
                    </p>
                    <p className="mt-1 text-[0.7rem] text-subtle">{count} messages</p>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-5">
              <EmptyState icon={MessagesSquare} title="No conversations yet" />
            </div>
          )}
        </aside>

        <section className="flex min-h-[60vh] flex-col">
          {client ? (
            <>
              <header className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.07] px-5 py-3.5">
                <div>
                  <Link href={`/console/clients/${client.id}`} className="font-medium decoration-white/30 underline-offset-4 hover:underline">
                    {client.name}
                  </Link>
                  <p className="text-[0.75rem] text-subtle">
                    Prefers {client.preferences.contactPreference}
                    {client.contacts.length ? ` · ${client.contacts.map((c) => c.name).join(", ")} also on this thread` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {client.preferences.nda ? (
                    <span className="inline-flex items-center gap-1 text-[0.75rem] text-warning">
                      <Lock className="size-3" /> NDA
                    </span>
                  ) : null}
                  <TierBadge tier={client.tier} />
                </div>
              </header>
              <ol className="flex-1 space-y-3 overflow-y-auto p-5 lg:max-h-[56vh]">
                {thread.length ? (
                  thread.map((m, i) => {
                    const showDay = i === 0 || formatDate(thread[i - 1].at) !== formatDate(m.at);
                    return (
                      <li key={m.id}>
                        {showDay ? (
                          <p className="my-4 text-center text-[0.72rem] text-subtle">
                            {formatDate(m.at, { weekday: "long", day: "numeric", month: "long" })}
                          </p>
                        ) : null}
                        <div className={cn("flex", m.from === "vf" ? "justify-end" : "justify-start")}>
                          <div
                            className={cn(
                              "max-w-[85%] rounded-2xl px-3.5 py-2.5 sm:max-w-[70%]",
                              m.from === "vf" ? "rounded-br-md bg-white/[0.09] ring-1 ring-white/[0.12]" : "rounded-bl-md bg-black/25 ring-1 ring-white/[0.06]",
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
