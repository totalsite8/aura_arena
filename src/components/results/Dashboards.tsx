import { BadgeCheck, Scale, ShieldCheck, Table2, TrendingDown, TriangleAlert } from 'lucide-react'
import type { ProductOffer } from '../../types'
import { formatPrice, plural, verdictByDelta } from '../../lib/format'
import { Expandable } from '../ui/primitives'

/* ----------------------- SVG-спарклайн динамики цены ----------------------- */

function Sparkline({ offer }: { offer: ProductOffer }) {
  const data = offer.priceHistory
  const w = 560
  const h = 140
  const pad = 12
  const prices = data.map((d) => d.p)
  const min = Math.min(...prices)
  const max = Math.max(...prices)
  const range = Math.max(1, max - min)

  const pts = data.map((d, i) => {
    const x = pad + (i / (data.length - 1)) * (w - pad * 2)
    const y = pad + (1 - (d.p - min) / range) * (h - pad * 2 - 18)
    return { x, y, ...d }
  })

  const path = pts
    .map((p, i) => {
      if (i === 0) return `M ${p.x} ${p.y}`
      const prev = pts[i - 1]
      const cx = (prev.x + p.x) / 2
      return `C ${cx} ${prev.y} ${cx} ${p.y} ${p.x} ${p.y}`
    })
    .join(' ')

  const minPt = pts[prices.indexOf(min)]
  const lastPt = pts[pts.length - 1]
  const id = `grad-${offer.id}`

  return (
    <div>
      <svg viewBox={`0 0 ${w} ${h + 18}`} className="w-full" role="img" aria-label="График цены за 90 дней">
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.28" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={`${path} L ${lastPt.x} ${h} L ${pts[0].x} ${h} Z`} fill={`url(#${id})`} />
        <path d={path} fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx={minPt.x} cy={minPt.y} r="4" fill="var(--good)" />
        <text x={minPt.x} y={minPt.y + 17} textAnchor="middle" fontSize="11" fill="var(--good)" fontWeight="700">
          дно: {minPt.p.toLocaleString('ru-RU')} ₽
        </text>
        <circle cx={lastPt.x} cy={lastPt.y} r="4.5" fill="var(--accent)" stroke="var(--card)" strokeWidth="2" />
        <text x={lastPt.x} y={lastPt.y - 9} textAnchor="end" fontSize="11" fill="var(--ink)" fontWeight="700">
          сегодня: {lastPt.p.toLocaleString('ru-RU')} ₽
        </text>
        <text x={pad} y={h + 14} fontSize="10" fill="var(--faint)">
          90 дней назад
        </text>
        <text x={w - pad} y={h + 14} textAnchor="end" fontSize="10" fill="var(--faint)">
          сегодня
        </text>
      </svg>
      <div className="mt-2 flex flex-wrap gap-2 text-xs">
        {(() => {
          const delta = Math.round(((offer.price - offer.marketAverage) / offer.marketAverage) * 100)
          const v = verdictByDelta(delta)
          return (
            <span className={`chip ${v.good ? '!text-good' : '!text-warn'}`}>
              {v.good ? <TrendingDown className="size-3" /> : <TriangleAlert className="size-3" />}
              {v.text}
            </span>
          )
        })()}
        <span className="chip">проверено {offer.priceHistory.length} {plural(offer.priceHistory.length, ['срез', 'среза', 'срезов'])} цены</span>
      </div>
    </div>
  )
}

function MarketBar({ offer }: { offer: ProductOffer }) {
  const max = Math.max(offer.price, offer.marketAverage)
  const delta = Math.round(((offer.price - offer.marketAverage) / offer.marketAverage) * 100)
  const v = verdictByDelta(delta)
  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-baseline justify-between gap-3 text-sm">
          <span className="font-semibold text-muted">Средняя цена по магазинам</span>
          <span className="font-bold tabular-nums">{formatPrice(offer.marketAverage)}</span>
        </div>
        <div className="mt-1.5 h-3 overflow-hidden rounded-full bg-card-2">
          <div className="h-full rounded-full bg-muted/35" style={{ width: `${(offer.marketAverage / max) * 100}%` }} />
        </div>
      </div>
      <div>
        <div className="flex items-baseline justify-between gap-3 text-sm">
          <span className="font-semibold">Найденная цена</span>
          <span className="font-extrabold tabular-nums text-accent">{formatPrice(offer.price)}</span>
        </div>
        <div className="mt-1.5 h-3 overflow-hidden rounded-full bg-card-2">
          <div
            className="shimmer-line h-full rounded-full"
            style={{ width: `${(offer.price / max) * 100}%` }}
          />
        </div>
      </div>
      <p className={`rounded-2xl border px-3.5 py-2.5 text-sm font-semibold ${v.good ? 'border-good/25 bg-good/10 text-good' : 'border-warn/25 bg-warn/10 text-warn'}`}>
        {v.text}
        {v.good && offer.price === offer.minPrice90 && '. Сейчас — исторический минимум'}
        {v.good && offer.price !== offer.minPrice90 && `, до минимума за 90 дней — ${formatPrice(offer.price - offer.minPrice90)}`}
      </p>
    </div>
  )
}

function Reliability({ offer }: { offer: ProductOffer }) {
  const okCount = offer.reliabilityChecks.filter((c) => c.ok).length
  return (
    <div>
      <ul className="space-y-2">
        {offer.reliabilityChecks.map((c) => (
          <li key={c.label} className="flex items-start gap-2.5 text-sm">
            <span
              className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-full ${
                c.ok ? 'bg-good/15 text-good' : 'bg-bad/15 text-bad'
              }`}
            >
              {c.ok ? <BadgeCheck className="size-3" strokeWidth={3} /> : <TriangleAlert className="size-3" strokeWidth={2.6} />}
            </span>
            <span className="min-w-0">
              <span className="font-semibold">{c.label}</span>
              {c.note && <span className="text-muted"> — {c.note}</span>}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-sm font-bold">
        Итог:{' '}
        <span className={okCount === offer.reliabilityChecks.length ? 'text-good' : 'text-warn'}>
          {okCount === offer.reliabilityChecks.length ? 'риск низкий, можно брать' : `${okCount} из ${offer.reliabilityChecks.length} проверок пройдено`}
        </span>
      </p>
    </div>
  )
}

function CompareTable({ hero, offers }: { hero: ProductOffer; offers: ProductOffer[] }) {
  const all = [hero, ...offers]
  const rows = [
    {
      label: 'Цена',
      render: (o: ProductOffer) => <span className="tabular-nums">{formatPrice(o.price)}</span>,
    },
    {
      label: 'Реальная цена с баллами',
      render: (o: ProductOffer) => (
        <span className="tabular-nums">{o.points ? formatPrice(o.price - Math.round(o.points / 10)) : formatPrice(o.price)}</span>
      ),
    },
    { label: 'Рейтинг продавца', render: (o: ProductOffer) => o.rating.toFixed(1) },
    { label: 'Доставка', render: (o: ProductOffer) => o.delivery },
    { label: 'Гарантия', render: (o: ProductOffer) => o.warranty.replace('Официальная, ', '') },
    {
      label: 'Баллы',
      render: (o: ProductOffer) => (o.points ? `+${o.points.toLocaleString('ru-RU')}` : '—'),
    },
  ]
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px] text-sm">
        <thead>
          <tr className="text-left text-xs uppercase tracking-wider text-faint">
            <th className="py-2 pr-3 font-bold">Критерий</th>
            <th className="py-2 pr-3 font-bold">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-2.5 py-0.5 text-[11px] font-extrabold text-white normal-case">
                Выбор Aura · {hero.store}
              </span>
            </th>
            {offers.map((o) => (
              <th key={o.id} className="max-w-24 truncate py-2 pr-3 font-bold normal-case tracking-normal">
                {o.store}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            // подсветка лучшего значения в строке (только для цены/рейтинга)
            return (
              <tr key={row.label} className="border-t border-line">
                <td className="py-2.5 pr-3 font-semibold text-muted">{row.label}</td>
                <td className="py-2.5 pr-3 font-bold text-ink">{row.render(hero)}</td>
                {offers.map((o) => (
                  <td key={o.id} className="py-2.5 pr-3 text-muted">
                    {row.render(o)}
                  </td>
                ))}
              </tr>
            )
          })}
          <tr className="border-t border-line text-xs text-faint">
            <td className="py-2.5 pr-3" colSpan={all.length}>
              Сравнение по данным на сегодняшний день
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export function Dashboards({ hero, offers }: { hero: ProductOffer; offers: ProductOffer[] }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <Expandable
        icon={<TrendingDown className="size-5" />}
        title="Динамика цены"
        sub={`За 90 дней: от ${hero.minPrice90.toLocaleString('ru-RU')} ₽ до сегодняшних ${hero.price.toLocaleString('ru-RU')} ₽`}
      >
        <Sparkline offer={hero} />
      </Expandable>

      <Expandable
        icon={<Scale className="size-5" />}
        title="Средняя цена по рынку"
        sub={`Средняя по магазинам — ${formatPrice(hero.marketAverage)}`}
      >
        <MarketBar offer={hero} />
      </Expandable>

      <Expandable
        icon={<ShieldCheck className="size-5" />}
        title="Проверка надёжности"
        sub="Продавец, гарантия, происхождение"
      >
        <Reliability offer={hero} />
      </Expandable>

      <Expandable
        icon={<Table2 className="size-5" />}
        title="Полное сравнение"
        sub={`Все ${plural(offers.length + 1, ['вариант', 'варианта', 'вариантов'])} в одной таблице`}
      >
        <CompareTable hero={hero} offers={offers} />
      </Expandable>
    </div>
  )
}
