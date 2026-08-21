import { rng } from "@/lib/hash";
import { rubToPoints } from "@/lib/format";
import type { PricePoint, Product, ProductKind, ReliabilityCheck } from "@/types";

export const SHOPS = ["Ozon", "Яндекс Маркет", "DNS", "М.Видео", "Wildberries"] as const;

export interface ProductSeed {
  title: string;
  brand: string;
  category: string;
  kind: ProductKind;
  price: number;
  features: string[];
  hue: number;
  delivery?: string;
  warranty?: string;
}

export function makeHistory(endPrice: number, seed: string): PricePoint[] {
  const rand = rng(`h:${seed}`);
  const out: PricePoint[] = [];
  const dipAt = 48 + Math.floor(rand() * 28);
  const floor = endPrice * (0.84 + rand() * 0.06);
  let p = endPrice * (1.1 + rand() * 0.08);
  for (let d = 0; d <= 90; d++) {
    const dipW = Math.exp(-((d - dipAt) ** 2) / 220);
    const drift = endPrice * (1.12 - (d / 90) * 0.12);
    const target = drift * (1 - dipW) + floor * dipW;
    p = p * 0.72 + target * 0.28 + (rand() - 0.5) * endPrice * 0.012;
    out.push({ day: d, price: Math.max(1, Math.round(p)) });
  }
  const last = out[out.length - 1];
  if (last) last.price = endPrice;
  return out;
}

export function defaultChecks(reliable: boolean, price: number, avg: number): ReliabilityCheck[] {
  const cheaper = price <= avg;
  return [
    { ok: cheaper, label: cheaper ? "Цена ниже средней за 90 дней" : "Цена выше средней — смотрим не только цифру" },
    { ok: reliable, label: reliable ? "Магазин надёжнее" : "Магазин слабее по отзывам" },
    { ok: true, label: "Много подтверждённых покупок" },
    { ok: reliable, label: reliable ? "Низкий риск серого импорта" : "Есть риск серого импорта — лучше уточнить" },
    { ok: true, label: "Доставка указана" },
    { ok: reliable, label: reliable ? "Официальная гарантия" : "Гарантию лучше проверить" },
  ];
}

export function buildProduct(
  seed: ProductSeed,
  opts: {
    id: string;
    shop: string;
    price?: number;
    isAuraChoice?: boolean;
    rating?: number;
    reviewsCount?: number;
    why?: string[];
    checks?: ReliabilityCheck[];
    oldPrice?: number;
    points?: number;
    reliable?: boolean;
  },
): Product {
  const price = opts.price ?? seed.price;
  const marketAverage = Math.round(seed.price * 1.04);
  const points = opts.points ?? rubToPoints(Math.round(price * 0.04));
  const reliable = opts.reliable ?? Boolean(opts.isAuraChoice);
  return {
    id: opts.id,
    title: seed.title,
    brand: seed.brand,
    category: seed.category,
    kind: seed.kind,
    hue: seed.hue,
    price,
    oldPrice: opts.oldPrice,
    rating: opts.rating ?? 4.7,
    reviewsCount: opts.reviewsCount ?? 1240,
    delivery: seed.delivery ?? "завтра — послезавтра",
    warranty: seed.warranty ?? "1 год",
    points,
    features: seed.features,
    whySelected: opts.why ?? [
      "Магазин надёжнее",
      "Официальная гарантия",
      "Мало жалоб на брак",
      "Если купите здесь — баллы Aura",
    ],
    priceHistory: makeHistory(price, opts.id),
    marketAverage,
    reliabilityChecks: opts.checks ?? defaultChecks(reliable, price, marketAverage),
    isAuraChoice: Boolean(opts.isAuraChoice),
    shop: opts.shop,
    reliable,
  };
}

export function offersFromSeed(seed: ProductSeed, key: string, count = 5): Product[] {
  const layout: { delta: number; shop: string; aura: boolean; reliable: boolean }[] = [
    { delta: 0.045, shop: "Яндекс Маркет", aura: true, reliable: true },
    { delta: -0.08, shop: "Ozon", aura: false, reliable: false },
    { delta: 0.01, shop: "DNS", aura: false, reliable: true },
    { delta: 0.11, shop: "М.Видео", aura: false, reliable: true },
    { delta: -0.04, shop: "Wildberries", aura: false, reliable: false },
  ];
  const products: Product[] = [];
  for (let i = 0; i < count; i++) {
    const row = layout[i] ?? { delta: 0.08, shop: "Ozon", aura: false, reliable: false };
    const price = Math.round(seed.price * (1 + row.delta));
    products.push(
      buildProduct(seed, {
        id: `${key}-${i}`,
        shop: row.shop,
        price,
        isAuraChoice: row.aura,
        reliable: row.reliable,
        rating: row.reliable ? 4.8 : 4.4,
        reviewsCount: row.reliable ? 3200 : 410,
        why: row.aura
          ? [
              "Магазин надёжнее",
              "Официальная гарантия",
              "Мало жалоб на брак",
              "Есть дешевле — там выше риск серого ввоза",
              "Если купите здесь — получите баллы Aura",
            ]
          : row.reliable
            ? ["Нормальный запасной вариант", "Магазин знакомый"]
            : ["Цена ниже", "Стоит проверить продавца и комплектацию"],
        checks: defaultChecks(row.reliable, price, Math.round(seed.price * 1.04)),
      }),
    );
  }
  return products;
}
