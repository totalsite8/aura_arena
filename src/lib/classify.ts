import {
  CATEGORY_QUERIES,
  EXACT_QUERIES,
  GIFT_QUERIES,
  SERVICE_QUERIES,
} from "@/data/queries";
import { normalizeQuery } from "@/lib/format";
import type { ClassifiedQuery, IntentType } from "@/types";

const LISTS: { type: Exclude<IntentType, "unknown">; items: readonly string[] }[] = [
  { type: "exact_product", items: EXACT_QUERIES },
  { type: "category_search", items: CATEGORY_QUERIES },
  { type: "gift_search", items: GIFT_QUERIES },
  { type: "service_search", items: SERVICE_QUERIES },
];

const GIFT_RE =
  /подар|подари|что подарить|день рожден|годовщин|юбиле|23 февраля|новый год|выпускн/;
const SERVICE_RE =
  /остекл|ремонт|фотограф|переезд|сантехник|собрать мебель|окна|проводк|уборк|торт на заказ|штор|кондиционер|стиральн|сайт для|реклам|логотип|репетитор|маникюр|ландшафт|напечат|вызвать|установк|пошив|замена/;
const CATEGORY_RE =
  /до\s*[\d\s]+₽|до\s*\d|для |наушник|ноутбук|пылесос|кроссовк|пуховик|блендер|смартфон|кресло|увлажнител|коляск|роутер|микроволн|фитнес|скейт|наполнител|мультиварк|мини-пк|мини пк|видеорегистр|дрель|термопот/;

function bestIncludes(q: string, items: readonly string[]): string | undefined {
  let best: string | undefined;
  let bestLen = 0;
  for (const item of items) {
    const n = normalizeQuery(item);
    if (q === n) return item;
    if (q.includes(n) || n.includes(q)) {
      if (n.length > bestLen) {
        best = item;
        bestLen = n.length;
      }
    }
  }
  return best;
}

export function classify(raw: string): ClassifiedQuery {
  const query = raw.trim();
  const q = normalizeQuery(query);
  if (!q) return { type: "unknown", query };

  for (const { type, items } of LISTS) {
    const matched = bestIncludes(q, items);
    if (matched) return { type, query, matched };
  }

  if (GIFT_RE.test(q)) return { type: "gift_search", query };
  if (SERVICE_RE.test(q)) return { type: "service_search", query };
  if (CATEGORY_RE.test(q)) return { type: "category_search", query };

  const looksExact = /[a-z0-9]/i.test(query) && query.split(" ").length <= 6;
  if (looksExact) return { type: "exact_product", query };

  return { type: "unknown", query };
}
