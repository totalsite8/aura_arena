import { useMemo } from 'react'
import { DOUBT_PHRASES } from '../data/suggestions'
import { makeRng } from '../lib/random'

/**
 * Мобильная версия «облака сомнений» — аккуратная бегущая строка
 * в потоке страницы: не накрывает ни текст, ни кнопки, ни сферу.
 */
export function DoubtStrip() {
  const items = useMemo(() => {
    const rng = makeRng('strip' + Math.floor(Math.random() * 1e9))
    return rng.take(DOUBT_PHRASES, 12)
  }, [])

  return (
    <div aria-hidden className="w-full">
      <p className="text-[11px] font-bold uppercase tracking-wider text-faint">
        Знакомые мысли? Просто напишите запрос — я разберусь
      </p>
      <div
        className="relative mt-2 overflow-hidden py-1"
        style={{
          maskImage: 'linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)',
          WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)',
        }}
      >
        <div className="marquee-track flex w-max gap-2">
          {[...items, ...items].map((p, i) => (
            <span
              key={i}
              className="glass whitespace-nowrap rounded-full px-3 py-1.5 text-[11px] font-medium italic text-muted"
            >
              {p}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
