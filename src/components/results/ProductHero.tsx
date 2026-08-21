import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BadgeCheck, ChevronDown, CircleHelp, ShieldCheck, Store, Truck, Zap } from 'lucide-react'
import { toast } from 'sonner'
import type { ProductOffer } from '../../types'
import { formatPrice } from '../../lib/format'
import { ProductImage } from '../ProductImage'
import { Rating } from '../Rating'
import { GhostButton, PrimaryButton, Tip } from '../ui/primitives'

const SPRING = { type: 'spring', stiffness: 100, damping: 15 } as const

function useCountUp(target: number, startDelay = 450): number {
  const [val, setVal] = useState(0)
  useEffect(() => {
    const t0 = performance.now() + startDelay
    let raf = 0
    const step = (t: number) => {
      const p = Math.min(1, Math.max(0, (t - t0) / 700))
      const eased = 1 - Math.pow(1 - p, 3)
      setVal(Math.round(target * eased))
      if (p < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [target, startDelay])
  return val
}

function buy(withPoints: boolean, points: number) {
  if (withPoints) {
    toast.success('Переход к покупке (демо)', {
      description: `В полной версии здесь откроется страница продавца. ${points.toLocaleString('ru-RU')} баллов начислятся после доставки.`,
    })
  } else {
    toast('Переход к покупке (демо)', {
      description: 'Без баллов — просто переход к продавцу. В полной версии откроется магазин.',
    })
  }
}

export function ProductHero({ offer, chip = 'Выбор Aura' }: { offer: ProductOffer; chip?: string }) {
  const [whyOpen, setWhyOpen] = useState(false)
  const cash = Math.round(offer.points / 10)
  const cashShown = useCountUp(cash)
  const effective = useCountUp(offer.price - cash, 550)

  return (
    <motion.article
      initial={{ opacity: 0, y: 26, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={SPRING}
      className="glass-card glass-hairline relative overflow-hidden rounded-[28px]"
      aria-label={`${chip}: ${offer.title}`}
    >
      <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
        <ProductImage
          icon={offer.icon}
          hue={offer.hue}
          className="min-h-56 lg:min-h-full"
          iconClassName="size-24 lg:size-32"
        />

        <div className="flex flex-col gap-4 p-5 sm:p-7">
          {/* бейджи */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="badge-pulse inline-flex items-center gap-1.5 rounded-full bg-accent px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-wide text-white">
              <BadgeCheck className="size-4" strokeWidth={2.4} />
              {chip}
            </span>
            {offer.points > 0 && (
              <Tip label="Баллы Aura — бесплатный бонус за покупки через сервис. 10 баллов ≈ 1 ₽ выгоды.">
                <span className="inline-flex cursor-help items-center gap-1.5 rounded-full bg-point/15 px-3.5 py-1.5 text-xs font-extrabold text-point">
                  <Zap className="size-4 fill-point" />
                  +{offer.points.toLocaleString('ru-RU')} баллов
                </span>
              </Tip>
            )}
          </div>

          <div>
            {offer.brand && <p className="text-xs font-bold uppercase tracking-wider text-faint">{offer.brand}</p>}
            <h2 className="mt-0.5 text-xl font-extrabold tracking-tight sm:text-2xl">{offer.title}</h2>
            <Rating value={offer.rating} reviews={offer.reviewsCount} className="mt-1.5" />
          </div>

          {/* характеристики */}
          <div className="flex flex-wrap gap-1.5">
            {offer.features.map((f) => (
              <span key={f} className="chip">
                {f}
              </span>
            ))}
          </div>

          {/* цена и мета */}
          <div className="flex flex-wrap items-end gap-x-4 gap-y-2">
            <div>
              <p className="text-3xl font-extrabold tracking-tight sm:text-4xl">{formatPrice(offer.price)}</p>
              {offer.oldPrice && (
                <p className="text-sm font-semibold text-faint line-through">{formatPrice(offer.oldPrice)}</p>
              )}
            </div>
            <div className="flex flex-col gap-1 pb-1 text-xs text-muted">
              <span className="inline-flex items-center gap-1.5">
                <Store className="size-3.5" /> {offer.store}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Truck className="size-3.5" /> Доставка: {offer.delivery}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="size-3.5" /> {offer.warranty}
              </span>
            </div>
          </div>

          {/* честный расчёт */}
          {offer.points > 0 && (
            <div className="rounded-3xl border border-line bg-card-2/50 p-4">
              <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted">
                Честный расчёт
                <Tip label="Мы честно показываем, сколько вы заплатите с учётом баллов. Баллы начисляются после покупки и доставки.">
                  <CircleHelp className="size-3.5 cursor-help text-faint" />
                </Tip>
              </p>
              <div className="mt-2 space-y-1 text-sm font-semibold">
                <div className="flex justify-between gap-4">
                  <span className="text-muted">Цена в «{offer.store}»</span>
                  <span className="tabular-nums">{formatPrice(offer.price)}</span>
                </div>
                <div className="flex justify-between gap-4 text-good">
                  <span>Баллы Aura</span>
                  <span className="tabular-nums">−{cashShown.toLocaleString('ru-RU')} ₽</span>
                </div>
                <div className="mt-1 flex justify-between gap-4 border-t border-line pt-2 text-base font-extrabold">
                  <span>Реальная цена</span>
                  <span className="tabular-nums text-accent">{formatPrice(effective)}</span>
                </div>
              </div>
            </div>
          )}

          {/* почему выбрали */}
          <div>
            <button
              type="button"
              onClick={() => setWhyOpen((v) => !v)}
              aria-expanded={whyOpen}
              className="flex w-full items-center gap-2 text-left text-sm font-bold text-ink"
            >
              Почему мы это выбрали
              <motion.span animate={{ rotate: whyOpen ? 180 : 0 }} transition={SPRING}>
                <ChevronDown className="size-4 text-muted" />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              <motion.ul
                initial={false}
                animate={{ height: whyOpen ? 'auto' : 44 }}
                transition={SPRING}
                className="mt-2 space-y-1.5 overflow-hidden"
              >
                {(whyOpen ? offer.whySelected : offer.whySelected.slice(0, 2)).map((w) => (
                  <li key={w} className="flex items-start gap-2 text-sm text-muted">
                    <span className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full bg-good/15 text-good">
                      <BadgeCheck className="size-3" strokeWidth={3} />
                    </span>
                    {w}
                  </li>
                ))}
              </motion.ul>
            </AnimatePresence>
          </div>

          {/* кнопки */}
          <div className="mt-auto flex flex-wrap gap-2.5 pt-1">
            <PrimaryButton onClick={() => buy(true, offer.points)} className="flex-1 sm:flex-initial">
              <Zap className="size-4" />
              Купить с баллами
            </PrimaryButton>
            <GhostButton onClick={() => buy(false, offer.points)}>Купить без баллов</GhostButton>
          </div>
        </div>
      </div>
    </motion.article>
  )
}
