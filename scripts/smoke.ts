/**
 * Дымовой тест логики демо: прогоняет все 80 подсказок через классификатор,
 * билдеры результатов и скрипты процесса. Запуск: npx tsx scripts/smoke.ts
 */
import { SUGGESTIONS } from '../src/data/suggestions'
import { classifyQuery } from '../src/lib/classify'
import { buildQuestions } from '../src/data/questions'
import { buildScript } from '../src/data/scripts'
import {
  buildCategoryResult,
  buildExactResult,
  buildGiftResult,
  buildServiceBids,
} from '../src/data/offers'

let fails = 0
const fail = (msg: string) => {
  fails++
  console.error('FAIL:', msg)
}

const answersMap: Record<string, Record<string, string>> = {
  category_search: { budget: 'Гибкий', priority: 'Баланс', use: 'Для дома' },
  gift_search: { age: '20–30', interests: 'Техника', budget: 'до 5 000 ₽' },
  service_search: { work: 'Стандартный объём', when: 'В течение месяца', budget: 'Не знаю — посчитайте', priority: 'Цена' },
}

let counts: Record<string, number> = {}

for (const s of SUGGESTIONS) {
  const type = classifyQuery(s.text)
  if (type !== s.type) fail(`"${s.text}" ожидался ${s.type}, получен ${type}`)
  if (!type) continue
  counts[type] = (counts[type] ?? 0) + 1

  // TTL скрипта согласован по ссылкам внутри
  if (type === 'exact_product') {
    const r = buildExactResult(s.text)
    if (r.hero.price <= 0) fail(`${s.text}: цена героя <= 0`)
    if (r.offers.length < 3) fail(`${s.text}: мало альтернатив`)
    if (!r.hero.priceHistory.length) fail(`${s.text}: нет истории цены`)
    const script = buildScript({ type, query: s.text, answers: {}, hero: r.hero, totalFound: 50 })
    if (!script.lanes.length) fail(`${s.text}: нет дорожек`)
    const totalEv = script.lanes.reduce((a, l) => a + l.events.length, 0)
    if (totalEv < 10) fail(`${s.text}: мало событий (${totalEv})`)
  }

  if (type === 'category_search') {
    const r = buildCategoryResult(s.text, answersMap.category_search)
    if (r.hero.price <= 0) fail(`${s.text}: цена героя <= 0`)
    if (r.offers.length < 4) fail(`${s.text}: мало альтернатив (${r.offers.length})`)
    const script = buildScript({ type, query: s.text, answers: answersMap.category_search, hero: r.hero, totalFound: 48 })
    if (script.lanes.length !== 4) fail(`${s.text}: дорожек ${script.lanes.length}, ожидали 4`)
  }

  if (type === 'gift_search') {
    const r = buildGiftResult(s.text, answersMap.gift_search)
    if (r.directions.length < 2) fail(`${s.text}: мало направлений`)
    for (const d of r.directions) if (d.items.length < 2) fail(`${s.text}/${d.title}: мало идей`)
    const script = buildScript({ type, query: s.text, answers: answersMap.gift_search, hero: r.hero, totalFound: 40 })
    if (script.lanes.length !== 4) fail(`${s.text}: дорожек ${script.lanes.length}`)
  }

  if (type === 'service_search') {
    const r = buildServiceBids(s.text, answersMap.service_search)
    if (r.bids.length < 3) fail(`${s.text}: мало компаний`)
    if (!r.bids.some((b) => b.recommended)) fail(`${s.text}: нет рекомендации`)
    if (r.bids.some((b) => b.estimatedPrice <= 0)) fail(`${s.text}: есть цена <= 0`)
    const script = buildScript({ type, query: s.text, answers: answersMap.service_search, bids: r.bids, totalFound: 26 })
    if (script.lanes.length !== 4) fail(`${s.text}: дорожек ${script.lanes.length}`)
  }

  const questions = buildQuestions(type, s.text)
  if (type !== 'exact_product' && questions.length < 2) fail(`${s.text}: мало вопросов`)
  if (questions.some((q) => q.options.length < 2)) fail(`${s.text}: вопрос с <2 опциями`)

  // сумма находок по магазинам == total
  const scriptAny = buildScript({ type, query: s.text, answers: {}, totalFound: 50,
    hero: type === 'service_search' ? undefined : buildExactResult(s.text).hero,
    bids: type === 'service_search' ? buildServiceBids(s.text, {}).bids : undefined,
  })
  const shopLane = scriptAny.lanes.find((l) => l.id === 'shops')
  if (shopLane) {
    const sum = shopLane.events
      .map((e) => /(\d+)/.exec(e.text)?.[1])
      .filter(Boolean)
      .reduce((a, b) => a + Number(b), 0)
    const summaryLine = shopLane.events[shopLane.events.length - 1].text
    if (!summaryLine.includes('50')) fail(`${s.text}: итог по магазинам не равен 50 (сумма строк ${sum})`)
  }
}

console.log('Распознано по типам:', counts)

// несколько произвольных запросов — классификатор не должен падать
for (const q of ['', 'а', 'какие-то наушники', 'iphone 17', 'починить кран на кухне', 'что подарить коллеге', '???']) {
  const t = classifyQuery(q)
  console.log(`  classify("${q}") -> ${t}`)
  if (t === 'category_search') buildCategoryResult(q || 'пусто', {})
  if (t === 'exact_product') buildExactResult(q)
  if (t === 'gift_search') buildGiftResult(q, answersMap.gift_search)
  if (t === 'service_search') buildServiceBids(q, answersMap.service_search)
}

if (fails) {
  console.error(`\nПРОВАЛОВ: ${fails}`)
  process.exit(1)
} else {
  console.log('\nВсе проверки прошли ✓')
}
