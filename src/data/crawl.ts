import { hashStr, rng } from "@/lib/hash";
import type { CrawlSource, IntentType, ProcessScene, SerpRow } from "@/types";

export const SHOP_SOURCES: CrawlSource[] = [
  { id: "ozon", name: "Ozon", host: "www.ozon.ru", tint: "#005BFF", kind: "shop" },
  { id: "ym", name: "Яндекс Маркет", host: "market.yandex.ru", tint: "#FFCC00", kind: "shop" },
  { id: "wb", name: "Wildberries", host: "www.wildberries.ru", tint: "#CB11AB", kind: "shop" },
  { id: "dns", name: "DNS", host: "www.dns-shop.ru", tint: "#F58220", kind: "shop" },
  { id: "mvideo", name: "М.Видео", host: "www.mvideo.ru", tint: "#E31E24", kind: "shop" },
];

export const WEB_SOURCES: CrawlSource[] = [
  { id: "web", name: "Поиск по сети", host: "yandex.ru", tint: "#7AF0FF", kind: "web" },
  { id: "ixbt", name: "Обзоры", host: "www.ixbt.com", tint: "#89A", kind: "web" },
  { id: "yt", name: "Видео", host: "www.youtube.com", tint: "#FF3B30", kind: "web" },
];

export const MAP_SOURCES: CrawlSource[] = [
  { id: "g2", name: "2ГИС", host: "2gis.ru", tint: "#32C832", kind: "maps" },
  { id: "ymaps", name: "Карты", host: "yandex.ru/maps", tint: "#FFCC00", kind: "maps" },
  { id: "avito", name: "Авито", host: "www.avito.ru", tint: "#00AAFF", kind: "maps" },
  { id: "sites", name: "Сайты компаний", host: "search", tint: "#B6FF3B", kind: "web" },
];

export function sourcesFor(type: IntentType, scene: ProcessScene): CrawlSource[] {
  if (type === "service_search") {
    if (scene === "send" || scene === "inbox") {
      return [
        { id: "mail1", name: "Входящие", host: "inbox", tint: "#B6FF3B", kind: "inbox" },
        { id: "mail2", name: "Ответы", host: "replies", tint: "#7AF0FF", kind: "inbox" },
        { id: "g2", name: "2ГИС", host: "2gis.ru", tint: "#32C832", kind: "maps" },
        { id: "sites", name: "Сайты", host: "search", tint: "#FFCC00", kind: "web" },
      ];
    }
    return MAP_SOURCES;
  }
  if (scene === "reviews" || scene === "parse") {
    return [WEB_SOURCES[0]!, WEB_SOURCES[1]!, SHOP_SOURCES[0]!, SHOP_SOURCES[1]!];
  }
  return SHOP_SOURCES.slice(0, 4);
}

function slug(q: string): string {
  return q
    .toLowerCase()
    .replace(/ё/g, "е")
    .replace(/[^a-z0-9а-я]+/gi, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}

function enc(q: string): string {
  return encodeURIComponent(q).replace(/%20/g, "+");
}

export function searchUrl(source: CrawlSource, q: string): string {
  const e = enc(q);
  switch (source.id) {
    case "ozon":
      return `https://www.ozon.ru/search/?text=${e}`;
    case "ym":
      return `https://market.yandex.ru/search?text=${e}`;
    case "wb":
      return `https://www.wildberries.ru/catalog/0/search.aspx?search=${e}`;
    case "dns":
      return `https://www.dns-shop.ru/search/?q=${e}`;
    case "mvideo":
      return `https://www.mvideo.ru/search?q=${e}`;
    case "yt":
      return `https://www.youtube.com/results?search_query=${e}`;
    case "ixbt":
      return `https://www.ixbt.com/search/?q=${e}`;
    case "g2":
      return `https://2gis.ru/search/${e}`;
    case "ymaps":
      return `https://yandex.ru/maps/?text=${e}`;
    case "avito":
      return `https://www.avito.ru/all?q=${e}`;
    default:
      return `https://yandex.ru/search/?text=${e}`;
  }
}

const TITLES = [
  "купить недорого с доставкой",
  "характеристики, цена, отзывы",
  "официальный магазин",
  "сравнить предложения",
  "наличие в вашем городе",
  "обзор и тесты 2026",
  "стоит ли брать",
  "комплектация и гарантия",
  "скидка сегодня",
  "серый или официальный",
];

export function makeSerp(query: string, source: CrawlSource, scene: ProcessScene): SerpRow[] {
  const rand = rng(`serp:${source.id}:${scene}:${query}`);
  const s = slug(query) || "item";
  const rows: SerpRow[] = [];
  const n = 14;
  for (let i = 0; i < n; i++) {
    const tail = TITLES[Math.floor(rand() * TITLES.length)] ?? "купить";
    const idn = (hashStr(`${source.id}${i}${query}`) % 900000) + 10000;
    let url = `https://${source.host}/product/${s}-${idn}`;
    if (source.kind === "web") url = `https://${source.host}/a/${s}-${idn}`;
    if (source.kind === "maps") url = `https://${source.host}/firm/${idn}`;
    if (source.kind === "inbox") url = `message://${source.id}/${idn}`;
    const price = Math.round(8000 + rand() * 120000);
    const title =
      source.kind === "inbox"
        ? `Ответ: готовы сделать за ${price.toLocaleString("ru-RU")}₽`
        : `${query} — ${tail}`;
    const snippet =
      source.kind === "inbox"
        ? "Можем приехать на замер завтра. В письме состав работ."
        : `${source.name} · страница ${i + 1} · обновлено сегодня`;
    const meta =
      source.kind === "shop"
        ? `${price.toLocaleString("ru-RU")}₽ · ${4 + Math.round(rand() * 10) / 10} · ${Math.round(40 + rand() * 4000)} отзывов`
        : source.kind === "inbox"
          ? "входящее · только что"
          : "открываю страницу";
    rows.push({
      id: `${source.id}-${i}`,
      title,
      url,
      snippet,
      meta,
    });
  }
  return rows;
}

export function stepQuery(userQuery: string, hint: string): string {
  const q = userQuery.trim();
  if (!hint) return q;
  return `${q} ${hint}`;
}
