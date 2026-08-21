import { buildProduct, offersFromSeed, type ProductSeed } from "@/data/factory";
import { findCategoryPack, findExactSeed, genericSeedFromQuery } from "@/data/seeds";
import { giftDirections, giftHeadline } from "@/data/gifts";
import { buildBrief, SERVICE_CAUTIONS, serviceOffers, type ServiceBrief } from "@/data/services";
import { rng } from "@/lib/hash";
import { normalizeQuery } from "@/lib/format";
import type { ClassifiedQuery, GiftDirection, InterviewAnswers, Product } from "@/types";

export type DemoPayload =
  | {
      kind: "product";
      headline: string;
      chips: string[];
      products: Product[];
    }
  | {
      kind: "gift";
      headline: string;
      chips: string[];
      directions: GiftDirection[];
    }
  | {
      kind: "service";
      headline: string;
      chips: string[];
      brief: ServiceBrief;
      offers: ReturnType<typeof serviceOffers>;
      cautions: string[];
    };

const KIND_BRANDS: Record<string, string[]> = {
  earbuds: ["soundcore", "Xiaomi", "QCY", "Honor", "realme", "JBL"],
  headphones: ["Sony", "soundcore", "JBL", "Marshall"],
  laptop: ["ASUS", "Lenovo", "Honor", "Apple"],
  phone: ["Honor", "Xiaomi", "Samsung", "Apple"],
  vacuum: ["Roborock", "Xiaomi", "Dreame"],
  kitchen: ["Redmond", "Kitfort", "Tefal", "Bosch"],
  home: ["Xiaomi", "Redmond", "Tefal"],
  wear: ["Demix", "Nike", "Adidas"],
  generic: ["Xiaomi", "Baseus", "Redmond", "Kitfort"],
};

function kindFromQuery(q: string): ProductSeed["kind"] {
  if (/наушник/.test(q)) return "earbuds";
  if (/ноутбук|мини-пк|мини пк/.test(q)) return "laptop";
  if (/смартфон|телефон/.test(q)) return "phone";
  if (/пылесос/.test(q)) return "vacuum";
  if (/кофе|блендер|мультиварк|микроволн|термопот/.test(q)) return "kitchen";
  if (/кроссов|пуховик|кресл/.test(q)) return "wear";
  if (/часы|браслет/.test(q)) return "watch";
  if (/роутер/.test(q)) return "home";
  if (/коляск|смесь|увлажнител/.test(q)) return "baby";
  if (/кот|корм|наполнител/.test(q)) return "pet";
  if (/дрель|шуруп/.test(q)) return "tool";
  return "generic";
}

function budgetFromQuery(query: string): number | undefined {
  const m = normalizeQuery(query).match(/до\s*([\d\s]+)\s*₽/);
  if (!m?.[1]) {
    const n = normalizeQuery(query).match(/до\s*(\d[\d\s]*)/);
    if (!n?.[1]) return undefined;
    return Number(n[1].replace(/\s/g, ""));
  }
  return Number(m[1].replace(/\s/g, ""));
}

function generateCategoryProducts(query: string): Product[] {
  const pack = findCategoryPack(query);
  if (pack) {
    const products = pack.items.map((seed, i) => {
      const aura = i === 0;
      const reliable = i !== 1;
      return buildProduct(seed, {
        id: `cat-${seed.brand}-${i}`,
        shop: aura ? "Яндекс Маркет" : i === 1 ? "Ozon" : i % 2 ? "DNS" : "Wildberries",
        isAuraChoice: aura,
        reliable,
        rating: reliable ? 4.7 : 4.3,
        reviewsCount: 400 + i * 220,
        why: aura
          ? [
              "Магазин надёжнее",
              "Лучший звук в бюджете по свежим отзывам",
              "Мало возвратов",
              "Если купите здесь — баллы Aura",
            ]
          : reliable
            ? ["Нормальный запасной вариант"]
            : ["Цена ниже — проверьте продавца"],
      });
    });
    return products;
  }

  const q = normalizeQuery(query);
  const kind = kindFromQuery(q);
  const brands = KIND_BRANDS[kind] ?? KIND_BRANDS.generic!;
  const cap = budgetFromQuery(query) ?? 12990;
  const rand = rng(`cat:${q}`);
  const count = 5;
  const products: Product[] = [];
  for (let i = 0; i < count; i++) {
    const brand = brands[i % brands.length]!;
    const price = Math.max(990, Math.round(cap * (0.55 + i * 0.09 + rand() * 0.08)));
    const seed: ProductSeed = {
      title: `${brand} · ${query.replace(/до.*/i, "").trim() || "вариант"} ${i === 0 ? "Plus" : ""}`.trim(),
      brand,
      category: "Подбор",
      kind,
      price,
      hue: Math.round(rand() * 360),
      features: ["Подходит под запрос", "Есть отзывы", "Гарантия"],
    };
    products.push(
      buildProduct(seed, {
        id: `gen-${i}`,
        shop: i === 0 ? "Яндекс Маркет" : i === 1 ? "Ozon" : "DNS",
        isAuraChoice: i === 0,
        reliable: i !== 1,
        rating: Math.round((4.4 + rand() * 0.5) * 10) / 10,
        reviewsCount: Math.round(120 + rand() * 3000),
      }),
    );
  }
  return products;
}

function chipsFromAnswers(answers: InterviewAnswers): string[] {
  return Object.values(answers).filter(Boolean);
}

export function resolveDemo(
  classified: ClassifiedQuery,
  answers: InterviewAnswers,
  city: string,
): DemoPayload {
  const query = classified.matched ?? classified.query;

  if (classified.type === "gift_search") {
    const directions = giftDirections(query, answers);
    return {
      kind: "gift",
      headline: giftHeadline(query, answers),
      chips: chipsFromAnswers(answers),
      directions,
    };
  }

  if (classified.type === "service_search") {
    const brief = buildBrief(query, answers, city);
    return {
      kind: "service",
      headline: "Сравнила ответы и отметила, где могут быть доплаты",
      chips: [brief.service, brief.budget, brief.when].filter(Boolean),
      brief,
      offers: serviceOffers(query, answers),
      cautions: SERVICE_CAUTIONS,
    };
  }

  if (classified.type === "category_search") {
    return {
      kind: "product",
      headline: "Вот спокойный выбор под ваши условия",
      chips: chipsFromAnswers(answers),
      products: generateCategoryProducts(query),
    };
  }

  const seed = findExactSeed(query);
  const products = seed
    ? offersFromSeed(seed, normalizeQuery(seed.title), 5)
    : offersFromSeed(genericSeedFromQuery(query, kindFromQuery(normalizeQuery(query))), normalizeQuery(query), 4);

  return {
    kind: "product",
    headline: "Нашла предложения и отметила лучший вариант",
    chips: [products[0]?.brand, products[0]?.category].filter((x): x is string => Boolean(x)),
    products,
  };
}
