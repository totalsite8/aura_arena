import { AuraChoice, ProductCard } from "@/features/product/AuraChoice";
import { ProductDashboards } from "@/features/product/Dashboards";
import type { Product } from "@/types";

export function ProductResults({
  products,
}: {
  headline?: string;
  chips?: string[];
  products: Product[];
}) {
  const aura = products.find((p) => p.isAuraChoice) ?? products[0];
  const rest = products.filter((p) => p.id !== aura?.id);
  const cheaper = [...products].sort((a, b) => a.price - b.price)[0];

  if (!aura) {
    return <p className="text-mute">Пока нечего показать. Попробуйте другой запрос.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      <AuraChoice product={aura} cheaper={cheaper} />
      <div className="bento">
        <ProductDashboards products={products} />
        {rest.map((p, i) => (
          <div key={p.id} className="col-span-12 sm:col-span-6 lg:col-span-3">
            <ProductCard product={p} delay={0.08 + i * 0.06} />
          </div>
        ))}
      </div>
      <p className="px-1 text-[11px] text-mute">Рекомендации Aura не являются офертой. Цены в демо условные.</p>
    </div>
  );
}
