import Link from "next/link";
import { ChevronLeft, Lock, MessagesSquare } from "lucide-react";
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
  // On phones: no ?client shows the list; with ?client shows the thread. Desktop always shows both.
  const threadOpen = Boolean(requested);
  const [client, thread] = selectedId ? await Promise.all([getClient(selectedId), getMessages(selectedId)]) : [undefined, []];

  return (
    <>
      <PageHeader
        title="Messages"
        description="One thread per client, shared with their assistants."
      />

      <div className="glass grid rounded-2xl lg:grid-cols-[320px_1fr] lg:overflow-hidden [&>*]:min-w-0">
        <aside className={cn("lg:block lg:border-r lg:border-white/[0.07]", threadOpen ? "hidden" : "block")}>
          {conversations.length ? (
            <ul className="space-y-0.5 p-2 lg:max-h-[70vh] lg:overflow-y-auto">
              {conversations.map(({ client: c, last, count }) => (
                <li key={c.id}>
                  <Link
                    href={`/console/messages?client=${c.id}#reply`}
                    aria-current={c.id === selectedId ? "page" : undefined}
                    className={cn(
                      "block min-h-16 rounded-xl border border-transparent px-3.5 py-3 transition-colors hover:bg-white/[0.04] active:bg-white/[0.06]",
                      c.id === selectedId && "lg:border-white/[0.08] lg:bg-white/[0.045]",
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-medium">{c.name}</p>
                      <span className="shrink-0 text-xs text-subtle">{last ? timeAgo(last.at) : ""}</span>
                    </div>
                    <p className="mt-0.5 line-clamp-2 text-[0.85rem] text-muted md:text-[0.78rem]">
                      {last?.from === "vf" ? "You: " : ""}
                      {last?.body}
                    </p>
                    <p className="mt-1 text-xs text-subtle">{count} messages</p>
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

        <section className={cn("min-h-[60vh] flex-col lg:flex", threadOpen ? "flex" : "hidden")}>
          {client ? (
            <>
              <div className="border-b border-white/[0.07] px-3 pt-1 lg:hidden">
                <Link href="/console/messages" className="inline-flex min-h-11 items-center gap-1 px-1 text-[0.85rem] text-muted hover:text-text">
                  <ChevronLeft className="size-4" /> All conversations
                </Link>
              </div>
              <header className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.07] px-5 py-3.5">
                <div>
                  <Link href={`/console/clients/${client.id}`} className="font-medium decoration-white/30 underline-offset-4 hover:underline">
                    {client.name}
                  </Link>
                  <p className="text-[0.82rem] text-subtle md:text-[0.75rem]">
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
              <ol className="flex-1 space-y-3 p-4 sm:p-5 lg:max-h-[56vh] lg:overflow-y-auto">
                {thread.length ? (
                  thread.map((m, i) => {
                    const showDay = i === 0 || formatDate(thread[i - 1].at) !== formatDate(m.at);
                    return (
                      <li key={m.id}>
                        {showDay ? (
                          <p className="my-4 text-center text-xs text-subtle">
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
                            <p className="text-xs text-subtle">
                              {m.author} · {formatTime(m.at)}
                            </p>
                            <p className="mt-0.5 whitespace-pre-line text-[0.95rem] md:text-sm">{m.body}</p>
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
