/** Прогон движка поиска: 4 сценария от запроса до результатов. Запуск: npx tsx scripts/flow-check.ts */
import { useFlow } from '../src/stores/flow'

declare const process: any

async function run(query: string, answerAll = false) {
  const api = useFlow.getState()
  api.start(query, true /* fast */)
  let guard = 0
  while (useFlow.getState().phase !== 'results' && guard++ < 600) {
    const st = useFlow.getState()
    if (st.phase === 'questions' && answerAll) {
      const q = st.questions[st.qIndex]
      st.answer(q.id, q.options[0])
    }
    await new Promise((r) => setTimeout(r, 30))
  }
  const st = useFlow.getState()
  if (st.phase !== 'results' || !st.payload) {
    throw new Error(`"${query}": не дошёл до results (phase=${st.phase})`)
  }
  const laneDoneOk = st.lanes.every((l) => st.doneLaneIds.includes(l.id))
  const payload = st.payload
  let detail = ''
  if (payload.kind === 'product') detail = `герой: «${payload.hero.title.slice(0, 30)}…» ${payload.hero.price}₽, ещё ${payload.offers.length}`
  if (payload.kind === 'gift') detail = `направлений: ${payload.directions.length}, идей: ${payload.directions.reduce((s, d) => s + d.items.length, 0)}`
  if (payload.kind === 'service') detail = `компаний: ${payload.bids.length}, рекомендация: «${payload.bids.find((b) => b.recommended)?.companyName}»`
  console.log(`OK  «${query}» — ${st.payload.kind}, событий: ${st.events.length}, дорожки завершены: ${laneDoneOk}, ${detail}`)
  if (!laneDoneOk) throw new Error(`"${query}": не все дорожки завершились`)
}

;(async () => {
  await run('Honor Magic 7 Pro') // точный товар — без вопросов
  await run('Беспроводные наушники до 3 000₽', true)
  await run('Подарок парню на 23 февраля', true)
  await run('Остеклить балкон', true)
  await run('асфальт подснежники ??? непонятно', true) // странный запрос — не должен падать
  console.log('\nВсе сценарии прошли путь до результатов ✓')
})().catch((e) => {
  console.error(e)
  process.exit(1)
})
