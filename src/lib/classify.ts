import type { QueryType } from '../types'
import { EXACT_PRODUCTS, CATEGORIES, GIFTS, SERVICES } from '../data/suggestions'
import { normalize } from './normalize'

const exactSet = new Map(EXACT_PRODUCTS.map((t) => [normalize(t), 'exact_product' as const]))
const catSet = new Map(CATEGORIES.map((t) => [normalize(t), 'category_search' as const]))
const giftSet = new Map(GIFTS.map((t) => [normalize(t), 'gift_search' as const]))
const svcSet = new Map(SERVICES.map((t) => [normalize(t), 'service_search' as const]))

const GIFT_SIGNALS = [
  'подарок',
  'подарить',
  'подарю',
  'подарочный',
  '23 февраля',
  '8 марта',
  'день рождения',
  'новый год',
  'новому году',
  'юбилей',
  'годовщин',
  'выпускн',
]

const SERVICE_SIGNALS = [
  'остекл',
  'организовать',
  'переезд',
  'грузчик',
  'фотограф',
  'напечатать',
  'печать на',
  'собрать мебель',
  'сборка мебели',
  'сборку мебели',
  'ремонт квартир',
  'ремонт стиральн',
  'пластиковые окна',
  'окна пвх',
  'сантехник',
  'проводк',
  'уборк',
  'клининг',
  'торт',
  'пошив',
  'штор',
  'кондиционер',
  'сайт для',
  'контекстн',
  'логотип',
  'репетитор',
  'маникюр',
  'ландшафт',
  'вызвать',
  'установка',
  'установить',
  'замена',
  'дизайн участка',
  'починить',
  'починит ',
  'поломал',
  'сломал',
  'под ключ',
  'монтаж',
  'демонтаж',
  'с выездом',
  'мастер по',
  'клининг',
]

const KNOWN_BRANDS = [
  'iphone',
  'airpods',
  'sony',
  'honor',
  'dyson',
  'playstation',
  'roborock',
  'pocketbook',
  'amazfit',
  'bosch',
  'michelin',
  'dior',
  'asus',
  'vivobook',
  'samsung',
  'delonghi',
  'oral-b',
  'oral b',
  'rtx',
  'gtx',
  'macbook',
  'ipad',
  'nan',
  'monge',
  'lg ',
  'wh-1000',
]

function hasLatinWithDigits(s: string): boolean {
  return /[a-zA-Z]{2,}[\s-]*[a-zA-Z]*\d/.test(s) || /\d\s?(гб|gb|мл|ml|вт|w|v|в|кг)/i.test(s)
}

export function classifyQuery(raw: string): QueryType | null {
  const q = normalize(raw)
  if (q.length < 3) return null

  // 1. Точное совпадение со списками
  const exact = exactSet.get(q)
  if (exact) return exact
  const cat = catSet.get(q)
  if (cat) return cat
  const gift = giftSet.get(q)
  if (gift) return gift
  const svc = svcSet.get(q)
  if (svc) return svc

  // 2. Частичные попадания по спискам
  for (const [text, type] of exactSet) {
    if (q.includes(text) || text.includes(q)) return type
  }
  for (const [text, type] of giftSet) {
    const core = text.replace('подарок ', '')
    if (q.includes(core) || (q.includes('подар') && text.includes(q))) return type
  }
  for (const [text, type] of svcSet) {
    if (q.length >= 6 && (text.includes(q) || q.includes(text.slice(0, Math.max(8, q.length))))) {
      return type
    }
  }
  for (const [text, type] of catSet) {
    if (q.length >= 8 && text.includes(q)) return type
  }

  // 3. Эвристики
  if (GIFT_SIGNALS.some((s) => q.includes(s))) return 'gift_search'
  if (SERVICE_SIGNALS.some((s) => q.includes(s))) return 'service_search'
  if (KNOWN_BRANDS.some((b) => q.includes(b))) return 'exact_product'
  if (hasLatinWithDigits(q)) return 'exact_product'

  // 4. Любой осмысленный запрос-фраза — подбор по параметрам
  if (/[а-яa-z]/i.test(q)) return 'category_search'
  return null
}
