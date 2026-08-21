import type { Lane, QueryType, Script, ServiceBid, ProductOffer } from '../types'
import { makeRng } from '../lib/random'
import { normalize } from '../lib/normalize'
import { currentMonthYear, formatPrice, plural } from '../lib/format'
import { findCategorySpec, findExactSpec, STORES } from './catalog'

/** ms → «0:07» */
export function stamp(at: number): string {
  const s = Math.max(0, Math.round(at / 1000))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

/** Разбивает итоговое число находок по магазинам так, чтобы сумма совпадала. */
function storesFoundLines(rng: ReturnType<typeof makeRng>, startAt: number, total: number) {
  const counts: { store: string; n: number; at: number }[] = []
  let t = startAt
  const pool = rng.take([...STORES], 5)
  const weights = pool.map(() => 0.5 + rng.next())
  const wSum = weights.reduce((a, b) => a + b, 0)
  let left = total
  pool.forEach((store, i) => {
    const rest = pool.length - i - 1 // магазинов после текущего
    let n = i === pool.length - 1 ? left : Math.max(1, Math.round((weights[i] / wSum) * total))
    n = Math.min(n, left - rest)
    n = Math.max(1, n)
    left -= n
    counts.push({ store, n, at: t })
    t += rng.int(550, 800)
  })
  return { counts, total, end: t }
}

export function buildScript(args: {
  type: QueryType
  query: string
  answers: Record<string, string>
  hero?: ProductOffer
  bids?: ServiceBid[]
  totalFound: number
}): Script {
  const { type, query } = args
  const rng = makeRng('script::' + type + '::' + normalize(query))

  if (type === 'service_search') return serviceScript(args.query, args.bids ?? [], rng, args.totalFound)
  if (type === 'gift_search') return giftScript(args.query, args.answers, args.hero?.title, rng)
  if (type === 'category_search') return categoryScript(args.query, args.hero, rng, args.totalFound)
  return exactScript(args.query, args.hero, rng, args.totalFound)
}

/* ------------------------- A: точный товар ------------------------- */

function exactScript(query: string, hero: ProductOffer | undefined, rng: ReturnType<typeof makeRng>, total: number): Script {
  const spec = findExactSpec(query)
  const pros = spec?.pros ?? hero?.features.slice(0, 3) ?? ['цена', 'качество']
  const found = storesFoundLines(rng, 1700, total)

  const status = [
    { at: 0, text: 'Поняла задачу — ищу именно этот товар…' },
    { at: 900, text: 'Проверяю магазины и предложения…' },
    { at: 5200, text: 'Сравниваю цены, отзывы и надёжность…' },
    { at: 8600, text: 'Перепроверяю лучший вариант…' },
    { at: 10600, text: 'Готово — собираю результат' },
  ]

  const lanes: Lane[] = [
    {
      id: 'shops',
      title: 'Поиск по магазинам',
      icon: 'Store',
      events: [
        { at: 950, text: 'Открываю маркетплейсы и магазины…', kind: 'info' },
        ...found.counts.map((c) => ({
          at: c.at,
          text: `${c.store} — ${c.n} ${plural(c.n, ['предложение', 'предложения', 'предложений'])}`,
          kind: 'found' as const,
        })),
        { at: found.end + 200, text: `Всего нашла ${found.total} предложений`, kind: 'done' },
      ],
    },
    {
      id: 'reviews',
      title: 'Исследователь: обзоры',
      icon: 'Newspaper',
      events: [
        { at: 1500, text: `Читаю свежие обзоры: ${currentMonthYear}…`, kind: 'info' },
        { at: 2600, text: `Разобрала ${rng.int(9, 16)} видеообзора и статьи`, kind: 'info' },
        { at: 3900, text: `Частые плюсы: ${pros.slice(0, 3).join(', ')}`, kind: 'info' },
        { at: 5000, text: `Отзывов изучено: ${rng.int(1400, 2800).toLocaleString('ru-RU')} — жалоб на брак меньше 2%`, kind: 'done' },
      ],
    },
    {
      id: 'compare',
      title: 'Аналитик: сравнение',
      icon: 'Scale',
      events: [
        { at: 5400, text: 'Сверяю комплектации и версии — убираю «обрезанные»…', kind: 'info' },
        { at: 6400, text: `Отсекаю ${rng.int(2, 4)} продавца: подозрительно низкая цена`, kind: 'warn' },
        { at: 7500, text: 'Смотрю историю цены за 90 дней…', kind: 'info' },
        { at: 8400, text: hero ? `Лучшая цена: ${formatPrice(hero.price)} — «${hero.store}»` : 'Лучшая цена найдена', kind: 'found' },
      ],
    },
    {
      id: 'verify',
      title: 'Ревизор',
      icon: 'ShieldCheck',
      events: [
        { at: 8700, text: 'Проверяю гарантию и происхождение товара…', kind: 'info' },
        { at: 9600, text: 'Серийный номер проходит по официальной базе', kind: 'info' },
        { at: 10400, text: 'Подтверждаю: это лучший вариант по всем параметрам', kind: 'done' },
      ],
    },
  ]

  return { lanes, status, totalMs: 11000 }
}

/* ------------------------- B: категория ------------------------- */

function categoryScript(query: string, hero: ProductOffer | undefined, rng: ReturnType<typeof makeRng>, total: number): Script {
  const spec = findCategorySpec(query)
  const criteria = spec?.criteria ?? ['рейтинг от 4.5', 'цена в бюджете', 'реальные отзывы']
  const found = storesFoundLines(rng, 3900, total)

  const status = [
    { at: 0, text: 'Поняла параметры — начинаю подбор…' },
    { at: 800, text: 'Изучаю свежие рейтинги и обзоры…' },
    { at: 3400, text: 'Ищу варианты в магазинах…' },
    { at: 7000, text: 'Сравниваю отобранное…' },
    { at: 9800, text: 'Перепроверяю лучший вариант…' },
    { at: 11600, text: 'Готово — собираю подборку' },
  ]

  const lanes: Lane[] = [
    {
      id: 'research',
      title: 'Исследователь',
      icon: 'SearchCheck',
      events: [
        { at: 700, text: `Смотрю свежие рейтинги (${currentMonthYear})…`, kind: 'info' },
        { at: 1800, text: `Вывела критерии: ${criteria.slice(0, 3).join('; ')}`, kind: 'found' },
        { at: 2900, text: spec ? `Отсекаю заранее: ${spec.reject}` : 'Отсекаю модели с плохими отзывами', kind: 'warn' },
      ],
    },
    {
      id: 'shops',
      title: 'Поиск по магазинам',
      icon: 'Store',
      events: [
        { at: 3300, text: 'Ищу по выведенным характеристикам…', kind: 'info' },
        ...found.counts.slice(0, 4).map((c) => ({
          at: c.at,
          text: `${c.store} — ${c.n} ${plural(c.n, ['вариант', 'варианта', 'вариантов'])}`,
          kind: 'found' as const,
        })),
        { at: found.end - 400, text: `Собрала ${found.total} вариантов, отбираю лучшие`, kind: 'done' },
      ],
    },
    {
      id: 'compare',
      title: 'Аналитик: сравнение',
      icon: 'Scale',
      events: [
        { at: 7200, text: `Сравниваю топ-${rng.int(10, 15)} по отзывам и реальным характеристикам…`, kind: 'info' },
        { at: 8300, text: `Проверяю истории цен: сейчас дешевле средней на ${rng.int(6, 18)}%`, kind: 'info' },
        { at: 9300, text: hero ? `Фаворит подбора: ${hero.title} — ${formatPrice(hero.price)}` : 'Фаворит подбора определён', kind: 'found' },
      ],
    },
    {
      id: 'verify',
      title: 'Ревизор',
      icon: 'ShieldCheck',
      events: [
        { at: 9900, text: 'Перепроверяю: точно ли лучший вариант в бюджете?', kind: 'info' },
        { at: 10800, text: 'Смотрю жалобы на брак и гарантию…', kind: 'info' },
        { at: 11400, text: 'Подтверждаю выбор — собираю карточки', kind: 'done' },
      ],
    },
  ]

  return { lanes, status, totalMs: 12000 }
}

/* ------------------------- C: подарок ------------------------- */

function giftScript(query: string, answers: Record<string, string>, heroTitle: string | undefined, rng: ReturnType<typeof makeRng>): Script {
  const who = /парн|муж|друг|геймер|брат|пап|начальник|коллег/.test(normalize(query)) ? 'ему' : 'ей'
  const age = answers['age']
  const budget = answers['budget']

  const status = [
    { at: 0, text: 'Поняла, подбираю идеи подарков…' },
    { at: 900, text: 'Смотрю свежие подборки и тренды…' },
    { at: 3400, text: 'Проверяю каждое направление…' },
    { at: 7600, text: 'Сравниваю идеи между собой…' },
    { at: 10000, text: 'Финальная проверка…' },
    { at: 11800, text: 'Готово — собираю подборку' },
  ]

  const dirs = ['Умные гаджеты', 'Уход и стиль', 'Впечатления'].map((d, i) => ({
    title: d,
    at: 3500 + i * 900,
    n: rng.int(8, 16),
  }))

  const lanes: Lane[] = [
    {
      id: 'dir0',
      title: 'Направление: гаджеты',
      icon: 'Cpu',
      events: [
        { at: dirs[0].at, text: `Ищу идеи в «${dirs[0].title}»…`, kind: 'info' },
        { at: dirs[0].at + 700, text: `Нашла ${dirs[0].n} вариантов с отзывами`, kind: 'info' },
        { at: dirs[0].at + 1500, text: 'Оставляю те, что радуют, а не пылятся', kind: 'done' },
      ],
    },
    {
      id: 'dir1',
      title: 'Направление: стиль',
      icon: 'Sparkles',
      events: [
        { at: dirs[1].at + 300, text: `Ищу идеи в «${dirs[1].title}»…`, kind: 'info' },
        { at: dirs[1].at + 1000, text: `Нашла ${dirs[1].n} вариантов`, kind: 'info' },
        { at: dirs[1].at + 1800, text: 'Проверяю, что есть в наличии рядом', kind: 'done' },
      ],
    },
    {
      id: 'dir2',
      title: 'Направление: впечатления',
      icon: 'PartyPopper',
      events: [
        { at: dirs[2].at + 500, text: `Ищу идеи в «${dirs[2].title}»…`, kind: 'info' },
        { at: dirs[2].at + 1200, text: `Нашла ${dirs[2].n} форматов рядом с вами`, kind: 'info' },
        { at: dirs[2].at + 2000, text: 'Смотрю оценки организаторов', kind: 'done' },
      ],
    },
    {
      id: 'verify',
      title: 'Ревизор',
      icon: 'ShieldCheck',
      events: [
        {
          at: 850,
          text: `Читаю свежие подборки подарков (${currentMonthYear})${age ? `, возраст: ${age}` : ''}${budget ? `, бюджет: ${budget.toLowerCase()}` : ''}…`,
          kind: 'info',
        },
        { at: 2100, text: `Смотрю, что сейчас дарят ${who === 'ему' ? 'мужчинам' : 'женщинам'} — по свежим обзорам`, kind: 'info' },
        { at: 8200, text: 'Сравниваю идеи: цена, отзывы, «вау-эффект»…', kind: 'info' },
        { at: 9600, text: 'Проверяю сроки доставки — успеет ли к дате', kind: 'info' },
        { at: 10800, text: heroTitle ? `Лучшая идея: ${shorten(heroTitle)}` : 'Лучшая идея выбрана', kind: 'found' },
        { at: 11600, text: 'Подборка готова — собираю карточки', kind: 'done' },
      ],
    },
  ]

  return { lanes, status, totalMs: 12200 }
}

function shorten(s: string): string {
  return s.length > 42 ? s.slice(0, 42).trimEnd() + '…' : s
}

/* ------------------------- D: услуга ------------------------- */

function serviceScript(_query: string, bids: ServiceBid[], rng: ReturnType<typeof makeRng>, total: number): Script {
  const foundN = total
  const selectedN = rng.int(7, 10)
  const sent = Math.min(5, bids.length)
  const names = bids.slice(0, sent).map((b) => b.companyName)

  const status = [
    { at: 0, text: 'Оформляю описание задачи…' },
    { at: 1200, text: 'Ищу компании рядом с вами…' },
    { at: 4400, text: 'Отправляю задачу проверенным компаниям…' },
    { at: 6200, text: 'Собираю ответы с ценами…' },
    { at: 9800, text: 'Проверяю скрытые доплаты…' },
    { at: 12200, text: 'Готово — сравниваю предложения' },
  ]

  const replyEvents = names.map((n, i) => {
    const b = bids[i]
    return {
      at: 6600 + i * 750,
      text: `${n}: ${formatPrice(b.estimatedPrice)} — ${b.term}`,
      kind: 'found' as const,
    }
  })

  const lanes: Lane[] = [
    {
      id: 'map',
      title: 'Компании рядом',
      icon: 'MapPin',
      events: [
        { at: 1100, text: 'Открываю карту города…', kind: 'info' },
        { at: 2100, text: `Нашла ${foundN} ${plural(foundN, ['компанию', 'компании', 'компаний'])} по запросу`, kind: 'info' },
        { at: 3300, text: `Отобрала ${selectedN} с рейтингом от 4.0 и живыми отзывами`, kind: 'done' },
      ],
    },
    {
      id: 'send',
      title: 'Заявки',
      icon: 'Send',
      events: [
        { at: 4500, text: 'Составила понятное описание задачи', kind: 'info' },
        { at: 5200, text: `Отправила в ${sent} ${plural(sent, ['компанию', 'компании', 'компаний'])} — лично, с деталями`, kind: 'info' },
        { at: 6100, text: `Подтверждения получения: ${sent} из ${sent}`, kind: 'done' },
      ],
    },
    {
      id: 'reply',
      title: 'Ответы компаний',
      icon: 'Inbox',
      events: [
        { at: 6400, text: 'Жду оценки от компаний…', kind: 'info' },
        ...replyEvents,
        { at: 6600 + sent * 750, text: 'Все ответили — сравниваю', kind: 'done' },
      ],
    },
    {
      id: 'verify',
      title: 'Ревизор',
      icon: 'Calculator',
      events: [
        { at: 9900, text: 'Смотрю, что реально входит в каждую цену…', kind: 'info' },
        { at: 10700, text: 'Нашла пункты, где любят добавить доплаты', kind: 'warn' },
        { at: 11500, text: 'Сверила со средними ценами по городу', kind: 'info' },
        { at: 12100, text: 'Рекомендация готова', kind: 'done' },
      ],
    },
  ]

  return { lanes, status, totalMs: 12600 }
}
