"use client";

import { useActionState, useEffect, useRef } from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, Textarea } from "@/components/ui/form";
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
      className="border-t border-white/[0.08] p-3 sm:p-4"
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
      <div className="relative">
        <Textarea
          ref={textRef}
          id="body"
          name="body"
          rows={2}
          required
          maxLength={2000}
          placeholder="Write to the team..."
          className="min-h-[56px] resize-none rounded-[20px] pr-14"
        />
        <Button
          type="submit"
          size="icon"
          disabled={pending}
          aria-label={pending ? "Sending" : "Send"}
          className="absolute right-2 bottom-2 size-10"
        >
          <ArrowUp aria-hidden />
        </Button>
      </div>
      <div className="mt-2.5 flex flex-wrap items-center justify-between gap-3 px-1">
        {senders.length > 1 ? (
          <div className="flex items-center gap-2">
            <label htmlFor="author" className="text-[0.75rem] text-white/45">
              Sending as
            </label>
            <Select id="author" name="author" defaultValue={senders[0]} className="h-9 w-auto rounded-full py-0 text-[0.78rem]">
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
        {state && !state.ok ? (
          <p role="alert" className="text-[0.78rem] text-danger">
            {state.error}
          </p>
        ) : (
          <p className="ml-auto hidden text-xs text-white/35 sm:block">Ctrl or Cmd + Enter to send</p>
        )}
      </div>
    </form>
  );
}
