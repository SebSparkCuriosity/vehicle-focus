"use client";

import { useActionState, useEffect, useRef } from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, Textarea } from "@/components/ui/form";
import { sendMessage, type ActionResult } from "@/lib/actions";
import { cn } from "@/lib/utils";

const MAX_TEXTAREA_PX = 148; // about five lines at 16px

function autoGrow(el: HTMLTextAreaElement | null) {
  if (!el) return;
  el.style.height = "auto";
  el.style.height = `${Math.min(el.scrollHeight, MAX_TEXTAREA_PX)}px`;
  el.style.overflowY = el.scrollHeight > MAX_TEXTAREA_PX ? "auto" : "hidden";
}

export function MessageComposer({ senders, className }: { senders: string[]; className?: string }) {
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(sendMessage, null);
  const formRef = useRef<HTMLFormElement>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);

  // Clear the box after each successful send and keep focus for the next line
  useEffect(() => {
    if (state?.ok && textRef.current) {
      textRef.current.value = "";
      autoGrow(textRef.current);
      textRef.current.focus();
      document.getElementById("thread-end")?.scrollIntoView({ block: "end" });
    }
  }, [state]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className={cn(
        "border-t border-white/[0.08] p-3 sm:p-4",
        // Phones: pinned just above the floating tab bar, like a chat app. Opaque enough to read over the thread.
        "max-md:sticky max-md:bottom-[calc(5.25rem+env(safe-area-inset-bottom))] max-md:z-20 max-md:rounded-b-[28px] max-md:bg-[#0f1012]/92",
        className,
      )}
      onKeyDown={(e) => {
        // Cmd/Ctrl + Enter sends on a keyboard; on a phone the send button does
        if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
          e.preventDefault();
          formRef.current?.requestSubmit();
        }
      }}
    >
      {senders.length > 1 ? (
        <div className="mb-2 flex items-center gap-2 px-1">
          <label htmlFor="author" className="shrink-0 text-xs text-white/45">
            Sending as
          </label>
          <Select
            id="author"
            name="author"
            defaultValue={senders[0]}
            className="h-11 min-w-0 flex-1 truncate rounded-full py-0 md:h-9 md:w-auto md:flex-none md:text-[0.82rem]"
          >
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

      <label htmlFor="body" className="sr-only">
        Message
      </label>
      <div className="relative">
        <Textarea
          ref={textRef}
          id="body"
          name="body"
          rows={1}
          required
          maxLength={2000}
          autoComplete="off"
          placeholder="Write to the team..."
          onInput={(e) => autoGrow(e.currentTarget)}
          className="min-h-12 resize-none overflow-hidden rounded-[22px] py-3 pr-14 leading-snug md:min-h-[56px]"
        />
        <Button
          type="submit"
          size="icon"
          disabled={pending}
          aria-label={pending ? "Sending" : "Send"}
          className="absolute right-1.5 bottom-1.5 size-11 md:right-2 md:bottom-2 md:size-10"
        >
          <ArrowUp aria-hidden />
        </Button>
      </div>

      {state && !state.ok ? (
        <p role="alert" className="mt-2 px-1 text-[0.82rem] text-danger">
          {state.error}
        </p>
      ) : (
        <p className="mt-2 hidden px-1 text-right text-xs text-white/35 md:block">Ctrl or Cmd + Enter to send</p>
      )}
    </form>
  );
}
