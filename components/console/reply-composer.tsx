"use client";

import { useActionState, useEffect, useRef } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/form";
import { sendMessage, type ActionResult } from "@/lib/actions";

export function ReplyComposer({ clientId, clientName }: { clientId: string; clientName: string }) {
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(sendMessage, null);
  const ref = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) ref.current?.reset();
  }, [state]);

  return (
    <form
      ref={ref}
      id="reply"
      action={action}
      className="sticky bottom-0 z-10 scroll-mt-24 rounded-b-2xl border-t border-white/[0.07] bg-[#0f1012]/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:p-4 lg:static lg:bg-transparent"
    >
      <input type="hidden" name="clientId" value={clientId} />
      <label htmlFor="reply-body" className="sr-only">
        Reply to {clientName}
      </label>
      <Textarea
        id="reply-body"
        name="body"
        rows={2}
        placeholder={`Reply to ${clientName}. They'll see it in The Garage.`}
        className="min-h-16 resize-none lg:min-h-20"
        required
      />
      <div className="mt-2 flex items-center justify-between gap-3">
        <p className="text-xs text-subtle">{state && !state.ok ? <span className="text-danger">{state.error}</span> : "Sent as you, from Vehicle Focus."}</p>
        <Button type="submit" disabled={pending} className="md:h-8 md:px-3.5 md:text-[0.8rem]">
          <Send /> {pending ? "Sending" : "Send"}
        </Button>
      </div>
    </form>
  );
}
