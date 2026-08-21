import { Star } from 'lucide-react'
import { formatNumber } from '../lib/format'

export function Rating({ value, reviews, className = '' }: { value: number; reviews?: number; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <span className="inline-flex items-center gap-0.5" aria-label={`Рейтинг ${value} из 5`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`size-3.5 ${i < Math.round(value) ? 'fill-point text-point' : 'fill-line text-line'}`}
          />
        ))}
      </span>
      <span className="text-sm font-bold">{value.toFixed(1)}</span>
      {reviews !== undefined && <span className="text-xs text-muted">· {formatNumber(reviews)} отзывов</span>}
    </span>
  )
}
