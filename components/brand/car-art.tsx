import { useId } from "react";
import { cn } from "@/lib/utils";
import type { BodyStyle } from "@/lib/types";

// Minimal side-profile illustrations, tinted with the car's paint colour.
// Placeholder until Lawrence's own photography goes in: swap for <Image> per vehicle.

type Shape = {
  body: string;
  glass: string[];
  wheels: [number, number];
  r: number;
  extras?: string[];
};

const SHAPES: Record<BodyStyle, Shape> = {
  coupe: {
    body: "M18,104 C18,96 24,90 40,86 L110,74 C130,70 150,58 175,50 C195,44 225,42 250,46 C275,50 300,60 325,70 L360,78 C372,80 380,88 382,98 L382,106 C382,110 378,112 374,112 L345,112 A28,28 0 0 0 289,112 L131,112 A28,28 0 0 0 75,112 L26,112 C21,112 18,109 18,104 Z",
    glass: ["M152,62 C172,54 196,50 222,50 C240,50 252,52 263,57 L272,67 L158,71 Z"],
    wheels: [103, 317],
    r: 24,
    extras: ["M300,84 L340,86"],
  },
  gt: {
    body: "M16,100 C16,92 22,88 36,86 L120,80 C140,76 160,66 190,56 C210,50 240,48 262,52 C290,58 320,72 345,80 L366,84 C376,86 384,94 384,102 L384,106 C384,110 380,112 376,112 L348,112 A28,28 0 0 0 292,112 L128,112 A28,28 0 0 0 72,112 L24,112 C19,112 16,108 16,100 Z",
    glass: ["M184,62 C202,55 226,53 250,55 C268,57 285,64 300,72 L192,74 Z"],
    wheels: [100, 320],
    r: 24,
  },
  suv: {
    body: "M20,104 L20,82 C20,76 24,72 32,72 L90,70 L120,40 C122,37 125,36 129,36 L330,36 C336,36 340,40 341,46 L346,70 L370,72 C376,72 380,77 380,84 L380,106 C380,110 377,112 373,112 L348,112 A30,30 0 0 0 288,112 L132,112 A30,30 0 0 0 72,112 L26,112 C22,112 20,109 20,104 Z",
    glass: ["M128,44 L218,44 L218,67 L104,69 Z", "M226,44 L330,44 L336,67 L226,67 Z"],
    wheels: [102, 318],
    r: 26,
  },
  roadster: {
    body: "M18,102 C18,94 24,90 40,88 L120,80 C142,77 158,75 172,74 L196,56 L201,57 L184,74 L300,74 C322,74 342,78 360,82 C372,84 380,90 382,98 L382,106 C382,110 378,112 374,112 L345,112 A28,28 0 0 0 289,112 L131,112 A28,28 0 0 0 75,112 L26,112 C21,112 18,109 18,102 Z",
    glass: ["M178,73 L197,59 L200,60 L186,73 Z"],
    wheels: [103, 317],
    r: 24,
    extras: ["M226,74 C226,64 246,64 246,74", "M256,74 C256,64 276,64 276,74"],
  },
  saloon: {
    body: "M18,102 C18,94 24,90 38,88 L105,80 C130,76 150,62 180,52 C200,46 240,45 268,50 C295,55 320,66 345,76 L366,82 C376,85 382,92 382,100 L382,106 C382,110 378,112 374,112 L346,112 A28,28 0 0 0 290,112 L130,112 A28,28 0 0 0 74,112 L26,112 C21,112 18,108 18,102 Z",
    glass: ["M160,61 C180,53 210,50 240,50 C262,51 285,58 305,68 L165,72 Z"],
    wheels: [102, 318],
    r: 24,
    extras: ["M233,51 L232,71"],
  },
};

export function CarArt({
  bodyStyle,
  paint,
  className,
  title,
}: {
  bodyStyle: BodyStyle;
  paint: string;
  className?: string;
  title?: string;
}) {
  const id = useId().replace(/:/g, "");
  const s = SHAPES[bodyStyle];
  return (
    <svg viewBox="0 0 400 140" className={cn("w-full h-auto", className)} role="img" aria-label={title ?? "Vehicle illustration"}>
      <defs>
        <linearGradient id={`paint-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.28" />
          <stop offset="38%" stopColor="#ffffff" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.35" />
        </linearGradient>
        <radialGradient id={`shadow-${id}`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#000" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="200" cy="124" rx="188" ry="10" fill={`url(#shadow-${id})`} />
      <path d={s.body} fill={paint} />
      <path d={s.body} fill={`url(#paint-${id})`} />
      {s.glass.map((g) => (
        <path key={g} d={g} fill="#0c0d10" fillOpacity="0.82" />
      ))}
      {s.extras?.map((e) => (
        <path key={e} d={e} fill="none" stroke="#000" strokeOpacity="0.35" strokeWidth="1.5" strokeLinecap="round" />
      ))}
      {s.wheels.map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy={112} r={s.r} fill="#0a0a0c" />
          <circle cx={cx} cy={112} r={s.r * 0.66} fill="#2a2b30" stroke="#55565c" strokeWidth="1" />
          <circle cx={cx} cy={112} r={s.r * 0.18} fill="#77787e" />
        </g>
      ))}
    </svg>
  );
}
