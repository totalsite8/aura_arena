import type { IntentType, ProcessStep } from "@/types";

export const PRODUCT_STEPS: ProcessStep[] = [
  {
    id: "p1",
    text: "Разбираю запрос",
    detail: "Выделяю модель, память, цвет и ограничения",
    queryHint: "характеристики обзор",
    scene: "parse",
    delay: 0,
  },
  {
    id: "p2",
    text: "Читаю живые страницы",
    detail: "Свежие обзоры, форумы, видео за этот месяц",
    queryHint: "обзор 2026 отзывы",
    scene: "reviews",
    delay: 1600,
  },
  {
    id: "p3",
    text: "Обхожу витрины",
    detail: "Ozon, Маркет, DNS, М.Видео, Wildberries",
    queryHint: "купить",
    scene: "crawl",
    delay: 3400,
  },
  {
    id: "p4",
    text: "Сверяю цены и комплектации",
    detail: "Одинаковый ли это товар, что в коробке, какая доставка",
    queryHint: "цена наличие",
    scene: "compare",
    delay: 6200,
  },
  {
    id: "p5",
    text: "Проверяю магазины",
    detail: "Гарантия, серый ввоз, жалобы, сроки",
    queryHint: "оригинал гарантия серый",
    scene: "verify",
    delay: 8600,
  },
  {
    id: "p6",
    text: "Собираю вывод",
    detail: "Оставляю лучший вариант как есть — даже если он не самый дешёвый",
    queryHint: "",
    scene: "compose",
    delay: 10800,
  },
];

export const CATEGORY_STEPS: ProcessStep[] = [
  {
    id: "c1",
    text: "Разбираю задачу",
    detail: "Бюджет, сценарий, что нельзя упускать",
    queryHint: "как выбрать",
    scene: "parse",
    delay: 0,
  },
  {
    id: "c2",
    text: "Читаю подборки",
    detail: "Свежие сравнения и рейтинги",
    queryHint: "рейтинг 2026",
    scene: "reviews",
    delay: 1400,
  },
  {
    id: "c3",
    text: "Обхожу витрины",
    detail: "Параллельный проход по магазинам",
    queryHint: "купить",
    scene: "crawl",
    delay: 3600,
  },
  {
    id: "c4",
    text: "Сверяю варианты",
    detail: "Цена, отзывы, кто продаёт",
    queryHint: "сравнение",
    scene: "compare",
    delay: 6400,
  },
  {
    id: "c5",
    text: "Проверяю надёжность",
    detail: "Не гонюсь за самой низкой цифрой",
    queryHint: "отзывы продавца",
    scene: "verify",
    delay: 8800,
  },
  {
    id: "c6",
    text: "Собираю вывод",
    detail: "Короткий выбор плюс запасные",
    queryHint: "",
    scene: "compose",
    delay: 11000,
  },
];

export const GIFT_STEPS: ProcessStep[] = [
  {
    id: "g1",
    text: "Понимаю, кому дарим",
    detail: "Человек, повод, рамка бюджета",
    queryHint: "идеи подарка",
    scene: "parse",
    delay: 0,
  },
  {
    id: "g2",
    text: "Ищу живые идеи",
    detail: "Подборки, форумы, что реально дарят",
    queryHint: "что подарить 2026",
    scene: "reviews",
    delay: 1500,
  },
  {
    id: "g3",
    text: "Проверяю, что можно купить",
    detail: "Есть ли в наличии и как быстро приедет",
    queryHint: "купить подарок",
    scene: "crawl",
    delay: 3800,
  },
  {
    id: "g4",
    text: "Отсекаю скучное",
    detail: "Оставляю то, чем будут пользоваться",
    queryHint: "рейтинг",
    scene: "compare",
    delay: 6400,
  },
  {
    id: "g5",
    text: "Проверяю магазины",
    detail: "Чтобы подарок не приехал сюрпризом",
    queryHint: "отзывы магазин",
    scene: "verify",
    delay: 8600,
  },
  {
    id: "g6",
    text: "Собираю направления",
    detail: "Не один товар, а несколько живых путей",
    queryHint: "",
    scene: "compose",
    delay: 10800,
  },
];

export const SERVICE_STEPS: ProcessStep[] = [
  {
    id: "s1",
    text: "Собираю описание задачи",
    detail: "Что сделать, когда, в каком районе",
    queryHint: "заказать",
    scene: "parse",
    delay: 0,
  },
  {
    id: "s2",
    text: "Ищу компании рядом",
    detail: "Карты, сайты, свежие отзывы",
    queryHint: "рейтинг отзывы",
    scene: "reviews",
    delay: 1600,
  },
  {
    id: "s3",
    text: "Пишу в компании",
    detail: "Короткое описание — без лишних анкет",
    queryHint: "",
    scene: "send",
    delay: 3800,
  },
  {
    id: "s4",
    text: "Смотрю, кто ответил",
    detail: "Цены приходят в разном виде — привожу к одному",
    queryHint: "",
    scene: "inbox",
    delay: 6200,
  },
  {
    id: "s5",
    text: "Ищу скрытые доплаты",
    detail: "Монтаж, подъём, вывоз, замер",
    queryHint: "цена под ключ",
    scene: "verify",
    delay: 8600,
  },
  {
    id: "s6",
    text: "Собираю рекомендацию",
    detail: "Не самый дешёвый — самый спокойный",
    queryHint: "",
    scene: "compose",
    delay: 10800,
  },
];

export function stepsFor(type: IntentType): ProcessStep[] {
  if (type === "service_search") return SERVICE_STEPS;
  if (type === "gift_search") return GIFT_STEPS;
  if (type === "category_search") return CATEGORY_STEPS;
  return PRODUCT_STEPS;
}

export function doneAt(steps: ProcessStep[]): number {
  const last = steps[steps.length - 1];
  return (last?.delay ?? 0) + 1400;
}
