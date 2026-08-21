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
    <div className="space-y-10">
      <div>
        <h2 className="font-display text-[28px] leading-tight md:text-[34px]">{headline}</h2>
        {chips.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {chips.map((c) => (
              <Chip key={c}>{c}</Chip>
            ))}
          </div>
        )}
        <p className="mt-2 text-[14px] text-mute">Не каталог, а несколько живых направлений — можно выбрать любое.</p>
        <p className="mt-1 text-[12px] text-mute">Рекомендации Aura не являются офертой. Цены в демо условные.</p>
      </div>
      {directions.map((d) => {
        const aura = d.products.find((p) => p.isAuraChoice) ?? d.products[0];
        const rest = d.products.filter((p) => p.id !== aura?.id);
        if (!aura) return null;
        return (
          <section key={d.id} className="space-y-4">
            <div>
              <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-mute">{d.title}</p>
              <p className="mt-1 text-[15px] text-mute">{d.subtitle}</p>
            </div>
            <AuraChoice product={aura} />
            {rest.length > 0 && (
              <div className="grid gap-3 sm:grid-cols-2">
                {rest.map((p, i) => (
                  <ProductCard key={p.id} product={p} delay={0.1 + i * 0.08} />
                ))}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
