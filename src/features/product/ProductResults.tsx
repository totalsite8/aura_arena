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
  const cheaper = [...products].sort((a, b) => a.price - b.price)[0];

  if (!aura) {
    return <p className="text-mute">Пока нечего показать. Попробуйте другой запрос.</p>;
  }

  return (
    <div className="bento">
      <div className="tile col-span-12 px-5 py-4 md:col-span-12">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-mute">Результат</p>
        <h2 className="font-display mt-1 text-[28px] leading-[0.95] md:text-[34px]">{headline}</h2>
        {chips.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {chips.map((c) => (
              <Chip key={c}>{c}</Chip>
            ))}
          </div>
        )}
        <p className="mt-2 text-[11px] text-mute">Рекомендации Aura не являются офертой. Цены в демо условные.</p>
      </div>

      <div className="col-span-12 lg:col-span-8">
        <AuraChoice product={aura} cheaper={cheaper} />
      </div>
      <div className="col-span-12 grid grid-cols-2 gap-2.5 lg:col-span-4 lg:grid-cols-1">
        {rest.slice(0, 2).map((p, i) => (
          <ProductCard key={p.id} product={p} delay={0.08 + i * 0.06} />
        ))}
      </div>
      {rest.slice(2).map((p, i) => (
        <div key={p.id} className="col-span-12 sm:col-span-6 lg:col-span-4">
          <ProductCard product={p} delay={0.16 + i * 0.06} />
        </div>
      ))}
      <ProductDashboards products={products} />
    </div>
  );
}
