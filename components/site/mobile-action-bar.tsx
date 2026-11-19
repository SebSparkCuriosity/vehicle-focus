"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone } from "lucide-react";
import { CONTACT } from "@/components/site/content";
import { cn } from "@/lib/utils";

/**
 * Phones and tablets only: Call / Request a call, always within thumb reach.
 * - Appears once the hero (which has its own buttons) has scrolled away.
 * - Hidden on /contact, where the form is the page.
 * - Steps aside while a form field is focused, so it never covers a field,
 *   the on-screen keyboard or a submit button.
 */
export function MobileActionBar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const isField = (el: EventTarget | null) => el instanceof HTMLElement && el.matches("input, textarea, select");
    const onIn = (e: FocusEvent) => isField(e.target) && setTyping(true);
    const onOut = (e: FocusEvent) => isField(e.target) && setTyping(false);
    document.addEventListener("focusin", onIn);
    document.addEventListener("focusout", onOut);
    return () => {
      document.removeEventListener("focusin", onIn);
      document.removeEventListener("focusout", onOut);
    };
  }, []);

  if (pathname === "/contact") return null;
  const visible = scrolled && !typing;

  return (
    <div
      className={cn(
        "fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-30 transition-all duration-300 lg:hidden",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
      )}
      aria-hidden={!visible}
    >
      <div className="glass-dark grid grid-cols-[auto_1fr] gap-2 rounded-full p-1.5">
        <a
          href={CONTACT.phoneHref}
          tabIndex={visible ? 0 : -1}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-5 text-[0.95rem] font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]"
        >
          <Phone className="size-4" aria-hidden />
          Call
        </a>
        <Link
          href="/contact"
          tabIndex={visible ? 0 : -1}
          className="inline-flex h-12 items-center justify-center rounded-full bg-accent px-5 text-[0.95rem] font-medium text-[#08090a] shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]"
        >
          Request a call
        </Link>
      </div>
    </div>
  );
}
