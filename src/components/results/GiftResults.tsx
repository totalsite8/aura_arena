import { motion } from 'framer-motion'
import { BadgeCheck, Star, Zap } from 'lucide-react'
import { toast } from 'sonner'
import type { GiftPayload } from '../../types'
import { formatPrice } from '../../lib/format'
import { ProductImage } from '../ProductImage'
import { ProductHero } from './ProductHero'
import { Tip } from '../ui/primitives'

const SPRING = { type: 'spring', stiffness: 100, damping: 15 } as const

export function GiftResults({ payload }: { payload: GiftPayload }) {
  return (
    <div className="space-y-6">
      <ProductHero offer={payload.hero} chip="Выбор Aura среди идей" />

      <div>
        <h3 className="text-base font-extrabold tracking-tight sm:text-lg">
          Ещё {payload.directions.reduce((s, d) => s + d.items.length, 0)} идей в {payload.directions.length} направлениях
        </h3>
        <p className="mt-0.5 text-sm text-muted">
          Каждое направление проверено по отзывам и наличию — не просто «что-то по теме».
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {payload.directions.map((dir, di) => (
          <motion.section
            key={dir.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ ...SPRING, delay: di * 0.12 }}
            className={`glass-card flex flex-col gap-3 rounded-3xl p-4 ${
              dir.recommended ? 'ring-1 ring-accent/40 shadow-[var(--glow-accent)]' : ''
            }`}
            aria-label={`Направление: ${dir.title}`}
          >
            <div className="flex items-center gap-2">
              <h4 className="flex-1 text-sm font-extrabold">{dir.title}</h4>
              {dir.recommended && (
                <Tip label="Это направление лучше всего совпало с вашими ответами">
                  <span className="inline-flex cursor-help items-center gap-1 rounded-full bg-accent/12 px-2 py-0.5 text-[11px] font-bold text-accent">
                    <Star className="size-3 fill-accent" />
                    подходит лучше всего
                  </span>
                </Tip>
              )}
            </div>
            <p className="-mt-1.5 text-xs text-muted">{dir.blurb}</p>

            <ul className="flex flex-col gap-2">
              {dir.items.map((item, ii) => (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ ...SPRING, delay: di * 0.12 + ii * 0.08 }}
                >
                  <button
                    type="button"
                    onClick={() =>
                      toast('Карточка идеи (демо)', {
                        description: `«${item.title}» — ${formatPrice(item.price)} в «${item.store}». В полной версии откроется подробная карточка.`,
                      })
                    }
                    className="flex w-full items-center gap-3 rounded-2xl border border-line bg-card p-2 text-left transition-all hover:border-accent hover:shadow-[var(--glow-accent)]"
                  >
                    <ProductImage icon={item.icon} hue={item.hue} className="size-12 shrink-0 rounded-xl" iconClassName="size-6" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] font-bold">{item.title}</span>
                      <span className="block text-xs text-muted">
                        {item.rating.toFixed(1)} ★ · {item.store}
                      </span>
                    </span>
                    <span className="shrink-0 text-sm font-extrabold tabular-nums">{formatPrice(item.price)}</span>
                  </button>
                </motion.li>
              ))}
            </ul>

            <p className="mt-auto flex items-start gap-1.5 rounded-2xl bg-card-2/50 p-2.5 text-[11px] leading-snug text-muted">
              <BadgeCheck className="mt-0.5 size-3.5 shrink-0 text-good" />
              {dir.items[0].whySelected[0] ?? 'Проверено по свежим отзывам'}
            </p>
          </motion.section>
        ))}
      </div>

      <p className="flex items-center gap-2 text-xs text-faint">
        <Zap className="size-3.5 text-point" />
        Баллы начислятся на любую покупку из подборки — они бесплатны.
      </p>
    </div>
  )
}
