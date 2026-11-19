"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PrintButton({ label = "Print or save as PDF" }: { label?: string }) {
  return (
    <Button type="button" variant="secondary" onClick={() => window.print()} className="no-print md:h-8 md:px-3.5 md:text-[0.8rem]">
      <Printer /> {label}
    </Button>
  );
}
