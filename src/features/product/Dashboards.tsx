import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/types";

function Block({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="surface overflow-hidden rounded-3xl">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
      >
        <span className="text-[14px] font-semibold">{title}</span>
        <ChevronDown size={18} className={`text-mute transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="border-t border-line px-4 py-4">{children}</div>}
    </div>
  );
}

function Sparkline({ product }: { product: Product }) {
  const pts = product.priceHistory;
  const w = 320;
  const h = 120;
  const min = Math.min(...pts.map((p) => p.price));
  const max = Math.max(...pts.map((p) => p.price));
  const span = Math.max(1, max - min);
  const d = pts
    .map((p, i) => {
      const x = (i / Math.max(1, pts.length - 1)) * w;
      const y = h - 16 - ((p.price - min) / span) * (h - 32);
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  const last = pts[pts.length - 1];
  const minPt = pts.reduce((a, b) => (a.price <= b.price ? a : b), pts[0]!);
  const minX = (minPt.day / 90) * w;
  const minY = h - 16 - ((minPt.price - min) / span) * (h - 32);

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
      <path d={d} fill="none" stroke="var(--accent)" strokeWidth="2.4" />
      <circle cx={minX} cy={minY} r="4" fill="var(--ok)" />
      <circle cx={w} cy={h - 16 - (((last?.price ?? min) - min) / span) * (h - 32)} r="4" fill="var(--accent)" />
      <text x="0" y="12" fontSize="10" fill="var(--mute)">
        −90 дней
      </text>
      <text x={Math.max(0, minX - 20)} y={Math.max(22, minY - 8)} fontSize="10" fill="var(--ok)">
        дно: {formatPrice(minPt.price)}
      </text>
      <text x={w - 90} y="12" fontSize="10" fill="var(--mute)">
        сегодня: {formatPrice(product.price)}
      </text>
    </svg>
  );
}

export function ProductDashboards({ products }: { products: Product[] }) {
  const aura = products.find((p) => p.isAuraChoice) ?? products[0];
  const others = products.filter((p) => p !== aura);
  const diff = useMemo(() => {
    if (!aura) return 0;
    return Math.round(((aura.marketAverage - aura.price) / aura.marketAverage) * 100);
  }, [aura]);

  if (!aura) return null;

  return (
    <div className="space-y-3">
      <Block title="Динамика цены">
        <Sparkline product={aura} />
      </Block>
      <Block title="Средняя цена по рынку">
        <p className="text-[15px] font-semibold">
          {diff >= 0 ? `Сейчас дешевле на ${diff}%` : `Сейчас дороже на ${Math.abs(diff)}%`}
        </p>
        <p className="mt-1 text-[13px] text-mute">
          Средняя за 90 дней: {formatPrice(aura.marketAverage)}. Выбор Aura: {formatPrice(aura.price)}.
        </p>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-bg2">
          <div
            className="h-full rounded-full bg-accent"
            style={{ width: `${Math.min(100, Math.max(8, 50 + diff))}%` }}
          />
        </div>
      </Block>
      <Block title="Проверка надёжности">
        <ul className="space-y-2">
          {aura.reliabilityChecks.map((c) => (
            <li key={c.label} className="flex items-start gap-2 text-[14px]">
              <span className={c.ok ? "text-ok" : "text-bad"}>{c.ok ? "✓" : "!"}</span>
              <span>{c.label}</span>
            </li>
          ))}
        </ul>
      </Block>
      <Block title="Полное сравнение">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-[13px]">
            <thead className="text-mute">
              <tr>
                <th className="pb-2 font-semibold">Критерий</th>
                {products.slice(0, 4).map((p) => (
                  <th key={p.id} className="pb-2 font-semibold">
                    {p.isAuraChoice ? "Выбор Aura" : p.shop}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-line">
                <td className="py-2 text-mute">Цена</td>
                {products.slice(0, 4).map((p) => (
                  <td key={p.id} className="py-2 font-semibold">
                    {formatPrice(p.price)}
                  </td>
                ))}
              </tr>
              <tr className="border-t border-line">
                <td className="py-2 text-mute">Рейтинг</td>
                {products.slice(0, 4).map((p) => (
                  <td key={p.id} className="py-2">
                    {p.rating.toFixed(1)} · {p.reviewsCount}
                  </td>
                ))}
              </tr>
              <tr className="border-t border-line">
                <td className="py-2 text-mute">Доставка</td>
                {products.slice(0, 4).map((p) => (
                  <td key={p.id} className="py-2">
                    {p.delivery}
                  </td>
                ))}
              </tr>
              <tr className="border-t border-line">
                <td className="py-2 text-mute">Где</td>
                {products.slice(0, 4).map((p) => (
                  <td key={p.id} className="py-2">
                    {p.shop}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
        {others.length > 3 && <p className="mt-2 text-[12px] text-mute">Показаны первые варианты — листайте таблицу вбок на телефоне.</p>}
      </Block>
    </div>
  );
}
