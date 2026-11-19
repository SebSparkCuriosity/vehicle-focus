"use client";

import { useActionState, useEffect, useRef } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/form";
import { sendMessage, type ActionResult } from "@/lib/actions";

export function MessageComposer({ senders }: { senders: string[] }) {
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(sendMessage, null);
  const formRef = useRef<HTMLFormElement>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);

  // Clear the box after each successful send and keep focus for the next line
  useEffect(() => {
    if (state?.ok && textRef.current) {
      textRef.current.value = "";
      textRef.current.focus();
    }
  }, [state]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="border-t border-border p-3 sm:p-4"
      onKeyDown={(e) => {
        // Cmd/Ctrl + Enter sends
        if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
          e.preventDefault();
          formRef.current?.requestSubmit();
        }
      }}
    >
      <label htmlFor="body" className="sr-only">
        Message
      </label>
      <textarea
        ref={textRef}
        id="body"
        name="body"
        rows={3}
        required
        maxLength={2000}
        placeholder="Write to the team..."
        className="min-h-20 w-full resize-none rounded-md border border-border bg-surface-2 px-3 py-2.5 text-sm text-text placeholder:text-subtle transition-colors focus:border-gold/70 focus:ring-2 focus:ring-gold/20 focus:outline-none"
      />
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        {senders.length > 1 ? (
          <div className="flex items-center gap-2">
            <label htmlFor="author" className="text-xs text-subtle">
              Sending as
            </label>
            <Select id="author" name="author" defaultValue={senders[0]} className="h-8 w-auto py-0 text-xs">
              {senders.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
          </div>
        ) : (
          <input type="hidden" name="author" value={senders[0]} />
        )}
        <div className="ml-auto flex items-center gap-3">
          {state && !state.ok ? (
            <p role="alert" className="text-xs text-danger">
              {state.error}
            </p>
          ) : null}
          <Button type="submit" size="sm" disabled={pending}>
            <Send aria-hidden />
            {pending ? "Sending..." : "Send"}
          </Button>
        </div>
      </div>
    </form>
  );
}
