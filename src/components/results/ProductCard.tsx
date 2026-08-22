import { motion } from 'framer-motion'
import { Store, TriangleAlert, Zap } from 'lucide-react'
import { toast } from 'sonner'
import type { ProductOffer } from '../../types'
import { formatPrice } from '../../lib/format'
import { ProductImage } from '../ProductImage'
import { Rating } from '../Rating'
import { Tip } from '../ui/primitives'

const SPRING = { type: 'spring', stiffness: 100, damping: 15 } as const

export function ProductCard({ offer, index }: { offer: ProductOffer; index: number }) {
  const belowAvg = offer.price < offer.marketAverage
  return (
    <motion.article
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ ...SPRING, delay: index * 0.1 }}
      className="glass-card group flex flex-col overflow-hidden rounded-3xl transition-shadow hover:shadow-[var(--shadow-lift)]"
    >
      <ProductImage title={offer.title} icon={offer.icon} hue={offer.hue} className="h-36 sm:h-40" iconClassName="size-12 sm:size-14" />
      <div className="flex flex-1 flex-col gap-2.5 p-4">
        <Rating value={offer.rating} reviews={offer.reviewsCount} />
        <h3 className="line-clamp-2 text-sm font-bold leading-snug">{offer.title}</h3>

        <div className="flex flex-wrap items-center gap-1.5">
          {belowAvg && (
            <Tip label={`Средняя цена по магазинам сейчас около ${formatPrice(offer.marketAverage)}`}>
              <span className="chip cursor-help !text-good">ниже средней</span>
            </Tip>
          )}
          {offer.risk && (
            <Tip label={offer.risk}>
              <span className="chip cursor-help !text-warn">
                <TriangleAlert className="size-3" />
                есть риск
              </span>
            </Tip>
          )}
          {offer.points > 0 && !offer.risk && (
            <span className="chip !text-point">+{offer.points.toLocaleString('ru-RU')} баллов</span>
          )}
        </div>

        <div className="mt-auto flex items-end justify-between gap-2 pt-1">
          <div>
            <p className="text-lg font-extrabold tracking-tight">{formatPrice(offer.price)}</p>
            <p className="inline-flex items-center gap-1 text-[11px] text-muted">
              <Store className="size-3" /> {offer.store} · {offer.delivery}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() =>
            toast('Переход к покупке (демо)', {
              description: `«${offer.store}» — в полной версии откроется страница товара.`,
            })
          }
          className="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-line bg-card-2/60 py-2.5 text-sm font-bold transition-colors hover:bg-accent hover:text-white"
        >
          <Zap className="size-4" />
          Купить
        </button>
      </div>
    </motion.article>
  )
}
