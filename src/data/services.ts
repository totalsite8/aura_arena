import { rng } from "@/lib/hash";
import { normalizeQuery } from "@/lib/format";
import type { InterviewAnswers, ServiceOffer } from "@/types";

export interface ServiceBrief {
  title: string;
  service: string;
  when: string;
  budget: string;
  important: string;
  city: string;
}

const LABEL: Record<string, Record<string, string>> = {
  scope: {
    glass: "только остекление",
    finish: "остекление с отделкой",
    turnkey: "под ключ",
  },
  when: {
    asap: "как можно скорее",
    month: "в течение месяца",
    look: "пока смотрите цены",
  },
  budget: {
    "50": "до 50 000₽",
    "100": "50–100 000₽",
    "200": "100–200 000₽",
    calc: "посчитать",
    low: "поскромнее",
    mid: "средний",
    high: "хотите надёжно",
  },
  priority: {
    price: "цена",
    time: "сроки",
    warranty: "гарантия",
    reviews: "отзывы",
  },
};

export function buildBrief(query: string, answers: InterviewAnswers, city: string): ServiceBrief {
  const q = normalizeQuery(query);
  const service = q.includes("балкон") || q.includes("остекл") ? "остекление балкона" : query.trim();
  return {
    title: "Поняла задачу",
    service,
    when: LABEL.when?.[answers.when ?? ""] ?? "в удобный срок",
    budget: LABEL.budget?.[answers.budget ?? ""] ?? "обсудим",
    important: LABEL.priority?.[answers.priority ?? ""] ?? "честная цена и отзывы",
    city: city || "Ваш город",
  };
}

const BALCONY: ServiceOffer[] = [
  {
    id: "b1",
    companyName: "Тёплые окна",
    rating: 4.8,
    reviewsCount: 412,
    estimatedPrice: 89000,
    responseTime: "ответили за 20 минут",
    warranty: "5 лет",
    notes: "В цену входит замер, монтаж и вывоз мусора. Пишут сроки сразу.",
    hiddenFeesWarning: false,
    recommended: true,
    tags: ["Ответ быстро", "Есть гарантия", "Финальная цена после осмотра"],
  },
  {
    id: "b2",
    companyName: "Стеклоград",
    rating: 4.4,
    reviewsCount: 188,
    estimatedPrice: 64000,
    responseTime: "ответили за 2 часа",
    warranty: "1 год",
    notes: "Цена выглядит ниже. Часто отдельно считают подъём и откосы.",
    hiddenFeesWarning: true,
    recommended: false,
    tags: ["Возможны скрытые доплаты", "Нужен выезд замерщика"],
  },
  {
    id: "b3",
    companyName: "Балкон-Мастер",
    rating: 4.7,
    reviewsCount: 960,
    estimatedPrice: 94000,
    responseTime: "ответили на следующий день",
    warranty: "7 лет",
    notes: "Дороже, зато много живых отзывов и длинная гарантия.",
    hiddenFeesWarning: false,
    recommended: false,
    tags: ["Есть гарантия", "Финальная цена после осмотра"],
  },
  {
    id: "b4",
    companyName: "ОкноЛэнд",
    rating: 4.3,
    reviewsCount: 74,
    estimatedPrice: 72000,
    responseTime: "ответили за 4 часа",
    warranty: "3 года",
    notes: "Нужен выезд. Без замера цифру называют «примерно».",
    hiddenFeesWarning: true,
    recommended: false,
    tags: ["Нужен выезд замерщика", "Возможны скрытые доплаты"],
  },
  {
    id: "b5",
    companyName: "СитиСтекло",
    rating: 4.6,
    reviewsCount: 255,
    estimatedPrice: 110000,
    responseTime: "ответили за час",
    warranty: "5 лет",
    notes: "Премиальные профили. Имеет смысл, если важна тишина и тепло.",
    hiddenFeesWarning: false,
    recommended: false,
    tags: ["Ответ быстро", "Есть гарантия"],
  },
];

const NAMES = [
  "Домашний мастер",
  "Ателье Севера",
  "Чистота+",
  "Сервис 24",
  "Мастерская на районе",
  "Аккуратные руки",
  "Городские работы",
  "Тихая бригада",
];

export function serviceOffers(query: string, answers: InterviewAnswers): ServiceOffer[] {
  const q = normalizeQuery(query);
  if (q.includes("балкон") || q.includes("остекл") || q.includes("пластиковые окна")) {
    const copy = BALCONY.map((o) => ({ ...o }));
    if (answers.priority === "price") {
      copy.forEach((o) => {
        o.recommended = o.id === "b2";
      });
    }
    return copy;
  }

  const rand = rng(`svc:${q}`);
  const base = 8000 + Math.round(rand() * 40000);
  return Array.from({ length: 4 }, (_, i) => {
    const recommended = i === 0;
    const price = Math.round(base * (0.9 + i * 0.12 + rand() * 0.05));
    const hidden = i === 1;
    return {
      id: `s-${i}`,
      companyName: NAMES[i] ?? `Компания ${i + 1}`,
      rating: Math.round((4.3 + rand() * 0.6) * 10) / 10,
      reviewsCount: Math.round(40 + rand() * 500),
      estimatedPrice: price,
      responseTime: recommended ? "ответили за 30 минут" : "ответили в течение дня",
      warranty: recommended ? "2 года" : "1 год",
      notes: hidden
        ? "В сообщении цена без расходников. Лучше уточнить список работ письменно."
        : "Называют состав работ сразу. Выглядит спокойно.",
      hiddenFeesWarning: hidden,
      recommended,
      tags: hidden
        ? ["Возможны скрытые доплаты", "Нужен выезд замерщика"]
        : ["Ответ быстро", "Есть гарантия"],
    };
  });
}

export const SERVICE_CAUTIONS = [
  "Некоторые компании указывают цену без монтажа.",
  "Доставка и подъём могут быть платными.",
  "Финальная цена часто зависит от замера.",
  "Лучше уточнить гарантию письменно.",
];
