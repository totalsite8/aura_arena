import type { ProductKind } from "@/types";

const SILHOUETTE: Record<ProductKind, string> = {
  phone: "M 38 12 h 24 a 6 6 0 0 1 6 6 v 64 a 6 6 0 0 1 -6 6 H 38 a 6 6 0 0 1 -6 -6 V 18 a 6 6 0 0 1 6 -6 z",
  earbuds: "M 28 40 a 12 12 0 1 0 0.1 0 M 72 40 a 12 12 0 1 0 0.1 0 M 40 40 h 20",
  headphones: "M 22 48 a 28 28 0 0 1 56 0 M 20 50 a 10 14 0 0 0 0 28 M 80 50 a 10 14 0 0 1 0 28",
  vacuum: "M 30 70 a 20 10 0 0 0 40 0 M 50 30 v 40 M 42 22 h 16 v 10 h -16 z",
  laptop: "M 22 32 h 56 v 34 H 22 z M 18 68 h 64 l -4 8 H 22 z",
  tv: "M 16 24 h 68 v 40 H 16 z M 40 64 v 10 M 32 78 h 36",
  monitor: "M 18 20 h 64 v 42 H 18 z M 50 62 v 12 M 36 78 h 28",
  coffee: "M 32 28 h 28 v 40 H 32 z M 60 36 h 10 a 8 8 0 0 1 0 20 H 60",
  brush: "M 46 18 v 40 M 38 58 h 16 v 22 H 38 z",
  hair: "M 58 22 l 16 8 M 30 30 h 28 v 40 H 30 z",
  console: "M 24 40 h 52 v 24 H 24 z M 34 52 h 8 M 62 50 a 6 6 0 1 0 0.1 0",
  gpu: "M 18 34 h 64 v 32 H 18 z M 26 42 h 20 v 8 H 26 z",
  book: "M 30 22 h 40 v 56 H 30 z M 50 22 v 56",
  watch: "M 38 18 h 24 v 10 H 38 z M 36 28 h 28 v 36 H 36 z M 38 64 h 24 v 10 H 38 z",
  tool: "M 30 70 l 28 -28 M 62 30 l 10 10",
  baby: "M 40 28 a 10 10 0 1 0 0.1 0 M 32 48 h 36 v 24 H 32 z",
  pet: "M 50 36 a 16 16 0 1 0 0.1 0 M 34 30 a 6 6 0 1 0 0.1 0 M 66 30 a 6 6 0 1 0 0.1 0",
  tire: "M 50 50 a 24 24 0 1 0 0.1 0 M 50 50 a 10 10 0 1 0 0.1 0",
  perfume: "M 42 22 h 16 v 10 H 42 z M 36 32 h 28 v 42 H 36 z",
  kitchen: "M 28 30 h 44 v 40 H 28 z M 40 22 h 20 v 8 H 40 z",
  wear: "M 32 28 l 18 -8 18 8 v 44 H 32 z",
  sport: "M 28 50 a 22 14 0 1 0 0.1 0",
  home: "M 22 48 l 28 -22 28 22 v 30 H 22 z",
  gift: "M 28 40 h 44 v 34 H 28 z M 50 40 v 34 M 28 40 q 22 -22 44 0",
  generic: "M 30 30 h 40 v 40 H 30 z",
};

export function ProductVisual({
  kind,
  hue,
  title,
  className = "",
}: {
  kind: ProductKind;
  hue: number;
  title: string;
  className?: string;
}) {
  const d = SILHOUETTE[kind] ?? SILHOUETTE.generic;
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        background: `radial-gradient(120% 90% at 20% 10%, hsl(${hue} 20% 22%), #0c0e14 62%)`,
      }}
      aria-hidden
    >
      <div
        className="absolute -right-10 top-[-30%] h-40 w-40 rounded-full opacity-40"
        style={{ background: `hsl(${hue} 80% 55%)`, filter: "blur(18px)" }}
      />
      <svg viewBox="0 0 100 100" className="relative h-full w-full p-5 opacity-90">
        <path d={d} fill="none" stroke="rgba(200,240,77,0.85)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="sr-only">{title}</span>
    </div>
  );
}
