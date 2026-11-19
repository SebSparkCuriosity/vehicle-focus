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
    <form ref={ref} action={action} className="border-t border-border p-3">
      <input type="hidden" name="clientId" value={clientId} />
      <label htmlFor="reply-body" className="sr-only">
        Reply to {clientName}
      </label>
      <Textarea
        id="reply-body"
        name="body"
        rows={3}
        placeholder={`Reply to ${clientName}. They'll see it in The Garage.`}
        className="min-h-20 resize-none"
        required
      />
      <div className="mt-2 flex items-center justify-between gap-3">
        <p className="text-xs text-subtle">{state && !state.ok ? <span className="text-danger">{state.error}</span> : "Sent as you, from Vehicle Focus."}</p>
        <Button type="submit" size="sm" disabled={pending}>
          <Send /> {pending ? "Sending" : "Send"}
        </Button>
      </div>
    </form>
  );
}
