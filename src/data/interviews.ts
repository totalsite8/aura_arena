import { normalizeQuery } from "@/lib/format";
import type { InterviewQuestion } from "@/types";

const CATEGORY_Q: InterviewQuestion[] = [
  {
    id: "budget",
    title: "Как смотрим на бюджет?",
    options: [
      { id: "strict", label: "Строгий", hint: "Держимся рамки" },
      { id: "flex", label: "Гибкий", hint: "Можно чуть выйти, если стоит" },
    ],
  },
  {
    id: "priority",
    title: "Что важнее?",
    options: [
      { id: "price", label: "Цена" },
      { id: "quality", label: "Качество" },
      { id: "balance", label: "Баланс" },
    ],
  },
  {
    id: "use",
    title: "Для чего нужно?",
    options: [
      { id: "home", label: "Для дома" },
      { id: "work", label: "Для работы" },
      { id: "sport", label: "Для спорта" },
      { id: "any", label: "Универсально" },
    ],
  },
  {
    id: "pref",
    title: "Есть ли предпочтения?",
    options: [
      { id: "brands", label: "Только популярные бренды" },
      { id: "none", label: "Не важно" },
      { id: "new", label: "Хочу новинку" },
    ],
  },
];

const GIFT_Q: InterviewQuestion[] = [
  {
    id: "who",
    title: "Кому подарок?",
    options: [
      { id: "boyfriend", label: "Парню" },
      { id: "girlfriend", label: "Девушке" },
      { id: "mom", label: "Маме" },
      { id: "dad", label: "Папе" },
      { id: "friend", label: "Другу" },
      { id: "colleague", label: "Коллеге" },
    ],
  },
  {
    id: "age",
    title: "Возраст?",
    options: [
      { id: "u20", label: "до 20" },
      { id: "20", label: "20–30" },
      { id: "30", label: "30–45" },
      { id: "45", label: "45+" },
    ],
  },
  {
    id: "budget",
    title: "Бюджет?",
    options: [
      { id: "1", label: "до 1 000₽" },
      { id: "3", label: "до 3 000₽" },
      { id: "5", label: "до 5 000₽" },
      { id: "10", label: "до 10 000₽" },
      { id: "any", label: "не важно" },
    ],
  },
  {
    id: "interest",
    title: "Интересы?",
    options: [
      { id: "tech", label: "Техника" },
      { id: "home", label: "Дом" },
      { id: "sport", label: "Спорт" },
      { id: "beauty", label: "Красота" },
      { id: "hobby", label: "Хобби" },
      { id: "any", label: "Универсально" },
    ],
  },
];

const BALCONY_Q: InterviewQuestion[] = [
  {
    id: "scope",
    title: "Какой объём работ?",
    options: [
      { id: "glass", label: "Только остекление" },
      { id: "finish", label: "Остекление с отделкой" },
      { id: "turnkey", label: "Под ключ" },
    ],
  },
  {
    id: "when",
    title: "Когда нужно?",
    options: [
      { id: "asap", label: "Как можно скорее" },
      { id: "month", label: "В течение месяца" },
      { id: "look", label: "Пока смотрю цены" },
    ],
  },
  {
    id: "budget",
    title: "Бюджет?",
    options: [
      { id: "50", label: "До 50 000₽" },
      { id: "100", label: "50–100 000₽" },
      { id: "200", label: "100–200 000₽" },
      { id: "calc", label: "Не знаю, посчитать" },
    ],
  },
  {
    id: "priority",
    title: "Что важно?",
    options: [
      { id: "price", label: "Цена" },
      { id: "time", label: "Сроки" },
      { id: "warranty", label: "Гарантия" },
      { id: "reviews", label: "Отзывы" },
    ],
  },
];

const GENERIC_SERVICE_Q: InterviewQuestion[] = [
  {
    id: "when",
    title: "Когда нужно?",
    options: [
      { id: "asap", label: "Как можно скорее" },
      { id: "month", label: "В течение месяца" },
      { id: "look", label: "Пока смотрю цены" },
    ],
  },
  {
    id: "budget",
    title: "Бюджет?",
    options: [
      { id: "low", label: "Поскромнее" },
      { id: "mid", label: "Средний" },
      { id: "high", label: "Хочу надёжно" },
      { id: "calc", label: "Не знаю, посчитать" },
    ],
  },
  {
    id: "priority",
    title: "Что важнее?",
    options: [
      { id: "price", label: "Цена" },
      { id: "time", label: "Сроки" },
      { id: "warranty", label: "Гарантия" },
      { id: "reviews", label: "Отзывы" },
    ],
  },
  {
    id: "visit",
    title: "Нужен выезд специалиста?",
    options: [
      { id: "yes", label: "Да, пусть посмотрит" },
      { id: "no", label: "Пока только цена" },
      { id: "maybe", label: "Как решит мастер" },
    ],
  },
];

export const CLARIFY_Q: InterviewQuestion[] = [
  {
    id: "kind",
    title: "Как искать?",
    options: [
      { id: "exact", label: "Конкретный товар", hint: "Знаю модель" },
      { id: "category", label: "Подобрать из категории", hint: "Есть задача, нет модели" },
      { id: "gift", label: "Подарок человеку", hint: "Нужна идея" },
      { id: "service", label: "Услуга", hint: "Мастер, компания, работа" },
    ],
  },
];

export function interviewFor(
  type: "category_search" | "gift_search" | "service_search" | "unknown",
  query: string,
): InterviewQuestion[] {
  if (type === "unknown") return CLARIFY_Q;
  if (type === "category_search") return CATEGORY_Q;
  if (type === "gift_search") return GIFT_Q;
  const q = normalizeQuery(query);
  if (q.includes("балкон") || q.includes("остекл") || q.includes("окна")) return BALCONY_Q;
  return GENERIC_SERVICE_Q;
}

export function guessGiftWho(query: string): string | undefined {
  const q = normalizeQuery(query);
  if (/парн|муж/.test(q)) return "boyfriend";
  if (/девушк|жен/.test(q)) return "girlfriend";
  if (/мам|маме/.test(q)) return "mom";
  if (/пап|отец|отцу/.test(q)) return "dad";
  if (/баб|тещ/.test(q)) return "mom";
  if (/коллег|начальник/.test(q)) return "colleague";
  if (/друг|брат/.test(q)) return "friend";
  return undefined;
}
