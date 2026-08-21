import { AuraChoice, ProductCard } from "@/features/product/AuraChoice";
import { Chip } from "@/components/ui";
import type { GiftDirection } from "@/types";

export function GiftResults({
  headline,
  chips,
  directions,
}: {
  headline: string;
  chips: string[];
  directions: GiftDirection[];
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="tile px-5 py-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-mute">Подборка</p>
        <h2 className="font-display mt-1 text-[28px] leading-[0.95] md:text-[34px]">{headline}</h2>
        {chips.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {chips.map((c) => (
              <Chip key={c}>{c}</Chip>
            ))}
          </div>
        )}
        <p className="mt-2 text-[13px] text-mute">Несколько направлений — всё на одном экране.</p>
      </div>
      {directions.map((d) => {
        const aura = d.products.find((p) => p.isAuraChoice) ?? d.products[0];
        const rest = d.products.filter((p) => p.id !== aura?.id);
        const cheaper = [...d.products].sort((a, b) => a.price - b.price)[0];
        if (!aura) return null;
        return (
          <div key={d.id} className="bento">
            <div className="tile col-span-12 px-5 py-4 md:col-span-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-mute">{d.title}</p>
              <p className="mt-2 text-[14px] text-mute">{d.subtitle}</p>
            </div>
            <div className="col-span-12 md:col-span-9">
              <AuraChoice product={aura} cheaper={cheaper} />
            </div>
            {rest.map((p) => (
              <div key={p.id} className="col-span-12 sm:col-span-6">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
