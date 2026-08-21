import { useMemo, useState } from "react";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/types";

function priceMood(product: Product): { title: string; text: string } {
  const min = Math.min(...product.priceHistory.map((p) => p.price));
  const avg = product.marketAverage;
  const nearFloor = product.price <= min * 1.06;
  const belowAvg = product.price <= avg;
  if (nearFloor) {
    return { title: "Да, сейчас удачно", text: "Цена рядом с минимумом за три месяца. Можно брать, если товар нужен." };
  }
  if (belowAvg) {
    return { title: "Нормально", text: `Средняя была ${formatPrice(avg)}. Сейчас не разгон.` };
  }
  return { title: "Сейчас дороже обычного", text: `Средняя ${formatPrice(avg)}. Если не горит — можно подождать.` };
}

function Spark({ product }: { product: Product }) {
  const pts = product.priceHistory;
  const w = 280;
  const h = 72;
  const min = Math.min(...pts.map((p) => p.price));
  const max = Math.max(...pts.map((p) => p.price));
  const span = Math.max(1, max - min);
  const d = pts
    .map((p, i) => {
      const x = (i / Math.max(1, pts.length - 1)) * w;
      const y = h - 8 - ((p.price - min) / span) * (h - 16);
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="mt-3 w-full">
      <path d={d} fill="none" stroke="var(--gold)" strokeWidth="2" />
    </svg>
  );
}

export function ProductDashboards({ products }: { products: Product[] }) {
  const [more, setMore] = useState(false);
  const aura = products.find((p) => p.isAuraChoice) ?? products[0];
  const cheapest = [...products].sort((a, b) => a.price - b.price)[0];
  const mood = useMemo(() => (aura ? priceMood(aura) : null), [aura]);

  if (!aura || !mood) return null;
  const extra = cheapest && cheapest.price < aura.price ? aura.price - cheapest.price : 0;
  const calm = aura.reliabilityChecks.filter((c) => c.ok).length;
  const total = aura.reliabilityChecks.length;

  return (
    <>
      <article className="tile col-span-12 p-5 md:col-span-4">
        <p className="text-[12px] text-mute">Сейчас хорошая цена?</p>
        <h3 className="font-display mt-2 text-[28px] leading-[0.95]">{mood.title}</h3>
        <p className="mt-2 text-[13px] text-mute">{mood.text}</p>
        <Spark product={aura} />
        <p className="mt-1 text-[11px] text-mute">три месяца · сегодня {formatPrice(aura.price)}</p>
      </article>

      <article className="tile col-span-12 p-5 md:col-span-4">
        <p className="text-[12px] text-mute">Спокойно ли брать?</p>
        <h3 className="font-display mt-2 text-[28px] leading-[0.95]">
          {aura.reliable ? "Да" : "С оговоркой"}
        </h3>
        <p className="mt-2 text-[13px] text-mute">
          {aura.reliable
            ? `${aura.shop} — магазин надёжнее. Гарантия ${aura.warranty.toLowerCase()}.`
            : "Магазин слабее. Если берёте — проверьте продавца."}
        </p>
        <div className="mt-4 flex gap-1.5">
          {Array.from({ length: total }).map((_, i) => (
            <span key={i} className={`h-2 flex-1 rounded-full ${i < calm ? "bg-ok" : "bg-line"}`} />
          ))}
        </div>
        <p className="mt-2 text-[11px] text-mute">
          {calm} из {total} спокойных пунктов
        </p>
      </article>

      <article className="tile col-span-12 p-5 md:col-span-4">
        <p className="text-[12px] text-mute">Почему не самый дешёвый?</p>
        {extra > 0 && cheapest ? (
          <>
            <h3 className="font-display mt-2 text-[28px] leading-[0.95]">+{formatPrice(extra)}</h3>
            <p className="mt-2 text-[13px] text-mute">
              У {cheapest.shop} дешевле. Там {cheapest.reliable ? "тоже можно" : "выше риск серого ввоза"}. Цену выбора не
              уменьшаю — баллы сверху, отдельно.
            </p>
          </>
        ) : (
          <>
            <h3 className="font-display mt-2 text-[28px] leading-[0.95]">Он и так лучший</h3>
            <p className="mt-2 text-[13px] text-mute">И по цене, и по спокойствию совпало.</p>
          </>
        )}
      </article>

      <article className="tile col-span-12 p-5">
        <p className="text-[12px] text-mute">Что будет после покупки</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <div>
            <p className="font-display text-[22px] leading-none">{aura.delivery}</p>
            <p className="mt-1 text-[12px] text-mute">доставка</p>
          </div>
          <div>
            <p className="font-display text-[22px] leading-none">{aura.warranty}</p>
            <p className="mt-1 text-[12px] text-mute">гарантия</p>
          </div>
          <div>
            <p className="font-display text-[22px] leading-none">+{aura.points.toLocaleString("ru-RU")}</p>
            <p className="mt-1 text-[12px] text-mute">баллов Aura, если купите здесь</p>
          </div>
        </div>
      </article>

      <div className="col-span-12">
        <button
          type="button"
          onClick={() => setMore((v) => !v)}
          className="text-[13px] font-semibold text-mute underline-offset-4 hover:underline"
        >
          {more ? "Скрыть полное сравнение" : "Сравнить все варианты"}
        </button>
        {more && (
          <div className="tile mt-3 overflow-x-auto p-4">
            <table className="w-full min-w-[560px] text-left text-[13px]">
              <thead className="text-mute">
                <tr>
                  <th className="pb-2 font-medium"> </th>
                  {products.map((p) => (
                    <th key={p.id} className="pb-2 font-medium">
                      {p.isAuraChoice ? "Выбор Aura" : p.shop}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-line">
                  <td className="py-2 text-mute">Цена</td>
                  {products.map((p) => (
                    <td key={p.id} className="py-2 font-semibold">
                      {formatPrice(p.price)}
                    </td>
                  ))}
                </tr>
                <tr className="border-t border-line">
                  <td className="py-2 text-mute">Спокойствие</td>
                  {products.map((p) => (
                    <td key={p.id} className="py-2">
                      {p.reliable ? "выше" : "ниже"}
                    </td>
                  ))}
                </tr>
                <tr className="border-t border-line">
                  <td className="py-2 text-mute">Доставка</td>
                  {products.map((p) => (
                    <td key={p.id} className="py-2">
                      {p.delivery}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
