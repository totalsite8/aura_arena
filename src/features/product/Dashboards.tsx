import { useMemo } from "react";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/types";

function Sparkline({ product }: { product: Product }) {
  const pts = product.priceHistory;
  const w = 320;
  const h = 92;
  const min = Math.min(...pts.map((p) => p.price));
  const max = Math.max(...pts.map((p) => p.price));
  const span = Math.max(1, max - min);
  const d = pts
    .map((p, i) => {
      const x = (i / Math.max(1, pts.length - 1)) * w;
      const y = h - 12 - ((p.price - min) / span) * (h - 24);
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  const last = pts[pts.length - 1];
  const minPt = pts.reduce((a, b) => (a.price <= b.price ? a : b), pts[0]!);
  const minX = (minPt.day / 90) * w;
  const minY = h - 12 - ((minPt.price - min) / span) * (h - 24);

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
      <path d={d} fill="none" stroke="var(--accent)" strokeWidth="2.2" />
      <circle cx={minX} cy={minY} r="3.5" fill="var(--ok)" />
      <circle cx={w} cy={h - 12 - (((last?.price ?? min) - min) / span) * (h - 24)} r="3.5" fill="var(--accent2)" />
    </svg>
  );
}

export function ProductDashboards({ products }: { products: Product[] }) {
  const aura = products.find((p) => p.isAuraChoice) ?? products[0];
  const cheapest = [...products].sort((a, b) => a.price - b.price)[0];
  const diff = useMemo(() => {
    if (!aura) return 0;
    return Math.round(((aura.marketAverage - aura.price) / aura.marketAverage) * 100);
  }, [aura]);

  if (!aura) return null;

  return (
    <>
      <div className="tile col-span-12 p-4 md:col-span-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-mute">Динамика цены</p>
        <Sparkline product={aura} />
        <p className="mt-1 text-[12px] text-mute">
          дно {formatPrice(Math.min(...aura.priceHistory.map((p) => p.price)))} · сегодня {formatPrice(aura.price)}
        </p>
      </div>
      <div className="tile col-span-12 p-4 md:col-span-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-mute">Средняя по рынку</p>
        <p className="font-display mt-2 text-[28px] leading-none">
          {diff >= 0 ? `−${diff}%` : `+${Math.abs(diff)}%`}
        </p>
        <p className="mt-2 text-[12px] text-mute">
          {diff >= 0 ? "Сейчас дешевле средней" : "Сейчас дороже средней"} · средняя {formatPrice(aura.marketAverage)}
        </p>
        {cheapest && cheapest.id !== aura.id && (
          <p className="mt-2 text-[12px] text-mute">
            Самый дешёвый: {formatPrice(cheapest.price)} ({cheapest.shop})
          </p>
        )}
      </div>
      <div className="tile col-span-12 p-4 md:col-span-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-mute">Проверка надёжности</p>
        <ul className="mt-2 space-y-1.5 text-[12px]">
          {aura.reliabilityChecks.map((c) => (
            <li key={c.label} className="flex gap-2">
              <span className={c.ok ? "text-ok" : "text-bad"}>{c.ok ? "●" : "○"}</span>
              <span>{c.label}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="tile col-span-12 overflow-x-auto p-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-mute">Полное сравнение</p>
        <table className="mt-2 w-full min-w-[560px] text-left text-[12px]">
          <thead className="text-mute">
            <tr>
              <th className="pb-2 font-medium">Критерий</th>
              {products.slice(0, 5).map((p) => (
                <th key={p.id} className="pb-2 font-medium">
                  {p.isAuraChoice ? "Выбор Aura" : p.shop}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ["Цена", (p: Product) => formatPrice(p.price)],
              ["Магазин", (p: Product) => p.shop],
              ["Надёжность", (p: Product) => (p.reliable ? "выше" : "ниже")],
              ["Рейтинг", (p: Product) => p.rating.toFixed(1)],
              ["Доставка", (p: Product) => p.delivery],
            ].map(([label, fn]) => (
              <tr key={String(label)} className="border-t border-line">
                <td className="py-2 text-mute">{label as string}</td>
                {products.slice(0, 5).map((p) => (
                  <td key={p.id} className="py-2 font-medium">
                    {(fn as (p: Product) => string)(p)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
