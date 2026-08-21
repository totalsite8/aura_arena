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

export function defaultChecks(seed: string, price: number, avg: number): ReliabilityCheck[] {
  const rand = rng(`c:${seed}`);
  const cheaper = price <= avg;
  return [
    { ok: cheaper, label: cheaper ? "Цена ниже средней за 90 дней" : "Цена чуть выше средней за 90 дней" },
    { ok: true, label: "Продавец с высоким рейтингом" },
    { ok: true, label: "Много подтверждённых покупок" },
    { ok: rand() > 0.18, label: rand() > 0.18 ? "Низкий риск серого импорта" : "Есть риск серого импорта — лучше уточнить" },
    { ok: true, label: "Быстрая доставка" },
    { ok: rand() > 0.1, label: "Гарантия указана" },
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
  },
): Product {
  const price = opts.price ?? seed.price;
  const marketAverage = Math.round(seed.price * 1.04);
  const points = opts.points ?? rubToPoints(Math.round(price * 0.04));
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
      "Хорошая цена относительно рынка",
      "Высокий рейтинг",
      "Быстрая доставка",
      "Официальная гарантия",
    ],
    priceHistory: makeHistory(price, opts.id),
    marketAverage,
    reliabilityChecks: opts.checks ?? defaultChecks(opts.id, price, marketAverage),
    isAuraChoice: Boolean(opts.isAuraChoice),
    shop: opts.shop,
  };
}

export function offersFromSeed(seed: ProductSeed, key: string, count = 5): Product[] {
  const rand = rng(`o:${key}`);
  const shops = [...SHOPS].sort(() => rand() - 0.5);
  const deltas = [-0.04, 0, 0.06, 0.11, 0.16, -0.07];
  const products: Product[] = [];
  for (let i = 0; i < count; i++) {
    const shop = shops[i % shops.length] ?? "Ozon";
    const price = Math.round(seed.price * (1 + (deltas[i] ?? 0.05 + rand() * 0.08)));
    const isAura = i === 0;
    products.push(
      buildProduct(seed, {
        id: `${key}-${i}`,
        shop,
        price,
        isAuraChoice: isAura,
        rating: Math.round((4.4 + rand() * 0.5) * 10) / 10,
        reviewsCount: Math.round(200 + rand() * 8000),
        oldPrice: i === 2 ? Math.round(price * 1.12) : undefined,
        why: isAura
          ? [
              "Лучшее сочетание цены, отзывов и доставки",
              "Официальная гарантия",
              "Мало жалоб на брак",
              "Надёжный продавец",
            ]
          : [
              "Рабочий вариант, если нужен запасной",
              "Проверьте комплектацию перед оплатой",
            ],
        checks: isAura
          ? [
              { ok: true, label: "Цена ниже средней за 90 дней" },
              { ok: true, label: "Продавец с высоким рейтингом" },
              { ok: true, label: "Много подтверждённых покупок" },
              { ok: true, label: "Низкий риск серого импорта" },
              { ok: true, label: "Быстрая доставка" },
              { ok: true, label: "Гарантия указана" },
            ]
          : defaultChecks(`${key}-${i}`, price, Math.round(seed.price * 1.04)),
      }),
    );
  }
  return products;
}
