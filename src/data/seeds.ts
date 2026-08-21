import type { ProductSeed } from "@/data/factory";
import { normalizeQuery } from "@/lib/format";

export const EXACT_SEEDS: Record<string, ProductSeed> = {
  "honor magic 7 pro": {
    title: "Honor Magic 7 Pro 512GB",
    brand: "Honor",
    category: "Смартфоны",
    kind: "phone",
    price: 89990,
    hue: 22,
    features: ["Snapdragon 8 Elite", "512 ГБ", "камера 50 Мп", "IP68", "120 Гц"],
    warranty: "1 год, официальная",
    delivery: "завтра",
  },
  "airpods pro 3": {
    title: "Apple AirPods Pro 3",
    brand: "Apple",
    category: "Наушники",
    kind: "earbuds",
    price: 24990,
    hue: 210,
    features: ["шумодав", "USB-C", "чистый звук", "до 6 ч"],
  },
  "sony wh-1000xm5": {
    title: "Sony WH-1000XM5",
    brand: "Sony",
    category: "Наушники",
    kind: "headphones",
    price: 32990,
    hue: 230,
    features: ["флагманский шумодав", "30 ч", "кожаные амбушюры"],
  },
  "робот-пылесос roborock q7 max+": {
    title: "Roborock Q7 Max+",
    brand: "Roborock",
    category: "Пылесосы",
    kind: "vacuum",
    price: 54990,
    hue: 190,
    features: ["станция самоочистки", "лидар", "мощное всасывание"],
  },
  "iphone 16 pro 256gb": {
    title: "iPhone 16 Pro 256GB",
    brand: "Apple",
    category: "Смартфоны",
    kind: "phone",
    price: 129990,
    hue: 200,
    features: ["A18 Pro", "256 ГБ", "ProMotion", "титан"],
  },
  "ноутбук asus vivobook 15": {
    title: "ASUS Vivobook 15",
    brand: "ASUS",
    category: "Ноутбуки",
    kind: "laptop",
    price: 64990,
    hue: 265,
    features: ["15,6\"", "16 ГБ RAM", "SSD 512 ГБ", "лёгкий корпус"],
  },
  "телевизор lg 55\" 4k": {
    title: "LG 55\" 4K",
    brand: "LG",
    category: "Телевизоры",
    kind: "tv",
    price: 59990,
    hue: 250,
    features: ["4K", "webOS", "тонкие рамки", "HDR"],
  },
  "монитор samsung 27\" ips": {
    title: "Samsung 27\" IPS",
    brand: "Samsung",
    category: "Мониторы",
    kind: "monitor",
    price: 18990,
    hue: 215,
    features: ["27\"", "IPS", "75 Гц", "тонкие рамки"],
  },
  "кофемашина delonghi magnifica": {
    title: "DeLonghi Magnifica",
    brand: "DeLonghi",
    category: "Кухня",
    kind: "coffee",
    price: 45990,
    hue: 28,
    features: ["зерно", "капучино", "автоочистка"],
  },
  "щетка oral-b pro 3": {
    title: "Oral-B Pro 3",
    brand: "Oral-B",
    category: "Красота",
    kind: "brush",
    price: 5990,
    hue: 348,
    features: ["3 режима", "датчик давления", "таймер"],
  },
  "фен dyson supersonic": {
    title: "Dyson Supersonic",
    brand: "Dyson",
    category: "Красота",
    kind: "hair",
    price: 49990,
    hue: 350,
    features: ["быстрая сушка", "без перегрева", "насадки"],
  },
  "playstation 5 slim": {
    title: "PlayStation 5 Slim",
    brand: "Sony",
    category: "Игры",
    kind: "console",
    price: 59990,
    hue: 220,
    features: ["SSD", "4K", " DualSense"],
  },
  "видеокарта rtx 4070 super": {
    title: "GeForce RTX 4070 Super",
    brand: "NVIDIA",
    category: "Комплектующие",
    kind: "gpu",
    price: 79990,
    hue: 145,
    features: ["12 ГБ", "DLSS 3", "тихая СО"],
  },
  "книга pocketbook 632": {
    title: "PocketBook 632",
    brand: "PocketBook",
    category: "Электроника",
    kind: "book",
    price: 14990,
    hue: 40,
    features: ["E Ink", "подсветка", "влагозащита"],
  },
  "часы amazfit gts 4": {
    title: "Amazfit GTS 4",
    brand: "Amazfit",
    category: "Часы",
    kind: "watch",
    price: 12990,
    hue: 12,
    features: ["AMOLED", "GPS", "8 дней"],
  },
  "шуруповерт bosch 12v": {
    title: "Bosch 12V",
    brand: "Bosch",
    category: "Инструмент",
    kind: "tool",
    price: 8990,
    hue: 8,
    features: ["12 В", "2 батареи", "кейс"],
  },
  "смесь nan 2": {
    title: "NAN 2 800 г",
    brand: "NAN",
    category: "Детям",
    kind: "baby",
    price: 1890,
    hue: 48,
    features: ["с 6 месяцев", "800 г"],
  },
  "корм monge 10 кг": {
    title: "Monge 10 кг",
    brand: "Monge",
    category: "Питомцы",
    kind: "pet",
    price: 5490,
    hue: 32,
    features: ["10 кг", "для взрослых собак"],
  },
  "шины michelin 205/55 r16": {
    title: "Michelin 205/55 R16",
    brand: "Michelin",
    category: "Авто",
    kind: "tire",
    price: 12990,
    hue: 0,
    features: ["205/55 R16", "летние", "тихий ход"],
  },
  "dior sauvage 100ml": {
    title: "Dior Sauvage 100 мл",
    brand: "Dior",
    category: "Ароматы",
    kind: "perfume",
    price: 12990,
    hue: 160,
    features: ["100 мл", "туалетная вода"],
  },
};

export const CATEGORY_SEEDS: { match: string; label: string; items: ProductSeed[] }[] = [
  {
    match: "беспроводные наушники до 3 000",
    label: "Беспроводные наушники",
    items: [
      {
        title: "soundcore P20i",
        brand: "soundcore",
        category: "Наушники",
        kind: "earbuds",
        price: 2490,
        hue: 18,
        features: ["до 30 ч", "защита от воды", "удобная посадка"],
      },
      {
        title: "Xiaomi Redmi Buds 6 Play",
        brand: "Xiaomi",
        category: "Наушники",
        kind: "earbuds",
        price: 1990,
        hue: 200,
        features: ["лёгкие", "стабильный Bluetooth", "микрофон"],
      },
      {
        title: "QCY MeloBuds N4",
        brand: "QCY",
        category: "Наушники",
        kind: "earbuds",
        price: 2790,
        hue: 265,
        features: ["бас", "сенсор", "компактный кейс"],
      },
      {
        title: "Honor Earbuds X6",
        brand: "Honor",
        category: "Наушники",
        kind: "earbuds",
        price: 2990,
        hue: 22,
        features: ["чистый голос", "быстрая зарядка"],
      },
      {
        title: "realme Buds T110",
        brand: "realme",
        category: "Наушники",
        kind: "earbuds",
        price: 2290,
        hue: 155,
        features: ["яркий звук", "до 28 ч"],
      },
      {
        title: "JBL Wave Beam",
        brand: "JBL",
        category: "Наушники",
        kind: "earbuds",
        price: 3190,
        hue: 8,
        features: ["фирменный бас", "удобные"],
      },
    ],
  },
];

export function findExactSeed(query: string): ProductSeed | undefined {
  const q = normalizeQuery(query);
  if (EXACT_SEEDS[q]) return EXACT_SEEDS[q];
  for (const [k, seed] of Object.entries(EXACT_SEEDS)) {
    if (q.includes(k) || k.includes(q)) return seed;
  }
  return undefined;
}

export function findCategoryPack(query: string) {
  const q = normalizeQuery(query);
  return CATEGORY_SEEDS.find((p) => q.includes(p.match) || p.match.includes(q));
}

export function genericSeedFromQuery(query: string, kind: ProductSeed["kind"] = "generic"): ProductSeed {
  const title = query.trim().slice(0, 48) || "Подходящий вариант";
  return {
    title,
    brand: "Aura pick",
    category: "Подбор",
    kind,
    price: 12990,
    hue: 28,
    features: ["Проверенные отзывы", "Есть гарантия", "Быстрая доставка"],
  };
}
