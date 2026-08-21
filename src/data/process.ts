import type { IntentType, ProcessStep } from "@/types";

export const PRODUCT_STEPS: ProcessStep[] = [
  { id: "p1", text: "Понимаю задачу...", icon: "think", delay: 0 },
  { id: "p2", text: "Читаю свежие обзоры", icon: "news", delay: 1600 },
  { id: "p3", text: "Собираю подходящие варианты", icon: "search", delay: 3400 },
  { id: "p4", text: "Сравниваю отзывы, цены и надёжность", icon: "scale", delay: 5600 },
  { id: "p5", text: "Проверяю, действительно ли это лучший вариант", icon: "shield", delay: 7800 },
  { id: "p6", text: "Готовлю результат", icon: "pack", delay: 9400 },
];

export const CATEGORY_STEPS: ProcessStep[] = [
  { id: "c1", text: "Понимаю задачу...", icon: "think", delay: 0 },
  { id: "c2", text: "Уточняю параметры", icon: "chat", delay: 900 },
  { id: "c3", text: "Читаю свежие обзоры", icon: "news", delay: 2200 },
  { id: "c4", text: "Собираю подходящие варианты", icon: "search", delay: 4200 },
  { id: "c5", text: "Сравниваю отзывы, цены и надёжность", icon: "scale", delay: 6400 },
  { id: "c6", text: "Проверяю, действительно ли это лучший вариант", icon: "shield", delay: 8600 },
  { id: "c7", text: "Готовлю результат", icon: "pack", delay: 10200 },
];

export const GIFT_STEPS: ProcessStep[] = [
  { id: "g1", text: "Понимаю, для кого подарок...", icon: "think", delay: 0 },
  { id: "g2", text: "Уточняю параметры", icon: "chat", delay: 1000 },
  { id: "g3", text: "Ищу живые идеи и свежие подборки", icon: "news", delay: 2400 },
  { id: "g4", text: "Собираю направления", icon: "search", delay: 4600 },
  { id: "g5", text: "Сравниваю, что реально порадует", icon: "scale", delay: 6800 },
  { id: "g6", text: "Проверяю лучший вариант", icon: "shield", delay: 8600 },
  { id: "g7", text: "Готовлю подборку", icon: "pack", delay: 10200 },
];

export const SERVICE_STEPS: ProcessStep[] = [
  { id: "s1", text: "Составила описание задачи", icon: "think", delay: 0 },
  { id: "s2", text: "Отправила в проверенные компании", icon: "send", delay: 1800 },
  { id: "s3", text: "Получаю ответы", icon: "inbox", delay: 3800 },
  { id: "s4", text: "Сравниваю цены", icon: "scale", delay: 6000 },
  { id: "s5", text: "Проверяю скрытые доплаты", icon: "shield", delay: 8000 },
  { id: "s6", text: "Готовлю рекомендацию", icon: "pack", delay: 9800 },
];

export function stepsFor(type: IntentType): ProcessStep[] {
  if (type === "service_search") return SERVICE_STEPS;
  if (type === "gift_search") return GIFT_STEPS;
  if (type === "category_search") return CATEGORY_STEPS;
  return PRODUCT_STEPS;
}

export function doneAt(steps: ProcessStep[]): number {
  const last = steps[steps.length - 1];
  return (last?.delay ?? 0) + 1200;
}
