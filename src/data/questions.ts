import type { QueryType, Question } from '../types'
import { findCategorySpec, findNiche } from '../data/catalog'

export function buildQuestions(type: QueryType, query: string): Question[] {
  if (type === 'exact_product') return []

  if (type === 'category_search') {
    const spec = findCategorySpec(query)
    return [
      { id: 'budget', title: 'Бюджет строгий?', options: ['Строгий — не выше', 'Гибкий — можно чуть больше'] },
      { id: 'priority', title: 'Что важнее всего?', options: ['Цена', 'Качество', 'Баланс'] },
      {
        id: 'use',
        title: 'Для чего в основном?',
        options: spec?.useOptions ?? ['Для дома', 'Для работы', 'Для спорта', 'Универсально'],
      },
    ]
  }

  if (type === 'gift_search') {
    return [
      { id: 'age', title: 'Сколько лет человеку?', options: ['до 20', '20–30', '30–45', '45+'] },
      {
        id: 'interests',
        title: 'Что ему ближе?',
        options: ['Техника', 'Дом и уют', 'Спорт', 'Красота', 'Хобби', 'Универсально'],
      },
      { id: 'budget', title: 'Какой бюджет?', options: ['до 1 000 ₽', 'до 3 000 ₽', 'до 5 000 ₽', 'до 10 000 ₽', 'Не важно'] },
    ]
  }

  const niche = findNiche(query)
  return [
    { id: 'work', title: 'Какой объём работ?', options: niche.question1Options },
    { id: 'when', title: 'Когда нужно сделать?', options: ['Как можно скорее', 'В течение месяца', 'Пока присматриваюсь'] },
    {
      id: 'budget',
      title: 'Есть представление о бюджете?',
      options: budgetOptions(niche.min, niche.max),
    },
    { id: 'priority', title: 'Что важнее всего?', options: ['Цена', 'Сроки', 'Гарантия', 'Отзывы'] },
  ]
}

function budgetOptions(min: number, max: number): string[] {
  const fmt = (n: number) => `${Math.round(n / 1000)} 000 ₽`
  if (max < 10000) {
    return [`до ${fmt(min * 1.2)}`, `${fmt(min * 1.2)}–${fmt(max * 0.8)}`, 'Не знаю — посчитайте']
  }
  if (max > 100000) {
    return [`до ${fmt(max * 0.5)}`, `${fmt(max * 0.5)}–${fmt(max)}`, 'Не знаю — посчитайте']
  }
  return [`до ${fmt(min * 1.4)}`, `${fmt(min * 1.4)}–${fmt(max)}`, `от ${fmt(max)}`, 'Не знаю — посчитайте']
}
