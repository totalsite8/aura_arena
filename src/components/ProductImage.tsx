import { useState } from 'react'
import { DynIcon } from './Icon'
import { productImage } from '../lib/productImage'

/**
 * Фотография товара.
 *
 * Товар показывается ЦЕЛИКОМ (object-contain) на светлой фирменной
 * подложке — так ничего не обрезается ни на телефоне, ни на десктопе,
 * а разнобой из фонов у фото из сети превращается в аккуратный каталог.
 * Если фото нет или оно не загрузилось — градиентная плитка с иконкой.
 */
export function ProductImage({
  title,
  icon,
  hue,
  className = '',
  iconClassName = 'size-16 sm:size-20',
}: {
  title?: string
  icon: string
  hue: number
  className?: string
  iconClassName?: string
}) {
  const src = title ? productImage(title) : undefined
  const [attempt, setAttempt] = useState(0)
  const candidates = src ? [src, src.replace(/\.jpg$/, '.png'), src.replace(/\.jpg$/, '.webp')] : []
  const showPhoto = src && attempt < candidates.length
  const currentSrc = candidates[attempt]

  if (showPhoto) {
    return (
      <div
        className={`relative grid place-items-center overflow-hidden bg-[linear-gradient(135deg,#f7f7fc_0%,#eef1fa_55%,#e9faf6_100%)] p-3 dark:bg-[linear-gradient(135deg,#f7f7fc_0%,#eceef8_100%)] ${className}`}
      >
        {/* лёгкое фирменное свечение по углам */}
        <div
          className="pointer-events-none absolute -left-6 -top-6 size-24 rounded-full opacity-50 blur-2xl"
          style={{ background: 'radial-gradient(circle, rgba(109,90,255,.28), transparent 70%)' }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-6 -right-6 size-24 rounded-full opacity-50 blur-2xl"
          style={{ background: 'radial-gradient(circle, rgba(47,224,196,.25), transparent 70%)' }}
          aria-hidden
        />
        <img
          src={currentSrc}
          alt={title}
          loading="lazy"
          onError={() => setAttempt((a) => a + 1)}
          className="relative h-full w-full object-contain [filter:drop-shadow(0_10px_18px_rgba(23,12,92,0.18))]"
        />
      </div>
    )
  }

  return (
    <div
      className={`relative grid place-items-center overflow-hidden ${className}`}
      style={{
        background: `radial-gradient(120% 120% at 20% 15%, hsl(${hue} 90% 88% / .9) 0%, hsl(${(hue + 40) % 360} 80% 78% / .55) 38%, hsl(${(hue + 90) % 360} 75% 62% / .45) 100%)`,
      }}
    >
      <div
        className="absolute -right-8 -top-8 size-36 rounded-full opacity-40 blur-2xl"
        style={{ background: `hsl(${(hue + 140) % 360} 85% 70%)` }}
      />
      <div className="absolute inset-0 dark:bg-black/35" />
      <DynIcon
        name={icon}
        className={`relative text-white drop-shadow-[0_10px_24px_rgba(23,12,92,0.45)] ${iconClassName}`}
        strokeWidth={1.4}
      />
    </div>
  )
}
