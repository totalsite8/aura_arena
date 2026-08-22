import type {
  CheckItem,
  GiftDirection,
  PricePoint,
  ProductOffer,
  ServiceBid,
} from '../types'
import { makeRng, roundPrice } from '../lib/random'
import { normalize } from '../lib/normalize'
import { formatPrice } from '../lib/format'
import {
  COMPANY_POOL,
  DEFAULT_NICHE,
  GIFT_BANK,
  STORES,
  findCategorySpec,
  findExactSpec,
  findNiche,
} from './catalog'
import { budgetFromAnswer } from './questions'

/* ------------------------------- утилиты ------------------------------- */

function pickStores(seed: string, needed: number): string[] {
  const rng = makeRng(seed + '::stores')
  const rest: string[] = [...STORES]
  const out: string[] = []
  while (out.length < needed && rest.length) {
    const next = rng.pick(rest)
    out.push(next)
    rest.splice(rest.indexOf(next), 1)
  }
  return out
}

function genHistory(seed: string, currentPrice: number): { history: PricePoint[]; min: number; avg: number } {
  const rng = makeRng(seed + '::history')
  const points: PricePoint[] = []
  const daysBack = 90
  const every = 7
  let p = currentPrice * (1.06 + rng.next() * 0.1)
  const min = roundPrice(currentPrice * (0.9 - rng.next() * 0.04))
  const now = new Date()
  let sum = 0
  let count = 0
  for (let i = daysBack; i >= 0; i -= every) {
    const d = new Date(now.getTime() - i * 24 * 3600 * 1000)
    const label = d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
    p = p * (1 + (rng.next() - 0.52) * 0.05)
    const value = i === 0 ? currentPrice : Math.max(min, roundPrice(p))
    if (rng.chance(0.18) && i !== 0) {
      // провалы «акции» — чтобы график выглядел живым
      points.push({ d: label, p: Math.max(min, roundPrice(value * 0.93)) })
    } else {
      points.push({ d: label, p: value })
    }
    sum += points[points.length - 1].p
    count++
  }
  return { history: points, min, avg: Math.round(sum / count) }
}

function ratingOf(rngVal: number, base = 4.5): number {
  return Math.round((base + rngVal * 0.44) * 10) / 10
}

function makeChecks(seed: string, opts: { hero: boolean; risky?: boolean }): CheckItem[] {
  const rng = makeRng(seed + '::checks')
  const heroChecks: CheckItem[] = [
    { label: 'Цена ниже средней за 90 дней', ok: true, note: 'история цены проверена' },
    { label: 'Продавец с высоким рейтингом', ok: true, note: `${rng.int(320, 2100)} подтверждённых продаж` },
    { label: 'Официальная гарантия', ok: true, note: 'серийный номер проходит по базе' },
    { label: 'Низкий риск подделки', ok: true, note: 'признаков «серого» импорта нет' },
    { label: 'Быстрая доставка', ok: true, note: 'есть на складе в вашем городе' },
    { label: 'Мало жалоб на брак', ok: true, note: 'меньше 2% отзывов' },
  ]
  if (opts.hero) return heroChecks
  if (opts.risky) {
    return [
      { label: 'Цена ниже средней за 90 дней', ok: true, note: 'подозрительно дёшево' },
      { label: 'Продавец новый, отзывов мало', ok: false, note: `всего ${rng.int(8, 60)} продаж` },
      { label: 'Гарантия «от магазина», а не официальная', ok: false, note: 'сервисные центры не примут' },
      { label: 'Признаки «серого» импорта', ok: false, note: 'нет серийных данных в базе' },
      { label: 'Много жалоб на упаковку', ok: false, note: '12% отзывов' },
    ]
  }
  return [
    { label: 'Цена в норме', ok: true },
    { label: 'Продавец надёжный', ok: true, note: `${rng.int(150, 900)} продаж` },
    { label: 'Гарантия указана', ok: rng.chance(0.8), note: 'уточнить срок при покупке' },
    { label: 'Жалоб мало', ok: true },
  ]
}

function offerBase(
  seed: string,
  partial: Pick<ProductOffer, 'id' | 'title' | 'store' | 'icon' | 'price'> & Partial<ProductOffer>
): ProductOffer {
  const rng = makeRng(seed + '::' + partial.id)
  const deliveryOpts = ['завтра', 'послезавтра', '1–2 дня', '2–4 дня']
  const price = partial.price
  const { history, min, avg } = genHistory(seed + partial.id, price)
  const points =
    partial.points ?? (price >= 2000 ? Math.round((price * (0.04 + rng.next() * 0.03)) / 10) * 10 : 0)
  return {
    brand: partial.brand,
    oldPrice:
      partial.oldPrice ?? (rng.chance(0.7) ? roundPrice(price * (1.06 + rng.next() * 0.12)) : undefined),
    rating: partial.rating ?? ratingOf(rng.next()),
    reviewsCount: partial.reviewsCount ?? rng.int(64, 3800),
    delivery: partial.delivery ?? rng.pick(deliveryOpts),
    warranty: partial.warranty ?? rng.pick(['Официальная, 12 мес', 'Гарантия 12 мес', 'Гарантия 6 мес']),
    points,
    features: partial.features ?? [],
    whySelected: partial.whySelected ?? [],
    priceHistory: history,
    marketAverage: partial.marketAverage ?? avg,
    minPrice90: min,
    reliabilityChecks: partial.reliabilityChecks ?? makeChecks(seed + partial.id, { hero: false }),
    risk: partial.risk,
    hue: partial.hue ?? rng.int(0, 359),
    ...partial,
    price,
  }
}

/* ------------------------------ TOВАРЫ ------------------------------ */

const WHY_POOL = {
  price: 'Лучшая цена среди надёжных продавцов',
  rating: 'Очень высокий рейтинг: жалоб почти нет',
  delivery: 'Быстрая доставка — есть на складе рядом',
  warranty: 'Официальная гарантия, примут в любом сервисе',
  origin: 'Серийный номер проходит по официальной базе',
  defects: 'Меньше всего жалоб на брак среди похожих',
}

export interface QaAnswers {
  [qid: string]: string
}

/** Сценарий A: точный товар */
export function buildExactResult(query: string): { hero: ProductOffer; offers: ProductOffer[] } {
  const spec = findExactSpec(query)
  const rng = makeRng('exact::' + normalize(query))

  let title: string
  let brand: string | undefined
  let basePrice: number
  let icon: string
  let features: string[]

  if (spec) {
    title = spec.title
    brand = spec.brand
    basePrice = spec.price
    icon = spec.icon
    features = spec.features
  } else {
    // Любой другой точный товар: аккуратно приводим запрос и даём правдоподобную цену
    title = query.trim().replace(/\s+/g, ' ')
    title = title.charAt(0).toUpperCase() + title.slice(1)
    const brandMatch = title.split(' ')[0]
    brand = brandMatch && /^[A-Za-zА-Яа-я-]{2,}$/.test(brandMatch) ? brandMatch : undefined
    basePrice = roundPrice(rng.int(2990, 89990))
    icon = 'Package'
    features = ['Актуальная модель', 'В наличии у нескольких продавцов', 'Реальные отзывы']
  }

  const stores = pickStores(query, 5)

  const hero = offerBase(query, {
    id: 'hero',
    title,
    brand,
    store: stores[0],
    icon,
    price: basePrice,
    points: Math.round((basePrice * 0.05) / 10) * 10,
    rating: ratingOf(rng.next(), 4.7),
    reviewsCount: rng.int(1100, 4200),
    delivery: 'завтра',
    warranty: 'Официальная, 12 мес',
    features,
    whySelected: [WHY_POOL.price, WHY_POOL.rating, WHY_POOL.delivery, WHY_POOL.warranty, WHY_POOL.defects],
    reliabilityChecks: makeChecks(query + 'hero', { hero: true }),
    isAuraChoice: true,
  })

  const alts: ProductOffer[] = []
  const altCount = 4
  for (let i = 0; i < altCount; i++) {
    const risky = i === altCount - 1 && rng.chance(0.8)
    const factor = risky ? 0.86 - rng.next() * 0.03 : 1 + (i + 1) * (0.02 + rng.next() * 0.035)
    const price = roundPrice(basePrice * factor)
    alts.push(
      offerBase(query, {
        id: 'alt-' + i,
        title,
        brand,
        store: stores[(i + 1) % stores.length],
        icon,
        price,
        oldPrice: risky ? undefined : roundPrice(price * (1.05 + rng.next() * 0.1)),
        rating: risky ? 4.0 + Math.round(rng.next() * 3) / 10 : ratingOf(rng.next(), 4.3),
        reviewsCount: risky ? rng.int(9, 80) : rng.int(120, 2400),
        delivery: rng.pick(['завтра', '1–2 дня', '2–4 дня', '5–7 дней']),
        warranty: risky ? 'Гарантия магазина, 6 мес' : 'Официальная, 12 мес',
        features: features.slice(0, 3),
        points: risky ? 0 : Math.round((price * 0.03) / 10) * 10,
        reliabilityChecks: makeChecks(query + 'alt' + i, { hero: false, risky }),
        risk: risky ? 'подозрительно низкая цена, признаки «серого» импорта' : undefined,
      })
    )
  }

  return { hero, offers: alts }
}

/** Универсальный пул для запросов-категорий, которых нет в таблице */
const GENERIC_ITEMS = [
  { name: 'Хит продаж этой недели — проверенная модель', brand: 'Топ брендов', price: 4990, feats: ['Высокий рейтинг', 'Много отзывов', 'Быстрая доставка'] },
  { name: 'Оптимальный вариант по цене и качеству', brand: 'Средний сегмент', price: 3490, feats: ['Лучшая цена', 'Гарантия магазина'] },
  { name: 'Премиальный вариант для тех, кто хочет максимум', brand: 'Премиум', price: 9990, feats: ['Топ-материалы', 'Расширенная гарантия'] },
  { name: 'Бюджетный вариант без компромиссов', brand: 'Базовый', price: 1990, feats: ['Простота', 'Доставка 1–2 дня'] },
  { name: 'Новинка сезона — свежие отзывы отличные', brand: 'Новинка', price: 6990, feats: ['Свежая модель', 'Рейтинг 4.8'] },
  { name: 'Выбор тех, кто берёт второй раз', brand: 'Проверенный', price: 4490, feats: ['Надёжность', 'Отзывы 4.7'] },
]

/** Сценарий B: категория / направление */
export function buildCategoryResult(query: string, answers: QaAnswers): { hero: ProductOffer; offers: ProductOffer[]; criteria: string[] } {
  const spec = findCategorySpec(query)
  const key = normalize(query) + JSON.stringify(answers)
  const rng = makeRng('cat::' + key)

  const items = spec?.items.length ? spec.items : GENERIC_ITEMS
  const icon = spec?.icon ?? 'Package'
  const criteria = spec?.criteria ?? ['высокий рейтинг', 'реальные отзывы', 'цена в бюджете']

  // Бюджет: сначала из самого запроса («до 3 000₽»), затем из ответа в опроснике
  const budgetMatch = normalize(query).match(/до\s*([\d\s]{3,})/)
  const fromQuery = budgetMatch ? parseInt(budgetMatch[1].replace(/\s/g, ''), 10) : null
  const fromAnswer = budgetFromAnswer(answers['budget'])
  const budget = fromQuery ?? fromAnswer

  const scored = items
    .map((it, idx) => {
      let score = 100 - idx * 7 + rng.next() * 8
      if (budget) {
        if (it.price > budget) score -= 50 // вне бюджета — опускаем вниз
        else score += (budget - it.price) / budget * 6 // чем доступнее в бюджете, тем выше
      }
      return { it, score }
    })
    .sort((a, b) => b.score - a.score)

  const stores = pickStores(query, 5)
  const offers: ProductOffer[] = scored.map(({ it }, i) => {
    const price = roundPrice(it.price * (0.97 + rng.next() * 0.08))
    return offerBase(key, {
      id: 'cat-' + i,
      title: it.name,
      brand: it.brand,
      store: stores[i % stores.length],
      icon,
      price,
      rating: ratingOf(rng.next(), i === 0 ? 4.75 : 4.45),
      reviewsCount: rng.int(200, 5200),
      features: it.feats,
      whySelected:
        i === 0
          ? [
              'Полностью проходит по вашим параметрам',
              WHY_POOL.rating,
              'Лучшее соотношение цены и характеристик',
              WHY_POOL.delivery,
            ]
          : [],
      reliabilityChecks: makeChecks(key + i, { hero: i === 0 }),
      isAuraChoice: i === 0,
    })
  })

  return { hero: offers[0], offers: offers.slice(1), criteria }
}

/* ------------------------------ ПОДАРКИ ------------------------------ */

function giftKeysFromAnswers(query: string, answers: QaAnswers): string[] {
  const q = normalize(query)
  const interest = (answers['interests'] ?? '').toLowerCase()

  let primary = 'tech'
  if (interest.includes('впечатл')) primary = 'impress'
  else if (interest.includes('дом') || interest.includes('уют')) primary = 'cozy'
  else if (interest.includes('спорт') || interest.includes('движен')) primary = 'sport'
  else if (interest.includes('красот') || interest.includes('уход')) primary = 'style'
  else if (interest.includes('хобби') || interest.includes('инструм')) primary = 'hobby'
  else if (q.includes('мам') || q.includes('бабушк') || q.includes('тещ')) primary = 'cozy'
  else if (q.includes('геймер') || q.includes('программист')) primary = 'tech'
  else if (q.includes('муж') || q.includes('парн') || q.includes('брат')) primary = 'hobby'
  else if (q.includes('девушк') || q.includes('сестр') || q.includes('подруг')) primary = 'style'
  else if (q.includes('детск') || q.includes('ребен')) primary = 'tech'
  else if (q.includes('меломан')) primary = 'tech'
  else if (q.includes('путешеств')) primary = 'hobby'
  else if (q.includes('спорт')) primary = 'sport'

  const order = [primary]
  for (const k of ['tech', 'style', 'hobby', 'cozy', 'sport', 'impress']) {
    if (!order.includes(k)) order.push(k)
  }
  // впечатления почти всегда хороши
  if (!order.slice(0, 3).includes('impress')) order.splice(2, 0, 'impress')
  return order.slice(0, 3)
}

export function buildGiftResult(query: string, answers: QaAnswers): { hero: ProductOffer; directions: GiftDirection[] } {
  const key = normalize(query) + JSON.stringify(answers)
  const rng = makeRng('gift::' + key)
  const keys = giftKeysFromAnswers(query, answers)

  const budgetAns = (answers['budget'] ?? '').replace(/[^\d]/g, '')
  const budget = budgetAns ? parseInt(budgetAns, 10) : null

  let globalHero: ProductOffer | null = null
  let globalScore = -1

  const directions: GiftDirection[] = keys.map((k, di) => {
    const spec = GIFT_BANK.find((g) => g.key === k)!
    const items = spec.items
      .map((it, i) => {
        const price = roundPrice(it.price * (0.97 + rng.next() * 0.09))
        const underBudget = budget ? price <= budget : true
        return { it, i, price, underBudget }
      })
      .sort((a, b) => Number(b.underBudget) - Number(a.underBudget) || a.price - b.price)

    const offers = items.map(({ it, price }, i) =>
      offerBase(key + k, {
        id: `gift-${k}-${i}`,
        title: it.name,
        brand: it.brand,
        store: pickStores(key + k, 3)[i % 3],
        icon: spec.icon,
        price,
        rating: ratingOf(rng.next(), 4.6),
        reviewsCount: rng.int(90, 2600),
        features: it.feats,
        whySelected:
          i === 0
            ? ['Подходит под ваши ответы', 'Высокий рейтинг получателей', 'Смотрится дороже своей цены']
            : [],
        reliabilityChecks: makeChecks(key + k + i, { hero: i === 0 }),
        isAuraChoice: false,
      })
    )

    const top = offers[0]
    const score = (top.rating - 4) * 100 + (budget ? Math.max(0, budget - top.price) / 100 : 10) - di * 3
    if (score > globalScore) {
      globalScore = score
      globalHero = top
    }

    return {
      id: k,
      title: spec.title,
      blurb: spec.blurb,
      recommended: di === 0,
      items: offers,
    }
  })

  const hero = globalHero as ProductOffer | null
  const finalHero: ProductOffer = hero
    ? { ...hero, isAuraChoice: true }
    : directions[0].items[0]

  return { hero: finalHero, directions }
}

/* ------------------------------ УСЛУГИ ------------------------------ */

export function buildServiceBids(query: string, answers: QaAnswers): { bids: ServiceBid[]; taskRows: { label: string; value: string }[] } {
  const niche = findNiche(query)
  const key = normalize(query) + JSON.stringify(answers)
  const rng = makeRng('svc::' + key)

  const isBalcony = /остекл|балкон|лодж/.test(normalize(query))
  const names = isBalcony
    ? ['БалконГарант', 'ОкнаПро', 'СитиОкна', 'Мастер Дома', 'Твоё Окно']
    : rng.take(COMPANY_POOL, 5)

  const spread = niche.max - niche.min
  const comments = isBalcony
    ? [
        'Замер бесплатно, договор и гарантия письменно',
        'Делают такие балконы каждую неделю',
        'Цена указана без отделки — уточните, что входит',
        'Работают поэтапно: замер → договор → монтаж',
        'Компания недавно на рынке, отзывов пока немного',
      ]
    : [
        'Ответили подробно, сразу прислали реальные работы',
        'Много похожих выполненных заказов',
        'Цену назвали сразу, но нужен осмотр',
        'Готовы приступить быстро',
        'Попросили уточнить детали перед расчётом',
      ]

  const bids: ServiceBid[] = names.map((name, i) => {
    const price = roundPrice(niche.min + spread * (0.08 + i * (0.16 + rng.next() * 0.06)))
    const hasHidden = i === 2 || (i === 4 && rng.chance(0.6))
    const rating = Math.round((4.4 + rng.next() * 0.5 - (hasHidden ? 0.25 : 0)) * 10) / 10
    const badges: ServiceBid['badges'] = []
    badges.push({ label: `Ответили за ${rng.int(7, 58)} мин`, tone: 'info' })
    if (i === 0 || i === 1) badges.push({ label: 'Есть гарантия', tone: 'good' })
    if (rng.chance(0.4)) badges.push({ label: 'Финальная цена после осмотра', tone: 'info' })
    if (hasHidden) {
      badges.push({ label: 'Возможны скрытые доплаты', tone: 'warn' })
    }

    return {
      id: 'bid-' + i,
      companyName: name,
      rating,
      reviewsCount: rng.int(41, 640),
      estimatedPrice: price,
      priceNote: niche.unit ? niche.unit : rng.chance(0.5) ? 'предварительно' : 'под ключ',
      term: rng.pick(niche.termOptions),
      responseTime: `за ${rng.int(7, 58)} мин`,
      warranty: i === 0 ? '5 лет' : rng.pick(['1 год', '2 года', '3 года']),
      comment: comments[i % comments.length],
      badges,
      hiddenFeesNote: hasHidden
        ? isBalcony
          ? 'В цене не учтены доставка и подъём материалов — обычно это ещё 3 000–7 000 ₽'
          : 'В расчёте не всё учтено — попросите письменную смету до начала работ'
        : undefined,
      recommended: false,
    }
  })

  // Рекомендация: лучший баланс цены, рейтинга и гарантии — НЕ обязательно самый дешёвый
  let bestIdx = 0
  let bestScore = -Infinity
  const avg = bids.reduce((s, b) => s + b.estimatedPrice, 0) / bids.length
  bids.forEach((b, i) => {
    const priceScore = (1 - Math.abs(b.estimatedPrice - avg * 0.95) / avg) * 55
    const score = priceScore + b.rating * 12 + (b.hiddenFeesNote ? -30 : 10) + (b.warranty === '5 лет' ? 8 : 0)
    if (score > bestScore) {
      bestScore = score
      bestIdx = i
    }
  })
  bids[bestIdx].recommended = true

  const taskRows: { label: string; value: string }[] = [
    { label: 'Услуга', value: niche.label === 'Услуга' ? capitalize(query.trim()) : niche.label },
    { label: 'Объём', value: answers['work'] ?? niche.question1Options[1] ?? DEFAULT_NICHE.question1Options[1] },
    { label: 'Срок', value: answers['when'] ?? 'В течение месяца' },
    { label: 'Бюджет', value: answers['budget'] ?? 'Уточним по предложениям' },
    { label: 'Важно', value: answers['priority'] ?? 'Цена и надёжность' },
    { label: 'Город', value: 'Ваш город' },
  ]

  return { bids, taskRows }
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export { formatPrice }
