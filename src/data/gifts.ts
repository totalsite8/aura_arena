import { buildProduct, type ProductSeed } from "@/data/factory";
import { normalizeQuery } from "@/lib/format";
import type { GiftDirection, InterviewAnswers, Product } from "@/types";

function p(seed: ProductSeed, id: string, aura = false): Product {
  return buildProduct(seed, {
    id,
    shop: aura ? "Яндекс Маркет" : "Ozon",
    isAuraChoice: aura,
    rating: aura ? 4.8 : 4.6,
    reviewsCount: aura ? 2104 : 860,
    why: aura
      ? ["Практично", "Хорошие отзывы", "Не стыдно подарить", "Быстрая доставка"]
      : ["Достойный запасной вариант"],
  });
}

const FEB23: GiftDirection[] = [
  {
    id: "tech",
    title: "Техника на каждый день",
    subtitle: "Пользуется часто — и вспоминает вас",
    products: [
      p(
        {
          title: "Power bank 20 000 мА·ч",
          brand: "Baseus",
          category: "Подарки",
          kind: "generic",
          price: 3490,
          hue: 200,
          features: ["быстрая зарядка", "два кабеля", "в дорогу"],
        },
        "g-pb",
        true,
      ),
      p(
        {
          title: "Беспроводные наушники soundcore P20i",
          brand: "soundcore",
          category: "Подарки",
          kind: "earbuds",
          price: 2490,
          hue: 18,
          features: ["до 30 ч", "лёгкие"],
        },
        "g-p20",
      ),
      p(
        {
          title: "Лампа для монитора",
          brand: "Xiaomi",
          category: "Подарки",
          kind: "home",
          price: 4290,
          hue: 45,
          features: ["не светит в глаза", "USB"],
        },
        "g-lamp",
      ),
    ],
  },
  {
    id: "care",
    title: "Уход без пафоса",
    subtitle: "Тёплое и взрослое",
    products: [
      p(
        {
          title: "Электробритва с триммером",
          brand: "Philips",
          category: "Подарки",
          kind: "brush",
          price: 4990,
          hue: 210,
          features: ["сухое и влажное", "удобно в поездку"],
        },
        "g-shave",
        true,
      ),
      p(
        {
          title: "Термокружка 500 мл",
          brand: "Klean Kanteen",
          category: "Подарки",
          kind: "kitchen",
          price: 2790,
          hue: 28,
          features: ["держит тепло", "не протекает"],
        },
        "g-mug",
      ),
    ],
  },
  {
    id: "joy",
    title: "Маленькая радость",
    subtitle: "Если хочется улыбки, а не «ещё одна зарядка»",
    products: [
      p(
        {
          title: "Набор специй для гриля",
          brand: "Holy Om",
          category: "Подарки",
          kind: "kitchen",
          price: 1890,
          hue: 14,
          features: ["красивая коробка", "сразу к делу"],
        },
        "g-spice",
        true,
      ),
      p(
        {
          title: "Настольная игра на двоих",
          brand: "Hobby World",
          category: "Подарки",
          kind: "gift",
          price: 2290,
          hue: 265,
          features: ["30 минут партия", "понятные правила"],
        },
        "g-game",
      ),
    ],
  },
];

function simpleDirections(query: string, answers: InterviewAnswers): GiftDirection[] {
  const interest = answers.interest ?? "any";
  const who = answers.who ?? "friend";
  const budgetMap: Record<string, number> = { "1": 1000, "3": 3000, "5": 5000, "10": 10000, any: 7000 };
  const cap = budgetMap[answers.budget ?? "5"] ?? 5000;
  const hue = 28;
  const a = (title: string, brand: string, price: number, kind: ProductSeed["kind"], id: string, aura = false) =>
    p(
      {
        title,
        brand,
        category: "Подарки",
        kind,
        price: Math.min(price, cap),
        hue,
        features: ["Хорошие отзывы", "Нормально упаковать", "Быстрая доставка"],
      },
      id,
      aura,
    );

  const tech: GiftDirection = {
    id: "d-tech",
    title: "Техника",
    subtitle: "Практично и без риска «не угадать»",
    products: [
      a("Компактный пауэрбанк", "Baseus", Math.min(3490, cap), "generic", "t1", true),
      a("Беспроводные наушники", "soundcore", Math.min(2490, cap), "earbuds", "t2"),
    ],
  };
  const home: GiftDirection = {
    id: "d-home",
    title: "Для дома",
    subtitle: "Вещь, которой пользуются",
    products: [
      a("Красивый плед", "Tkano", Math.min(3990, cap), "home", "h1", true),
      a("Аромасвеча набор", "Flame", Math.min(1590, cap), "home", "h2"),
    ],
  };
  const hobby: GiftDirection = {
    id: "d-hobby",
    title: "Хобби",
    subtitle: "Чтобы было приятно разворачивать",
    products: [
      a("Набор для хобби", "Hobby", Math.min(2990, cap), "gift", "b1", true),
      a("Книга с тёплой историей", "Corpus", Math.min(1290, cap), "book", "b2"),
    ],
  };

  if (interest === "tech") return [tech, hobby];
  if (interest === "home") return [home, hobby];
  if (interest === "beauty")
    return [
      {
        id: "d-beauty",
        title: "Красота и уход",
        subtitle: "Аккуратно и по делу",
        products: [
          a("Набор ухода", "The Act", Math.min(3490, cap), "perfume", "be1", true),
          a("Массажёр для лица", "JX", Math.min(2190, cap), "perfume", "be2"),
        ],
      },
      home,
    ];
  if (interest === "sport")
    return [
      {
        id: "d-sport",
        title: "Спорт",
        subtitle: "Пусть служит, а не пылится",
        products: [
          a("Бутылка и пояс для бега", "Decathlon", Math.min(2490, cap), "sport", "s1", true),
          a("Спортивные носки 3 пары", "Nike", Math.min(1290, cap), "wear", "s2"),
        ],
      },
      tech,
    ];

  void who;
  void query;
  return [tech, home, hobby];
}

export function giftDirections(query: string, answers: InterviewAnswers): GiftDirection[] {
  const q = normalizeQuery(query);
  if (q.includes("парн") && (q.includes("23") || q.includes("феврал"))) return FEB23;
  return simpleDirections(query, answers);
}

export function giftHeadline(query: string, answers: InterviewAnswers): string {
  const q = normalizeQuery(query);
  if (q.includes("парн") && q.includes("феврал")) return "Собрала тёплую и практичную подборку";
  const who = answers.who;
  if (who === "mom") return "Собрала спокойные и тёплые варианты для мамы";
  if (who === "dad") return "Собрала вещи, которыми папа будет пользоваться";
  return "Собрала направления, из которых легко выбрать";
}
