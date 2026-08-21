import { AuraChoice, ProductCard } from "@/features/product/AuraChoice";
import { ProductDashboards } from "@/features/product/Dashboards";
import { Chip } from "@/components/ui";
import type { Product } from "@/types";

export function ProductResults({
  headline,
  chips,
  products,
}: {
  headline: string;
  chips: string[];
  products: Product[];
}) {
  const aura = products.find((p) => p.isAuraChoice) ?? products[0];
  const rest = products.filter((p) => p.id !== aura?.id);

  if (!aura) {
    return <p className="text-mute">Пока нечего показать. Попробуйте другой запрос.</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-[28px] leading-tight md:text-[34px]">{headline}</h2>
        {chips.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {chips.map((c) => (
              <Chip key={c}>{c}</Chip>
            ))}
          </div>
        )}
        <p className="mt-3 text-[12px] text-mute">Рекомендации Aura не являются офертой. Цены в демо условные.</p>
      </div>
      <AuraChoice product={aura} />
      {rest.length > 0 && (
        <div>
          <h3 className="mb-3 text-[14px] font-semibold text-mute">Ещё варианты</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((p, i) => (
              <ProductCard key={p.id} product={p} delay={0.12 + i * 0.08} />
            ))}
          </div>
        </div>
      )}
      <ProductDashboards products={products} />
    </div>
  );
}
