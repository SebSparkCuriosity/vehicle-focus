import Image from "next/image";
import { cn } from "@/lib/utils";
import type { BodyStyle, Vehicle } from "@/lib/types";

// Car imagery. A real photo when we have one; otherwise a paint finish: the
// car's colour rendered like a close-up of lacquer under studio light. Never a
// cartoon of a car.

function clamp(n: number) {
  return Math.max(0, Math.min(255, Math.round(n)));
}

function shade(hex: string, amount: number): string {
  // amount -1..1, negative darkens, positive lightens
  const h = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  const t = amount < 0 ? 0 : 255;
  const p = Math.abs(amount);
  return `rgb(${clamp(r + (t - r) * p)}, ${clamp(g + (t - g) * p)}, ${clamp(b + (t - b) * p)})`;
}

/** Paint finish panel. Fills its container; give the parent a size or aspect ratio. */
export function PaintFinish({ paint, className, label }: { paint: string; className?: string; label?: string }) {
  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={{
        background: [
          // soft-box reflection: a long diagonal highlight, like a studio light on a bonnet
          "linear-gradient(115deg, rgba(255,255,255,0) 30%, rgba(255,255,255,0.22) 44%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0) 58%)",
          // secondary reflection lower down
          "linear-gradient(115deg, rgba(255,255,255,0) 62%, rgba(255,255,255,0.08) 70%, rgba(255,255,255,0) 76%)",
          // body colour, lit top-left, falling into shadow bottom-right
          `radial-gradient(130% 120% at 20% 10%, ${shade(paint, 0.28)} 0%, ${paint} 38%, ${shade(paint, -0.55)} 100%)`,
        ].join(","),
      }}
      role={label ? "img" : undefined}
      aria-label={label}
    >
      {/* metallic flake: fine grain at low opacity */}
      <div
        className="absolute inset-0 opacity-[0.18] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='f'><feTurbulence type='fractalNoise' baseFrequency='1.6' numOctaves='1' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23f)'/></svg>\")",
        }}
        aria-hidden
      />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/45 to-transparent" aria-hidden />
    </div>
  );
}

/**
 * The image for a vehicle: photo if available, paint finish otherwise.
 * Fills its container (position: relative is applied).
 */
export function CarMedia({
  vehicle,
  className,
  sizes = "(min-width: 1024px) 33vw, 100vw",
  priority = false,
}: {
  vehicle: Pick<Vehicle, "make" | "model" | "paintHex" | "image" | "imagePosition" | "colour">;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const label = `${vehicle.make} ${vehicle.model} in ${vehicle.colour}`;
  if (vehicle.image) {
    return (
      <div className={cn("relative overflow-hidden", className)}>
        <Image
          src={vehicle.image}
          alt={label}
          fill
          sizes={sizes}
          preload={priority}
          className="object-cover"
          style={{ objectPosition: vehicle.imagePosition ?? "50% 50%" }}
        />
      </div>
    );
  }
  return <PaintFinish paint={vehicle.paintHex} className={className} label={label} />;
}

/**
 * Backwards-compatible wrapper for older call sites that passed bodyStyle and paint.
 * Renders a paint finish at the old 400x140 proportion. Prefer CarMedia.
 */
export function CarArt({ paint, className, title }: { bodyStyle?: BodyStyle; paint: string; className?: string; title?: string }) {
  return <PaintFinish paint={paint} label={title} className={cn("aspect-[400/140] w-full rounded-lg", className)} />;
}
