import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useSearchParams } from 'react-router'
import { CircleHelp, ListChecks, RefreshCcw } from 'lucide-react'
import { useFlow } from '../../stores/flow'
import { SearchBar } from '../../components/SearchBar'
import { ProcessPanel } from '../../components/ProcessPanel'
import { QuestionFlow } from '../../components/QuestionFlow'
import { Expandable, PrimaryButton } from '../../components/ui/primitives'
import { ProductHero } from '../../components/results/ProductHero'
import { ProductCard } from '../../components/results/ProductCard'
import { Dashboards } from '../../components/results/Dashboards'
import { GiftResults } from '../../components/results/GiftResults'
import { ServiceResults } from '../../components/results/ServiceResults'
import { QUICK_PICKS, TYPE_LABEL } from '../../data/suggestions'
import { plural } from '../../lib/format'
import type { QueryType } from '../../types'

const SPRING = { type: 'spring', stiffness: 100, damping: 15 } as const

function UnknownQuery({ query }: { query: string }) {
  const navigate = useNavigate()
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={SPRING}
      className="glass-card mx-auto w-full max-w-xl rounded-[28px] p-6 text-center sm:p-8"
    >
      <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-accent/12 text-accent">
        <CircleHelp className="size-6" />
      </span>
      <h2 className="mt-4 text-xl font-extrabold tracking-tight">Я поняла «{query}» не до конца</h2>
      <p className="mt-2 text-sm text-muted">
        Уточните чуть подробнее — или выберите готовый запрос. Например, так:
      </p>
      <div className="mt-5 flex flex-wrap justify-center gap-2">
        {QUICK_PICKS.map((p) => (
          <button
            key={p.text}
            type="button"
            onClick={() => navigate(`/search?q=${encodeURIComponent(p.text)}`)}
            className="chip transition-all hover:!border-accent hover:!text-accent"
          >
            {p.text}
          </button>
        ))}
      </div>
    </motion.section>
  )
}

function ResultsView() {
  const payload = useFlow((s) => s.payload)
  const qtype = useFlow((s) => s.qtype)
  const totalFound = useFlow((s) => s.totalFound)
  const finishedSeconds = useFlow((s) => s.finishedSeconds)
  const answers = useFlow((s) => s.answers)

  if (!payload) return null

  const answerChips = Object.values(answers)

  return (
    <div className="space-y-6">
      {/* сводка */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={SPRING} className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          {qtype && (
            <span className="chip !bg-accent/10 !text-accent">{qtype ? TYPE_LABEL[qtype as QueryType] : ''}</span>
          )}
          {answerChips.map((a) => (
            <span key={a} className="chip">
              {a}
            </span>
          ))}
        </div>
        <p className="text-sm text-muted">
          Нашла <b className="text-ink">{totalFound}</b>{' '}
          {payload.kind === 'service'
            ? plural(totalFound, ['компанию', 'компании', 'компаний'])
            : plural(totalFound, ['предложение', 'предложения', 'предложений'])}{' '}
          · обновлено только что · заняло {finishedSeconds} с
        </p>
      </motion.div>

      {/* результат */}
      {payload.kind === 'product' && (
        <>
          <ProductHero offer={payload.hero} />
          {payload.offers.length > 0 && (
            <section aria-label="Другие варианты">
              <h3 className="mb-3 text-base font-extrabold tracking-tight sm:text-lg">
                Другие варианты
                <span className="ml-2 text-sm font-semibold text-muted">честно, без пряток</span>
              </h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {payload.offers.slice(0, 4).map((o, i) => (
                  <ProductCard key={o.id} offer={o} index={i} />
                ))}
              </div>
            </section>
          )}
          <Dashboards hero={payload.hero} offers={payload.offers} />
        </>
      )}

      {payload.kind === 'gift' && <GiftResults payload={payload} />}
      {payload.kind === 'service' && <ServiceResults payload={payload} query={useFlow.getState().query} />}

      {/* что делала — раскрывашка */}
      <Expandable
        icon={<ListChecks className="size-5" />}
        title="Что я делала во время поиска"
        sub={`Полный хронологический лог — можно свернуть`}
      >
        <ProcessPanel frozen />
      </Expandable>

      <p className="text-xs leading-relaxed text-faint">
        Демонстрационный режим: магазины, цены и компании — примеры, чтобы показать, как будет работать поиск.
        Рекомендации Aura не являются офертой.
      </p>
    </div>
  )
}

export function SearchPage() {
  const [params] = useSearchParams()
  const q = (params.get('q') ?? '').trim()
  const fast = params.get('fast') === '1'
  const navigate = useNavigate()

  const phase = useFlow((s) => s.phase)
  const query = useFlow((s) => s.query)
  const ensure = useFlow((s) => s.ensure)
  const reset = useFlow((s) => s.reset)

  useEffect(() => {
    if (q) ensure(q, fast)
  }, [q, fast, ensure])

  const shownQuery = query || q

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-20 pt-6">
      {/* строка поиска (можно переформулировать) */}
      <div className="mx-auto max-w-2xl">
        <SearchBar size="sm" initial={q} onSubmit={(text) => navigate(`/search?q=${encodeURIComponent(text)}`)} />
      </div>

      <div className="mt-6 flex items-end justify-between gap-3">
        <h1 className="min-w-0 flex-1 truncate text-lg font-extrabold tracking-tight sm:text-xl">
          {shownQuery}
        </h1>
        {(phase === 'results' || phase === 'unknown') && (
          <button
            type="button"
            onClick={() => {
              reset()
              navigate('/')
            }}
            className="inline-flex shrink-0 items-center gap-1.5 text-xs font-bold text-muted transition-colors hover:text-accent"
          >
            <RefreshCcw className="size-3.5" />
            Новый поиск
          </button>
        )}
      </div>

      <div className="mt-5">
        {phase === 'questions' && <QuestionFlow />}
        {phase === 'processing' && <ProcessPanel />}
        {phase === 'results' && <ResultsView />}
        {phase === 'unknown' && <UnknownQuery query={shownQuery} />}
        {phase === 'idle' && (
          <div className="mx-auto max-w-xl py-16 text-center text-sm text-muted">
            <PrimaryButton onClick={() => navigate('/')}>Вернуться к поиску</PrimaryButton>
          </div>
        )}
      </div>
    </div>
  )
}
