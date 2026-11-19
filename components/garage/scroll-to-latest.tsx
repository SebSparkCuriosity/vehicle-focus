"use client";

import { useEffect } from "react";

/**
 * On phones the thread scrolls with the page (no inner scroller), so open it at the
 * latest message. On larger screens the thread's own column-reverse scroller already
 * starts at the bottom, so this does nothing there.
 */
export function ScrollToLatest({ targetId }: { targetId: string }) {
  useEffect(() => {
    if (!window.matchMedia("(max-width: 767px)").matches) return;
    document.getElementById(targetId)?.scrollIntoView({ block: "end" });
  }, [targetId]);
  return null;
}
